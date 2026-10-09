'use client'

import { useEffect, useState } from 'react'
import { FiArrowRight, FiCheck, FiCopy, FiMinus, FiPlus } from 'react-icons/fi'
import { PRICING } from '../lib/billing/pricing'
import { CORE_ALLOWANCE, TOP_UP_PACKS, GST_PERCENT, inr, num, type TopUpPack } from '../lib/billing/plan'
import { track } from '../lib/analytics'
import s from './pricing.module.css'

/**
 * "How many leads a month?" → the full monthly bill.
 *
 * Every pack costs the same per unit (₹5 a lead, ₹20 a minute), so the
 * cheapest cover for any shortfall is the gap rounded up to the smallest
 * pack, split into the fewest packs. Inputs sync
 * to the URL (?leads=&minutes=&seats=) so a pre-filled link can be sent.
 */

const CORE = PRICING.core_price.INR / 100
const SEAT = PRICING.seat_price.INR / 100
const MAX_LEADS = 20_000
const MAX_MINUTES = 5_000

type Line = { pack: TopUpPack; qty: number }

function cover(extra: number, unit: 'leads' | 'minutes'): Line[] {
  if (extra <= 0) return []
  const packs = [...TOP_UP_PACKS].sort((a, b) => b[unit] - a[unit])
  const step = packs[packs.length - 1][unit]
  // Round up to the smallest pack, then split into the fewest packs exactly.
  let left = Math.ceil(extra / step) * step
  const lines: Line[] = []
  for (const p of packs) {
    const qty = Math.floor(left / p[unit])
    if (qty > 0) { lines.push({ pack: p, qty }); left -= qty * p[unit] }
  }
  return lines
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n || 0)))

export default function Calculator() {
  const [leads, setLeads] = useState<number>(CORE_ALLOWANCE.leads)
  const [minutes, setMinutes] = useState<number>(CORE_ALLOWANCE.minutes)
  const [seats, setSeats] = useState<number>(PRICING.included_seats)
  const [copied, setCopied] = useState(false)

  // Pre-fill from a shared link.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('leads')) setLeads(clamp(Number(q.get('leads')), 0, MAX_LEADS))
    if (q.get('minutes')) setMinutes(clamp(Number(q.get('minutes')), 0, MAX_MINUTES))
    if (q.get('seats')) setSeats(clamp(Number(q.get('seats')), PRICING.included_seats, PRICING.max_seats))
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    q.set('leads', String(leads)); q.set('minutes', String(minutes)); q.set('seats', String(seats))
    window.history.replaceState(null, '', `${window.location.pathname}?${q.toString()}`)
  }, [leads, minutes, seats])

  const leadLines = cover(leads - CORE_ALLOWANCE.leads, 'leads')
  const minuteLines = cover(minutes - CORE_ALLOWANCE.minutes, 'minutes')
  const extraSeats = Math.max(0, seats - PRICING.included_seats)

  const leadTopUp = leadLines.reduce((a, l) => a + l.qty * l.pack.price, 0)
  const minuteTopUp = minuteLines.reduce((a, l) => a + l.qty * l.pack.price, 0)
  const seatTotal = extraSeats * SEAT
  const subtotal = CORE + seatTotal + leadTopUp + minuteTopUp
  const gst = Math.round(subtotal * GST_PERCENT) / 100
  const total = subtotal + gst

  const leadsCovered = CORE_ALLOWANCE.leads + leadLines.reduce((a, l) => a + l.qty * l.pack.leads, 0)
  const minutesCovered = CORE_ALLOWANCE.minutes + minuteLines.reduce((a, l) => a + l.qty * l.pack.minutes, 0)
  const perLead = leads > 0 ? subtotal / leads : 0
  const suggestScale = leadTopUp + minuteTopUp > CORE

  const money = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      track('cta_click', { target: 'pricing_copy_link', leads, minutes, seats })
    } catch { /* clipboard blocked: the URL bar already holds the link */ }
  }

  return (
    <section className={s.calc} aria-labelledby="calc-h">
      <div className={s.calcIn}>
        <h2 id="calc-h" className={s.calcH}>What will PROXe cost you?</h2>
        <p className={s.calcLede}>Enter how many leads you get a month. Everything else updates as you type.</p>

        <label className={s.bigField}>
          <span>Leads per month</span>
          <div className={s.bigInput}>
            <input
              type="number" inputMode="numeric" min={0} max={MAX_LEADS} step={50}
              value={leads}
              onChange={(e) => setLeads(clamp(Number(e.target.value), 0, MAX_LEADS))}
              aria-describedby="leads-hint"
            />
            <small>leads</small>
          </div>
          <input type="range" className={s.range} min={0} max={10_000} step={100} value={Math.min(leads, 10_000)} onChange={(e) => setLeads(Number(e.target.value))} aria-label="Leads per month slider" />
          <small id="leads-hint" className={s.hint}>One lead is one person, however many messages or channels. Core covers {num(CORE_ALLOWANCE.leads)}.</small>
        </label>

        <label className={s.bigField}>
          <span>Voice minutes per month</span>
          <div className={s.bigInput}>
            <input
              type="number" inputMode="numeric" min={0} max={MAX_MINUTES} step={25}
              value={minutes}
              onChange={(e) => setMinutes(clamp(Number(e.target.value), 0, MAX_MINUTES))}
            />
            <small>minutes</small>
          </div>
          <input type="range" className={s.range} min={0} max={2_000} step={25} value={Math.min(minutes, 2_000)} onChange={(e) => setMinutes(Number(e.target.value))} aria-label="Voice minutes slider" />
          <small className={s.hint}>AI calls, reminder calls and the dashboard voice assistant. Only answered calls count. Core covers {num(CORE_ALLOWANCE.minutes)}.</small>
        </label>

        <div className={s.bigField}>
          <span>Team seats</span>
          <div className={s.stepper}>
            <button type="button" aria-label="One seat fewer" onClick={() => setSeats((n) => Math.max(PRICING.included_seats, n - 1))} disabled={seats <= PRICING.included_seats}><FiMinus /></button>
            <output aria-live="polite">{seats}</output>
            <button type="button" aria-label="One seat more" onClick={() => setSeats((n) => Math.min(PRICING.max_seats, n + 1))} disabled={seats >= PRICING.max_seats}><FiPlus /></button>
          </div>
          <small className={s.hint}>{PRICING.included_seats} included, then {inr(SEAT)} per seat a month.</small>
        </div>
      </div>

      <div className={s.bill} aria-live="polite">
        <p className={s.billKicker}>Your monthly breakdown</p>
        <table className={s.billTable}>
          <tbody>
            <tr><th>PROXe Core<small>{num(CORE_ALLOWANCE.leads)} leads · {num(CORE_ALLOWANCE.minutes)} minutes · {CORE_ALLOWANCE.seats} seats</small></th><td>{inr(CORE)}</td></tr>
            {leadLines.map((l) => (
              <tr key={`l${l.pack.price}`}><th>{l.qty} × {inr(l.pack.price)} lead pack<small>+{num(l.qty * l.pack.leads)} leads</small></th><td>{inr(l.qty * l.pack.price)}</td></tr>
            ))}
            {minuteLines.map((l) => (
              <tr key={`m${l.pack.price}`}><th>{l.qty} × {inr(l.pack.price)} minute pack<small>+{num(l.qty * l.pack.minutes)} minutes</small></th><td>{inr(l.qty * l.pack.price)}</td></tr>
            ))}
            {extraSeats > 0 && <tr><th>{extraSeats} extra seat{extraSeats > 1 ? 's' : ''}<small>{inr(SEAT)} each</small></th><td>{inr(seatTotal)}</td></tr>}
            <tr className={s.billSub}><th>Subtotal</th><td>{inr(subtotal)}</td></tr>
            <tr><th>GST {GST_PERCENT}%</th><td>{money(gst)}</td></tr>
            <tr className={s.billTotal}><th>Total per month</th><td>{money(total)}</td></tr>
          </tbody>
        </table>

        <ul className={s.billCovers}>
          <li><FiCheck aria-hidden /> <b>{num(leadsCovered)}</b> leads covered{leadsCovered > leads && leads > CORE_ALLOWANCE.leads ? `, ${num(leadsCovered - leads)} roll over` : ''}</li>
          <li><FiCheck aria-hidden /> <b>{num(minutesCovered)}</b> voice minutes{minutesCovered > minutes && minutes > CORE_ALLOWANCE.minutes ? `, ${num(minutesCovered - minutes)} roll over` : ''}</li>
          <li><FiCheck aria-hidden /> <b>{seats}</b> team seats</li>
          {leads > 0 && <li><FiCheck aria-hidden /> about <b>{money(Math.round(perLead * 100) / 100)}</b> per lead, before GST</li>}
        </ul>

        {suggestScale && (
          <p className={s.billScale}>At this volume the Scale plan, priced for your volume, is likely to cost less. Ask us for a quote.</p>
        )}

        <p className={s.billNote}>Prices in INR. With a valid GSTIN, reverse charge applies and GST is not added. WhatsApp fees are billed by Meta directly. Unused top-ups roll over to next month.</p>

        <button type="button" className={s.copyBtn} onClick={copyLink}>
          {copied ? <><FiCheck /> Link copied</> : <><FiCopy /> Copy link to this quote</>}
        </button>
        <a href="#plan" className={s.billMore}>See what's included <FiArrowRight size={13} /></a>
      </div>
    </section>
  )
}
