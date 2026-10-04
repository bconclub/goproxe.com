'use client'

import { WATCH_EPISODES } from '../../lib/watch'
import { track } from '../../lib/analytics'
import './pitch.css'

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

/** Homepage section: the onboarding videos, each opening on /onboarding. */
export default function OnboardingVideos() {
  const eps = [...WATCH_EPISODES].sort((a, b) => a.order - b.order)
  return (
    <section id="get-started" className="pitch-root" aria-labelledby="onboarding-title">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[620px]">
            <p className="text-[13px] font-medium text-[#a78bfa]">Get started</p>
            <h2 id="onboarding-title" className="mt-2 text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-[38px]">
              See the real dashboard, then go live.
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/65">Short videos of PROXe being set up and answering. {eps.length} videos, a few minutes each.</p>
          </div>
          <a href="/onboarding" onClick={() => track('cta_click', { location: 'home_onboarding_all' })}
            className="rounded-full px-5 py-3 text-[14px] font-semibold text-white" style={{ background: '#7c3aed' }}>
            Watch them all
          </a>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {eps.map((e, i) => (
            <a key={e.slug} href={`/onboarding#${e.slug}`}
              onClick={() => track('cta_click', { location: `home_onboarding_${e.slug}` })}
              className="group w-[78%] shrink-0 snap-start overflow-hidden rounded-[22px] sm:w-auto"
              style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), #16112b', boxShadow: '0 0 0 1px rgba(167,139,250,0.2)' }}>
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] tabular-nums text-white">{clock(e.duration)}</span>
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#4c1d95]">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                </span>
              </div>
              <div className="p-4">
                <p className="text-[11.5px] text-white/45">Video {i + 1}</p>
                <p className="mt-0.5 text-[15.5px] font-medium leading-snug text-white">{e.title}</p>
                {e.dek && <p className="mt-1 text-[13px] leading-snug text-white/55">{e.dek}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
