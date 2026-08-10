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
 * The button is the interaction: an empty field shows a "Get a call back" pill;
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
  /** Flips ~20s after the dial: long enough that the phone has rung and been
      answered, after which "PROXe is calling you" is stale and the space is
      better spent pointing somewhere. */
  const [callSettled, setCallSettled] = useState(false);
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
      track('callback_start', { market: detectMarket() });
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
      track('form_error', { form: 'hero_phone', field: 'phone', reason: 'length' });
      return;
    }
    // Measure how far the call button has to travel to reach the far end of the
    // pill, and hand it to CSS. It cannot be expressed in the stylesheet: the
    // distance is the pill's width minus the button's, and `translateX(-100%)`
    // resolves against the BUTTON, which is only 46px wide.
    const form = e.currentTarget as HTMLFormElement;
    const btn = form.querySelector<HTMLElement>('.proxe-hero-phone-btn');
    if (btn) form.style.setProperty('--pill-slide', `${-(btn.offsetLeft - 4)}px`);

    setStatus('submitting');

    // 🎯 The conversion — GA4 `form_completed` + Meta `Lead`.
    // Same id to both paths so Meta merges pixel + CAPI into one Lead.
    const leadEventId = trackLead({ source: 'hero_phone' });
    track('callback_submit', { market: detectMarket() });

    // Prefill the chat widget / deploy form if they engage again later.
    // storeUserProfile REPLACES the stored blob, so merge — a phone-only
    // capture must never wipe a name/email captured elsewhere.
    storeUserProfile({ ...(getStoredUser('proxe') ?? {}), phone: trimmed, promptedPhone: true }, 'proxe');

    // Capture the lead AND start the dial in parallel — the ring must start
    // while they are still looking at the page. Neither blocks the other;
    // the lead sink alone failing must not stop the call, and vice versa.
    // Read the BODY, not just the HTTP status. The route answers 200 for
    // several outcomes that are not "a phone is ringing" - most importantly the
    // cooldown guard - so trusting r.ok alone showed "Ringing… pick up" when
    // nothing had been dialled.
    // Hard 20s ceiling on the dial. Without it a request that never settles
    // leaves the control stuck mid-gesture forever: the button parked at the
    // end of its travel, the field disabled, and nothing to tell the person
    // whether their phone is about to ring. An abort is recoverable; a hang is
    // not.
    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 20000);

    const [, dial] = await Promise.all([
      submitLead({ type: 'lead', phone: trimmed, source: 'hero_phone', eventId: leadEventId }),
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
    ]);
    window.clearTimeout(timeout);

    if (!dial?.ok) {
      // The outcome, measured. `recently_called` is the cooldown guard doing
      // its job, not a failure — it gets its own event so the two never blur
      // together in a funnel.
      const reason = dial?.reason ?? 'unknown';
      if (reason === 'recently_called') {
        track('callback_blocked', { reason });
      } else {
        track('callback_failed', { reason, market: detectMarket() });
      }
      setError(
        dial?.reason === 'recently_called'
          ? 'We just called you. Check your phone, or try again in a minute.'
          : 'Number saved. PROXe will call you shortly.'
      );
      // Back to idle also resets the slide: the --dialing class goes, so the
      // button returns to its place rather than staying where it stopped.
      setStatus('idle');
      return;
    }
    track('callback_dialed', { market: detectMarket() });
    setStatus('done');
    window.setTimeout(() => setCallSettled(true), 20000);
  };

  if (status === 'done') {
    // States what we did, not what their phone is about to do. "Ringing… pick
    // up." narrates and instructs, and it is a claim we cannot actually verify
    // - we know the dial was accepted, not that anything rang. After a beat the
    // panel steps aside for a next action, because by then they are on the
    // call and the capture field has nothing left to say.
    return (
      <div
        className={'proxe-hero-phone-done' + (callSettled ? ' proxe-hero-phone-done--next' : '')}
        role="status"
      >
        {!callSettled ? (
          <>
            <span className="proxe-hero-phone-done-ring" aria-hidden="true" />
            PROXe is calling you.
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
    (ready ? ' proxe-hero-phone-btn--ready' : '') +
    (status === 'submitting' ? ' proxe-hero-phone-btn--dialing' : '');

  return (
    <>
      {/* State drives the whole pill, not just the button: the ring wakes up as
          soon as a digit lands, brightens when the number is complete, and the
          fill sweeps across on submit. One control that responds, rather than a
          field sitting next to a button. */}
      <form
        className={
          'proxe-hero-phone' +
          (typing ? ' proxe-hero-phone--active' : '') +
          (ready ? ' proxe-hero-phone--ready' : '') +
          (status === 'submitting' ? ' proxe-hero-phone--dialing' : '')
        }
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
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          className={btnClass}
          disabled={status === 'submitting'}
          aria-label={typing ? 'Call me now' : 'Get a call back'}
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
            </>
          ) : (
            'Get a call back'
          )}
        </button>
      </form>
      {status === 'submitting' && (
        // The slide finishes in 0.7s but the dial can take several seconds.
        // Without this the pill just sits there, emptied, saying nothing.
        <p className="proxe-hero-phone-connecting" role="status">Connecting your call…</p>
      )}
      {error && <p className="proxe-hero-phone-error" role="alert">{error}</p>}
    </>
  );
}
