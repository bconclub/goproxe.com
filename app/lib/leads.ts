'use client'

import { getAttribution } from './attribution'

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
}

export async function submitLead(input: LeadInput): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const attr = getAttribution()
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, ...attr }),
      // Survive a navigation that happens right after submit (booking → /thank-you).
      keepalive: true,
    })
    return res.ok
  } catch {
    return false
  }
}
