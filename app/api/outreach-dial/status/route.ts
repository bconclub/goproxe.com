import { NextResponse } from 'next/server'

/**
 * Live status of one outreach call, for the /bdr page to follow a dial it
 * just placed: ringing -> talking (with seconds) -> done (with the summary).
 * Same passcode as the dial route. Proxies ElevenLabs; nothing is stored.
 *
 * GET /api/outreach-dial/status?id=conv_xxx
 */
const API_KEY = process.env.ELEVENLABS_API_KEY

export async function GET(request: Request) {
  const got = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const keys = [process.env.DIAL_API_KEY, process.env.BDR_DIAL_KEY].filter((k): k is string => !!k)
  if (!got || !keys.includes(got)) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }
  if (!API_KEY) return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  const id = new URL(request.url).searchParams.get('id') || ''
  if (!/^conv_[a-z0-9]+$/i.test(id)) return NextResponse.json({ ok: false, reason: 'bad_id' }, { status: 400 })

  const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${id}`, {
    headers: { 'xi-api-key': API_KEY },
    cache: 'no-store',
  })
  if (!res.ok) return NextResponse.json({ ok: false, reason: `upstream_${res.status}` }, { status: 502 })
  const d: any = await res.json().catch(() => ({}))
  const md = d.metadata || {}
  const turns: Array<{ role?: string; message?: string | null }> = Array.isArray(d.transcript) ? d.transcript : []
  const spoke = turns.filter((t) => t.role !== 'agent' && String(t.message || '').trim()).length
  const status: string = d.status || 'unknown'
  return NextResponse.json({
    ok: true,
    status, // initiated | in-progress | processing | done | failed
    duration: md.call_duration_secs ?? null,
    termination: md.termination_reason ?? null,
    turns: turns.length,
    caller_spoke: spoke > 0,
    summary: d.analysis?.transcript_summary ?? null,
    last_lines: turns.slice(-3).map((t) => `${t.role === 'agent' ? 'PROXe' : 'Them'}: ${String(t.message || '').trim()}`).filter((l) => !l.endsWith(': ')),
  })
}
