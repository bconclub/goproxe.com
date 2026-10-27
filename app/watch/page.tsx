import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import styles from '../styles/legal.module.css'
import o from '../dashboard-tour/tour.module.css'
import '../styles/landing.css'
import IndustryHeader from '../components/industry/IndustryHeader'
import { clock, shortSlug, watchEpisodes } from './links'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'PROXe in 60 seconds',
  description: 'Short videos of the real PROXe dashboard, one per question an owner asks.',
  alternates: { canonical: 'https://goproxe.com/watch' },
  openGraph: { images: ['https://goproxe.com/watch/watch-what-is-proxe.jpg'] },
}

// goproxe.com/watch: every video, each linking to its own permanent page.
export default function WatchIndexPage() {
  const eps = watchEpisodes()
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <IndustryHeader slug="watch" />
      <main className={styles.page}>
        <div className={o.wrap}>
          <header className={o.hero}>
            <p className={o.kicker}>PROXe in 60 seconds</p>
            <h1 className={styles.title}>See PROXe at work</h1>
            <p className={styles.lede}>Short videos of the real dashboard, one per question an owner asks.</p>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18, marginTop: 32 }}>
            {eps.map((e) => (
              <a key={e.slug} href={`/watch/${shortSlug(e)}`} style={{ display: 'block', textDecoration: 'none', color: '#fff', borderRadius: 14, overflow: 'hidden', background: 'rgba(20,13,48,0.55)', border: '1px solid rgba(196,181,253,0.25)' }}>
                <img src={e.poster} alt="" loading="lazy" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
                <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '12px 14px', fontWeight: 600 }}>
                  <span>{e.title}</span>
                  <span style={{ fontWeight: 400, color: '#c4b5fd', fontSize: 13 }}>{clock(e.duration)}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
