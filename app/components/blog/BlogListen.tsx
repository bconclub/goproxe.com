'use client'

import { useEffect, useRef, useState } from 'react'
import { FiPlay, FiPause } from 'react-icons/fi'
import styles from './BlogListen.module.css'

type BlogListenProps = {
  slug: string
  duration: number
}

/**
 * Listen = a narrated mp3 (scripts/gen-blog-audio.mjs, generated at deploy
 * with a real voice), not the browser's speech synthesizer, which read every
 * post in a flat machine voice ("too AI", Z, 4 Sep). If a post has no audio
 * yet (new post before its first deploy), the button simply does not render.
 */
export function BlogListen({ slug, duration }: BlogListenProps) {
  const src = `/blog-audio/${slug}.mp3`
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    fetch(src, { method: 'HEAD' })
      .then((r) => { if (alive) setAvailable(r.ok && /audio/i.test(r.headers.get('content-type') || 'audio')) })
      .catch(() => { if (alive) setAvailable(false) })
    return () => { alive = false }
  }, [src])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  if (available === false) return null

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) }
  }

  return (
    <div className={styles.listen}>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onTimeUpdate={(e) => {
          const a = e.currentTarget
          if (a.duration > 0) { setProgress(a.currentTime / a.duration); setRemaining(a.duration - a.currentTime) }
        }}
        onLoadedMetadata={(e) => setRemaining(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setProgress(0) }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <button
        type="button"
        onClick={toggle}
        className={styles.listenButton}
        aria-label={playing ? 'Pause narration' : 'Listen to this post'}
        aria-pressed={playing}
      >
        {playing ? <FiPause size={16} /> : <FiPlay size={16} />}
        <span className={styles.listenLabel}>{playing ? 'Playing' : 'Listen'}</span>
        <span className={styles.listenDuration}>
          {remaining != null && (playing || progress > 0) ? fmt(remaining) : `${duration} min`}
        </span>
      </button>
      {(playing || progress > 0) && (
        <div className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  )
}
