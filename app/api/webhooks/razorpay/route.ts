import { NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  webhookSecretConfigured,
  razorpayConfigured,
  fetchInvoice,
  fetchSubscription,
  notesOf,
  isoFromUnix,
  type RazorpaySubscription,
  type RazorpayPayment,
} from '../../../lib/razorpay'
import { recordBillingEvent, stampMetaSent } from '../../../lib/leadsSupabase'
import { sendCapiEventResult, deriveEventId, matchKeys, type CapiEvent } from '../../../lib/metaCapi'

/**
 * Razorpay webhook receiver. The Razorpay twin of /api/webhooks/dodo.
 *
 * Every delivery carries `X-Razorpay-Signature`: the hex HMAC-SHA256 of the RAW
 * body with the webhook secret. An unsigned or wrongly signed body is refused,
 * since anyone can POST to this URL. With RAZORPAY_WEBHOOK_SECRET unset nothing
 * can be verified, so everything is refused.
 *
 * Events (subscribe to exactly these in the Razorpay dashboard):
 *   subscription.authenticated  mandate authorised
 *   subscription.activated      subscription is live
 *   subscription.charged        a cycle was paid (the first one too)
 *   subscription.pending        a charge failed, Razorpay is retrying
 *   subscription.halted         retries exhausted
 *   subscription.cancelled
 *   subscription.completed      all cycles billed
 *   payment.failed              any failed payment; only ones that belong to a
 *                               subscription are recorded
 *
 * Verified events are folded onto the customer's `all_leads` row exactly as the
 * Dodo webhook does, and a paid cycle sends Purchase to Meta.
 *
 * Duplicates: Razorpay may deliver an event more than once and out of order.
 * `x-razorpay-event-id` is unique per event; one already handled by this
 * process is acknowledged without being applied again. The writes are also
 * safe to repeat on their own (a merge onto the lead row, and a Meta event id
 * derived from the payment id), which covers a redelivery after a restart.
 *
 * Answers 2xx once a delivery is verified, whatever happened to our own write:
 * a non-2xx makes Razorpay retry, and retries do not fix our database.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HANDLED = new Set([
  'subscription.authenticated',
  'subscription.activated',
  'subscription.charged',
  'subscription.pending',
  'subscription.halted',
  'subscription.cancelled',
  'subscription.completed',
  'payment.failed',
])

/** Event ids already handled by this process. Bounded; oldest dropped first. */
const SEEN_LIMIT = 5000
const seen = new Set<string>()
function remember(eventId: string) {
  seen.add(eventId)
  if (seen.size > SEEN_LIMIT) {
    const oldest = seen.values().next().value
    if (oldest !== undefined) seen.delete(oldest)
  }
}

export async function POST(request: Request) {
  if (!webhookSecretConfigured()) {
    console.error('[webhooks/razorpay] RAZORPAY_WEBHOOK_SECRET not set: refusing unverified delivery')
    return NextResponse.json({ ok: false, reason: 'webhook_secret_missing' }, { status: 500 })
  }

  // MUST be the raw text: parsing to JSON first would break the signature.
  let raw: string
  try {
    raw = await request.text()
  } catch {
    return NextResponse.json({ ok: false, reason: 'unreadable_body' }, { status: 400 })
  }

  if (!verifyWebhookSignature(raw, request.headers.get('x-razorpay-signature'))) {
    console.error('[webhooks/razorpay] signature verification failed')
    return NextResponse.json({ ok: false, reason: 'invalid_signature' }, { status: 401 })
  }

  let event: {
    event?: string
    created_at?: number
    payload?: {
      subscription?: { entity?: RazorpaySubscription }
      payment?: { entity?: RazorpayPayment }
    }
  }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, reason: 'unreadable_body' }, { status: 400 })
  }

  const type = event.event ?? 'unknown'
  if (!HANDLED.has(type)) {
    // Acknowledge so Razorpay stops retrying an event we deliberately ignore.
    return NextResponse.json({ ok: true, ignored: type })
  }

  const eventId = request.headers.get('x-razorpay-event-id')?.trim() || ''
  if (eventId && seen.has(eventId)) {
    return NextResponse.json({ ok: true, duplicate: true, type })
  }

  let sub = event.payload?.subscription?.entity ?? null
  const payment = event.payload?.payment?.entity ?? null

  /**
   * payment.failed fires for every failed payment on the Razorpay account and
   * carries no subscription entity. Tie it to a subscription through the
   * payment itself or its invoice; one that belongs to no subscription (a
   * payment link, an order from somewhere else) is not ours to record.
   */
  if (type === 'payment.failed') {
    let subscriptionId = payment?.subscription_id ?? null
    if (!subscriptionId && payment?.invoice_id && razorpayConfigured()) {
      subscriptionId = (await fetchInvoice(payment.invoice_id).catch(() => null))?.subscription_id ?? null
    }
    if (!subscriptionId) {
      if (eventId) remember(eventId)
      return NextResponse.json({ ok: true, ignored: 'payment.failed_without_subscription' })
    }
    sub = razorpayConfigured() ? await fetchSubscription(subscriptionId).catch(() => null) : null
    if (!sub) sub = { id: subscriptionId } as RazorpaySubscription
  }

  const notes = notesOf(sub)
  const email = payment?.email?.trim() || notes.email || null
  const phone = payment?.contact?.trim() || notes.phone || null
  const paidAmount = typeof payment?.amount === 'number' ? payment.amount : null
  const notedTotal = Number(notes.total_minor)
  const amountMinor = paidAmount ?? (Number.isFinite(notedTotal) && notedTotal > 0 ? notedTotal : null)
  const occurredAt = isoFromUnix(event.created_at)

  /**
   * One status word for the lead row, in the vocabulary the Dodo webhook
   * writes ('active' is what moves a lead to Closed Won). A failed payment
   * says 'failed' whatever the subscription says: the first authorisation can
   * fail while the subscription is still only 'created'.
   */
  const status = type === 'payment.failed' ? 'failed' : (sub?.status ?? null)

  try {
    const result = await recordBillingEvent({
      eventType: type,
      webhookId: eventId || undefined,
      email,
      phone,
      name: notes.name ?? null,
      subscriptionId: sub?.id ?? null,
      paymentId: payment?.id ?? null,
      productId: sub?.plan_id ?? null,
      status,
      currency: payment?.currency ?? 'INR',
      amountMinor,
      nextBillingDate:
        sub && sub.status !== 'cancelled' && sub.status !== 'completed' ? isoFromUnix(sub.charge_at) : null,
      market: notes.market ?? 'inr',
      seats: notes.seats ? Number(notes.seats) : null,
      occurredAt,
      provider: 'razorpay',
      keepUnknown: true,
    })

    if (!result.ok) {
      // Genuine event we could not persist. Loud, and still 200 (see header).
      // Not remembered: a redelivery gets another go at the write.
      console.error('[webhooks/razorpay] verified event NOT recorded', { type, eventId, reason: result.reason })
      return NextResponse.json({ ok: true, recorded: false, reason: result.reason, type })
    }
  } catch (err) {
    console.error('[webhooks/razorpay] handled event but failed to record it', { type, eventId, err })
    return NextResponse.json({ ok: true, recorded: false, reason: 'exception', type })
  }

  if (eventId) remember(eventId)

  /**
   * Purchase to Meta, server-side, once per paid cycle. subscription.charged is
   * the event that carries the captured payment, for the first cycle and every
   * renewal; authenticated/activated arrive alongside the first one and would
   * double it. The id is derived from the payment id, so a redelivery produces
   * the same id and Meta deduplicates.
   */
  if (type === 'subscription.charged') {
    const purchase = {
      eventName: 'Purchase',
      eventId: deriveEventId('purchase', String(payment?.id ?? sub?.id ?? eventId)),
      user: { email, firstName: (notes.name ?? '').split(' ')[0] || null },
      // Paise in, rupees out: Meta wants major units.
      value: amountMinor !== null ? amountMinor / 100 : undefined,
      currency: payment?.currency ?? 'INR',
      custom: { event_type: type, market: notes.market ?? 'inr' },
    } satisfies CapiEvent
    // Not sent (no token on this server): parked on the buyer's lead for PROXe
    // core's cron to relay. Sent: still stamped, so the admin can see it.
    void sendCapiEventResult(purchase).then((r) => {
      if (!email) return
      return stampMetaSent({ email }, 'Purchase', {
        events: ['Purchase'], event_id: purchase.eventId, source: 'razorpay', sent: r.sent,
        keys: matchKeys(r.item),
        ...(r.sent ? { fbtrace: r.fbtrace ?? null, events_received: r.eventsReceived ?? null } : { error: r.error }),
        ...(r.sent || !r.item || r.error?.startsWith('http_4') ? {} : { relay: r.item }),
      })
    })
  }

  return NextResponse.json({ ok: true, recorded: true, type })
}
