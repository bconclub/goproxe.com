'use client'

import dynamic from 'next/dynamic'
import './pitch.css'

// Loaded after the page: the homepage stays fast, the deck arrives when needed.
const PitchDeck = dynamic(() => import('./PitchDeck').then((m) => m.PitchDeck), {
  ssr: false,
  loading: () => <div className="h-[660px] rounded-[32px] bg-[#0d0a1c] sm:h-[720px]" />,
})

// The product story from the pitch, without the round and the plan.
const CARDS = ['problem', 'gaps', 'who', 'solution', 'how', 'dashboard', 'memory', 'price', 'founder']

/** Homepage walkthrough: what goes wrong, and what PROXe does about it, in a few swipes. */
export default function PitchWalkthrough() {
  return (
    <section id="walkthrough" className="pitch-root" aria-labelledby="walkthrough-title">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-8 max-w-[640px]">
          <p className="text-[13px] font-medium text-[#a78bfa]">The walkthrough</p>
          <h2 id="walkthrough-title" className="mt-2 text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-[42px]">
            Where leads get lost, and what PROXe does about it.
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-white/65">
            Swipe through what goes wrong between an ad and a customer, and what PROXe does about it. Tap the speaker to hear it.
          </p>
        </div>
        <PitchDeck variant="embed" only={CARDS} />
      </div>
    </section>
  )
}
