'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DeployModal.module.css';
import { storeUserProfile, getStoredUser, storeBooking } from '../../lib/chatLocalStorage';
import { track, trackLead } from '../../lib/analytics';
import BookingCalendar, { type BookingSlot } from './BookingCalendar';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit?: () => void;
}

export default function DeployModal({ isOpen, onClose, onFormSubmit }: DeployModalProps) {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.brandName.trim()) newErrors.brandName = 'Brand name is required';
    if (!formData.websiteUrl.trim()) newErrors.websiteUrl = 'Brand website is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call — replace with real endpoint later.
    await new Promise(resolve => setTimeout(resolve, 900));

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

    // 🎯 The lead event fires HERE, once, the moment the form is captured —
    // GA4 `generate_lead` + Meta `Lead` (no PII in params). It does NOT fire
    // again on the booking step or the thank-you page.
    trackLead({
      source: 'deploy_modal',
      hasBrand: Boolean(userProfile.brandName),
      hasWebsite: Boolean(userProfile.websiteUrl),
    });

    onFormSubmit?.();
    setIsSubmitting(false);
    setFlipped(true); // ✨ flip to the booking calendar — no navigation yet
  };

  // Visitor picked a slot on the flip-side calendar → record it (no second lead
  // event) and hand off to the thank-you page.
  const handleBookingConfirm = (slot: BookingSlot) => {
    storeBooking({ label: slot.label, time: slot.time }, 'proxe');
    track('booking_confirm', {
      source: 'deploy_modal',
      day_of_week: new Date(slot.iso).toLocaleDateString('en-US', { weekday: 'long' }),
      time: slot.time,
    });
    onClose();
    router.push('/thank-you');
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
              <h2 className={styles.modalTitle}>Deploy PROXe</h2>
              <p className={styles.modalSubtitle}>
                Tell us about you. Next we&rsquo;ll pick a time to walk through it live.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
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

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Work email <span className={styles.required}>*</span>
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

              <div className={styles.formGroup}>
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

              <div className={styles.formGroup}>
                <label htmlFor="brandName" className={styles.label}>
                  Brand name <span className={styles.required}>*</span>
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

              <div className={styles.formGroup}>
                <label htmlFor="websiteUrl" className={styles.label}>
                  Brand website <span className={styles.required}>*</span>
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
                {isSubmitting ? 'Sending...' : 'Continue →'}
              </button>
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
