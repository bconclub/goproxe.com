import type { Metadata } from 'next'
import { getSupabaseServiceClient } from '../lib/supabase'
import LinkBuilder from './LinkBuilder'

/**
 * Who opened the deck links we sent, and how deep they went (Z, 7 Oct 2026).
 * Private: needs ?key=<PITCH_VIEWS_KEY>. Send links as
 * goproxe.com/what-is-proxe?for=<name>; each visit shows here.
 */

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Deck views · PROXe', robots: { index: false, follow: false } }

type View = {
  session_id: string
  recipient: string | null; page: string; started_at: string; last_seen_at: string; seconds: number
  max_card: number; total_cards: number; cards_seen: string[]; extras_opened: string[]
  completed: boolean; narration: boolean; lang: string | null; device: string | null; referrer: string | null; source: string | null
}

// "direct" = no referring site: the link was opened from WhatsApp, email, an app, or typed in.
// Rows from before 7 Oct 4pm have no source at all.
const fromLabel = (v: View) =>
  !v.source ? 'not recorded yet' : v.source === 'direct' ? (v.recipient ? 'your link (WhatsApp / app / typed)' : 'direct (WhatsApp / app / typed)') : v.source

const ist = (iso: string) => new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const dur = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`)

export default async function PitchViews({ searchParams }: { searchParams: Promise<{ key?: string; for?: string }> }) {
  const sp = await searchParams
  const want = process.env.PITCH_VIEWS_KEY
  if (!want || sp.key !== want) {
    return <main style={{ padding: 40, fontFamily: 'system-ui', color: '#fff', background: '#0c0918', minHeight: '100vh' }}>Not found.</main>
  }
  const db = getSupabaseServiceClient()
  let q = db?.from('pitch_views').select('*').order('last_seen_at', { ascending: false }).limit(300)
  if (q && sp.for) q = q.eq('recipient', sp.for.toLowerCase())
  const { data } = (await q) ?? { data: [] }
  const views = (data ?? []) as View[]
  // The cover counts once they start; jumping ahead with the dots does not count as reading.
  const seenOf = (v: View) => Math.min(v.total_cards, v.cards_seen.length + (v.cards_seen.length ? 1 : 0))
  const started = views.filter((v) => v.cards_seen.length > 0)
  const avgCards = started.length ? Math.round(started.reduce((a, v) => a + seenOf(v), 0) / started.length) : 0
  const stats: [string, string][] = [
    ['Visits', String(views.length)],
    ['Named', String(views.filter((v) => v.recipient).length)],
    ['Anonymous', String(views.filter((v) => !v.recipient).length)],
    ['Started', String(started.length)],
    ['Finished', String(views.filter((v) => v.completed).length)],
    ['Avg cards seen', String(avgCards)],
  ]
  const named = views.filter((v) => v.recipient)
  const people = Array.from(new Set(named.map((v) => v.recipient!)))
  const keyQ = `key=${encodeURIComponent(sp.key!)}`

  const Row = ({ v }: { v: View }) => {
    // Cards actually seen (the cover counts once they start): jumping ahead does not count as reading.
    const seenN = seenOf(v)
    const pct = v.total_cards ? Math.round((seenN / v.total_cards) * 100) : 0
    return (
      <tr style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <td style={td}>{v.recipient ? <a href={`/pitch-views?${keyQ}&for=${encodeURIComponent(v.recipient)}`} style={{ color: '#c4b5fd' }}>{v.recipient}</a> : <span style={{ opacity: .45 }}>anonymous</span>}</td>
        <td style={td} title={v.referrer || undefined}>{fromLabel(v)}</td>
        <td style={td}>{ist(v.started_at)}</td>
        <td style={td}>{v.page}</td>
        <td style={td}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 90, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.1)' }}><div style={{ width: `${pct}%`, height: 6, borderRadius: 3, background: v.completed ? '#22c55e' : '#7c3aed' }} /></div>
            {seenN ? `${seenN} of ${v.total_cards} cards` : 'opened, not started'}{v.completed ? ' · finished' : ''}
          </div>
        </td>
        <td style={td}>{dur(v.seconds)}</td>
        <td style={td}>{v.extras_opened.length ? v.extras_opened.map((k) => k.replace('built-', '')).join(', ') : <span style={{ opacity: .45 }}>none</span>}</td>
        <td style={td}>{v.narration ? `voice · ${v.lang ?? 'en'}` : 'silent'}</td>
        <td style={td}>{v.device ?? ''}</td>
        <td style={td}>
          <form method="post" action="/api/pitch-view/delete" style={{ margin: 0 }}>
            <input type="hidden" name="key" value={sp.key} />
            <input type="hidden" name="session" value={v.session_id} />
            <button type="submit" title="Delete this visit" style={del}>Delete</button>
          </form>
        </td>
      </tr>
    )
  }

  return (
    <main style={{ padding: '32px 20px', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff', background: '#0c0918', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Deck views</h1>
        <LinkBuilder />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '18px 0 6px' }}>
          {stats.map(([l, n]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: '10px 14px', minWidth: 110 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 12, opacity: .6 }}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{ opacity: .65, fontSize: 14, marginTop: 6 }}>
          Every deck visit is here: named links, anonymous visitors on /what-is-proxe and /pitch, and anyone who starts the deck on the homepage. Send <code style={code}>goproxe.com/what-is-proxe?for=name</code> (or <code style={code}>/pitch?for=name</code>). Each visit appears here with how far they got. Times in IST.
          {sp.for && <> Showing <b>{sp.for}</b> · <a href={`/pitch-views?${keyQ}`} style={{ color: '#c4b5fd' }}>show all</a>
            <form method="post" action="/api/pitch-view/delete" style={{ display: 'inline', marginLeft: 10 }}>
              <input type="hidden" name="key" value={sp.key} />
              <input type="hidden" name="recipient" value={sp.for} />
              <button type="submit" style={del}>Delete all visits for {sp.for}</button>
            </form></>}
        </p>
        {!sp.for && people.length > 0 && (
          <p style={{ fontSize: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {people.map((p) => <a key={p} href={`/pitch-views?${keyQ}&for=${encodeURIComponent(p)}`} style={chip}>{p} · {named.filter((v) => v.recipient === p).length}</a>)}
          </p>
        )}
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead><tr style={{ textAlign: 'left', opacity: .55 }}>{['Who', 'Came from', 'Opened', 'Page', 'How far', 'Time', 'Edge cases opened', 'Narration', 'Device', ''].map((h) => <th key={h} style={td}>{h}</th>)}</tr></thead>
            <tbody>{views.map((v, i) => <Row key={i} v={v} />)}</tbody>
          </table>
          {views.length === 0 && <p style={{ opacity: .6 }}>No visits yet.</p>}
        </div>
      </div>
    </main>
  )
}

const td: React.CSSProperties = { padding: '10px 10px', whiteSpace: 'nowrap', verticalAlign: 'middle' }
const code: React.CSSProperties = { background: 'rgba(255,255,255,.08)', padding: '2px 6px', borderRadius: 6 }
const chip: React.CSSProperties = { background: 'rgba(124,58,237,.25)', color: '#fff', padding: '4px 10px', borderRadius: 999, textDecoration: 'none' }
const del: React.CSSProperties = { background: 'rgba(239,68,68,.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,.35)', borderRadius: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }
