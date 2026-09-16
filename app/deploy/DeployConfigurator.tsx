'use client'

/**
 * Configure, then pay.
 *
 * WHAT THIS REPLACES
 * The Deploy modal collected a name and a phone and sent the buyer straight to a
 * hosted payment page. Two things went wrong there and both cost money:
 *   1. Seats were never really configurable. Anything past the bundled two hit a
 *      seat product that does not exist in Dodo, checkout refused, and the buyer
 *      was silently bounced to a sales calendar with no explanation.
 *   2. GST was never mentioned. An Indian business with a GSTIN was charged 18%
 *      on top with no chance to declare reverse charge, and only found out
 *      afterwards. That is the "we did not take GST and all that" problem, and
 *      the fix is to compute it BEFORE the card, not after.
 *
 * So: seats, GSTIN, and a full line-by-line total on this page. Nobody reaches a
 * payment form without having already seen the exact number they will be
 * charged.
 */

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser } from '../lib/chatLocalStorage'
import {
  PRICING,
  formatMoney,
  isPlausibleGstin,
  quote,
  resolveTaxMode,
  type Currency,
} from '../lib/billing/pricing'
import styles from './deploy.module.css'

type Market = 'inr' | 'usd'

const CURRENCY: Record<Market, Currency> = { inr: 'INR', usd: 'USD' }

const INCLUDED = [
  'WhatsApp, website, Instagram and voice in one place',
  'Follows up while your team gets on with the business',
  `${PRICING.included_seats} team seats included`,
]

export default function DeployConfigurator({ initialMarket }: { initialMarket: Market }) {
  const router = useRouter()
  const [market] = useState<Market>(initialMarket)
  const seats = PRICING.included_seats
  const [gstin, setGstin] = useState('')
  const [hasGst, setHasGst] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currency = CURRENCY[market]
  // A half-typed GSTIN must not flicker the total between two tax cases. It only
  // counts once it is a complete, well-formed number.
  const effectiveGstin = hasGst && isPlausibleGstin(gstin) ? gstin.trim().toUpperCase() : null
  const taxMode = resolveTaxMode(market, effectiveGstin)
  const q = useMemo(() => quote({ seats, currency, tax_mode: taxMode }), [seats, currency, taxMode])

  const gstinTouched = hasGst && gstin.trim().length > 0
  const gstinValid = isPlausibleGstin(gstin)

  /**
   * Whatever the Deploy modal already captured. Read on the client only: the
   * profile lives in this browser's storage and must never be put in the URL or
   * rendered on the server. Absent when someone lands on /deploy directly, in
   * which case Dodo's hosted page collects the details instead.
   */
  const [profile, setProfile] = useState<ReturnType<typeof getStoredUser>>(null)
  useEffect(() => {
    setProfile(getStoredUser('proxe'))
  }, [])

  async function goToPayment() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market,
          seats,
          gstin: effectiveGstin,
          source: 'deploy_configurator',
          name: profile?.name,
          email: profile?.email,
          phone: profile?.phone,
          brandName: profile?.brandName,
        }),
      })
      const data = await res.json().catch(() => null)
      if (data?.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl as string
        return
      }
      // Name the real reason. "Something went wrong" on a payment page is how a
      // buyer decides the product is not ready.
      setError('Checkout is unavailable right now. Nothing has been charged.')
      setBusy(false)
    } catch {
      setError('Checkout is unavailable right now. Nothing has been charged.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>PROXe Core</p>
        <h1 className={styles.title}>Start with PROXe.</h1>
        <p className={styles.sub}>Your customer conversations, handled from day one.</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.config}>
          <section className={styles.plan} aria-labelledby="plan-title">
            <div className={styles.cardHead}>
              <div>
                <h2 className={styles.cardTitle} id="plan-title">PROXe Core</h2>
                <p className={styles.planHint}>Everything you need to start handling leads properly.</p>
              </div>
              <span className={styles.price}>
                {formatMoney(PRICING.core_price[currency], currency)}
                <span className={styles.per}>/month</span>
              </span>
            </div>
            <ul className={styles.includes}>
              {INCLUDED.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          {market === 'inr' && (
            <section className={styles.gst} aria-labelledby="gst-title">
              <div className={styles.gstHead}>
                <div>
                  <h2 className={styles.gstTitle} id="gst-title">Have a GSTIN?</h2>
                  <p className={styles.gstHint}>Add it only if you are GST registered.</p>
                </div>
                <button
                  type="button"
                  className={hasGst ? styles.gstToggleOn : styles.gstToggle}
                  onClick={() => setHasGst((value) => !value)}
                  aria-expanded={hasGst}
                  aria-controls="gstin-field"
                >
                  {hasGst ? 'Remove' : 'Add GSTIN'}
                </button>
              </div>

              {hasGst && (
                <>
                  <input
                    id="gstin-field"
                    className={`${styles.input} ${gstinTouched && !gstinValid ? styles.inputError : ''}`}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="29AABCU9603R1ZM"
                    maxLength={15}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="GSTIN"
                  />
                  {gstinTouched && !gstinValid && (
                    <p className={styles.errorText}>
                      That is not a valid GSTIN. It is 15 characters: state code, PAN, then three
                      more.
                    </p>
                  )}
                  {gstinValid && (
                    <p className={styles.goodText}>
                      Your tax treatment is reflected in the total before payment.
                    </p>
                  )}
                </>
              )}

            </section>
          )}
        </section>

        <aside className={styles.summary}>
          <p className={styles.summaryEyebrow}>YOUR PLAN</p>
          <h2 className={styles.summaryTitle}>PROXe Core</h2>

          <dl className={styles.lines}>
            <div className={styles.line}>
              <dt>PROXe Core</dt>
              <dd>{formatMoney(q.base, currency)}</dd>
            </div>
            {q.tax_mode === 'b2c' && (
              <div className={styles.line}>
                <dt>
                  GST
                  <span className={styles.lineNote}>18%</span>
                </dt>
                <dd>{formatMoney(q.tax, currency)}</dd>
              </div>
            )}

            {q.tax_mode === 'rcm' && (
              <div className={styles.line}>
                <dt>
                  GST
                  <span className={styles.lineNote}>not added</span>
                </dt>
                <dd>{formatMoney(0, currency)}</dd>
              </div>
            )}

            {q.tax_mode === 'international' && (
              <div className={styles.line}>
                <dt>
                  Tax
                  <span className={styles.lineNote}>not added</span>
                </dt>
                <dd>{formatMoney(0, currency)}</dd>
              </div>
            )}
          </dl>

          <div className={styles.total}>
            <span>Total due today</span>
            <strong>{formatMoney(q.grand_total, currency)}</strong>
          </div>
          <p className={styles.totalNote}>
            Billed monthly. Cancel any time. Nothing is charged until payment.
          </p>

          <button type="button" className={styles.cta} onClick={goToPayment} disabled={busy}>
            {busy ? 'Opening secure checkout...' : 'Continue to payment'}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="button" className={styles.secondary} onClick={() => router.push('/#pricing')}>
            Back to pricing
          </button>
        </aside>
      </div>
    </div>
  )
}
