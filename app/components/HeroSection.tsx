'use client';

import { useEffect, useRef, useState } from 'react';

/* ── pill config ──────────────────────────────────────────────── */
interface PillDef {
  label: string;
  pos: React.CSSProperties;
  dur: number;
  ampY: number;
  ampX: number;
}

const PILLS: PillDef[] = [
  { label: 'Real estate',  pos: { top: '3%',    right: '2%'   }, dur: 5.2, ampY: -11, ampX:  3  },
  { label: 'Healthcare',   pos: { top: '10%',   left: '0%'    }, dur: 4.8, ampY:  -8, ampX: -5  },
  { label: 'Coaching',     pos: { top: '43%',   right: '-3%'  }, dur: 6.1, ampY:  -7, ampX:  6  },
  { label: 'Education',    pos: { bottom: '11%',right: '4%'   }, dur: 5.6, ampY:   9, ampX: -3  },
  { label: 'Travel',       pos: { bottom: '19%',left: '1%'    }, dur: 4.6, ampY:   7, ampX:  5  },
  { label: 'Legal',        pos: { top: '37%',   left: '-3%'   }, dur: 5.9, ampY:  -8, ampX: -6  },
  { label: 'Fitness',      pos: { top: '21%',   right: '-2%'  }, dur: 5.3, ampY: -10, ampX:  2  },
  { label: 'D2C brands',   pos: { bottom: '2%', left: '28%'   }, dur: 6.4, ampY:  11, ampX:  1  },
];

/* ── dot config ───────────────────────────────────────────────── */
interface DotDef {
  color: string;
  pos: React.CSSProperties;
  size: number;
  dur: number;
}

const DOTS: DotDef[] = [
  { color: '#A78BFA', pos: { top: '15%',    left: '20%'   }, size: 8,  dur: 3.2 },
  { color: '#38BDF8', pos: { top: '28%',    right: '17%'  }, size: 6,  dur: 4.1 },
  { color: '#FCD34D', pos: { top: '62%',    left: '15%'   }, size: 9,  dur: 2.8 },
  { color: '#A78BFA', pos: { bottom: '26%', right: '21%'  }, size: 7,  dur: 3.6 },
  { color: '#38BDF8', pos: { top: '74%',    left: '42%'   }, size: 8,  dur: 4.5 },
  { color: '#FCD34D', pos: { top: '18%',    right: '36%'  }, size: 6,  dur: 3.0 },
  { color: '#A78BFA', pos: { bottom: '22%', left: '50%'   }, size: 8,  dur: 5.2 },
  { color: '#38BDF8', pos: { top: '50%',    left: '8%'    }, size: 6,  dur: 4.8 },
];

/* ── arrow icon ───────────────────────────────────────────────── */
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ── main component ───────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
      },
      { threshold: 0.04 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`ph-section${visible ? ' ph-visible' : ''}`}
      id="product"
    >
      <div className="proxe-container ph-inner">

        {/* ── Left column ────────────────────────────────────── */}
        <div className="ph-left">
          <span className="ph-label">by BCON</span>

          <h1 className="ph-headline">
            Your entire<br />marketing team.<br />
            <span className="ph-h1-line2">One subscription.</span>
          </h1>

          <p className="ph-sub">
            PROXe understands your business, builds your marketing, and handles every lead across WhatsApp, website, and calls. Nothing missed. Nothing forgotten.
          </p>

          <div className="ph-ctas">
            <a href="#book-demo" className="ph-btn-primary">
              Book a Demo
              <Arrow />
            </a>
            <a href="#pricing" className="ph-btn-ghost">
              See Pricing
              <Arrow />
            </a>
          </div>
        </div>

        {/* ── Right column ───────────────────────────────────── */}
        <div className="ph-right">
          <div className="ph-visual" aria-hidden="true">

            {/* Ambient glow behind everything */}
            <div className="ph-glow-bg" />

            {/* Halo rings */}
            <div className="ph-halo ph-halo--1" />
            <div className="ph-halo ph-halo--2" />
            <div className="ph-halo ph-halo--3" />

            {/* Center logo card */}
            <div className="ph-logo-card">
              <div className="ph-logo-inner-glow" />
              <img
                src="/proxe/brand/proxe-icon-white.webp"
                alt="PROXe"
                className="ph-logo-img"
              />
            </div>

            {/* Floating industry pills */}
            {PILLS.map(({ label, pos, dur, ampY, ampX }, i) => (
              <span
                key={label}
                className="ph-pill"
                style={{
                  ...pos,
                  animationDuration: `${dur}s`,
                  animationDelay: `${i * 0.18}s`,
                  '--ph-amp-y': `${ampY}px`,
                  '--ph-amp-x': `${ampX}px`,
                } as React.CSSProperties}
              >
                {label}
              </span>
            ))}

            {/* Decorative dots */}
            {DOTS.map(({ color, pos, size, dur }, i) => (
              <span
                key={i}
                className="ph-dot"
                style={{
                  ...pos,
                  width:  size,
                  height: size,
                  background: color,
                  animationDuration: `${dur}s`,
                  animationDelay: `${i * 0.3}s`,
                } as React.CSSProperties}
              />
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
