import { NextResponse } from 'next/server'

/**
 * Lead sink → Google Sheet.
 *
 * The browser POSTs captured leads here; this server route forwards them to a
 * Google Apps Script Web App bound to the target sheet (see
 * `google-apps-script/leads-sheet.gs`). Keeping the Apps Script URL in a
 * server-only env var (`LEADS_WEBHOOK_URL`) means it never ships to the client.
 *
 * Two payload kinds:
 *   { type: 'lead',    name, email, phone, brandName, websiteUrl, source }
 *   { type: 'booking', email, bookingLabel, bookingTime }
 * The Apps Script upserts by email, so the booking update lands on the same row
 * as the original lead.
 *
 * Never throws to the client — a failed sheet write must not break the UX. The
 * lead is also in GA (`form_completed`) and the visitor's localStorage.
 */

const WEBHOOK_URL = process.env.LEADS_WEBHOOK_URL

interface LeadPayload {
  type?: 'lead' | 'booking'
  name?: string
  email?: string
  phone?: string
  brandName?: string
  websiteUrl?: string
  source?: string
  bookingLabel?: string
  bookingTime?: string
  // First-touch attribution
  channel?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
  landingPage?: string
}

export async function POST(request: Request) {
  let body: LeadPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  if (!WEBHOOK_URL) {
    // Not configured yet — accept the request so the UX flows, but flag it.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[api/lead] LEADS_WEBHOOK_URL not set — lead not written to sheet:', {
        type: body.type,
        email: body.email,
      })
    }
    return NextResponse.json({ ok: false, reason: 'not_configured' })
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: body.type ?? 'lead',
        name: body.name ?? '',
        email: body.email ?? '',
        phone: body.phone ?? '',
        brand: body.brandName ?? '',
        website: body.websiteUrl ?? '',
        source: body.source ?? '',
        bookingDate: body.bookingLabel ?? '',
        bookingTime: body.bookingTime ?? '',
        channel: body.channel ?? '',
        utmSource: body.utmSource ?? '',
        utmMedium: body.utmMedium ?? '',
        utmCampaign: body.utmCampaign ?? '',
        referrer: body.referrer ?? '',
        landingPage: body.landingPage ?? '',
        receivedAt: new Date().toISOString(),
      }),
      // Apps Script web apps 302-redirect to googleusercontent; follow it.
      redirect: 'follow',
    })

    if (!res.ok) {
      console.error('[api/lead] sheet webhook returned', res.status)
      return NextResponse.json({ ok: false, reason: 'sheet_error' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/lead] forward failed', err)
    return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
  }
}
