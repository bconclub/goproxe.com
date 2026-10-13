'use client';

import { useState } from 'react';
import { WATCH_EPISODES } from '../../lib/watch';
import { track } from '../../lib/analytics';
import styles from './DeployModal.module.css';

/**
 * The videos at the bottom of "See PROXe in action" (Z, 13 Oct 2026): first
 * "What is PROXe?", then "The voice agent" (PROXe connects with the lead,
 * a call within a minute). Locked until the visitor gives name + phone +
 * business: before that, the clips show blurred behind a lock.
 */
const SLUGS = ['watch-what-is-proxe', 'watch-the-voice-agent'];

export default function ProxeVideos({ locked }: { locked: boolean }) {
  const episodes = SLUGS.map((s) => WATCH_EPISODES.find((e) => e.slug === s)).filter(Boolean) as typeof WATCH_EPISODES;
  const [i, setI] = useState(0);
  if (!episodes.length) return null;
  const ep = episodes[i];
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  if (locked) {
    return (
      <div className={styles.videos} aria-label="PROXe videos, unlocked after you enter your details">
        <div className={styles.lockedRow}>
          {episodes.map((e) => (
            <div key={e.slug} className={styles.lockedClip}>
              <img src={e.poster} alt="" loading="lazy" />
              <span className={styles.lockedBadge} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              </span>
              <span className={styles.lockedTitle}>{e.title} · {fmt(e.duration)}</span>
            </div>
          ))}
        </div>
        <p className={styles.videoCaption}>Enter your details above to watch.</p>
      </div>
    );
  }

  return (
    <div className={styles.videos}>
      <video
        key={ep.slug}
        className={styles.demoVideo}
        src={ep.video}
        poster={ep.poster}
        controls
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-label={ep.title}
        onPlay={() => track('video_play_click', { video: ep.slug, location: 'deploy_modal' })}
        onEnded={() => { if (i < episodes.length - 1) setI(i + 1) }}
      >
        <track kind="captions" src={ep.captions} srcLang="en" label="English" default />
      </video>
      <div className={styles.videoRow} role="list" aria-label="PROXe videos">
        {episodes.map((e, n) => (
          <button
            key={e.slug}
            type="button"
            role="listitem"
            className={`${styles.videoThumb}${n === i ? ' ' + styles.videoThumbActive : ''}`}
            onClick={() => setI(n)}
            aria-current={n === i ? 'true' : undefined}
          >
            <img src={e.poster} alt="" loading="lazy" />
            <span>{n + 1}. {e.title} · {fmt(e.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
