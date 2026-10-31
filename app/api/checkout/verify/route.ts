import { NextResponse } from 'next/server'
import { getDodoClient } from '../../../lib/dodo'

/**
 * The real state of a checkout, asked of Dodo rather than read from the URL.
 *
 * GET /api/checkout/verify?payment_id=pay_…&subscription_id=sub_…
 * → { state: 'paid' | 'processing' | 'failed' | 'unpaid' }
 *
 * The /thank-you page polls this. Static /buy links can't carry
 * redirect_immediately=false, so Dodo returns the buyer while a UPI request is
 * unconfirmed, and the status on the URL can't be trusted either way (31 Oct:
 * a buyer got "invalid QR code" and still landed on /thank-you).
 * Only state comes back, never the customer's details.
 */

export const runtime = 'nodejs'

function stateOf(status: string | null | undefined): 'paid' | 'processing' | 'failed' | 'unpaid' {
  if (status === 'succeeded') return 'paid'
  if (status === 'processing') return 'processing'
  if (status === 'failed' || status === 'cancelled') return 'failed'
  return 'unpaid'
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const paymentId = url.searchParams.get('payment_id')?.trim() || null
  const subscriptionId = url.searchParams.get('subscription_id')?.trim() || null
  const headers = { 'Cache-Control': 'no-store' }

  if (!paymentId?.startsWith('pay_') && !subscriptionId?.startsWith('sub_')) {
    return NextResponse.json({ error: 'id required' }, { status: 400, headers })
  }
  const client = getDodoClient()
  if (!client) return NextResponse.json({ error: 'not_configured' }, { status: 503, headers })

  try {
    if (paymentId?.startsWith('pay_')) {
      const payment = await client.payments.retrieve(paymentId)
      return NextResponse.json({ state: stateOf(payment.status) }, { headers })
    }
    const sub = await client.subscriptions.retrieve(subscriptionId!)
    if (sub.status === 'active') return NextResponse.json({ state: 'paid' }, { headers })
    const payments = await client.payments.list({ subscription_id: subscriptionId!, page_size: 1 })
    return NextResponse.json({ state: stateOf(payments.items?.[0]?.status) }, { headers })
  } catch (err) {
    console.error('[api/checkout/verify]', paymentId ?? subscriptionId, err)
    return NextResponse.json({ error: 'upstream_error' }, { status: 502, headers })
  }
}
