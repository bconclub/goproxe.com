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
          <span className="hiw-pill-ico" style={{ background: bg, boxShadow: `0 0 14px ${bg}99, 0 0 4px ${bg}66` }}><I size={14} /></span>
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
  const [scoreVal, setScoreVal] = useState(0);
  const scoreRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!on) { setStep(0); setScoreVal(0); return; }
    let dead = false;
    const ts: ReturnType<typeof setTimeout>[] = [];

    function runScore() {
      setScoreVal(0);
      const start = performance.now();
      const dur = 1000;
      const target = 74;
      if (scoreRef.current) clearInterval(scoreRef.current);
      scoreRef.current = setInterval(() => {
        const elapsed = performance.now() - start;
        const pct = Math.min(elapsed / dur, 1);
        setScoreVal(Math.round(pct * target));
        if (pct >= 1 && scoreRef.current) { clearInterval(scoreRef.current); scoreRef.current = null; }
      }, 16);
    }

    function loop() {
      setStep(0);
      setScoreVal(0);
      [300, 1100, 1900, 2700].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) runScore(); }, 3000));
      ts.push(setTimeout(() => { if (!dead) loop(); }, 6400));
    }
    loop();
    return () => {
      dead = true;
      ts.forEach(clearTimeout);
      if (scoreRef.current) clearInterval(scoreRef.current);
    };
  }, [on]);

  const scorePct = (scoreVal / 74) * 100;
  const barColor = scoreVal < 40
    ? `color-mix(in srgb, #9CA3AF ${100 - (scoreVal / 40) * 100}%, #F59E0B ${(scoreVal / 40) * 100}%)`
    : `color-mix(in srgb, #F59E0B ${100 - ((scoreVal - 40) / 34) * 100}%, #7C3AED ${((scoreVal - 40) / 34) * 100}%)`;

  const scoreVisible = step >= 4;

  return (
    <div className="hiw-vis">
      <div className="hiw-dotgrid" />
      <div className="hiw-mem-lead" style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'translateY(0)' : 'translateY(-8px)' }}>
        Rahul S.
      </div>
      <div className="hiw-mem-list">
        {([
          { I: SiWhatsapp, day: 'Mon', txt: 'Asked about pricing',    color: '#25D366' },
          { I: FiPhone,    day: 'Thu', txt: 'Called, asked about demo', color: '#0EA5E9' },
          { I: FiGlobe,   day: 'Sat', txt: 'Visited pricing page',    color: '#7C3AED' },
        ] as const).map(({ I, day, txt, color }, i) => (
          <div
            key={i}
            className="hiw-mem-row"
            style={{ opacity: step > i + 1 ? 1 : step === i + 1 ? 0.9 : 0, transform: step > i ? 'translateX(0)' : 'translateX(-10px)' }}
          >
            <div className="hiw-mem-vline" />
            <span className="hiw-mem-ico" style={{ background: color, color: '#fff', boxShadow: `0 0 10px ${color}88` }}><I size={12} /></span>
            <span className="hiw-mem-day">{day}</span>
            <span className="hiw-mem-lbl">{txt}</span>
          </div>
        ))}
      </div>

      {/* ── Lead score gauge ── */}
      <div className="hiw-score-wrap" style={{ opacity: scoreVisible ? 1 : 0, transform: scoreVisible ? 'translateY(0)' : 'translateY(6px)' }}>
        <div className="hiw-score-row">
          <span className="hiw-score-lbl">Lead Score</span>
          <div className="hiw-score-bar-wrap">
            <div className="hiw-score-bar-track">
              <div
                className="hiw-score-bar-fill"
                style={{ width: `${scorePct}%`, background: barColor }}
              />
            </div>
            <span className="hiw-score-num">{scoreVal}</span>
          </div>
          <span className="hiw-score-badge">High Intent</span>
        </div>
        <div className="hiw-score-tags">
          {([
            { txt: 'Pricing asked',    cls: 'amber',  delay: '0s'   },
            { txt: 'Demo requested',   cls: 'purple', delay: '0.2s' },
            { txt: 'Multi-channel',    cls: 'teal',   delay: '0.4s' },
          ]).map(({ txt, cls, delay }) => (
            <span
              key={txt}
              className={`hiw-score-tag hiw-score-tag--${cls}`}
              style={{ animationDelay: delay, animationPlayState: scoreVisible ? 'running' : 'paused' }}
            >
              {txt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Card 3 — lead reactivation via WhatsApp follow-up
───────────────────────────────────────────────────────────── */
function ReactivateVis({ on }: { on: boolean }) {
  const [step, setStep] = useState(0);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    if (!on) { setStep(0); return; }
    let dead = false;
    const ts: ReturnType<typeof setTimeout>[] = [];
    function loop() {
      setStep(0);
      setLoopKey(k => k + 1);
      // step 1 @ 400ms  → typing indicator
      // step 2 @ 1900ms → PROXe bubble (typing gone, 1.5s of typing)
      // step 3 @ 3400ms → lead bubble + RESPONDED badge (1.5s pause)
      // step 4 @ 3700ms → system label + score badge
      // loop  @ 7200ms  (2s hold on final state)
      [400, 1900, 3400, 3700].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) loop(); }, 7200));
    }
    loop();
    return () => { dead = true; ts.forEach(clearTimeout); };
  }, [on]);

  return (
    <div className="hiw-vis" style={{ justifyContent: 'flex-start', paddingTop: 20 }}>
      <div className="hiw-dotgrid" />

      {/* RESPONDED badge — top right, pop-scale in */}
      <div
        className="hiw-react-responded"
        style={{
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'scale(1)' : 'scale(0.4)',
        }}
      >
        ✓ RESPONDED
      </div>

      {/* Lead header pill */}
      <div className="hiw-react-header">
        <div className="hiw-react-avatar">R</div>
        <div className="hiw-react-info">
          <span className="hiw-react-name">Rahul S.</span>
          <span className="hiw-react-status">
            <span className="hiw-react-dot" />
            Last seen 3 days ago
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="hiw-react-chat">
        {/* Typing indicator */}
        <div
          className="hiw-react-typing"
          style={{
            opacity: step === 1 ? 1 : 0,
            transform: step === 1 ? 'translateY(0)' : 'translateY(4px)',
          }}
        >
          <span /><span /><span />
        </div>

        {/* PROXe bubble */}
        <div
          className="hiw-react-row hiw-react-row--proxe"
          style={{
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <div className="hiw-react-bub hiw-react-bub--proxe">
            Hey Rahul, just checking in. You asked about a 3BHK in Whitefield last week. Still looking?
          </div>
          <div className="hiw-react-meta">Sent via WhatsApp · Day 4 of follow-up sequence</div>
        </div>

        {/* Lead bubble — key=loopKey forces animation replay each loop */}
        <div
          className="hiw-react-row hiw-react-row--lead"
          style={{
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <div key={loopKey} className="hiw-react-bub hiw-react-bub--lead">
            Hey sorry was caught up! Yes still looking.
          </div>
        </div>

        {/* System label + score badge */}
        <div
          className="hiw-react-system"
          style={{
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? 'translateY(0)' : 'translateY(4px)',
          }}
        >
          Lead reactivated · Score updated to 82 ·{' '}
          <span className={`hiw-react-score-badge${step >= 4 ? ' hiw-react-score-badge--hot' : ''}`}>
            {step >= 4 ? 'High Intent' : 'Cold'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */
/* ── Small icon box (matches pillar style) ── */
const ICONS = [
  /* Capture — lightning bolt */
  <svg key="c" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  /* Remember — brain/cpu */
  <svg key="r" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/></svg>,
  /* Close — check circle */
  <svg key="cl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
];

const CARD_ACCENTS = [
  { grad: 'linear-gradient(135deg, rgba(124,58,237,0.45) 0%, rgba(14,11,34,0.6) 100%)', icon: 'rgba(167,139,250,1)' },
  { grad: 'linear-gradient(135deg, rgba(14,165,233,0.35) 0%, rgba(8,20,60,0.65) 100%)',  icon: 'rgba(125,211,252,1)' },
  { grad: 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(6,30,18,0.7)  100%)',   icon: 'rgba(74,222,128,1)'  },
];

type CardSpec = { title: string; desc: string; Vis: React.FC<{ on: boolean }> };

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
      title: 'Every lead. Every channel. Real time.',
      desc: 'The moment someone messages on WhatsApp, visits your website, calls, or DMs on Instagram, PROXe captures them instantly. Lead scored and logged before you blink.',
      Vis: CaptureVis,
    },
    {
      title: 'One memory. Every conversation.',
      desc: 'Customer messaged on WhatsApp Monday. Called Thursday. Visited the website Saturday. PROXe remembers all of it. They never repeat themselves. You never lose context.',
      Vis: MemoryVis,
    },
    {
      title: 'Never Let a Lead Go Cold.',
      desc: 'Most leads just need one more nudge. PROXe sends it automatically across WhatsApp, email, and SMS until they respond.',
      Vis: ReactivateVis,
    },
  ];

  return (
    <section ref={secRef} className="hiw-section">
      <div className="proxe-container">
        <div className="hiw-grid">
          {CARDS.map(({ title, desc, Vis }, i) => (
            <article
              key={i}
              className={`hiw-card${vis ? ' hiw-in' : ''}`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s`, background: CARD_ACCENTS[i].grad }}
            >
              {/* Left: content */}
              <div className="hiw-card-content">
                <div className="hiw-card-icon" style={{ color: CARD_ACCENTS[i].icon, background: `${CARD_ACCENTS[i].icon}18`, border: `1px solid ${CARD_ACCENTS[i].icon}30` }}>
                  {ICONS[i]}
                </div>
                <h3 className="hiw-card-title">{title}</h3>
                <p className="hiw-card-desc">{desc}</p>
              </div>
              {/* Right: live animation */}
              <div className="hiw-card-vis-wrap">
                <Vis on={vis} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
