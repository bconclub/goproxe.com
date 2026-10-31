'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiCalendar, FiClock, FiVideo, FiMail, FiArrowLeft } from 'react-icons/fi'
import { getStoredUser, getStoredBooking, type LocalBooking } from '../lib/chatLocalStorage'
import { track, trackPurchase } from '../lib/analytics'
import styles from './thankyou.module.css'

const FALLBACK_EMAIL = 'brands@bconclub.com'

export default function ThankYouContent() {
  const params = useSearchParams()
  /**
   * Dodo sends the buyer back here with ?checkout=success, but that only means
   * the checkout ended, not that money moved. Dodo appends its own status: a
   * buyer who never confirmed a card comes back with status=pending, and this
   * page used to tell them "Payment received" (6 Oct: a trial with no card on
   * file that could never bill). Missing status is treated as paid for links
   * that predate the status param.
   */
  const returned = params?.get('checkout') === 'success'
  const status = params?.get('status')?.toLowerCase() ?? null
  const confirmed = !status || status === 'succeeded' || status === 'active'
  const paymentId = params?.get('payment_id') || null
  const subscriptionId = params?.get('subscription_id') || null
  /**
   * What Dodo itself says, polled while the bank decides. Wins over the URL:
   * static /buy links return the buyer before a UPI request is confirmed
   * (31 Oct: "invalid QR code", then this page). null = no id on the URL or
   * the check failed, so the URL status is all we have.
   */
  const [verified, setVerified] = useState<
    'checking' | 'paid' | 'processing' | 'failed' | 'unpaid' | null
  >(returned && (paymentId || subscriptionId) ? 'checking' : null)
  const paid = returned && (verified ? verified === 'paid' : confirmed)
  const unpaid = returned && !paid
  /** Still with the bank: retrying now could double-charge, so no resume button. */
  const processing =
    unpaid && (verified ? verified === 'checking' || verified === 'processing' : status === 'processing')
  /**
   * The payment's own id, whichever of these Dodo appends to the return URL.
   * GA4 and Google Ads dedupe purchases on transaction_id; without one, every
   * refresh of this page was a brand new sale with brand new revenue.
   */
  const transactionId =
    params?.get('payment_id') ||
    params?.get('subscription_id') ||
    params?.get('transaction_id') ||
    undefined

  const [firstName, setFirstName] = useState('')
  const [booking, setBooking] = useState<LocalBooking | null>(null)
  const viewedRef = useRef(false)
  const purchaseRef = useRef(false)

  useEffect(() => {
    if (!returned || (!paymentId && !subscriptionId)) return
    let stopped = false
    let tries = 0
    const query = new URLSearchParams()
    if (paymentId) query.set('payment_id', paymentId)
    if (subscriptionId) query.set('subscription_id', subscriptionId)
    const check = async () => {
      let next: typeof verified = null
      try {
        const res = await fetch(`/api/checkout/verify?${query.toString()}`, { cache: 'no-store' })
        if (res.ok) next = (await res.json()).state ?? null
      } catch {
        // Fall through to the URL status.
      }
      if (stopped) return
      setVerified(next)
      // UPI can sit with the bank for minutes: keep looking for 5 minutes.
      if (next === 'processing' && ++tries < 60) setTimeout(check, 5000)
    }
    check()
    return () => {
      stopped = true
    }
  }, [returned, paymentId, subscriptionId])

  useEffect(() => {
    const user = getStoredUser('proxe')
    setFirstName(user?.name?.trim().split(' ')[0] ?? '')
    setBooking(getStoredBooking('proxe'))
    if (verified === 'checking') return
    const meta = {
      has_name: Boolean(user?.name),
      has_booking: Boolean(getStoredBooking('proxe')),
    }
    // A paid return is the only revenue event on the site — it goes through
    // trackPurchase so Meta receives the real subscription amount in the
    // buyer's own currency (Purchase with no value reports as zero revenue,
    // which makes every campaign look like it earned nothing).
    // Separate guards: a buyer can go processing → paid on this same page.
    if (paid) {
      if (purchaseRef.current) return
      purchaseRef.current = true
      trackPurchase(meta, transactionId)
      return
    }
    if (viewedRef.current) return
    viewedRef.current = true
    if (unpaid) track('checkout_incomplete', { ...meta, status: verified ?? status ?? 'unknown' })
    else track('demo_booked', meta)
  }, [paid, unpaid, status, verified, transactionId])


  const resumeQuery = new URLSearchParams()
  const resumePayment = params?.get('payment_id')
  const resumeSub = params?.get('subscription_id')
  if (resumePayment) resumeQuery.set('payment_id', resumePayment)
  if (resumeSub) resumeQuery.set('subscription_id', resumeSub)
  const resumeHref = `/api/checkout/resume?${resumeQuery.toString()}`

  if (unpaid) {
    return (
      <div className={styles.page}>
        <main className={styles.card}>
          <p className={styles.eyebrow}>{processing ? 'Payment processing' : 'Payment not completed'}</p>
          <h1 className={styles.title}>
            {firstName ? `Almost there, ${firstName}.` : 'Almost there.'}
          </h1>
          <p className={styles.subtitle}>
            {processing
              ? <>Your bank is still confirming the payment. This usually takes a few minutes. Please don&rsquo;t pay again. This page updates by itself.</>
              : <>Your card or UPI wasn&rsquo;t confirmed, so PROXe isn&rsquo;t active yet. If money left your account, your bank returns it automatically. Please try again.</>}
          </p>
          {!processing && (
            <a href={resumeHref} className={styles.cta}>Complete payment</a>
          )}
          <div className={styles.altRow}>
            <a href={`mailto:${FALLBACK_EMAIL}?subject=PROXe%20payment%20help`} className={styles.altLink}>
              <FiMail size={13} /> Need help? Email us
            </a>
          </div>
          <div className={styles.brand}>
            <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" />
          </div>
        </main>
      </div>
    )
  }

  // Paid: no time picker. The team reaches out to set PROXe up (Z, 7 Oct 2026).

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <div className={styles.check} aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className={styles.eyebrow}>
          {paid ? 'Payment received' : booking ? 'You’re booked' : 'Request received'}
        </p>
        <h1 className={styles.title}>
          {firstName ? `Thank you, ${firstName}.` : 'Thank you.'}
          <br />
          <span className={styles.accent}>{paid ? 'PROXe is yours.' : 'You’re in.'}</span>
        </h1>

        <p className={styles.subtitle}>
          {paid
            ? <>Your payment is confirmed. Someone from the PROXe team will reach out to you shortly to set PROXe up on your channels.</>
            : booking
              ? <>Your demo is locked in. We&rsquo;ll send a Google Meet invite to your inbox — see you then.</>
              : <>We&rsquo;ve got your details. The last step is picking a time — we&rsquo;ll walk you through PROXe live, tuned to your business.</>}
        </p>

          <ul className={styles.meta}>
            {paid ? (
              <>
                <li><FiMail size={15} /> A confirmation is on its way to your email</li>
                <li><FiClock size={15} /> The PROXe team will reach out to you shortly</li>
              </>
            ) : booking ? (
              <>
                <li><FiCalendar size={15} /> {booking.label}</li>
                <li><FiClock size={15} /> {booking.time} · 30 minutes</li>
                <li><FiVideo size={15} /> Google Meet · video call</li>
              </>
            ) : (
              <>
                <li><FiClock size={15} /> 30 minutes, end to end</li>
                <li><FiVideo size={15} /> Google Meet · video call</li>
                <li><FiCalendar size={15} /> Pick any open slot this week</li>
              </>
            )}
          </ul>

        <div className={styles.altRow}>
          <a
            href={`mailto:${FALLBACK_EMAIL}?subject=PROXe%20${paid ? 'Onboarding' : 'Demo%20Request'}`}
            className={styles.altLink}
          >
            <FiMail size={13} /> Email us instead
          </a>
          <a href="/" className={styles.altLink}>
            <FiArrowLeft size={13} /> back to home
          </a>
        </div>

        <div className={styles.brand}>
          <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" />
        </div>
      </main>
    </div>
  )
}
