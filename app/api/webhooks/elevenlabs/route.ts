import { callOwner, callEvidence } from '../../../lib/outreachPolicy'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { recordCallTranscript } from '../../../lib/leadsSupabase'
import { oncallWhatsAppSent } from '../../../lib/oncallWhatsAppSent'

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

  const agentId: string | null = d.agent_id ?? d.metadata?.agent_id ?? null;
  const owner = callOwner(agentId);
  if (owner === 'unknown') return NextResponse.json({ ok: false, reason: 'unknown_agent' }, { status: 422 });
  const evidence = callEvidence({ ...d, status: d.status || 'done' });

  if (owner === 'arc') {
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
          conversation_id: conversationId,
          transcript: (summary ? `SUMMARY: ${summary}\n\n` : '') + lines,
          disposition: evidence.outcome,
          callback_request: evidence.callback_request,
          occurred_at: d.metadata?.start_time_unix_secs ? new Date(d.metadata.start_time_unix_secs * 1000).toISOString() : undefined,
          target_id: d.conversation_initiation_client_data?.dynamic_variables?.arc_target_id || undefined,
          agent_id: agentId,
        }),
      })
      if (!fwd.ok) {
        const detail = await fwd.text().catch(() => '')
        console.error('[webhooks/elevenlabs] ARC ingest failed', fwd.status, detail.slice(0, 200))
        return NextResponse.json({ ok: false, reason: 'arc_ingest_failed' }, { status: 500 })
      }
    } catch (err) {
      console.error('[webhooks/elevenlabs] ARC ingest unreachable', err)
      return NextResponse.json({ ok: false, reason: 'arc_unreachable' }, { status: 500 })
    }

    // Prospect and test calls remain in ARC. Qualification and promotion are explicit.
    return NextResponse.json({ ok: true, routed: 'arc', turns: transcript.length });
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
      city: pick('city'),
      // The visitor asked for this call on the site: an inbound request we
      // fulfilled by dialling. Not outreach.
      direction: 'inbound',
      kind: 'callback',
      agentId,
      agentName: d.agent_name ?? d.metadata?.agent_name ?? null,
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

  // QC-02 FIX: check if the on-call WhatsApp already sent mid-conversation.
  // Mother Dental (bff504ae): agent promised a WA during the call but nothing
  // sent, then this post-call continuation fired after hangup. The fix adds
  // /api/agent/send-oncall-wa as an ElevenLabs tool the agent can invoke while
  // they are still talking. That tool records the send in oncallWhatsAppSent.
  // If present, skip this generic post-call message to avoid a duplicate.
  //
  // Edge cases:
  // 1. On-call send succeeds → post-call skips (no duplicate)
  // 2. On-call send fails (bad network, intent API down) → post-call sends
  //    as fallback, so the caller still gets ONE message
  // 3. Agent never invokes the tool (prompt issue, tool not configured) →
  //    post-call sends as before (status quo, no regression)
  //
  // The tracking Map is process-local (resets on deploy). A duplicate after
  // restart is acceptable: better two messages than zero after the agent
  // promised one on the call.
  const alreadySent = conversationId && oncallWhatsAppSent.has(conversationId)

  // Interested callers get the message TOO - a different one, not none.
  //
  // The 27 Aug "skip after interest=yes" rule inverted the product: the agent
  // promises interested callers a WhatsApp demo on the call, and interest=yes
  // then excluded exactly those people from the send. Sam and Dr. Swapna said
  // yes, were told "you should see the message now", stared at a silent phone,
  // and one call burned three rounds of "have you received it?" / "No".
  // Meanwhile Nitin got a message only because his call read as a drop - and
  // it was the "our call got disconnected" copy after a completed call.
  //
  // So: interest=yes -> proxe_postcall_noname_v1 ("we just spoke... say
  // anything and see it work"), the demo the agent promised. Everyone else who
  // actually talked -> the continuation nudge as before. Only genuine short
  // hangups get nothing. Both templates are variable-free, so the same intent
  // route sends either.
  // ONE message for every real conversation, no cleverness. The interest=yes
  // branch lasted a day: the extractor missed "Sure. Thank you very much" as
  // interest, so a doctor who agreed on the call still got "our call just now
  // got disconnected" - after a complete, polite conversation (Z, 27 Aug).
  // The copy Z wants after ANY call we actually had: we just spoke, continue
  // here. That is proxe_call_followup_util_v2, verbatim. The "disconnected"
  // template is retired from this path entirely.
  const intentBase = process.env.PROXE_INTENT_BASE
  const intentKey = process.env.PROXE_INBOUND_API_KEY
  if (phone && intentBase && intentKey && !isShortHangup && !alreadySent) {
    const biz = pick('business_type')
    const template = 'proxe_call_followup_util_v2'
    const text = `Hi, we just spoke over a call${biz ? ` about your ${biz}` : ''}. We can continue here.`
    try {
      const nudge = await fetch(`${intentBase}/api/agent/outreach/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': intentKey },
        body: JSON.stringify({ phone, text, template, source: 'postcall_wa' }),
      })
      const nres = await nudge.json().catch(() => ({}))
      console.log(`[webhooks/elevenlabs] postcall followup ${phone}: ${nudge.status} mode=${nres.mode ?? '-'}`)
    } catch (err) {
      console.error('[webhooks/elevenlabs] postcall send failed', err)
    }
  } else if (isShortHangup) {
    console.log(`[webhooks/elevenlabs] skipped postcall send for short hangup: ${durationSecs}s, user_spoke=${userSpoke}`)
  } else if (alreadySent) {
    console.log(`[webhooks/elevenlabs] skipped postcall send: oncall WA already sent conv=${conversationId}`)
  }

  return NextResponse.json({ ok: true, turns: transcript.length })
}
