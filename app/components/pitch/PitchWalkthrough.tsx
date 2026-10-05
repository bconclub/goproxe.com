'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './pitch.css'
import { CORE_EXPLAINER, EXTRAS_EXPLAINER } from './cards'

// Loaded after the page: the homepage stays fast, the deck arrives when needed.
const PitchDeck = dynamic(() => import('./PitchDeck').then((m) => m.PitchDeck), {
  ssr: false,
  loading: () => <div className="h-[660px] rounded-[32px] bg-[#0d0a1c] sm:h-[720px]" />,
})

// Opens on the welcome card; the rest plays full screen once they ask for it.
const CARDS = CORE_EXPLAINER

/** Homepage walkthrough: what goes wrong, and what PROXe does about it, in a few swipes. */
export default function PitchWalkthrough() {
  const [full, setFull] = useState(false)
  // The card they tapped; the full deck opens there and narrates from it.
  const [at, setAt] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  // The portal sits outside the homepage root, so carry its font over.
  const font = full && sectionRef.current ? getComputedStyle(sectionRef.current).getPropertyValue('--font-proxe-sans') : ''
  // The page behind stays put while the full-screen deck is open.
  useEffect(() => {
    if (!full) return
    const html = document.documentElement
    const prev = [html.style.overflow, document.body.style.overflow]
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    // No web agent over the full-screen pitch, same as /pitch itself.
    const widget = document.getElementById('wc-chat-widget')
    if (widget) widget.style.visibility = 'hidden'
    return () => { html.style.overflow = prev[0]; document.body.style.overflow = prev[1]; if (widget) widget.style.visibility = '' }
  }, [full])

  return (
    <section ref={sectionRef} id="walkthrough" className="pitch-root" aria-labelledby="walkthrough-title">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-8 max-w-[640px]">
          <p className="text-[13px] font-medium text-[#a78bfa]">What is PROXe?</p>
          <h2 id="walkthrough-title" className="mt-2 text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-[42px]">
            AI for the customer side of your business.
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-white/65">
            Tap any card to hear it, narrated, full screen.
          </p>
        </div>
        <PitchDeck variant="embed" only={CARDS} extras={EXTRAS_EXPLAINER} onExpand={(i) => { setAt(i); setFull(true) }} />
        {full && createPortal(
          <div className="pitch-root" data-lenis-prevent style={font ? ({ '--font-proxe-sans': font } as React.CSSProperties) : undefined}>
            <PitchDeck variant="page" only={CARDS} extras={EXTRAS_EXPLAINER} autoStart startAt={at} onClose={() => setFull(false)} />
          </div>,
          document.body,
        )}
      </div>
    </section>
  )
}
