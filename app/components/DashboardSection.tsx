'use client';
import { useEffect, useRef, useState } from 'react';

/* Mock-dashboard helpers (Sparkline / CircleGauge / StatCard) removed with
   the animated first slide — the carousel now opens on the real product
   screenshot. Recover from git history if a synthetic slide is ever wanted. */

export default function DashboardSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [vis, setVis] = useState(false);
  const [revealedSlides, setRevealedSlides] = useState<Set<number>>(new Set());

  // Mobile thumbnail scale + layout-reclaim margin set directly on each
  // slide. We avoid `scale(calc(length/length))` and `scale(var(...))`
  // because Chrome refuses to fold those inside transform — the only
  // reliable path is inline transform + matching margin per element.
  useEffect(() => {
    const apply = () => {
      const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      const w = window.innerWidth;
      if (w >= 900) {
        slides.forEach(s => {
          s.style.removeProperty('transform');
          s.style.removeProperty('margin-right');
        });
        // The mobile branch pins the row height to the scaled thumbnail; a
        // desktop pass must undo it or a window that was EVER < 900px wide
        // keeps a ~146px carousel forever (the "clipped strip" bug).
        carRef.current?.style.removeProperty('height');
        return;
      }
      const target = w - 32;
      const scale = Math.max(0.18, target / 1100);
      slides.forEach(s => {
        s.style.setProperty('transform', `scale(${scale.toFixed(4)})`, 'important');
        s.style.setProperty('margin-right', `${Math.round(target - 1100)}px`, 'important');
      });
      // Row height matches scaled thumbnail
      const car = carRef.current;
      if (car) car.style.height = `${Math.round(720 * scale + 16)}px`;
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  useEffect(() => {
    const el = secRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-slide scroll reveal — fires when each slide enters the carousel's visible area
  useEffect(() => {
    const car = carRef.current;
    if (!car) return;
    const observers: IntersectionObserver[] = [];
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setRevealedSlides(prev => new Set(prev).add(i));
            io.disconnect();
          }
        },
        { root: car, threshold: 0.15 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Scroll-driven horizontal pan removed per user request — the carousel
  // is now a normal drag/scroll/arrow-button carousel. Less magic, more
  // predictable.
  const isDraggingRef = useRef(false);

  // Click-drag horizontal scrolling for the carousel
  useEffect(() => {
    const car = carRef.current;
    if (!car) return;

    let startX = 0;
    let startScrollLeft = 0;
    let pointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      // Ignore drags that start on the arrow buttons
      if ((e.target as HTMLElement).closest('.db2-carousel-arrow')) return;
      // Only primary button / single-touch
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = car.scrollLeft;
      isDraggingRef.current = true;
      car.classList.add('db2-carousel--dragging');
      try { car.setPointerCapture(e.pointerId); } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) < 2) return;
      car.scrollLeft = startScrollLeft - dx;
      e.preventDefault();
    };

    const release = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      isDraggingRef.current = false;
      car.classList.remove('db2-carousel--dragging');
      try { car.releasePointerCapture(e.pointerId); } catch {}
    };

    car.addEventListener('pointerdown', onPointerDown);
    car.addEventListener('pointermove', onPointerMove);
    car.addEventListener('pointerup', release);
    car.addEventListener('pointercancel', release);
    car.addEventListener('pointerleave', release);
    return () => {
      car.removeEventListener('pointerdown', onPointerDown);
      car.removeEventListener('pointermove', onPointerMove);
      car.removeEventListener('pointerup', release);
      car.removeEventListener('pointercancel', release);
      car.removeEventListener('pointerleave', release);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="db2-sticky-wrapper">
    <section ref={secRef} className="db2-section">
      <div className="proxe-container">

        <div className={`proxe-section-label db2-label${vis ? ' db2-in' : ''}`}>The Dashboard</div>
        <h2 className={`db2-h2${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.08s' }}>
          PROXe takes care of<br />your entire pipeline.
        </h2>
        <p className={`db2-sub${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.14s' }}>
          Always on screen. Every lead, every stage, every channel, tracked in real time.
        </p>

        <div className={`db2-carousel-wrap${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.22s', position: 'relative' }}>
        <div ref={carRef} className="db2-carousel">
        {/* ── Real product screenshots (PII selectively blurred) ── */}
        <div ref={el => { slideRefs.current[0] = el; }} className={`db2-browser db2-slide${revealedSlides.has(0) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/dashboard
            </div>
          </div>
          <div className="db2-shot">
            <img src="/proxe/showcase/dashboard.webp" alt="PROXe Dashboard: live acquisition metrics" />
          </div>
        </div>

        <div ref={el => { slideRefs.current[1] = el; }} className={`db2-browser db2-slide${revealedSlides.has(1) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/leads
            </div>
          </div>
          <div className="db2-shot">
            <img src="/proxe/showcase/leads.webp" alt="PROXe Leads: every lead scored and staged" />
          </div>
        </div>

        <div ref={el => { slideRefs.current[2] = el; }} className={`db2-browser db2-slide${revealedSlides.has(2) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/conversations
            </div>
          </div>
          <div className="db2-shot">
            <img src="/proxe/showcase/chats.webp" alt="PROXe Inbox: live WhatsApp conversation with booking" />
          </div>
        </div>

        <div ref={el => { slideRefs.current[3] = el; }} className={`db2-browser db2-slide${revealedSlides.has(3) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/knowledge
            </div>
          </div>
          <div className="db2-shot">
            <img src="/proxe/showcase/knowledge.webp" alt="PROXe Knowledge: everything your agent knows, mapped" />
          </div>
        </div>

        </div>{/* end db2-carousel */}
        </div>{/* end db2-carousel-wrap */}

        {/* Arrows below the dashboard frame */}
        <div className="db2-carousel-arrows">
          <button
            className="db2-carousel-arrow db2-carousel-arrow--prev"
            aria-label="Previous slide"
            onClick={() => carRef.current?.scrollBy({ left: -carRef.current.clientWidth, behavior: 'smooth' })}
          >‹</button>
          <button
            className="db2-carousel-arrow db2-carousel-arrow--next"
            aria-label="Next slide"
            onClick={() => carRef.current?.scrollBy({ left: carRef.current.clientWidth, behavior: 'smooth' })}
          >›</button>
        </div>
      </div>
    </section>
    </div>
  );
}
