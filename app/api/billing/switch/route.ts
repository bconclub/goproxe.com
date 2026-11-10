import { NextResponse } from 'next/server'
import { getDodoClient } from '../../../lib/dodo'
import { razorpayConfigured } from '../../../lib/razorpay'
import { buildOffer, createSwitch, findSwitch, isSwitched } from '../../../lib/billing/switch'

/**
 * POST /api/billing/switch  { subscription_id: <Dodo id>, brand? }
 *
 * Called server-to-server by a PROXe dashboard when its owner clicks "approve
 * the new payment". Returns the Razorpay page where they approve the mandate.
 * Same trust model as /api/billing/status: the subscription id is the handle.
 * Idempotent: a second click returns the same waiting link.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { subscription_id?: string; brand?: string } | null
  const subscriptionId = body?.subscription_id?.trim()
  if (!subscriptionId?.startsWith('sub_')) {
    return NextResponse.json({ ok: false, reason: 'subscription_id required' }, { status: 400 })
  }
  const client = getDodoClient()
  if (!client || !razorpayConfigured()) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  try {
    const sub = await client.subscriptions.retrieve(subscriptionId)
    const existing = await findSwitch(subscriptionId, true)
    if (isSwitched(existing)) {
      return NextResponse.json({ ok: true, switched: true, subscriptionId: existing!.id, checkoutUrl: null })
    }
    const offer = buildOffer(sub, String(sub.status) === 'on_hold', existing)
    if (!offer) return NextResponse.json({ ok: false, reason: 'not_eligible' }, { status: 409 })

    const rzp = existing ?? (await createSwitch(sub, offer, body?.brand?.trim().slice(0, 40) || null))
    if (!rzp.short_url) return NextResponse.json({ ok: false, reason: 'no_checkout_url' }, { status: 502 })
    return NextResponse.json({
      ok: true,
      switched: false,
      subscriptionId: rzp.id,
      checkoutUrl: rzp.short_url,
      startAt: offer.start_at,
      totalMinor: offer.total_minor,
    })
  } catch (err) {
    const e = err as { status?: number; code?: string | null; message?: string }
    if (e?.status === 404) return NextResponse.json({ ok: false, reason: 'not_found' }, { status: 404 })
    console.error('[api/billing/switch]', subscriptionId, e?.status, e?.code, e?.message)
    return NextResponse.json({ ok: false, reason: 'switch_failed' }, { status: 502 })
  }
}
