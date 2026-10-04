/**
 * Business type asked on every lead form (hero, Deploy, WhatsApp button).
 * Stored as unified_context.web.business_type; brand_name keeps the brand.
 * "job_seeker" is not a sales lead: no call, no WhatsApp, lead closed.
 */
export const BUSINESS_TYPES = [
  { value: 'coaching', label: 'Coaching' },
  { value: 'clinic_hospital', label: 'Clinic or hospital' },
  { value: 'real_estate', label: 'Real estate' },
  { value: 'other', label: 'Other business' },
  { value: 'job_seeker', label: 'Looking for a job' },
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]['value']

export const JOB_SEEKER_MESSAGE =
  'Thanks for your interest. PROXe is not hiring through this form, so we will not call. Follow us for openings.'
