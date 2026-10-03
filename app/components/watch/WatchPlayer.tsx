'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { WatchChapter } from '../../lib/watch'
import styles from './WatchPlayer.module.css'

type WatchPlayerProps = {
  src: string
  poster: string
  captions: string
  title: string
  chapters: WatchChapter[]
  /** Start playing as soon as it loads (used when the next video comes up). */
  autoPlay?: boolean
  /** Fired once when 90% has been watched. */
  onWatched?: () => void
  onEnded?: () => void
  /** Drawn over the video (the up-next countdown, the unlock form). */
  overlay?: ReactNode
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// A video with chapters you can jump to (onboarding videos).
export function WatchPlayer({ src, poster, captions, title, chapters, autoPlay, onWatched, onEnded, overlay }: WatchPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [now, setNow] = useState(0)
  const watchedSent = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    watchedSent.current = false
    const tick = () => {
      setNow(v.currentTime)
      if (!watchedSent.current && v.duration && v.currentTime / v.duration >= 0.9) {
        watchedSent.current = true
        onWatched?.()
      }
    }
    const end = () => onEnded?.()
    // One video at a time: starting this one pauses every other video on the page.
    const solo = () => document.querySelectorAll('video').forEach((other) => { if (other !== v && !other.paused) other.pause() })
    v.addEventListener('timeupdate', tick)
    v.addEventListener('ended', end)
    v.addEventListener('play', solo)
    if (autoPlay) v.play().catch(() => {})
    return () => { v.removeEventListener('timeupdate', tick); v.removeEventListener('ended', end); v.removeEventListener('play', solo) }
  }, [src, autoPlay, onWatched, onEnded])

  const current = [...chapters].reverse().find((c) => c.t <= now + 0.2)
  const jump = (t: number) => {
    const v = ref.current
    if (!v) return
    v.currentTime = t
    v.play().catch(() => {})
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <video ref={ref} className={styles.video} controls playsInline preload="metadata" poster={poster} aria-label={title}>
          <source src={src} type="video/mp4" />
          <track kind="captions" src={captions} srcLang="en" label="English" />
        </video>
        {overlay && <div className={styles.overlay}>{overlay}</div>}
      </div>
      <ol className={styles.chapters} aria-label="Chapters">
        {chapters.map((c) => (
          <li key={c.t}>
            <button
              type="button"
              className={`${styles.chapter} ${current?.t === c.t ? styles.active : ''}`}
              onClick={() => jump(c.t)}
              aria-current={current?.t === c.t ? 'true' : undefined}
            >
              <span className={styles.time}>{clock(c.t)}</span>
              <span className={styles.name}>{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
