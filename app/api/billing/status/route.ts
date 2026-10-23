import { NextResponse } from 'next/server'
import { getDodoClient, getSiteUrl } from '../../../lib/dodo'

/**
 * Billing status for one subscription, read by the PROXe brand dashboards.
 *
 * GET /api/billing/status?subscription_id=sub_…
 *
 * The dashboards show a Billing page and a red "payment failed" bar from this.
 * They call here instead of Dodo because the Dodo key lives only on this server:
 * it controls every PROXe payment and must never be copied into brand envs.
 * The pay button goes to /pay/<subscription_id>, returned as `pay_url`.
 *
 * Same key model as /pay and /api/checkout/resume: the subscription id is
 * random and unpublished, and only status/amount/dates come back, never the
 * customer's name, email or address.
 */

export const runtime = 'nodejs'

/** Dashboards live on <brand>.proxe.si and a few legacy brand hosts. */
function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    !!origin &&
    (/^https:\/\/([a-z0-9-]+\.)*proxe\.si$/.test(origin) ||
      /^https:\/\/([a-z0-9-]+\.)*goproxe\.com$/.test(origin) ||
      /^https:\/\/proxe\.(lokazen\.in|bconclub\.com|bybo\.in|axlrate\.com)$/.test(origin) ||
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin))
  return allowed
    ? { 'Access-Control-Allow-Origin': origin!, Vary: 'Origin', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }
    : { Vary: 'Origin' }
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const headers = { ...corsHeaders(request.headers.get('origin')), 'Cache-Control': 'no-store' }
  const subscriptionId = url.searchParams.get('subscription_id')?.trim()
  if (!subscriptionId?.startsWith('sub_')) {
    return NextResponse.json({ error: 'subscription_id required' }, { status: 400, headers })
  }

  const client = getDodoClient()
  if (!client) return NextResponse.json({ error: 'not_configured' }, { status: 503, headers })

  try {
    const sub = await client.subscriptions.retrieve(subscriptionId)
    const [product, payments] = await Promise.all([
      client.products.retrieve(sub.product_id).catch(() => null),
      client.payments.list({ subscription_id: subscriptionId, page_size: 25 }).catch(() => null),
    ])
    const items = payments?.items ?? []
    const last = items[0] ?? null
    /**
     * Every open of a /pay link mints a dues invoice that sits at
     * requires_payment_method until paid. Those are not attempts: on 23 Oct one
     * sat on top of Ahoy's failed UPI payment and the dashboard read "not paid
     * yet" instead of "failed". The last real attempt skips them.
     */
    const attempt = items.find((p) => p.status && !p.status.startsWith('requires_')) ?? null
    // The list view has no failure reason; fetch it only when there was one.
    const attemptError =
      attempt?.status === 'failed'
        ? ((await client.payments.retrieve(attempt.payment_id).catch(() => null))?.error_code ?? null)
        : null
    // 'past_due' (grace period) is newer than this SDK's status union.
    const status = sub.status as string
    const needsPayment = status === 'on_hold' || status === 'past_due'
    /**
     * One word for the dashboard bar. Z's rule (23 Oct): red only on a real
     * failure, nothing at all for processing or not-yet-paid.
     */
    const paymentState: 'ok' | 'processing' | 'failed' | 'due' =
      attempt?.status === 'processing'
        ? 'processing'
        : !needsPayment
          ? 'ok'
          : attempt?.status === 'failed'
            ? 'failed'
            : 'due'
    // Recurring prices carry `price`, usage-based ones `fixed_price`.
    const plan = product?.price as
      | { price?: number; fixed_price?: number; currency?: string; tax_inclusive?: boolean | null }
      | undefined

    return NextResponse.json(
      {
        subscription_id: sub.subscription_id,
        status,
        // The plan's own price and currency. The subscription object reports
        // Dodo's USD settlement figure (Ahoy's ₹9,999 plan reads as 10516 USD),
        // which is not what the client is charged.
        amount_minor: plan?.price ?? plan?.fixed_price ?? sub.recurring_pre_tax_amount,
        currency: plan?.currency ?? sub.currency,
        tax_inclusive: plan?.tax_inclusive ?? sub.tax_inclusive,
        interval: sub.payment_frequency_interval,
        next_billing_date: sub.next_billing_date,
        previous_billing_date: sub.previous_billing_date,
        cancel_at_next_billing_date: sub.cancel_at_next_billing_date,
        product_name: product?.name ?? null,
        // What the client bought, without Dodo's checkout variant ("(India)",
        // "- 7 Day Trial", "- 3 Months"): those describe the link we sent.
        plan_name: product?.name?.split(/s+[-(]/)[0]?.trim() || null,
        last_payment: last
          ? {
              status: last.status,
              amount_minor: last.total_amount,
              currency: last.currency,
              payment_method: last.payment_method ?? null,
              error_code: last.status === 'failed' ? attemptError : null,
              created_at: last.created_at,
            }
          : null,
        last_attempt: attempt
          ? {
              status: attempt.status,
              amount_minor: attempt.total_amount,
              currency: attempt.currency,
              payment_method: attempt.payment_method ?? null,
              error_code: attemptError,
              created_at: attempt.created_at,
            }
          : null,
        payment_state: paymentState,
        // Paid bills with Dodo's invoice PDF, newest first.
        invoices: items
          .filter((p) => p.status === 'succeeded' && p.invoice_url)
          .map((p) => ({
            payment_id: p.payment_id,
            amount_minor: p.total_amount,
            currency: p.currency,
            created_at: p.created_at,
            invoice_url: p.invoice_url,
          })),
        // on_hold / past_due: money is owed (see payment_state for the bar).
        needs_payment: needsPayment,
        pay_url: `${getSiteUrl(url.origin)}/pay/${encodeURIComponent(subscriptionId)}`,
      },
      { headers }
    )
  } catch (err) {
    const status = (err as { status?: number })?.status === 404 ? 404 : 502
    if (status === 502) console.error('[api/billing/status]', subscriptionId, err)
    return NextResponse.json({ error: status === 404 ? 'not_found' : 'upstream_error' }, { status, headers })
  }
}
