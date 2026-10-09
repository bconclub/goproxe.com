import crypto from 'crypto'

/**
 * Meta Conversions API — the server-side twin of the browser pixel.
 *
 * WHY: the pixel is client-side JavaScript. Ad blockers, iOS tracking
 * prevention and privacy browsers drop a meaningful slice of it (commonly
 * 10–30%), and every dropped event is a conversion Meta never learns from, so
 * campaigns optimise on a partial picture and report a worse cost-per-result
 * than reality. CAPI fires the same conversion from our server, where nothing
 * can block it.
 *
 * DEDUPLICATION is the thing to get right. Meta merges a pixel event and a
 * CAPI event into one when they share `event_name` AND `event_id`. Without a
 * shared id the same conversion counts twice — worse than not sending it. Any
 * caller that also fires the pixel MUST pass the same eventId to both.
 *
 * PII: Meta requires user data to be SHA-256 hashed, lowercase and trimmed
 * first. Raw email or phone must never leave this file. Phones are normalised
 * to digits only (no +, no spaces) per Meta's spec.
 *
 * Fails silently and never throws: a conversion-tracking outage must not break
 * a lead capture or a payment webhook.
 */

const PIXEL_ID = process.env.META_PIXEL_ID || '1480338647459819'
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const TEST_CODE = process.env.META_CAPI_TEST_CODE // set only while validating in Events Manager
const API_VERSION = 'v21.0'

/** SHA-256 of a normalised value, or undefined when there is nothing to hash. */
function hash(value?: string | null): string | undefined {
  if (!value) return undefined
  const normalised = value.trim().toLowerCase()
  if (!normalised) return undefined
  return crypto.createHash('sha256').update(normalised).digest('hex')
}

/** Phone → digits only, then hashed. "+91 98765 43210" → hash("919876543210"). */
function hashPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined
  let digits = phone.replace(/\D/g, '')
  // Meta matches on the full number with country code. Our forms take a bare
  // 10-digit Indian mobile (and 0-prefixed), which hashed without 91 matched nobody.
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length === 10 && /^[6-9]/.test(digits)) digits = `91${digits}`
  if (digits.length < 8) return undefined
  return crypto.createHash('sha256').update(digits).digest('hex')
}

export type CapiEventName =
  | 'Lead'
  | 'Enquiry'
  | 'Purchase'
  | 'InitiateCheckout'
  | 'Schedule'
  | 'CompleteRegistration'

export interface CapiUser {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  /** Client IP and UA materially improve match quality — pass them through. */
  clientIp?: string | null
  userAgent?: string | null
  /** Meta's browser cookies, when the caller can read them. */
  fbp?: string | null
  fbc?: string | null
}

export interface CapiEvent {
  eventName: CapiEventName
  /** MUST match the pixel's eventID for the same conversion. */
  eventId: string
  /** The page the conversion happened on. */
  eventSourceUrl?: string
  user: CapiUser
  value?: number
  currency?: string
  /** Anything extra worth reporting; no PII here. */
  custom?: Record<string, string | number | boolean | undefined>
}

/**
 * One CAPI event object, hashed and ready for Meta, or null when it carries no
 * identifier Meta could match on. Shared by sendCapiEvent and the relay below.
 */
export function buildCapiEvent(event: CapiEvent): Record<string, unknown> | null {
  const userData: Record<string, unknown> = {
    em: hash(event.user.email),
    ph: hashPhone(event.user.phone),
    fn: hash(event.user.firstName),
    // Same person across events: the phone if we have it, else the email.
    external_id: hashPhone(event.user.phone) || hash(event.user.email),
    client_ip_address: event.user.clientIp || undefined,
    client_user_agent: event.user.userAgent || undefined,
    fbp: event.user.fbp || undefined,
    fbc: event.user.fbc || undefined,
  }
  // Meta rejects nulls; strip anything we could not build.
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k])

  // Every event needs at least one user identifier or it cannot be attributed.
  const hasIdentifier = Boolean(userData.em || userData.ph || userData.fbp || userData.fbc)
  if (!hasIdentifier) return null

  return {
    event_name: event.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event.eventId,
    event_source_url: event.eventSourceUrl,
    action_source: 'website',
    user_data: userData,
    custom_data: {
      ...(event.value !== undefined ? { value: event.value } : {}),
      ...(event.currency ? { currency: event.currency } : {}),
      ...(event.custom ?? {}),
    },
  }
}

/** Which match keys an event carries, in Meta's names: what the admin shows per send. */
export function matchKeys(item: Record<string, unknown> | null): string[] {
  const ud = (item?.user_data as Record<string, unknown>) || {}
  return Object.keys(ud).filter((k) => ud[k] !== undefined && ud[k] !== null && ud[k] !== '')
}

export interface CapiResult {
  sent: boolean
  /** Why it did not go: no_token, no_identifier, http_<status>: <message>, network. */
  error?: string
  fbtrace?: string | null
  eventsReceived?: number | null
  /** The event as built, so a caller can stamp it or hand it to the relay. */
  item: Record<string, unknown> | null
}

/**
 * Send one conversion and report exactly what happened. Never throws.
 *
 * When this server has no token (9 Oct 2026: goproxe.com's was missing), the
 * caller stores `item` on the lead as `relay`, and PROXe core's meta-qualified
 * cron sends it with core's own token. Same pixel, same event id, so it still
 * dedupes against the browser's copy.
 */
export async function sendCapiEventResult(event: CapiEvent): Promise<CapiResult> {
  const item = buildCapiEvent(event)
  if (!item) return { sent: false, error: 'no_identifier', item }
  if (!ACCESS_TOKEN) {
    // Loud in production too (7 Oct 2026: it was silent there, and every
    // server-side conversion was dropped for days without anyone seeing it).
    console.warn('[capi] META_CAPI_ACCESS_TOKEN is not set: left for the PROXe core relay', event.eventName)
    return { sent: false, error: 'no_token', item }
  }
  const payload = {
    data: [item],
    ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}),
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    const body = (await res.json().catch(() => ({}))) as Record<string, any>
    if (!res.ok) {
      const msg = String(body?.error?.message || '').slice(0, 200)
      console.error('[capi] rejected', event.eventName, res.status, msg)
      return { sent: false, error: `http_${res.status}: ${msg}`, fbtrace: body?.fbtrace_id ?? null, item }
    }
    return { sent: true, fbtrace: body?.fbtrace_id ?? null, eventsReceived: body?.events_received ?? null, item }
  } catch (err) {
    // A tracking failure must never surface to the visitor or break a webhook.
    console.error('[capi] send failed', event.eventName, (err as Error)?.message)
    return { sent: false, error: 'network', item }
  }
}

/** Send one conversion. Returns true only when Meta accepted it. Never throws. */
export async function sendCapiEvent(event: CapiEvent): Promise<boolean> {
  return (await sendCapiEventResult(event)).sent
}

/**
 * Deterministic event id from something already unique to the conversion.
 *
 * Used where the browser cannot hand us its own id — e.g. the Dodo webhook,
 * which fires with no browser in the loop. Deriving from the payment id means
 * a webhook retry produces the SAME id, so Meta deduplicates the retry instead
 * of counting a second Purchase.
 */
export function deriveEventId(prefix: string, seed: string): string {
  return `${prefix}_${crypto.createHash('sha256').update(seed).digest('hex').slice(0, 24)}`
}
