import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { oncallWhatsAppSent } from '../../../lib/oncallWhatsAppSent'

/**
 * ElevenLabs client tool webhook: send on-call WhatsApp during the conversation.
 *
 * QC-02 Mother Dental (bff504ae): the agent promised a WhatsApp demo mid-call,
 * but nothing sent until the generic post-call continuation fired after hangup.
 * This is the missing piece — the tool the agent should invoke while they are
 * still on the line, so the promised message arrives immediately.
 *
 * The agent is configured with a webhook tool that calls this route when it
 * needs to send the demo/link. This endpoint:
 * 1. Verifies the tool webhook signature (if configured)
 * 2. Sends the on-call WhatsApp message via PROXE_INTENT_BASE
 * 3. Records the send in a tracking Map so post-call knows not to duplicate
 *
 * Track by conversation_id: ElevenLabs passes it in the tool webhook payload,
 * and the post-call webhook reads it back from the transcript event. The Map
 * is process-local (resets on deploy), which is fine: a duplicate send after
 * restart is better than never sending at all.
 *
 * Auth: ElevenLabs tool webhooks can be signed. If ELEVENLABS_TOOL_WEBHOOK_SECRET
 * is set, the signature is required and checked. Otherwise, the endpoint is open
 * (safe for DEV/staging; set the secret in production).
 */

export const dynamic = 'force-dynamic'

const TOOL_SECRET = process.env.ELEVENLABS_TOOL_WEBHOOK_SECRET || ''
const INTENT_BASE = process.env.PROXE_INTENT_BASE
const INTENT_KEY = process.env.PROXE_INBOUND_API_KEY

function verifyToolSignature(rawBody: string, header: string | null): boolean {
  if (!TOOL_SECRET) return true // No secret configured = open endpoint
  if (!header) return false

  // ElevenLabs tool webhook signatures use the same format as the post-call
  // webhook: `t=<unix>,v0=<hex hmac>` where the payload is `<t>.<raw body>`.
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
  if (!Number.isFinite(age) || age > 30 * 60) return false // 30min tolerance

  const expected = crypto.createHmac('sha256', TOOL_SECRET).update(`${ts}.${rawBody}`).digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(sig, 'utf8')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const raw = await request.text()

  if (TOOL_SECRET && !verifyToolSignature(raw, request.headers.get('elevenlabs-signature'))) {
    console.error('[agent/send-oncall-wa] signature verification failed')
    return NextResponse.json({ ok: false, reason: 'invalid_signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_json' }, { status: 400 })
  }

  // ElevenLabs tool webhook payload carries:
  // - conversation_id: join back to the post-call event
  // - tool_call_id: unique per invocation
  // - parameters: whatever the agent passed (phone, business_type, etc.)
  // Two shapes arrive here. The ElevenLabs tool posts the request_body_schema
  // FLAT ({ phone, business_type, conversation_id }); the older wrapped shape
  // ({ conversation_id, parameters: { phone } }) is kept so nothing that still
  // sends it breaks. Reading only the wrapped shape was why every live tool
  // call 400'd with "missing phone" while the agent told the caller it was sent.
  const params = payload.parameters ?? payload
  const conversationId: string | null = payload.conversation_id ?? params.conversation_id ?? null
  const phone: string | null = params.phone ?? null

  if (!conversationId) {
    console.error('[agent/send-oncall-wa] missing conversation_id')
    return NextResponse.json({ ok: false, reason: 'missing_conversation_id' }, { status: 400 })
  }
  if (!phone) {
    console.error('[agent/send-oncall-wa] missing phone parameter')
    return NextResponse.json({ ok: false, reason: 'missing_phone' }, { status: 400 })
  }

  if (!INTENT_BASE || !INTENT_KEY) {
    console.error('[agent/send-oncall-wa] PROXE_INTENT_BASE or PROXE_INBOUND_API_KEY not configured')
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  // Check if we already sent for this conversation (double-tap guard).
  // The post-call webhook will also check this before sending the generic
  // continuation, so only one message goes out per conversation.
  if (oncallWhatsAppSent.has(conversationId)) {
    console.log(`[agent/send-oncall-wa] ${conversationId} already sent, skipping duplicate`)
    return NextResponse.json({ ok: true, already_sent: true })
  }

  // Extract optional business context from tool parameters. The agent is
  // instructed to pass business_type if known, so the message can reference it.
  const biz = params.business_type ?? null
  const template = 'proxe_call_followup_util_v2'
  const text = `Hi, we just spoke over a call${biz ? ` about your ${biz}` : ''}. We can continue here.`

  try {
    const send = await fetch(`${INTENT_BASE}/api/agent/outreach/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': INTENT_KEY },
      body: JSON.stringify({ phone, text, template, source: 'oncall_wa' }),
    })

    if (!send.ok) {
      const detail = await send.text().catch(() => '')
      console.error('[agent/send-oncall-wa] intent send failed', send.status, detail.slice(0, 200))
      return NextResponse.json({ ok: false, reason: 'intent_failed', status: send.status }, { status: 502 })
    }

    const result = await send.json().catch(() => ({}))
    oncallWhatsAppSent.set(conversationId, Date.now())
    console.log(`[agent/send-oncall-wa] sent to ${phone} conv=${conversationId} mode=${result.mode ?? '-'}`)

    return NextResponse.json({ ok: true, sent: true, conversation_id: conversationId })
  } catch (err) {
    console.error('[agent/send-oncall-wa] intent send threw', err)
    return NextResponse.json({ ok: false, reason: 'send_failed' }, { status: 502 })
  }
}
