import { NextResponse } from 'next/server'
import { recordCallbackDial } from '../../lib/leadsSupabase'

/**
 * Hero phone capture → instant outbound call from the PROXe voice agent.
 *
 * POST { phone, market? } — normalises the number to E.164 and asks ElevenLabs
 * to dial it from our SIP number (+91 80467 33388) as the "PROXe Website
 * Callback" agent. The whole point of the hero capture is that PROXe calls
 * within seconds of the tap — this route IS the product demo.
 *
 * The agent/phone IDs are identifiers, not secrets — hardcoded defaults so the
 * VPS needs only ELEVENLABS_API_KEY in its .env.local. Env vars override for
 * swapping agents without a deploy.
 *
 * Abuse guard: this endpoint makes real, billable phone calls, so it carries a
 * small in-memory cooldown — one call per phone number per 5 minutes, one per
 * IP per minute. Process-local (resets on restart, single-instance pm2 app),
 * which is fine for a v1 guard.
 */

const API_KEY = process.env.ELEVENLABS_API_KEY
const AGENT_ID = process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra'
const PHONE_NUMBER_ID = process.env.ELEVENLABS_PHONE_NUMBER_ID || 'phnum_6501kwq4tr8kfats4mezvr37krw9'

/** Calling voice. Identifier, not a secret; env overrides without a deploy. */
const VOICE_ID = process.env.ELEVENLABS_CALLBACK_VOICE_ID || '0muxiGNHAVvmM1qWRtyV'

/**
 * The opening line. It leads with what PROXe IS, because the call itself is the
 * proof: they tapped a number on a website and the AI rang back in seconds.
 * Narrating their own click back at them ("you clicked the hero section, you
 * dropped your details") tells them what they already know and sounds like a
 * machine reading its logs.
 */
const FIRST_MESSAGE =
  "Hi, this is PROXe. I'm the AI that answers every lead a business gets, on WhatsApp, website chat, Instagram, and calls like this one. You just watched me do it. What does your business do?"

/**
 * Voice context. Deliberately short: on a phone call the model has no screen to
 * fall back on, and long instructions make it ramble. Facts here must match the
 * pricing card (PricingSection.tsx) - if they drift, the caller is quoted one
 * price and charged another.
 */
const SYSTEM_PROMPT = `You are PROXe, an AI customer acquisition system, speaking on a phone call you placed yourself.

WHO YOU ARE
PROXe captures every lead a business gets across website chat, WhatsApp, Instagram DM, Facebook Messenger, email and voice. One unified memory across all of them, so a customer never repeats themselves. You follow up automatically, score every lead, and hand the ready-to-buy ones to the owner's team.

WHY THIS CALL MATTERS
This person left their number on goproxe.com seconds ago and you rang immediately. That speed is the entire pitch: most businesses lose leads because nobody replies fast enough. Do not explain that you were triggered by a form. Just be the demonstration.

PRICING (only if asked)
Core is 9,999 rupees a month in India, or 149 dollars internationally. That covers every channel, up to 500 leads managed per month, and 2 team seats. Extra seats are 999 rupees each. Multi-location or high volume is quoted on a call.

HOW TO TALK
- This is a phone call. One or two sentences per turn, never a paragraph.
- Ask one question at a time, then stop and actually listen.
- Find out what their business is and where they lose leads today. That is the goal of this call.
- If they are interested, offer to send details on WhatsApp or book a short call with the team.
- If they are busy or it is a bad time, say so is fine, offer to message instead, and let them go politely.
- Never claim a certification, integration or customer you have not been told about here.
- Never use the words "hero section", "form", "submission" or "lead capture" about them. They are a person, not a funnel step.`

const PHONE_COOLDOWN_MS = 5 * 60 * 1000
const IP_COOLDOWN_MS = 60 * 1000
const lastByPhone = new Map<string, number>()
const lastByIp = new Map<string, number>()

/** Sweep stale entries so the maps can't grow unbounded. */
function sweep(map: Map<string, number>, ttl: number) {
  if (map.size < 500) return
  const now = Date.now()
  for (const [k, t] of map) if (now - t > ttl) map.delete(k)
}

/**
 * Free-form input → E.164. Digits with an explicit + pass through; bare
 * numbers get a country prefix from the visitor's market (detected client-side
 * from timezone/locale — same signal pricing uses).
 */
function toE164(raw: string, market: string): string | null {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return null
  if (trimmed.startsWith('+')) return `+${digits}`
  if (market === 'inr') {
    if (digits.length === 10) return `+91${digits}`
    if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  } else {
    if (digits.length === 10) return `+1${digits}`
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  }
  // Ambiguous but plausible length — assume they typed a full international
  // number without the +.
  return `+${digits}`
}

export async function POST(request: Request) {
  if (!API_KEY) {
    console.error('[api/callback] ELEVENLABS_API_KEY not set — cannot dial')
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  let body: { phone?: string; market?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  const phone = toE164(body.phone ?? '', body.market === 'usd' ? 'usd' : 'inr')
  if (!phone) {
    return NextResponse.json({ ok: false, reason: 'bad_phone' }, { status: 400 })
  }

  const now = Date.now()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (now - (lastByPhone.get(phone) ?? 0) < PHONE_COOLDOWN_MS || now - (lastByIp.get(ip) ?? 0) < IP_COOLDOWN_MS) {
    // Already ringing (or just rang) — report ok so the UX stays calm.
    return NextResponse.json({ ok: true, reason: 'cooldown' })
  }
  lastByPhone.set(phone, now)
  lastByIp.set(ip, now)
  sweep(lastByPhone, PHONE_COOLDOWN_MS)
  sweep(lastByIp, IP_COOLDOWN_MS)

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        agent_phone_number_id: PHONE_NUMBER_ID,
        to_number: phone,
        // Script lives HERE, not in the ElevenLabs dashboard, so it is
        // reviewable and versioned with the page that triggers it. The agent's
        // own configured opening narrated our funnel back at the person -
        // "you clicked on a hero section, you dropped your details" - which
        // tells them what they just did instead of what PROXe is, and sounds
        // like a machine reading its own logs.
        //
        // NOTE: ElevenLabs only applies these when the agent has the matching
        // overrides enabled in its security settings. If the opening is still
        // the old one after deploying, that toggle is why.
        conversation_initiation_client_data: {
          conversation_config_override: {
            agent: {
              first_message: FIRST_MESSAGE,
              prompt: { prompt: SYSTEM_PROMPT },
            },
            tts: { voice_id: VOICE_ID },
          },
        },
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[api/callback] ElevenLabs dial failed', res.status, detail.slice(0, 300))
      // A failed dial shouldn't lock them out of retrying.
      lastByPhone.delete(phone)
      lastByIp.delete(ip)
      // Record the failure too: a lead we tried and could not reach is exactly
      // the one a human should pick up, and it is invisible if we only log
      // successes.
      await recordCallbackDial({ phone, status: 'failed', reason: `http_${res.status}` })
      return NextResponse.json({ ok: false, reason: 'dial_failed' }, { status: 502 })
    }

    const dialed = await res.json().catch(() => ({} as Record<string, unknown>))
    await recordCallbackDial({
      phone,
      status: 'dialing',
      conversationId: (dialed?.conversation_id as string) ?? null,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/callback] dial threw', err)
    lastByPhone.delete(phone)
    lastByIp.delete(ip)
    return NextResponse.json({ ok: false, reason: 'dial_failed' }, { status: 502 })
  }
}
