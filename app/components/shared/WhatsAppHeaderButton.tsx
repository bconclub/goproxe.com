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
 * short source tag (campaign, else channel, else the page) that lands in the
 * PROXe inbox with the first message.
 */
const PHONE = '918123808817' // +91 81238 08817, E.164 without the + (PROXe WABA)

function waLink(location: string): string {
  let tag = location
  try {
    const a = getAttribution()
    tag = [a.utmCampaign || a.channel, location].filter(Boolean).join(' · ')
  } catch { /* attribution unavailable: the page alone */ }
  const text = `Hi, I want to know more about PROXe. (via ${tag})`
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
