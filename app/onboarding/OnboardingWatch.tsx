'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../styles/legal.module.css'
import o from './onboarding.module.css'
import { WatchPlayer } from '../components/watch/WatchPlayer'
import type { WatchEpisode } from '../lib/watch'
import { track, trackLead } from '../lib/analytics'
import { submitLead } from '../lib/leads'

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const COUNTDOWN = 5
const DONE_KEY = 'proxe_onboarding_watched'
const VIEWER_KEY = 'proxe_onboarding_viewer'
const SECS_KEY = 'proxe_onboarding_secs'
// Free viewing, summed across every video, before we ask for a name and number.
const FREE_SECONDS = 60
const MILESTONES = [25, 50, 75, 90]

type Props = { episodes: WatchEpisode[]; onboardingUrl: string }
type Viewer = { name: string; phone: string }

const STEPS = [
  { n: '1', title: 'Tell us about your business', text: 'Your website, what you sell, and how you like to talk to customers.' },
  { n: '2', title: 'Connect your channels', text: 'WhatsApp, your website chat, calls. PROXe answers on the numbers you already use.' },
  { n: '3', title: 'PROXe starts answering', text: 'Every new lead gets a reply in seconds, a score, and a slot on your calendar.' },
]

const read = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
const write = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

const leaveFullscreen = () => {
  const d = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void }
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  else if (d.webkitFullscreenElement) d.webkitExitFullscreen?.()
  document.querySelectorAll('video').forEach((v) => {
    const iv = v as HTMLVideoElement & { webkitDisplayingFullscreen?: boolean; webkitExitFullscreen?: () => void }
    if (iv.webkitDisplayingFullscreen) iv.webkitExitFullscreen?.()
  })
}

// Every video, one below the other. When one ends, an "Up next" countdown scrolls
// to the next video and plays it. After a minute of watching, a name and mobile
// number (saved as a PROXe lead) unlock everything. Every CTA goes to the real
// PROXe onboarding.
export function OnboardingWatch({ episodes, onboardingUrl }: Props) {
  const [playing, setPlaying] = useState<string | null>(null) // slug told to autoplay
  const [upNext, setUpNext] = useState<{ from: string; left: number } | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [active, setActive] = useState<string | null>(null) // slug of the video playing now
  const [done, setDone] = useState<string[]>([]) // slugs watched to 90%, kept across visits
  const [viewer, setViewer] = useState<Viewer | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [gate, setGate] = useState<string | null>(null) // slug the login gate is drawn over

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setUpNext(null) }
  useEffect(() => () => stop(), [])

  const indexOf = useCallback((slug: string) => episodes.findIndex((e) => e.slug === slug) + 1, [episodes])

  const gateShown = useRef(new Set<string>())
  const openGate = useCallback((slug: string, watchedS: number) => {
    stop()
    leaveFullscreen()
    setGate(slug)
    if (!gateShown.current.has(slug)) {
      gateShown.current.add(slug)
      track('onboarding_gate_shown', { video: slug, watched_s: Math.round(watchedS) })
    }
  }, [])

  // One listener layer for every video on the page: analytics, the watched-time
  // count behind the gate, and which section is lit.
  useEffect(() => {
    setDone(read<string[]>(DONE_KEY, []))
    const saved = read<Viewer | null>(VIEWER_KEY, null)
    if (saved?.phone) { viewerRef.current = saved; setViewer(saved) }
    let secs = read<number>(SECS_KEY, 0)
    const started = new Set<string>()
    const hit = new Map<string, Set<number>>()
    const last = new WeakMap<HTMLVideoElement, number>()
    const locked = () => !viewerRef.current && secs >= FREE_SECONDS

    const slugOf = (e: Event) => {
      const v = e.target
      if (!(v instanceof HTMLVideoElement)) return null
      const id = v.closest('section')?.id
      return id ? { v, id } : null
    }

    const onPlay = (e: Event) => {
      const s = slugOf(e); if (!s) return
      setActive(s.id)
      // autoPlay has done its job once playback starts; left on, any re-render would replay it.
      setPlaying((p) => (p === s.id ? null : p))
      if (locked()) { s.v.pause(); openGate(s.id, secs); return }
      if (!started.has(s.id)) { started.add(s.id); track('onboarding_video_start', { video: s.id, index: indexOf(s.id) }) }
    }
    const onTime = (e: Event) => {
      const s = slugOf(e); if (!s) return
      const { v, id } = s
      const prev = last.get(v) ?? v.currentTime
      last.set(v, v.currentTime)
      const delta = v.currentTime - prev
      // Only real playback counts: a seek jumps by more than a tick.
      if (!v.paused && !v.seeking && delta > 0 && delta < 1.5) {
        const before = Math.floor(secs)
        secs += delta
        if (Math.floor(secs) !== before) write(SECS_KEY, Math.round(secs))
      }
      if (v.duration) {
        const pct = (v.currentTime / v.duration) * 100
        const seen = hit.get(id) ?? new Set<number>()
        hit.set(id, seen)
        for (const m of MILESTONES) if (pct >= m && !seen.has(m)) { seen.add(m); track('onboarding_video_progress', { video: id, percent: m }) }
      }
      if (!v.paused && locked()) { v.pause(); openGate(id, secs) }
    }
    const onSeeked = (e: Event) => { const s = slugOf(e); if (s) last.set(s.v, s.v.currentTime) }
    const onEnded = (e: Event) => { const s = slugOf(e); if (s) track('onboarding_video_complete', { video: s.id, index: indexOf(s.id) }) }
    const onFs = () => {
      const d = document as Document & { webkitFullscreenElement?: Element }
      const el = document.fullscreenElement || d.webkitFullscreenElement
      const id = el?.closest('section')?.id
      if (id) track('onboarding_fullscreen', { video: id })
    }

    document.addEventListener('play', onPlay, true)
    document.addEventListener('timeupdate', onTime, true)
    document.addEventListener('seeked', onSeeked, true)
    document.addEventListener('ended', onEnded, true)
    document.addEventListener('fullscreenchange', onFs)
    document.addEventListener('webkitfullscreenchange', onFs)
    return () => {
      document.removeEventListener('play', onPlay, true)
      document.removeEventListener('timeupdate', onTime, true)
      document.removeEventListener('seeked', onSeeked, true)
      document.removeEventListener('ended', onEnded, true)
      document.removeEventListener('fullscreenchange', onFs)
      document.removeEventListener('webkitfullscreenchange', onFs)
    }
  }, [indexOf, openGate])

  const markDone = useCallback((slug: string) => {
    setDone((d) => {
      if (d.includes(slug)) return d
      const next = [...d, slug]
      write(DONE_KEY, next)
      return next
    })
  }, [])

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
      if (left <= 0) { track('onboarding_autoplay_next', { from: slug, to: next.slug, how: 'countdown' }); play(next.slug) }
      else setUpNext({ from: slug, left })
    }, 1000)
  }, [episodes, play])

  const unlocked = (slug: string, v: Viewer) => {
    viewerRef.current = v
    setViewer(v)
    write(VIEWER_KEY, v)
    setGate(null)
    track('onboarding_gate_submit', { video: slug })
    document.getElementById(slug)?.querySelector('video')?.play().catch(() => {})
  }

  const cta = (label: string, location: string) => () => track('onboarding_cta_click', { label, location })

  return (
    <div className={o.wrap}>
      <header className={o.hero}>
        <p className={styles.eyebrow}>Onboarding</p>
        <h1 className={styles.title}>Get started with <span className={styles.accent}>PROXe</span></h1>
        <p className={styles.lede}>Short videos of the real PROXe dashboard, one step at a time. Watch them, then set PROXe up on your own leads.</p>
        <div className={o.ctas}>
          <a href={onboardingUrl} className={o.primary} onClick={cta('start_onboarding', 'hero')}>Start onboarding →</a>
          {episodes[0] && <a href={`#${episodes[0].slug}`} className={o.secondary} onClick={cta('watch_first', 'hero')}>Watch first</a>}
        </div>
        {episodes.length > 1 && (
          <ol className={o.toc} aria-label="Videos on this page">
            {episodes.map((e, i) => (
              <li key={e.slug}><a href={`#${e.slug}`} data-done={done.includes(e.slug) || undefined} data-active={active === e.slug || undefined} onClick={(ev) => { ev.preventDefault(); track('onboarding_cta_click', { label: e.slug, location: 'contents' }); play(e.slug) }}><span className={o.tocN}>{done.includes(e.slug) ? '✓' : i + 1}</span><span className={o.tocName}>{e.title}</span><span className={o.tocT}>{clock(e.duration)}</span></a></li>
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
              onChapter={(chapter) => track('onboarding_chapter_jump', { video: ep.slug, chapter })}
              overlay={gate === ep.slug && !viewer ? (
                <GateForm
                  slug={ep.slug}
                  onUnlocked={(v) => unlocked(ep.slug, v)}
                  onClose={() => { setGate(null); track('onboarding_gate_dismiss', { video: ep.slug }) }}
                />
              ) : counting ? (
                <div className={o.upnext} role="status" aria-live="polite">
                  <p className={o.kicker}>Up next</p>
                  <p className={o.upTitle}>{next.title}</p>
                  <div className={o.ring} aria-label={`Playing in ${upNext!.left} seconds`}>{upNext!.left}</div>
                  <div className={o.ctas} style={{ justifyContent: 'center', marginTop: 16 }}>
                    <button type="button" className={o.primaryBtn} onClick={() => { track('onboarding_autoplay_next', { from: ep.slug, to: next.slug, how: 'button' }); play(next.slug) }}>Play now</button>
                    <button type="button" className={o.secondaryBtn} onClick={() => { track('onboarding_upnext_cancel', { video: ep.slug }); stop() }}>Stay here</button>
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
          <a href={onboardingUrl} className={o.primary} onClick={cta('start_onboarding', 'go_live')}>Start onboarding →</a>
          <a href="/" className={o.secondary} onClick={cta('talk_to_proxe', 'go_live')}>Talk to PROXe first</a>
        </div>
      </section>
    </div>
  )
}

// Name + mobile, saved as a PROXe lead. Unlocks every video in this browser.
function GateForm({ slug, onUnlocked, onClose }: { slug: string; onUnlocked: (v: Viewer) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const digits = phone.replace(/\D/g, '').slice(-10)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError('Please enter your name.')
    if (digits.length < 10) return setError('Please enter a 10-digit mobile number.')
    setBusy(true); setError('')
    const eventId = trackLead({ source: 'onboarding_videos' })
    await submitLead({ type: 'lead', name: name.trim(), phone: digits, source: 'onboarding-videos', eventId })
    // Unlock even if saving the lead failed: a network hiccup must not lock someone out.
    onUnlocked({ name: name.trim(), phone: digits })
  }

  return (
    <form className={o.gate} onSubmit={submit} aria-labelledby={`${slug}-gate`}>
      <p className={o.kicker}>Keep watching</p>
      <p className={o.upTitle} id={`${slug}-gate`}>Log in to watch every video</p>
      <p className={o.gateText}>Just your name and mobile number. Every video opens right away.</p>
      <label className={o.field}><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
      <label className={o.field}><span>Mobile number</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="10-digit number" required /></label>
      {error && <p className={o.err} role="alert">{error}</p>}
      <div className={o.ctas} style={{ justifyContent: 'center', marginTop: 14 }}>
        <button type="submit" className={o.primaryBtn} disabled={busy}>{busy ? 'Opening…' : 'Continue watching'}</button>
        <button type="button" className={o.secondaryBtn} onClick={onClose}>Not now</button>
      </div>
    </form>
  )
}
