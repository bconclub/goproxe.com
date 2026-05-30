'use client'

import { useEffect, useRef, useState } from 'react'
import { FiCalendar, FiClock, FiVideo, FiArrowRight, FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { getStoredUser, getStoredBooking, type LocalBooking } from '../lib/chatLocalStorage'
import { track } from '../lib/analytics'
import styles from './thankyou.module.css'

/** Keep these in sync with <DeployModal /> — the real scheduling + fallback. */
const BOOKING_URL = 'https://cal.com/bconclub/proxe-intro'
const FALLBACK_EMAIL = 'hello@bconclub.com'

export default function ThankYouContent() {
  const [firstName, setFirstName] = useState('')
  const [booking, setBooking] = useState<LocalBooking | null>(null)
  const viewedRef = useRef(false)

  // Read the captured name + the slot they picked on the modal calendar, and fire
  // the thank-you view exactly once (ref guard survives StrictMode's dev double-mount).
  useEffect(() => {
    const user = getStoredUser('proxe')
    const name = user?.name?.trim().split(' ')[0] ?? ''
    const slot = getStoredBooking('proxe')
    setFirstName(name)
    setBooking(slot)
    if (viewedRef.current) return
    viewedRef.current = true
    track('thank_you_view', { has_name: Boolean(name), has_booking: Boolean(slot) })
  }, [])

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <div className={styles.check} aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className={styles.eyebrow}>{booking ? 'You’re booked' : 'Request received'}</p>
        <h1 className={styles.title}>
          {firstName ? `Thank you, ${firstName}.` : 'Thank you.'}
          <br />
          <span className={styles.accent}>You&rsquo;re in.</span>
        </h1>
        <p className={styles.subtitle}>
          {booking
            ? <>Your demo is locked in. We&rsquo;ll send a Google Meet invite to your inbox — see you then.</>
            : <>We&rsquo;ve got your details. The last step is picking a time — we&rsquo;ll walk you through PROXe live, tuned to your business.</>}
        </p>

        <ul className={styles.meta}>
          {booking ? (
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

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.cta}
          onClick={() => track('book_call_click', { location: 'thank_you', has_booking: Boolean(booking) })}
        >
          {booking
            ? <>Add to your calendar <FiCheckCircle size={16} /></>
            : <>Open the calendar <FiArrowRight size={16} /></>}
        </a>

        <div className={styles.altRow}>
          <a
            href={`mailto:${FALLBACK_EMAIL}?subject=PROXe%20Demo%20Request`}
            className={styles.altLink}
          >
            <FiMail size={13} /> or email us instead
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
