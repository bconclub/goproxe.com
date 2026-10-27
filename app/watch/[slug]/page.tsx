import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import styles from '../../styles/legal.module.css'
import o from '../../dashboard-tour/tour.module.css'
import '../../styles/landing.css'
import IndustryHeader from '../../components/industry/IndustryHeader'
import { WatchPlayer } from '../../components/watch/WatchPlayer'
import { clock, findEpisode, shortSlug, watchEpisodes } from '../links'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const dynamicParams = false
export function generateStaticParams() {
  // Both spellings: /watch/what-is-proxe (the one to print) and /watch/watch-what-is-proxe.
  return watchEpisodes().flatMap((e) => [{ slug: shortSlug(e) }, { slug: e.slug }])
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ep = findEpisode((await params).slug)
  if (!ep) return {}
  const url = `https://goproxe.com/watch/${shortSlug(ep)}`
  return {
    title: `${ep.title} · PROXe in 60 seconds`,
    description: ep.dek,
    alternates: { canonical: url },
    openGraph: { title: ep.title, description: ep.dek, url, type: 'video.other', images: [`https://goproxe.com${ep.poster}`], videos: [`https://goproxe.com${ep.video}`] },
    twitter: { card: 'summary_large_image', title: ep.title, description: ep.dek, images: [`https://goproxe.com${ep.poster}`] },
  }
}

// One video on its own page: the link that goes in PDFs and messages.
export default async function WatchEpisodePage({ params }: Params) {
  const { slug } = await params
  const ep = findEpisode(slug)
  if (!ep) notFound()
  if (slug !== shortSlug(ep)) permanentRedirect(`/watch/${shortSlug(ep)}`)
  const others = watchEpisodes().filter((e) => e.slug !== ep.slug)
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <IndustryHeader slug="watch" />
      <main className={styles.page}>
        <div className={o.wrap}>
          <header className={o.hero}>
            <p className={o.kicker}>PROXe in 60 seconds</p>
            <h1 className={styles.title}>{ep.title}</h1>
            <p className={styles.lede}>{ep.dek}</p>
          </header>
          <section className={o.episode}>
            <WatchPlayer src={ep.video} poster={ep.poster} captions={ep.captions} title={ep.title} chapters={ep.chapters} />
          </section>
          {ep.shortVersion?.length > 0 && (
            <ul style={{ marginTop: 28, paddingLeft: 20, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' }}>
              {ep.shortVersion.map((line) => <li key={line}>{line}</li>)}
            </ul>
          )}
          <div className={o.ctas}>
            <a className={o.primary} href="https://proxe.goproxe.com/onboarding">Set PROXe up on my business</a>
            <a className={o.secondary} href="/watch">All videos</a>
          </div>
          {others.length > 0 && (
            <>
              <p className={o.kicker} style={{ marginTop: 48 }}>More videos</p>
              <ol className={o.toc}>
                {others.map((e, i) => (
                  <li key={e.slug}>
                    <a href={`/watch/${shortSlug(e)}`}>
                      <span className={o.tocN}>{i + 1}</span>
                      <span className={o.tocName}>{e.title}</span>
                      <span className={o.tocT}>{clock(e.duration)}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
