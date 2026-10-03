import { NextResponse } from 'next/server'
import { recordOnboardingProgress } from '../../lib/leadsSupabase'
import { WATCH_EPISODES } from '../../lib/watch'

/**
 * POST { phone, watched: string[] } from goproxe.com/onboarding.
 * Keeps only real episode slugs, scores them out of the published episodes, and
 * stores it on the viewer's lead (all_leads.unified_context.onboarding_videos).
 * Never throws to the client: progress saving must not break the player.
 */
export async function POST(request: Request) {
  let body: { phone?: string; watched?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }
  const known = new Set(WATCH_EPISODES.map((e) => e.slug))
  const watched = Array.isArray(body.watched) ? [...new Set(body.watched.filter((s): s is string => typeof s === 'string' && known.has(s)))] : []
  const total = WATCH_EPISODES.length
  const score = total ? Math.round((100 * watched.length) / total) : 0
  const result = await recordOnboardingProgress({ phone: body.phone, watched, total, score })
  return NextResponse.json({ ok: result.ok, score, watched: watched.length, total })
}
