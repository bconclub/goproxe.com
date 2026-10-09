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

/**
 * Each pack is bought as EITHER its minutes OR its leads. Unused packs roll
 * over. Volume-tiered (Oct 2026): the bigger the pack, the cheaper per unit,
 * ₹16.7 → ₹14.3 → ₹12.5 a minute. Leads stay at 4 per minute.
 */
export const TOP_UP_PACKS: TopUpPack[] = [
  { price: 2_500, minutes: 150, leads: 600 },
  { price: 5_000, minutes: 350, leads: 1_400 },
  { price: 10_000, minutes: 800, leads: 3_200 },
]

/** Rupees per unit, to one decimal: 16.7, 4.2. */
export const perUnit = (p: TopUpPack, unit: 'minutes' | 'leads') => Math.round((p.price / p[unit]) * 10) / 10

/** % saved per unit against the smallest pack. */
export const savingPct = (p: TopUpPack) => {
  const base = TOP_UP_PACKS[0].price / TOP_UP_PACKS[0].minutes
  return Math.round((1 - p.price / p.minutes / base) * 100)
}

export const GST_PERCENT = 18

export const inr = (rupees: number) => `₹${rupees.toLocaleString('en-IN')}`
export const num = (n: number) => n.toLocaleString('en-IN')
