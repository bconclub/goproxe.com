'use client'

import { useEffect, useState } from 'react'
import styles from '../styles/legal.module.css'
import o from './onboarding.module.css'
import { WatchPlayer } from '../components/watch/WatchPlayer'
import type { WatchEpisode } from '../lib/watch'

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

type Props = { episodes: WatchEpisode[]; onboardingUrl: string }

const STEPS = [
  { n: '1', title: 'Tell us about your business', text: 'Your website, what you sell, and how you like to talk to customers.' },
  { n: '2', title: 'Connect your channels', text: 'WhatsApp, your website chat, calls. PROXe answers on the numbers you already use.' },
  { n: '3', title: 'PROXe starts answering', text: 'Every new lead gets a reply in seconds, a score, and a slot on your calendar.' },
]

export function OnboardingWatch({ episodes, onboardingUrl }: Props) {
  const [active, setActive] = useState(episodes[0]?.slug)

  // Deep links: /onboarding#watch-who-to-call-first opens that video.
  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.slice(1)
      if (episodes.some((e) => e.slug === slug)) setActive(slug)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [episodes])

  const ep = episodes.find((e) => e.slug === active) || episodes[0]
  const idx = episodes.findIndex((e) => e.slug === ep?.slug)
  const next = episodes[idx + 1]
  const pick = (slug: string) => {
    setActive(slug)
    history.replaceState(null, '', `#${slug}`)
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={o.wrap}>
      <header className={o.hero}>
        <p className={styles.eyebrow}>Onboarding</p>
        <h1 className={styles.title}>Get started with <span className={styles.accent}>PROXe</span></h1>
        <p className={styles.lede}>Watch how it works in a few short videos. Then set it up on your own leads.</p>
        <div className={o.ctas}>
          <a href={onboardingUrl} className={o.primary}>Start onboarding →</a>
          <a href="#player" className={o.secondary}>Watch first</a>
        </div>
      </header>

      {ep && (
        <section id="player" className={o.stage}>
          <div className={o.main}>
            <p className={o.kicker}>{idx === 0 ? 'Start here · ' : ''}{idx + 1} of {episodes.length} · {clock(ep.duration)}</p>
            <h2 className={o.epTitle}>{ep.title}</h2>
            <WatchPlayer key={ep.slug} src={ep.video} poster={ep.poster} captions={ep.captions} title={ep.title} chapters={ep.chapters} />
            {ep.intro.map((p) => <p key={p} className={o.copy}>{p}</p>)}
            {ep.shortVersion.length > 0 && (
              <>
                <h3 className={o.h3}>The short version</h3>
                <ul className={o.list}>{ep.shortVersion.map((p) => <li key={p}>{p}</li>)}</ul>
              </>
            )}
            <details className={o.transcript}>
              <summary>Transcript</summary>
              {ep.chapters.map((c) => <p key={c.t}><strong>{c.title}.</strong> {c.text}</p>)}
            </details>
            <div className={o.after}>
              {next ? (
                <button type="button" className={o.nextBtn} onClick={() => pick(next.slug)}>Next: {next.title} ({clock(next.duration)}) →</button>
              ) : (
                <a href={onboardingUrl} className={o.primary}>You have seen it all. Start onboarding →</a>
              )}
            </div>
          </div>

          <aside className={o.side} aria-label="All videos">
            <p className={o.kicker}>All videos</p>
            <ol className={o.playlist}>
              {episodes.map((e, i) => (
                <li key={e.slug}>
                  <button type="button" onClick={() => pick(e.slug)} className={`${o.item} ${e.slug === ep.slug ? o.on : ''}`} aria-current={e.slug === ep.slug ? 'true' : undefined}>
                    <img src={e.poster} alt="" className={o.thumb} loading="lazy" />
                    <span>
                      <span className={o.itemMeta}>{i + 1} · {clock(e.duration)}</span>
                      <span className={o.itemTitle}>{e.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </section>
      )}

      <section className={o.steps}>
        <p className={styles.eyebrow}>Go live</p>
        <h2 className={o.stepsTitle}>Three steps, and PROXe is answering your leads</h2>
        <ol className={o.stepList}>
          {STEPS.map((s) => (
            <li key={s.n} className={o.step}>
              <span className={o.stepN}>{s.n}</span>
              <span><span className={o.stepTitle}>{s.title}</span><span className={o.stepText}>{s.text}</span></span>
            </li>
          ))}
        </ol>
        <div className={o.ctas} style={{ justifyContent: 'center' }}>
          <a href={onboardingUrl} className={o.primary}>Start onboarding →</a>
          <a href="/" className={o.secondary}>Talk to PROXe first</a>
        </div>
      </section>
    </div>
  )
}
