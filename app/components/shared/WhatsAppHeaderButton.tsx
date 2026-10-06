'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { track } from '../../lib/analytics'
import { getAttribution } from '../../lib/attribution'

/**
 * Small WhatsApp button that sits beside the Deploy CTA in the floating header.
 *
 * The number is PROXe's own WhatsApp line, so a click lands in a chat the
 * agent answers in seconds and the visitor becomes a captured lead - the
 * product demonstrating itself.
 *
 * Opens WhatsApp directly (Z, 5 Oct 2026: no gate). The name-and-number gate
 * (WhatsAppGate, 31 Aug) existed to keep the visitor's source with the lead;
 * a bare deep link carries none of it. So the pre-filled message ends with a
 * short code, and the campaign is stored against it (see waLink).
 */
const PHONE = '918123808817' // +91 81238 08817, E.164 without the + (PROXe WABA)

/** 5 characters, no look-alikes (0/O, 1/I). */
function refCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  const rnd = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(5)) : null
  for (let i = 0; i < 5; i++) out += alphabet[(rnd ? rnd[i] : Math.floor(Math.random() * 256)) % alphabet.length]
  return out
}

/**
 * The prefilled message ends with a short code only ("PX-7K2QF"), never the
 * campaign itself (Z, 6 Oct 2026: the customer saw "(via PROXe UGC v4 -
 * Broad 24-38 · home_header)"). The campaign is stored against the code at
 * the click; PROXe core strips the code and attaches the campaign to the lead.
 */
function waLink(location: string): string {
  const code = refCode()
  try {
    const a: any = getAttribution()
    const attribution = {
      channel: a.channel, utm_source: a.utmSource, utm_medium: a.utmMedium, utm_campaign: a.utmCampaign,
      referrer: a.referrer, landing_page: a.landingPage,
    }
    const payload = JSON.stringify({ code, location, attribution })
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/wa-ref', payload))) {
      void fetch('/api/wa-ref', { method: 'POST', body: payload, keepalive: true }).catch(() => {})
    }
  } catch { /* attribution unavailable: the chat still opens */ }
  const text = `Hi, I want to know more about PROXe. PX-${code}`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}

export default function WhatsAppHeaderButton({ location = 'header' }: { location?: string }) {
  return (
    <a
      href={`https://wa.me/${PHONE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="proxe-float-wa"
      // The tagged link is built at click time, when attribution is readable.
      onClick={(e) => { e.currentTarget.href = waLink(location); track('whatsapp_click', { location, stage: 'direct' }) }}
    >
      <FaWhatsapp size={18} />
    </a>
  )
}
