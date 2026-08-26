/**
 * Quiet hours for outbound contact. Mirrored from the monorepo
 * (core/src/lib/quietHours.ts), which carries the unit tests. Keep in sync.
 *
 * This file guards the DIALER. PROXe placed a 4 minute outbound voice call at
 * 12:13 AM, because the callback route dials the moment a number arrives and
 * never looked at the clock. A call at midnight is not a worse version of a
 * message at midnight; it wakes a household.
 */

export interface QuietHours {
  start: number
  end: number
  tz: string
}

/** No outbound contact between 8 PM and 9 AM IST. */
export const DEFAULT_QUIET_HOURS: QuietHours = { start: 20, end: 9, tz: 'Asia/Kolkata' }

export function hourInTz(now: Date, tz: string): number {
  // Intl throws on an unknown zone. Fail open rather than take the route down,
  // and never let a bad zone parse as midnight (which would read as always quiet).
  try {
    const s = now.toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: tz })
    const h = Number(s.trim().slice(0, 2))
    return Number.isFinite(h) ? h % 24 : NaN
  } catch {
    return NaN
  }
}

export function isQuiet(now: Date, q: QuietHours = DEFAULT_QUIET_HOURS): boolean {
  const h = hourInTz(now, q.tz)
  if (!Number.isFinite(h)) return false
  if (q.start === q.end) return false
  return q.start > q.end ? h >= q.start || h < q.end : h >= q.start && h < q.end
}

/**
 * When sending may resume. Used to tell a visitor when we will actually ring,
 * so a deferred callback reads as a promise rather than a failure.
 */
export function nextOpenTime(now: Date, q: QuietHours = DEFAULT_QUIET_HOURS): Date {
  const d = new Date(now)
  // Step forward an hour at a time. Cheap, and it sidesteps every DST and
  // offset edge case that hand-rolled date arithmetic gets wrong.
  for (let i = 0; i < 48; i++) {
    if (!isQuiet(d, q)) return d
    d.setUTCHours(d.getUTCHours() + 1)
  }
  return d
}

/** Human phrasing for the wait, e.g. "9 AM". */
export function nextOpenLabel(now: Date, q: QuietHours = DEFAULT_QUIET_HOURS): string {
  try {
    return nextOpenTime(now, q).toLocaleTimeString('en-IN', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: q.tz,
    })
  } catch {
    return 'the morning'
  }
}
