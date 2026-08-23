'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DeployModal.module.css';
import { storeUserProfile, getStoredUser, storeBooking } from '../../lib/chatLocalStorage';
import { track, trackLead, trackCheckoutStart, newEventId } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import { detectMarket } from '../../lib/market';
import BookingCalendar, { type BookingSlot } from './BookingCalendar';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit?: () => void;
  /** Which CTA opened this — decides whether it reads as sales or as deploy. */
  source?: string;
}

/**
 * Sources that are explicitly a "talk to a human" ask. Everything else reached
 * this modal as a Deploy click (either a fallback from checkout, or a nav CTA),
 * so it keeps the deploy wording.
 */
const SALES_SOURCES = new Set([
  'pricing_scale',
  'industries',
  'ig_demo',
  // 'closing_cta' deliberately NOT here any more. That button now reads
  // "Deploy PROXe" and goes to checkout; leaving it in this set would have
  // sent the page's largest, most committed CTA to a booking calendar — the
  // exact mismatch that made a buyer land on the calendar when they meant to
  // pay. It only reaches this modal as a checkout fallback now.
  'pricing_core_call', // "Not ready? Book a call" under the Core CTA
  'header_call',
]);

export default function DeployModal({ isOpen, onClose, onFormSubmit, source = 'unknown' }: DeployModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    brandName: '',
    websiteUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  /**
   * Two steps on purpose. Step 1 asks only for name + phone and SAVES that
   * immediately; step 2 collects email, brand and website and goes to payment.
   *
   * The whole point is the save between them: a five-field wall meant someone
   * who bailed at "Brand website" left nothing behind at all. Now the two
   * fields that make a person reachable are banked before anything else is
   * asked. `upsertProxeLead` keys on the normalised phone, so step 2 updates
   * that same lead rather than creating a second one.
   */
  const [step, setStep] = useState<1 | 2>(1);
  /** Set once step 1 has been persisted, so a back-and-forth cannot re-save. */
  const savedStep1 = useRef(false);
  /** Flipped state — once the form is submitted, flip to the booking calendar. */
  const [flipped, setFlipped] = useState(false);
  /** Fire `lead_form_start` only on the first field interaction per open. */
  const startedRef = useRef(false);

  const cleanPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return '';
    return phone.replace(/^\+1\s*/, '').trim();
  };

  // Pre-fill from any stored profile each time we open.
  useEffect(() => {
    if (isOpen) {
      startedRef.current = false;
      savedStep1.current = false;
      setStep(1);
      setErrors({});
      setFlipped(false);
      const existingUser = getStoredUser('proxe');
      if (existingUser) {
        setFormData({
          name: existingUser.name || '',
          email: existingUser.email || '',
          phoneNumber: cleanPhoneNumber(existingUser.phone),
          brandName: existingUser.brandName || '',
          websiteUrl: existingUser.websiteUrl || '',
        });
      }
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Declared before handleSubmit uses it — sales sources book a call, everyone
  // else is buy intent and goes to checkout.
  const isSales = SALES_SOURCES.has(source);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!startedRef.current) {
      startedRef.current = true;
      track('lead_form_start', { source: 'deploy_modal' });
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    // Everything on step 2 is optional: step 1 already banked a reachable
    // human, and a required field here is just one more reason to bail.
    // The only check left is the shape of an email somebody chose to type.
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Step 1 → bank the lead, then advance.
   *
   * The Meta/GA conversion fires HERE and only here: this is the moment we
   * have a contactable human. Firing it again on step 2 would report two
   * leads for one person and halve the apparent cost per lead.
   */
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setIsSubmitting(true);

    const partial = {
      name: formData.name.trim(),
      phone: formData.phoneNumber.trim(),
      promptedName: true,
      promptedPhone: true,
    };
    storeUserProfile(partial, 'proxe');

    if (!savedStep1.current) {
      savedStep1.current = true;
      const leadEventId = trackLead({
        source: 'deploy_modal',
        hasBrand: false,
        hasWebsite: false,
      });
      // Never blocks the step change: submitLead resolves false on failure,
      // and a lead we could not persist must not trap someone on step 1.
      await submitLead({
        type: 'lead',
        name: partial.name,
        phone: partial.phone,
        source: isSales ? `${source}_sales` : 'deploy_modal',
        eventId: leadEventId,
      });
    }

    setIsSubmitting(false);
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    const userProfile = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phoneNumber.trim(),
      brandName: formData.brandName.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      promptedName: true,
      promptedEmail: true,
      promptedPhone: true,
    };
    storeUserProfile(userProfile, 'proxe');

    // NOTE: the GA4 `form_completed` / Meta `Lead` conversion already fired on
    // step 1, the moment this person became contactable. It deliberately does
    // NOT fire again here, or on the booking step, or on the thank-you page —
    // one human, one Lead.
    //
    // This second submit fills in email, brand and website. upsertProxeLead
    // matches on the normalised phone captured in step 1, so it UPDATES that
    // lead rather than creating a duplicate. eventId is a fresh id purely for
    // request tracing; it is not a second conversion.
    await submitLead({
      type: 'lead',
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      brandName: userProfile.brandName,
      websiteUrl: userProfile.websiteUrl,
      source: isSales ? `${source}_sales` : 'deploy_modal',
      eventId: newEventId(),
    });

    onFormSubmit?.();

    // Sales enquiries never hit checkout — they pick a call slot right here.
    if (isSales) {
      setIsSubmitting(false);
      setFlipped(true);
      return;
    }

    // Buy intent: hand off to Dodo, prefilled with what they just typed, so
    // nobody types their name and email twice. The onboarding call is booked
    // AFTER payment, on /thank-you?checkout=success.
    trackCheckoutStart(source);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market: detectMarket(),
          source,
          name: userProfile.name,
          email: userProfile.email,
          // Sent so Dodo prefills it too. Without this the buyer retypes on the
          // hosted page a phone number they just gave us one screen earlier.
          phone: userProfile.phone,
          brandName: userProfile.brandName,
        }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok && data.checkoutUrl) {
        // Full navigation — checkout is hosted by Dodo. Keep the busy state.
        window.location.href = data.checkoutUrl as string;
        return;
      }
      // Checkout unavailable (products unset, Dodo down): don't strand them —
      // fall through to the calendar so the lead still converts to a call.
      track('checkout_unavailable', { source, reason: data?.reason ?? 'unknown' });
    } catch {
      track('checkout_unavailable', { source, reason: 'network_error' });
    }

    setIsSubmitting(false);
    setFlipped(true);
  };

  // Visitor picked a slot on the flip-side calendar → record it (no second lead
  // event) and hand off to the thank-you page.
  const handleBookingConfirm = (slot: BookingSlot) => {
    storeBooking({ label: slot.label, time: slot.time }, 'proxe');
    const bookingEventId = newEventId();
    track('booking_confirm', {
      source: 'deploy_modal',
      day_of_week: new Date(slot.iso).toLocaleDateString('en-US', { weekday: 'long' }),
      time: slot.time,
    }, bookingEventId);
    // Update the same lead row (matched by email) with the chosen slot.
    submitLead({
      type: 'booking',
      eventId: bookingEventId,
      email: formData.email.trim(),
      bookingLabel: slot.label,
      bookingTime: slot.time,
    });
    onClose();
    router.push('/thank-you');
  };

  // PROXe's own WABA. Whatever step 2 holds is banked first, then the
  // conversation moves to WhatsApp — they're already a saved lead, so
  // talking is a valid exit from the funnel, not a leak out of it.
  const handleWhatsApp = () => {
    track('whatsapp_click', { source: 'deploy_modal_step2' });
    submitLead({
      type: 'lead',
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phoneNumber.trim(),
      brandName: formData.brandName.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      source: 'deploy_modal_whatsapp',
      eventId: newEventId(),
    });
    const text = encodeURIComponent(
      `Hi, I'd like to set up PROXe${formData.brandName.trim() ? ` for ${formData.brandName.trim()}` : ''}.`
    );
    window.open(`https://wa.me/918123808817?text=${text}`, '_blank', 'noopener');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const firstName = formData.name.trim().split(' ')[0];

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.flipScene}>
        <div className={`${styles.flipCard}${flipped ? ' ' + styles.flipCardFlipped : ''}`}>

          {/* ───── FRONT FACE — capture form (fires the lead on submit) ───── */}
          <div className={`${styles.flipFace} ${styles.flipFront} ${styles.modalContainer}`}>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >×</button>

            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{isSales ? 'Talk to sales' : 'Deploy PROXe'}</h2>
              <p className={styles.modalSubtitle}>
                {step === 1
                  ? 'Two quick steps and PROXe is yours.'
                  : isSales
                    ? 'Tell us about your setup. We’ll come back with a quote and a time to walk through it.'
                    : 'Almost there. Next: secure checkout, then you pick your onboarding call.'}
              </p>
              <div className={styles.stepRow} aria-hidden>
                <span className={`${styles.stepDot} ${styles.stepDotActive}`} />
                <span className={`${styles.stepDot}${step === 2 ? ' ' + styles.stepDotActive : ''}`} />
                <span className={styles.stepLabel}>Step {step} of 2</span>
              </div>
            </div>

            <form onSubmit={step === 1 ? handleStep1 : handleSubmit} className={styles.form}>
              <div className={styles.formGroup} hidden={step !== 1}>
                <label htmlFor="name" className={styles.label}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text" id="name" name="name"
                  value={formData.name} onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Step 1: name + phone. `hidden` rather than unmounting, so
                  typed values survive a step change and browser autofill
                  still sees the whole form as one unit. */}
              <div className={styles.formGroup} hidden={step !== 1}>
                <label htmlFor="phoneNumber" className={styles.label}>
                  Phone <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel" id="phoneNumber" name="phoneNumber"
                  value={formData.phoneNumber} onChange={handleChange}
                  className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
                  placeholder="+91 98XXXXXX12"
                  autoComplete="tel"
                />
                {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
              </div>

              <div className={styles.formGroup} hidden={step !== 2}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.optionalHint}>optional</span>
                </label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup} hidden={step !== 2}>
                <label htmlFor="brandName" className={styles.label}>
                  Brand name <span className={styles.optionalHint}>optional</span>
                </label>
                <input
                  type="text" id="brandName" name="brandName"
                  value={formData.brandName} onChange={handleChange}
                  className={`${styles.input} ${errors.brandName ? styles.inputError : ''}`}
                  placeholder="Your company / brand"
                  autoComplete="organization"
                />
                {errors.brandName && <span className={styles.errorText}>{errors.brandName}</span>}
              </div>

              <div className={styles.formGroup} hidden={step !== 2}>
                <label htmlFor="websiteUrl" className={styles.label}>
                  Brand website <span className={styles.optionalHint}>optional</span>
                </label>
                <input
                  type="text" id="websiteUrl" name="websiteUrl"
                  value={formData.websiteUrl} onChange={handleChange}
                  className={`${styles.input} ${errors.websiteUrl ? styles.inputError : ''}`}
                  placeholder="yourbrand.com"
                  autoComplete="url"
                />
                {errors.websiteUrl && <span className={styles.errorText}>{errors.websiteUrl}</span>}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {step === 1
                  ? (isSubmitting ? 'Saving…' : 'Continue →')
                  : isSubmitting
                    ? (isSales ? 'Sending…' : 'Opening secure checkout…')
                    : (isSales ? 'Continue →' : 'Continue to payment →')}
              </button>

              {step === 2 && !isSubmitting && (
                <>
                  <button type="button" className={styles.waButton} onClick={handleWhatsApp}>
                    Chat on WhatsApp
                  </button>
                  <button
                    type="button"
                    className={styles.stepBack}
                    onClick={() => { setErrors({}); setStep(1); }}
                  >
                    ← Back
                  </button>
                </>
              )}
            </form>
          </div>

          {/* ───── BACK FACE — inline booking calendar (no second lead event) ───── */}
          <div className={`${styles.flipFace} ${styles.flipBack} ${styles.modalContainer}`}>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >×</button>
            {/* Only mount the calendar once flipped, so its month/today state is
                fresh and the entry animation plays on reveal. */}
            {flipped && (
              <BookingCalendar
                firstName={firstName}
                isSubmitting={isSubmitting}
                onConfirm={handleBookingConfirm}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
