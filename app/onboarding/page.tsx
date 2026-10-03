import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import styles from '../styles/legal.module.css'
import { WATCH_EPISODES } from '../lib/watch'
import { OnboardingWatch } from './OnboardingWatch'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

// The real onboarding (add your website, connect channels) lives on the PROXe app.
const PROXE_ONBOARDING_URL = 'https://proxe.goproxe.com/onboarding'

export const metadata: Metadata = {
  title: 'Get started with PROXe',
  description: 'Short videos of the real PROXe dashboard, then start onboarding: add your website and PROXe starts answering your leads.',
  alternates: { canonical: 'https://goproxe.com/onboarding' },
  openGraph: { images: ['https://goproxe.com/watch/watch-what-is-proxe.jpg'] },
}

// /onboarding: watch how PROXe works, then start the real onboarding.
// (It used to redirect straight to the app; every CTA here still goes there.)
export default function OnboardingPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <OnboardingWatch episodes={WATCH_EPISODES} onboardingUrl={PROXE_ONBOARDING_URL} />
      </main>
    </div>
  )
}
