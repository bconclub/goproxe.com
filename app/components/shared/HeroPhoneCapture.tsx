'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead, newEventId } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero call capture. Z, 5 Oct 2026: "If they enter their name and details,
 * they should get a call. Otherwise, they'll not get a call. If we have a phone
 * number and the call is not happening, we send a utility WhatsApp."
 *
 *   1. Mobile + "Call me now". The number is saved the moment it is valid, so
 *      anyone who leaves is still a lead (core then sends one WhatsApp).
 *   2. Name slides in; the call goes out with it (Z, 5 Oct 2026: name, brand
 *      and type upfront was too much). The agent asks the business on the call.
 *   3. Ringing.
 */
type Step = 'phone' | 'details' | 'calling' | 'ringing';

const RING_HINT_MS = 25000;

/** India: a 10-digit mobile starting 6-9, optionally written with +91, 91 or 0. */
function indianMobile(raw: string): string | null {
  let d = raw.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const ArrowIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<Step>('phone');
  const [error, setError] = useState('');
  const [settled, setSettled] = useState(false);
  const [market, setMarket] = useState<'inr' | 'usd'>('inr');
  const startedRef = useRef(false);
  const savedRef = useRef<{ phone: string; eventId: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

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
   * lead in PROXe. NOT a Meta conversion: no pixel here, and the server skips
   * CAPI for a nameless hero save. Lead fires once, on the details step.
   */
  const saveNumber = (number: string) => {
    if (savedRef.current?.phone === number) return;
    const eventId = newEventId();
    savedRef.current = { phone: number, eventId };
    void submitLead({ type: 'lead', phone: number, source: 'hero_phone', eventId });
  };

  const onPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    markStart();
    setPhone(e.target.value);
    if (error) setError('');
    const n = market === 'inr' ? indianMobile(e.target.value) : null;
    if (n) saveNumber(n);
  };

  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const number = validPhone(phone.trim());
    if (!number) {
      setError(market === 'inr' ? 'Enter a 10-digit mobile number.' : 'That number looks incomplete. Check and try again.');
      track('form_error', { form: 'hero_phone', field: 'phone', reason: market === 'inr' ? 'invalid_in_mobile' : 'length' });
      return;
    }
    saveNumber(number);
    setError('');
    setStep('details');
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 60);
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const number = savedRef.current?.phone || validPhone(phone.trim());
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (!number) { setStep('phone'); return; }
    if (!cleanName) {
      setError('Add your name so PROXe knows who it is calling.');
      track('form_error', { form: 'hero_phone', field: 'name', reason: 'missing' });
      return;
    }
    setError('');
    setStep('calling');
    track('callback_submit', { market });
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: number, promptedPhone: true, name: cleanName }, 'proxe');
    // The one Meta Lead conversion for this visitor: a named person who asked for the call.
    const leadEventId = trackLead({ source: 'hero_phone', hasBrand: true });
    savedRef.current = { phone: number, eventId: leadEventId };
    // Fills name and brand on the same lead (upsert by phone) while the call is placed.
    void submitLead({ type: 'lead', phone: number, name: cleanName, source: 'hero_phone', eventId: leadEventId });

    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const res = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number, name: cleanName, market, source: 'hero_phone' }),
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
      setStep('details');
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
            <span className="hq-phone" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </span>
            <span><strong>PROXe is calling {name.trim().split(' ')[0] || 'you'} now.</strong> Pick up.</span>
          </>
        ) : (
          <a href="#voice" className="hq-next">While you talk, see what else PROXe does <span aria-hidden="true">→</span></a>
        )}
      </div>
    );
  }

  if (step === 'details' || step === 'calling') {
    const calling = step === 'calling';
    const shown = (savedRef.current?.phone || phone).replace(/\D/g, '').slice(-10);
    return (
      <div className="hq">
        <form className="hq-row hq-row--name" onSubmit={submitDetails} autoComplete="off" noValidate aria-label="Your name">
          <label className={'hq-field hq-field--name' + (calling ? ' hq-field--calling' : '')}>
            <input ref={nameRef} className="hq-input" placeholder="Your name" autoComplete="given-name" value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(''); }} readOnly={calling} maxLength={60} aria-label="Your name" />
          </label>
          <button type="submit" className="hq-go" disabled={calling} aria-busy={calling} aria-label={calling ? 'Calling' : 'Call me now'}>
            {calling ? <span className="hq-spin" aria-hidden="true" /> : <ArrowIcon />}
          </button>
        </form>
        {error
          ? <p className="hq-error" role="alert">{error}</p>
          : <p className="hq-hint">{calling ? 'Connecting. Your phone rings in a few seconds.' : <>PROXe AI calls {market === 'inr' ? '+91 ' : ''}{shown} in 5 seconds. <button type="button" className="hq-change" onClick={() => { setStep('phone'); setError(''); }}>Change</button></>}</p>}
      </div>
    );
  }

  return (
    <div className="hq">
      <form className="hq-row" onSubmit={submitPhone} autoComplete="off" noValidate aria-label="Get a call from PROXe">
        <label className="hq-field hq-field--phone">
          {market === 'inr' && <span className="hq-cc" aria-hidden="true">+91</span>}
          <input id="hero-phone" type="tel" inputMode="tel" autoComplete="tel" className="hq-input"
            placeholder={market === 'inr' ? 'Mobile number' : 'Phone number'} value={phone} onChange={onPhone}
            aria-label="Your mobile number" aria-invalid={!!error} />
        </label>
        <button type="submit" className="hq-go hq-go--label" aria-label="Call me now">Call me now</button>
      </form>
      {error
        ? <p className="hq-error" role="alert">{error}</p>
        : <p className="hq-hint">PROXe AI calls you in 5 seconds. Free, no signup. We follow up on WhatsApp.</p>}
    </div>
  );
}
