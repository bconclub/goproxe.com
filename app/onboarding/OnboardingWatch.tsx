'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../styles/legal.module.css'
import o from './onboarding.module.css'
import { WatchPlayer } from '../components/watch/WatchPlayer'
import type { WatchEpisode } from '../lib/watch'

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const COUNTDOWN = 5
const DONE_KEY = 'proxe_onboarding_watched'

type Props = { episodes: WatchEpisode[]; onboardingUrl: string }

const STEPS = [
  { n: '1', title: 'Tell us about your business', text: 'Your website, what you sell, and how you like to talk to customers.' },
  { n: '2', title: 'Connect your channels', text: 'WhatsApp, your website chat, calls. PROXe answers on the numbers you already use.' },
  { n: '3', title: 'PROXe starts answering', text: 'Every new lead gets a reply in seconds, a score, and a slot on your calendar.' },
]

// Every video, one below the other. When one ends, an "Up next" countdown scrolls
// to the next video and plays it. Every CTA goes to the real PROXe onboarding.
export function OnboardingWatch({ episodes, onboardingUrl }: Props) {
  const [playing, setPlaying] = useState<string | null>(null) // slug told to autoplay
  const [upNext, setUpNext] = useState<{ from: string; left: number } | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [active, setActive] = useState<string | null>(null) // slug of the video playing now
  const [done, setDone] = useState<string[]>([]) // slugs watched to 90%, kept across visits

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(DONE_KEY) || '[]')) } catch {}
    // Whichever video starts playing, its section lights up.
    const onPlay = (e: Event) => { const id = (e.target as HTMLElement).closest('section')?.id; if (id) setActive(id) }
    document.addEventListener('play', onPlay, true)
    return () => document.removeEventListener('play', onPlay, true)
  }, [])

  const markDone = useCallback((slug: string) => {
    setDone((d) => {
      if (d.includes(slug)) return d
      const next = [...d, slug]
      try { localStorage.setItem(DONE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setUpNext(null) }
  useEffect(() => () => stop(), [])

  const play = useCallback((slug: string) => {
    stop()
    setPlaying(slug)
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Played straight from the click as well, so phones allow it and a second tap still starts it.
    document.getElementById(slug)?.querySelector('video')?.play().catch(() => {})
  }, [])

  const ended = useCallback((slug: string) => {
    const i = episodes.findIndex((e) => e.slug === slug)
    const next = episodes[i + 1]
    if (!next) return
    let left = COUNTDOWN
    setUpNext({ from: slug, left })
    timer.current = setInterval(() => {
      left -= 1
      if (left <= 0) play(next.slug)
      else setUpNext({ from: slug, left })
    }, 1000)
  }, [episodes, play])

  return (
    <div className={o.wrap}>
      <header className={o.hero}>
        <p className={styles.eyebrow}>Onboarding</p>
        <h1 className={styles.title}>Get started with <span className={styles.accent}>PROXe</span></h1>
        <p className={styles.lede}>Short videos of the real PROXe dashboard, one step at a time. Watch them, then set PROXe up on your own leads.</p>
        <div className={o.ctas}>
          <a href={onboardingUrl} className={o.primary}>Start onboarding →</a>
          {episodes[0] && <a href={`#${episodes[0].slug}`} className={o.secondary}>Watch first</a>}
        </div>
        {episodes.length > 1 && (
          <ol className={o.toc} aria-label="Videos on this page">
            {episodes.map((e, i) => (
              <li key={e.slug}><a href={`#${e.slug}`} data-done={done.includes(e.slug) || undefined} data-active={active === e.slug || undefined} onClick={(ev) => { ev.preventDefault(); play(e.slug) }}><span className={o.tocN}>{done.includes(e.slug) ? '✓' : i + 1}</span><span className={o.tocName}>{e.title}</span><span className={o.tocT}>{clock(e.duration)}</span></a></li>
            ))}
          </ol>
        )}
      </header>

      {episodes.map((ep, i) => {
        const next = episodes[i + 1]
        const counting = upNext?.from === ep.slug && next
        const isDone = done.includes(ep.slug)
        return (
          <section key={ep.slug} id={ep.slug} className={o.episode} data-active={active === ep.slug || undefined} data-done={isDone || undefined}>
            <h2 className={o.epTitle}>
              <span className={o.epN} aria-hidden="true">{isDone ? '✓' : i + 1}</span>
              <span className={o.epName}>{ep.title}</span>
              {isDone ? <span className={o.epDone}>Watched</span> : <span className={o.epT}>{clock(ep.duration)}</span>}
            </h2>
            <WatchPlayer
              src={ep.video} poster={ep.poster} captions={ep.captions} title={ep.title} chapters={ep.chapters}
              autoPlay={playing === ep.slug}
              onWatched={() => markDone(ep.slug)}
              onEnded={() => ended(ep.slug)}
              overlay={counting ? (
                <div className={o.upnext} role="status" aria-live="polite">
                  <p className={o.kicker}>Up next</p>
                  <p className={o.upTitle}>{next.title}</p>
                  <div className={o.ring} aria-label={`Playing in ${upNext!.left} seconds`}>{upNext!.left}</div>
                  <div className={o.ctas} style={{ justifyContent: 'center', marginTop: 16 }}>
                    <button type="button" className={o.primaryBtn} onClick={() => play(next.slug)}>Play now</button>
                    <button type="button" className={o.secondaryBtn} onClick={stop}>Stay here</button>
                  </div>
                </div>
              ) : null}
            />
            <details className={o.card}>
              <summary>
                <span className={o.dek}>{ep.dek || ep.promise}</span>
                <span className={o.more}>Details</span>
              </summary>
              {ep.intro.map((p) => <p key={p} className={o.copy}>{p}</p>)}
              {ep.shortVersion.length > 0 && <ul className={o.list}>{ep.shortVersion.map((p) => <li key={p}>{p}</li>)}</ul>}
              <p className={o.label}>Transcript</p>
              {ep.chapters.map((c) => <p key={c.t} className={o.line}><strong>{c.title}.</strong> {c.text}</p>)}
            </details>
          </section>
        )
      })}

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
