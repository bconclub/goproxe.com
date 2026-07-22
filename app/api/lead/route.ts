import { NextResponse } from 'next/server'
import { upsertProxeLead, updateProxeBooking } from '../../lib/leadsSupabase'

/**
 * Lead sink → PROXe/Beacon Supabase (`all_leads`) + Google Sheet.
 *
 * The browser POSTs captured leads here; this server route fans each lead out to
 * two places, in parallel, neither blocking the other:
 *   1. The shared PROXe/Beacon Supabase — goproxe.com dogfoods PROXe, so form
 *      leads land in the SAME `all_leads` the product runs on, tagged brand +
 *      source (see `app/lib/leadsSupabase.ts`). This is the source of truth.
 *   2. A Google Apps Script Web App bound to a sheet — a human-readable backup
 *      (see `google-apps-script/leads-sheet.gs`).
 * Both targets are server-only env vars, so neither URL/key ships to the client.
 *
 * Two payload kinds:
 *   { type: 'lead',    name, email, phone, brandName, websiteUrl, source }
 *   { type: 'booking', email, bookingLabel, bookingTime }
 * Both sinks upsert onto the existing lead (sheet by email, Supabase by phone /
 * email) so the booking update lands on the same row as the original lead.
 *
 * Never throws to the client — a failed write must not break the UX. The lead is
 * also in GA (`form_completed`) and the visitor's localStorage.
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

/** Forward the lead to the Google Sheet backup. Resolves a status, never throws. */
async function forwardToSheet(body: LeadPayload): Promise<'ok' | 'not_configured' | 'error'> {
  if (!WEBHOOK_URL) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[api/lead] LEADS_WEBHOOK_URL not set — lead not written to sheet:', {
        type: body.type,
        email: body.email,
      })
    }
    return 'not_configured'
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
      return 'error'
    }
    return 'ok'
  } catch (err) {
    console.error('[api/lead] sheet forward failed', err)
    return 'error'
  }
}

/** Push the lead into the shared PROXe/Beacon Supabase. Resolves, never throws. */
async function forwardToSupabase(body: LeadPayload): Promise<string> {
  try {
    const result =
      body.type === 'booking'
        ? await updateProxeBooking(body)
        : await upsertProxeLead(body)
    return result.ok ? 'ok' : result.reason
  } catch (err) {
    console.error('[api/lead] supabase forward threw', err)
    return 'db_error'
  }
}

export async function POST(request: Request) {
  let body: LeadPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  // Fan out to both sinks in parallel. The Supabase row is the source of truth;
  // the sheet is a backup. We report ok if EITHER captured the lead, so a single
  // sink being unconfigured/down never breaks the form UX.
  const [supabase, sheet] = await Promise.all([
    forwardToSupabase(body),
    forwardToSheet(body),
  ])

  const captured = supabase === 'ok' || sheet === 'ok'
  return NextResponse.json({ ok: captured, supabase, sheet })
}
