'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { track, newEventId } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero call capture. Z, 14 Oct 2026: no more number-only calls. "Call me
 * back" opens a quick pop-up: name and mobile required, brand optional. Only
 * then is the lead saved and the call placed, so PROXe greets them by name
 * (and brand, when given) instead of asking who it is talking to.
 *
 *   1. Mobile field + "Call me back" in the hero. Nothing is saved from it.
 *   2. The pop-up (prefilled with the number) asks name, mobile, brand.
 *   3. Submit saves the lead with all of it and dials.
 *   4. Calling, then ringing.
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

const PhoneIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [mounted, setMounted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const popPhoneRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('phone');
  const [error, setError] = useState('');
  const [settled, setSettled] = useState(false);
  const [market, setMarket] = useState<'inr' | 'usd'>('inr');
  const startedRef = useRef(false);
  const savedRef = useRef<{ phone: string; eventId: string } | null>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMarket(detectMarket() === 'usd' ? 'usd' : 'inr');
    setMounted(true);
    const u: any = getStoredUser('proxe');
    if (u?.name) setName(u.name);
    if (u?.brand) setBrand(u.brand);
  }, []);

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

  const onPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    markStart();
    setPhone(e.target.value);
    if (error) setError('');
  };

  /** "Call me back" in the hero: open the pop-up, whatever is in the field. */
  const openDetails = (e: React.FormEvent) => {
    e.preventDefault();
    markStart();
    // Read the field itself: Android keyboards can leave text on screen that
    // React state never saw (Clarity, 6 Oct 2026).
    const typed = phoneRef.current?.value ?? phone;
    if (typed !== phone) setPhone(typed);
    setError('');
    setStep('details');
    track('hero_details_shown', { market });
  };

  // Pop-up: focus the first empty field, Escape closes it.
  useEffect(() => {
    if (step !== 'details') return;
    const first = !name.trim() ? nameRef : !validPhone(phone) ? popPhoneRef : brandRef;
    const t = window.setTimeout(() => first.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setStep('phone'); };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const typedName = (nameRef.current?.value ?? name).replace(/\s+/g, ' ').trim();
    const typedPhone = (popPhoneRef.current?.value ?? phone).trim();
    const typedBrand = (brandRef.current?.value ?? brand).replace(/\s+/g, ' ').trim();
    setName(typedName); setPhone(typedPhone); setBrand(typedBrand);
    if (!typedName) {
      setError('Your name, so PROXe knows who it is calling.');
      track('form_error', { form: 'hero_phone', field: 'name', reason: 'empty' });
      nameRef.current?.focus();
      return;
    }
    const number = validPhone(typedPhone);
    if (!number) {
      setError(market === 'inr' ? 'Enter a 10-digit mobile number.' : 'That number looks incomplete. Check and try again.');
      track('form_error', { form: 'hero_phone', field: 'phone', reason: market === 'inr' ? 'invalid_in_mobile' : 'length' });
      popPhoneRef.current?.focus();
      return;
    }
    setError('');
    setStep('calling');
    track('callback_submit', { market });
    track('hero_details_submitted', { market, brand: typedBrand ? 'yes' : 'no' });
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), name: typedName, phone: number, ...(typedBrand ? { brand: typedBrand } : {}), promptedPhone: true } as any, 'proxe');
    const leadEventId = newEventId();
    savedRef.current = { phone: number, eventId: leadEventId };
    void submitLead({ type: 'lead', name: typedName, phone: number, ...(typedBrand ? { brandName: typedBrand } : {}), source: 'hero_phone', eventId: leadEventId });

    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const res = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number, name: typedName, business: typedBrand || undefined, market, source: 'hero_phone' }),
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

  const calling = step === 'calling';
  const host = mounted ? ((document.querySelector('.proxe-root') as HTMLElement | null) ?? document.body) : null;
  const popup = (step === 'details' || calling) && host ? createPortal(
    <div className="wag-backdrop" role="dialog" aria-modal="true" aria-label="Get a call from PROXe" onClick={() => { if (!calling) setStep('phone'); }}>
      <form className="wag-card" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <div className="wag-head">
          <h3 className="wag-title">PROXe will call you</h3>
          <button type="button" className="wag-x" onClick={() => setStep('phone')} aria-label="Close" disabled={calling}>×</button>
        </div>
        <label className="wag-label" htmlFor="hq-name">Your name</label>
        <input id="hq-name" ref={nameRef} className="wag-input" value={name} readOnly={calling}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="Your name" autoComplete="name" maxLength={60} />
        <label className="wag-label" htmlFor="hq-phone">Mobile number</label>
        <div className="wag-phone">
          {market === 'inr' && <span className="wag-cc" aria-hidden="true">+91</span>}
          <input id="hq-phone" ref={popPhoneRef} type="tel" inputMode="tel" className="wag-input" value={phone} readOnly={calling}
            onChange={(e) => { setPhone(e.target.value); setError(''); }}
            placeholder={market === 'inr' ? 'Mobile no.' : 'Phone no.'} autoComplete="tel" />
        </div>
        <label className="wag-label" htmlFor="hq-brand">Brand <span className="wag-opt">optional</span></label>
        <input id="hq-brand" ref={brandRef} className="wag-input" value={brand} readOnly={calling}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Your business or brand" autoComplete="organization" maxLength={80} />
        {error && <p className="wag-err" role="alert">{error}</p>}
        <button type="submit" className="wag-go" disabled={calling} aria-busy={calling}>
          {calling ? <><span className="hq-spin" aria-hidden="true" /> Calling</> : <><PhoneIcon size={18} /> Call me now</>}
        </button>
        {calling && <p className="hq-dialing" role="status" aria-live="polite">Connecting your call. PROXe will ring you in a few seconds.</p>}
      </form>
    </div>,
    host,
  ) : null;

  return (
    <div className="hq">
      {popup}
      <form className="hq-row hq-row--callback" onSubmit={openDetails} autoComplete="off" noValidate aria-label="Get a call from PROXe">
        <label className={'hq-field hq-field--phone' + (calling ? ' hq-field--calling' : '')}>
          {market === 'inr' && <span className="hq-cc" aria-hidden="true">+91</span>}
          <input ref={phoneRef} id="hero-phone" type="tel" inputMode="tel" autoComplete="tel" className="hq-input"
            placeholder={market === 'inr' ? 'Mobile no.' : 'Phone no.'} value={phone} onChange={onPhone}
            readOnly={calling} aria-label="Your mobile number" aria-invalid={!!error} />
        </label>
        <button type="submit" className="hq-go" disabled={calling} aria-busy={calling}>
          {calling ? <><span className="hq-spin" aria-hidden="true" /> Calling</> : <><PhoneIcon size={18} /> Call me back</>}
        </button>
      </form>
      {error && step === 'phone' && <p className="hq-error" role="alert">{error}</p>}
    </div>
  );
}
