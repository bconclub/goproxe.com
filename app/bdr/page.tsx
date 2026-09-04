'use client'

import { useEffect, useState, type CSSProperties } from 'react'

/**
 * The BDR team's dial page. One form, one call. Posts to /api/outreach-dial
 * with the team passcode (BDR_DIAL_KEY on the server); every lock lives in
 * that route: allowlist, one call per number per 24h, quiet hours 8 PM-9 AM
 * IST. The call itself is placed by PROXe (ElevenLabs); the recording,
 * transcript and summary show up on the PROXe Calls page as an outbound
 * outreach call, and the lead is created there if it is new.
 *
 * Inline styles on purpose: this site has no Tailwind, and the page must
 * never pull the marketing stylesheet along.
 */

type AgentKey = 'dm' | 'noname' | 'warm'

const AGENTS: Array<{ key: AgentKey; label: string; when: string }> = [
  { key: 'dm', label: 'Sell DM', when: "You know the decision maker's first name." },
  { key: 'noname', label: 'Sell Cold', when: 'You only know the business. Reception may answer.' },
  { key: 'warm', label: 'Sell Warm', when: 'Second touch. Paste what happened last time.' },
]

const VERTICALS = ['clinic', 'coaching academy', 'real estate', 'salon / spa', 'restaurant', 'retail store', 'marketing agency', 'gym', 'school', 'other']

const S: Record<string, CSSProperties> = {
  main: { minHeight: '100vh', background: '#0A0A0A', color: '#fff', padding: '24px 16px 48px', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif' },
  wrap: { maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 },
  h1: { fontSize: 22, fontWeight: 800, margin: 0 },
  lede: { fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '4px 0 8px', lineHeight: 1.45 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  field: { width: '100%', boxSizing: 'border-box', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '12px 12px', fontSize: 16, outline: 'none' },
  agentBtn: { textAlign: 'left', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '10px 12px', cursor: 'pointer', width: '100%' },
  agentBtnOn: { borderColor: '#fff', background: 'rgba(255,255,255,0.12)' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  btnRow: { display: 'flex', gap: 8, paddingTop: 8 },
  check: { flex: 1, borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  dial: { flex: 2, borderRadius: 10, border: 0, background: '#fff', color: '#000', padding: '12px', fontSize: 14, fontWeight: 800, cursor: 'pointer' },
  fine: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, paddingTop: 8 },
}

export default function BdrDialPage() {
  const [key, setKey] = useState('')
  const [phone, setPhone] = useState('')
  const [agent, setAgent] = useState<AgentKey>('dm')
  const [firstName, setFirstName] = useState('')
  const [business, setBusiness] = useState('')
  const [vertical, setVertical] = useState('clinic')
  const [city, setCity] = useState('Bangalore')
  const [hook, setHook] = useState('')
  const [lastSummary, setLastSummary] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; text: string; conv?: string | null } | null>(null)

  useEffect(() => {
    try { setKey(localStorage.getItem('bdr-dial-key') || '') } catch { /* private mode */ }
  }, [])

  const digits = phone.replace(/\D/g, '')
  const phoneOk = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'))
  const canDial = !!key && phoneOk && !!business.trim() && (agent !== 'dm' || !!firstName.trim()) && (agent !== 'warm' || !!lastSummary.trim())

  async function dial(dryRun: boolean) {
    setBusy(true); setResult(null)
    try { localStorage.setItem('bdr-dial-key', key) } catch { /* ignore */ }
    try {
      const res = await fetch('/api/outreach-dial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key.trim()}` },
        body: JSON.stringify({
          phone: digits,
          agent,
          dry_run: dryRun,
          vars: {
            first_name: firstName.trim() || undefined,
            business_name: business.trim(),
            vertical,
            city: city.trim() || undefined,
            research_hook: hook.trim() || undefined,
            last_summary: lastSummary.trim() || undefined,
          },
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j.ok) {
        setResult({
          ok: true,
          text: dryRun
            ? `Would dial ${j.would_dial} with ${AGENTS.find((a) => a.key === agent)?.label}. Nothing placed.`
            : `Ringing ${j.dialed}. The call lands on the PROXe Calls page about a minute after it ends.`,
          conv: j.conversation_id ?? null,
        })
        if (!dryRun) setPhone('')
      } else {
        const why: Record<string, string> = {
          unauthorized: 'Wrong passcode.',
          bad_phone: 'That is not an Indian mobile number (10 digits).',
          not_in_allowlist: 'This number is not on the approved list for this batch. Ask Z.',
          recently_called: `Already called in the last 24 hours${j.last_called_at ? ` (${new Date(j.last_called_at).toLocaleString('en-IN')})` : ''}. Not dialling again.`,
          quiet_hours: `Quiet hours (8 PM to 9 AM IST). Opens ${j.opens_at ? new Date(j.opens_at).toLocaleString('en-IN') : 'at 9 AM'}.`,
          unknown_agent: 'Unknown agent.',
        }
        setResult({ ok: false, text: why[j.reason] || `Failed: ${j.reason || res.status}` })
      }
    } catch (e) {
      setResult({ ok: false, text: `Network error: ${(e as Error).message}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main style={S.main}>
      <div style={S.wrap}>
        <h1 style={S.h1}>PROXe dialer</h1>
        <p style={S.lede}>
          Fill what you know, pick the agent, dial. PROXe makes the call and books the demo. The recording and summary show on the PROXe Calls page.
        </p>

        <div>
          <label style={S.label}>Team passcode</label>
          <input style={S.field} type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="From Z" autoComplete="off" />
        </div>

        <div>
          <label style={S.label}>Phone (10 digits)</label>
          <input style={S.field} inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98450 12345" />
        </div>

        <div>
          <label style={S.label}>Agent</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {AGENTS.map((a) => (
              <button key={a.key} type="button" onClick={() => setAgent(a.key)} style={{ ...S.agentBtn, ...(agent === a.key ? S.agentBtnOn : {}) }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>{a.label}</span>
                <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{a.when}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={S.label}>Business name</label>
          <input style={S.field} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Smile Dental Clinic" />
        </div>

        {agent !== 'noname' && (
          <div>
            <label style={S.label}>Decision maker&apos;s first name{agent === 'dm' ? '' : ' (if known)'}</label>
            <input style={S.field} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ramesh" />
          </div>
        )}

        <div style={S.row2}>
          <div>
            <label style={S.label}>Type of business</label>
            <select style={S.field} value={vertical} onChange={(e) => setVertical(e.target.value)}>
              {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>City</label>
            <input style={S.field} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={S.label}>Why them (one line PROXe can say)</label>
          <input style={S.field} value={hook} onChange={(e) => setHook(e.target.value)} placeholder="You run Meta ads for the clinic, and ads only pay when every enquiry gets answered." />
        </div>

        {agent === 'warm' && (
          <div>
            <label style={S.label}>What happened last time</label>
            <textarea style={{ ...S.field, resize: 'vertical' }} rows={3} value={lastSummary} onChange={(e) => setLastSummary(e.target.value)} placeholder="Spoke on Tuesday, asked for pricing on WhatsApp, said call back after the weekend." />
          </div>
        )}

        <div style={S.btnRow}>
          <button type="button" disabled={!canDial || busy} onClick={() => dial(true)} style={{ ...S.check, opacity: !canDial || busy ? 0.4 : 1 }}>
            Check
          </button>
          <button type="button" disabled={!canDial || busy} onClick={() => dial(false)} style={{ ...S.dial, opacity: !canDial || busy ? 0.4 : 1 }}>
            {busy ? 'Dialling…' : 'Dial with PROXe'}
          </button>
        </div>

        {result && (
          <div style={{ borderRadius: 10, padding: '12px', fontSize: 14, border: `1px solid ${result.ok ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'}`, background: result.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
            {result.text}
            {result.conv && <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>conversation {result.conv}</span>}
          </div>
        )}

        <p style={S.fine}>
          One call per number per day. No calls 8 PM to 9 AM IST. PROXe asks for the demo once, sends the WhatsApp itself, and hangs up under three minutes.
        </p>
      </div>
    </main>
  )
}
