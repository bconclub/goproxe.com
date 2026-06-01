'use client'

/**
 * First-touch traffic attribution.
 *
 * Captured the first time a visitor lands (UTM tags, ad-click ids, referrer,
 * landing URL), stored in localStorage so it survives until they submit the
 * lead form. We keep FIRST touch — how they originally found PROXe — which is
 * the most useful answer to "where did this lead come from?".
 */

const KEY = 'proxe.attribution'

export interface Attribution {
  /** Best-guess human channel: utm_source, else ad network, else referrer host, else "direct". */
  channel: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  referrer: string
  landingPage: string
}

const EMPTY: Attribution = {
  channel: '', utmSource: '', utmMedium: '', utmCampaign: '', referrer: '', landingPage: '',
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function compute(): Attribution {
  const p = new URLSearchParams(window.location.search)
  const utmSource = p.get('utm_source') || ''
  const utmMedium = p.get('utm_medium') || ''
  const utmCampaign = p.get('utm_campaign') || ''
  const gclid = p.get('gclid') || ''
  const fbclid = p.get('fbclid') || ''
  const referrer = document.referrer || ''
  const refHost = hostOf(referrer)
  const selfHost = window.location.hostname.replace(/^www\./, '')

  // Derive a single friendly channel.
  let channel = utmSource
  if (!channel) {
    if (gclid) channel = 'google'
    else if (fbclid) channel = 'facebook'
    else if (refHost && refHost !== selfHost) channel = refHost
    else channel = 'direct'
  }

  return {
    channel,
    utmSource,
    utmMedium,
    utmCampaign,
    referrer,
    landingPage: window.location.pathname + window.location.search,
  }
}

/**
 * Capture first-touch attribution if not already stored. Idempotent — safe to
 * call on every page mount; only the first call (the real landing) sticks.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return EMPTY
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return JSON.parse(existing) as Attribution
    const attr = compute()
    localStorage.setItem(KEY, JSON.stringify(attr))
    return attr
  } catch {
    return EMPTY
  }
}

/** Read stored attribution, capturing on the spot if nothing was stored yet. */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return EMPTY
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return JSON.parse(existing) as Attribution
  } catch {
    /* fall through */
  }
  return captureAttribution()
}
