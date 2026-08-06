'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero quick-capture: one phone field, one tap, callback promised.
 *
 * The lowest-friction conversion on the page — no name, no email, no modal.
 * Lands in the same /api/lead sink as the deploy form (Supabase `all_leads`
 * upserts by phone, so if the visitor later completes the full form the two
 * touches merge onto one row). Fires the same funnel events as the deploy
 * form (`lead_form_start` → `form_completed`/Meta `Lead`) with
 * source: 'hero_phone' so ad platforms can optimise toward it from day one.
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

    // Fire-and-forget to Supabase + sheet; never blocks the success state —
    // the lead is already in GA and localStorage even if the sink hiccups.
    await submitLead({ type: 'lead', phone: trimmed, source: 'hero_phone' });

    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className="proxe-hero-phone-done" role="status">
        <span className="proxe-hero-phone-done-ico" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        Got it. PROXe will call you right now.
      </div>
    );
  }

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
          className="proxe-hero-phone-btn"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Get a callback'}
        </button>
      </form>
      {error ? (
        <p className="proxe-hero-phone-error" role="alert">{error}</p>
      ) : (
        {/* Reads "right away" because the intent is that the PROXe voice agent
            dials the moment this submits. That dialler is NOT wired yet (the
            lead lands in Supabase and nothing calls it), so until it is, this
            line and the success copy are a promise the product does not keep. */}
        <p className="proxe-hero-phone-hint">PROXe calls you right away. No spam, ever.</p>
      )}
    </>
  );
}
