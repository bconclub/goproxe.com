/**
 * One E.164 normalizer for every dialer on the site. Born 2 Sep 2026 from the
 * Vobiz "41% of calls fail at 0s" ticket: the scheduled-callback cron dialled
 * `all_leads.phone` exactly as typed ("99991 09111", "9955582657",
 * "918143589174"), and four 11-digit Indian numbers starting 9722 were sent as
 * +9722… and rang Israel. Vobiz answered "user busy/unavailable" because the
 * carrier had nothing routable. Every one of those was our formatting.
 *
 * India-first: 10 digits -> +91, leading 0 stripped, 91-prefixed 12 digits
 * accepted, an explicit + is trusted. Anything else in the INR market is
 * returned as null and must NOT be dialled - a guess that rings a stranger
 * abroad is worse than a skipped call.
 */
export function toE164India(raw: string | null | undefined): string | null {
  const trimmed = String(raw ?? '').trim()
  if (!trimmed) return null
  const digits = trimmed.replace(/\D/g, '')
  if (trimmed.startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits[1])) return `+91${digits.slice(1)}`
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits[2])) return `+${digits}`
  return null
}
