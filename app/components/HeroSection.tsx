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
  { label: 'Real estate',  pos: { top: '5%',    right: '4%'   }, dur: 5.2, ampY: -10, ampX:  3  },
  { label: 'Healthcare',   pos: { top: '11%',   left: '2%'    }, dur: 4.8, ampY:  -8, ampX: -4  },
  { label: 'Coaching',     pos: { top: '44%',   right: '-2%'  }, dur: 6.1, ampY:  -6, ampX:  5  },
  { label: 'Education',    pos: { bottom: '13%',right: '6%'   }, dur: 5.6, ampY:   8, ampX: -3  },
  { label: 'Travel',       pos: { bottom: '20%',left: '4%'    }, dur: 4.6, ampY:   6, ampX:  4  },
  { label: 'Legal',        pos: { top: '39%',   left: '-2%'   }, dur: 5.9, ampY:  -7, ampX: -5  },
  { label: 'Fitness',      pos: { top: '24%',   right: '-1%'  }, dur: 5.3, ampY:  -9, ampX:  2  },
  { label: 'D2C brands',   pos: { bottom: '3%', left: '30%'   }, dur: 6.4, ampY:  10, ampX:  1  },
];

/* ── dot config ───────────────────────────────────────────────── */
interface DotDef {
  color: string;
  pos: React.CSSProperties;
  size: number;
  dur: number;
}

const DOTS: DotDef[] = [
  { color: '#7C3AED', pos: { top: '17%',    left: '22%'   }, size: 7, dur: 3.2 },
  { color: '#0EA5E9', pos: { top: '30%',    right: '19%'  }, size: 6, dur: 4.1 },
  { color: '#F59E0B', pos: { top: '60%',    left: '17%'   }, size: 8, dur: 2.8 },
  { color: '#7C3AED', pos: { bottom: '27%', right: '23%'  }, size: 6, dur: 3.6 },
  { color: '#0EA5E9', pos: { top: '72%',    left: '40%'   }, size: 7, dur: 4.5 },
  { color: '#F59E0B', pos: { top: '19%',    right: '34%'  }, size: 6, dur: 3.0 },
  { color: '#7C3AED', pos: { bottom: '23%', left: '48%'   }, size: 7, dur: 5.2 },
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

    // If the hero is already in viewport (first load), reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setVisible(true);
      return;
    }

    // Otherwise use IntersectionObserver for scroll-in
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
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

            {/* Center logo card */}
            <div className="ph-logo-card">
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
                  animationDelay: `${i * 0.22}s`,
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
                  animationDelay: `${i * 0.38}s`,
                } as React.CSSProperties}
              />
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
