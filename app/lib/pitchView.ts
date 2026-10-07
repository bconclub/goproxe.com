/**
 * Per-visit depth tracking for the deck (/what-is-proxe, /pitch, and any page
 * opened with ?for=<name>). Sends running snapshots to /api/pitch-view, which
 * keeps the furthest point each visit reached. See that route for the why.
 */

export type PitchSnapshot = {
  seconds: number
  maxCard: number
  totalCards: number
  cardsSeen: string[]
  extrasOpened: string[]
  completed: boolean
  narration: boolean
  lang: string
}

const isLocal = () => typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)

/** ?for=zensquare on a link we send. Kept for the tab, so the full-screen deck keeps it too. */
export function pitchRecipient(): string {
  try {
    const q = new URLSearchParams(location.search).get('for')
    const v = (q ?? sessionStorage.getItem('pitch_for') ?? '').trim().toLowerCase().replace(/[^a-z0-9 _.-]/g, '').slice(0, 60)
    if (q && v) sessionStorage.setItem('pitch_for', v)
    return v
  } catch {
    return ''
  }
}

/** Track /what-is-proxe and /pitch always; anything else only when it came from a link we sent. */
export function shouldTrackPitch(): boolean {
  if (typeof location === 'undefined' || isLocal()) return false
  return /^\/(what-is-proxe|pitch)\/?$/.test(location.pathname) || !!pitchRecipient()
}

let sessionId = ''
function sid(): string {
  if (sessionId) return sessionId
  sessionId = (crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`)
  return sessionId
}

export function sendPitchSnapshot(s: PitchSnapshot, final = false): void {
  if (!shouldTrackPitch()) return
  const recipient = pitchRecipient()
  const body = JSON.stringify({
    ...s,
    sessionId: sid(),
    page: location.pathname,
    recipient,
    device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    referrer: document.referrer.slice(0, 200),
  })
  try {
    if (final && navigator.sendBeacon) { navigator.sendBeacon('/api/pitch-view', body); return }
    void fetch('/api/pitch-view', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
  } catch { /* tracking never breaks the deck */ }
  // Clarity: tag the recording so it can be found by who it was sent to.
  try {
    const w = window as unknown as { clarity?: (...a: unknown[]) => void }
    if (recipient) w.clarity?.('set', 'pitch_for', recipient)
  } catch { /* ignore */ }
}
