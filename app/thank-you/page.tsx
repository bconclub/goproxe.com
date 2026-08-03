import { Suspense } from 'react'
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import ThankYouContent from './ThankYouContent'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-sans',
})

const heading = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-heading',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-mono',
})

export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Your request is in. Pick a time and we’ll walk you through PROXe live.',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <div
      className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}
      data-proxe-theme="light"
    >
      {/* ThankYouContent reads ?checkout=success via useSearchParams, which
          must sit inside a Suspense boundary or the whole route opts out of
          static rendering (and the build errors). */}
      <Suspense fallback={null}>
        <ThankYouContent />
      </Suspense>
    </div>
  )
}
