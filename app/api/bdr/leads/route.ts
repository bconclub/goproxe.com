import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '../../../lib/supabase'

/**
 * [DEV] Read-only BDR leads poll API — Arc ingestion from all_leads.
 *
 * GET /api/bdr/leads pulls PROXe leads for BDR ingestion into Arc. Read-only
 * only: no writes, no dials, no callbacks. Bearer-token authenticated; DEV
 * sets BDR_LEADS_READ_TOKEN on the VPS (not in git, not in OPS).
 *
 * Returns id, customer_name, phone, last_touchpoint, channel (derived),
 * booking_label / booking_time / booking_status, and a derived `stage` so
 * Arc can ingest stages without a CRM column on all_leads.
 *
 * Stage mapping (honest, no invented no-show/lost):
 *   - booking_status === 'Call Booked' → booked
 *   - last_touchpoint === 'voice' OR unified_context.voice.last_call_at → talking
 *   - else → new
 *
 * Query:
 *   - booked=1 → only rows with booking_status='Call Booked'
 *   - since=ISO → last_interaction_at >= since (daily poll)
 *   - limit → default 200, max 500
 *
 * CSO gates; after merge DEV sets BDR_LEADS_READ_TOKEN. BDR polls. No dials.
 */

const BRAND = process.env.PROXE_LEAD_BRAND || 'proxe'
const BDR_TOKEN = process.env.BDR_LEADS_READ_TOKEN

interface LeadRow {
  id: string
  customer_name: string | null
  phone: string | null
  last_touchpoint: string | null
  last_interaction_at: string | null
  unified_context: Record<string, any> | null
}

function deriveChannel(row: LeadRow): string | null {
  const ctx = row.unified_context
  if (!ctx) return row.last_touchpoint

  const webChannel = ctx.web?.attribution?.channel
  const webSource = ctx.web?.source
  return webChannel || webSource || row.last_touchpoint
}

function deriveStage(row: LeadRow): string {
  const ctx = row.unified_context
  const bookingStatus = ctx?.web?.booking_status

  if (bookingStatus === 'Call Booked') return 'booked'

  if (row.last_touchpoint === 'voice' || ctx?.voice?.last_call_at) {
    return 'talking'
  }

  return 'new'
}

/**
 * Timing-safe string comparison to prevent timing attacks on the token.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function GET(request: Request) {
  // Auth: require Bearer token from server env
  const authHeader = request.headers.get('authorization')
  if (!BDR_TOKEN || !authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  if (!timingSafeEqual(token, BDR_TOKEN)) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json(
      { ok: false, reason: 'not_configured' },
      { status: 500 }
    )
  }

  // Parse query params
  const { searchParams } = new URL(request.url)
  const bookedOnly = searchParams.get('booked') === '1'
  const since = searchParams.get('since')
  const rawLimit = searchParams.get('limit')
  const limit = Math.min(
    Math.max(1, parseInt(rawLimit || '200', 10)),
    500
  )

  try {
    let query = supabase
      .from('all_leads')
      .select('id, customer_name, phone, last_touchpoint, last_interaction_at, unified_context')
      .eq('brand', BRAND)
      .order('last_interaction_at', { ascending: false })
      .limit(limit)

    if (since) {
      query = query.gte('last_interaction_at', since)
    }

    if (bookedOnly) {
      query = query.contains('unified_context', {
        web: { booking_status: 'Call Booked' }
      })
    }

    const { data, error } = await query

    if (error) {
      console.error('[api/bdr/leads] query failed', error.code, error.message)
      return NextResponse.json(
        { ok: false, reason: 'db_error' },
        { status: 500 }
      )
    }

    const leads = (data || []).map((row: LeadRow) => {
      const ctx = row.unified_context || {}
      return {
        id: row.id,
        customer_name: row.customer_name,
        phone: row.phone,
        last_touchpoint: row.last_touchpoint,
        channel: deriveChannel(row),
        booking_label: ctx.web?.booking_label || null,
        booking_time: ctx.web?.booking_time || null,
        booking_status: ctx.web?.booking_status || null,
        stage: deriveStage(row),
        last_interaction_at: row.last_interaction_at,
      }
    })

    return NextResponse.json({
      ok: true,
      brand: BRAND,
      leads,
    })
  } catch (err) {
    console.error('[api/bdr/leads] request threw', err)
    return NextResponse.json(
      { ok: false, reason: 'server_error' },
      { status: 500 }
    )
  }
}

// Explicitly reject non-GET methods
export async function POST() {
  return NextResponse.json({ ok: false, reason: 'method_not_allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ ok: false, reason: 'method_not_allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ ok: false, reason: 'method_not_allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ ok: false, reason: 'method_not_allowed' }, { status: 405 })
}
