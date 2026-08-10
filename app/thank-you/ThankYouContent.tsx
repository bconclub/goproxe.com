'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiCalendar, FiClock, FiVideo, FiMail, FiArrowLeft } from 'react-icons/fi'
import { getStoredUser, getStoredBooking, storeBooking, type LocalBooking } from '../lib/chatLocalStorage'
import { track, trackPurchase, newEventId } from '../lib/analytics'
import { submitLead } from '../lib/leads'
import BookingCalendar, { type BookingSlot } from '../components/shared/BookingCalendar'
import styles from './thankyou.module.css'

const FALLBACK_EMAIL = 'hello@bconclub.com'

export default function ThankYouContent() {
  const params = useSearchParams()
  /** Dodo sends the buyer back here with ?checkout=success after payment. */
  const paid = params.get('checkout') === 'success'

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [booking, setBooking] = useState<LocalBooking | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const viewedRef = useRef(false)

  useEffect(() => {
    const user = getStoredUser('proxe')
    setFirstName(user?.name?.trim().split(' ')[0] ?? '')
    setEmail(user?.email?.trim() ?? '')
    setBooking(getStoredBooking('proxe'))
    setHydrated(true)
    if (viewedRef.current) return
    viewedRef.current = true
    const meta = {
      has_name: Boolean(user?.name),
      has_booking: Boolean(getStoredBooking('proxe')),
    }
    // A paid return is the only revenue event on the site — it goes through
    // trackPurchase so Meta receives the real subscription amount in the
    // buyer's own currency (Purchase with no value reports as zero revenue,
    // which makes every campaign look like it earned nothing).
    if (paid) trackPurchase(meta)
    else track('demo_booked', meta)
  }, [paid])

  /**
   * Post-payment onboarding call. The lead row already exists (captured before
   * checkout), so this is the same booking upsert the modal calendar does —
   * matched by email.
   */
  const handleBookingConfirm = (slot: BookingSlot) => {
    storeBooking({ label: slot.label, time: slot.time }, 'proxe')
    setBooking({ label: slot.label, time: slot.time })
    const bookingEventId = newEventId()
    track('booking_confirm', {
      source: 'post_checkout',
      day_of_week: new Date(slot.iso).toLocaleDateString('en-US', { weekday: 'long' }),
      time: slot.time,
    }, bookingEventId)
    if (email) {
      submitLead({ type: 'booking', eventId: bookingEventId, email, bookingLabel: slot.label, bookingTime: slot.time })
    }
  }

  // Paid but no slot chosen yet → the whole page IS the scheduler.
  const needsScheduling = paid && hydrated && !booking

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <div className={styles.check} aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className={styles.eyebrow}>
          {paid ? (booking ? 'You’re all set' : 'Payment received') : booking ? 'You’re booked' : 'Request received'}
        </p>
        <h1 className={styles.title}>
          {firstName ? `Thank you, ${firstName}.` : 'Thank you.'}
          <br />
          <span className={styles.accent}>{paid ? 'PROXe is yours.' : 'You’re in.'}</span>
        </h1>

        <p className={styles.subtitle}>
          {paid
            ? booking
              ? <>Payment confirmed and your onboarding call is locked in. We&rsquo;ll send a Google Meet invite — come with your channels handy and we&rsquo;ll wire PROXe up live.</>
              : <>Payment confirmed. Last step: pick a time and we&rsquo;ll set PROXe up on your channels together.</>
            : booking
              ? <>Your demo is locked in. We&rsquo;ll send a Google Meet invite to your inbox — see you then.</>
              : <>We&rsquo;ve got your details. The last step is picking a time — we&rsquo;ll walk you through PROXe live, tuned to your business.</>}
        </p>

        {needsScheduling ? (
          <div className={styles.scheduler}>
            <BookingCalendar
              firstName={firstName}
              isSubmitting={false}
              onConfirm={handleBookingConfirm}
            />
          </div>
        ) : (
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
        )}

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
