import { NextResponse } from 'next/server'
import { lastCallbackAt, recordCallbackDial, scheduleCallback } from '../../lib/leadsSupabase'
import { isQuiet, nextOpenLabel, nextOpenTime } from '../../lib/quietHours'

/**
 * Hero phone capture → instant outbound call from the PROXe voice agent.
 *
 * POST { phone, market? } — normalises the number to E.164 and asks ElevenLabs
 * to dial it from our SIP number (+91 80653 55717, PROXe Vobiz outbound) as
 * the "PROXe Website Callback" agent. The whole point of the hero capture is
 * that PROXe calls within seconds of the tap — this route IS the product demo.
 *
 * The agent/phone IDs are identifiers, not secrets — hardcoded defaults so the
 * VPS needs only ELEVENLABS_API_KEY in its .env.local. Env vars override for
 * swapping agents without a deploy.
 *
 * Abuse guard: this endpoint makes real, billable phone calls, so it carries a
 * small in-memory cooldown — one call per phone number per 24 hours, one per
 * IP per minute. Process-local (resets on restart, single-instance pm2 app),
 * which is fine for a v1 guard.
 */

const API_KEY = process.env.ELEVENLABS_API_KEY
const AGENT_ID = process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra'
const PHONE_NUMBER_ID = process.env.ELEVENLABS_PHONE_NUMBER_ID || 'phnum_3701m0wakhjte0zr5fyk25yjpe01'

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
const SYSTEM_PROMPT = `You are PROXe, an AI lead conversion system, speaking on a phone call you placed yourself.

WHO YOU ARE
PROXe captures every lead a business gets across website chat, WhatsApp, Instagram DM, Facebook Messenger, email and voice. One unified memory across all of them, so a customer never repeats themselves. You follow up automatically, score every lead, and hand the ready-to-buy ones to the owner's team.

WHY THIS CALL MATTERS
This person left their number on goproxe.com seconds ago and you rang immediately. That speed is the entire pitch: most businesses lose leads because nobody replies fast enough. Do not explain that you were triggered by a form. Just be the demonstration.

PRICING (only if asked)
Core is 9,999 rupees a month in India, or 149 dollars internationally. That covers every channel, up to 500 leads managed per month, and 2 team seats. Extra seats are 999 rupees each. Multi-location or high volume is quoted on a call.

DISCOVERY IS THE CALL. One question at a time, in this order, reacting to
their actual words. Never recite generalities about "many businesses".
1. What does the business do? (Skip if already known - reference it instead.)
2. Where do leads come from today: ads, Instagram, referrals, walk-ins, portals?
   Roughly how many enquiries a month? Get a real number, gently.
3. THE PAIN QUESTION - ask it on every call, never skip it, never soften it.
   Are they LOSING customers because those enquiries are not being taken care
   of properly? Vary the wording so it never sounds scripted:
     "Are you losing customers because nobody gets back to them in time?"
     "Do some of those go cold before anyone answers?"
     "When it gets busy, do enquiries just sit there?"
   Ask it, then STOP and let them answer. Do not answer it for them and do not
   tell them what they are losing - their own answer is what closes the call.
Then mirror the leak back IN THEIR NUMBERS ("thirty enquiries and one person
replying after class ends - that's where they go cold") and close: a WhatsApp
demo, or a 15-minute call with the founder.

HOW TO TALK
- This is a phone call. One or two sentences per turn, never a paragraph.
- Ask one question at a time, then stop and actually listen.
- Never philosophise. No "many businesses find..." lines. Their business,
  their numbers, their leak - or say nothing and ask the next question.
- If they are interested, offer to send details on WhatsApp or book a short call with the team.`

// 90s, not 5 minutes. Long enough to swallow a double-tap or an impatient
// second press, short enough that someone deliberately testing the demo is not
// locked out. Five minutes made the product look broken to the one person most
// likely to be trying it repeatedly: us.
// One call per number per 24 hours. 90 seconds only stopped an accidental
// double-tap; it let the same person re-trigger the dialler all day and burn
// voice minutes. The IP window stays short because several people can
// legitimately share one office/mobile IP.
const PHONE_COOLDOWN_MS = 24 * 60 * 60 * 1000
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
    // Anything else typed into the India form is a typo (an 11-digit "9722…"
    // became +972 and rang Israel four times in Aug 2026). Never guess a
    // country from a typo.
    return null
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

  let body: { phone?: string; market?: string; name?: string; business?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  const phone = toE164(body.phone ?? '', body.market === 'usd' ? 'usd' : 'inr')
  const callerName = String(body.name ?? '').trim().replace(/\s+/g, ' ').slice(0, 60)
  const callerBusiness = String(body.business ?? '').trim().replace(/\s+/g, ' ').slice(0, 80)
  if (!phone) {
    return NextResponse.json({ ok: false, reason: 'bad_phone' }, { status: 400 })
  }

  const now = Date.now()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  // VISITOR-INITIATED CALLS ARE EXEMPT FROM QUIET HOURS. Z, 31 Aug 2026:
  // "the rule was given only for OUTBOUND calls, not for people who are
  // trying to call us. If they put their number at this point in time, they
  // can talk." Someone typing their number at 1 AM is awake, at their phone,
  // asking - by 9 AM they have cooled. The 8 PM-9 AM wall stays absolute for
  // everything PROACTIVE (crons, scheduled retries, sequences); this route is
  // the person knocking, and we answer.

  // The 24h phone limit is answered from the DATABASE, not the Map below.
  // The Map is per-process: every deploy and every pm2 restart emptied it, so
  // on a site that redeploys on each push the limit was really "one call per
  // number per deploy". recordCallbackDial has been writing the timestamp all
  // along; this reads it back. The Map stays as a cheap first line against
  // double-taps within a single process, and as the IP guard.
  const lastDial = await lastCallbackAt(phone)
  if (lastDial && now - lastDial.getTime() < PHONE_COOLDOWN_MS) {
    const hoursLeft = Math.ceil((PHONE_COOLDOWN_MS - (now - lastDial.getTime())) / 3_600_000)
    console.log('[api/callback] suppressed, called within 24h', { hoursLeft })
    return NextResponse.json({ ok: false, reason: 'recently_called', hoursLeft })
  }

  if (now - (lastByPhone.get(phone) ?? 0) < PHONE_COOLDOWN_MS || now - (lastByIp.get(ip) ?? 0) < IP_COOLDOWN_MS) {
    // Suppressed by the guard: NO call was placed. This used to answer
    // { ok: true } to "keep the UX calm", which meant the page showed
    // "Ringing… pick up" while nothing dialled — the product silently lying
    // about the one thing it exists to prove. Say what actually happened and
    // let the caller decide.
    return NextResponse.json({ ok: false, reason: 'recently_called' })
  }
  lastByPhone.set(phone, now)
  lastByIp.set(ip, now)
  sweep(lastByPhone, PHONE_COOLDOWN_MS)
  sweep(lastByIp, IP_COOLDOWN_MS)

  try {
    // PLAIN DIAL ONLY.
    //
    // v0.2.0 sent the script as a conversation_config_override and calls stopped
    // working. v0.2.2 added a 4xx fallback, which did not help: ElevenLabs
    // ACCEPTS the request (HTTP 200) and the conversation then fails to
    // initialise, so the phone rings and drops the moment it is answered. A 200
    // means no fallback can detect it.
    //
    // Two attempts, two live breakages, both because the override cannot be
    // tested from here - the local ELEVENLABS_API_KEY returns 401, so every
    // version of this shipped on an assumption. A call that rings and dies is
    // worse than a call with the wrong opening line, so the override stays out
    // until it can be verified against a working key.
    //
    // FIRST_MESSAGE and SYSTEM_PROMPT above are kept deliberately: they are the
    // reviewed copy, ready to reinstate, and are also exactly what should be
    // pasted into the agent's own configuration in the meantime.
    const res = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        agent_phone_number_id: PHONE_NUMBER_ID,
        to_number: phone,
        // Name + business from the hero's details step. Dynamic variables are
        // the supported per-call substitution (used by the outreach agents);
        // this is NOT a conversation_config_override, which broke twice.
        ...(callerName || callerBusiness
          ? { conversation_initiation_client_data: { dynamic_variables: {
              ...(callerName ? { first_name: callerName.split(' ')[0] } : {}),
              ...(callerBusiness ? { business_name: callerBusiness } : {}),
            } } }
          : {}),
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
      // Surface WHY, not just "failed". 401 here means the ELEVENLABS_API_KEY
      // on this server is wrong or revoked - the single most likely cause after
      // a key rotation, and previously indistinguishable from a bad number or a
      // dead agent without shell access to read the logs. Only the status code
      // is exposed, never the key or the response body.
      const reason =
        res.status === 401 ? 'elevenlabs_auth_failed'
        : res.status === 404 ? 'agent_or_number_not_found'
        : `dial_failed_${res.status}`
      return NextResponse.json({ ok: false, reason }, { status: 502 })
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
