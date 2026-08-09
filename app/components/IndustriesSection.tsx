'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { track } from '../lib/analytics';
import { useDeployModal } from '../contexts/DeployModalContext';
// Cards, internal pages, sitemap and the demo all read this one registry —
// content changed there shows up here with zero duplication.
import { INDUSTRIES } from '../lib/industries';

export default function IndustriesSection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const { openModal } = useDeployModal();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Click-drag horizontal scrolling for desktop mouse users. Listeners on
  // window with `contains()` so child elements (images, activity pills,
  // SVGs) can't eat events. Touch / pen use native overflow-x scroll.
  // Mirrors the effect-local `dragged` flag so card links can tell a real
  // click from the click that fires at the end of a drag-scroll.
  const draggedRef = useRef(false);

  useEffect(() => {
    const car = trackRef.current;
    if (!car) return;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let dragged = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!car.contains(e.target as Node)) return;
      if ((e.target as HTMLElement).closest('.ind-arrow')) return;
      if (e.button !== 0) return;
      startX = e.clientX;
      startScroll = car.scrollLeft;
      dragging = true;
      dragged = false;
      draggedRef.current = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) < 3) return;
      if (!dragged) { dragged = true; draggedRef.current = true; car.classList.add('ind-grid--dragging'); }
      car.scrollLeft = startScroll - dx;
      e.preventDefault();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      requestAnimationFrame(() => car.classList.remove('ind-grid--dragging'));
    };

    // Wheel-to-horizontal with proper end-of-track hand-off to Lenis.
    //
    // Two cases per wheel tick:
    //   1. Carousel can still scroll in the wheel's direction →
    //      consume the delta into scrollLeft.
    //   2. Carousel is at the boundary in that direction →
    //      explicitly forward the delta to Lenis (window.__lenis) so
    //      the page resumes scrolling. We DON'T rely on event
    //      propagation here because Lenis's outer listener was racy
    //      against our boundary check on some wheel devices.
    //
    // Both cases preventDefault so the browser's native scroll never
    // double-acts on this wheel tick.
    const onWheel = (e: WheelEvent) => {
      // Trackpad two-finger horizontal swipe — let the browser handle
      // native horizontal scroll on the overflow-x:auto track.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;

      const maxScroll = car.scrollWidth - car.clientWidth;
      const atStart = car.scrollLeft <= 0;
      const atEnd   = car.scrollLeft >= maxScroll - 1;
      const goingUp   = e.deltaY < 0;
      const goingDown = e.deltaY > 0;

      // At a boundary in the wheel's direction → hand off to page scroll.
      if ((goingUp && atStart) || (goingDown && atEnd)) {
        const lenis = (window as unknown as { __lenis?: { scroll: number; scrollTo: (target: number, opts?: Record<string, unknown>) => void } }).__lenis;
        if (lenis) {
          e.preventDefault();
          e.stopPropagation();
          lenis.scrollTo(lenis.scroll + e.deltaY, { immediate: false, lerp: 0.1 });
        }
        // If Lenis isn't there for any reason, let the native wheel
        // bubble through — browser will scroll the page.
        return;
      }

      // Otherwise consume: scroll the carousel horizontally and stop
      // the event from reaching Lenis (which would also scroll the
      // page and feel like a "double scroll").
      e.preventDefault();
      e.stopPropagation();
      car.scrollLeft += e.deltaY;
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    car.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      car.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <section ref={ref} className={`ind-section${vis ? ' ind-in' : ''}`}>
      <div className="proxe-container">
        {/* Header */}
        <div className="ind-label">
          <span className="ind-label-dot" /> INDUSTRIES WE POWER
        </div>
        <div className="ind-header">
          <h2 className="ind-h2">
            Built for every industry.<br />
            Trained for <span className="ind-h2-grad">every outcome.</span>
          </h2>
          {/* No <br />. Hard breaks only look tidy at the width they were
              chosen for: on a phone each fragment wrapped a second time and the
              paragraph came out as five ragged lines. Let it wrap to the
              measure instead. */}
          <p className="ind-sub">
            PROXe adapts to the way your industry works. From lead capture to
            follow-ups and conversions, we handle the conversations that drive
            real results.
          </p>
        </div>

        {/* Horizontal carousel — drag or use arrows to scroll through 8 industries + 1 CTA card */}
        <div className="ind-track-wrap">
        <div ref={trackRef} className="ind-grid">
          {INDUSTRIES.map((u) => (
            <article
              key={u.id}
              className={`ind-card ind-card--${u.id}`}
              style={{ ['--acc' as keyof React.CSSProperties as string]: u.color }}
            >
              {/* Top: image-style header with floating activity cards.
                  When `image` is present, render the photo with a tinted
                  overlay; otherwise fall back to the accent gradient. */}
              <div
                className={`ind-top${u.image ? ' ind-top--photo' : ''}`}
                style={u.image
                  ? { backgroundImage: `url(${u.image})` }
                  : { background: u.gradient }}
              >
                {u.image && <span className="ind-top-tint" aria-hidden />}
                <span className="ind-top-ico"><u.Icon size={22} /></span>
                <div className="ind-top-cards">
                  {u.activities.map((a, i) => (
                    <div key={i} className="ind-act" style={{ animationDelay: `${0.18 + i * 0.08}s` }}>
                      <span className="ind-act-ico"><a.Icon size={11} /></span>
                      <div className="ind-act-txt">
                        <div className="ind-act-top">{a.top}</div>
                        {a.sub && <div className="ind-act-sub">{a.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="ind-body">
                <h3 className="ind-title">{u.title}</h3>
                <p className="ind-desc">{u.desc}</p>

                {/* 4-step flow */}
                <div className="ind-flow">
                  {u.flow.map((s, i) => (
                    <span key={i} className="ind-flow-cell">
                      <span className="ind-flow-ico"><s.Icon size={14} /></span>
                      <span className="ind-flow-label">{s.label}</span>
                      {i < u.flow.length - 1 && <span className="ind-flow-arrow" aria-hidden>›</span>}
                    </span>
                  ))}
                </div>

                {/* Stat */}
                <div className="ind-stat">
                  <span className="ind-stat-num">{u.stat}</span>
                  <span className="ind-stat-label">{u.statLabel}</span>
                </div>

                {/* Into the industry's own page. draggable=false so a
                    drag-scroll that starts on the link doesn't ghost-drag it,
                    and the draggedRef gate swallows the click that fires at
                    the end of a drag. */}
                <Link
                  href={`/industries/${u.slug}`}
                  className="ind-see-link"
                  draggable={false}
                  onClick={(e) => {
                    if (draggedRef.current) { e.preventDefault(); return; }
                    track('cta_click', { location: 'industry_card', industry: u.slug });
                  }}
                >
                  See how <FiArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}

          {/* Last slot — "your business?" CTA card */}
          <article className="ind-card ind-card--cta" style={{ ['--acc' as keyof React.CSSProperties as string]: '#a78bfa' }}>
            <div className="ind-cta-inner">
              <span className="ind-cta-ico"><FiPlus size={28} /></span>
              <h3 className="ind-cta-title">Your business next?</h3>
              <p className="ind-cta-desc">
                We train PROXe on your playbook: your offers, objections, and tone.
                If your customers chat, call, or click, we handle it.
              </p>
              <button type="button" onClick={() => openModal('industries')} className="ind-cta-btn">
                Talk to us <FiArrowRight size={16} />
              </button>
            </div>
          </article>
        </div>
        </div>

      </div>
    </section>
  );
}
