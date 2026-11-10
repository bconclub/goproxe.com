import type { Metadata } from 'next'
import { headers } from 'next/headers'
import DeployConfigurator from './DeployConfigurator'
import { razorpayConfigured } from '../lib/razorpay'

/**
 * /deploy - the step that was missing between "Deploy PROXe" and a card form.
 *
 * A buyer configures seats and declares a GSTIN here, sees the exact total
 * including or excluding GST, and only then goes to the payment page. Nobody is
 * charged a number they have not already been shown.
 *
 * Which provider an INR checkout runs on decides the tax shown: with Razorpay's
 * keys set, /api/checkout uses Razorpay and 18% GST is always on top; without
 * them it uses Dodo and a GSTIN means reverse charge. Read here on the server
 * (this page is dynamic, it reads request headers) with the same
 * `razorpayConfigured()` the checkout route uses, so the two cannot disagree.
 */

export const metadata: Metadata = {
  title: 'Start with PROXe',
  description: 'Start PROXe with a clear monthly price before payment.',
  // A checkout configurator has nothing to offer a search engine and should not
  // compete with the pricing page for the same intent.
  robots: { index: false, follow: true },
}

/**
 * Market is guessed server-side from the CDN's country header so the first paint
 * already shows the right currency. The buyer can override it on the page, so a
 * wrong guess costs a click rather than the sale.
 */
async function detectMarketFromHeaders(): Promise<'inr' | 'usd'> {
  try {
    const h = await headers()
    const country = (
      h.get('x-vercel-ip-country') ||
      h.get('cf-ipcountry') ||
      h.get('x-country') ||
      ''
    ).toUpperCase()
    if (country && country !== 'IN') return 'usd'
    return 'inr'
  } catch {
    return 'inr'
  }
}

export default async function DeployPage() {
  const market = await detectMarketFromHeaders()
  return <DeployConfigurator initialMarket={market} inrGstAlways={razorpayConfigured()} />
}
