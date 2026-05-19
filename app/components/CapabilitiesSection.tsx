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
  FiDatabase,
  FiActivity,
} from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';

/* ─────────────────────────────────────────────────────────────
   ORB — SVG-based: glowing core + radiating rays + orbit rings + particles
───────────────────────────────────────────────────────────── */
function UnifiedMemoryOrb() {
  return (
    <svg className="cap-orb-svg" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="capOrbCore" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#f5f3ff" />
          <stop offset="35%"  stopColor="#c4b5fd" />
          <stop offset="70%"  stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>
        <radialGradient id="capOrbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(167,139,250,0.55)" />
          <stop offset="60%"  stopColor="rgba(124,58,237,0.18)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
        <linearGradient id="capRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(196,181,253,0)" />
          <stop offset="55%"  stopColor="rgba(196,181,253,0.55)" />
          <stop offset="100%" stopColor="rgba(196,181,253,0.95)" />
        </linearGradient>
      </defs>

      {/* Soft outer glow */}
      <circle cx="100" cy="100" r="92" fill="url(#capOrbGlow)" />

      {/* Orbit rings */}
      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(167,139,250,0.12)" strokeWidth="1" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(167,139,250,0.18)" strokeWidth="1" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="rgba(167,139,250,0.28)" strokeWidth="1" />

      {/* Radiating rays — 8-point star */}
      <g className="cap-orb-rays" stroke="url(#capRay)" strokeWidth="1.6" strokeLinecap="round">
        <line x1="100" y1="100" x2="100" y2="35" />
        <line x1="100" y1="100" x2="100" y2="165" />
        <line x1="100" y1="100" x2="35"  y2="100" />
        <line x1="100" y1="100" x2="165" y2="100" />
        <line x1="100" y1="100" x2="55"  y2="55"  />
        <line x1="100" y1="100" x2="145" y2="55"  />
        <line x1="100" y1="100" x2="55"  y2="145" />
        <line x1="100" y1="100" x2="145" y2="145" />
      </g>

      {/* Particles on orbits */}
      <g className="cap-orb-dots">
        <circle cx="100" cy="20"  r="2.6" fill="#c4b5fd" />
        <circle cx="180" cy="100" r="2.2" fill="#c4b5fd" opacity="0.85" />
        <circle cx="100" cy="180" r="2.6" fill="#c4b5fd" />
        <circle cx="20"  cy="100" r="2.2" fill="#c4b5fd" opacity="0.85" />
        <circle cx="40"  cy="40"  r="1.8" fill="#e9d5ff" opacity="0.7" />
        <circle cx="160" cy="160" r="1.8" fill="#e9d5ff" opacity="0.7" />
      </g>

      {/* Glowing core */}
      <circle cx="100" cy="100" r="20" fill="url(#capOrbCore)" />
      <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
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
  return (
    <div className="cap-mini cap-mini--const">
      <svg className="cap-mini-grid" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="100" cy="50" r="36" fill="none" stroke="rgba(167,139,250,0.18)" strokeDasharray="2 4" />
        <circle cx="100" cy="50" r="20" fill="none" stroke="rgba(167,139,250,0.28)" strokeDasharray="2 4" />
      </svg>
      <MiniCenterOrb />
      <span className="cap-mini-ico cap-mini-ico--n" style={{ color: '#25d366' }}><SiWhatsapp size={13} /></span>
      <span className="cap-mini-ico cap-mini-ico--e" style={{ color: '#a78bfa' }}><FiMessageCircle size={13} /></span>
      <span className="cap-mini-ico cap-mini-ico--s" style={{ color: '#60a5fa' }}><FiPhone size={13} /></span>
      <span className="cap-mini-ico cap-mini-ico--w" style={{ color: '#c084fc' }}><FiMail size={13} /></span>
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
  // Wide, horizontal — shows the spread of specialized agents
  return (
    <div className="cap-mini cap-mini--agents">
      <svg className="cap-mini-grid" viewBox="0 0 320 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 40 40 Q 90  10 160 40" fill="none" stroke="rgba(167,139,250,0.35)" strokeDasharray="2 3" />
        <path d="M 160 40 Q 230 10 280 40" fill="none" stroke="rgba(167,139,250,0.35)" strokeDasharray="2 3" />
        <path d="M 40 40 Q 90  70 160 40" fill="none" stroke="rgba(167,139,250,0.25)" strokeDasharray="2 3" />
        <path d="M 160 40 Q 230 70 280 40" fill="none" stroke="rgba(167,139,250,0.25)" strokeDasharray="2 3" />
      </svg>
      <span className="cap-mini-ico cap-mini-ico--ag-l" style={{ color: '#25d366' }}><SiWhatsapp size={12} /></span>
      <span className="cap-mini-ico cap-mini-ico--ag-ml" style={{ color: '#a78bfa' }}><FiMessageCircle size={11} /></span>
      <MiniCenterOrb />
      <span className="cap-mini-ico cap-mini-ico--ag-mr" style={{ color: '#60a5fa' }}><FiPhone size={11} /></span>
      <span className="cap-mini-ico cap-mini-ico--ag-r" style={{ color: '#c084fc' }}><FiMail size={12} /></span>
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

  // Order matters: in the bento, capture / followup stack on the right
  // beside the hero; then agents (wide) + security sit in the bottom row.
  const sideCards = [
    { id: 'capture',  Icon: FiZap,    title: '24/7 Lead Capture',   desc: 'Every channel listens all day. No form, message, or call is ever missed.', Vis: ChannelConstellation },
    { id: 'followup', Icon: FiSend,   title: 'Auto Follow-Ups',     desc: 'AI sequences the perfect next steps until they book, buy, or opt out.',    Vis: FollowupFlow },
    { id: 'agents',   Icon: FiUsers,  title: 'Multi-Agent System',  desc: 'Specialized agents work across web, WhatsApp, voice, email, and SMS.',     Vis: AgentNetwork },
    { id: 'security', Icon: FiShield, title: 'Enterprise Security', desc: 'SOC2-aligned controls, encrypted at rest and in transit.',                  Vis: ShieldVis },
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
                  <span className="cap-stat-ico" aria-hidden="true">∞</span>
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

            {/* ── 4 side cards (bento — agents is the wide one) ── */}
            {sideCards.map((c) => (
              <article key={c.id} className={`cap-card cap-card--${c.id}`}>
                <span className="cap-card-icon"><c.Icon size={18} /></span>
                <h4 className="cap-card-title">{c.title}</h4>
                <p className="cap-card-desc">{c.desc}</p>
                <c.Vis />
                <a className="cap-card-link" href="#" onClick={(e) => e.preventDefault()}>
                  Learn more <span>→</span>
                </a>
              </article>
            ))}
          </div>

          {/* Compliance row inside the frame */}
          <div className="cap-badges">
            {[
              { Icon: FiShield,      top: 'SOC 2',         bot: 'Type II Compliant' },
              { Icon: FiLock,        top: 'End-to-End',    bot: 'Encrypted' },
              { Icon: FiCheckCircle, top: 'GDPR',          bot: 'Compliant' },
              { Icon: FiDatabase,    top: 'Multi-Channel', bot: 'Connected' },
              { Icon: FiActivity,    top: 'Always On',     bot: 'Never Miss a Lead' },
            ].map((b) => (
              <div key={b.top} className="cap-badge">
                <span className="cap-badge-ico"><b.Icon size={14} /></span>
                <div>
                  <div className="cap-badge-top">{b.top}</div>
                  <div className="cap-badge-bot">{b.bot}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
