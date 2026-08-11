'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import { track } from '../../lib/analytics'

/**
 * WhatsApp float, sitting directly above the live chat bubble.
 *
 * Why it exists: the chat widget captures people who are willing to talk to an
 * AI on a website. A lot of visitors are not, and WhatsApp is the channel they
 * already live in. This is the low-friction door for them.
 *
 * GEOMETRY IS COUPLED to the widget embed, deliberately:
 * the embed (proxe.goproxe.com/api/widget/embed.js) pins its iframe at
 * bottom:0 right:0, and the bubble inside it is 56px at bottom:24px right:24px.
 * Because the iframe is flush to the corner those offsets land 1:1 in viewport
 * space, so matching them here stacks this button exactly on the bubble's axis.
 * If the bubble's size or offset changes in the widget, change BUBBLE_* below.
 *
 * The embed posts 'wc-chat-open' / 'wc-chat-close' to the parent window. We
 * listen because the opened chat covers this corner (desktop popup is anchored
 * bottom:24 right:24; mobile goes fullscreen), so the button has to get out of
 * the way rather than float on top of the conversation.
 */

/** Must match .bubbleButton in the widget: 56px at bottom:24 right:24. */
const BUBBLE_SIZE = 56
const BUBBLE_BOTTOM = 24
const BUBBLE_RIGHT = 24
const GAP = 14

const PHONE = '919353253817' // +91 93532 53817, E.164 without the +
const PREFILL = 'Hi, I want to know more about PROXe.'

/**
 * The collapsed widget iframe is 165px tall, but the bubble inside only uses
 * the bottom 80px (24 offset + 56 button). The remaining ~85px is transparent
 * iframe that still swallows every click over it — so anything placed there,
 * including this button, is invisible to the mouse. Trim the collapsed box to
 * just clear the bubble; the widget expands it again when the chat opens.
 *
 * 92px = the bubble's 80px plus 12px of headroom for its shadow.
 */
const COLLAPSED_H = 92

function useTrimWidgetDeadZone() {
  useEffect(() => {
    let frame = 0
    const apply = () => {
      const el = document.getElementById('wc-chat-widget') as HTMLIFrameElement | null
      // The embed loads afterInteractive, so poll briefly until it exists.
      if (!el) {
        frame = window.setTimeout(apply, 250)
        return
      }
      el.style.height = `${COLLAPSED_H}px`
    }
    apply()

    const onMessage = (e: MessageEvent) => {
      // On close the embed resets height to 165px inside its own listener.
      // setTimeout(0) puts us after every synchronous handler, so we win.
      if (e.data === 'wc-chat-close') window.setTimeout(apply, 0)
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.clearTimeout(frame)
      window.removeEventListener('message', onMessage)
    }
  }, [])
}

export default function WhatsAppButton() {
  const pathname = usePathname()
  const [chatOpen, setChatOpen] = useState(false)
  const [hover, setHover] = useState(false)

  useTrimWidgetDeadZone()

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'wc-chat-open') setChatOpen(true)
      else if (e.data === 'wc-chat-close') setChatOpen(false)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Same rule as the chat widget: never over the simulated demo dashboard.
  if (pathname?.startsWith('/demo')) return null

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(PREFILL)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onClick={() => track('whatsapp_click', { location: 'float' })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        right: BUBBLE_RIGHT,
        bottom: BUBBLE_BOTTOM + BUBBLE_SIZE + GAP,
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #25d366 0%, #17a74a 100%)',
        color: '#fff',
        // One under the widget iframe, so an opened chat always wins the stack.
        zIndex: 2147483646,
        boxShadow: hover
          ? '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 6px rgba(37, 211, 102, 0.16)'
          : '0 8px 24px rgba(0, 0, 0, 0.35)',
        // Fades out instead of vanishing, so opening the chat does not flicker.
        opacity: chatOpen ? 0 : 1,
        visibility: chatOpen ? 'hidden' : 'visible',
        transform: hover && !chatOpen ? 'translateY(-2px)' : 'none',
        transition: 'opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        pointerEvents: chatOpen ? 'none' : 'auto',
      }}
    >
      <FaWhatsapp size={30} />
    </a>
  )
}
