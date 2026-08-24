import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { recordCallTranscript } from '../../../lib/leadsSupabase'

/**
 * ElevenLabs post-call webhook.
 *
 * Calls were landing in the dashboard as a phone number and nothing else: the
 * dial stored a `conversation_id`, but nothing ever read the transcript back,
 * so every voice lead showed "0 agent msgs" and an empty thread. This closes
 * that loop.
 *
 * ElevenLabs signs with an `elevenlabs-signature` header shaped like
 * `t=<unix>,v0=<hex hmac>`, where the signed payload is `<t>.<raw body>`. The
 * raw text is required — parsing to JSON first re-serialises and breaks the
 * comparison.
 */
export const dynamic = 'force-dynamic'

const SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || ''
/** Reject anything older than this. Bounds replay of a captured request. */
const TOLERANCE_SECONDS = 30 * 60

function verify(rawBody: string, header: string | null): boolean {
  if (!SECRET) return false
  if (!header) return false

  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const i = kv.indexOf('=')
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()]
    })
  ) as Record<string, string>

  const ts = parts.t
  const sig = parts.v0
  if (!ts || !sig) return false

  const age = Math.abs(Date.now() / 1000 - Number(ts))
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false

  const expected = crypto.createHmac('sha256', SECRET).update(`${ts}.${rawBody}`).digest('hex')

  // Both sides hex of the same digest, so lengths match; the length guard is
  // still needed because timingSafeEqual THROWS on a mismatch rather than
  // returning false.
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(sig, 'utf8')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const raw = await request.text()

  if (!verify(raw, request.headers.get('elevenlabs-signature'))) {
    // 401, not 500: a retry cannot fix a bad signature, and answering 2xx to an
    // unverified body would let anyone write transcripts onto our leads.
    console.error('[webhooks/elevenlabs] signature verification failed')
    return NextResponse.json({ ok: false, reason: 'invalid_signature' }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_json' }, { status: 400 })
  }

  // Only the completed-transcription event carries what we want. Anything else
  // is acknowledged so ElevenLabs stops retrying it.
  if (event?.type !== 'post_call_transcription') {
    return NextResponse.json({ ok: true, skipped: event?.type ?? 'unknown' })
  }

  const d = event.data ?? {}
  const conversationId: string | null = d.conversation_id ?? null

  // The number is the only reliable join back to a lead. ElevenLabs reports it
  // in different places depending on how the call was placed, so check each.
  const phone: string | null =
    d.metadata?.phone_call?.external_number ??
    d.conversation_initiation_client_data?.dynamic_variables?.system__caller_id ??
    null

  const turns: Array<{ role?: string; message?: string | null; time_in_call_secs?: number }> =
    Array.isArray(d.transcript) ? d.transcript : []

  const transcript = turns
    .filter((t) => t.message)
    .map((t) => ({
      role: t.role === 'agent' ? 'agent' : 'caller',
      text: String(t.message),
      at: t.time_in_call_secs ?? null,
    }))

  // Structured extraction, configured as `data_collection` on the agent. The
  // transcript alone left every voice lead nameless: the caller says their name
  // out loud, the agent even confirms the pronunciation, and none of it reached
  // the record because nothing was reading it back out.
  // Results arrive as { field: { value, rationale } } — take .value, and treat
  // the empty string the prompt asks for as "not given" rather than a name.
  const collected = (d.analysis?.data_collection_results ?? {}) as Record<string, any>
  const pick = (k: string): string | null => {
    const raw = collected?.[k]
    const v = typeof raw === 'object' && raw !== null ? raw.value : raw
    const s = typeof v === 'string' ? v.trim() : ''
    return s.length ? s : null
  }

  // OUTREACH DIALS GO TO ARC, NOT PROXE. Cold-dial transcripts are prospect
  // noise: the rule is that ARC owns prospects and PROXe owns conversations,
  // and only prospects who show interest get promoted (deliberately, via the
  // WhatsApp bridge). Routing is by agent_id, so the website-callback flow
  // below is untouched.
  const OUTREACH_AGENTS = new Set(
    (process.env.OUTREACH_AGENT_IDS ||
      'agent_8901m0sn6y14eegsqh7mmgdswm92,agent_9901m0sn70f1ejn84enhccrns2kt,agent_1201m0sn71mvf3arwzfwv4h9s2v1'
    ).split(',').map((s) => s.trim()).filter(Boolean),
  )
  const agentId: string | null = d.agent_id ?? d.metadata?.agent_id ?? null
  if (agentId && OUTREACH_AGENTS.has(agentId)) {
    const ingestBase = process.env.ARC_INGEST_BASE || 'https://arc.bconclub.com'
    const ingestSecret = process.env.ARC_INGEST_SECRET || ''
    if (!ingestSecret) {
      // 500 so ElevenLabs retries once the secret is configured; silently
      // acknowledging would drop the transcript forever.
      console.error('[webhooks/elevenlabs] outreach call but ARC_INGEST_SECRET unset')
      return NextResponse.json({ ok: false, reason: 'arc_not_configured' }, { status: 500 })
    }
    const lines = transcript.map((t) => `${t.role}: ${t.text}`).join('\n')
    const summary = d.analysis?.transcript_summary ?? ''
    try {
      const fwd = await fetch(`${ingestBase}/api/agent/outreach-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ingestSecret}` },
        body: JSON.stringify({
          phone,
          transcript: (summary ? `SUMMARY: ${summary}\n\n` : '') + lines,
          disposition: pick('interest') === 'yes' ? 'interested' : undefined,
        }),
      })
      if (!fwd.ok) {
        const detail = await fwd.text().catch(() => '')
        // 404 = no ARC target with this phone. Real, but not retryable - log
        // loudly and acknowledge so ElevenLabs stops resending.
        console.error('[webhooks/elevenlabs] ARC ingest failed', fwd.status, detail.slice(0, 200))
        if (fwd.status !== 404) return NextResponse.json({ ok: false, reason: 'arc_ingest_failed' }, { status: 500 })
      }
    } catch (err) {
      console.error('[webhooks/elevenlabs] ARC ingest unreachable', err)
      return NextResponse.json({ ok: false, reason: 'arc_unreachable' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, routed: 'arc', turns: transcript.length })
  }

  try {
    await recordCallTranscript({
      phone,
      conversationId,
      transcript,
      durationSecs: d.metadata?.call_duration_secs ?? null,
      status: d.status ?? null,
      summary: d.analysis?.transcript_summary ?? null,
      callerName: pick('caller_name'),
      businessType: pick('business_type'),
      interest: pick('interest'),
    })
  } catch (err) {
    // Answer 500 so ElevenLabs retries — a lost transcript is not recoverable
    // from our side once the webhook is acknowledged.
    console.error('[webhooks/elevenlabs] failed to record transcript', err)
    return NextResponse.json({ ok: false, reason: 'record_failed' }, { status: 500 })
  }

  // THE DROPPED-CALL WORKER. Every website-callback call gets a WhatsApp
  // continuation the moment it ends: calls drop, people get pulled away, and
  // the thread must not die with the line. PROXe's intent endpoint decides the
  // legal mode itself (in-window: the personal line below; out-of-window: the
  // approved proxe_postcall_v1 template with buttons), so this fire needs no
  // window logic here. Best-effort by design: a failed nudge must never make
  // ElevenLabs retry the webhook and double-write the transcript above.
  const intentBase = process.env.PROXE_INTENT_BASE
  const intentKey = process.env.PROXE_INBOUND_API_KEY
  if (phone && intentBase && intentKey) {
    const biz = pick('business_type')
    try {
      const nudge = await fetch(`${intentBase}/api/agent/outreach/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': intentKey },
        body: JSON.stringify({
          phone,
          text: `Hi, we just spoke on the call${biz ? ` about your ${biz}` : ''}. Let's continue here.`,
          template: 'proxe_postcall_v1',
          params: [pick('caller_name') || 'there'],
          source: 'postcall_wa',
        }),
      })
      const nres = await nudge.json().catch(() => ({}))
      console.log(`[webhooks/elevenlabs] postcall nudge ${phone}: ${nudge.status} mode=${nres.mode ?? '-'}`)
    } catch (err) {
      console.error('[webhooks/elevenlabs] postcall nudge failed', err)
    }
  }

  return NextResponse.json({ ok: true, turns: transcript.length })
}
