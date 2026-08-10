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

import { planValue } from './market'

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
  | 'form_completed'       // the deploy form was submitted (the captured lead)
  | 'lead_form_start'      // first interaction with a lead form field (funnel top)
  | 'demo_booked'          // reached /thank-you after picking a slot
  | 'booking_confirm'      // picked a slot on the modal's flip-side calendar
  | 'checkout_start'       // the deploy form was submitted, handing off to Dodo
  | 'checkout_unavailable' // checkout couldn't open, fell back to the calendar
  | 'checkout_complete'    // returned from Dodo with ?checkout=success
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
  | 'pricing_view'         // the pricing section scrolled into view (buying intent)
  // ── Industry pages + demo funnel ────────────────────────────
  | 'industry_page_view'   // an /industries/[slug] page mounted — param: industry
  | 'industry_cta_click'   // industry-page CTA — params: industry, target: demo|deploy
  | 'demo_start'           // the demo dashboard mounted — param: industry
  | 'demo_tour_step'       // tour advanced — params: industry, step
  | 'demo_tour_complete'   // tour reached its final step — param: industry
  | 'demo_interact'        // first lead_open / chat_send / widget_send — params: industry, what
  | 'demo_deploy_click'    // demo Deploy CTA — params: industry, placement
  // ── Callback / voice funnel ─────────────────────────────────────
  // The hero promises "PROXe will call you right now". Everything below
  // measures whether that promise is kept: roughly a third of dials never
  // connect, and before these events that was invisible.
  | 'callback_start'       // first digit typed into the hero phone field
  | 'callback_submit'      // a valid number was submitted, dial requested
  | 'callback_dialed'      // the dial was ACCEPTED by the telephony side
  | 'callback_failed'      // the dial did not happen — param: reason
  | 'callback_blocked'     // cooldown guard refused (they just called)
  // ── Click / interaction detail ──────────────────────────────────
  | 'button_click'         // any tracked button — params: label, location
  | 'link_click'           // outbound or in-page link — params: label, href
  | 'section_view'         // a major section scrolled into view — param: section
  | 'form_field_complete'  // a required field was filled — params: form, field
  | 'form_abandon'         // form opened, fields touched, closed unsubmitted
  | 'form_error'           // validation blocked submit — params: form, fields
  // ── Checkout journey ────────────────────────────────────────────
  | 'checkout_redirect'    // actually navigating to the hosted Dodo page
  | 'checkout_cancelled'   // came back to /#pricing from Dodo without paying
  | 'plan_select'          // a pricing plan CTA was chosen — params: plan, market

type EventParams = Record<string, string | number | boolean | undefined>

/**
 * How each event reaches the Meta Pixel.
 *
 * Meta splits events in two: a fixed list of STANDARD names (`fbq('track', …)`)
 * that its ad-delivery optimisation and Ads Manager reporting understand
 * natively, and anything else, which must go through `fbq('trackCustom', …)`.
 * Sending a non-standard name via 'track' is silently ignored by optimisation —
 * the event shows in the pixel debugger but cannot be optimised toward, which
 * is the failure mode that quietly wastes ad spend. So the mapping is explicit.
 *
 * Standard names used here are exactly as Meta spells them; do not rename.
 */
const META_STANDARD: Partial<Record<ProxeEvent, string>> = {
  form_completed: 'Lead',
  checkout_start: 'InitiateCheckout',
  checkout_complete: 'Purchase',
  // ONE Schedule per real booking. booking_confirm is the moment a slot is
  // actually chosen, and it is the only event that fires on BOTH booking
  // paths (sales calendar in the modal, and the onboarding call after
  // checkout) — so it carries Schedule.
  booking_confirm: 'Schedule',
  newsletter_subscribe: 'CompleteRegistration',
  pricing_view: 'ViewContent',
}

/** Custom (non-standard) Meta names, PascalCase per Meta's convention. */
const META_CUSTOM: Partial<Record<ProxeEvent, string>> = {
  lead_form_start: 'LeadFormStart',
  // WAS mapped to Schedule, which double-counted: the visitor books in the
  // modal (booking_confirm -> Schedule) and is then redirected here, firing a
  // second Schedule for the same booking. Meta saw two bookings per person and
  // cost-per-booking read about half of reality. It is a thank-you page view.
  demo_booked: 'ThankYouView',
  checkout_unavailable: 'CheckoutUnavailable',
  cta_click: 'CTAClick',
  deploy_modal_open: 'DeployModalOpen',
  nav_click: 'NavClick',
  channel_demo_select: 'ChannelDemoSelect',
  voice_demo_start: 'VoiceDemoStart',
  video_unmute: 'VideoUnmute',
  faq_open: 'FAQOpen',
  scroll_depth: 'ScrollDepth',
  // The demo's deploy click stays custom — the real conversion still fires on
  // the landing domain via deploy_modal_open → form_completed.
  industry_page_view: 'IndustryPageView',
  industry_cta_click: 'IndustryCTAClick',
  demo_start: 'DemoStart',
  demo_tour_step: 'DemoTourStep',
  demo_tour_complete: 'DemoTourComplete',
  demo_interact: 'DemoInteract',
  demo_deploy_click: 'DemoDeployClick',
  // Callback funnel. callback_dialed is the one that matters for ad
  // optimisation, but it stays CUSTOM: a connected call is not yet a sale,
  // and mapping it to a standard event would pollute Lead/Purchase.
  callback_start: 'CallbackStart',
  callback_submit: 'CallbackSubmit',
  callback_dialed: 'CallbackDialed',
  callback_failed: 'CallbackFailed',
  callback_blocked: 'CallbackBlocked',
  button_click: 'ButtonClick',
  link_click: 'LinkClick',
  section_view: 'SectionView',
  form_field_complete: 'FormFieldComplete',
  form_abandon: 'FormAbandon',
  form_error: 'FormError',
  checkout_redirect: 'CheckoutRedirect',
  checkout_cancelled: 'CheckoutCancelled',
  plan_select: 'PlanSelect',
}

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

  // Meta Pixel — every event reaches the pixel, standard names via 'track' so
  // ad delivery can optimise toward them, everything else via 'trackCustom'.
  try {
    const standard = META_STANDARD[event]
    if (standard) {
      window.fbq?.('track', standard, params)
    } else {
      const custom = META_CUSTOM[event]
      if (custom) window.fbq?.('trackCustom', custom, params)
    }
  } catch {
    /* no-op */
  }
}

/**
 * Convenience for the single most important event: a completed deploy form. Fires
 * the GA4 `form_completed` + Meta `Lead`, carrying non-PII context only (we send
 * the source + whether a brand/site was provided, never the raw email/phone).
 */
export function trackLead(meta: { source?: string; hasBrand?: boolean; hasWebsite?: boolean } = {}): void {
  // Value is the Core plan price in the visitor's own market, not a flat 1 USD.
  // Meta's value-optimised bidding ranks leads by this number, so quoting every
  // lead at $1 told it an Indian signup and an international one were worth the
  // same; they differ by ~20x at the real subscription prices.
  const { value, currency } = planValue()
  track('form_completed', {
    source: meta.source ?? 'deploy_form',
    has_brand: meta.hasBrand ?? false,
    has_website: meta.hasWebsite ?? false,
    currency,
    value,
  })
}

/**
 * Checkout handed off to Dodo. Carries the real amount so Meta can compare
 * spend against pipeline, not just count clicks.
 */
export function trackCheckoutStart(source: string): void {
  const { value, currency } = planValue()
  track('checkout_start', { source, currency, value })
}

/**
 * Returned from Dodo with ?checkout=success — a real, recurring subscription.
 * This is the only event that reports revenue, so ROAS in Ads Manager is only
 * as correct as this call.
 */
export function trackPurchase(meta: EventParams = {}): void {
  const { value, currency } = planValue()
  track('checkout_complete', { ...meta, currency, value })
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
