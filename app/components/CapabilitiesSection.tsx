'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FiZap,
  FiSend,
  FiUsers,
  FiShield,
  FiMessageCircle,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiActivity,
} from 'react-icons/fi';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';

/* ─────────────────────────────────────────────────────────────
   ORB — SVG-based: glowing core + radiating rays + orbit rings + particles
───────────────────────────────────────────────────────────── */
function UnifiedMemoryOrb() {
  // Compact glowing sphere with a darker "well" at the center so the
  // brand icon reads cleanly against the surrounding glow.
  return (
    <svg className="cap-orb-svg" viewBox="0 0 140 140" aria-hidden="true">
      <defs>
        {/* Outer atmospheric halo (sits behind the sphere) */}
        <radialGradient id="capOrbHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(167,139,250,0.55)" />
          <stop offset="50%"  stopColor="rgba(124,58,237,0.20)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
        {/* Sphere — bright RIM, darker CENTER so the icon has contrast */}
        <radialGradient id="capOrbCore" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#2e1065" />
          <stop offset="35%"  stopColor="#4c1d95" />
          <stop offset="70%"  stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </radialGradient>
        {/* Top-left specular: a small glint, not a full hemisphere wash */}
        <radialGradient id="capOrbGlint" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
          <stop offset="60%"  stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Halo glow */}
      <circle cx="70" cy="70" r="68" fill="url(#capOrbHalo)" />

      {/* Sphere core — bright rim, dark middle */}
      <circle cx="70" cy="70" r="36" fill="url(#capOrbCore)" />
      {/* Subtle inner stroke for definition */}
      <circle cx="70" cy="70" r="36" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      {/* Small top-left glint (replaces the old wash-out specular ellipse) */}
      <circle cx="56" cy="52" r="10" fill="url(#capOrbGlint)" />

      {/* PROXe brand mark — slightly larger so it owns the center, with a
          soft shadow so it never gets eaten by the gradient */}
      <image
        href="/proxe/brand/proxe-icon-white.webp"
        x="46" y="46" width="48" height="48"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))' }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mini visualizations
───────────────────────────────────────────────────────────── */
function MiniCenterOrb() {
  return (
    <span className="cap-mini-core">
      <span className="cap-mini-core-glow" />
      <span className="cap-mini-core-dot" />
    </span>
  );
}

function ChannelConstellation() {
  // 3D feel: tilted elliptical orbits with channel pips. Pips share the
  // same purple-tint treatment as the Auto Follow-Ups flow nodes so all
  // 4 cards read as one visual family.
  return (
    <div className="cap-mini cap-mini--const">
      <svg className="cap-const-orbits" viewBox="0 0 220 120" aria-hidden="true">
        <defs>
          <radialGradient id="capConstGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(167,139,250,0.5)" />
            <stop offset="60%"  stopColor="rgba(124,58,237,0.15)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="60" r="58" fill="url(#capConstGlow)" />
        <ellipse cx="110" cy="60" rx="86" ry="22"
          fill="none" stroke="rgba(167,139,250,0.30)" strokeWidth="0.8" strokeDasharray="2 3" />
        <ellipse cx="110" cy="60" rx="86" ry="22"
          fill="none" stroke="rgba(167,139,250,0.20)" strokeWidth="0.8" strokeDasharray="2 3"
          transform="rotate(-22 110 60)" />
        <ellipse cx="110" cy="60" rx="60" ry="14"
          fill="none" stroke="rgba(167,139,250,0.35)" strokeWidth="0.9" strokeDasharray="2 3" />
        <circle r="1.8" fill="#e9d5ff">
          <animateMotion dur="6s" repeatCount="indefinite"
            path="M 24 60 A 86 22 0 1 0 196 60 A 86 22 0 1 0 24 60 Z" />
        </circle>
        <circle r="1.5" fill="#c4b5fd" opacity="0.8">
          <animateMotion dur="9s" repeatCount="indefinite" begin="-2s"
            path="M 24 60 A 86 22 0 1 0 196 60 A 86 22 0 1 0 24 60 Z" />
        </circle>
      </svg>

      <MiniCenterOrb />
      {/* WhatsApp + Instagram render in their real brand colors; the other
          two stay in the brand-purple house tint. */}
      <span className="cap-const-pip cap-const-pip--wa cap-const-pip--tl"><SiWhatsapp size={15} /></span>
      <span className="cap-const-pip cap-const-pip--tr"><FiMessageCircle size={14} /></span>
      <span className="cap-const-pip cap-const-pip--bl"><FiPhone size={14} /></span>
      <span className="cap-const-pip cap-const-pip--ig cap-const-pip--br"><SiInstagram size={15} /></span>
    </div>
  );
}

function FollowupFlow() {
  return (
    <div className="cap-mini cap-mini--flow">
      <span className="cap-flow-node"><FiMessageCircle size={12} /></span>
      <span className="cap-flow-dash" />
      <span className="cap-flow-node"><FiMail size={12} /></span>
      <span className="cap-flow-dash" />
      <span className="cap-flow-node"><FiClock size={12} /></span>
      <span className="cap-flow-dash" />
      <span className="cap-flow-node cap-flow-node--done"><FiCheckCircle size={12} /></span>
    </div>
  );
}

function AgentNetwork() {
  // Wide horizontal spread of specialized agents — all pips use the
  // shared brand-purple tint (consistent with the other cards).
  return (
    <div className="cap-mini cap-mini--agents">
      <svg className="cap-mini-grid" viewBox="0 0 320 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 40 40 Q 90  10 160 40" fill="none" stroke="rgba(167,139,250,0.35)" strokeDasharray="2 3" />
        <path d="M 160 40 Q 230 10 280 40" fill="none" stroke="rgba(167,139,250,0.35)" strokeDasharray="2 3" />
        <path d="M 40 40 Q 90  70 160 40" fill="none" stroke="rgba(167,139,250,0.25)" strokeDasharray="2 3" />
        <path d="M 160 40 Q 230 70 280 40" fill="none" stroke="rgba(167,139,250,0.25)" strokeDasharray="2 3" />
      </svg>
      <span className="cap-mini-ico cap-mini-ico--ag-l"><SiWhatsapp size={14} /></span>
      <span className="cap-mini-ico cap-mini-ico--ag-ml"><FiMessageCircle size={13} /></span>
      <MiniCenterOrb />
      <span className="cap-mini-ico cap-mini-ico--ag-mr"><FiPhone size={13} /></span>
      <span className="cap-mini-ico cap-mini-ico--ag-r"><FiMail size={14} /></span>
    </div>
  );
}

function ShieldVis() {
  return (
    <div className="cap-mini cap-mini--shield">
      <span className="cap-shield-ring cap-shield-ring--1" />
      <span className="cap-shield-ring cap-shield-ring--2" />
      <span className="cap-shield-ring cap-shield-ring--3" />
      <span className="cap-shield-core"><FiLock size={14} /></span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────── */
export default function CapabilitiesSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // All four cards use the same tinted-square eyebrow icon for visual
  // consistency. Lead Capture uses a stylized lightning-bolt mark.
  const sideCards = [
    { id: 'capture',  index: '01', Icon: FiZap,    title: '24/7 Lead Capture',   desc: 'Every channel listens all day. No form, message, or call is ever missed.', Vis: ChannelConstellation },
    { id: 'followup', index: '02', Icon: FiSend,   title: 'Auto Follow-Ups',     desc: 'AI sequences the perfect next steps until they book, buy, or opt out.',    Vis: FollowupFlow },
    { id: 'agents',   index: '03', Icon: FiUsers,  title: 'Multi-Agent System',  desc: 'Specialized agents work across web, WhatsApp, voice, email, and SMS.',     Vis: AgentNetwork },
    { id: 'security', index: '04', Icon: FiShield, title: 'Enterprise Security', desc: 'SOC2-aligned controls, encrypted at rest and in transit.',                  Vis: ShieldVis },
  ];

  return (
    <section ref={ref} className={`cap-section${vis ? ' cap-in' : ''}`}>
      <div className="proxe-container">
        {/* Header (outside the framed container) */}
        <div className="cap-label">
          <span className="cap-label-diamond">◆</span> CAPABILITIES
        </div>
        <h2 className="cap-h2">
          The infrastructure behind<br />
          <span className="cap-h2-grad">autonomous</span> customer acquisition.
        </h2>
        <p className="cap-sub">
          Every channel connected. Every interaction remembered.<br />
          Every lead continuously moving toward conversion.
        </p>

        {/* Single framed container holds everything below */}
        <div className="cap-frame">
          <div className="cap-frame-bg" aria-hidden="true">
            <div className="cap-frame-arc" />
          </div>

          <div className="cap-grid">
            {/* ── Hero card ── */}
            <article className="cap-hero">
              <div className="cap-hero-tag">
                <span className="cap-hero-tag-ico">✦</span> CORE INTELLIGENCE
              </div>
              <h3 className="cap-hero-title">Unified Memory</h3>
              <p className="cap-hero-sub">
                One memory across every channel.<br />
                Context follows the customer,<br />
                not the conversation.
              </p>

              <div className="cap-hero-vis">
                {/* Glowing connector lines wiring channels (left) and
                    profile/memory (right) into the orb. */}
                <svg className="cap-connectors" viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="capConnGradL" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="rgba(167,139,250,0.05)" />
                      <stop offset="100%" stopColor="rgba(196,181,253,0.9)" />
                    </linearGradient>
                    <linearGradient id="capConnGradR" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="rgba(196,181,253,0.9)" />
                      <stop offset="100%" stopColor="rgba(167,139,250,0.05)" />
                    </linearGradient>
                  </defs>
                  {/* Left side — 4 channels → orb */}
                  <g fill="none" stroke="url(#capConnGradL)" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M 200 50  C 260 70,  290 130, 300 160" />
                    <path d="M 200 120 C 260 130, 290 150, 300 160" />
                    <path d="M 200 200 C 260 190, 290 170, 300 160" />
                    <path d="M 200 270 C 260 250, 290 200, 300 160" />
                  </g>
                  {/* Right side — orb → profile + memory */}
                  <g fill="none" stroke="url(#capConnGradR)" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M 300 160 C 340 130, 360  90, 400  80" />
                    <path d="M 300 160 C 340 190, 360 230, 400 240" />
                  </g>
                </svg>

                {/* LEFT: channel feed */}
                <div className="cap-channels">
                  {[
                    { Icon: SiWhatsapp,      name: 'WhatsApp',     sub: '11:32 AM · New message',     color: '#25d366' },
                    { Icon: FiMessageCircle, name: 'Website Chat', sub: '09:15 AM · Pricing question', color: '#a78bfa' },
                    { Icon: FiPhone,         name: 'Voice Call',   sub: 'Yesterday · 02:18',           color: '#60a5fa' },
                    { Icon: FiMail,          name: 'Email',        sub: '10:45 AM · Integration query',color: '#c084fc' },
                  ].map((c) => (
                    <div key={c.name} className="cap-channel" style={{ ['--accent' as keyof React.CSSProperties as string]: c.color }}>
                      <span className="cap-channel-ico">
                        <c.Icon size={14} />
                      </span>
                      <div className="cap-channel-txt">
                        <div className="cap-channel-name">{c.name}</div>
                        <div className="cap-channel-sub">{c.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CENTER: orb */}
                <div className="cap-orb-wrap">
                  <UnifiedMemoryOrb />
                </div>

                {/* RIGHT: profile + memory */}
                <div className="cap-right">
                  <div className="cap-profile">
                    <div className="cap-profile-tag">PERSISTENT CUSTOMER PROFILE</div>
                    <ul>
                      <li><span className="cap-profile-bullet cap-profile-bullet--1">✦</span> Preferences</li>
                      <li><span className="cap-profile-bullet cap-profile-bullet--2">◷</span> History</li>
                      <li><span className="cap-profile-bullet cap-profile-bullet--3">◆</span> Intent</li>
                      <li><span className="cap-profile-bullet cap-profile-bullet--4">◇</span> Context</li>
                    </ul>
                  </div>
                  <div className="cap-memory">
                    <div className="cap-memory-hdr">
                      <span className="cap-memory-av"><FiMessageCircle size={9} /></span>
                      <span className="cap-memory-name">AI Memory</span>
                      <span className="cap-memory-time">Just now</span>
                    </div>
                    <p>Knows they&rsquo;re evaluating integration, asked about pricing, prefers WhatsApp.</p>
                    <span className="cap-memory-cta">Continuing conversation<span className="cap-memory-ellipsis">…</span></span>
                  </div>
                </div>
              </div>

              <div className="cap-hero-stats">
                <div className="cap-stat">
                  <span className="cap-stat-ico"><FiActivity size={13} /></span>
                  <div>
                    <div className="cap-stat-val">100%</div>
                    <div className="cap-stat-lbl">Context Retention</div>
                  </div>
                </div>
                <div className="cap-stat">
                  <span className="cap-stat-ico" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18.178 8c-3.226 0-5.978 6.16-5.978 7.99 0 0-2.572-7.99-5.821-7.99-1.957 0-3.379 1.79-3.379 4 0 2.21 1.385 4 3.379 4 3.249 0 5.821-7.99 5.821-7.99 0 1.83 2.753 7.99 5.978 7.99 1.984 0 3.422-1.79 3.422-4 0-2.21-1.438-4-3.422-4z"/>
                    </svg>
                  </span>
                  <div>
                    <div className="cap-stat-val">∞</div>
                    <div className="cap-stat-lbl">Cross-Channel Memory</div>
                  </div>
                </div>
                <div className="cap-stat">
                  <span className="cap-stat-ico"><FiZap size={13} /></span>
                  <div>
                    <div className="cap-stat-val">24/7</div>
                    <div className="cap-stat-lbl">Always Remembering</div>
                  </div>
                </div>
              </div>
            </article>

            {/* ── 4 side cards — all share the same tinted-square eyebrow ── */}
            {sideCards.map((c) => (
              <article key={c.id} className={`cap-card cap-card--${c.id}`}>
                <div className="cap-card-head">
                  <span className="cap-card-icon"><c.Icon size={20} /></span>
                  <span className="cap-card-index">{c.index}</span>
                </div>
                <h4 className="cap-card-title">{c.title}</h4>
                <p className="cap-card-desc">{c.desc}</p>
                <c.Vis />
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
