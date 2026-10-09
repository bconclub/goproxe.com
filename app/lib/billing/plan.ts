/**
 * What PROXe Core includes and what the top-up packs cost, as sold on
 * /pricing (source: the "PROXe Plan & Pricing" sheet, Oct 2026).
 *
 * The Core and seat prices themselves live in ./pricing.ts (the checkout
 * engine); this file only holds the allowances and packs the buy flow does not
 * charge for yet. All amounts are INR, exclusive of 18% GST.
 */

export const CORE_ALLOWANCE = {
  minutes: 250,
  leads: 1_000,
  seats: 2,
} as const

export interface TopUpPack {
  /** Rupees, excl. GST. */
  price: number
  minutes: number
  leads: number
}

/** Each pack is bought as EITHER its minutes OR its leads. Unused packs roll over. */
export const TOP_UP_PACKS: TopUpPack[] = [
  { price: 2_500, minutes: 125, leads: 500 },
  { price: 5_000, minutes: 250, leads: 1_000 },
  { price: 10_000, minutes: 500, leads: 2_000 },
]

export const GST_PERCENT = 18

export const inr = (rupees: number) => `₹${rupees.toLocaleString('en-IN')}`
export const num = (n: number) => n.toLocaleString('en-IN')
