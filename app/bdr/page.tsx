'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * The BDR team's dial page. Fill what you know, pick the agent, dial. The
 * right-hand panel shows the exact first line PROXe will say with those
 * values, then follows the call live (ringing, talking, done + summary) via
 * /api/outreach-dial/status. Every lock lives server-side in the dial
 * route: allowlist, one call per number per 24h, quiet hours 8 PM-9 AM IST.
 *
 * Inline CSS in one <style> block on purpose: this site has no Tailwind,
 * and the page must never pull the marketing stylesheet along.
 */

type AgentKey = 'dm' | 'noname' | 'warm'
type Vars = { first: string; business: string; vertical: string; city: string; hook: string; last: string }
type Recent = { at: number; phone: string; agent: AgentKey; business: string; conv: string | null; outcome?: string }
type Live = { status: string; duration: number | null; summary: string | null; last_lines: string[]; caller_spoke: boolean; termination: string | null; turns: number }

const AGENTS: Array<{ key: AgentKey; label: string; when: string; opener: (v: Vars) => string; second: (v: Vars) => string }> = [
  {
    key: 'dm',
    label: 'Intro DM',
    when: 'First call. You know the decision maker’s name.',
    opener: (v) => `Hi ${v.first || 'there'}, this is PROXe. I am an AI, and I’m calling to introduce myself. Can I have thirty seconds?`,
    second: (v) => `I take care of the customer side of a business, every enquiry and chat on WhatsApp, the website and Instagram. Would something like that be useful at ${v.business || 'your business'}?`,
  },
  {
    key: 'noname',
    label: 'Intro Cold',
    when: 'First call. You only know the business. Reception may answer.',
    opener: (v) => `Hi, is this ${v.business || 'the business'}? This is PROXe, an AI. Can I have thirty seconds?`,
    second: () => 'I take care of the customer side of a business. Could I speak to whoever handles enquiries or marketing?',
  },
  {
    key: 'warm',
    label: 'Follow-up',
    when: 'Second touch. Paste what happened last time.',
    opener: (v) => `Hi ${v.first || 'there'}, PROXe here, following up like I said I would. Is now okay?`,
    second: (v) => `${v.last ? v.last.replace(/\.?$/, '.') : 'Last time we spoke about PROXe.'} What was left open on your side?`,
  },
]

const VERTICALS = ['clinic', 'dental clinic', 'coaching academy', 'school', 'real estate', 'salon / spa', 'gym', 'restaurant', 'retail store', 'marketing agency', 'other']

const REASONS: Record<string, string> = {
  unauthorized: 'Wrong passcode.',
  bad_phone: 'Not an Indian mobile number. Ten digits.',
  not_in_allowlist: 'This number is not on the approved list for this batch. Ask Z.',
  recently_called: 'Already called in the last 24 hours. PROXe will not dial the same number twice in a day.',
  quiet_hours: 'Quiet hours, 8 PM to 9 AM IST. Dial again after 9.',
  unknown_agent: 'Unknown agent.',
}

export default function BdrDialPage() {
  const [key, setKey] = useState('')
  const [phone, setPhone] = useState('')
  const [agent, setAgent] = useState<AgentKey>('dm')
  const [first, setFirst] = useState('')
  const [business, setBusiness] = useState('')
  const [vertical, setVertical] = useState('clinic')
  const [city, setCity] = useState('Bangalore')
  const [hook, setHook] = useState('')
  const [last, setLast] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conv, setConv] = useState<string | null>(null)
  const [live, setLive] = useState<Live | null>(null)
  const [recent, setRecent] = useState<Recent[]>([])
  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    try {
      setKey(localStorage.getItem('bdr-dial-key') || '')
      setRecent(JSON.parse(localStorage.getItem('bdr-recent') || '[]'))
    } catch { /* private mode */ }
  }, [])

  const digits = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  const phoneOk = digits.length === 10 && /^[6-9]/.test(digits)
  const needFirst = agent === 'dm'
  const needLast = agent === 'warm'
  const missing: string[] = []
  if (!key.trim()) missing.push('passcode')
  if (!phoneOk) missing.push('a 10-digit phone')
  if (!business.trim()) missing.push('the business name')
  if (needFirst && !first.trim()) missing.push('the first name')
  if (needLast && !last.trim()) missing.push('what happened last time')
  const canDial = missing.length === 0 && !busy

  const vars: Vars = { first: first.trim(), business: business.trim(), vertical, city: city.trim(), hook: hook.trim(), last: last.trim() }
  const A = AGENTS.find((a) => a.key === agent)!
  const script = useMemo(() => ({ opener: A.opener(vars), second: A.second(vars) }), [A, first, business, last]) // eslint-disable-line react-hooks/exhaustive-deps

  function remember(r: Recent) {
    const next = [r, ...recent.filter((x) => x.conv !== r.conv)].slice(0, 12)
    setRecent(next)
    try { localStorage.setItem('bdr-recent', JSON.stringify(next)) } catch { /* ignore */ }
  }

  async function dial() {
    setBusy(true); setError(null); setLive(null); setConv(null)
    try { localStorage.setItem('bdr-dial-key', key.trim()) } catch { /* ignore */ }
    try {
      const res = await fetch('/api/outreach-dial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key.trim()}` },
        body: JSON.stringify({
          phone: digits, agent,
          vars: {
            first_name: vars.first || undefined, business_name: vars.business, vertical, city: vars.city || undefined,
            research_hook: vars.hook || undefined, last_summary: vars.last || undefined,
          },
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j.ok) {
        setConv(j.conversation_id ?? null)
        setLive({ status: 'initiated', duration: null, summary: null, last_lines: [], caller_spoke: false, termination: null, turns: 0 })
        remember({ at: Date.now(), phone: digits, agent, business: vars.business, conv: j.conversation_id ?? null })
        setPhone('')
      } else {
        setError(REASONS[j.reason] || `Could not dial: ${j.reason || res.status}. Try again, then tell Z.`)
      }
    } catch (e) {
      setError(`No connection: ${(e as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  // Follow the call until it ends.
  useEffect(() => {
    if (!conv) return
    let stopped = false
    const tick = async () => {
      try {
        const r = await fetch(`/api/outreach-dial/status?id=${conv}`, { headers: { Authorization: `Bearer ${key.trim()}` }, cache: 'no-store' })
        const j = await r.json()
        if (stopped) return
        if (j.ok) {
          setLive(j)
          if (j.status === 'done' || j.status === 'failed') {
            const secs = Number(j.duration || 0)
            const outcome = j.status === 'failed' || !j.caller_spoke ? 'no answer' : `${Math.floor(secs / 60)}m ${secs % 60}s`
            setRecent((cur) => {
              const next = cur.map((x) => (x.conv === conv ? { ...x, outcome } : x))
              try { localStorage.setItem('bdr-recent', JSON.stringify(next)) } catch { /* ignore */ }
              return next
            })
            return
          }
        }
      } catch { /* keep polling */ }
      pollRef.current = window.setTimeout(tick, 4000)
    }
    tick()
    return () => { stopped = true; if (pollRef.current) window.clearTimeout(pollRef.current) }
  }, [conv]) // eslint-disable-line react-hooks/exhaustive-deps

  const stage = !live ? null
    : live.status === 'done' ? (live.caller_spoke ? 'done' : 'noanswer')
    : live.status === 'failed' ? 'failed'
    : live.status === 'processing' ? 'wrapping'
    : live.turns > 1 ? 'talking'
    : 'ringing'

  const stageLabel = stage === 'ringing' ? 'Ringing'
    : stage === 'talking' ? `Talking${live?.duration ? ` · ${live.duration}s` : ''}`
    : stage === 'wrapping' ? 'Call ended, writing the summary'
    : stage === 'done' ? `Done · ${live?.duration ?? 0}s`
    : stage === 'noanswer' ? 'No answer'
    : 'Could not connect'

  return (
    <main className="bdr">
      <style>{CSS}</style>

      <section className="form">
        <header>
          <p className="kicker">PROXe dialer</p>
          <h1>Put PROXe on the phone with {first.trim() || business.trim() || 'your next prospect'}.</h1>
          <p className="lede">Fill in what you know. PROXe introduces itself, handles the objections, books the fifteen-minute demo and sends the WhatsApp. The recording and summary land on the Calls page.</p>
        </header>

        <div className="row">
          <label>
            <span>Passcode</span>
            <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="From Z" autoComplete="off" />
          </label>
          <label>
            <span>Mobile number</span>
            <div className="phone">
              <b>+91</b>
              <input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98450 12345" aria-invalid={phone.length > 0 && !phoneOk} />
            </div>
          </label>
        </div>

        <fieldset className="agents">
          <legend>Which call is this?</legend>
          {AGENTS.map((a) => (
            <label key={a.key} className={agent === a.key ? 'on' : ''}>
              <input type="radio" name="agent" value={a.key} checked={agent === a.key} onChange={() => setAgent(a.key)} />
              <b>{a.label}</b>
              <small>{a.when}</small>
            </label>
          ))}
        </fieldset>

        <label>
          <span>Business</span>
          <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Smile Dental Clinic" />
        </label>

        {agent !== 'noname' && (
          <label>
            <span>Decision maker&apos;s first name{needFirst ? '' : ' (if known)'}</span>
            <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Ramesh" />
          </label>
        )}

        <div className="row">
          <label>
            <span>Type of business</span>
            <select value={vertical} onChange={(e) => setVertical(e.target.value)}>
              {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label>
            <span>City</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
        </div>

        <label>
          <span>Why them <em>one line PROXe can say if they ask &ldquo;why me&rdquo;</em></span>
          <input value={hook} onChange={(e) => setHook(e.target.value)} placeholder="You run Meta ads for the clinic, and ads only pay when every enquiry gets answered." />
        </label>

        {agent === 'warm' && (
          <label>
            <span>What happened last time <em>PROXe opens by proving it remembers</em></span>
            <textarea rows={3} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Spoke on Tuesday, asked for pricing on WhatsApp, said call back after the weekend." />
          </label>
        )}

        <div className="cta">
          <button type="button" className="dial" disabled={!canDial} onClick={dial}>
            {busy ? 'Dialling…' : `Dial ${vars.first || vars.business || 'now'}`}
          </button>
          <p className="hint">{missing.length ? `Needs ${missing.join(', ')}.` : 'One call per number per day. No calls 8 PM to 9 AM IST.'}</p>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <aside className="side">
        <div className="script">
          <p className="kicker">What PROXe will say</p>
          <p className="line">&ldquo;{script.opener}&rdquo;</p>
          <p className="then">then, once they say yes</p>
          <p className="line dim">&ldquo;{script.second}&rdquo;</p>
          <p className="foot">Voice: Raj. Under three minutes. Asks for the demo once, then sends the WhatsApp itself.</p>
        </div>

        {live && stage && (
          <div className={`live ${stage}`} aria-live="polite">
            <p className="kicker">{stageLabel}</p>
            {stage === 'talking' && live.last_lines.map((l, i) => <p key={i} className="turn">{l}</p>)}
            {stage === 'done' && <p className="summary">{live.summary || 'Summary is on the Calls page in a minute.'}</p>}
            {stage === 'noanswer' && <p className="summary">They did not pick up, or hung up on the opener. PROXe will not redial today. Try tomorrow, or send the WhatsApp from the inbox.</p>}
            {stage === 'failed' && <p className="summary">The number did not ring. Check the digits.</p>}
          </div>
        )}

        {recent.length > 0 && (
          <div className="recent">
            <p className="kicker">Your recent calls</p>
            <ul>
              {recent.map((r) => (
                <li key={`${r.at}-${r.phone}`}>
                  <span>{r.business || r.phone}</span>
                  <small>{AGENTS.find((a) => a.key === r.agent)?.label} · {new Date(r.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
                  <em>{r.outcome || '…'}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </main>
  )
}

const CSS = `
.bdr{--bg:#0d0b12;--panel:#15121d;--line:rgba(196,181,253,.14);--ink:#f3efff;--ink-2:#b9b0cf;--ink-3:#8b81a3;--accent:#a78bfa;--accent-ink:#1b0b3a;--ok:#5eead4;--warn:#fbbf24;--bad:#fb7185;
  min-height:100vh;background:var(--bg);color:var(--ink);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,400px);gap:32px;padding:32px 24px 64px;max-width:1080px;margin:0 auto;box-sizing:border-box}
.bdr *{box-sizing:border-box}
.bdr header{margin-bottom:8px}
.bdr .kicker{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--accent);margin:0 0 6px}
.bdr h1{font-size:clamp(26px,3.4vw,36px);line-height:1.1;letter-spacing:-.025em;font-weight:800;margin:0 0 10px}
.bdr .lede{color:var(--ink-2);margin:0;max-width:60ch}
.form{display:flex;flex-direction:column;gap:18px}
.form label{display:flex;flex-direction:column;gap:6px;min-width:0}
.form label>span{font-size:13px;font-weight:600;color:var(--ink-2)}
.form label>span em{font-style:normal;font-weight:400;color:var(--ink-3);margin-left:6px}
.form input,.form select,.form textarea{width:100%;font:inherit;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;min-height:48px;outline:none;transition:border-color 150ms cubic-bezier(.16,1,.3,1),box-shadow 150ms cubic-bezier(.16,1,.3,1)}
.form textarea{resize:vertical;min-height:88px}
.form input::placeholder,.form textarea::placeholder{color:var(--ink-3)}
.form input:focus,.form select:focus,.form textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(167,139,250,.22)}
.form input[aria-invalid="true"]{border-color:var(--bad)}
.form .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.phone{display:flex;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding-left:14px;min-height:48px}
.phone b{color:var(--ink-3);font-weight:600;margin-right:4px}
.phone input{border:0;background:transparent;padding-left:6px;min-height:46px}
.phone:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(167,139,250,.22)}
.phone input:focus{box-shadow:none}
.agents{border:0;padding:0;margin:0;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.agents legend{font-size:13px;font-weight:600;color:var(--ink-2);margin-bottom:8px}
.agents label{position:relative;display:flex;flex-direction:column;gap:4px;padding:12px 14px;min-height:78px;border:1px solid var(--line);border-radius:12px;background:var(--panel);cursor:pointer;transition:border-color 150ms cubic-bezier(.16,1,.3,1),background 150ms}
.agents label:hover{border-color:rgba(167,139,250,.5)}
.agents label.on{border-color:var(--accent);background:rgba(167,139,250,.1)}
.agents input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
.agents input:focus-visible+b{outline:2px solid var(--accent);outline-offset:6px;border-radius:4px}
.agents b{font-size:15px;font-weight:700}
.agents small{font-size:12.5px;color:var(--ink-2);line-height:1.35}
.cta{display:flex;flex-direction:column;gap:8px;padding-top:6px}
.dial{font:inherit;font-weight:800;font-size:17px;color:var(--accent-ink);background:var(--accent);border:0;border-radius:14px;min-height:56px;padding:0 22px;cursor:pointer;transition:transform 120ms cubic-bezier(.16,1,.3,1),filter 120ms}
.dial:hover:not(:disabled){filter:brightness(1.06)}
.dial:active:not(:disabled){transform:translateY(1px)}
.dial:disabled{opacity:.38;cursor:not-allowed}
.dial:focus-visible{outline:3px solid #fff;outline-offset:3px}
.hint{margin:0;font-size:13px;color:var(--ink-3)}
.error{margin:0;padding:12px 14px;border-radius:12px;background:rgba(251,113,133,.12);color:#ffd4dc;font-size:14px}
.side{display:flex;flex-direction:column;gap:16px;position:sticky;top:24px;align-self:start}
.script,.live,.recent{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}
.script .line{margin:0;font-size:17px;line-height:1.45;font-weight:600;letter-spacing:-.01em}
.script .line.dim{font-weight:500;color:var(--ink-2)}
.script .then{margin:12px 0 6px;font-size:12px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.04em}
.script .foot{margin:14px 0 0;font-size:13px;color:var(--ink-3)}
.live{animation:rise 420ms cubic-bezier(.16,1,.3,1)}
.live .kicker{color:var(--ink-2)}
.live.ringing .kicker,.live.talking .kicker{color:var(--ok)}
.live.ringing .kicker::before,.live.talking .kicker::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ok);margin-right:8px;animation:pulse 1.2s ease-in-out infinite}
.live.noanswer .kicker{color:var(--warn)}
.live.failed .kicker{color:var(--bad)}
.live .turn{margin:6px 0 0;font-size:14px;color:var(--ink-2)}
.live .summary{margin:6px 0 0;font-size:14.5px;line-height:1.5}
.recent ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.recent li{display:grid;grid-template-columns:1fr auto;grid-template-areas:"a c" "b c";column-gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.recent li:first-child{border-top:0;padding-top:0}
.recent li span{grid-area:a;font-size:14px;font-weight:600}
.recent li small{grid-area:b;font-size:12px;color:var(--ink-3)}
.recent li em{grid-area:c;align-self:center;font-style:normal;font-size:12.5px;color:var(--ink-2);white-space:nowrap}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.live{animation:none}.live .kicker::before{animation:none}}
@media (max-width:860px){.bdr{grid-template-columns:1fr;gap:24px;padding:20px 16px 48px}.side{position:static}.agents{grid-template-columns:1fr}.form .row{grid-template-columns:1fr}}
`
