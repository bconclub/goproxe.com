'use client'

import Script from 'next/script'

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
 * `afterInteractive` keeps it off the critical path — the hero, video and voice
 * orb all get the main thread first.
 */
const WIDGET_SRC =
  process.env.NEXT_PUBLIC_PROXE_WIDGET_SRC || 'https://proxe.goproxe.com/api/widget/embed.js'

export default function ProxeWidget() {
  return <Script id="proxe-widget" src={WIDGET_SRC} strategy="afterInteractive" />
}
