import { NextResponse } from 'next/server'
import { getDodoClient } from '../../../lib/dodo'
import { recordBillingEvent } from '../../../lib/leadsSupabase'
import { sendCapiEvent, deriveEventId } from '../../../lib/metaCapi'

/**
 * Dodo Payments webhook receiver.
 *
 * Dodo follows the Standard Webhooks spec: every delivery is signed and carries
 * `webhook-id` / `webhook-signature` / `webhook-timestamp`. We hand the RAW body
 * plus those headers to the SDK, which verifies the HMAC and rejects replays —
 * an unverified body is never trusted, since anyone can POST to this URL.
 *
 * Subscription lifecycle we care about (per Dodo's docs):
 *   subscription.active   — mandate created, customer is live
 *   subscription.renewed  — a billing cycle was charged
 *   subscription.on_hold  — a renewal payment failed
 *   subscription.failed   — initial mandate failed (terminal)
 *   subscription.updated  — any field changed (plan/seat count)
 *
 * Verified events are folded onto the customer's `all_leads` row in the shared
 * PROXe/Beacon Supabase, so one record carries the whole story: where the lead
 * came from, what they talked about, and what they're paying.
 *
 * Always answers 2xx once a delivery is verified and handled. A non-2xx makes
 * Dodo retry, so we only fail the request when the signature is bad (never
 * retry-able) or the body is unreadable.
 */

// Raw body access + the Node crypto the SDK verifies with.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Subscription/payment events we act on. Anything else is acknowledged and ignored. */
const HANDLED = new Set([
  'subscription.active',
  'subscription.renewed',
  'subscription.on_hold',
  'subscription.failed',
  'subscription.updated',
  'subscription.cancelled',
  'subscription.expired',
  'payment.succeeded',
  'payment.failed',
])

export async function POST(request: Request) {
  const client = getDodoClient()
  if (!client) {
    console.error('[webhooks/dodo] received a delivery but Dodo is not configured')
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 500 })
  }
  if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    // Without the secret we cannot prove the sender is Dodo — refuse rather
    // than process an unauthenticated payload.
    console.error('[webhooks/dodo] DODO_PAYMENTS_WEBHOOK_KEY not set — refusing unverified delivery')
    return NextResponse.json({ ok: false, reason: 'webhook_key_missing' }, { status: 500 })
  }

  // MUST be the raw text — parsing to JSON first would break the signature.
  let raw: string
  try {
    raw = await request.text()
  } catch {
    return NextResponse.json({ ok: false, reason: 'unreadable_body' }, { status: 400 })
  }

  const webhookId = request.headers.get('webhook-id') ?? ''
  let event: { type?: string; data?: Record<string, any>; timestamp?: string }
  try {
    event = client.webhooks.unwrap(raw, {
      headers: {
        'webhook-id': webhookId,
        'webhook-signature': request.headers.get('webhook-signature') ?? '',
        'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
      },
    }) as typeof event
  } catch (err) {
    // Bad signature or stale timestamp: reject. Retrying won't help, and a 4xx
    // tells Dodo to stop.
    console.error('[webhooks/dodo] signature verification failed', err)
    return NextResponse.json({ ok: false, reason: 'invalid_signature' }, { status: 401 })
  }

  const type = event.type ?? 'unknown'
  if (!HANDLED.has(type)) {
    // Acknowledge so Dodo stops retrying an event we deliberately ignore.
    return NextResponse.json({ ok: true, ignored: type })
  }

  const data = event.data ?? {}
  const customer = (data.customer ?? {}) as Record<string, any>
  const metadata = (data.metadata ?? {}) as Record<string, string>

  try {
    const result = await recordBillingEvent({
      eventType: type,
      webhookId,
      email: customer.email ?? null,
      name: customer.name ?? null,
      subscriptionId: data.subscription_id ?? null,
      paymentId: data.payment_id ?? null,
      productId: data.product_id ?? null,
      status: data.status ?? null,
      currency: data.currency ?? null,
      // Dodo sends minor units (paise/cents).
      amountMinor:
        typeof data.total_amount === 'number'
          ? data.total_amount
          : typeof data.recurring_pre_tax_amount === 'number'
            ? data.recurring_pre_tax_amount
            : null,
      nextBillingDate: data.next_billing_date ?? null,
      market: metadata.market ?? null,
      seats: metadata.seats ? Number(metadata.seats) : null,
      occurredAt: event.timestamp ?? null,
    })

    if (!result.ok) {
      // Genuine event we could not persist. Loud, because a real payment just
      // happened and nothing in our DB reflects it. Still 200: retries won't
      // fix an unconfigured or rejecting database.
      console.error('[webhooks/dodo] verified event NOT recorded', {
        type,
        webhookId,
        reason: result.reason,
      })
      return NextResponse.json({ ok: true, recorded: false, reason: result.reason, type })
    }
  } catch (err) {
    // The event WAS genuine — log it and still 200 so Dodo doesn't hammer us.
    // The payment is real regardless of whether our DB write landed.
    console.error('[webhooks/dodo] handled event but failed to record it', { type, webhookId, err })
    return NextResponse.json({ ok: true, recorded: false, reason: 'exception', type })
  }

  // Purchase to Meta, server-side. This is the ONLY place a payment is
  // confirmed by the payment provider rather than inferred from a browser
  // landing on /thank-you — a buyer who closes the tab before redirect still
  // counts here, and a bot hitting /thank-you never does.
  //
  // The event id is derived from the payment/subscription id, so Dodo's
  // retries produce the SAME id and Meta deduplicates instead of counting the
  // purchase twice. It also matches nothing the browser sends, deliberately:
  // the browser's checkout_complete is a page view, this is the money.
  if (type === 'subscription.active' || type === 'subscription.renewed') {
    const amountMinor =
      typeof data.total_amount === 'number'
        ? data.total_amount
        : typeof data.recurring_pre_tax_amount === 'number'
          ? data.recurring_pre_tax_amount
          : null
    void sendCapiEvent({
      eventName: 'Purchase',
      eventId: deriveEventId('purchase', String(data.payment_id ?? data.subscription_id ?? webhookId)),
      user: { email: customer.email ?? null, firstName: (customer.name ?? '').split(' ')[0] || null },
      // Dodo reports minor units (paise/cents); Meta wants major.
      value: amountMinor !== null ? amountMinor / 100 : undefined,
      currency: data.currency ?? undefined,
      custom: { event_type: type, market: metadata.market ?? undefined },
    })
  }

  return NextResponse.json({ ok: true, recorded: true, type })
}
