import { Fragment } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BDR_COOKIE, verifyBdrSession } from '../../lib/bdrSession'
import { getSupabaseServiceClient } from '../../lib/supabase'
import SignOut from '../SignOut'
import AdminNav from '../AdminNav'
import { ADMIN_CSS } from '../adminStyles'

/**
 * goproxe.com/admin/meta: everything we have told Meta about our leads
 * (9 Oct 2026, for the ads lead-quality audit).
 *
 * Source: all_leads.unified_context.capi_sent, a map of trigger key → send
 * record. Core's meta-qualified cron writes stage keys ("Qualified",
 * "Demo Taken", "Booking Made", "Closed Lost", "Lead"); the site writes
 * "site:Lead" / "site:Schedule". Read-only. Phones are masked.
 *
 * "Taught Meta wrong": a lead now in Closed Lost (junk) that we reported as a
 * Lead or QualifiedLead, i.e. a signal that trained the ads toward junk.
 *
 * Meta's own counts come from the pixel /stats endpoint with the server-side
 * CAPI token, which never reaches the browser.
 */

export const dynamic = 'force-dynamic'

const BRAND = process.env.PROXE_LEAD_BRAND || 'proxe'
const PIXEL_ID = process.env.META_PIXEL_ID || '1480338647459819'
const EVENTS = ['Lead', 'QualifiedLead', 'Schedule', 'DisqualifiedLead', 'Purchase'] as const
const POSITIVE = new Set(['Lead', 'QualifiedLead'])

type SendRecord = { at?: string; events?: string[]; test?: boolean; sent?: boolean; source?: string; event_id?: string; fbtrace?: string | null }
type LeadRow = { id: string; customer_name: string | null; phone: string | null; lead_stage: string | null; capi: Record<string, SendRecord> | null; attr: Record<string, any> | null }
type Send = { leadId: string; name: string; phone: string; stage: string; key: string; at: string; events: string[]; site: boolean; test: boolean; sent: boolean; fromAd: boolean; bad: boolean }

const ist = (d: string | number) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const maskPhone = (p: string | null) => {
  const d = (p || '').replace(/\D/g, '')
  return d.length >= 4 ? `••••••${d.slice(-4)}` : ''
}
const fromMetaAd = (a: Record<string, any> | null) =>
  !!a && (!!a.fbclid || /^(fb|facebook|ig|instagram|meta)\b/i.test(String(a.utm_source || '')))

/** Midnight today in IST, as a timestamp. */
function istMidnight() {
  const now = new Date()
  const ist = new Date(now.getTime() + 330 * 60_000)
  ist.setUTCHours(0, 0, 0, 0)
  return ist.getTime() - 330 * 60_000
}

type MetaStats = { ok: true; byWindow: Record<string, Record<string, number>> } | { ok: false; reason: string }

/** Meta's received-event counts (pixel + server), hourly buckets summed per window. */
async function loadMetaStats(windows: Record<string, number>): Promise<MetaStats> {
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!token) return { ok: false, reason: 'META_CAPI_ACCESS_TOKEN is not set on this server.' }
  try {
    const since = Math.floor(Math.min(...Object.values(windows)) / 1000)
    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/stats?aggregation=event&start_time=${since}&access_token=${encodeURIComponent(token)}`
    const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) })
    const body = await r.json().catch(() => ({}))
    if (!r.ok) return { ok: false, reason: body?.error?.message ? `Meta said: ${body.error.message}` : `Meta returned ${r.status}.` }
    const byWindow: Record<string, Record<string, number>> = Object.fromEntries(Object.keys(windows).map((k) => [k, {}]))
    for (const bucket of body.data || []) {
      const t = Date.parse(bucket.start_time)
      for (const row of bucket.data || []) {
        for (const [w, from] of Object.entries(windows)) {
          if (t >= from) byWindow[w][row.value] = (byWindow[w][row.value] || 0) + Number(row.count || 0)
        }
      }
    }
    return { ok: true, byWindow }
  } catch {
    return { ok: false, reason: 'Could not reach Meta.' }
  }
}

export default async function MetaTab({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const cookieStore = await cookies()
  if (!verifyBdrSession(cookieStore.get(BDR_COOKIE)?.value)) redirect('/admin/login')
  const { show = 'all' } = await searchParams

  const now = Date.now()
  const windows = { Today: istMidnight(), '7 days': now - 7 * 86_400_000, '28 days': now - 28 * 86_400_000 }

  const db = getSupabaseServiceClient()
  const [res, stats] = await Promise.all([
    db?.from('all_leads')
      .select('id, customer_name, phone, lead_stage, capi:unified_context->capi_sent, attr:unified_context->web->attribution')
      .eq('brand', BRAND)
      .not('unified_context->capi_sent', 'is', null)
      .limit(5000),
    loadMetaStats(windows),
  ])
  const leads = (res?.data ?? []) as unknown as LeadRow[]

  const sends: Send[] = []
  for (const l of leads) {
    const closedLost = (l.lead_stage || '').toLowerCase() === 'closed lost'
    for (const [key, rec] of Object.entries(l.capi || {})) {
      if (!rec || typeof rec !== 'object') continue
      const events = Array.isArray(rec.events) ? rec.events : []
      sends.push({
        leadId: l.id, name: l.customer_name || '', phone: maskPhone(l.phone), stage: l.lead_stage || '',
        key, at: rec.at || '', events, site: key.startsWith('site:'), test: !!rec.test, sent: rec.sent !== false,
        fromAd: fromMetaAd(l.attr),
        bad: closedLost && events.some((e) => POSITIVE.has(e)),
      })
    }
  }
  sends.sort((a, b) => Date.parse(b.at || '0') - Date.parse(a.at || '0'))

  // Totals: real (non-test) sends that reached Meta, counted per event name.
  const totals: Record<string, Record<string, number>> = Object.fromEntries(Object.keys(windows).map((w) => [w, {}]))
  for (const s of sends) {
    if (s.test || !s.sent) continue
    const t = Date.parse(s.at)
    for (const [w, from] of Object.entries(windows)) {
      if (t >= from) for (const e of s.events) totals[w][e] = (totals[w][e] || 0) + 1
    }
  }
  const badLeads = new Set(sends.filter((s) => s.bad).map((s) => s.leadId)).size
  const adSends = sends.filter((s) => s.fromAd).length

  const filters: [string, string, Send[]][] = [
    ['all', 'All sends', sends],
    ['bad', 'Taught Meta wrong', sends.filter((s) => s.bad)],
    ['ads', 'From Meta ads', sends.filter((s) => s.fromAd)],
    ['site', 'Site', sends.filter((s) => s.site)],
    ['core', 'Core', sends.filter((s) => !s.site)],
    ['test', 'Test', sends.filter((s) => s.test)],
  ]
  const active = filters.find((f) => f[0] === show) ?? filters[0]
  const rows = active[2].slice(0, 500)

  return (
    <main className="adm">
      <style>{ADMIN_CSS}</style>
      <header className="top">
        <div>
          <span className="kicker">PROXe admin</span>
          <h1>What we told Meta</h1>
        </div>
        <SignOut />
      </header>
      <AdminNav current="meta" />

      {!db && <p className="warn">Supabase is not configured on this server, so there is nothing to show.</p>}
      {res?.error && <p className="warn">Could not read leads: {res.error.message}</p>}

      <section className="stats">
        <div><b>{sends.length.toLocaleString('en-IN')}</b><span>Sends recorded</span></div>
        <div><b>{leads.length.toLocaleString('en-IN')}</b><span>Leads reported</span></div>
        <div><b>{adSends.toLocaleString('en-IN')}</b><span>Sends from Meta-ad leads</span></div>
        <div><b style={badLeads ? { color: '#fda4af' } : undefined}>{badLeads}</b><span>Junk leads we called good</span></div>
        <div><b>{sends.filter((s) => s.test).length}</b><span>Test sends</span></div>
        <div><b>{sends.filter((s) => !s.sent).length}</b><span>Not delivered</span></div>
      </section>

      <section>
        <h2>Our sends, by event <small style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>live sends only, from capi_sent</small></h2>
        <div className="grid3">
          {EVENTS.map((e) => (
            <div key={e} className="ev">
              <h3>{e}</h3>
              <dl>{Object.keys(windows).map((w) => <Fragment key={w}><dt>{w}</dt><dd>{totals[w][e] || 0}</dd></Fragment>)}</dl>
            </div>
          ))}
        </div>
        <p className="hint">Purchase is sent by the Dodo payment webhook and is not stamped on leads, so it reads 0 here; Meta&apos;s own count is below.</p>
      </section>

      <section>
        <h2>Meta&apos;s own count <small style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>events received by pixel {PIXEL_ID}, browser + server</small></h2>
        {stats.ok ? (
          <div className="grid3">
            {EVENTS.map((e) => (
              <div key={e} className="ev">
                <h3>{e}</h3>
                <dl>{Object.keys(windows).map((w) => <Fragment key={w}><dt>{w}</dt><dd>{stats.byWindow[w][e] || 0}</dd></Fragment>)}</dl>
              </div>
            ))}
          </div>
        ) : <p className="hint">Unavailable. {stats.reason}</p>}
      </section>

      <section>
        <h2>Every send, newest first</h2>
        <nav className="filters" aria-label="Filter sends">
          {filters.map(([k, label, list]) => (
            <a key={k} href={k === 'all' ? '/admin/meta' : `/admin/meta?show=${k}`} aria-current={k === active[0] ? 'true' : undefined}>{label} ({list.length})</a>
          ))}
        </nav>
        {rows.length ? (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Sent</th><th>Lead</th><th>Phone</th><th>Stage now</th><th>Trigger</th><th>Events</th><th>From</th><th>Meta ad</th><th>Flags</th></tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={`${s.leadId}:${s.key}`} className={s.bad ? 'bad' : undefined}>
                    <td>{s.at ? ist(s.at) : <i>no time</i>}</td>
                    <td>{s.name || <i>no name</i>}</td>
                    <td>{s.phone}</td>
                    <td>{s.stage}</td>
                    <td><code>{s.key}</code></td>
                    <td>{s.events.join(', ')}</td>
                    <td><span className="pill">{s.site ? 'site' : 'core'}</span></td>
                    <td>{s.fromAd ? <span className="pill ok">Meta ad</span> : ''}</td>
                    <td>
                      {s.bad && <span className="pill bad">taught Meta wrong</span>}{' '}
                      {s.test && <span className="pill dim">test</span>}{' '}
                      {!s.sent && <span className="pill dim">not delivered</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="hint">Nothing here.</p>}
        {active[2].length > rows.length && <p className="hint">Showing the newest {rows.length} of {active[2].length}.</p>}
      </section>
    </main>
  )
}
