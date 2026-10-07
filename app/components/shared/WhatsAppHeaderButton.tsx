'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { useCallback, useState } from 'react'
import WhatsAppGate from './WhatsAppGate'

/**
 * Small WhatsApp button that sits beside the Deploy CTA in the floating header.
 *
 * The number is PROXe's own WhatsApp line, so a click lands in a chat the
 * agent answers in seconds and the visitor becomes a captured lead - the
 * product demonstrating itself.
 *
 * Asks for the visitor's name first (WhatsAppGate), then opens WhatsApp with
 * their name and a short source code in the first message.
 */
const PHONE = '918123808817' // +91 81238 08817, E.164 without the + (PROXe WABA)

export default function WhatsAppHeaderButton({ location = 'header' }: { location?: string }) {
  // Name first (Z, 7 Oct 2026): one field, then WhatsApp opens with "Hi, I'm <name>".
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <a
        href={`https://wa.me/${PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        className="proxe-float-wa"
        onClick={(e) => { e.preventDefault(); setOpen(true) }}
      >
        <FaWhatsapp size={18} />
      </a>
      <WhatsAppGate open={open} onClose={close} location={location} />
    </>
  )
}
