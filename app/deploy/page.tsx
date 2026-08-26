import type { Metadata } from 'next'
import { headers } from 'next/headers'
import DeployConfigurator from './DeployConfigurator'

/**
 * /deploy - the step that was missing between "Deploy PROXe" and a card form.
 *
 * A buyer configures seats and declares a GSTIN here, sees the exact total
 * including or excluding GST, and only then goes to Dodo. Nobody is charged a
 * number they have not already been shown.
 */

export const metadata: Metadata = {
  title: 'Deploy PROXe - configure your plan',
  description:
    'Pick your team size, add your GSTIN if you have one, and see exactly what you pay before anything is charged.',
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
  return <DeployConfigurator initialMarket={market} />
}
