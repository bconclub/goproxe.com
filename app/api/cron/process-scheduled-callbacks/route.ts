import { NextResponse } from 'next/server'
import { getPendingScheduledCallbacks, markScheduledCallbackProcessed, recordCallbackDial } from '../../../lib/leadsSupabase'
import { isQuiet } from '../../../lib/quietHours'
import { toE164India } from '@/app/lib/phoneE164'

/**
 * [DEV] Cron job to process scheduled callbacks.
 *
 * Runs every 15 minutes, finds leads with pending scheduled_callback_at
 * timestamps that are due, and dials them IF we are not currently in quiet
 * hours. If quiet hours have resumed (a rare edge case), the callback stays
 * pending and will be retried on the next cron run.
 *
 * SAFETY GATES:
 * - Never dials a callback that is still in the future (scheduled_for > now)
 * - Skips callbacks if we are currently in quiet hours
 * - Marks callbacks as 'failed' rather than retrying indefinitely
 * - Only dials callbacks with status 'pending'
 * - Does NOT replay old/expired callbacks unless explicitly enabled
 *
 * The cron secret guard prevents unauthorized triggering: only Vercel cron or
 * a caller with CRON_SECRET can invoke this.
 */

const API_KEY = process.env.ELEVENLABS_API_KEY
const AGENT_ID = process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra'
const PHONE_NUMBER_ID = process.env.ELEVENLABS_PHONE_NUMBER_ID || 'phnum_3701m0wakhjte0zr5fyk25yjpe01'
const CRON_SECRET = process.env.CRON_SECRET

/**
 * How old a scheduled callback can be before we skip it rather than dial.
 * Default 8 hours: a 9 AM callback processed at 5 PM the same day is fine,
 * but a 9 AM callback from yesterday is stale. Set to 0 to disable.
 */
const MAX_AGE_HOURS = 8

export async function GET(request: Request) {
  // Verify the cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization')
  const providedSecret = authHeader?.replace('Bearer ', '')
  
  if (CRON_SECRET && providedSecret !== CRON_SECRET) {
    console.error('[cron/scheduled-callbacks] unauthorized attempt')
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  if (!API_KEY) {
    console.error('[cron/scheduled-callbacks] ELEVENLABS_API_KEY not set')
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const now = new Date()
  
  // Safety: never dial during quiet hours, even if callbacks are pending
  if (isQuiet(now)) {
    console.log('[cron/scheduled-callbacks] skipped, currently quiet hours')
    return NextResponse.json({ ok: true, reason: 'quiet_hours', processed: 0 })
  }

  const pending = await getPendingScheduledCallbacks()
  console.log('[cron/scheduled-callbacks] found pending:', pending.length)

  if (pending.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 })
  }

  const results = { dialed: 0, skipped: 0, failed: 0 }

  for (const callback of pending) {
    try {
      // Skip callbacks that are too old (stale/expired)
      if (MAX_AGE_HOURS > 0) {
        const ageMs = now.getTime() - callback.scheduledFor.getTime()
        const ageHours = ageMs / (1000 * 60 * 60)
        if (ageHours > MAX_AGE_HOURS) {
          console.log('[cron/scheduled-callbacks] skipped stale callback', {
            leadId: callback.id,
            ageHours: ageHours.toFixed(1),
          })
          await markScheduledCallbackProcessed({ leadId: callback.id, status: 'failed' })
          await recordCallbackDial({
            phone: callback.phone,
            status: 'failed',
            reason: 'scheduled_callback_expired',
          })
          results.skipped++
          continue
        }
      }

      // Dial the callback - in E.164, never as typed. The 10-digit normalized
      // column wins when present; the raw phone is only a fallback. A number
      // that cannot be normalized is a failed callback, not a dial to whoever
      // "+" + digits happens to reach.
      const dialTo = toE164India(callback.phoneNormalized) ?? toE164India(callback.phone)
      if (!dialTo) {
        console.error('[cron/scheduled-callbacks] unroutable phone, not dialling', {
          leadId: callback.id, phone: callback.phone,
        })
        await markScheduledCallbackProcessed({ leadId: callback.id, status: 'failed' })
        await recordCallbackDial({ phone: callback.phone, status: 'failed', reason: 'bad_phone' })
        results.failed++
        continue
      }
      const res = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
        method: 'POST',
        headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: AGENT_ID,
          agent_phone_number_id: PHONE_NUMBER_ID,
          to_number: dialTo,
        }),
      })

      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        console.error('[cron/scheduled-callbacks] dial failed', {
          leadId: callback.id,
          status: res.status,
          detail: detail.slice(0, 200),
        })
        await markScheduledCallbackProcessed({ leadId: callback.id, status: 'failed' })
        await recordCallbackDial({
          phone: callback.phone,
          status: 'failed',
          reason: `scheduled_callback_http_${res.status}`,
        })
        results.failed++
        continue
      }

      const dialed = await res.json().catch(() => ({} as Record<string, unknown>))
      await markScheduledCallbackProcessed({ leadId: callback.id, status: 'dialed' })
      await recordCallbackDial({
        phone: callback.phone,
        status: 'dialing',
        conversationId: (dialed?.conversation_id as string) ?? null,
      })
      results.dialed++
      console.log('[cron/scheduled-callbacks] dialed', {
        leadId: callback.id,
        conversationId: dialed?.conversation_id,
      })
    } catch (err) {
      console.error('[cron/scheduled-callbacks] process threw', { leadId: callback.id, err })
      await markScheduledCallbackProcessed({ leadId: callback.id, status: 'failed' })
      await recordCallbackDial({
        phone: callback.phone,
        status: 'failed',
        reason: 'scheduled_callback_exception',
      })
      results.failed++
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
