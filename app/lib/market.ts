'use client'

/**
 * Which market is this visitor in? India → INR, everyone else → USD.
 *
 * Shared by the pricing section (which price to show) and checkout (which
 * currency to charge) so a visitor is never quoted one and billed the other.
 *
 * Timezone is the strongest signal — it's the device's actual location and
 * survives the VPNs people actually use. Language tags are the backup for
 * travellers and dual-locale setups. If nothing is readable we fall back to
 * INR, the home market.
 */

export type Market = 'inr' | 'usd'

export function detectMarket(): Market {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    // Both spellings are in the wild — Calcutta is the legacy tzdata alias.
    if (/^Asia\/(Kolkata|Calcutta)$/i.test(tz)) return 'inr'

    const locales = [navigator.language, ...(navigator.languages || [])]
    if (locales.some((l) => /-IN\b/i.test(l || ''))) return 'inr'

    // A readable, non-India signal → international pricing.
    if (tz || locales.length) return 'usd'
    return 'inr'
  } catch {
    return 'inr'
  }
}
