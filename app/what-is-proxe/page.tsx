import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PitchDeck } from '../components/pitch/PitchDeck'
import { EXPLAINER_CARDS } from '../components/pitch/cards'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })

export const metadata: Metadata = {
  title: 'What is PROXe?',
  description: 'PROXe is your AI for the customer side of your business: it answers every lead in seconds, on every channel, follows up, and books the demo, the visit or the sale.',
  alternates: { canonical: 'https://goproxe.com/what-is-proxe' },
  // The share card comes from ./opengraph-image.tsx and ./twitter-image.tsx.
  openGraph: { title: 'What is PROXe?', description: 'Never miss a lead, ever again. PROXe answers every lead in seconds, on every channel, follows up, and books the demo, the visit or the sale.', url: 'https://goproxe.com/what-is-proxe', type: 'website', siteName: 'PROXe' },
  twitter: { card: 'summary_large_image', title: 'What is PROXe?', description: 'Never miss a lead, ever again. PROXe answers every lead in seconds, on every channel, follows up, and books the demo, the visit or the sale.' },
}

// goproxe.com/what-is-proxe: the pitch without the traction and the round,
// narrated, ending on the onboarding videos.
export default function WhatIsProxePage() {
  return (
    <div className={inter.variable} style={{ fontFamily: 'var(--font-proxe-sans), system-ui, sans-serif' }}>
      <PitchDeck variant="explainer" only={EXPLAINER_CARDS} />
    </div>
  )
}
