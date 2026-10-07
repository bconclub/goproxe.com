'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead, newEventId } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero call capture. Z, 7 Oct 2026: "Talk to PROXe can be the CTA. When they
 * click on it, it just asks for phone number and call. That's all."
 *
 *   1. "Talk to PROXe" button.
 *   2. Mobile number and the call button. Name, brand and business are asked
 *      on the call. The name, brand, mobile hero (5 to 6 Oct) took ad form
 *      leads from ~9 a day to 0 and left Meta with no Lead events for two days.
 *   3. The number is saved the moment it is valid, so anyone who leaves is
 *      still a lead in PROXe (core sends one WhatsApp). That save is partial:
 *      never a Meta conversion.
 *   4. Meta Lead fires once, when the call is asked for with a valid number.
 *   5. Calling, then ringing.
 */
type Step = 'cta' | 'phone' | 'calling' | 'ringing';

const RING_HINT_MS = 25000;

/** India: a 10-digit mobile starting 6-9, optionally written with +91, 91 or 0. */
function indianMobile(raw: string): string | null {
  let d = raw.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const PhoneIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<Step>('cta');
  const [error, setError] = useState('');
  const [settled, setSettled] = useState(false);
  const [market, setMarket] = useState<'inr' | 'usd'>('inr');
  const startedRef = useRef(false);
  const savedRef = useRef<{ phone: string; eventId: string } | null>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMarket(detectMarket() === 'usd' ? 'usd' : 'inr'); }, []);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track('lead_form_start', { source: 'hero_phone' });
      track('callback_start', { market });
    }
  };

  const validPhone = (raw: string): string | null => {
    if (market === 'inr') return indianMobile(raw);
    const d = raw.replace(/\D/g, '');
    return d.length >= 8 && d.length <= 15 ? raw.trim() : null;
  };

  /**
   * Save the number the moment it is valid, so a visitor who leaves is still a
   * lead in PROXe. Partial: no pixel here, and the server skips CAPI for it.
   */
  const saveNumber = (number: string) => {
    if (savedRef.current?.phone === number) return;
    const eventId = newEventId();
    savedRef.current = { phone: number, eventId };
    void submitLead({ type: 'lead', phone: number, source: 'hero_phone', eventId, partial: true });
  };

  const onPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    markStart();
    setPhone(e.target.value);
    if (error) setError('');
    const n = market === 'inr' ? indianMobile(e.target.value) : null;
    if (n) saveNumber(n);
  };

  const open = () => {
    markStart();
    track('cta_click', { location: 'hero_talk' });
    setStep('phone');
    window.setTimeout(() => phoneRef.current?.focus({ preventScroll: true }), 60);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Read the field itself: Android keyboards can leave text on screen that
    // React state never saw (Clarity, 6 Oct 2026).
    const typedPhone = phoneRef.current?.value ?? phone;
    if (typedPhone !== phone) setPhone(typedPhone);
    const number = validPhone(typedPhone.trim());
    if (!number) {
      setError(market === 'inr' ? 'Enter a 10-digit mobile number.' : 'That number looks incomplete. Check and try again.');
      track('form_error', { form: 'hero_phone', field: 'phone', reason: market === 'inr' ? 'invalid_in_mobile' : 'length' });
      phoneRef.current?.focus();
      return;
    }
    setError('');
    setStep('calling');
    track('callback_submit', { market });
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: number, promptedPhone: true }, 'proxe');
    // The one Meta Lead conversion for this visitor: a valid number that asked for the call.
    const leadEventId = trackLead({ source: 'hero_phone' });
    savedRef.current = { phone: number, eventId: leadEventId };
    void submitLead({ type: 'lead', phone: number, source: 'hero_phone', eventId: leadEventId });

    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const res = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number, market, source: 'hero_phone' }),
      signal: ac.signal,
    })
      .then((r) => r.json().catch(() => ({ ok: false, reason: 'bad_response' })))
      .catch((err) => ({ ok: false, reason: err?.name === 'AbortError' ? 'timeout' : 'network_error' }));
    window.clearTimeout(timeout);

    if (!res?.ok) {
      const reason = res?.reason ?? 'unknown';
      if (reason === 'recently_called') track('callback_blocked', { reason });
      else track('callback_failed', { reason, market });
      setError(
        reason === 'recently_called'
          ? 'PROXe already called this number today. Check your phone.'
          : reason === 'bad_phone'
            ? 'Enter a 10-digit mobile number.'
            : 'Could not place the call right now. Your number is saved and PROXe will reach you on WhatsApp.'
      );
      setStep('phone');
      return;
    }
    track('callback_dialed', { market });
    setStep('ringing');
    window.setTimeout(() => setSettled(true), RING_HINT_MS);
  };

  if (step === 'ringing') {
    return (
      <div className="hq-ringing" role="status" aria-live="polite">
        {!settled ? (
          <>
            <span className="hq-phone" aria-hidden="true"><PhoneIcon /></span>
            <span><strong>PROXe is calling you now.</strong> Pick up.</span>
          </>
        ) : (
          <a href="#voice" className="hq-next">While you talk, see what else PROXe does <span aria-hidden="true">→</span></a>
        )}
      </div>
    );
  }

  if (step === 'cta') {
    return (
      <div className="hq">
        <button type="button" className="hq-cta" onClick={open}>
          <span className="hq-cta-icon"><PhoneIcon /></span>
          Talk to PROXe
        </button>
      </div>
    );
  }

  const calling = step === 'calling';
  return (
    <div className="hq">
      <form className="hq-row hq-row--solo" onSubmit={submit} autoComplete="off" noValidate aria-label="Get a call from PROXe">
        <label className={'hq-field hq-field--phone' + (calling ? ' hq-field--calling' : '')}>
          {market === 'inr' && <span className="hq-cc" aria-hidden="true">+91</span>}
          <input ref={phoneRef} id="hero-phone" type="tel" inputMode="tel" autoComplete="tel" className="hq-input"
            placeholder={market === 'inr' ? 'Mobile number' : 'Phone number'} value={phone} onChange={onPhone}
            readOnly={calling} aria-label="Your mobile number" aria-invalid={!!error} />
        </label>
        <button type="submit" className="hq-go" disabled={calling} aria-busy={calling} aria-label={calling ? 'Calling' : 'Call me now'}>
          {calling ? <span className="hq-spin" aria-hidden="true" /> : <PhoneIcon size={20} />}
        </button>
      </form>
      {calling && <p className="hq-dialing" role="status" aria-live="polite">Connecting your call. PROXe will ring you in a few seconds.</p>}
      {error && <p className="hq-error" role="alert">{error}</p>}
    </div>
  );
}
