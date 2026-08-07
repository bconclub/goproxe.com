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

  return NextResponse.json({ ok: true, turns: transcript.length })
}
