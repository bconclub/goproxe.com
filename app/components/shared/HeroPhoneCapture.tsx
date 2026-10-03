'use client';

import { useEffect, useRef, useState } from 'react';
import { track, trackLead } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { getStoredUser, storeUserProfile } from '../../lib/chatLocalStorage';
import { detectMarket } from '../../lib/market';

/**
 * Hero call capture: one field, one button, the phone rings.
 *
 * Z, 3 Oct 2026 (heavy ads starting): "PROXe AI calls in 5 seconds... really
 * intuitive rather than boxes coming in... take the details and get out."
 * The 15 Sep version asked for name and business in a second card before it
 * saved anything, so anyone who left at that card was lost with no lead and no
 * call. Now the number is the whole ask: the lead is saved and the call is
 * placed the moment it is submitted, both in parallel. The agent asks their
 * name on the call (it does that whenever first_name is "there").
 */
type Status = 'idle' | 'calling' | 'ringing';

const RING_HINT_MS = 25000;

/** India: a 10-digit mobile starting 6-9, optionally written with +91, 91 or 0. */
function indianMobile(raw: string): string | null {
  let d = raw.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export default function HeroPhoneCapture() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [settled, setSettled] = useState(false);
  const [market, setMarket] = useState<'inr' | 'usd'>('inr');
  const startedRef = useRef(false);
  const busyRef = useRef(false);

  useEffect(() => { setMarket(detectMarket() === 'usd' ? 'usd' : 'inr'); }, []);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track('lead_form_start', { source: 'hero_phone' });
      track('callback_start', { market });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markStart();
    setPhone(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busyRef.current) return;
    const raw = phone.trim();
    if (!raw) {
      (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('#hero-phone')?.focus();
      return;
    }
    let number: string | null;
    if (market === 'inr') {
      number = indianMobile(raw);
      if (!number) {
        setError('Enter a 10-digit mobile number.');
        track('form_error', { form: 'hero_phone', field: 'phone', reason: 'invalid_in_mobile' });
        return;
      }
    } else {
      const d = raw.replace(/\D/g, '');
      number = d.length >= 8 && d.length <= 15 ? raw : null;
      if (!number) {
        setError('That number looks incomplete. Check and try again.');
        track('form_error', { form: 'hero_phone', field: 'phone', reason: 'length' });
        return;
      }
    }

    busyRef.current = true;
    setError('');
    setStatus('calling');
    const leadEventId = trackLead({ source: 'hero_phone' });
    track('callback_submit', { market });
    const cleanName = name.trim().replace(/\s+/g, ' ');
    const cleanBusiness = business.trim().replace(/\s+/g, ' ');
    storeUserProfile({
      ...(getStoredUser('proxe') ?? {}),
      phone: number,
      promptedPhone: true,
      ...(cleanName ? { name: cleanName } : {}),
    }, 'proxe');

    // Save and dial at the same time: the ring is the product, never wait on
    // the save. A failed save is retried by the lead route's own sinks.
    void submitLead({
      type: 'lead',
      phone: number,
      ...(cleanName ? { name: cleanName } : {}),
      ...(cleanBusiness ? { brandName: cleanBusiness } : {}),
      source: 'hero_phone',
      eventId: leadEventId,
    });

    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);
    const res = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number, name: cleanName, business: cleanBusiness, market, source: 'hero_phone' }),
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
            : 'Could not place the call right now. Your number is saved and PROXe will reach you shortly.'
      );
      busyRef.current = false;
      setStatus('idle');
      return;
    }
    track('callback_dialed', { market });
    setStatus('ringing');
    window.setTimeout(() => setSettled(true), RING_HINT_MS);
  };

  if (status === 'ringing') {
    return (
      <div className="hq-ringing" role="status" aria-live="polite">
        {!settled ? (
          <>
            <span className="hq-phone" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </span>
            <span><strong>PROXe is calling you now.</strong> Pick up.</span>
          </>
        ) : (
          <a href="#voice" className="hq-next">While you talk, see what else PROXe does <span aria-hidden="true">→</span></a>
        )}
      </div>
    );
  }

  const calling = status === 'calling';
  return (
    <div className="hq">
      <form className="hq-row" onSubmit={handleSubmit} autoComplete="off" noValidate aria-label="Get a call from PROXe">
        <label className={'hq-field hq-field--name' + (calling ? ' hq-field--calling' : '')}>
          <input
            className="hq-input"
            placeholder="Your name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => { markStart(); setName(e.target.value); }}
            readOnly={calling}
            maxLength={60}
            aria-label="Your name"
          />
        </label>
        <label className={'hq-field hq-field--biz' + (calling ? ' hq-field--calling' : '')}>
          <input
            className="hq-input"
            placeholder="Business"
            autoComplete="organization"
            value={business}
            onChange={(e) => { markStart(); setBusiness(e.target.value); }}
            readOnly={calling}
            maxLength={80}
            aria-label="Your business"
          />
        </label>
        <label className={'hq-field hq-field--phone' + (calling ? ' hq-field--calling' : '')}>
          {market === 'inr' && <span className="hq-cc" aria-hidden="true">+91</span>}
          <input
            id="hero-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="hq-input"
            placeholder={market === 'inr' ? 'Mobile number' : 'Phone number'}
            value={phone}
            onChange={handleChange}
            readOnly={calling}
            aria-label="Your mobile number"
            aria-invalid={!!error}
          />
        </label>
        <button type="submit" className="hq-go" disabled={calling} aria-busy={calling} aria-label={calling ? 'Calling' : 'Call me now'}>
          {calling
            ? <span className="hq-spin" aria-hidden="true" />
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
        </button>
      </form>
      {error
        ? <p className="hq-error" role="alert">{error}</p>
        : <p className="hq-hint">{calling ? 'Connecting. Your phone rings in a few seconds.' : "PROXe's AI calls you in 5 seconds. Free, no signup."}</p>}
    </div>
  );
}
