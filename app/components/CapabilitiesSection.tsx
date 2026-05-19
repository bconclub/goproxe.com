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
import { SiWhatsapp } from 'react-icons/si';

/* ─────────────────────────────────────────────────────────────
   ORB — SVG-based: glowing core + radiating rays + orbit rings + particles
───────────────────────────────────────────────────────────── */
function UnifiedMemoryOrb() {
  return (
    <svg className="cap-orb-svg" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        {/* Outer halo */}
        <radialGradient id="capOrbHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(167,139,250,0.65)" />
          <stop offset="35%"  stopColor="rgba(124,58,237,0.32)" />
          <stop offset="70%"  stopColor="rgba(124,58,237,0.10)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
        {/* Core sphere — top-left highlight, deep purple core */}
        <radialGradient id="capOrbCore" cx="38%" cy="32%" r="68%">
          <stop offset="0%"   stopColor="#f5f3ff" />
          <stop offset="25%"  stopColor="#ddd6fe" />
          <stop offset="55%"  stopColor="#a78bfa" />
          <stop offset="85%"  stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>
        {/* Bar gradient inside */}
        <linearGradient id="capOrbBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.65)" />
        </linearGradient>
      </defs>

      {/* Outer halo glow */}
      <circle cx="120" cy="120" r="118" fill="url(#capOrbHalo)" />

      {/* Elliptical orbit rings — 3 at different rotations for an atom feel */}
      <g className="cap-orb-orbits">
        <ellipse cx="120" cy="120" rx="105" ry="42"
          fill="none" stroke="rgba(167,139,250,0.30)" strokeWidth="0.9" />
        <ellipse cx="120" cy="120" rx="105" ry="42"
          fill="none" stroke="rgba(167,139,250,0.22)" strokeWidth="0.9"
          transform="rotate(60 120 120)" />
        <ellipse cx="120" cy="120" rx="105" ry="42"
          fill="none" stroke="rgba(167,139,250,0.16)" strokeWidth="0.9"
          transform="rotate(-60 120 120)" />
      </g>

      {/* Particles on the orbits */}
      <g className="cap-orb-dots">
        <circle r="2.4" fill="#e9d5ff">
          <animateMotion dur="9s" repeatCount="indefinite"
            path="M 15 120 A 105 42 0 1 0 225 120 A 105 42 0 1 0 15 120 Z" />
        </circle>
        <circle r="2" fill="#c4b5fd" opacity="0.85">
          <animateMotion dur="11s" repeatCount="indefinite" rotate="60"
            path="M 15 120 A 105 42 0 1 0 225 120 A 105 42 0 1 0 15 120 Z" />
        </circle>
        <circle r="1.8" fill="#e9d5ff" opacity="0.75">
          <animateMotion dur="13s" repeatCount="indefinite" rotate="-60"
            path="M 15 120 A 105 42 0 1 0 225 120 A 105 42 0 1 0 15 120 Z" />
        </circle>
      </g>

      {/* Sphere core */}
      <circle cx="120" cy="120" r="44" fill="url(#capOrbCore)" />
      {/* Specular highlight */}
      <ellipse cx="106" cy="103" rx="18" ry="9" fill="rgba(255,255,255,0.35)" />

      {/* PROXe brain bars — 3 vertical pills inside the core */}
      <g>
        <rect x="106" y="100" width="6" height="40" rx="3" fill="url(#capOrbBar)" />
        <rect x="117" y="93"  width="6" height="54" rx="3" fill="url(#capOrbBar)" />
        <rect x="128" y="100" width="6" height="40" rx="3" fill="url(#capOrbBar)" />
      </g>
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
                {/* Curved glowing connector lines from each channel row to the orb */}
                <svg className="cap-connectors" viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="capConnGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="rgba(167,139,250,0.05)" />
                      <stop offset="50%"  stopColor="rgba(167,139,250,0.55)" />
                      <stop offset="100%" stopColor="rgba(196,181,253,0.85)" />
                    </linearGradient>
                  </defs>
                  <g fill="none" stroke="url(#capConnGrad)" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M 200 50  C 260 70,  290 130, 300 160" />
                    <path d="M 200 120 C 260 130, 290 150, 300 160" />
                    <path d="M 200 200 C 260 190, 290 170, 300 160" />
                    <path d="M 200 270 C 260 250, 290 200, 300 160" />
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

            {/* ── 4 side cards ── */}
            {sideCards.map((c) => (
              <article key={c.id} className={`cap-card cap-card--${c.id}`}>
                <span className="cap-card-icon"><c.Icon size={18} /></span>
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
