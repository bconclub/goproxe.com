import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import styles from '../styles/legal.module.css'
import '../styles/landing.css'
import IndustryHeader from '../components/industry/IndustryHeader'
import { WATCH_EPISODES } from '../lib/watch'
import { DashboardTour } from './DashboardTour'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

// The real onboarding (add your website, connect channels) lives on the PROXe app.
const PROXE_ONBOARDING_URL = 'https://proxe.goproxe.com/onboarding'

export const metadata: Metadata = {
  title: 'PROXe dashboard tour',
  description: 'Short videos of the real PROXe dashboard: where leads land, who to call first, every conversation, and who is coming in this week.',
  alternates: { canonical: 'https://goproxe.com/dashboard-tour' },
  openGraph: { images: ['https://goproxe.com/watch/watch-what-is-proxe.jpg'] },
}

// /dashboard-tour: short videos of the real dashboard. Its CTAs go to the real
// onboarding on the PROXe app (goproxe.com/onboarding redirects there too).
export default function DashboardTourPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      {/* The homepage header: WhatsApp + Deploy PROXe on this page too. */}
      <IndustryHeader slug="dashboard_tour" />
      <main className={styles.page}>
        <DashboardTour episodes={WATCH_EPISODES} onboardingUrl={PROXE_ONBOARDING_URL} />
      </main>
    </div>
  )
}
