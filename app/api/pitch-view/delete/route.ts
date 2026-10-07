import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '../../../lib/supabase'

/**
 * Remove one visit (or every visit under a name) from the views page. Same
 * private key as /pitch-views; used to clear test runs.
 */
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const key = String(form?.get('key') ?? '')
  const sessionId = String(form?.get('session') ?? '')
  const recipient = String(form?.get('recipient') ?? '').toLowerCase()
  const back = `/pitch-views?key=${encodeURIComponent(key)}`
  if (!process.env.PITCH_VIEWS_KEY || key !== process.env.PITCH_VIEWS_KEY) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }
  const db = getSupabaseServiceClient()
  if (db && (sessionId || recipient)) {
    const q = db.from('pitch_views').delete()
    const { error } = sessionId ? await q.eq('session_id', sessionId) : await q.eq('recipient', recipient)
    if (error) console.error('[api/pitch-view/delete] failed', error.message)
  }
  return NextResponse.redirect(new URL(back, request.url), 303)
}
