import { NextResponse } from 'next/server'

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
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[api/callback] ElevenLabs dial failed', res.status, detail.slice(0, 300))
      // A failed dial shouldn't lock them out of retrying.
      lastByPhone.delete(phone)
      lastByIp.delete(ip)
      return NextResponse.json({ ok: false, reason: 'dial_failed' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/callback] dial threw', err)
    lastByPhone.delete(phone)
    lastByIp.delete(ip)
    return NextResponse.json({ ok: false, reason: 'dial_failed' }, { status: 502 })
  }
}
