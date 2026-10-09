'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackHighIntent } from '../../lib/analytics'

/**
 * Pages only serious buyers open. Matching is by path prefix; the booking
 * calendar (a modal step, not a page) is tracked in DeployModal.
 */
const HIGH_INTENT_PAGES: Array<[prefix: string, page: string]> = [
  ['/pricing', 'pricing'],
  ['/dashboard-tour', 'dashboard_tour'],
  ['/compare/', 'compare'],
  ['/deploy', 'deploy'],
]

export default function HighIntentTracker() {
  const pathname = usePathname()
  useEffect(() => {
    const hit = HIGH_INTENT_PAGES.find(([prefix]) => pathname?.startsWith(prefix))
    if (hit) trackHighIntent(hit[1])
  }, [pathname])
  return null
}
