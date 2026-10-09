'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiCheck, FiPhone, FiRefreshCw, FiMessageSquare, FiUsers, FiZap } from 'react-icons/fi'
import { useDeployModal } from '../contexts/DeployModalContext'
import { track } from '../lib/analytics'
import { PRICING } from '../lib/billing/pricing'
import { CORE_ALLOWANCE, TOP_UP_PACKS, GST_PERCENT, inr, num, perUnit, savingPct } from '../lib/billing/plan'
import Calculator from './Calculator'
import CallMeNowButton from '../components/shared/CallMeNowButton'
import WhatsAppHeaderButton from '../components/shared/WhatsAppHeaderButton'
import { INCLUDED, HOW, PRICING_FAQ } from './content'
import s from './pricing.module.css'

const CORE_PRICE = PRICING.core_price.INR / 100
const SEAT_PRICE = PRICING.seat_price.INR / 100

type PackKind = 'minutes' | 'leads'

export default function PricingPage() {
  const { openModal, startDeploy, isStartingCheckout } = useDeployModal()
  const [scrolled, setScrolled] = useState(false)
  const [kind, setKind] = useState<PackKind>('minutes')

  useEffect(() => {
    track('pricing_view', { market: 'inr', location: 'pricing_page' })
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const deploy = (source: string) => {
    track('plan_select', { plan: 'core', market: 'inr', location: source })
    void startDeploy(source)
  }

  return (
    <main className={s.page}>
      <div className="proxe-float-header" data-scrolled={scrolled ? 'true' : 'false'}>
        <Link href="/" className="proxe-float-logo" aria-label="PROXe home">
          <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" className="proxe-nav-logo-full proxe-nav-logo--light" />
          <img src="/proxe/brand/proxe-icon-white.webp" alt="" aria-hidden="true" className="proxe-nav-logo-icon" />
        </Link>
        <div className="proxe-float-actions">
          <WhatsAppHeaderButton location="pricing_page" />
          <button type="button" className="proxe-float-cta" onClick={() => deploy('pricing_page_header')}>
            <span className="proxe-float-cta-full">Deploy PROXe</span>
            <span className="proxe-float-cta-short" aria-hidden="true">Deploy</span>
          </button>
        </div>
      </div>

      <div className={s.wrap}>
        {/* ── Hero ── */}
        <header className={s.hero}>
          <p className={s.eyebrow}>Plan &amp; pricing</p>
          <h1 className={s.h1}>One plan. Every lead answered.</h1>
          <p className={s.lede}>
            {inr(CORE_PRICE)} a month for {num(CORE_ALLOWANCE.leads)} leads, {num(CORE_ALLOWANCE.minutes)} voice minutes and {CORE_ALLOWANCE.seats} seats. Need more? Add packs that roll over.
          </p>
        </header>

        {/* ── Core plan ── */}
        <section id="plan" className={s.coreRow} aria-label="PROXe Core">
          <article className={s.coreCard}>
            <p className={s.tier}>PROXe Core</p>
            <p className={s.price}>{inr(CORE_PRICE)}</p>
            <p className={s.per}>per month</p>
            <hr className={s.rule} />
            <p className={s.coreBlurb}>Every lead answered, qualified and followed up, on voice and text.</p>
            <button type="button" className={s.ctaPrimary} onClick={() => deploy('pricing_page_core')} disabled={isStartingCheckout}>
              {isStartingCheckout ? 'Opening checkout…' : <>Deploy PROXe <FiArrowRight size={15} /></>}
            </button>
            <CallMeNowButton source="pricing_page_call" onBookInstead={() => openModal('pricing_page_call')} className={s.ctaCall} />
          </article>

          <div className={s.stat}>
            <FiPhone className={s.statIco} aria-hidden />
            <p className={s.statNum}>{num(CORE_ALLOWANCE.minutes)}</p>
            <p className={s.statLabel}>voice minutes</p>
            <p className={s.statText}>AI calls, reminder calls and the voice assistant on your dashboard.</p>
          </div>
          <div className={s.stat}>
            <FiMessageSquare className={s.statIco} aria-hidden />
            <p className={s.statNum}>{num(CORE_ALLOWANCE.leads)}</p>
            <p className={s.statLabel}>leads managed</p>
            <p className={s.statText}>Every contact PROXe handles in the month on WhatsApp, web chat and Instagram.</p>
          </div>
          <div className={s.stat}>
            <FiUsers className={s.statIco} aria-hidden />
            <p className={s.statNum}>{CORE_ALLOWANCE.seats}</p>
            <p className={s.statLabel}>team seats</p>
            <p className={s.statText}>Add more anytime at {inr(SEAT_PRICE)} per seat per month.</p>
          </div>
        </section>

        {/* ── Included ── */}
        <section className={s.section}>
          <h2 className={s.h2}>Everything in Core</h2>
          <ul className={s.included}>
            {INCLUDED.map((f) => (
              <li key={f}><span className={s.tick}><FiCheck size={12} /></span>{f}</li>
            ))}
          </ul>
        </section>

        {/* ── Top-ups ── */}
        <section className={s.section} aria-labelledby="topups">
          <div className={s.sectionHead}>
            <h2 id="topups" className={s.h2}>Top-up packs: bigger packs cost less</h2>
            <div className={s.toggle} role="group" aria-label="Show packs as">
              <button type="button" aria-pressed={kind === 'minutes'} onClick={() => setKind('minutes')}>Minutes</button>
              <button type="button" aria-pressed={kind === 'leads'} onClick={() => setKind('leads')}>Leads</button>
            </div>
          </div>
          <div className={s.packs}>
            {TOP_UP_PACKS.map((p) => (
              <div key={p.price} className={s.pack}>
                {savingPct(p) > 0 && <span className={s.packSave}>Save {savingPct(p)}%</span>}
                <div>
                  <p className={s.packPrice}>{inr(p.price)}</p>
                  <p className={s.packRate}>{kind === 'minutes' ? `₹${perUnit(p, 'minutes')} a minute` : `₹${perUnit(p, 'leads')} a lead`}</p>
                </div>
                <div className={s.packOpts}>
                  <p data-on={kind === 'minutes'}><strong>{num(p.minutes)}</strong> minutes</p>
                  <span>or</span>
                  <p data-on={kind === 'leads'}><strong>{num(p.leads)}</strong> leads</p>
                </div>
              </div>
            ))}
          </div>
          <Calculator />
          <p className={s.rollover}>
            <FiRefreshCw aria-hidden /> <span><strong>Your top-ups roll over.</strong> Pick minutes or leads when you buy. Anything you don&apos;t use carries into next month, so your pool of extra minutes and leads keeps building.</span>
          </p>
          <div className={s.seatRow}>
            <div className={s.seatName}>
              <strong>Extra seat</strong>
              <span>For more of your team</span>
            </div>
            <div className={s.seatPrice}>
              <span>Per seat</span>
              <strong>{inr(SEAT_PRICE)}<small> / month</small></strong>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className={s.section} aria-labelledby="how">
          <h2 id="how" className={s.h2}>How it works</h2>
          <ol className={s.how}>
            {HOW.map((h, i) => (
              <li key={h.t}><span className={s.howNum}>{i + 1}</span><p><strong>{h.t}</strong> {h.d}</p></li>
            ))}
          </ol>
        </section>

        {/* ── Scale ── */}
        <section className={s.scale}>
          <div>
            <p className={s.tier}><FiZap aria-hidden /> PROXe Scale</p>
            <h2 className={s.h2}>Need more every month?</h2>
            <p className={s.scaleText}>Move to the Scale plan, priced for your volume. For multi-location teams and anyone topping up every month: volume rates, unlimited seats, priority onboarding and custom integrations.</p>
          </div>
          <button type="button" className={s.ctaGhost} onClick={() => { track('plan_select', { plan: 'scale', market: 'inr', location: 'pricing_page' }); openModal('pricing_page_scale') }}>
            Talk to the team <FiArrowRight size={15} />
          </button>
        </section>

        {/* ── FAQ ── */}
        <section className={s.section} aria-labelledby="faq">
          <h2 id="faq" className={s.h2}>Pricing questions</h2>
          <div className={s.faq}>
            {PRICING_FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className={s.foot}>
          <Link href="/">goproxe.com</Link>
          <span>All prices in INR, exclusive of {GST_PERCENT}% GST</span>
        </footer>
      </div>
    </main>
  )
}
