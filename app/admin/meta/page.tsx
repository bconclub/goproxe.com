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
 * Two views: one row per LEAD (default: what Meta heard about this person,
 * oldest to newest, against their stage today) and one row per SEND.
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
const EVENT_NOTE: Record<string, string> = {
  Lead: 'a new lead',
  QualifiedLead: 'a good lead',
  Schedule: 'a booking',
  DisqualifiedLead: 'a junk lead',
  Purchase: 'a payment',
}

type SendRecord = { at?: string; events?: string[]; test?: boolean; sent?: boolean; source?: string; event_id?: string; fbtrace?: string | null }
type LeadRow = { id: string; customer_name: string | null; phone: string | null; lead_stage: string | null; capi: Record<string, SendRecord> | null; attr: Record<string, any> | null }
type Send = { leadId: string; name: string; phone: string; stage: string; key: string; at: string; events: string[]; site: boolean; test: boolean; sent: boolean; fromAd: boolean; bad: boolean }
type LeadView = { id: string; name: string; phone: string; stage: string; fromAd: boolean; bad: boolean; last: string; sends: Send[] }

const ist = (d: string | number) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const istDay = (d: string | number) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })
const maskPhone = (p: string | null) => {
  const d = (p || '').replace(/\D/g, '')
  return d.length >= 4 ? `••••••${d.slice(-4)}` : ''
}
const fromMetaAd = (a: Record<string, any> | null) =>
  !!a && (!!a.fbclid || /^(fb|facebook|ig|instagram|meta)\b/i.test(String(a.utm_source || '')))

/** Stage today, as a coloured pill: junk red, won green, working violet, untouched grey. */
function stageTone(stage: string) {
  const s = stage.toLowerCase()
  if (s === 'closed lost') return 'bad'
  if (s === 'booking made' || s === 'demo taken' || s === 'closed won' || s === 'converted') return 'ok'
  if (s === 'qualified' || s === 'high intent') return ''
  return 'dim'
}
/** What we told Meta, as a chip: good signal green, junk signal amber, wrong red. */
function chipTone(s: Send) {
  if (s.bad) return 'wrong'
  if (s.events.includes('DisqualifiedLead')) return 'junk'
  if (s.events.some((e) => e === 'QualifiedLead' || e === 'Schedule' || e === 'Purchase')) return 'good'
  return ''
}

/** Midnight today in IST, as a timestamp. */
function istMidnight() {
  const now = new Date()
  const d = new Date(now.getTime() + 330 * 60_000)
  d.setUTCHours(0, 0, 0, 0)
  return d.getTime() - 330 * 60_000
}

type MetaStats = { ok: true; byWindow: Record<string, Record<string, number>> } | { ok: false; reason: string; noToken?: boolean }

/** Meta's received-event counts (pixel + server), hourly buckets summed per window. */
async function loadMetaStats(windows: Record<string, number>): Promise<MetaStats> {
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!token) return { ok: false, reason: 'META_CAPI_ACCESS_TOKEN is not set on this server.', noToken: true }
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

export default async function MetaTab({ searchParams }: { searchParams: Promise<{ show?: string; view?: string }> }) {
  const cookieStore = await cookies()
  if (!verifyBdrSession(cookieStore.get(BDR_COOKIE)?.value)) redirect('/admin/login')
  const { show = 'all', view = 'leads' } = await searchParams
  const bySend = view === 'sends'

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
  const leadRows = (res?.data ?? []) as unknown as LeadRow[]

  const sends: Send[] = []
  const leads: LeadView[] = []
  for (const l of leadRows) {
    const closedLost = (l.lead_stage || '').toLowerCase() === 'closed lost'
    const mine: Send[] = []
    for (const [key, rec] of Object.entries(l.capi || {})) {
      if (!rec || typeof rec !== 'object') continue
      const events = Array.isArray(rec.events) ? rec.events : []
      mine.push({
        leadId: l.id, name: l.customer_name || '', phone: maskPhone(l.phone), stage: l.lead_stage || '',
        key, at: rec.at || '', events, site: key.startsWith('site:'), test: !!rec.test, sent: rec.sent !== false,
        fromAd: fromMetaAd(l.attr),
        bad: closedLost && events.some((e) => POSITIVE.has(e)),
      })
    }
    if (!mine.length) continue
    mine.sort((a, b) => Date.parse(a.at || '0') - Date.parse(b.at || '0'))
    sends.push(...mine)
    leads.push({
      id: l.id, name: l.customer_name || '', phone: maskPhone(l.phone), stage: l.lead_stage || '',
      fromAd: fromMetaAd(l.attr), bad: mine.some((s) => s.bad), last: mine[mine.length - 1].at, sends: mine,
    })
  }
  sends.sort((a, b) => Date.parse(b.at || '0') - Date.parse(a.at || '0'))
  leads.sort((a, b) => Date.parse(b.last || '0') - Date.parse(a.last || '0'))

  // Totals: real (non-test) sends that reached Meta, counted per event name.
  const totals: Record<string, Record<string, number>> = Object.fromEntries(Object.keys(windows).map((w) => [w, {}]))
  for (const s of sends) {
    if (s.test || !s.sent) continue
    const t = Date.parse(s.at)
    for (const [w, from] of Object.entries(windows)) {
      if (t >= from) for (const e of s.events) totals[w][e] = (totals[w][e] || 0) + 1
    }
  }
  const badLeads = leads.filter((l) => l.bad).length
  const adLeads = leads.filter((l) => l.fromAd).length
  const siteSends = sends.filter((s) => s.site).length
  const junkLeads = leads.filter((l) => stageTone(l.stage) === 'bad').length

  const sendFilters: [string, string, Send[]][] = [
    ['all', 'All', sends],
    ['bad', 'Taught Meta wrong', sends.filter((s) => s.bad)],
    ['ads', 'From Meta ads', sends.filter((s) => s.fromAd)],
    ['site', 'Website', sends.filter((s) => s.site)],
    ['core', 'Dashboard', sends.filter((s) => !s.site)],
    ['test', 'Test', sends.filter((s) => s.test)],
  ]
  const leadFilters: [string, string, LeadView[]][] = [
    ['all', 'All', leads],
    ['bad', 'Taught Meta wrong', leads.filter((l) => l.bad)],
    ['ads', 'From Meta ads', leads.filter((l) => l.fromAd)],
    ['junk', 'Junk now', leads.filter((l) => stageTone(l.stage) === 'bad')],
    ['good', 'Booked or demo', leads.filter((l) => stageTone(l.stage) === 'ok')],
  ]
  const activeSend = sendFilters.find((f) => f[0] === show) ?? sendFilters[0]
  const activeLead = leadFilters.find((f) => f[0] === show) ?? leadFilters[0]
  const q = (k: string) => `/admin/meta?${new URLSearchParams({ ...(bySend ? { view: 'sends' } : {}), ...(k === 'all' ? {} : { show: k }) })}`.replace(/\?$/, '')

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

      {!db && <p className="banner">Supabase is not configured on this server, so there is nothing to show.</p>}
      {res?.error && <p className="banner">Could not read leads: {res.error.message}</p>}
      {!stats.ok && stats.noToken && (
        <p className="banner" role="status">
          <span><b>The website is not sending anything to Meta from the server.</b> <code>META_CAPI_ACCESS_TOKEN</code> is not set on goproxe.com, so website leads only reach Meta through the browser pixel, which ad blockers and iPhones drop. Everything in this table came from the PROXe dashboard, which has its own key. Add the token to the server&apos;s environment and restart.</span>
        </p>
      )}

      <section className="stats">
        <div><b>{leads.length}</b><span>Leads we told Meta about</span></div>
        <div><b>{adLeads}</b><span>of them came from Meta ads</span></div>
        <div><b>{junkLeads}</b><span>are junk now (Closed Lost)</span></div>
        <div className={badLeads ? 'bad' : undefined}><b>{badLeads}</b><span>junk we first called good</span></div>
        <div><b>{sends.length}</b><span>Signals sent in total</span></div>
        <div><b>{siteSends}</b><span>from the website</span></div>
      </section>

      <h2>Signals we sent, by event <small>live sends only, IST</small></h2>
      <div className="grid3">
        {EVENTS.map((e) => (
          <div key={e} className="ev">
            <h3>{e} <em>{EVENT_NOTE[e]}</em></h3>
            <dl>
              {Object.keys(windows).map((w) => (
                <Fragment key={w}><div><dt>{w}</dt><dd>{totals[w][e] || 0}</dd></div></Fragment>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="hint" style={{ margin: '10px 0 0', fontSize: 13 }}>Purchase is sent by the payment webhook and is not recorded on leads, so it reads 0 here.</p>

      {stats.ok && (
        <>
          <h2>Meta&apos;s own count <small>events received by pixel {PIXEL_ID}, browser + server</small></h2>
          <div className="grid3">
            {EVENTS.map((e) => (
              <div key={e} className="ev">
                <h3>{e}</h3>
                <dl>
                  {Object.keys(windows).map((w) => (
                    <Fragment key={w}><div><dt>{w}</dt><dd>{stats.byWindow[w][e] || 0}</dd></div></Fragment>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </>
      )}
      {!stats.ok && !stats.noToken && <p className="hint">Meta&apos;s own count is unavailable. {stats.reason}</p>}

      <h2>
        {bySend ? 'Every signal, newest first' : 'Each lead, and what Meta heard'}
        <small><a href={bySend ? '/admin/meta' : '/admin/meta?view=sends'}>{bySend ? 'Show one row per lead' : 'Show one row per signal'}</a></small>
      </h2>
      <nav className="filters" aria-label="Filter">
        {(bySend ? sendFilters : leadFilters).map(([k, label, list]) => (
          <a key={k} href={q(k)} aria-current={k === (bySend ? activeSend[0] : activeLead[0]) ? 'true' : undefined}>{label} · {list.length}</a>
        ))}
      </nav>
      <div className="legend" aria-hidden="true">
        <span><i style={{ background: 'rgba(255,255,255,.25)' }} />Lead</span>
        <span><i style={{ background: '#42bf8c' }} />Good lead or booking</span>
        <span><i style={{ background: '#f1bd22' }} />Junk</span>
        <span><i style={{ background: '#fb7185' }} />Called good, now junk</span>
      </div>

      {!bySend ? (
        activeLead[2].length ? (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Lead</th><th>Stage today</th><th>What we told Meta, oldest first</th><th>Came from</th><th>Last signal</th></tr></thead>
              <tbody>
                {activeLead[2].slice(0, 500).map((l) => (
                  <tr key={l.id} className={l.bad ? 'bad' : undefined}>
                    <td className="name">{l.name || <i>no name</i>}<small>{l.phone}</small></td>
                    <td><span className={`pill ${stageTone(l.stage)}`}>{l.stage || 'No stage'}</span>{l.bad && <small style={{ color: '#fecdd3' }}>We told Meta this was a good lead</small>}</td>
                    <td>
                      <div className="chips">
                        {l.sends.map((s) => (
                          <span key={s.key} className={`chip ${chipTone(s)}`} title={`Trigger: ${s.key}`}>
                            <b>{s.events.join(' + ') || '(nothing)'}</b>
                            <span>{s.at ? istDay(s.at) : 'no date'} · {s.site ? 'website' : 'dashboard'}{s.test ? ' · test' : ''}{!s.sent ? ' · not delivered' : ''}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{l.fromAd ? <span className="pill blue">Meta ad</span> : <span className="hint">Other</span>}</td>
                    <td className="when">{l.last ? ist(l.last) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="hint">No leads here.</p>
      ) : (
        activeSend[2].length ? (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Sent</th><th>Lead</th><th>Stage today</th><th>We told Meta</th><th>Because</th><th>From</th><th>Came from</th></tr></thead>
              <tbody>
                {activeSend[2].slice(0, 500).map((s) => (
                  <tr key={`${s.leadId}:${s.key}`} className={s.bad ? 'bad' : undefined}>
                    <td className="when">{s.at ? ist(s.at) : <i>no time</i>}</td>
                    <td className="name">{s.name || <i>no name</i>}<small>{s.phone}</small></td>
                    <td><span className={`pill ${stageTone(s.stage)}`}>{s.stage || 'No stage'}</span></td>
                    <td><span className={`chip ${chipTone(s)}`}><b>{s.events.join(' + ')}</b>{s.bad && <span>now junk</span>}</span></td>
                    <td className="nowrap"><span className="hint">{s.key.replace(/^site:/, 'Website ')}</span></td>
                    <td>{s.site ? 'Website' : 'Dashboard'}{s.test && <> <span className="pill dim">test</span></>}{!s.sent && <> <span className="pill dim">not delivered</span></>}</td>
                    <td>{s.fromAd ? <span className="pill blue">Meta ad</span> : <span className="hint">Other</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="hint">Nothing here.</p>
      )}
    </main>
  )
}
