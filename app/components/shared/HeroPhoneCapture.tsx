'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero quick-capture: one phone field, one tap, then a short "who should PROXe
 * ask for?" step, then PROXe dials.
 *
 * Order matters (Z, 5 Sep): the call used to start the moment the number was
 * in and the name was asked while the phone rang. Now the number saves the
 * lead immediately, the visitor gets ONE screen for name + business, and the
 * dial fires on "Call me now", on Enter, on Skip, or on its own after 12
 * seconds. The fields never block the call; they only make it better.
 *
 * Same /api/lead sink as the deploy form (Supabase all_leads upserts by
 * phone), same funnel events (lead_form_start -> form_completed/Meta Lead),
 * source: 'hero_phone'. The dial POSTs /api/callback with name + business so
 * the ElevenLabs agent has them as dynamic variables.
 */
const DETAILS_SECONDS = 12;

type Status = 'idle' | 'details' | 'dialing' | 'done';

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [placeholder, setPlaceholder] = useState('Your phone number');
  const [callSettled, setCallSettled] = useState(false);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(DETAILS_SECONDS);
  const startedRef = useRef(false);
  const dialedRef = useRef(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

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
      track('callback_start', { market: detectMarket() });
    }
    setPhone(e.target.value);
    if (error) setError('');
  };

  // Step 1 -> step 2. The number is the conversion: lead saved, Meta Lead
  // fired. The dial waits for the details screen (or its countdown).
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 0) {
      const form = e.currentTarget as HTMLFormElement;
      form.querySelector<HTMLInputElement>('.proxe-hero-phone-input')?.focus();
      return;
    }
    if (digits.length < 8 || digits.length > 15) {
      setError('That number looks incomplete. Check and try again.');
      track('form_error', { form: 'hero_phone', field: 'phone', reason: 'length' });
      return;
    }
    const leadEventId = trackLead({ source: 'hero_phone' });
    track('callback_submit', { market: detectMarket() });
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: trimmed, promptedPhone: true }, 'proxe');
    void submitLead({ type: 'lead', phone: trimmed, source: 'hero_phone', eventId: leadEventId });
    track('hero_details_shown', { source: 'hero_phone' });
    setSecondsLeft(DETAILS_SECONDS);
    setStatus('details');
  };

  // Countdown: dial on its own when it runs out.
  useEffect(() => {
    if (status !== 'details') return;
    nameRef.current?.focus();
    const t = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { window.clearInterval(t); void dial('timeout'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const dial = async (how: 'submit' | 'skip' | 'timeout') => {
    if (dialedRef.current) return;
    dialedRef.current = true;
    const trimmed = phone.trim();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    const cleanBusiness = business.trim().replace(/\s+/g, ' ');
    track(how === 'skip' ? 'hero_details_skipped' : 'hero_details_submitted', { source: 'hero_phone', how, named: !!cleanName, business: !!cleanBusiness });
    if (cleanName || cleanBusiness) {
      storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: trimmed, ...(cleanName ? { name: cleanName } : {}), promptedPhone: true }, 'proxe');
    }
    setStatus('dialing');

    // Hard 20s ceiling on the dial: an abort is recoverable, a hang is not.
    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const [, dialRes] = await Promise.all([
      cleanName || cleanBusiness
        ? submitLead({ type: 'lead', phone: trimmed, name: cleanName || undefined, brandName: cleanBusiness || undefined, source: 'hero_phone' })
        : Promise.resolve(true),
      fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmed, market: detectMarket(), name: cleanName || undefined, business: cleanBusiness || undefined }),
        signal: ac.signal,
      })
        .then((r) => r.json().catch(() => ({ ok: false, reason: 'bad_response' })))
        .catch((err) => ({ ok: false, reason: err?.name === 'AbortError' ? 'timeout' : 'network_error' })),
    ]);
    window.clearTimeout(timeout);

    if (!dialRes?.ok) {
      const reason = dialRes?.reason ?? 'unknown';
      if (reason === 'recently_called' || reason === 'quiet_hours') track('callback_blocked', { reason });
      else track('callback_failed', { reason, market: detectMarket() });
      setError(
        reason === 'recently_called'
          ? 'We just called you. Check your phone, or try again in a minute.'
          : reason === 'quiet_hours'
            ? `Number saved. It is late here, so PROXe will call you at ${dialRes?.callAfter || '9:00 AM'}.`
            : 'Number saved. PROXe will call you shortly.'
      );
      dialedRef.current = false;
      setStatus('idle');
      return;
    }
    track('callback_dialed', { market: detectMarket() });
    setStatus('done');
    window.setTimeout(() => setCallSettled(true), 20000);
  };

  if (status === 'dialing') {
    return (
      <div className="proxe-hero-details proxe-hero-details--dialing" role="status" aria-live="polite">
        <span className="proxe-hero-phone-done-ring" aria-hidden="true" />
        <p className="proxe-hero-details-title">Connecting your call{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}.</p>
        <p className="proxe-hero-details-note">Your phone rings in a few seconds. It is PROXe.</p>
      </div>
    );
  }

  if (status === 'details') {
    return (
      <form
        className="proxe-hero-details"
        onSubmit={(e) => { e.preventDefault(); void dial('submit'); }}
        aria-label="Who should PROXe ask for"
      >
        <p className="proxe-hero-details-title">Who should PROXe ask for?</p>
        <div className="proxe-hero-details-fields">
          <label>
            <span>Your name</span>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            <span>Your business</span>
            <input
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              autoComplete="organization"
            />
          </label>
        </div>
        <div className="proxe-hero-details-actions">
          <button type="submit" className="proxe-hero-details-go">Call me now</button>
          <button type="button" className="proxe-hero-details-skip" onClick={() => void dial('skip')}>Skip</button>
        </div>
        <div className="proxe-hero-details-timer" aria-hidden="true">
          <span style={{ width: `${(secondsLeft / DETAILS_SECONDS) * 100}%` }} />
        </div>
        <p className="proxe-hero-details-note" role="status">PROXe calls in {secondsLeft}s either way.</p>
      </form>
    );
  }

  if (status === 'done') {
    return (
      <div className={'proxe-hero-phone-done' + (callSettled ? ' proxe-hero-phone-done--next' : '')} role="status">
        {!callSettled ? (
          <>
            <span className="proxe-hero-phone-done-ring" aria-hidden="true" />
            PROXe is calling you{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}.
          </>
        ) : (
          <a href="#voice" className="proxe-hero-phone-next">
            While you talk, see what else PROXe does
            <span aria-hidden="true"> →</span>
          </a>
        )}
      </div>
    );
  }

  const typing = phone.trim().length > 0;
  const btnClass =
    'proxe-hero-phone-btn' +
    (typing ? ' proxe-hero-phone-btn--call' : '') +
    (ready ? ' proxe-hero-phone-btn--ready' : '');

  return (
    <>
      <form
        className={'proxe-hero-phone' + (typing ? ' proxe-hero-phone--active' : '') + (ready ? ' proxe-hero-phone--ready' : '')}
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="proxe-hero-phone-input"
          placeholder={placeholder}
          value={phone}
          onChange={handleChange}
          aria-label="Phone number"
        />
        <button type="submit" className={btnClass} aria-label="Get a call back">
          {typing ? (
            <>
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
            </>
          ) : (
            'Get a call back'
          )}
        </button>
      </form>
      {error && <p className="proxe-hero-phone-error" role="alert">{error}</p>}
    </>
  );
}
