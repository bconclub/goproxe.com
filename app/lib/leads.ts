'use client'

import { getAttribution } from './attribution'
import { newEventId } from './analytics'

/**
 * Fire-and-forget lead capture → our /api/lead route → Google Sheet.
 * Never throws: a failed write must not block the form UX (the lead is also in
 * GA `form_completed` + the visitor's localStorage as a backstop).
 *
 * First-touch traffic attribution (channel / UTM / referrer) is merged in here
 * automatically, so every lead carries where it came from — callers don't pass it.
 */

export interface LeadInput {
  type: 'lead' | 'booking'
  name?: string
  email?: string
  phone?: string
  brandName?: string
  websiteUrl?: string
  source?: string
  bookingLabel?: string
  bookingTime?: string
  /**
   * Shared with the pixel call for this same conversion. Pass the value
   * returned by trackLead(); only when it is absent does one get generated
   * here, which covers callers that fire no pixel event of their own.
   */
  eventId?: string
}

/** Read a cookie by name in the browser, or undefined. */
function cookie(name: string): string | undefined {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : undefined
}

export async function submitLead(input: LeadInput): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const attr = getAttribution()
    // Everything below exists for the Conversions API on the server side.
    //
    // eventId is the deduplication key: the server fires the same conversion
    // to Meta, and Meta merges the pixel event with the CAPI event ONLY when
    // event_name and event_id match. Without it the same lead counts twice —
    // worse than not sending it server-side at all. It is generated here, per
    // submission, and handed to both paths.
    //
    // _fbp / _fbc are Meta's own browser cookies. The server cannot read them
    // (they are first-party to this page), and they materially improve match
    // quality — _fbc in particular carries the click id from the ad.
    const capi = {
      eventId: input.eventId ?? newEventId(),
      fbp: cookie('_fbp'),
      fbc: cookie('_fbc'),
      sourceUrl: window.location.href,
    }
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, ...attr, ...capi }),
      // Survive a navigation that happens right after submit (booking → /thank-you).
      keepalive: true,
    })
    return res.ok
  } catch {
    return false
  }
}
