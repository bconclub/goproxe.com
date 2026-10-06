import { NextResponse } from 'next/server'
import { getDodoClient, getSiteUrl } from '../../../lib/dodo'

/**
 * Resume an unfinished checkout.
 *
 * Dodo can hand a buyer back to /thank-you with status=pending when no card or
 * mandate was ever confirmed (seen live 6 Oct: a ₹0 trial left the buyer on our
 * "Payment received" screen with nothing on file, so the subscription could
 * never bill). The thank-you page now links here instead of celebrating.
 *
 * GET /api/checkout/resume?payment_id=pay_… (or subscription_id=sub_…)
 * → 302 to a fresh hosted checkout for the same customer and plan. Anything we
 * cannot resolve falls back to the pricing section rather than erroring.
 */

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const siteUrl = getSiteUrl(url.origin)
  const fallback = NextResponse.redirect(`${siteUrl}/#pricing`, 302)

  const client = getDodoClient()
  if (!client) return fallback

  try {
    let subscriptionId = url.searchParams.get('subscription_id')?.trim() || null
    const paymentId = url.searchParams.get('payment_id')?.trim() || null
    if (!subscriptionId && paymentId) {
      const payment = await client.payments.retrieve(paymentId)
      subscriptionId = payment.subscription_id ?? null
    }
    if (!subscriptionId) return fallback

    const sub = await client.subscriptions.retrieve(subscriptionId)
    // Already paying: nothing to resume, send them on to onboarding.
    if (sub.status === 'active') {
      return NextResponse.redirect(`${siteUrl}/thank-you?checkout=success&status=active`, 302)
    }

    const billing = sub.billing
    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: sub.product_id,
          quantity: sub.quantity || 1,
          ...(sub.addons?.length
            ? { addons: sub.addons.map((a) => ({ addon_id: a.addon_id, quantity: a.quantity })) }
            : {}),
        },
      ],
      customer: { customer_id: sub.customer.customer_id },
      ...(billing?.country ? { billing_address: billing } : {}),
      return_url: `${siteUrl}/thank-you?checkout=success`,
      customization: { theme: 'dark' as const, show_order_details: false, show_on_demand_tag: false },
      feature_flags: {
        allow_currency_selection: false,
        allow_discount_code: false,
        allow_tax_id: true,
        // Stay on Dodo until the payment really settles. See /api/checkout.
        redirect_immediately: false,
      },
      minimal_address: true,
      ...(sub.currency === 'INR' ? { mandate_min_amount_inr_paise: 2_500_000 } : {}),
      metadata: { ...(sub.metadata ?? {}), resumed_from: subscriptionId },
    } as Parameters<typeof client.checkoutSessions.create>[0])

    if (!session.checkout_url) return fallback
    return NextResponse.redirect(session.checkout_url, 302)
  } catch (err) {
    console.error('[api/checkout/resume] could not resume', err)
    return fallback
  }
}
