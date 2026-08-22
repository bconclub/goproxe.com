'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * Live PROXe chat widget — the product running on its own website.
 *
 * Loads the embed from the PROXe platform (proxe.goproxe.com), which injects
 * an iframe pointing at that deployment's /widget/bubble. The script resolves
 * its own base URL from its src, so it works cross-origin without config.
 *
 * This is the REAL agent, distinct from the scripted ChannelDemo further down
 * the page: the demo shows what PROXe does, this one actually does it and
 * writes conversations into the dashboard.
 *
 * `lazyOnload` defers it until after full page load to not compete with LCP.
 */
const WIDGET_SRC =
  process.env.NEXT_PUBLIC_PROXE_WIDGET_SRC || 'https://proxe.goproxe.com/api/widget/embed.js'

/**
 * The embed pins its collapsed iframe at 165px tall, but the bubble inside
 * only fills the bottom 80px (24px offset + 56px button). The remaining ~85px
 * is transparent iframe that still swallows every click over it, so page
 * content in that corner silently stops responding to the mouse. Trim the
 * collapsed box to just clear the bubble; the widget expands it again on open.
 *
 * 92px = the bubble's 80px plus 12px of headroom for its shadow.
 */
const COLLAPSED_H = 92

function useTrimWidgetDeadZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let timer = 0
    const apply = () => {
      const el = document.getElementById('wc-chat-widget') as HTMLIFrameElement | null
      // The embed loads afterInteractive, so poll briefly until it exists.
      if (!el) {
        timer = window.setTimeout(apply, 250)
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
      window.clearTimeout(timer)
      window.removeEventListener('message', onMessage)
    }
  }, [enabled])
}

export default function ProxeWidget() {
  // Never on the demo dashboard: the real bubble floating over a simulated
  // dashboard is confusing, and every message typed into it writes a REAL
  // conversation into the platform.
  const pathname = usePathname()
  const enabled = !pathname?.startsWith('/demo')
  useTrimWidgetDeadZone(enabled)
  if (!enabled) return null
  // Defer widget load until the browser is idle to avoid blocking LCP
  return <Script id="proxe-widget" src={WIDGET_SRC} strategy="lazyOnload" />
}
