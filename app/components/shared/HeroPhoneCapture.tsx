'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero quick-capture: one phone field, one tap, PROXe dials back in seconds.
 *
 * The lowest-friction conversion on the page — no name, no email, no modal.
 * Lands in the same /api/lead sink as the deploy form (Supabase `all_leads`
 * upserts by phone, so if the visitor later completes the full form the two
 * touches merge onto one row). Fires the same funnel events as the deploy
 * form (`lead_form_start` → `form_completed`/Meta `Lead`) with
 * source: 'hero_phone' so ad platforms can optimise toward it from day one.
 *
 * The button is the interaction: an empty field shows a "Talk to PROXe" pill;
 * the first digit collapses it into a circle whose ring fills digit by digit
 * (full at 10 — a complete local number). A full ring lights the brand
 * gradient and breathes; the tap POSTs /api/callback, which has the ElevenLabs
 * "PROXe Website Callback" agent dial them from our SIP number. Then: Ringing…
 */
export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState('');
  // Placeholder set post-mount: detectMarket() reads navigator/Intl, which
  // don't exist during SSR — setting it in render would risk a hydration
  // mismatch between the server's fallback and the client's real market.
  const [placeholder, setPlaceholder] = useState('Your phone number');
  const startedRef = useRef(false);

  useEffect(() => {
    setPlaceholder(detectMarket() === 'inr' ? '+91 98765 43210' : '+1 555 000 1234');
  }, []);

  const digitCount = phone.replace(/\D/g, '').length;
  const progress = Math.min(digitCount / 10, 1);
  const ready = progress >= 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track('lead_form_start', { source: 'hero_phone' });
    }
    setPhone(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      setError('That number looks incomplete. Check and try again.');
      return;
    }
    setStatus('submitting');

    // 🎯 The conversion — GA4 `form_completed` + Meta `Lead`.
    trackLead({ source: 'hero_phone' });

    // Prefill the chat widget / deploy form if they engage again later.
    // storeUserProfile REPLACES the stored blob, so merge — a phone-only
    // capture must never wipe a name/email captured elsewhere.
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: trimmed, promptedPhone: true }, 'proxe');

    // Capture the lead AND start the dial in parallel — the ring must start
    // while they are still looking at the page. Neither blocks the other;
    // the lead sink alone failing must not stop the call, and vice versa.
    const [, dial] = await Promise.all([
      submitLead({ type: 'lead', phone: trimmed, source: 'hero_phone' }),
      fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmed, market: detectMarket() }),
      }).then((r) => r.ok).catch(() => false),
    ]);

    if (!dial) {
      // Lead is captured either way — promise a callback instead of a ring.
      setError('Number saved — PROXe will call you shortly.');
      setStatus('idle');
      return;
    }
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className="proxe-hero-phone-done" role="status">
        <span className="proxe-hero-phone-done-ring" aria-hidden="true" />
        Ringing… pick up.
      </div>
    );
  }

  const typing = phone.trim().length > 0;
  const btnClass =
    'proxe-hero-phone-btn' +
    (typing ? ' proxe-hero-phone-btn--call' : '') +
    (ready ? ' proxe-hero-phone-btn--ready' : '') +
    (status === 'submitting' ? ' proxe-hero-phone-btn--dialing' : '');

  return (
    <>
      <form className="proxe-hero-phone" onSubmit={handleSubmit} noValidate>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="proxe-hero-phone-input"
          placeholder={placeholder}
          value={phone}
          onChange={handleChange}
          aria-label="Phone number"
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          className={btnClass}
          disabled={status === 'submitting'}
          aria-label={typing ? 'Call me now' : 'Talk to PROXe'}
        >
          {typing ? (
            <>
              {/* Progress ring — fills digit by digit, full at 10. */}
              <svg className="proxe-hero-phone-btn-ringtrack" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
                <circle
                  className="proxe-hero-phone-btn-ringfill"
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  strokeDashoffset={100 - progress * 100}
                  transform="rotate(-90 26 26)"
                />
              </svg>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {/* The button used to drop its label the moment a number was
                  typed, collapsing to a bare circle exactly when it became the
                  thing to press. A ring that fills as you type is a nice touch
                  but it is not an affordance, and pressing it produced no words
                  either. The label now stays through every state and says what
                  will happen next. */}
              <span className="proxe-hero-phone-btn-label">
                {status === 'submitting' ? 'Calling…' : ready ? 'Call me now' : 'Keep typing'}
              </span>
            </>
          ) : (
            'Talk to PROXe'
          )}
        </button>
      </form>
      {error && <p className="proxe-hero-phone-error" role="alert">{error}</p>}
    </>
  );
}
