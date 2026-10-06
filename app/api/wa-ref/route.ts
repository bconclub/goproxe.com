import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '../../lib/supabase'

/**
 * Website WhatsApp button source code (Z, 6 Oct 2026).
 *
 * The button opens WhatsApp with "Hi, I want to know more about PROXe. PX-7K2QF".
 * At the click, this stores the visitor's campaign against that code. When the first WhatsApp
 * message arrives, PROXe core strips the code from the message and attaches
 * the campaign to the lead, so the customer never sees a tracking tag.
 * Stored in dashboard_settings (key "waref:<code>"): a plain key-value table,
 * so the rows never show up as chat sessions or leads.
 */
export async function POST(request: NextRequest) {
  let body: any = {}
  try { body = JSON.parse(await request.text()) } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  const code = String(body.code || '')
  if (!/^[A-Z2-9]{5}$/.test(code)) return NextResponse.json({ ok: false }, { status: 400 })
  const attr = body.attribution && typeof body.attribution === 'object' ? body.attribution : {}
  const clean: Record<string, string> = {}
  for (const k of ['channel', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'referrer', 'landing_page']) {
    const v = attr[k]
    if (typeof v === 'string' && v.trim()) clean[k] = v.trim().slice(0, 400)
  }
  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 })
  const { error } = await supabase.from('dashboard_settings').insert({
    key: `waref:${code}`,
    value: { attribution: clean, location: String(body.location || '').slice(0, 60), brand: process.env.PROXE_LEAD_BRAND || 'proxe', at: new Date().toISOString() },
    description: 'Website WhatsApp button source code',
  })
  if (error) {
    console.error('[api/wa-ref] insert failed', error.code, error.message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
