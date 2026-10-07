import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '../../lib/supabase'

/**
 * How far one visitor got through /what-is-proxe or /pitch (Z, 7 Oct 2026: "if
 * I send the link to someone, I want to see how deep they went").
 *
 * The deck POSTs a running snapshot (and a final one on tab hide). Each visit
 * is one row in `pitch_views`, keyed by a per-tab session id; snapshots only
 * ever grow it: furthest card, cards seen, edge cases opened, seconds. Links we
 * send carry ?for=<name>, which lands in `recipient`.
 *
 * Never throws to the client: tracking must not break the deck.
 */

export const runtime = 'nodejs'

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n)
const keys = (v: unknown) =>
  (Array.isArray(v) ? v : []).map((k) => clip(k, 40)).filter((k) => /^[a-z0-9-]+$/.test(k)).slice(0, 60)
const int = (v: unknown, max: number) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)))

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    // sendBeacon posts text/plain, so parse the text ourselves.
    body = JSON.parse(await request.text())
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const sessionId = clip(body.sessionId, 64)
  const page = clip(body.page, 80)
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(sessionId) || !page.startsWith('/')) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const db = getSupabaseServiceClient()
  if (!db) return NextResponse.json({ ok: false, reason: 'not_configured' })

  try {
    const { data: prev } = await db.from('pitch_views')
      .select('seconds,max_card,cards_seen,extras_opened,completed,narration,recipient')
      .eq('session_id', sessionId).maybeSingle()
    const union = (a: string[] | null | undefined, b: string[]) => Array.from(new Set([...(a ?? []), ...b])).slice(0, 80)
    const row = {
      session_id: sessionId,
      page,
      recipient: clip(body.recipient, 60).toLowerCase() || prev?.recipient || null,
      last_seen_at: new Date().toISOString(),
      seconds: Math.max(prev?.seconds ?? 0, int(body.seconds, 6 * 3600)),
      max_card: Math.max(prev?.max_card ?? 0, int(body.maxCard, 200)),
      total_cards: int(body.totalCards, 200),
      cards_seen: union(prev?.cards_seen, keys(body.cardsSeen)),
      extras_opened: union(prev?.extras_opened, keys(body.extrasOpened)),
      completed: Boolean(prev?.completed || body.completed),
      narration: Boolean(prev?.narration || body.narration),
      lang: clip(body.lang, 12) || null,
      device: clip(body.device, 20) || null,
      referrer: clip(body.referrer, 200) || null,
    }
    const { error } = await db.from('pitch_views').upsert(row, { onConflict: 'session_id' })
    if (error) console.error('[api/pitch-view] upsert failed', error.message)
    return NextResponse.json({ ok: !error })
  } catch (err) {
    console.error('[api/pitch-view] failed', err)
    return NextResponse.json({ ok: false })
  }
}
