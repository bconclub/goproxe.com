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
      // Every beat halved — the capture rows were landing slower than the eye
      // wants to read them, so the card spent most of its time waiting.
      [200, 600, 1000].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) loop(); }, 2400));
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
          <span className="hiw-pill-ico" style={{ color: bg, filter: `drop-shadow(0 0 6px ${bg}88)` }}><I size={22} /></span>
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
      const dur = 500;
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
      [150, 550, 950, 1350].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) runScore(); }, 1500));
      ts.push(setTimeout(() => { if (!dead) loop(); }, 3200));
    }
    loop();
    return () => {
      dead = true;
      ts.forEach(clearTimeout);
      if (scoreRef.current) clearInterval(scoreRef.current);
    };
  }, [on]);

  const scorePct = (scoreVal / 74) * 100;
  // Red → Amber → Green as the score climbs.
  // 0–37  : red (#EF4444) → amber (#F59E0B)
  // 37–74 : amber (#F59E0B) → green (#10B981)
  const barColor = scoreVal < 37
    ? `color-mix(in srgb, #EF4444 ${100 - (scoreVal / 37) * 100}%, #F59E0B ${(scoreVal / 37) * 100}%)`
    : `color-mix(in srgb, #F59E0B ${100 - ((scoreVal - 37) / 37) * 100}%, #10B981 ${((scoreVal - 37) / 37) * 100}%)`;

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
            style={{
              opacity: step > i + 1 ? 1 : step === i + 1 ? 0.9 : 0,
              transform: step > i ? 'translateX(0)' : 'translateX(-10px)',
              ['--accent' as keyof React.CSSProperties as string]: color,
            }}
          >
            <span className="hiw-mem-ico" style={{ color }}><I size={14} /></span>
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
      // Fast buildup so card mostly shows the polished final state (no empty looks)
      // step 1 @ 125ms → typing indicator
      // step 2 @ 350ms → PROXe bubble
      // step 3 @ 600ms → lead bubble + RESPONDED badge
      // step 4 @ 750ms → system label + score badge
      // loop  @ 3250ms (2.5s hold on full final state)
      [125, 350, 600, 750].forEach((t, i) =>
        ts.push(setTimeout(() => { if (!dead) setStep(i + 1); }, t))
      );
      ts.push(setTimeout(() => { if (!dead) loop(); }, 3250));
    }
    loop();
    return () => { dead = true; ts.forEach(clearTimeout); };
  }, [on]);

  return (
    <div className="hiw-vis hiw-vis--react">
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

      {/* Always-visible chat header — fills the top of the card so the
          visualization area never looks empty mid-animation. */}
      <div className="hiw-react-chat-hdr">
        <span className="hiw-react-chat-av">
          <SiWhatsapp size={14} />
        </span>
        <div className="hiw-react-chat-meta">
          <div className="hiw-react-chat-name">Rahul S.</div>
          <div className="hiw-react-chat-sub">WhatsApp · Follow-up sequence</div>
        </div>
        <span className="hiw-react-chat-dot" />
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

/* White cards on the purple page, rather than dark cards that read as holes
   punched into it. Each keeps a trace of its channel colour in the wash so the
   three are still distinguishable, but the base is white and the type on them
   is dark ink. */
const CARD_ACCENTS = [
  { grad: 'linear-gradient(160deg, #ffffff 0%, #f3efff 100%)', icon: 'rgba(124,58,237,1)' },
  { grad: 'linear-gradient(160deg, #ffffff 0%, #ecf5ff 100%)', icon: 'rgba(2,132,199,1)'  },
  { grad: 'linear-gradient(160deg, #ffffff 0%, #ecfbf1 100%)', icon: 'rgba(22,163,74,1)'  },
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
      title: 'Every lead. Every channel.',
      desc: 'The moment someone messages on WhatsApp, visits your website, calls, or DMs on Instagram, PROXe captures them instantly. Lead scored and logged before you blink.',
      Vis: CaptureVis,
    },
    {
      title: 'One Memory. Full context.',
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
        <div className={`proxe-section-label hiw-center${vis ? ' hiw-in' : ''}`}>How It Works</div>
        <h2 className={`hiw-h2${vis ? ' hiw-in' : ''}`} style={{ transitionDelay: '0.08s' }}>
          Capture, Nurture, Close, Repeat.
        </h2>
        <div className="hiw-grid">
          {CARDS.map(({ title, desc, Vis }, i) => (
            <article
              key={i}
              className={`hiw-card${vis ? ' hiw-in' : ''}`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s`, background: CARD_ACCENTS[i].grad }}
            >
              {/* Bottom: content */}
              <div className="hiw-card-content">
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
