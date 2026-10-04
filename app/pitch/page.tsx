import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PitchDeck } from '../components/pitch/PitchDeck'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })

export const metadata: Metadata = {
  title: 'PROXe · The pitch',
  description: 'PROXe is your AI for the customer side of your business. The problem, the product, the plan to the first 100 customers, and our pre-seed round.',
  alternates: { canonical: 'https://goproxe.com/pitch' },
  openGraph: { images: ['https://goproxe.com/opengraph-image.jpg'] },
}

// goproxe.com/pitch: the investor pitch, one card at a time, narrated.
export default function PitchPage() {
  return (
    <div className={inter.variable} style={{ fontFamily: 'var(--font-proxe-sans), system-ui, sans-serif' }}>
      <PitchDeck variant="page" />
    </div>
  )
}
