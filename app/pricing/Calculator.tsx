'use client'

import { useEffect, useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { CORE_ALLOWANCE, TOP_UP_PACKS, inr, num, type TopUpPack } from '../lib/billing/plan'
import { track } from '../lib/analytics'
import s from './pricing.module.css'

/**
 * Top-up calculator: "I need 250 extra minutes / 1,500 extra leads, what do
 * I buy?" Core is a flat price shown elsewhere; this only prices the extra.
 *
 * Every pack costs the same per unit (₹5 a lead, ₹20 a minute), so the
 * cheapest cover is the need rounded up to the smallest pack, split into the
 * fewest packs. Inputs sync to the URL (?leads=&minutes=) so a pre-filled
 * link can be sent.
 */

const MAX = 50_000

type Line = { pack: TopUpPack; qty: number }

function cover(extra: number, unit: 'leads' | 'minutes'): Line[] {
  if (extra <= 0) return []
  const packs = [...TOP_UP_PACKS].sort((a, b) => b[unit] - a[unit])
  const step = packs[packs.length - 1][unit]
  let left = Math.ceil(extra / step) * step
  const lines: Line[] = []
  for (const p of packs) {
    const qty = Math.floor(left / p[unit])
    if (qty > 0) { lines.push({ pack: p, qty }); left -= qty * p[unit] }
  }
  return lines
}

const clamp = (n: number) => Math.max(0, Math.min(MAX, Math.round(n || 0)))
const sum = (lines: Line[], f: (l: Line) => number) => lines.reduce((a, l) => a + f(l), 0)

function Result({ unit, need, lines }: { unit: 'leads' | 'minutes'; need: number; lines: Line[] }) {
  if (need <= 0) return <p className={s.calcEmpty}>Enter extra {unit} to see the packs.</p>
  const got = sum(lines, (l) => l.qty * l.pack[unit])
  return (
    <>
      <ul className={s.calcLines}>
        {lines.map((l) => (
          <li key={l.pack.price}>
            <span>{l.qty} × {inr(l.pack.price)} pack <small>{num(l.pack[unit])} {unit} each</small></span>
            <b>{inr(l.qty * l.pack.price)}</b>
          </li>
        ))}
      </ul>
      <p className={s.calcGot}>
        <FiCheck aria-hidden /> You get <b>{num(got)} {unit}</b>
        {got > need ? <>, {num(got - need)} more than you need, which rolls over</> : null}
      </p>
    </>
  )
}

export default function Calculator() {
  const [leads, setLeads] = useState(0)
  const [minutes, setMinutes] = useState(250)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('leads')) setLeads(clamp(Number(q.get('leads'))))
    if (q.has('minutes')) setMinutes(clamp(Number(q.get('minutes'))))
  }, [])

  useEffect(() => {
    const q = new URLSearchParams()
    if (leads) q.set('leads', String(leads))
    if (minutes) q.set('minutes', String(minutes))
    const qs = q.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`)
  }, [leads, minutes])

  const leadLines = cover(leads, 'leads')
  const minuteLines = cover(minutes, 'minutes')
  const total = sum(leadLines, (l) => l.qty * l.pack.price) + sum(minuteLines, (l) => l.qty * l.pack.price)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      track('cta_click', { target: 'topup_copy_link', leads, minutes })
    } catch { /* clipboard blocked: the URL bar already holds the link */ }
  }

  return (
    <section className={s.calc} aria-labelledby="calc-h">
      <div className={s.calcIn}>
        <h2 id="calc-h" className={s.calcH}>Top-up calculator</h2>
        <p className={s.calcLede}>
          Need more than the {num(CORE_ALLOWANCE.minutes)} minutes and {num(CORE_ALLOWANCE.leads)} leads in Core? Enter what you need extra and see the packs and the price.
        </p>

        <label className={s.bigField}>
          <span>Extra voice minutes</span>
          <div className={s.bigInput}>
            <input type="number" inputMode="numeric" min={0} max={MAX} step={25} value={minutes || ''} placeholder="0"
              onChange={(e) => setMinutes(clamp(Number(e.target.value)))} />
            <small>minutes</small>
          </div>
          <input type="range" className={s.range} min={0} max={2_000} step={25} value={Math.min(minutes, 2_000)}
            onChange={(e) => setMinutes(Number(e.target.value))} aria-label="Extra voice minutes slider" />
        </label>
        <Result unit="minutes" need={minutes} lines={minuteLines} />

        <label className={s.bigField}>
          <span>Extra leads</span>
          <div className={s.bigInput}>
            <input type="number" inputMode="numeric" min={0} max={MAX} step={50} value={leads || ''} placeholder="0"
              onChange={(e) => setLeads(clamp(Number(e.target.value)))} />
            <small>leads</small>
          </div>
          <input type="range" className={s.range} min={0} max={8_000} step={100} value={Math.min(leads, 8_000)}
            onChange={(e) => setLeads(Number(e.target.value))} aria-label="Extra leads slider" />
        </label>
        <Result unit="leads" need={leads} lines={leadLines} />
      </div>

      <div className={s.bill} aria-live="polite">
        <p className={s.billKicker}>Your top-up</p>
        <p className={s.billBig}>{inr(total)}</p>
        <p className={s.billSmall}>
          {total
            ? [minutes > 0 && `${num(sum(minuteLines, (l) => l.qty * l.pack.minutes))} minutes`, leads > 0 && `${num(sum(leadLines, (l) => l.qty * l.pack.leads))} leads`].filter(Boolean).join(' + ')
            : 'Nothing extra needed'}
        </p>
        <ul className={s.billCovers}>
          <li><FiCheck aria-hidden /> One-time purchase, not a monthly charge</li>
          <li><FiCheck aria-hidden /> Unused minutes and leads roll over to next month</li>
          <li><FiCheck aria-hidden /> ₹20 a minute, ₹5 a lead, on every pack</li>
        </ul>
        <button type="button" className={s.copyBtn} onClick={copyLink}>
          {copied ? <><FiCheck /> Link copied</> : <><FiCopy /> Copy link to this top-up</>}
        </button>
      </div>
    </section>
  )
}
