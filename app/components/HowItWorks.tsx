'use client';
import { useEffect, useRef, useState } from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { FiGlobe, FiPhone } from 'react-icons/fi';

/* ─────────────────────────────────────────────────────────────
   Card 1 — notification pills dropping in
───────────────────────────────────────────────────────────── */
function CaptureVis({ on }: { on: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!on) { setStep(0); return; }
    let dead = false;
    const ts: ReturnType<typeof setTimeout>[] = [];
    function loop() {
      setStep(0);
      [400, 1200, 2000].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) loop(); }, 4800));
    }
    loop();
    return () => { dead = true; ts.forEach(clearTimeout); };
  }, [on]);

  return (
    <div className="hiw-vis">
      <div className="hiw-dotgrid" />
      {([
        { bg: '#25D366', I: SiWhatsapp, txt: 'New lead - Rahul S.' },
        { bg: '#7C3AED', I: FiGlobe,   txt: 'New lead - Priya M.' },
        { bg: '#0EA5E9', I: FiPhone,   txt: 'Missed call - Amit K.' },
      ] as const).map(({ bg, I, txt }, i) => (
        <div
          key={i}
          className="hiw-pill"
          style={{ opacity: step > i ? 1 : 0, transform: step > i ? 'translateY(0)' : 'translateY(-14px)' }}
        >
          <span className="hiw-pill-ico" style={{ background: bg }}><I size={11} /></span>
          <span className="hiw-pill-txt">{txt}</span>
          <span className="hiw-pill-badge">Captured</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Card 2 — unified thread timeline
───────────────────────────────────────────────────────────── */
function MemoryVis({ on }: { on: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!on) { setStep(0); return; }
    let dead = false;
    const ts: ReturnType<typeof setTimeout>[] = [];
    function loop() {
      setStep(0);
      [300, 1100, 1900, 2700].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) loop(); }, 5200));
    }
    loop();
    return () => { dead = true; ts.forEach(clearTimeout); };
  }, [on]);

  return (
    <div className="hiw-vis">
      <div className="hiw-dotgrid" />
      <div className="hiw-mem-lead" style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'translateY(0)' : 'translateY(-8px)' }}>
        Rahul S.
      </div>
      <div className="hiw-mem-list">
        {([
          { I: SiWhatsapp, day: 'Mon', txt: 'Asked about pricing' },
          { I: FiPhone,    day: 'Thu', txt: 'Called, asked about demo' },
          { I: FiGlobe,   day: 'Sat', txt: 'Visited pricing page' },
        ] as const).map(({ I, day, txt }, i) => (
          <div
            key={i}
            className="hiw-mem-row"
            style={{ opacity: step > i + 1 ? 1 : step === i + 1 ? 0.9 : 0, transform: step > i ? 'translateX(0)' : 'translateX(-10px)' }}
          >
            <div className="hiw-mem-vline" />
            <span className="hiw-mem-ico"><I size={12} /></span>
            <span className="hiw-mem-day">{day}</span>
            <span className="hiw-mem-lbl">{txt}</span>
          </div>
        ))}
      </div>
      <div className="hiw-mem-foot" style={{ opacity: step >= 4 ? 1 : 0 }}>One unified thread</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Card 3 — follow-up bubbles across days
───────────────────────────────────────────────────────────── */
function FollowVis({ on }: { on: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!on) { setStep(0); return; }
    let dead = false;
    const ts: ReturnType<typeof setTimeout>[] = [];
    function loop() {
      setStep(0);
      [400, 1200, 2000, 2800, 3600].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) loop(); }, 6500));
    }
    loop();
    return () => { dead = true; ts.forEach(clearTimeout); };
  }, [on]);

  const items = [
    { day: 'Day 1', from: 'lead',  txt: 'Interested in your service' },
    { day: 'Day 3', from: 'ai',    txt: 'Hey, wanted to follow up' },
    { day: 'Day 5', from: 'ai',    txt: 'Still here if you need help' },
    { day: 'Day 8', from: 'lead',  txt: 'Sorry was busy. Can we talk?', hot: true },
  ];

  return (
    <div className="hiw-vis">
      <div className="hiw-dotgrid" />
      <div className="hiw-fu">
        {items.map((b, i) => (
          <div
            key={i}
            className={`hiw-fu-row hiw-fu-row--${b.from}`}
            style={{ opacity: step > i ? 1 : 0, transform: step > i ? 'translateY(0)' : 'translateY(8px)' }}
          >
            <span className="hiw-fu-day">{b.day}</span>
            <span className={`hiw-fu-bub${b.hot ? ' hiw-fu-bub--hot' : ''}`}>{b.txt}</span>
            {b.hot && step >= 5 && <span className="hiw-fu-close">Closed</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */
type CardSpec = { bg: string; title: string; desc: string; Vis: React.FC<{ on: boolean }> };

export default function HowItWorks() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const CARDS: CardSpec[] = [
    {
      bg: '#0E7490',
      title: 'Every lead. Every channel. Real time.',
      desc: 'The moment someone messages on WhatsApp, visits your website, calls, or DMs on Instagram, PROXe captures them instantly. Lead scored and logged before you blink.',
      Vis: CaptureVis,
    },
    {
      bg: '#9D174D',
      title: 'One memory. Every conversation.',
      desc: 'Customer messaged on WhatsApp Monday. Called Thursday. Visited the website Saturday. PROXe remembers all of it. They never repeat themselves. You never lose context.',
      Vis: MemoryVis,
    },
    {
      bg: '#166534',
      title: 'Follows up until they close.',
      desc: 'Lead went quiet? PROXe sends a follow up. Still quiet? Sends another. After 10 days of smart nudges across WhatsApp, email, and SMS, cold leads come back to life.',
      Vis: FollowVis,
    },
  ];

  return (
    <section ref={secRef} className="hiw-section">
      <div className="proxe-container">
        <div className={`proxe-section-label hiw-center${vis ? ' hiw-in' : ''}`}>How It Works</div>
        <h2 className={`hiw-h2${vis ? ' hiw-in' : ''}`} style={{ transitionDelay: '0.08s' }}>
          From first message to closed deal. Automatically.
        </h2>
        <p className={`hiw-sub${vis ? ' hiw-in' : ''}`} style={{ transitionDelay: '0.14s' }}>
          PROXe captures every lead, remembers every conversation, and follows up until they close. No human required.
        </p>

        <div className="hiw-grid">
          {CARDS.map(({ bg, title, desc, Vis }, i) => (
            <article
              key={i}
              className={`hiw-card${vis ? ' hiw-in' : ''}`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="hiw-card-top" style={{ background: bg }}>
                <Vis on={vis} />
              </div>
              <div className="hiw-card-bot">
                <h3 className="hiw-card-title">{title}</h3>
                <p className="hiw-card-desc">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
