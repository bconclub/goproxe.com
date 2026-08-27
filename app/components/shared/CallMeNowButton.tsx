'use client'

import { useState, useRef, useEffect } from 'react'
import { track, trackLead } from '../../lib/analytics'
import { submitLead } from '../../lib/leads'
import { detectMarket } from '../../lib/market'
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage'

/**
 * "Call me now" — the secondary half of the CTA pair.
 *
 * WHY IT DIALS RATHER THAN BOOKS. The pages's secondary CTAs used to say
 * "Not ready? Book a call" / "Talk to sales" and opened a booking calendar.
 * This says "Call me now", so it has to actually call — a button that names an
 * immediate action and delivers a calendar is the same broken promise as a
 * button that says Deploy and rings your phone, only inverted. It reuses
 * /api/callback, the same endpoint the hero uses.
 *
 * Closed, it is one button. Clicked, it expands into a phone field in place,
 * so the pair keeps its shape until someone opts in and nothing on the page
 * jumps for people who never touch it.
 *
 * ONE CALL PER NUMBER PER 24 HOURS is enforced server-side, and someone who
 * already tried the hero will hit it here. That is not an error and must not
 * read as one: the cooldown answer offers the booking calendar instead, which
 * is the path this button replaced.
 */

export default function CallMeNowButton({
  source,
  onBookInstead,
  className = '',
}: {
  /** Analytics source, e.g. 'pricing_core_call' — kept distinct per placement. */
  source: string
  /** Fallback when the number is inside its 24h cooldown, or the dial fails. */
  onBookInstead: () => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'dialing' | 'ringing' | 'blocked' | 'failed'>('idle')
  const [error, setError] = useState('')
  const [placeholder, setPlaceholder] = useState('Your phone number')
  const inputRef = useRef<HTMLInputElement>(null)
  const startedRef = useRef(false)

  // detectMarket() reads navigator/Intl, which do not exist during SSR —
  // setting this in render would risk a hydration mismatch.
  useEffect(() => {
    setPlaceholder(detectMarket() === 'inr' ? '+91 98765 43210' : '+1 555 000 1234')
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const expand = () => {
    setOpen(true)
    track('button_click', { label: 'call_me_now', location: source })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startedRef.current) {
      startedRef.current = true
      track('callback_start', { market: detectMarket(), location: source })
    }
    setPhone(e.target.value)
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = phone.trim()
    const digits = trimmed.replace(/\D/g, '')
    
    // Empty submission is "start the form", not a failed validation.
    // Focus the input; do not track form_error.
    if (digits.length === 0) {
      inputRef.current?.focus()
      return
    }
    
    // Real incomplete numbers (1–7 or >15 digits) are actual failed attempts.
    if (digits.length < 8 || digits.length > 15) {
      setError('That number looks incomplete.')
      track('form_error', { form: source, field: 'phone', reason: 'length' })
      return
    }

    setStatus('dialing')

    // Same event id down both paths so Meta merges pixel + CAPI into one Lead.
    const leadEventId = trackLead({ source })
    track('callback_submit', { market: detectMarket(), location: source })

    // Merge, never replace: a phone-only capture must not wipe a name or email
    // captured elsewhere on the page.
    storeUserProfile(
      { ...(getStoredUser('proxe') ?? {}), phone: trimmed, promptedPhone: true },
      'proxe',
    )

    // Hard ceiling on the dial. A request that never settles would otherwise
    // leave the control stuck with no way to tell whether a phone is ringing.
    const ac = new AbortController()
    const timeout = window.setTimeout(() => ac.abort(), 20000)

    // Capture the lead AND dial in parallel: the ring has to start while they
    // are still looking at the page, and neither failing may block the other.
    const [, dial] = await Promise.all([
      submitLead({ type: 'lead', phone: trimmed, source, eventId: leadEventId }),
      fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmed, market: detectMarket() }),
        signal: ac.signal,
      })
        .then((r) => r.json().catch(() => ({ ok: false, reason: 'bad_response' })))
        .catch((err) => ({
          ok: false,
          reason: err?.name === 'AbortError' ? 'timeout' : 'network_error',
        })),
    ])
    window.clearTimeout(timeout)

    // Read the BODY, not the HTTP status: /api/callback answers 200 for several
    // outcomes that are not "a phone is ringing", the cooldown chief among them.
    if (dial?.ok) {
      setStatus('ringing')
      track('callback_dialed', { location: source })
      return
    }

    if (dial?.reason === 'recently_called') {
      // The guard doing its job, not a failure. Its own event so the two never
      // blur together in the funnel.
      setStatus('blocked')
      track('callback_blocked', { reason: 'recently_called', location: source })
      return
    }

    setStatus('failed')
    track('callback_failed', { reason: dial?.reason ?? 'unknown', location: source })
  }

  if (!open) {
    return (
      <button type="button" onClick={expand} className={`pr-cta-secondary ${className}`}>
        Call me now
      </button>
    )
  }

  if (status === 'ringing') {
    return (
      <p className={`pr-cta-note ${className}`} role="status">
        Calling you now — pick up.
      </p>
    )
  }

  if (status === 'blocked') {
    return (
      <p className={`pr-cta-note ${className}`} role="status">
        You have already had a call today.{' '}
        <button type="button" onClick={onBookInstead} className="pr-cta-inline-link">
          Book a time instead
        </button>
      </p>
    )
  }

  if (status === 'failed') {
    return (
      <p className={`pr-cta-note ${className}`} role="status">
        That did not connect.{' '}
        <button type="button" onClick={onBookInstead} className="pr-cta-inline-link">
          Book a time instead
        </button>
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`pr-cta-callform ${className}`}>
      <input
        ref={inputRef}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Your phone number"
        disabled={status === 'dialing'}
        className="pr-cta-callinput"
      />
      <button type="submit" disabled={status === 'dialing'} className="pr-cta-callgo">
        {status === 'dialing' ? 'Dialling…' : 'Call me'}
      </button>
      {error && (
        <span role="alert" className="pr-cta-callerr">
          {error}
        </span>
      )}
    </form>
  )
}
