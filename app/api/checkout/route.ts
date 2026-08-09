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

/**
 * Dodo requires E.164 ('+' then digits). The landing form accepts anything,
 * and a bare local number ("9876543210") made Dodo reject the whole session —
 * the buyer then got silently bounced to the sales calendar instead of
 * payment. Coerce the obvious shapes; return null when unsure so the phone is
 * simply omitted and Dodo collects it on the hosted page.
 */
function normalizeE164(raw: string | undefined, market: Market): string | null {
  if (!raw) return null
  const cleaned = raw.trim().replace(/[^\d+]/g, '')
  const digits = cleaned.replace(/\D/g, '')
  if (cleaned.startsWith('+')) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  }
  // Bare national number: assume the market's home country.
  if (digits.length === 10) return market === 'inr' ? `+91${digits}` : `+1${digits}`
  // Country code typed without the '+'.
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

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
  const phone = normalizeE164(body.phone, market)

  try {
    const sessionParams = {
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
        theme: 'dark' as const,
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
    }

    let session
    try {
      session = await client.checkoutSessions.create(sessionParams)
    } catch (err) {
      // A phone Dodo dislikes must never cost the sale: retry once without it
      // and let the hosted page collect it instead.
      if (!(email && phone)) throw err
      console.error('[api/checkout] session failed with phone attached, retrying without', err)
      session = await client.checkoutSessions.create({
        ...sessionParams,
        customer: { email, name: name || '' },
      })
    }

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
