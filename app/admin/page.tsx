import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BDR_COOKIE, verifyBdrSession } from '../lib/bdrSession'
import { getSupabaseServiceClient } from '../lib/supabase'
import { elevenHistory, BDR_AGENT_IDS } from '../lib/bdrHistory'
import { getPendingScheduledCallbacks } from '../lib/leadsSupabase'
import SignOut from './SignOut'
import AdminNav from './AdminNav'
import { ADMIN_CSS } from './adminStyles'

/**
 * goproxe.com/admin: one door to everything internal (Oct 2026).
 * Same sign-in as /bdr (the PROXe admin account), so one login opens the
 * dialer too. Read-only here; each tool keeps its own page for actions.
 */

export const dynamic = 'force-dynamic'

const BRAND = process.env.PROXE_LEAD_BRAND || 'proxe'

type Lead = {
  id: string; customer_name: string | null; phone: string | null; email: string | null
  last_touchpoint: string | null; last_interaction_at: string | null; lead_stage: string | null
  unified_context: Record<string, any> | null
}
type View = { session_id: string; recipient: string | null; page: string; last_seen_at: string; seconds: number; completed: boolean; cards_seen: string[]; total_cards: number }
type Call = { conversation_id: string; start_time_unix_secs: number; call_duration_secs: number | null; status: string }

const ist = (d: string | number | Date) => new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const dur = (s: number | null) => (s == null ? '' : s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`)
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

function leadSource(l: Lead) {
  const web = l.unified_context?.web
  return web?.attribution?.channel || web?.attribution?.utm_source || web?.source || l.last_touchpoint || ''
}
/** Stage as a coloured pill: junk red, won green, working violet, untouched grey. */
function stageTone(stage: string) {
  const s = stage.toLowerCase()
  if (s === 'closed lost') return 'bad'
  if (s === 'booking made' || s === 'booked' || s === 'demo taken' || s === 'closed won' || s === 'converted') return 'ok'
  if (s === 'qualified' || s === 'high intent' || s === 'talking') return ''
  return 'dim'
}
function leadStage(l: Lead) {
  if (l.lead_stage) return l.lead_stage
  if (l.unified_context?.web?.booking_status === 'Call Booked') return 'Booked'
  if (l.last_touchpoint === 'voice' || l.unified_context?.voice?.last_call_at) return 'Talking'
  return 'New'
}

async function loadCalls(): Promise<Call[] | null> {
  try {
    const pages = await Promise.all(BDR_AGENT_IDS.map(async (id) => {
      const r = await elevenHistory(`conversations?agent_id=${encodeURIComponent(id)}&page_size=10`)
      if (!r.ok) throw new Error('history')
      return ((await r.json()).conversations || []) as Call[]
    }))
    return pages.flat().sort((a, b) => b.start_time_unix_secs - a.start_time_unix_secs).slice(0, 10)
  } catch { return null }
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  if (!verifyBdrSession(cookieStore.get(BDR_COOKIE)?.value)) redirect('/admin/login')

  const db = getSupabaseServiceClient()
  const count = async (since?: string) => {
    if (!db) return null
    let q = db.from('all_leads').select('id', { count: 'exact', head: true }).eq('brand', BRAND)
    if (since) q = q.gte('last_interaction_at', since)
    const { count: n, error } = await q
    return error ? null : n
  }

  const [leadsRes, viewsRes, views7, leadsAll, leads1, leads7, callbacks, calls] = await Promise.all([
    db?.from('all_leads').select('id, customer_name, phone, email, last_touchpoint, last_interaction_at, lead_stage, unified_context')
      .eq('brand', BRAND).order('last_interaction_at', { ascending: false }).limit(40),
    db?.from('pitch_views').select('session_id, recipient, page, last_seen_at, seconds, completed, cards_seen, total_cards')
      .order('last_seen_at', { ascending: false }).limit(10),
    db?.from('pitch_views').select('session_id', { count: 'exact', head: true }).gte('last_seen_at', daysAgo(7)),
    count(), count(daysAgo(1)), count(daysAgo(7)),
    getPendingScheduledCallbacks(),
    loadCalls(),
  ])

  const leads = (leadsRes?.data ?? []) as Lead[]
  const views = (viewsRes?.data ?? []) as View[]
  const booked = leads.filter((l) => leadStage(l) === 'Booked').length
  const pvKey = process.env.PITCH_VIEWS_KEY
  const pitchViewsHref = pvKey ? `/pitch-views?key=${encodeURIComponent(pvKey)}` : null
  const n = (v: number | null | undefined) => (v == null ? '–' : v.toLocaleString('en-IN'))

  const stats: [string, string][] = [
    ['Leads (all time)', n(leadsAll)],
    ['Active today', n(leads1)],
    ['Active 7 days', n(leads7)],
    ['Booked (latest 40)', String(booked)],
    ['Deck visits 7 days', n(views7?.count)],
    ['Callbacks due', String(callbacks.length)],
  ]

  const tools: { href: string | null; title: string; text: string; external?: boolean }[] = [
    { href: '/bdr', title: 'BDR dialer', text: 'Dial a prospect, listen to recordings, read transcripts.' },
    { href: pitchViewsHref, title: 'Pitch views', text: pvKey ? 'Who opened the deck, how far they got. Make tracked links.' : 'Set PITCH_VIEWS_KEY to open this.' },
    { href: '/pitch', title: 'Pitch deck', text: 'The deck itself, as prospects see it.' },
    { href: '/what-is-proxe', title: 'What is PROXe', text: 'The narrated story page. Add ?for=name to track a send.' },
    { href: '/dashboard-tour', title: 'Dashboard tour', text: 'Short videos of the real dashboard.' },
    { href: 'https://demo.goproxe.com', title: 'Demo hub', text: 'The warm-lead demo (demo.goproxe.com).', external: true },
    { href: '/pricing', title: 'Pricing page', text: 'Core, top-ups, seats and the bill estimator.' },
    { href: '/deploy', title: 'Checkout', text: 'The deploy configurator buyers pay through.' },
  ]

  return (
    <main className="adm">
      <style>{ADMIN_CSS}</style>
      <header className="top">
        <div>
          <span className="kicker">PROXe admin</span>
          <h1>Everything behind goproxe.com</h1>
        </div>
        <SignOut />
      </header>
      <AdminNav current="overview" />

      {!db && <p className="warn">Supabase is not configured on this server, so lead and deck numbers are empty.</p>}

      <section className="stats">
        {stats.map(([k, v]) => <div key={k}><b>{v}</b><span>{k}</span></div>)}
      </section>

      <section>
        <h2>Tools</h2>
        <div className="tools">
          {tools.map((t) => t.href
            ? <a key={t.title} href={t.href} className="tool" {...(t.external ? { target: '_blank', rel: 'noreferrer' } : {})}><strong>{t.title} →</strong><span>{t.text}</span></a>
            : <div key={t.title} className="tool off"><strong>{t.title}</strong><span>{t.text}</span></div>)}
        </div>
      </section>

      <div className="split">
        <section>
          <h2>Latest deck visits {pitchViewsHref && <a href={pitchViewsHref}>All →</a>}</h2>
          {views.length ? (
            <ul className="list">
              {views.map((v) => {
                const seen = Math.min(v.total_cards, v.cards_seen.length + (v.cards_seen.length ? 1 : 0))
                return (
                  <li key={v.session_id}>
                    <span><b>{v.recipient ?? <i>anonymous</i>}</b> · {v.page}</span>
                    <small>{ist(v.last_seen_at)} · {seen ? `${seen}/${v.total_cards} cards` : 'not started'}{v.completed ? ' · finished' : ''} · {dur(v.seconds)}</small>
                  </li>
                )
              })}
            </ul>
          ) : <p className="hint">No deck visits yet.</p>}
        </section>

        <section>
          <h2>Latest BDR calls <a href="/bdr">Dialer →</a></h2>
          {calls === null ? <p className="hint">Call history is unavailable (check ELEVENLABS_API_KEY).</p>
            : calls.length ? (
              <ul className="list">
                {calls.map((c) => (
                  <li key={c.conversation_id}>
                    <span><b>{ist(c.start_time_unix_secs * 1000)}</b></span>
                    <small>{c.status}{c.call_duration_secs ? ` · ${dur(c.call_duration_secs)}` : ''} · recording and transcript in the dialer</small>
                  </li>
                ))}
              </ul>
            ) : <p className="hint">No calls yet.</p>}
          {callbacks.length > 0 && (
            <>
              <h2 className="sub">Callbacks due now</h2>
              <ul className="list">
                {callbacks.slice(0, 8).map((c) => <li key={c.id}><span><b>{c.phone}</b></span><small>scheduled {ist(c.scheduledFor)}</small></li>)}
              </ul>
            </>
          )}
        </section>
      </div>

      <section>
        <h2>Latest leads <small>40 most recent, newest first</small></h2>
        {leads.length ? (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Lead</th><th>Stage</th><th>Came from</th><th>Booking</th><th>Email</th><th>Last activity</th></tr></thead>
              <tbody>
                {leads.map((l) => {
                  const web = l.unified_context?.web
                  const stage = leadStage(l)
                  return (
                    <tr key={l.id}>
                      <td className="name">{l.customer_name || <i>no name</i>}{web?.brand_name ? <span className="hint" style={{ fontWeight: 400 }}> · {web.brand_name}</span> : null}<small>{l.phone ? <a href={`tel:${l.phone}`}>{l.phone}</a> : 'no phone'}</small></td>
                      <td><span className={`pill ${stageTone(stage)}`}>{stage}</span></td>
                      <td>{leadSource(l) || <span className="hint">unknown</span>}</td>
                      <td className="nowrap">{web?.booking_time ? `${web.booking_label ?? ''} ${web.booking_time}`.trim() : <span className="hint">none</span>}</td>
                      <td>{l.email ?? <span className="hint">none</span>}</td>
                      <td className="when">{l.last_interaction_at ? ist(l.last_interaction_at) : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="hint">No leads to show.</p>}
      </section>
    </main>
  )
}
