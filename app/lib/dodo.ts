// Server-only module: imported exclusively by the /api/checkout and
// /api/webhooks/dodo routes. Holds the Dodo Payments secret key, so it must
// never be pulled into a client bundle.
import DodoPayments from 'dodopayments'

/**
 * Dodo Payments client + product resolution.
 *
 * Dodo is our merchant of record, which is why it fits the two-market pricing
 * on the landing page: it settles INR at home and USD everywhere else while
 * handling tax/compliance for both. The currency a visitor sees in
 * PricingSection is the currency we open checkout in.
 *
 * Every accessor is null-safe. Until the keys are set the checkout route
 * answers `not_configured` instead of throwing, matching how `supabase.ts` and
 * `/api/lead` already behave — an unconfigured integration must never surface
 * as a 500 to a visitor.
 */

export type Market = 'inr' | 'usd'

/**
 * Read an env var, treating the `PASTE_…` scaffolding in `.env.local` as unset.
 * Without this a placeholder counts as "configured" and gets forwarded to Dodo,
 * which answers with an opaque rejection instead of our clear not-configured.
 */
function env(name: string): string | undefined {
  const v = process.env[name]?.trim()
  if (!v || v.startsWith('PASTE_')) return undefined
  return v
}

/** Test until explicitly told otherwise — never charge a real card by accident. */
function environment(): 'test_mode' | 'live_mode' {
  return process.env.DODO_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode'
}

export function isLiveMode(): boolean {
  return environment() === 'live_mode'
}

/** The API client, or null when the key isn't configured. */
export function getDodoClient(): DodoPayments | null {
  const bearerToken = env('DODO_PAYMENTS_API_KEY')
  if (!bearerToken) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[dodo] DODO_PAYMENTS_API_KEY not set — checkout disabled.')
    }
    return null
  }
  return new DodoPayments({
    bearerToken,
    // Only needed by webhooks.unwrap(), harmless here.
    webhookKey: env('DODO_PAYMENTS_WEBHOOK_KEY'),
    environment: environment(),
  })
}

/**
 * The Core subscription product for a market.
 *
 * Prefers a per-currency product (`..._INR` / `..._USD`) because that's how
 * Dodo models separate INR and USD price points. If only a single product is
 * configured we fall back to it and let `billing_currency` on the session pick
 * the currency instead.
 */
export function getCoreProductId(market: Market): string | null {
  const perCurrency =
    market === 'inr'
      ? env('DODO_PRODUCT_CORE_INR')
      : env('DODO_PRODUCT_CORE_USD')
  return perCurrency || env('DODO_PRODUCT_CORE') || null
}

/** The per-seat add-on product, used when a buyer wants more than the 2 included seats. */
export function getSeatProductId(market: Market): string | null {
  const perCurrency =
    market === 'inr'
      ? env('DODO_PRODUCT_SEAT_INR')
      : env('DODO_PRODUCT_SEAT_USD')
  return perCurrency || env('DODO_PRODUCT_SEAT') || null
}

/**
 * Currency code for the session. Only sent when a single shared product is
 * configured — when per-currency products exist the product already carries its
 * currency and sending a conflicting one is an error.
 */
export function getBillingCurrency(market: Market): 'INR' | 'USD' | undefined {
  const hasPerCurrencyProduct = Boolean(
    market === 'inr'
      ? env('DODO_PRODUCT_CORE_INR')
      : env('DODO_PRODUCT_CORE_USD')
  )
  if (hasPerCurrencyProduct) return undefined
  return market === 'inr' ? 'INR' : 'USD'
}

/** Absolute site origin for return/cancel URLs. */
export function getSiteUrl(fallbackOrigin?: string): string {
  const configured = env('NEXT_PUBLIC_SITE_URL')
  if (configured) return configured.replace(/\/$/, '')
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, '')
  return 'https://goproxe.com'
}

/** Seats bundled into Core — extra seats are billed as add-on quantity beyond this. */
export const INCLUDED_SEATS = 2
