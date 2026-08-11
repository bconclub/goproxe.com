'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { track } from '../../lib/analytics'

/**
 * Small WhatsApp button that sits beside the Deploy CTA in the floating header.
 *
 * Was a large float above the chat bubble; that stacked three circles in one
 * corner and dominated the page. Beside Deploy it reads as a second contact
 * option rather than a competing CTA, and it is present in the same place on
 * every page without covering content.
 *
 * The number is the founder's direct line for now, so this is deliberately a
 * plain wa.me link, no widget, no script.
 */
const PHONE = '919353253817' // +91 93532 53817, E.164 without the +
const PREFILL = 'Hi, I want to know more about PROXe.'

export default function WhatsAppHeaderButton({ location = 'header' }: { location?: string }) {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(PREFILL)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="proxe-float-wa"
      onClick={() => track('whatsapp_click', { location })}
    >
      <FaWhatsapp size={18} />
    </a>
  )
}
