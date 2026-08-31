'use client'

import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { track } from '../../lib/analytics'
import WhatsAppGate from './WhatsAppGate'

/**
 * Small WhatsApp button that sits beside the Deploy CTA in the floating header.
 *
 * Was a large float above the chat bubble; that stacked three circles in one
 * corner and dominated the page. Beside Deploy it reads as a second contact
 * option rather than a competing CTA, and it is present in the same place on
 * every page without covering content.
 *
 * The number is PROXe's own WhatsApp line, so a click lands in a chat the
 * agent answers in seconds and the visitor becomes a captured lead - the
 * product demonstrating itself. It used to be the founder's direct line,
 * which meant every click bypassed the agent entirely (Z, 19 Aug).
 *
 * It no longer deep-links straight into WhatsApp. A bare wa.me link produced
 * an unknown number in the inbox and threw away everything the page knew about
 * the visitor - ad, UTMs, referrer, the page they were on - because a deep
 * link carries none of it. WhatsAppGate takes a name and a number first, saves
 * the lead WITH its attribution, then opens the chat (Z, 31 Aug).
 */
export default function WhatsAppHeaderButton({ location = 'header' }: { location?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        className="proxe-float-wa"
        onClick={() => { track('whatsapp_click', { location, stage: 'gate_open' }); setOpen(true) }}
      >
        <FaWhatsapp size={18} />
      </button>
      <WhatsAppGate open={open} onClose={() => setOpen(false)} location={location} />
    </>
  )
}
