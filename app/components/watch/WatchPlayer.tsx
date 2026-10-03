'use client'

import { useEffect, useRef, useState } from 'react'
import type { WatchChapter } from '../../lib/watch'
import styles from './WatchPlayer.module.css'

type WatchPlayerProps = {
  src: string
  poster: string
  captions: string
  title: string
  chapters: WatchChapter[]
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// A video with chapters you can jump to (onboarding videos).
export function WatchPlayer({ src, poster, captions, title, chapters }: WatchPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [now, setNow] = useState(0)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const tick = () => setNow(v.currentTime)
    v.addEventListener('timeupdate', tick)
    return () => v.removeEventListener('timeupdate', tick)
  }, [])

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
        <video
          ref={ref}
          className={styles.video}
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={title}
        >
          <source src={src} type="video/mp4" />
          <track kind="captions" src={captions} srcLang="en" label="English" />
        </video>
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
