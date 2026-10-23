import { NextResponse } from 'next/server'
import { getDodoClient, getSiteUrl } from '../../lib/dodo'

/**
 * A payment link that never expires, for one specific subscription.
 *
 * GET /pay/sub_…  → 302 to a fresh Dodo page for that subscription.
 *
 * Dodo's own recovery links (update-payment-method, customer portal) die 15-20
 * minutes after they are minted, so one pasted into WhatsApp is dead by the time
 * the client opens it (seen 23 Oct with Ahoy + Lokazen, both on_hold after a
 * failed first renewal). This mints the Dodo link at the moment it is opened.
 *
 * - on_hold / past_due / active → update-payment-method on THE SAME subscription:
 *   Dodo charges any dues and reactivates it, no new subscription.
 * - anything else (pending, failed, cancelled, expired) has nothing to update,
 *   so it falls through to /api/checkout/resume: a fresh checkout for the same
 *   customer and plan.
 *
 * The subscription id is the only key, same as /api/checkout/resume: ids are
 * random and never published, and the worst an outsider can do is pay for
 * someone else's plan.
 */

export const runtime = 'nodejs'

const UPDATABLE = new Set(['on_hold', 'past_due', 'active'])

/**
 * Dodo answers 409 "a payment for this subscription started a moment ago" to a
 * second update-payment-method within about a minute. WhatsApp, iMessage and
 * Slack fetch a pasted link for its preview before the client taps it, so
 * without these two guards the real tap would always land on that 409:
 * - preview bots get a plain page and never mint;
 * - a minted link is reused for 90 seconds only, just past that 409 window:
 *   Dodo's page shows a 15-minute countdown from the mint, and a longer reuse
 *   handed later openers a link with most of its time gone.
 */
const PREVIEW_BOT = /whatsapp|facebookexternalhit|facebot|twitterbot|slackbot|telegrambot|discordbot|linkedinbot|skypeuripreview|googlebot|bingbot|embedly|preview/i
const REUSE_MS = 90 * 1000
const minted = new Map<string, { link: string; at: number }>()

function previewPage() {
  return new NextResponse(
    '<!doctype html><html><head><meta charset="utf-8"><title>PROXe payment</title>' +
      '<meta property="og:title" content="PROXe payment"><meta property="og:description" content="Complete your PROXe subscription payment securely.">' +
      '<meta name="robots" content="noindex"></head><body>PROXe payment</body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' } }
  )
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const url = new URL(request.url)
  const siteUrl = getSiteUrl(url.origin)
  const fallback = NextResponse.redirect(`${siteUrl}/#pricing`, 302)

  const { id } = await params
  const subscriptionId = id?.trim()
  if (!subscriptionId?.startsWith('sub_')) return fallback
  if (PREVIEW_BOT.test(request.headers.get('user-agent') ?? '')) return previewPage()

  const cached = minted.get(subscriptionId)
  if (cached && Date.now() - cached.at < REUSE_MS) {
    return NextResponse.redirect(cached.link, 302)
  }

  const client = getDodoClient()
  if (!client) return fallback

  try {
    const sub = await client.subscriptions.retrieve(subscriptionId)

    if (!UPDATABLE.has(sub.status)) {
      return NextResponse.redirect(
        `${siteUrl}/api/checkout/resume?subscription_id=${encodeURIComponent(subscriptionId)}`,
        302
      )
    }

    const mint = () =>
      client.subscriptions.updatePaymentMethod(subscriptionId, {
        payment_method: { type: 'new', return_url: `${siteUrl}/thank-you?checkout=success` },
      })
    // A 409 with nothing cached (a restart, or a link minted elsewhere) clears
    // within about a minute: wait it out once rather than bounce the client.
    const res = await mint().catch(async (err) => {
      if ((err as { status?: number })?.status !== 409) throw err
      await new Promise((r) => setTimeout(r, 45_000))
      return mint()
    })
    if (!res.payment_link) return fallback
    minted.set(subscriptionId, { link: res.payment_link, at: Date.now() })
    return NextResponse.redirect(res.payment_link, 302)
  } catch (err) {
    console.error('[pay] could not mint a payment link', subscriptionId, err)
    return fallback
  }
}
