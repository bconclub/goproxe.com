import { NextResponse } from 'next/server'
import {
  getDodoClient,
  getCoreProductId,
  getSeatProductId,
  getBillingCurrency,
  getSiteUrl,
  INCLUDED_SEATS,
  type Market,
} from '../../lib/dodo'
import { markCheckoutStarted } from '../../lib/leadsSupabase'

/**
 * Checkout session → Dodo Payments.
 *
 * The browser POSTs the plan the visitor picked; this server route opens a
 * hosted Dodo checkout and hands back the URL to redirect to. The API key stays
 * server-side.
 *
 * Body:
 *   {
 *     market?: 'inr' | 'usd',   // which price point — defaults to INR (home market)
 *     seats?: number,           // TOTAL seats wanted; anything over the 2 included
 *                               // is added as add-on quantity
 *     name?, email?, brandName? // prefill, all optional
 *   }
 *
 * Response: { ok: true, checkoutUrl, sessionId } — the caller redirects to
 * `checkoutUrl`. On failure it returns ok:false with a reason and never throws,
 * so a misconfigured integration degrades to "talk to sales" rather than a 500.
 */

export const runtime = 'nodejs'

interface CheckoutPayload {
  market?: Market
  seats?: number
  name?: string
  email?: string
  phone?: string
  brandName?: string
  /** Where the click came from, carried into Dodo metadata + the lead row. */
  source?: string
}

export async function POST(request: Request) {
  let body: CheckoutPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  const client = getDodoClient()
  if (!client) {
    return NextResponse.json({ ok: false, reason: 'not_configured' })
  }

  const market: Market = body.market === 'usd' ? 'usd' : 'inr'
  const coreProductId = getCoreProductId(market)
  if (!coreProductId) {
    console.error('[api/checkout] no Core product configured for market', market)
    return NextResponse.json({ ok: false, reason: 'product_not_configured' })
  }

  // Seats: Core bundles INCLUDED_SEATS. Only bill the overflow.
  const requestedSeats = Number.isFinite(body.seats) ? Math.floor(Number(body.seats)) : INCLUDED_SEATS
  const extraSeats = Math.max(0, requestedSeats - INCLUDED_SEATS)
  const seatProductId = extraSeats > 0 ? getSeatProductId(market) : null
  if (extraSeats > 0 && !seatProductId) {
    // Don't silently drop paid seats — better to fail loudly than under-charge.
    console.error('[api/checkout] extra seats requested but no seat product configured', { market, extraSeats })
    return NextResponse.json({ ok: false, reason: 'seat_product_not_configured' })
  }

  const productCart = [
    { product_id: coreProductId, quantity: 1 },
    ...(seatProductId ? [{ product_id: seatProductId, quantity: extraSeats }] : []),
  ]

  const origin = (() => {
    try { return new URL(request.url).origin } catch { return undefined }
  })()
  const siteUrl = getSiteUrl(origin)
  const billingCurrency = getBillingCurrency(market)

  const email = body.email?.trim()
  const name = body.name?.trim()
  const phone = body.phone?.trim()

  try {
    const session = await client.checkoutSessions.create({
      product_cart: productCart,
      ...(billingCurrency ? { billing_currency: billingCurrency } : {}),
      // Only send a customer object when we actually have an email — Dodo
      // collects it on the hosted page otherwise. Phone rides along so nothing
      // the buyer already typed on our form has to be typed again.
      ...(email
        ? { customer: { email, name: name || '', ...(phone ? { phone_number: phone } : {}) } }
        : {}),
      // NOTE: customer_business_name is deliberately NOT sent. Dodo rejects it
      // with 400 "customer_business_name cannot be provided without tax_id",
      // and we don't collect a GST/VAT number on the landing form. The brand
      // name still reaches us via metadata below.
      return_url: `${siteUrl}/thank-you?checkout=success`,
      cancel_url: `${siteUrl}/#pricing`,
      // A lean checkout: pay and get out. Everything below defaults to ON in
      // Dodo, so each line is a field or panel deliberately removed.
      customization: {
        theme: 'dark',
        // The order summary defaults to expanded, which pushes the card fields
        // below the fold and re-opens the "is this the right price?" question
        // at the worst moment. Collapsed — still one tap away, not in the way.
        show_order_details: false,
        show_on_demand_tag: false,
      },
      feature_flags: {
        // We already quote by detected market and charge in that same currency
        // (lib/market.ts). A currency switcher on Dodo's page would let someone
        // see ₹9,999 here and be billed $149 there — the exact mismatch the
        // shared market detection exists to prevent.
        allow_currency_selection: false,
        // No public discount codes on founding pricing. An empty "promo code?"
        // box only invites people to leave and hunt for one.
        allow_discount_code: false,
        // We do not collect GST/VAT (see the customer_business_name note above),
        // so the tax-id field is dead weight on the form.
        allow_tax_id: false,
        // Skip Dodo's own success interstitial and land straight on /thank-you,
        // which is where the onboarding call gets booked.
        redirect_immediately: true,
      },
      // Only the zipcode is required. Street/city/state are not needed to bill a
      // subscription and every extra required field costs completions.
      minimal_address: true,
      // INR e-mandate ceiling. RBI recurring card payments authorise a maximum
      // amount up front; Dodo sends max(this, actual charge) and falls back to a
      // ₹15,000 default. At ₹9,999 the default happens to work, but it breaks
      // the moment a customer adds 6+ seats at ₹999 (₹15,993 > ₹15,000) — the
      // renewal would fail a month later, silently. Raising the ceiling costs
      // the customer nothing (they are still only charged the real amount) and
      // cannot be changed later without re-subscribing everyone.
      ...(market === 'inr' ? { mandate_min_amount_inr_paise: 2_500_000 } : {}),
      // Carried through to the webhook so we can match the payment back to the
      // lead without a second lookup.
      metadata: {
        market,
        seats: String(requestedSeats),
        source: 'goproxe_pricing',
        ...(body.brandName?.trim() ? { brand_name: body.brandName.trim() } : {}),
      },
    })

    if (!session.checkout_url) {
      console.error('[api/checkout] session created without a checkout_url', session.session_id)
      return NextResponse.json({ ok: false, reason: 'no_checkout_url' }, { status: 502 })
    }

    // Stamp the lead as "reached the payment page". Combined with the webhook
    // (which only writes on real money movement), this is what surfaces
    // abandoned checkouts. Awaited but non-fatal.
    await markCheckoutStarted({
      email,
      sessionId: session.session_id,
      market,
      source: body.source ?? null,
    })

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
    })
  } catch (err) {
    console.error('[api/checkout] session creation failed', err)
    return NextResponse.json({ ok: false, reason: 'checkout_failed' }, { status: 502 })
  }
}
