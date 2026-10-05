'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead, newEventId } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';
import { BUSINESS_TYPES, JOB_SEEKER_MESSAGE, type BusinessType } from '../../lib/businessTypes';

/**
 * Hero call capture. Z, 5 Oct 2026: "If they enter their name and details,
 * they should get a call. Otherwise, they'll not get a call. If we have a phone
 * number and the call is not happening, we send a utility WhatsApp."
 *
 *   1. One button: "Talk to PROXe", with a phone (Z, 5 Oct 2026: the CTA is
 *      the main thing; tapping it opens name and number together, inline).
 *   2. Name, brand and mobile, one call button (5 Oct 2026: everything the
 *      agent needs is collected before the call; nothing can be added once
 *      it is running). The number is saved the
 *      moment it is valid, so anyone who leaves is still a lead (core then
 *      sends one WhatsApp).
 *   3. One tap: what business? (Z's ads thread, 5 Oct 2026: Meta optimises on
 *      Lead, so only a real business is reported as one.) A business type
 *      places the call and fires Lead; "Looking for a job" is saved closed,
 *      gets a polite note, no call, no Lead.
 *   4. Ringing.
 */
type Step = 'cta' | 'form' | 'type' | 'calling' | 'ringing' | 'closed';

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

const ArrowIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  // Z, 5 Oct 2026 (after seeing the ads data): "Talk to PROXe" first, then name,
  // brand and mobile. Watch hero leads from ad traffic; the open form was the fix
  // when this button preceded a day of zero leads.
  const [step, setStep] = useState<Step>('cta');
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

  const open = () => {
    markStart();
    track('cta_click', { location: 'hero_talk' });
    setStep('form');
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 60);
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const number = validPhone(phone.trim());
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (!cleanName) {
      setError('Add your name so PROXe knows who it is calling.');
      track('form_error', { form: 'hero_phone', field: 'name', reason: 'missing' });
      nameRef.current?.focus();
      return;
    }
    if (!brand.trim()) {
      setError('Add your brand name so PROXe knows what to talk about.');
      track('form_error', { form: 'hero_phone', field: 'brand', reason: 'missing' });
      return;
    }
    if (!number) {
      setError(market === 'inr' ? 'Enter a 10-digit mobile number.' : 'That number looks incomplete. Check and try again.');
      track('form_error', { form: 'hero_phone', field: 'phone', reason: market === 'inr' ? 'invalid_in_mobile' : 'length' });
      return;
    }
    saveNumber(number);
    setError('');
    setStep('type');
  };

  const pickType = async (type: BusinessType) => {
    const number = savedRef.current?.phone || validPhone(phone.trim());
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (!number || !cleanName) { setStep('form'); return; }
    track('button_click', { label: `hero_business_${type}`, location: 'hero' });
    if (type === 'job_seeker') {
      // Saved, closed, never called, never a Lead.
      void submitLead({ type: 'lead', phone: number, name: cleanName, brandName: brand.trim(), businessType: 'job_seeker', source: 'hero_phone' });
      setStep('closed');
      return;
    }
    setStep('calling');
    track('callback_submit', { market });
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: number, promptedPhone: true, name: cleanName }, 'proxe');
    // The one Meta Lead conversion for this visitor: a named person who asked for the call.
    const leadEventId = trackLead({ source: 'hero_phone', hasBrand: true });
    savedRef.current = { phone: number, eventId: leadEventId };
    // Fills name and brand on the same lead (upsert by phone) while the call is placed.
    void submitLead({ type: 'lead', phone: number, name: cleanName, brandName: brand.trim(), businessType: type, source: 'hero_phone', eventId: leadEventId });

    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const res = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number, name: cleanName, business: brand.trim(), businessType: type, market, source: 'hero_phone' }),
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
      setStep('form');
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

  if (step === 'closed') {
    return <div className="hq"><p className="hq-note" role="status">{JOB_SEEKER_MESSAGE}</p></div>;
  }

  if (step === 'type') {
    return (
      <div className="hq">
        <p className="hq-ask">What&apos;s your business?</p>
        <div className="hq-types" role="group" aria-label="Your business type">
          {BUSINESS_TYPES.map((b) => (
            <button key={b.value} type="button" className={'hq-type' + (b.value === 'job_seeker' ? ' hq-type--job' : '')} onClick={() => void pickType(b.value)}>
              {b.label}
            </button>
          ))}
        </div>
        {error && <p className="hq-error" role="alert">{error}</p>}
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
      <form className="hq-row hq-row--both" onSubmit={submitDetails} autoComplete="off" noValidate aria-label="Get a call from PROXe">
        <label className={'hq-field hq-field--name' + (calling ? ' hq-field--calling' : '')}>
          <input ref={nameRef} className="hq-input" placeholder="Your name" autoComplete="given-name" value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(''); }} readOnly={calling} maxLength={60} aria-label="Your name" />
        </label>
        <label className={'hq-field hq-field--brand' + (calling ? ' hq-field--calling' : '')}>
          <input className="hq-input" placeholder="Enter your brand name" autoComplete="organization" value={brand}
            onChange={(e) => { setBrand(e.target.value); if (error) setError(''); }} readOnly={calling} maxLength={80} aria-label="Your brand or business name" />
        </label>
        <label className={'hq-field hq-field--phone' + (calling ? ' hq-field--calling' : '')}>
          {market === 'inr' && <span className="hq-cc" aria-hidden="true">+91</span>}
          <input id="hero-phone" type="tel" inputMode="tel" autoComplete="tel" className="hq-input"
            placeholder={market === 'inr' ? 'Mobile number' : 'Phone number'} value={phone} onChange={onPhone}
            readOnly={calling} aria-label="Your mobile number" aria-invalid={!!error} />
        </label>
        <button type="submit" className="hq-go" disabled={calling} aria-busy={calling} aria-label={calling ? 'Calling' : 'Call me now'}>
          {calling ? <span className="hq-spin" aria-hidden="true" /> : <PhoneIcon size={20} />}
        </button>
      </form>
      {error && <p className="hq-error" role="alert">{error}</p>}
    </div>
  );
}
