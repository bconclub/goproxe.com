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

  // OUTREACH DIALS: send to Arc for tracking, but ALSO write to PROXe for
  // intro/test agents. Cold-dial transcripts are prospect noise (Arc only),
  // but intro/test dials are real conversations that must show in chat SoT.
  // Intro agent added 2026-08-26 DEV fix: agent_0301m0na3jjdfkta2sza4h317m4d.
  const OUTREACH_AGENTS = new Set(
    (process.env.OUTREACH_AGENT_IDS ||
      'agent_8901m0sn6y14eegsqh7mmgdswm92,agent_9901m0sn70f1ejn84enhccrns2kt,agent_1201m0sn71mvf3arwzfwv4h9s2v1'
    ).split(',').map((s) => s.trim()).filter(Boolean),
  )
  const INTRO_TEST_AGENTS = new Set(
    (process.env.INTRO_TEST_AGENT_IDS || 'agent_0301m0na3jjdfkta2sza4h317m4d')
      .split(',').map((s) => s.trim()).filter(Boolean),
  )
  const agentId: string | null = d.agent_id ?? d.metadata?.agent_id ?? null
  const isOutreach = agentId && OUTREACH_AGENTS.has(agentId)
  const isIntroTest = agentId && INTRO_TEST_AGENTS.has(agentId)

  if (isOutreach || isIntroTest) {
    const ingestBase = process.env.ARC_INGEST_BASE || 'https://arc.bconclub.com'
    const ingestSecret = process.env.ARC_INGEST_SECRET || ''
    if (!ingestSecret) {
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
        console.error('[webhooks/elevenlabs] ARC ingest failed', fwd.status, detail.slice(0, 200))
        if (fwd.status !== 404) return NextResponse.json({ ok: false, reason: 'arc_ingest_failed' }, { status: 500 })
      }
    } catch (err) {
      console.error('[webhooks/elevenlabs] ARC ingest unreachable', err)
      return NextResponse.json({ ok: false, reason: 'arc_unreachable' }, { status: 500 })
    }

    // Pure outreach agents stop here (Arc-only). Intro/test agents continue
    // through to write the PROXe voice row below so the chat SoT shows it.
    if (isOutreach && !isIntroTest) {
      return NextResponse.json({ ok: true, routed: 'arc', turns: transcript.length })
    }
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

  // THE DROPPED-CALL WORKER — but NOT for short hangups. A ~10s call where
  // the user never spoke (client disconnect, wrong number, immediate hangup)
  // is a drop, not a conversation to continue. Only real calls that actually
  // talked get the WhatsApp continuation nudge.
  // DEV 2026-08-26: do not chase on WhatsApp after a 10s hangup.
  const durationSecs = d.metadata?.call_duration_secs ?? 0
  const userTurns = transcript.filter((t) => t.role === 'caller')
  const userSpoke = userTurns.some((t) => String(t.text || '').replace(/[.…\s]/g, '').length > 0)
  const isShortHangup = durationSecs <= 10 && !userSpoke

  // QC-20260827-02: do NOT nudge after a successful booking/demo. A 263s call
  // where the caller said yes and booked a demo is a win, not a drop. The
  // interest field (from data_collection) signals they expressed clear intent.
  // DEV 2026-08-27: skip continuation after interest=yes.
  const interest = pick('interest')
  const isSuccessfulBooking = interest === 'yes'

  const intentBase = process.env.PROXE_INTENT_BASE
  const intentKey = process.env.PROXE_INBOUND_API_KEY
  if (phone && intentBase && intentKey && !isShortHangup && !isSuccessfulBooking) {
    const biz = pick('business_type')
    try {
      const nudge = await fetch(`${intentBase}/api/agent/outreach/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': intentKey },
        body: JSON.stringify({
          phone,
          text: `Hi, we just spoke on the call${biz ? ` about your ${biz}` : ''}. Let's continue here.`,
          template: 'proxe_call_continuation_v1',
          source: 'postcall_wa',
        }),
      })
      const nres = await nudge.json().catch(() => ({}))
      console.log(`[webhooks/elevenlabs] postcall nudge ${phone}: ${nudge.status} mode=${nres.mode ?? '-'}`)
    } catch (err) {
      console.error('[webhooks/elevenlabs] postcall nudge failed', err)
    }
  } else if (isShortHangup) {
    console.log(`[webhooks/elevenlabs] skipped postcall nudge for short hangup: ${durationSecs}s, user_spoke=${userSpoke}`)
  } else if (isSuccessfulBooking) {
    console.log(`[webhooks/elevenlabs] skipped postcall nudge for successful booking: interest=${interest}`)
  }

  return NextResponse.json({ ok: true, turns: transcript.length })
}
