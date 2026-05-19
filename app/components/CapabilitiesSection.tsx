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
  FiGlobe,
  FiClock,
  FiCheckCircle,
  FiLock,
  FiDatabase,
} from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';

/* ─────────────────────────────────────────────────────────────
   Small reusable bits
───────────────────────────────────────────────────────────── */
function MiniOrb({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={`cap-mini-orb ${className}`}>{children}</div>;
}

/* ─────────────────────────────────────────────────────────────
   Hero card visualization — channels → orb → profile/memory
───────────────────────────────────────────────────────────── */
function HeroVis() {
  return (
    <div className="cap-hero-vis">
      {/* Background grid + glow */}
      <div className="cap-hero-vis-bg" aria-hidden />

      {/* LEFT — channel feed */}
      <div className="cap-channels">
        {[
          { Icon: SiWhatsapp,      name: 'WhatsApp',     sub: '11:32 AM · New message',     color: '#25d366' },
          { Icon: FiMessageCircle, name: 'Website Chat', sub: '09:15 AM · Pricing question', color: '#a78bfa' },
          { Icon: FiPhone,         name: 'Voice Call',   sub: 'Yesterday · 02:18',           color: '#60a5fa' },
          { Icon: FiMail,          name: 'Email',        sub: '10:45 AM · Integration query',color: '#c084fc' },
        ].map((c, i) => (
          <div key={c.name} className="cap-channel" style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="cap-channel-ico" style={{ background: `linear-gradient(135deg, ${c.color}33, ${c.color}1a)`, color: c.color, borderColor: `${c.color}55` }}>
              <c.Icon size={14} />
            </span>
            <div className="cap-channel-txt">
              <div className="cap-channel-name">{c.name}</div>
              <div className="cap-channel-sub">{c.sub}</div>
            </div>
            <span className="cap-channel-line" />
          </div>
        ))}
      </div>

      {/* CENTER — glowing orb with orbiting particles */}
      <div className="cap-orb">
        <div className="cap-orb-ring cap-orb-ring--1" />
        <div className="cap-orb-ring cap-orb-ring--2" />
        <div className="cap-orb-ring cap-orb-ring--3" />
        <div className="cap-orb-particle cap-orb-particle--1" />
        <div className="cap-orb-particle cap-orb-particle--2" />
        <div className="cap-orb-particle cap-orb-particle--3" />
        <div className="cap-orb-core">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v18M5 12h14M7 7l10 10M17 7L7 17" stroke="rgba(255,255,255,0.92)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* RIGHT — profile card + memory card */}
      <div className="cap-right">
        <div className="cap-profile">
          <div className="cap-profile-tag">PERSISTENT CUSTOMER PROFILE</div>
          <ul>
            <li><span>✦</span> Preferences</li>
            <li><span>◷</span> History</li>
            <li><span>◆</span> Intent</li>
            <li><span>◇</span> Context</li>
          </ul>
        </div>
        <div className="cap-memory">
          <div className="cap-memory-hdr">
            <span className="cap-memory-dot" />
            <span className="cap-memory-name">AI Memory</span>
            <span className="cap-memory-time">Just now</span>
          </div>
          <p>Knows they&rsquo;re evaluating integration, asked about pricing, prefers WhatsApp.</p>
          <span className="cap-memory-cta">Continuing conversation<span className="cap-memory-ellipsis">…</span></span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Small per-card mini visualizations
───────────────────────────────────────────────────────────── */
function ChannelConstellation() {
  return (
    <div className="cap-vis cap-vis--const">
      <MiniOrb className="cap-mini-orb--center"><span /></MiniOrb>
      <MiniOrb className="cap-mini-orb--n"><SiWhatsapp size={12} color="#25d366" /></MiniOrb>
      <MiniOrb className="cap-mini-orb--e"><FiMessageCircle size={12} color="#a78bfa" /></MiniOrb>
      <MiniOrb className="cap-mini-orb--s"><FiPhone size={12} color="#60a5fa" /></MiniOrb>
      <MiniOrb className="cap-mini-orb--w"><FiMail size={12} color="#c084fc" /></MiniOrb>
    </div>
  );
}

function FollowupFlow() {
  return (
    <div className="cap-vis cap-vis--flow">
      <span className="cap-flow-step"><FiMessageCircle size={12} /></span>
      <span className="cap-flow-arrow">···</span>
      <span className="cap-flow-step"><FiMail size={12} /></span>
      <span className="cap-flow-arrow">···</span>
      <span className="cap-flow-step"><FiClock size={12} /></span>
      <span className="cap-flow-arrow">···</span>
      <span className="cap-flow-step cap-flow-step--done"><FiCheckCircle size={12} /></span>
    </div>
  );
}

function AgentNetwork() {
  return (
    <div className="cap-vis cap-vis--agents">
      <MiniOrb className="cap-mini-orb--center"><FiUsers size={12} /></MiniOrb>
      <MiniOrb className="cap-mini-orb--agent cap-mini-orb--ag1"><FiUsers size={10} /></MiniOrb>
      <MiniOrb className="cap-mini-orb--agent cap-mini-orb--ag2"><FiUsers size={10} /></MiniOrb>
    </div>
  );
}

function ShieldVis() {
  return (
    <div className="cap-vis cap-vis--shield">
      <div className="cap-shield-rings">
        <span /><span /><span />
      </div>
      <div className="cap-shield-core"><FiLock size={16} /></div>
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
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sideCards = [
    {
      Icon: FiZap,
      title: '24/7 Lead Capture',
      desc: 'Every channel listens all day. No form, message, or call is ever missed.',
      Vis: ChannelConstellation,
      tint: 'rgba(124,58,237,0.20)',
    },
    {
      Icon: FiSend,
      title: 'Auto Follow-Ups',
      desc: 'AI sequences the perfect next steps until they book, buy, or opt out.',
      Vis: FollowupFlow,
      tint: 'rgba(167,139,250,0.20)',
    },
    {
      Icon: FiUsers,
      title: 'Multi-Agent System',
      desc: 'Specialized agents work across web, WhatsApp, voice, email, and SMS.',
      Vis: AgentNetwork,
      tint: 'rgba(99,102,241,0.20)',
    },
    {
      Icon: FiShield,
      title: 'Enterprise Security',
      desc: 'SOC2-aligned controls, encrypted at rest and in transit.',
      Vis: ShieldVis,
      tint: 'rgba(192,132,252,0.20)',
    },
  ];

  return (
    <section ref={ref} className={`cap-section${vis ? ' cap-in' : ''}`}>
      <div className="proxe-container">
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

        <div className="cap-grid">
          {/* ── Hero (left, spans full height) ── */}
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
            <HeroVis />
            <div className="cap-hero-stats">
              <div className="cap-stat">
                <span className="cap-stat-ico">⊙</span>
                <div>
                  <div className="cap-stat-val">100%</div>
                  <div className="cap-stat-lbl">Context Retention</div>
                </div>
              </div>
              <div className="cap-stat">
                <span className="cap-stat-ico">∞</span>
                <div>
                  <div className="cap-stat-val">∞</div>
                  <div className="cap-stat-lbl">Cross-Channel Memory</div>
                </div>
              </div>
              <div className="cap-stat">
                <span className="cap-stat-ico"><FiZap size={14} /></span>
                <div>
                  <div className="cap-stat-val">24/7</div>
                  <div className="cap-stat-lbl">Always Remembering</div>
                </div>
              </div>
            </div>
          </article>

          {/* ── Side cards (2x2 grid on desktop) ── */}
          {sideCards.map((c) => (
            <article key={c.title} className="cap-card">
              <span className="cap-card-icon" style={{ background: c.tint }}>
                <c.Icon size={18} />
              </span>
              <h4 className="cap-card-title">{c.title}</h4>
              <p className="cap-card-desc">{c.desc}</p>
              <c.Vis />
              <a className="cap-card-link" href="#" onClick={(e) => e.preventDefault()}>
                Learn more <span>→</span>
              </a>
            </article>
          ))}
        </div>

        {/* ── Bottom compliance badges ── */}
        <div className="cap-badges">
          {[
            { Icon: FiShield, top: 'SOC 2', bot: 'Type II Compliant' },
            { Icon: FiLock, top: 'End-to-End', bot: 'Encrypted' },
            { Icon: FiCheckCircle, top: 'GDPR', bot: 'Compliant' },
            { Icon: FiDatabase, top: 'Multi-Channel', bot: 'Connected' },
            { Icon: FiGlobe, top: 'Always On', bot: 'Never Miss a Lead' },
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
    </section>
  );
}
