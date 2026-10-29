import { NextResponse } from 'next/server'

/**
 * "By the numbers" for the pitch, live from PROXe Core (Z, 29 Oct 2026: "get
 * numbers from PROXe Core"). Each brand's PROXe answers /api/public/stats with
 * its last-90-day counts (aggregate only); this adds them up. Refreshed every
 * 6 hours; a brand that does not answer is left out of that refresh.
 */
export const revalidate = 21600

// Each brand's PROXe dashboard (Vercel production domains).
const BRANDS: Record<string, string> = {
  proxe: 'https://proxe.goproxe.com',
  windchasers: 'https://proxe.windchasers.in',
  lokazen: 'https://proxe.lokazen.in',
  hshospital: 'https://hshospital.goproxe.com',
  bcon: 'https://proxe.bconclub.com',
  khadivasthra: 'https://proxe.khadivasthra.com',
  bybo: 'https://proxe.bybo.in',
  axlrate: 'https://proxe.axlrate.com',
  ahoy: 'https://ahoy.proxe.si',
  zensquare: 'https://zensquare.proxe.si',
  scan2kare: 'https://scan2kare.proxe.si',
}

const REQUIRED = ['proxe', 'windchasers', 'lokazen']

type Stats = { leads: number; messages: number; customerMessages: number; answered: number; medianReplyMs: number | null; replySamples: number; opportunities: number; booked: number }

async function one(base: string): Promise<Stats | null> {
  try {
    const r = await fetch(`${base}/api/public/stats`, { next: { revalidate }, signal: AbortSignal.timeout(25_000) })
    if (!r.ok) return null
    const j = await r.json()
    return typeof j?.leads === 'number' ? j : null
  } catch {
    return null
  }
}

export async function GET() {
  const entries = await Promise.all(Object.entries(BRANDS).map(async ([k, url]) => [k, await one(url)] as const))
  const brands = Object.fromEntries(entries.filter(([, s]) => s)) as Record<string, Stats>
  const list = Object.values(brands)
  // The big three carry most of the volume: without them the total would undersell
  // PROXe, so the deck keeps its last snapshot until they all report.
  const missing = REQUIRED.filter((k) => !brands[k])
  if (missing.length) return NextResponse.json({ ok: false, missing, reporting: Object.keys(brands) })
  const sum = (f: (s: Stats) => number) => list.reduce((a, s) => a + (f(s) || 0), 0)
  const customer = sum((s) => s.customerMessages)
  // Brands' medians combined by sample weight: close to the true median, honest about the scale.
  const withLag = list.filter((s) => s.medianReplyMs && s.replySamples)
  const samples = withLag.reduce((a, s) => a + s.replySamples, 0)
  const medianReplyMs = samples ? withLag.reduce((a, s) => a + s.medianReplyMs! * s.replySamples, 0) / samples : null
  return NextResponse.json({
    ok: true,
    days: 90,
    total: {
      leads: sum((s) => s.leads),
      messages: sum((s) => s.messages),
      answeredPct: customer ? (sum((s) => s.answered) / customer) * 100 : null,
      medianReplyS: medianReplyMs ? medianReplyMs / 1000 : null,
      opportunities: sum((s) => s.opportunities),
      booked: sum((s) => s.booked),
    },
    brands,
    reporting: Object.keys(brands),
    at: new Date().toISOString(),
  })
}
