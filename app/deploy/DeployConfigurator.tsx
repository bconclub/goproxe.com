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
  'Every channel: website chat, WhatsApp, Instagram, Messenger, email, voice',
  'One unified memory, so a customer never repeats themselves',
  'Up to 500 leads managed a month',
  'Automatic follow-up until they reply',
  'Lead scoring and a full pipeline dashboard',
]

export default function DeployConfigurator({ initialMarket }: { initialMarket: Market }) {
  const router = useRouter()
  const [market, setMarket] = useState<Market>(initialMarket)
  const [seats, setSeats] = useState(PRICING.included_seats)
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
      setError(
        data?.reason === 'seat_product_not_configured'
          ? 'Extra seats cannot be purchased online yet. Continue with the two included seats, or talk to us and we will set it up for you.'
          : 'Checkout is unavailable right now. Nothing has been charged.',
      )
      setBusy(false)
    } catch {
      setError('Checkout is unavailable right now. Nothing has been charged.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h1 className={styles.title}>Deploy PROXe</h1>
        <p className={styles.sub}>
          Pick your team size, add your GSTIN if you have one, and see exactly what you pay before
          anything is charged.
        </p>
      </header>

      <div className={styles.grid}>
        <section className={styles.config}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>PROXe Core</h2>
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
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Team seats</h2>
            <p className={styles.hint}>
              One owner login is always free. Core includes {PRICING.included_seats} team seats;
              each extra seat is {formatMoney(PRICING.seat_price[currency], currency)} a month.
            </p>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setSeats((s) => Math.max(PRICING.included_seats, s - 1))}
                disabled={seats <= PRICING.included_seats}
                aria-label="Remove a seat"
              >
                &minus;
              </button>
              <span className={styles.stepValue} aria-live="polite">
                {seats}
              </span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setSeats((s) => Math.min(PRICING.max_seats, s + 1))}
                disabled={seats >= PRICING.max_seats}
                aria-label="Add a seat"
              >
                +
              </button>
              <span className={styles.stepNote}>
                {q.billable_seats === 0
                  ? 'both included'
                  : `${q.billable_seats} paid seat${q.billable_seats > 1 ? 's' : ''}`}
              </span>
            </div>
            {seats >= PRICING.max_seats && (
              <p className={styles.hint}>
                Need more than {PRICING.max_seats}? Talk to us and we will quote it properly.
              </p>
            )}
          </div>

          {market === 'inr' && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>GST</h2>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={hasGst}
                  onChange={(e) => setHasGst(e.target.checked)}
                />
                <span>I am registered under GST and have a GSTIN</span>
              </label>

              {hasGst && (
                <>
                  <input
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
                      Reverse charge applies. We do not levy 18% GST. You self-assess it in GSTR-3B
                      and claim the input credit on the same line, so it costs you nothing.
                    </p>
                  )}
                </>
              )}

              {!hasGst && (
                <p className={styles.hint}>
                  Without a GSTIN, 18% GST is added on top and remitted for you. Add a GSTIN above
                  and reverse charge applies instead.
                </p>
              )}
            </div>
          )}

          <div className={styles.marketRow}>
            <button
              type="button"
              className={market === 'inr' ? styles.marketOn : styles.marketOff}
              onClick={() => setMarket('inr')}
            >
              India, INR
            </button>
            <button
              type="button"
              className={market === 'usd' ? styles.marketOn : styles.marketOff}
              onClick={() => setMarket('usd')}
            >
              International, USD
            </button>
          </div>
        </section>

        <aside className={styles.summary}>
          <h2 className={styles.cardTitle}>What you pay</h2>

          <dl className={styles.lines}>
            <div className={styles.line}>
              <dt>PROXe Core</dt>
              <dd>{formatMoney(q.base, currency)}</dd>
            </div>
            <div className={styles.line}>
              <dt>
                Team seats
                <span className={styles.lineNote}>
                  {q.billable_seats > 0
                    ? `${q.billable_seats} x ${formatMoney(PRICING.seat_price[currency], currency)}`
                    : `${PRICING.included_seats} included`}
                </span>
              </dt>
              <dd>{formatMoney(q.seat_total, currency)}</dd>
            </div>

            <div className={`${styles.line} ${styles.subtotal}`}>
              <dt>Subtotal</dt>
              <dd>{formatMoney(q.subtotal, currency)}</dd>
            </div>

            {q.tax_mode === 'b2c' && (
              <div className={styles.line}>
                <dt>
                  GST
                  <span className={styles.lineNote}>18%, collected and remitted for you</span>
                </dt>
                <dd>{formatMoney(q.tax, currency)}</dd>
              </div>
            )}

            {q.tax_mode === 'rcm' && (
              <div className={styles.line}>
                <dt>
                  GST
                  <span className={styles.lineNote}>reverse charge, not levied</span>
                </dt>
                <dd>{formatMoney(0, currency)}</dd>
              </div>
            )}

            {q.tax_mode === 'international' && (
              <div className={styles.line}>
                <dt>
                  Tax
                  <span className={styles.lineNote}>no Indian GST on an export of services</span>
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
            Billed monthly. Cancel any time. Seats can be changed mid-month and are prorated to the
            day.
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
