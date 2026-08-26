/**
 * Pricing engine, mirrored from the monorepo.
 *
 * SOURCE OF TRUTH: GO PROXe `core/src/lib/billing/` (quote.ts, money.ts,
 * types.ts), which carries the unit tests. This file is a deliberate copy of the
 * pure parts, for two reasons that both matter:
 *   1. The buy page recomputes the total on every seat click. That has to run in
 *      the browser, so the math has to be in this bundle.
 *   2. Checkout is the money path. Making it depend on a cross-repo network call
 *      would add a failure mode to the one flow that must not have new ones.
 * Keep the two in sync. If you change a rule here, change it there and re-run
 * `npm test` in core.
 *
 * Money is integer minor units throughout: paise for INR, cents for USD. Rs
 * 9,999.00 is 999900. There is no float anywhere in here and there must not be.
 */

export type Currency = 'INR' | 'USD'

/**
 * b2c            no GSTIN. 18% is added ON TOP. Dodo remits it under its own
 *                OIDAR registration, so it was never our revenue.
 * rcm            valid GSTIN. Reverse charge: 18% is not levied at all. The
 *                buyer self-assesses IGST and claims input credit on the same
 *                line, so it costs them nothing.
 * international  USD, outside Indian GST.
 */
export type TaxMode = 'b2c' | 'rcm' | 'international'

export interface PricingConfig {
  gst_rate_bp: number
  core_price: Record<Currency, number>
  seat_price: Record<Currency, number>
  included_seats: number
  max_seats: number
}

/**
 * Prices mirror the live Dodo products and the seeded rows in migration 039.
 * They are constants HERE only because this is a static marketing bundle; the
 * database remains the source of truth and the checkout route is what actually
 * charges.
 */
export const PRICING: PricingConfig = {
  gst_rate_bp: 1800,
  core_price: { INR: 999_900, USD: 14_900 },
  seat_price: { INR: 99_900, USD: 1_500 },
  included_seats: 2,
  // A ceiling, not a limit on ambition: past this the buyer should be talking to
  // a human about a multi-location quote, not clicking a stepper 40 times.
  max_seats: 25,
}

function roundHalfUp(x: number): number {
  return x < 0 ? -Math.round(-x) : Math.round(x)
}

function applyBp(amount: number, basisPoints: number): number {
  return roundHalfUp((amount * basisPoints) / 10_000)
}

export interface QuoteInput {
  seats: number
  currency: Currency
  tax_mode: TaxMode
  config?: PricingConfig
}

export interface Quote {
  currency: Currency
  tax_mode: TaxMode
  seats: number
  billable_seats: number
  base: number
  seat_total: number
  subtotal: number
  tax: number
  tax_rate_bp: number
  grand_total: number
}

export function quote(input: QuoteInput): Quote {
  const cfg = input.config ?? PRICING
  const currency = input.currency
  const seats = Math.max(cfg.included_seats, Math.min(cfg.max_seats, Math.floor(input.seats)))

  const base = cfg.core_price[currency]
  const billable_seats = Math.max(0, seats - cfg.included_seats)
  const seat_total = billable_seats * cfg.seat_price[currency]
  const subtotal = base + seat_total

  // Only b2c levies anything. rcm is reverse charge, international is outside
  // Indian GST entirely.
  const tax_rate_bp = input.tax_mode === 'b2c' ? cfg.gst_rate_bp : 0
  const tax = applyBp(subtotal, tax_rate_bp)

  return {
    currency,
    tax_mode: input.tax_mode,
    seats,
    billable_seats,
    base,
    seat_total,
    subtotal,
    tax,
    tax_rate_bp,
    grand_total: subtotal + tax,
  }
}

/**
 * Which tax case applies. One function decides it, so the page, the checkout
 * route and the invoice can never disagree about what a buyer owes.
 *
 * A GSTIN only matters for an Indian supply. A foreign buyer typing one into the
 * box does not create an Indian reverse charge.
 */
export function resolveTaxMode(market: 'inr' | 'usd', gstin?: string | null): TaxMode {
  if (market !== 'inr') return 'international'
  return isPlausibleGstin(gstin) ? 'rcm' : 'b2c'
}

/**
 * Shape check only: 2-digit state code, 10-character PAN, entity digit, 'Z',
 * checksum character.
 *
 * Deliberately NOT a claim that the number is registered and active. Verifying
 * that needs a GSTN lookup, and treating a well-formed fake as proven would hand
 * someone an 18% discount for typing fifteen characters. Until the lookup
 * exists, the reverse-charge declaration is the buyer's, and their GSTIN is
 * printed on the invoice with their name against it.
 */
export function isPlausibleGstin(gstin?: string | null): boolean {
  const g = String(gstin ?? '').trim().toUpperCase()
  return /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(g)
}

/** Minor units to a display string. Indian digit grouping for INR. */
export function formatMoney(minor: number, currency: Currency): string {
  if (currency === 'USD') {
    return `$${(minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  const rupees = minor / 100
  const hasPaise = minor % 100 !== 0
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}
