'use client'

/**
 * Tiny, SSR-safe analytics layer that fans events out to whatever tags are
 * loaded on the page — GA4 (gtag) and the Meta Pixel (fbq). Both are loaded by
 * <AnalyticsScripts /> with `strategy="afterInteractive"`, so on early clicks
 * the globals may not exist yet — every call is guarded.
 *
 * One place defines every custom event name we fire across the landing page, so
 * the GA4 "Events" report stays a known, finite list instead of a soup of
 * ad-hoc strings.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    __proxeScrollDepth?: number
  }
}

/** Every custom event we emit. Keep this list in sync with the GA4 dashboard. */
export type ProxeEvent =
  // ── Conversion ──────────────────────────────────────────────
  | 'generate_lead'        // GA4 recommended name — the lead form was submitted
  | 'lead_form_start'      // first interaction with a lead form field (funnel top)
  | 'thank_you_view'       // landed on /thank-you
  | 'book_call_click'      // clicked the calendar / "open the calendar" CTA
  // ── CTAs ────────────────────────────────────────────────────
  | 'cta_click'            // a non-modal CTA (anchor scroll) — param: location
  | 'deploy_modal_open'    // the deploy modal was opened — param: source
  | 'nav_click'            // header / footer nav link — param: label
  | 'newsletter_subscribe' // footer newsletter submit
  // ── Engagement ──────────────────────────────────────────────
  | 'channel_demo_select'  // switched channel in a demo — param: channel
  | 'voice_demo_start'     // tapped the live voice orb
  | 'video_unmute'         // un-muted the hero video
  | 'faq_open'             // expanded a FAQ item — param: question
  | 'scroll_depth'         // crossed a 25/50/75/90% scroll milestone — param: percent

type EventParams = Record<string, string | number | boolean | undefined>

/** True on localhost / loopback — we never want dev hits in the live property. */
function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '[::1]'
}

/** Fire a custom event to every analytics tag present. Safe to call anywhere. */
export function track(event: ProxeEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined') return
  if (isLocalHost()) return

  // GA4 — use the beacon transport so the hit survives a page navigation
  // (important for conversion events fired right before router.push).
  try {
    window.gtag?.('event', event, { transport_type: 'beacon', ...params })
  } catch {
    /* never let analytics throw into product code */
  }

  // Meta Pixel — map our lead event onto the pixel's standard "Lead" event.
  try {
    if (event === 'generate_lead') {
      window.fbq?.('track', 'Lead', params)
    }
  } catch {
    /* no-op */
  }
}

/**
 * Convenience for the single most important event: a captured lead. Fires the
 * GA4 `generate_lead` + Meta `Lead`, carrying non-PII context only (we send the
 * source + whether a brand/site was provided, never the raw email/phone).
 */
export function trackLead(meta: { source?: string; hasBrand?: boolean; hasWebsite?: boolean } = {}): void {
  track('generate_lead', {
    source: meta.source ?? 'deploy_form',
    has_brand: meta.hasBrand ?? false,
    has_website: meta.hasWebsite ?? false,
    currency: 'USD',
    value: 1,
  })
}

/**
 * Install a one-shot scroll-depth tracker. Fires `scroll_depth` once per
 * 25 / 50 / 75 / 90% milestone for the session. Returns a cleanup fn.
 */
export function initScrollDepthTracking(): () => void {
  if (typeof window === 'undefined') return () => {}

  const milestones = [25, 50, 75, 90]
  window.__proxeScrollDepth = window.__proxeScrollDepth ?? 0

  const onScroll = () => {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable <= 0) return
    const pct = (window.scrollY / scrollable) * 100
    for (const m of milestones) {
      if (pct >= m && (window.__proxeScrollDepth ?? 0) < m) {
        window.__proxeScrollDepth = m
        track('scroll_depth', { percent: m })
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
