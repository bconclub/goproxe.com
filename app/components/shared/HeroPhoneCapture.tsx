'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/** Phone first, then required identity details. Only explicit submission saves and dials. */
type Status = 'idle' | 'details' | 'dialing' | 'done';

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [placeholder, setPlaceholder] = useState('Your phone number');
  const [callSettled, setCallSettled] = useState(false);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
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

  // Collect phone without saving an incomplete lead or starting a call.
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
    setError('');
    track('hero_details_shown', { source: 'hero_phone' });
    setStatus('details');
  };

  useEffect(() => {
    if (status === 'details') nameRef.current?.focus();
  }, [status]);

  const dial = async () => {
    if (dialedRef.current) return;
    const trimmed = phone.trim();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    const cleanBusiness = business.trim().replace(/\s+/g, ' ');
    if (!cleanName || !cleanBusiness) {
      setError('Enter your name and business before requesting a call.');
      return;
    }
    dialedRef.current = true;
    setError('');
    track('hero_details_submitted', { source: 'hero_phone', how: 'submit', named: true, business: true });
    const leadEventId = trackLead({ source: 'hero_phone' });
    track('callback_submit', { market: detectMarket() });
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: trimmed, name: cleanName, promptedPhone: true }, 'proxe');
    setStatus('dialing');
    const saveController = new AbortController();
    const saveTimeout = window.setTimeout(() => saveController.abort(), 20000);
    const saved = await submitLead({ type: 'lead', phone: trimmed, name: cleanName, brandName: cleanBusiness, source: 'hero_phone', eventId: leadEventId }, saveController.signal);
    window.clearTimeout(saveTimeout);
    if (!saved) {
      setError("We couldn't save your details. Please try again. No call was started.");
      dialedRef.current = false;
      setStatus('details');
      return;
    }

    // Hard 20s ceiling on the dial: an abort is recoverable, a hang is not.
    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const dialRes = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmed, market: detectMarket(), name: cleanName || undefined, business: cleanBusiness, source: 'hero_phone' }),
        signal: ac.signal,
      })
        .then((r) => r.json().catch(() => ({ ok: false, reason: 'bad_response' })))
        .catch((err) => ({ ok: false, reason: err?.name === 'AbortError' ? 'timeout' : 'network_error' }));
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
            : 'We could not confirm your call. Your details are saved. Please try again shortly.'
      );
      dialedRef.current = false;
      setStatus('details');
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
        onSubmit={(e) => { e.preventDefault(); void dial(); }}
        aria-label="Your callback details"
      >
        <div className="proxe-hero-details-fields">
          <label>
            <span>Name</span>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
              autoComplete="name"
            />
          </label>
          <label>
            <span>Business</span>
            <input
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              required
              maxLength={80}
              autoComplete="organization"
            />
          </label>
        </div>
        <div className="proxe-hero-details-actions">
          <button type="submit" className="proxe-hero-details-go">Call me now</button>
          <button type="button" className="proxe-hero-details-skip" onClick={() => { setError(''); setStatus('idle'); }}>Back</button>
        </div>
        <p className="proxe-hero-details-note">Submit to get a call back.</p>
        {error && <p className="proxe-hero-phone-error" role="alert">{error}</p>}
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
    ' proxe-hero-phone-btn--labelled' +
    (ready ? ' proxe-hero-phone-btn--ready' : '');

  return (
    <>
      <form
        className={'proxe-hero-phone' + (typing ? ' proxe-hero-phone--active' : '') + (ready ? ' proxe-hero-phone--ready' : '')}
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <input
          type="tel"
          inputMode="tel"
          autoComplete="off"
          className="proxe-hero-phone-input"
          placeholder={placeholder}
          value={phone}
          onChange={handleChange}
          aria-label="Phone number"
        />
        <button type="submit" className={btnClass} aria-label="Talk to PROXe now">
          {/* Keep the action readable while entering the number. */}
          Talk to PROXe now
        </button>
      </form>
      {error && <p className="proxe-hero-phone-error" role="alert">{error}</p>}
    </>
  );
}
