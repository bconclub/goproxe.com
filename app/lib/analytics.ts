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
  | 'whatsapp_click'       // the WhatsApp float was tapped — param: location
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
  | 'form_error'           // validation blocked submit — params: form, fields
  // ── Checkout journey ────────────────────────────────────────────
  | 'checkout_redirect'    // actually navigating to the hosted Dodo page
  | 'checkout_cancelled'   // came back to /#pricing from Dodo without paying
  | 'plan_select'          // a pricing plan CTA was chosen — params: plan, market

/** GA4 `items[]` is an array of objects, so params cannot be flat-only. */
type EventItem = Record<string, string | number>
type EventParams = Record<string, string | number | boolean | undefined | EventItem[]>

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
  // Meta's standard 'Contact' is defined as a customer starting contact by
  // phone, SMS, email or chat, which is exactly this. Standard (not custom)
  // so paid traffic can actually be optimised toward WhatsApp conversations,
  // which is the whole point of putting the button there.
  whatsapp_click: 'Contact',
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
  form_error: 'FormError',
  checkout_redirect: 'CheckoutRedirect',
  checkout_cancelled: 'CheckoutCancelled',
  plan_select: 'PlanSelect',
}

/**
 * GA4 speaks its own vocabulary. Our internal names (`form_completed`,
 * `checkout_complete`) are fine for our own reports but GA4 gives NOTHING
 * automatic to a name it does not recognise: no key event, no ecommerce
 * report, no revenue column, and nothing Google Ads can import as a
 * conversion. Only its RECOMMENDED names get that treatment, and `purchase`
 * is the single event GA4 marks as a key event without being asked.
 *
 * So every conversion is sent TWICE to GA4: once under our name (keeps the
 * existing history and our own funnel intact) and once under Google's, which
 * is the copy that becomes a key event and feeds Ads. They are different
 * event names, so GA4 does not treat this as a duplicate.
 */
const GA4_ALIAS: Partial<Record<ProxeEvent, string>> = {
  form_completed: 'generate_lead',
  checkout_start: 'begin_checkout',
  checkout_complete: 'purchase',
  newsletter_subscribe: 'sign_up',
  pricing_view: 'view_item',
}

/**
 * Google Ads. Separate from GA4 — a GA4 key event only reaches Ads after you
 * link the accounts AND import it, which is manual and lossy. Firing the Ads
 * conversion directly is immediate and survives an unlinked property.
 *
 * All env-driven: with no NEXT_PUBLIC_GOOGLE_ADS_ID this whole path is inert,
 * exactly like CAPI is without its token. Labels come from Google Ads >
 * Goals > Conversions > the conversion > tag setup ("send_to" looks like
 * AW-123456789/AbCdEfGhIj — the part after the slash is the label).
 */
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

const ADS_LABEL: Partial<Record<ProxeEvent, string | undefined>> = {
  form_completed: process.env.NEXT_PUBLIC_GADS_LABEL_LEAD,
  checkout_start: process.env.NEXT_PUBLIC_GADS_LABEL_BEGIN_CHECKOUT,
  checkout_complete: process.env.NEXT_PUBLIC_GADS_LABEL_PURCHASE,
  booking_confirm: process.env.NEXT_PUBLIC_GADS_LABEL_BOOKING,
  whatsapp_click: process.env.NEXT_PUBLIC_GADS_LABEL_CONTACT,
}

/**
 * GA4 ecommerce shape. `purchase` and `begin_checkout` are only real ecommerce
 * events when they carry `items[]`; without it GA4 records the event but shows
 * zero revenue, which is indistinguishable from not sending it at all.
 * `transaction_id` is what stops a page refresh counting a second purchase.
 */
function ecommerceParams(event: ProxeEvent, params: EventParams): EventParams {
  if (event !== 'checkout_complete' && event !== 'checkout_start') return {}
  const { value, currency } = planValue()
  return {
    items: [
      { item_id: 'proxe_core', item_name: 'PROXe Core', item_category: 'subscription', price: value, quantity: 1 },
    ],
    ...(params.transaction_id ? { transaction_id: params.transaction_id } : {}),
    currency,
    value,
  }
}

/**
 * Debug mode. Append `?analytics_debug=1` to any URL and it sticks for the tab
 * (sessionStorage), so you can click through a whole funnel and watch it.
 *
 * Two effects: every event is logged to the console with the exact names each
 * platform receives, and GA4 gets `debug_mode: true`, which is what makes the
 * hit appear in GA4 Admin > DebugView IMMEDIATELY instead of 24-48h later.
 * That is the difference between testing a change and guessing at one.
 */
function debugEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).has('analytics_debug')) {
      sessionStorage.setItem('proxe_analytics_debug', '1')
    }
    return sessionStorage.getItem('proxe_analytics_debug') === '1'
  } catch {
    return false
  }
}

/** True on localhost / loopback — we never want dev hits in the live property. */
function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '[::1]'
}

/** Fire a custom event to every analytics tag present. Safe to call anywhere. */
/**
 * Generate a conversion id shared between the pixel and the Conversions API.
 * Meta merges a browser event and a server event into ONE conversion only when
 * event_name and event_id both match — so the same id must reach both.
 */
export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto & { randomUUID: () => string }).randomUUID()
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function track(event: ProxeEvent, params: EventParams = {}, eventId?: string): void {
  if (typeof window === 'undefined') return
  // Localhost still never reports — EXCEPT with ?analytics_debug=1, which is an
  // explicit, deliberate opt-in so a funnel can be tested before it ships. The
  // hits it produces carry debug_mode and land in DebugView.
  const debug = debugEnabled()
  if (isLocalHost() && !debug) return

  // NOT debug_mode here — that is set on the gtag config in AnalyticsScripts,
  // which is the only placement gtag turns into the _dbg=1 flag DebugView reads.
  const gaParams: EventParams = params
  const alias = GA4_ALIAS[event]

  // GA4 — use the beacon transport so the hit survives a page navigation
  // (important for conversion events fired right before router.push).
  try {
    window.gtag?.('event', event, { transport_type: 'beacon', ...gaParams })
    // …and the Google-vocabulary twin, the copy that can become a key event.
    if (alias) {
      window.gtag?.('event', alias, {
        transport_type: 'beacon',
        ...gaParams,
        ...ecommerceParams(event, params),
      })
    }
  } catch {
    /* never let analytics throw into product code */
  }

  // Google Ads — a direct conversion hit, independent of any GA4 import.
  try {
    const label = ADS_LABEL[event]
    if (GOOGLE_ADS_ID && label) {
      const { value, currency } = planValue()
      window.gtag?.('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${label}`,
        value,
        currency,
        ...(params.transaction_id ? { transaction_id: params.transaction_id } : {}),
      })
    }
  } catch {
    /* no-op */
  }

  // Meta Pixel — every event reaches the pixel, standard names via 'track' so
  // ad delivery can optimise toward them, everything else via 'trackCustom'.
  try {
    // The 4th argument carries eventID. It is what lets the server's CAPI
    // copy of this same conversion be deduplicated rather than double-counted.
    const opts = eventId ? { eventID: eventId } : undefined
    const standard = META_STANDARD[event]
    if (standard) {
      window.fbq?.('track', standard, params, opts)
    } else {
      const custom = META_CUSTOM[event]
      if (custom) window.fbq?.('trackCustom', custom, params, opts)
    }
  } catch {
    /* no-op */
  }

  if (debug) {
    const label = ADS_LABEL[event]
    // eslint-disable-next-line no-console
    console.log(
      `%c[analytics]%c ${event}`,
      'background:#7c3aed;color:#fff;padding:1px 5px;border-radius:3px',
      'font-weight:600',
      {
        ga4: alias ? [event, alias] : [event],
        meta: META_STANDARD[event] ?? META_CUSTOM[event] ?? '(none)',
        googleAds: GOOGLE_ADS_ID && label ? `${GOOGLE_ADS_ID}/${label}` : '(not configured)',
        params,
        eventId,
      },
    )
  }
}

/**
 * Convenience for the single most important event: a completed deploy form. Fires
 * the GA4 `form_completed` + Meta `Lead`, carrying non-PII context only (we send
 * the source + whether a brand/site was provided, never the raw email/phone).
 */
export function trackLead(meta: { source?: string; hasBrand?: boolean; hasWebsite?: boolean } = {}): string {
  // Value is the Core plan price in the visitor's own market, not a flat 1 USD.
  // Meta's value-optimised bidding ranks leads by this number, so quoting every
  // lead at $1 told it an Indian signup and an international one were worth the
  // same; they differ by ~20x at the real subscription prices.
  const { value, currency } = planValue()
  // Returned so the caller can pass the SAME id to submitLead(), which sends it
  // to /api/lead, which fires the server-side twin. Without that hand-off the
  // pixel and CAPI events are two separate conversions for one lead.
  const eventId = newEventId()
  track('form_completed', {
    source: meta.source ?? 'deploy_form',
    has_brand: meta.hasBrand ?? false,
    has_website: meta.hasWebsite ?? false,
    currency,
    value,
  }, eventId)
  return eventId
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
export function trackPurchase(meta: EventParams = {}, transactionId?: string): void {
  const { value, currency } = planValue()
  // GA4 and Google Ads both dedupe on transaction_id. /thank-you is a normal
  // URL a buyer can refresh, bookmark or reopen, and every one of those was
  // previously a fresh purchase with fresh revenue attached. Belt and braces:
  // the id is sent so the platforms can dedupe, AND the tab refuses to send
  // the same id twice, so a refresh never even reaches the network.
  const txId = transactionId || 'unknown'
  try {
    const key = `proxe_purchase_sent:${txId}`
    if (txId !== 'unknown' && sessionStorage.getItem(key)) return
    if (txId !== 'unknown') sessionStorage.setItem(key, '1')
  } catch {
    /* private mode — fall through and send, a dupe beats a silent miss */
  }
  track('checkout_complete', {
    ...meta,
    ...(transactionId ? { transaction_id: transactionId } : {}),
    currency,
    value,
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
