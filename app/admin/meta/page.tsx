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

const EVENT_TONE: Record<string, string> = {
  Lead: '#a997fb',
  QualifiedLead: '#42bf8c',
  Schedule: '#6fa8ff',
  DisqualifiedLead: '#f1bd22',
  Purchase: '#e9754c',
}

/** A 28-day daily bar micrograph: one bar per IST day, today on the right and brightest. */
function Spark({ values, labels, tone }: { values: number[]; labels: string[]; tone: string }) {
  const W = 220, H = 44, gap = 2
  const n = values.length
  const bw = (W - gap * (n - 1)) / n
  const max = Math.max(1, ...values)
  const total = values.reduce((a, b) => a + b, 0)
  const peak = values.indexOf(Math.max(...values))
  const day = (k: string) => new Date(k + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  return (
    <figure className="spark" aria-label={`Last 28 days: ${total} sent${total ? `, most on ${day(labels[peak])} (${values[peak]})` : ''}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-hidden="true">
        <line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} stroke="rgba(255,255,255,.12)" />
        {values.map((v, i) => {
          const h = v ? Math.max(3, (v / max) * (H - 4)) : 1.5
          return (
            <rect key={labels[i]} x={i * (bw + gap)} y={H - h} width={bw} height={h} rx="1.5"
              fill={v ? tone : 'rgba(255,255,255,.14)'} opacity={i === n - 1 ? 1 : v ? 0.7 : 1}>
              <title>{`${day(labels[i])}: ${v}`}</title>
            </rect>
          )
        })}
      </svg>
      <figcaption><span>{day(labels[0])}</span><span>{total ? `peak ${values[peak]} · ${day(labels[peak])}` : 'none in 28 days'}</span><span>today</span></figcaption>
    </figure>
  )
}

type Health = {
  at: string
  ours: Record<string, number>
  confirmed?: Record<string, number>
  answered?: Record<string, number>
  meta: Record<string, number> | null
  meta_error: string | null
  coverage: Record<string, Record<string, number>>
  coverage_n: Record<string, number>
  problems: { kind: string; count: number; detail: string }[]
}

/** Meta's match-key names, as people say them. */
const KEY_LABEL: Record<string, string> = {
  ph: 'phone', em: 'email', fn: 'name', external_id: 'person id', fbp: 'browser id', fbc: 'ad click',
  client_ip_address: 'IP', client_user_agent: 'device',
}
const keyList = (keys?: string[]) => (keys && keys.length ? keys.map((k) => KEY_LABEL[k] || k).join(', ') : '')

function HealthPanel({ h }: { h: Health | null }) {
  if (!h) {
    return <p className="banner">The hourly check has not run yet. It runs on the PROXe dashboard at five past every hour; this panel fills in after its first run.</p>
  }
  const ageMin = Math.round((Date.now() - Date.parse(h.at)) / 60000)
  const stale = ageMin > 130
  const events = ['Lead', 'QualifiedLead', 'Schedule', 'DisqualifiedLead', 'Purchase'].filter((e) => h.ours[e] || h.meta?.[e])
  const cols: [string, string][] = [['ph', 'phone'], ['em', 'email'], ['fbp', 'browser id'], ['fbc', 'ad click'], ['client_ip_address', 'IP']]
  const bad = h.problems.length > 0 || stale
  return (
    <section className={`health ${bad ? 'health-bad' : 'health-ok'}`} aria-labelledby="health-h">
      <div className="health-head">
        <h3 id="health-h">{h.problems.length ? `${h.problems.length} problem${h.problems.length > 1 ? 's' : ''} in the last 24 hours` : 'Every check passed in the last 24 hours'}</h3>
        <span className="hint">Checked {ageMin < 1 ? 'just now' : `${ageMin} min ago`}{stale ? ' · the check itself looks stopped' : ''} · alerts go to Telegram</span>
      </div>
      {h.problems.length > 0 && (
        <ul className="health-list">{h.problems.map((p) => <li key={p.kind}>{p.detail}</li>)}</ul>
      )}
      <div className="health-grid">
        <div className="tablewrap">
          <table>
            <thead><tr><th>Event, last 24h</th><th>We sent</th><th>Meta confirmed</th>{h.meta && <th>Meta total</th>}</tr></thead>
            <tbody>
              {events.length ? events.map((e) => {
                const conf = h.confirmed?.[e] ?? 0
                const asked = h.answered?.[e] ?? 0
                const sent = h.ours[e] || 0
                const short = h.meta && (h.meta[e] || 0) < sent
                return (
                  <tr key={e}>
                    <td className="name">{e}</td>
                    <td>{sent}</td>
                    <td>{asked ? <span className={conf < asked ? 'pill bad' : 'pill ok'}>{conf} of {asked}</span> : <span className="hint">{sent ? 'sent before replies were recorded' : 'none'}</span>}</td>
                    {h.meta && <td><span className={short ? 'pill bad' : 'pill ok'}>{h.meta[e] || 0}</span></td>}
                  </tr>
                )
              }) : <tr><td colSpan={3} className="hint">Nothing sent in the last 24 hours.</td></tr>}
            </tbody>
          </table>
          <p className="hint" style={{ margin: '8px 16px 12px', fontSize: 12.5 }}>Meta confirmed = Meta&apos;s own reply to each server send, saying it accepted the event. Sends from before 9 Oct, 9 pm did not record the reply.{h.meta ? ' Meta total also counts the browser pixel, so it can be higher than ours.' : ''}</p>
        </div>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Details carried</th>{cols.map(([, l]) => <th key={l}>{l}</th>)}</tr></thead>
            <tbody>
              {Object.keys(h.coverage).length ? Object.entries(h.coverage).map(([e, c]) => (
                <tr key={e}><td className="name">{e}<small>{h.coverage_n[e]} sent</small></td>{cols.map(([k]) => {
                  const v = c[k] ?? 0
                  return <td key={k}><span className={`pill ${v >= 80 ? 'ok' : v >= 40 ? 'warn' : 'bad'}`}>{v}%</span></td>
                })}</tr>
              )) : <tr><td colSpan={6} className="hint">Fills in from new sends: each send now records which details it carried.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

type SendRecord = { at?: string; events?: string[]; test?: boolean; sent?: boolean; source?: string; event_id?: string; fbtrace?: string | null; via?: string; relay?: unknown; relay_expired?: boolean; keys?: string[]; error?: string; relay_error?: string; events_received?: number | null }
type LeadRow = { id: string; customer_name: string | null; phone: string | null; lead_stage: string | null; created_at?: string | null; src?: string | null; brand_name?: string | null; capi: Record<string, SendRecord> | null; attr: Record<string, any> | null }
type Send = { leadId: string; name: string; phone: string; stage: string; key: string; at: string; events: string[]; site: boolean; test: boolean; sent: boolean; relayed: boolean; queued: boolean; keys?: string[]; problem?: string; confirmed?: boolean; fromAd: boolean; bad: boolean }
type LeadView = {
  id: string; name: string; phone: string; stage: string; fromAd: boolean; bad: boolean; last: string; sends: Send[]
  created: string; source: string; brandName: string
  /** The send that told Meta "Lead" for this person, if any. */
  metaLead?: Send
  /** Why Meta has no Lead for this person: [short label, longer reason]. */
  why?: [string, string]
}

/** Website site:* stamps start here (9 Oct 2026, 121da3a). Browser-only Leads before this were never recorded on the lead. */
const SITE_STAMPS_FROM = Date.parse('2026-10-09T12:00:00Z')

const SOURCE_LABEL: Record<string, string> = {
  hero_phone: 'Call me back', deploy_modal: 'Deploy form', chat_widget: 'Chat form', 'dashboard-tour': 'Dashboard tour',
  whatsapp_gate: 'WhatsApp pop-up', whatsapp_button: 'WhatsApp button', deploy_modal_whatsapp: 'Deploy form WhatsApp',
  social: 'Instagram / Facebook DM', whatsapp: 'WhatsApp message', voice: 'Phone call', web: 'Website',
}
const sourceLabel = (src: string) =>
  SOURCE_LABEL[src] || (src.startsWith('deploy_modal') ? 'Deploy form' : src ? src.replace(/_/g, ' ') : 'Unknown')

/** Why Meta has no Lead for this person, in plain words: [label, detail]. */
function whyNoLead(l: { source: string; created: string; name: string; brandName: string }): [string, string] {
  const src = l.source
  const before = Date.parse(l.created || '0') < SITE_STAMPS_FROM
  if (!src || src === 'social' || src === 'whatsapp' || src === 'voice') {
    return ['Came in directly', 'Came in by WhatsApp, Instagram or a call, not a website form: the website has nothing to send. The dashboard stopped sending Lead on 9 Oct.']
  }
  if (src === 'whatsapp_gate' || src === 'whatsapp_button' || src === 'deploy_modal_whatsapp') {
    return ['WhatsApp tap', 'Tapped WhatsApp on the website: Meta gets Contact for that, not Lead.']
  }
  if (src === 'hero_phone') {
    return before
      ? ['Not recorded', 'Typed a number in Call me back before 9 Oct. If they tapped the button, the browser sent Lead, but website sends were not recorded on the lead then.']
      : ['Number only', 'Call me back with just a number: since 9 Oct a Lead needs name + phone + business.']
  }
  if (src === 'dashboard-tour') return ['No business name', 'Dashboard tour gives name + phone, no business: not a Lead by the 9 Oct rule.']
  if (src.startsWith('deploy_modal') || src === 'chat_widget') {
    if (before) return ['Not recorded', 'Form filled before 9 Oct: the website sent Lead from the browser and server then, but those sends were not recorded on the lead.']
    if (!l.name || !l.brandName) return ['Incomplete form', 'Form without a name or business name: not a Lead by the 9 Oct rule.']
    return ['Missing', 'A full form after 9 Oct should have sent Lead. The hourly check flags this as "missed".']
  }
  return ['No Lead', 'Nothing in the record sent Meta a Lead for this person.']
}


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

const LEAD_FIELDS = 'id, customer_name, phone, lead_stage, created_at, src:unified_context->web->>source, brand_name:unified_context->web->>brand_name, capi:unified_context->capi_sent, attr:unified_context->web->attribution'

export default async function MetaTab({ searchParams }: { searchParams: Promise<{ show?: string; view?: string }> }) {
  const cookieStore = await cookies()
  if (!verifyBdrSession(cookieStore.get(BDR_COOKIE)?.value)) redirect('/admin/login')
  const { show = 'all', view = 'leads' } = await searchParams
  const bySend = view === 'sends'

  const now = Date.now()
  const windows = { Today: istMidnight(), '7 days': now - 7 * 86_400_000, '28 days': now - 28 * 86_400_000 }

  const db = getSupabaseServiceClient()
  const [res, stats, healthRes, recentRes] = await Promise.all([
    db?.from('all_leads')
      .select(LEAD_FIELDS)
      .eq('brand', BRAND)
      .not('unified_context->capi_sent', 'is', null)
      .limit(5000),
    loadMetaStats(windows),
    // Written hourly by PROXe core's meta-health cron, which has the Meta token.
    db?.from('dashboard_settings').select('value').eq('key', `meta_health:${BRAND}`).maybeSingle(),
    // Every lead of the last 28 days, so the ones Meta never heard about show too.
    db?.from('all_leads').select(LEAD_FIELDS).eq('brand', BRAND)
      .gte('created_at', new Date(windows['28 days']).toISOString()).limit(5000),
  ])
  const health = (healthRes?.data?.value ?? null) as Health | null
  const byId = new Map<string, LeadRow>()
  for (const r of [...((res?.data ?? []) as unknown as LeadRow[]), ...((recentRes?.data ?? []) as unknown as LeadRow[])]) byId.set(r.id, r)
  const leadRows = Array.from(byId.values())

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
        relayed: rec.via === 'core', queued: rec.sent === false && !!rec.relay && !rec.relay_expired,
        keys: Array.isArray(rec.keys) ? rec.keys : undefined, problem: rec.relay_error || (rec.sent === false ? rec.error : undefined),
        confirmed: rec.events_received === undefined || rec.events_received === null ? undefined : Number(rec.events_received) >= 1,
        fromAd: fromMetaAd(l.attr),
        bad: closedLost && events.some((e) => POSITIVE.has(e)),
      })
    }
    mine.sort((a, b) => Date.parse(a.at || '0') - Date.parse(b.at || '0'))
    sends.push(...mine)
    const base = { name: l.customer_name || '', brandName: l.brand_name || '', source: l.src || '', created: l.created_at || '' }
    const metaLead = mine.find((x) => x.events.includes('Lead') && !x.test)
    leads.push({
      id: l.id, name: base.name, phone: maskPhone(l.phone), stage: l.lead_stage || '',
      fromAd: fromMetaAd(l.attr), bad: mine.some((x) => x.bad),
      last: mine.length ? mine[mine.length - 1].at : base.created, sends: mine,
      created: base.created, source: base.source, brandName: base.brandName,
      metaLead, why: metaLead ? undefined : whyNoLead(base),
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
  // Daily counts per event for the last 28 IST days, oldest first: the cards' micrographs.
  const DAYS = 28
  const dayKey = (t: number) => new Date(t + 330 * 60_000).toISOString().slice(0, 10)
  const dayKeys = Array.from({ length: DAYS }, (_, i) => dayKey(windows.Today - (DAYS - 1 - i) * 86_400_000))
  const daily: Record<string, number[]> = Object.fromEntries(EVENTS.map((e) => [e, dayKeys.map(() => 0)]))
  for (const s of sends) {
    if (s.test || !s.sent || !s.at) continue
    const i = dayKeys.indexOf(dayKey(Date.parse(s.at)))
    if (i < 0) continue
    for (const e of s.events) if (daily[e]) daily[e][i] += 1
  }
  // Lead in Meta: of every lead created in the last 28 days.
  const recentLeads = leads.filter((l) => Date.parse(l.created || '0') >= windows['28 days'])
  const gotLead = recentLeads.filter((l) => l.metaLead)
  const noLead = recentLeads.filter((l) => !l.metaLead)
  const whyCounts = new Map<string, number>()
  for (const l of noLead) whyCounts.set(l.why![0], (whyCounts.get(l.why![0]) || 0) + 1)
  const badLeads = leads.filter((l) => l.bad).length
  const told = leads.filter((l) => l.sends.length)
  const adLeads = told.filter((l) => l.fromAd).length
  const siteSends = sends.filter((s) => s.site).length
  const junkLeads = told.filter((l) => stageTone(l.stage) === 'bad').length

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
    ['got', 'Meta got a Lead', leads.filter((l) => l.metaLead)],
    ['not', 'Meta never got a Lead', leads.filter((l) => !l.metaLead)],
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
          <span><b>The website is not sending anything to Meta from the server.</b> <code>META_CAPI_ACCESS_TOKEN</code> is not set on goproxe.com, so website leads only reach Meta through the browser pixel, which ad blockers and iPhones drop. Until it is, the website parks each server event on the lead and the PROXe dashboard sends it with its own key within 10 minutes (marked “relayed”).</span>
        </p>
      )}

      <section className="stats">
        <div><b>{told.length}</b><span>Leads we told Meta about</span></div>
        <div><b>{adLeads}</b><span>of them came from Meta ads</span></div>
        <div><b>{junkLeads}</b><span>are junk now (Closed Lost)</span></div>
        <div className={badLeads ? 'bad' : undefined}><b>{badLeads}</b><span>junk we first called good</span></div>
        <div><b>{sends.length}</b><span>Signals sent in total</span></div>
        <div><b>{siteSends}</b><span>from the website</span></div>
      </section>

      <h2>Is it reaching Meta? <small>checked hourly by the PROXe dashboard</small></h2>
      <HealthPanel h={health} />

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
            <Spark values={daily[e]} labels={dayKeys} tone={EVENT_TONE[e]} />
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
      {!bySend && (
        <p className="leadsum">
          Of <b>{recentLeads.length}</b> leads in the last 28 days, <b className="ok">{gotLead.length}</b> reached Meta as a Lead and{' '}
          <b className="no">{noLead.length}</b> did not
          {noLead.length > 0 && <>: {Array.from(whyCounts.entries()).sort((a, b) => b[1] - a[1]).map(([k, n], i) => <span key={k}>{i ? ', ' : ''}{n} {k.toLowerCase()}</span>)}</>}.
        </p>
      )}
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
              <thead><tr><th>Lead</th><th>Lead in Meta?</th><th>Stage today</th><th>Everything Meta heard, oldest first</th><th>Came from</th></tr></thead>
              <tbody>
                {activeLead[2].slice(0, 500).map((l) => (
                  <tr key={l.id} className={l.bad ? 'bad' : undefined}>
                    <td className="name">{l.name || <i>no name</i>}<small>{l.phone} · {sourceLabel(l.source)}{l.created ? ` · ${istDay(l.created)}` : ''}</small></td>
                    <td style={{ minWidth: 200 }}>
                      {l.metaLead ? (
                        <>
                          <span className={`pill ${l.metaLead.queued ? 'warn' : l.metaLead.sent ? 'ok' : 'bad'}`}>{l.metaLead.queued ? 'Queued' : l.metaLead.sent ? 'Yes' : 'Not delivered'}</span>
                          <small>{istDay(l.metaLead.at)} · {l.metaLead.site ? 'website' : 'dashboard'}{l.metaLead.relayed ? ' · relayed' : ''}{l.metaLead.confirmed === true ? ' · Meta confirmed' : l.metaLead.confirmed === false ? ' · Meta did not confirm' : ''}</small>
                        </>
                      ) : (
                        <>
                          <span className="pill dim" title={l.why![1]}>No · {l.why![0]}</span>
                          <small title={l.why![1]}>{l.why![1]}</small>
                        </>
                      )}
                    </td>
                    <td><span className={`pill ${stageTone(l.stage)}`}>{l.stage || 'No stage'}</span>{l.bad && <small style={{ color: '#fecdd3' }}>We told Meta this was a good lead</small>}</td>
                    <td>
                      <div className="chips">
                        {!l.sends.length && <span className="hint">Nothing</span>}
                        {l.sends.map((s) => (
                          <span key={s.key} className={`chip ${chipTone(s)}`} title={`Trigger: ${s.key}${s.keys ? `\nDetails sent: ${keyList(s.keys)}` : ''}${s.problem ? `\nProblem: ${s.problem}` : ''}`}>
                            <b>{s.events.join(' + ') || '(nothing)'}</b>
                            <span>{s.at ? istDay(s.at) : 'no date'} · {s.site ? 'website' : 'dashboard'}{s.relayed ? ' · relayed' : ''}{s.test ? ' · test' : ''}{s.queued ? ' · queued for relay' : !s.sent ? ' · not delivered' : ''}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{l.fromAd ? <span className="pill blue">Meta ad</span> : <span className="hint">Other</span>}</td>
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
              <thead><tr><th>Sent</th><th>Lead</th><th>Stage today</th><th>We told Meta</th><th>Details sent</th><th>Because</th><th>From</th><th>Came from</th></tr></thead>
              <tbody>
                {activeSend[2].slice(0, 500).map((s) => (
                  <tr key={`${s.leadId}:${s.key}`} className={s.bad ? 'bad' : undefined}>
                    <td className="when">{s.at ? ist(s.at) : <i>no time</i>}</td>
                    <td className="name">{s.name || <i>no name</i>}<small>{s.phone}</small></td>
                    <td><span className={`pill ${stageTone(s.stage)}`}>{s.stage || 'No stage'}</span></td>
                    <td><span className={`chip ${chipTone(s)}`}><b>{s.events.join(' + ')}</b>{s.bad && <span>now junk</span>}</span></td>
                    <td style={{ minWidth: 180 }}>{s.keys ? <span style={{ fontSize: 13 }}>{keyList(s.keys)}</span> : <span className="hint">not recorded</span>}{s.problem && <small style={{ color: '#fecdd3' }}>{s.problem}</small>}</td>
                    <td className="nowrap"><span className="hint">{s.key.replace(/^site:/, 'Website ')}</span></td>
                    <td>{s.site ? 'Website' : 'Dashboard'}{s.relayed && <> <span className="pill blue">relayed</span></>}{s.test && <> <span className="pill dim">test</span></>}{s.queued ? <> <span className="pill warn">queued for relay</span></> : !s.sent && <> <span className="pill dim">not delivered</span></>}</td>
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
