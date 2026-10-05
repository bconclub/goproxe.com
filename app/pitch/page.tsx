import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PitchDeck } from '../components/pitch/PitchDeck'
import { CORE_PITCH, EXTRAS_PITCH } from '../components/pitch/cards'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })

export const metadata: Metadata = {
  title: 'PROXe · The pitch',
  description: 'PROXe is AI for the customer side of your business. The problem, the product, the plan to the first 100 customers, and our pre-seed round.',
  alternates: { canonical: 'https://goproxe.com/pitch' },
  // The share card comes from ./opengraph-image.tsx and ./twitter-image.tsx.
  openGraph: { title: 'The PROXe pitch', description: 'PROXe is AI for the customer side of your business. The problem, the product, the traction and the pre-seed round, narrated in 10 languages.', url: 'https://goproxe.com/pitch', type: 'website', siteName: 'PROXe' },
  twitter: { card: 'summary_large_image', title: 'The PROXe pitch', description: 'PROXe is AI for the customer side of your business. The problem, the product, the traction and the pre-seed round, narrated in 10 languages.' },
}

// goproxe.com/pitch: the investor pitch, one card at a time, narrated.
export default function PitchPage() {
  return (
    <div className={inter.variable} style={{ fontFamily: 'var(--font-proxe-sans), system-ui, sans-serif' }}>
      <PitchDeck variant="page" only={CORE_PITCH} extras={EXTRAS_PITCH} />
    </div>
  )
}
