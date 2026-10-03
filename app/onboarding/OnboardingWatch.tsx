'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../styles/legal.module.css'
import o from './onboarding.module.css'
import { WatchPlayer } from '../components/watch/WatchPlayer'
import type { WatchEpisode } from '../lib/watch'

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const STORE = 'proxe-onboarding-viewer'
const COUNTDOWN = 5

type Viewer = { name: string; phone: string; watched: string[] }
type Props = { episodes: WatchEpisode[]; onboardingUrl: string }

const STEPS = [
  { n: '1', title: 'Tell us about your business', text: 'Your website, what you sell, and how you like to talk to customers.' },
  { n: '2', title: 'Connect your channels', text: 'WhatsApp, your website chat, calls. PROXe answers on the numbers you already use.' },
  { n: '3', title: 'PROXe starts answering', text: 'Every new lead gets a reply in seconds, a score, and a slot on your calendar.' },
]

const Lock = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
)
const Tick = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

// The first video is open to everyone. The rest unlock with a name and phone
// number, which land as a lead in PROXe (via /api/lead). Progress and score are
// saved on that lead (via /api/onboarding-progress) and kept in this browser.
export function OnboardingWatch({ episodes, onboardingUrl }: Props) {
  const [viewer, setViewerState] = useState<Viewer | null>(null)
  // A ref alongside the state: right after unlocking, the jump to the next video must already see the viewer.
  const viewerRef = useRef<Viewer | null>(null)
  const setViewer = (v: Viewer | null) => { viewerRef.current = v; setViewerState(v) }
  const [localWatched, setLocalWatched] = useState<string[]>([])
  const [active, setActive] = useState(episodes[0]?.slug)
  const [autoPlay, setAutoPlay] = useState(false)
  const [upNext, setUpNext] = useState<number | null>(null) // seconds left, or null
  const [gate, setGate] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Restore the viewer and their progress.
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(STORE) || 'null') as Viewer | null
      if (v?.phone) setViewer(v)
      const w = JSON.parse(localStorage.getItem(STORE + '-watched') || '[]')
      if (Array.isArray(w)) setLocalWatched(w)
    } catch {}
  }, [])

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

  const watched = viewer ? viewer.watched : localWatched
  const done = episodes.filter((e) => watched.includes(e.slug)).length
  const score = episodes.length ? Math.round((100 * done) / episodes.length) : 0
  const isLocked = (i: number) => i > 0 && !viewer

  const ep = episodes.find((e) => e.slug === active) || episodes[0]
  const idx = episodes.findIndex((e) => e.slug === ep?.slug)
  const next = episodes[idx + 1]

  const stopCountdown = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setUpNext(null) }

  const pick = useCallback((slug: string, play = false) => {
    stopCountdown()
    const i = episodes.findIndex((e) => e.slug === slug)
    if (i > 0 && !viewerRef.current) { setActive(episodes[0].slug); setGate(true); return }
    setGate(false)
    setActive(slug)
    setAutoPlay(play)
    history.replaceState(null, '', `#${slug}`)
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [episodes])

  const saveProgress = (v: Viewer) => {
    fetch('/api/onboarding-progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: v.phone, watched: v.watched }) }).catch(() => {})
  }

  const markWatched = useCallback(() => {
    if (!ep) return
    if (viewer) {
      if (viewer.watched.includes(ep.slug)) return
      const v = { ...viewer, watched: [...viewer.watched, ep.slug] }
      setViewer(v)
      try { localStorage.setItem(STORE, JSON.stringify(v)) } catch {}
      saveProgress(v)
    } else if (!localWatched.includes(ep.slug)) {
      const w = [...localWatched, ep.slug]
      setLocalWatched(w)
      try { localStorage.setItem(STORE + '-watched', JSON.stringify(w)) } catch {}
    }
  }, [ep, viewer, localWatched])

  // At the end: count down to the next video, or ask to unlock it.
  const onEnded = useCallback(() => {
    markWatched()
    if (!next) return
    if (isLocked(idx + 1)) { setGate(true); return }
    let left = COUNTDOWN
    setUpNext(left)
    timer.current = setInterval(() => {
      left -= 1
      if (left <= 0) { stopCountdown(); pick(next.slug, true) } else setUpNext(left)
    }, 1000)
  }, [markWatched, next, idx, pick, viewer])

  useEffect(() => () => stopCountdown(), [])

  const unlocked = (v: Viewer) => {
    setViewer(v)
    setGate(false)
    try { localStorage.setItem(STORE, JSON.stringify(v)) } catch {}
    saveProgress(v)
    const target = next && idx === 0 ? next.slug : episodes[1]?.slug
    if (target) pick(target, true)
  }

  const overlay = gate ? (
    <UnlockForm firstWatched={localWatched} onUnlocked={unlocked} onClose={() => setGate(false)} />
  ) : upNext !== null && next ? (
    <div className={o.upnext} role="status" aria-live="polite">
      <p className={o.kicker}>Up next</p>
      <p className={o.upTitle}>{next.title}</p>
      <div className={o.ring} aria-label={`Playing in ${upNext} seconds`}>{upNext}</div>
      <div className={o.ctas} style={{ justifyContent: 'center', marginTop: 16 }}>
        <button type="button" className={o.primaryBtn} onClick={() => pick(next.slug, true)}>Play now</button>
        <button type="button" className={o.secondaryBtn} onClick={stopCountdown}>Stay here</button>
      </div>
    </div>
  ) : null

  return (
    <div className={o.wrap}>
      <header className={o.hero}>
        <p className={styles.eyebrow}>Onboarding</p>
        <h1 className={styles.title}>Get started with <span className={styles.accent}>PROXe</span></h1>
        <p className={styles.lede}>A few short videos, one step at a time. Watch them all, then set PROXe up on your own leads.</p>
        <div className={o.ctas}>
          <a href={onboardingUrl} className={o.primary}>Start onboarding →</a>
          <a href="#player" className={o.secondary}>Watch first</a>
        </div>
      </header>

      <div className={o.progress} aria-label="Your progress">
        <div className={o.progressText}>
          <span className={o.kicker} style={{ margin: 0 }}>Your progress</span>
          <span>{done} of {episodes.length} watched · <strong>{score}%</strong>{viewer ? ` · ${viewer.name.split(' ')[0]}` : ''}</span>
        </div>
        <div className={o.bar}><i style={{ width: `${score}%` }} /></div>
      </div>

      {ep && (
        <section id="player" className={o.stage}>
          <div className={o.main}>
            <p className={o.kicker}>Step {idx + 1} of {episodes.length} · {clock(ep.duration)}</p>
            <h2 className={o.epTitle}>{ep.title}</h2>
            <WatchPlayer key={ep.slug} src={ep.video} poster={ep.poster} captions={ep.captions} title={ep.title} chapters={ep.chapters}
              autoPlay={autoPlay} onWatched={markWatched} onEnded={onEnded} overlay={overlay} />
            {score >= 100 && (
              <div className={o.complete}>
                <p className={o.kicker}>Complete · 100%</p>
                <p className={o.completeTitle}>You have watched every video. You are ready.</p>
                <a href={onboardingUrl} className={o.primary}>Start onboarding →</a>
              </div>
            )}
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
                <button type="button" className={o.nextBtn} onClick={() => pick(next.slug, true)}>
                  {isLocked(idx + 1) ? <><Lock /> Unlock next: </> : 'Next: '}{next.title} ({clock(next.duration)}) →
                </button>
              ) : (
                <a href={onboardingUrl} className={o.primary}>Start onboarding →</a>
              )}
            </div>
          </div>

          <aside className={o.side} aria-label="All videos">
            <p className={o.kicker}>Your path</p>
            <ol className={o.playlist}>
              {episodes.map((e, i) => {
                const seen = watched.includes(e.slug), locked = isLocked(i)
                return (
                  <li key={e.slug}>
                    <button type="button" onClick={() => pick(e.slug, true)} className={`${o.item} ${e.slug === ep.slug ? o.on : ''}`} aria-current={e.slug === ep.slug ? 'true' : undefined}>
                      <span className={o.thumbWrap}>
                        <img src={e.poster} alt="" className={o.thumb} loading="lazy" />
                        {locked && <span className={o.lockBadge}><Lock /></span>}
                      </span>
                      <span>
                        <span className={o.itemMeta}>
                          {seen ? <span className={o.seen}><Tick /> Watched</span> : locked ? <span>Locked</span> : <span>Step {i + 1}</span>} · {clock(e.duration)}
                        </span>
                        <span className={o.itemTitle}>{e.title}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
            {!viewer && episodes.length > 1 && (
              <button type="button" className={o.unlockAll} onClick={() => setGate(true)}><Lock /> Unlock all videos</button>
            )}
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

function UnlockForm({ firstWatched, onUnlocked, onClose }: { firstWatched: string[]; onUnlocked: (v: Viewer) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const digits = phone.replace(/\D/g, '')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError('Please enter your name.')
    if (digits.length < 10) return setError('Please enter a 10-digit mobile number.')
    setBusy(true); setError('')
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', name: name.trim(), phone: digits, source: 'onboarding-videos', sourceUrl: location.href, landingPage: location.pathname }),
      })
    } catch {}
    // Unlock even if saving the lead failed: a network hiccup must not lock someone out.
    onUnlocked({ name: name.trim(), phone: digits, watched: firstWatched })
  }

  return (
    <form className={o.gate} onSubmit={submit}>
      <p className={o.kicker}>Unlock the rest</p>
      <p className={o.upTitle}>See every step of PROXe</p>
      <p className={o.gateText}>Your name and number unlock all the videos and save your progress.</p>
      <label className={o.field}><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
      <label className={o.field}><span>Mobile number</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="10-digit number" required /></label>
      {error && <p className={o.err} role="alert">{error}</p>}
      <div className={o.ctas} style={{ justifyContent: 'center', marginTop: 14 }}>
        <button type="submit" className={o.primaryBtn} disabled={busy}>{busy ? 'Unlocking…' : 'Unlock videos'}</button>
        <button type="button" className={o.secondaryBtn} onClick={onClose}>Not now</button>
      </div>
    </form>
  )
}
