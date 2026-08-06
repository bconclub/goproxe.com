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
  FiUser,
  FiCpu,
  FiHeart,
  FiTarget,
  FiLayers,
} from 'react-icons/fi';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';
import { FiGlobe } from 'react-icons/fi';

/* ─────────────────────────────────────────────────────────────
   UnifiedMemoryVis — full visualization block with JS-measured
   connector lines. Each line is drawn from the actual right edge
   of a channel card (or left edge of a right-column card) to the
   orb's rim, using `getBoundingClientRect()` measurements that
   update on resize. This is the only way to make the lines truly
   touch the cards across every viewport width.
───────────────────────────────────────────────────────────── */
type Line = { x1: number; y1: number; x2: number; y2: number; color: string };

function UnifiedMemoryVis() {
  const CHANNELS = [
    { Icon: SiWhatsapp,      name: 'WhatsApp',     sub: '11:32 AM · New message',     color: '#25d366' },
    { Icon: FiMessageCircle, name: 'Website Chat', sub: '09:15 AM · Pricing question', color: '#a78bfa' },
    { Icon: FiPhone,         name: 'Voice Call',   sub: 'Yesterday · 02:18',           color: '#60a5fa' },
    { Icon: FiMail,          name: 'Email',        sub: '10:45 AM · Integration query',color: '#c084fc' },
  ];

  const visRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const channelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);
  const memoryRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const measure = () => {
      const container = visRef.current;
      const orbEl = orbRef.current;
      if (!container || !orbEl) return;
      const c = container.getBoundingClientRect();
      const o = orbEl.getBoundingClientRect();
      const oCx = o.left + o.width / 2 - c.left;
      const oCy = o.top + o.height / 2 - c.top;
      // Effective rim radius — orb is ~140px wide, sphere ~72px in CSS,
      // we want lines to terminate just at the visible glowing edge.
      const oRadius = Math.min(o.width, o.height) * 0.30;

      const result: Line[] = [];

      // Left side — from each channel card's right edge to orb's rim
      channelRefs.current.forEach((card) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x1 = r.right - c.left;
        const y1 = r.top + r.height / 2 - c.top;
        const dx = oCx - x1;
        const dy = oCy - y1;
        const dist = Math.hypot(dx, dy) || 1;
        // Terminate the line at the orb rim, not the orb center
        const x2 = oCx - (dx / dist) * oRadius;
        const y2 = oCy - (dy / dist) * oRadius;
        const index = channelRefs.current.indexOf(card);
        result.push({ x1, y1, x2, y2, color: CHANNELS[index]?.color ?? '#c4b5fd' });
      });

      // Right side — from orb rim to profile + memory tiles
      [profileRef.current, memoryRef.current].forEach((card) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x2 = r.left - c.left;
        const y2 = r.top + r.height / 2 - c.top;
        const dx = x2 - oCx;
        const dy = y2 - oCy;
        const dist = Math.hypot(dx, dy) || 1;
        const x1 = oCx + (dx / dist) * oRadius;
        const y1 = oCy + (dy / dist) * oRadius;
        result.push({ x1, y1, x2, y2, color: '#a78bfa' });
      });

      setLines(result);
    };

    // First paint + after fonts load
    measure();
    const raf = requestAnimationFrame(measure);

    // Resize observer on container so lines recompute when card sizes change
    let ro: ResizeObserver | null = null;
    if (visRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(visRef.current);
    }
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, []);

  return (
    <div className="cap-hero-vis" ref={visRef}>
      {/* SVG sits at z-index 0 behind the cards; lines use absolute
          pixel coords measured by the effect above. */}
      <svg className="cap-connectors" aria-hidden="true">
        {lines.map((l, i) => (
          <g key={i} className="cap-connector">
            <path
              className="cap-connector-path"
              d={`M ${l.x1} ${l.y1} C ${l.x1 + (l.x2 > l.x1 ? 44 : -44)} ${l.y1}, ${l.x2 - (l.x2 > l.x1 ? 44 : -44)} ${l.y2}, ${l.x2} ${l.y2}`}
              stroke={l.color}
              strokeWidth="1.25"
              strokeLinecap="round"
              pathLength={1}
              fill="none"
            />
            <circle className="cap-connector-dot cap-connector-dot--source" cx={l.x1} cy={l.y1} r="2.7" fill={l.color} />
            <circle className="cap-connector-dot cap-connector-dot--hub" cx={l.x2} cy={l.y2} r="3" fill="#f5f3ff" />
          </g>
        ))}
      </svg>

      {/* LEFT: channel feed */}
      <div className="cap-channels">
        {CHANNELS.map((c, i) => (
          <div
            key={c.name}
            className="cap-channel"
            ref={(el) => { channelRefs.current[i] = el; }}
            style={{ ['--accent' as keyof React.CSSProperties as string]: c.color }}
          >
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
      <div className="cap-orb-wrap" ref={orbRef}>
        <UnifiedMemoryOrb />
      </div>

      {/* RIGHT: profile + memory */}
      <div className="cap-right">
        <div className="cap-profile" ref={profileRef}>
          <div className="cap-profile-tag">PERSISTENT CUSTOMER PROFILE</div>
          <ul>
            <li><FiHeart size={15} /> Preferences</li>
            <li><FiClock size={15} /> History</li>
            <li><FiTarget size={15} /> Intent</li>
            <li><FiLayers size={15} /> Context</li>
          </ul>
        </div>
        <div className="cap-memory" ref={memoryRef}>
          <div className="cap-memory-hdr">
            <span className="cap-memory-av"><FiCpu size={11} /></span>
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
  const steps = [
    { Icon: FiUser, label: 'Lead' },
    { Icon: FiMessageCircle, label: 'Message' },
    { Icon: FiClock, label: 'Reminder' },
    { Icon: FiCheckCircle, label: 'Booked', done: true },
  ];

  return (
    <div className="cap-mini cap-mini--flow">
      {steps.map((step, index) => (
        <div className="cap-flow-step" key={step.label}>
          <span className={`cap-flow-node${step.done ? ' cap-flow-node--done' : ''}`}>
            <step.Icon size={15} />
          </span>
          <span className="cap-flow-label">{step.label}</span>
          {index < steps.length - 1 && <span className="cap-flow-dash" aria-hidden />}
        </div>
      ))}
    </div>
  );
}

function AgentNetwork() {
  // Hub-and-spoke layout:
  //   PROXe orchestrator at center, 5 channel agents orbiting around it.
  //   Concentric rings radiate from center, dashed spoke lines link
  //   each channel to the hub. Each agent shows a tiny status dot.
  //
  //   Positions (viewBox 320×280, center at 160,140):
  //     web       —  top              (160,  44)
  //     voice     —  right             (266, 100)
  //     sms       —  bottom-right      (240, 220)
  //     email     —  bottom-left       ( 80, 220)
  //     whatsapp  —  left              ( 54, 100)
  const nodes = [
    { Icon: FiGlobe,         color: '#a78bfa', label: 'Web',      key: 'web',  cx: 160, cy:  44 },
    { Icon: FiPhone,         color: '#c4b5fd', label: 'Voice',    key: 'voi',  cx: 266, cy: 100 },
    { Icon: FiMessageCircle, color: '#fbbf24', label: 'SMS',      key: 'sms',  cx: 240, cy: 220 },
    { Icon: FiMail,          color: '#60a5fa', label: 'Email',    key: 'mai',  cx:  80, cy: 220 },
    { Icon: SiWhatsapp,      color: '#25d366', label: 'WhatsApp', key: 'wa',   cx:  54, cy: 100 },
  ];
  const cx = 160, cy = 140; // hub center

  return (
    <div className="cap-mini cap-mini--agents">
      <svg className="cap-agent-hub" viewBox="0 0 320 280" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="capHubSpoke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(196,181,253,0.10)" />
            <stop offset="50%"  stopColor="rgba(196,181,253,0.80)" />
            <stop offset="100%" stopColor="rgba(196,181,253,0.10)" />
          </linearGradient>
          <radialGradient id="capHubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(167,139,250,0.55)" />
            <stop offset="60%"  stopColor="rgba(124,58,237,0.20)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </radialGradient>
        </defs>

        {/* Concentric rings */}
        <circle cx={cx} cy={cy} r="36"  fill="none" stroke="rgba(167,139,250,0.18)" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx={cx} cy={cy} r="58"  fill="none" stroke="rgba(167,139,250,0.14)" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx={cx} cy={cy} r="82"  fill="none" stroke="rgba(167,139,250,0.10)" strokeWidth="0.7" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r="108" fill="none" stroke="rgba(167,139,250,0.07)" strokeWidth="0.6" strokeDasharray="2 4" />

        {/* Central hub atmospheric glow */}
        <circle cx={cx} cy={cy} r="60" fill="url(#capHubGlow)" />

        {/* Dashed spoke lines from hub to every channel node */}
        {nodes.map((n) => (
          <line
            key={n.key}
            x1={cx} y1={cy}
            x2={n.cx} y2={n.cy}
            stroke="url(#capHubSpoke)"
            strokeWidth="1.1"
            strokeDasharray="2 4"
          />
        ))}
      </svg>

      {/* Central PROXe orchestrator */}
      <div className="cap-agent-hub-core">
        <img
          src="/proxe/brand/proxe-icon-white.webp"
          alt=""
          aria-hidden="true"
          className="cap-agent-hub-logo"
        />
      </div>

      {/* Channel nodes — positioned in % relative to viewBox 320×280 */}
      {nodes.map((n, i) => (
        <div
          key={n.key}
          className={`cap-agent-orbit-node cap-agent-orbit-node--${n.key}`}
          style={{
            ['--brand' as keyof React.CSSProperties as string]: n.color,
            left:  `${(n.cx / 320) * 100}%`,
            top:   `${(n.cy / 280) * 100}%`,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          <span className="cap-agent-orbit-ring">
            <n.Icon size={18} />
            <span className="cap-agent-orbit-dot" aria-hidden />
          </span>
          <span className="cap-agent-orbit-label">{n.label}</span>
        </div>
      ))}
    </div>
  );
}

/* Compact Unified Memory vis — 4 channel pips at corners feeding lines
   into a small PROXe orb at center. Fits the same .cap-mini box that
   every other side card uses, so the card heights stay uniform. */
function MemoryMiniVis() {
  return (
    <div className="cap-mini cap-mini--mem">
      <svg className="cap-mem-mini-lines" viewBox="0 0 220 130" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="capMemLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(167,139,250,0.10)" />
            <stop offset="100%" stopColor="rgba(196,181,253,0.80)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#capMemLine)" strokeWidth="0.9" strokeDasharray="2 3" strokeLinecap="round">
          <line x1="34"  y1="28"  x2="110" y2="65" />
          <line x1="186" y1="28"  x2="110" y2="65" />
          <line x1="34"  y1="102" x2="110" y2="65" />
          <line x1="186" y1="102" x2="110" y2="65" />
        </g>
        <circle cx="110" cy="65" r="38" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="0.7" strokeDasharray="2 4" />
        <circle cx="110" cy="65" r="56" fill="none" stroke="rgba(167,139,250,0.08)" strokeWidth="0.7" strokeDasharray="2 4" />
      </svg>
      <span className="cap-mem-mini-pip cap-mem-mini-pip--tl" style={{ color: '#25d366' }}><SiWhatsapp size={14} /></span>
      <span className="cap-mem-mini-pip cap-mem-mini-pip--tr" style={{ color: '#a78bfa' }}><FiGlobe size={14} /></span>
      <span className="cap-mem-mini-pip cap-mem-mini-pip--bl" style={{ color: '#60a5fa' }}><FiPhone size={14} /></span>
      <span className="cap-mem-mini-pip cap-mem-mini-pip--br" style={{ color: '#c084fc' }}><FiMail size={14} /></span>
      <span className="cap-mem-mini-core">
        <img src="/proxe/brand/proxe-icon-white.webp" alt="" aria-hidden="true" width={20} height={20} />
      </span>
    </div>
  );
}

function ShieldVis() {
  return (
    <div className="cap-mini cap-mini--shield">
      <svg className="cap-shield-svg" viewBox="0 0 220 150" aria-hidden="true">
        <defs>
          <linearGradient id="capShieldBody" x1="64" y1="20" x2="150" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(196,181,253,0.78)" />
            <stop offset="48%" stopColor="rgba(124,58,237,0.84)" />
            <stop offset="100%" stopColor="rgba(46,16,101,0.92)" />
          </linearGradient>
          <radialGradient id="capShieldGlow" cx="50%" cy="66%" r="54%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.46)" />
            <stop offset="58%" stopColor="rgba(124,58,237,0.18)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="122" rx="76" ry="12" fill="none" stroke="rgba(167,139,250,0.32)" strokeWidth="1" strokeDasharray="3 4" />
        <ellipse cx="110" cy="122" rx="54" ry="8" fill="none" stroke="rgba(196,181,253,0.28)" strokeWidth="0.8" />
        <circle cx="110" cy="80" r="62" fill="url(#capShieldGlow)" />
        <path
          d="M110 23 C124 34 141 39 158 42 C157 83 145 109 110 128 C75 109 63 83 62 42 C79 39 96 34 110 23Z"
          fill="url(#capShieldBody)"
          stroke="rgba(233,213,255,0.78)"
          strokeWidth="1.2"
        />
        <path
          d="M110 36 C121 44 134 48 146 50 C144 80 135 99 110 113 C85 99 76 80 74 50 C86 48 99 44 110 36Z"
          fill="rgba(10,6,30,0.28)"
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="0.8"
        />
        <rect x="91" y="72" width="38" height="34" rx="8" fill="rgba(237,233,254,0.88)" />
        <path d="M99 72 V62 C99 55 104 50 110 50 C116 50 121 55 121 62 V72" fill="none" stroke="rgba(237,233,254,0.9)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="110" cy="88" r="4" fill="#2e1065" />
        <path d="M110 91 V99" stroke="#2e1065" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="cap-security-badges" aria-hidden="true">
        {/* "SOC 2 aligned", not "SOC 2". A bare checkmark next to SOC 2 reads
            as a completed audit and certification we do not hold. Aligned is
            the honest claim: we build to the controls. Change this the day the
            report is actually issued, not before. */}
        <span><FiCheckCircle size={13} /> SOC 2 aligned</span>
        <span><FiLock size={13} /> E2E</span>
        <span><FiZap size={13} /> 99.9%</span>
      </div>
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

  // All 5 cards use the same shell — icon + index top, title + desc,
  // small vis at the bottom. Uniform sizes, no hero treatment.
  const cards = [
    { id: 'capture',  index: '01', Icon: FiZap,    title: '24/7 Lead Capture',   desc: 'Every channel listens. Every lead gets captured.',                         Vis: ChannelConstellation },
    { id: 'followup', index: '02', Icon: FiSend,   title: 'Auto Follow-Ups',     desc: 'AI nudges leads until they book, buy, or opt out.',                        Vis: FollowupFlow },
    { id: 'agents',   index: '03', Icon: FiUsers,  title: 'Multi-Agent System',  desc: 'Specialized agents work together across every touchpoint.',                 Vis: AgentNetwork },
    { id: 'security', index: '04', Icon: FiShield, title: 'Enterprise Security', desc: 'Encrypted, compliant, and built for scale.',                               Vis: ShieldVis },
  ];

  return (
    <section ref={ref} id="features" className={`cap-section${vis ? ' cap-in' : ''}`}>
      <div className="proxe-container">
        {/* Header (outside the framed container) — 2-col: heading left, sub right */}
        <div className="cap-label">
          <span className="cap-label-diamond">◆</span> CAPABILITIES
        </div>
        <div className="cap-section-header">
          <h2 className="cap-h2">
            The infrastructure behind<br />
            <span className="cap-h2-grad">autonomous</span> customer acquisition.
          </h2>
          <p className="cap-sub">
            Every channel connected. Every interaction remembered.<br />
            Every lead continuously moving toward conversion.
          </p>
        </div>

        {/* Single framed container holds everything below */}
        <div className="cap-frame">
          <div className="cap-frame-bg" aria-hidden="true">
            <div className="cap-frame-arc" />
          </div>

          {/* Uniform 3-col grid — 5 same-size cards, identical shell */}
          <div className="cap-grid">
            <article className="cap-hero">
              <div className="cap-hero-tag">
                <span className="cap-hero-tag-ico">✦</span>
                Core Intelligence
              </div>
              <h3 className="cap-hero-title">Unified Memory</h3>
              <p className="cap-hero-sub">
                One memory across every channel.<br />
                Context follows the customer,<br />
                not the conversation.
              </p>
              <UnifiedMemoryVis />
              <div className="cap-hero-stats" aria-label="Unified Memory stats">
                <div className="cap-stat">
                  <span className="cap-stat-ico"><FiCpu size={15} /></span>
                  <span className="cap-stat-val">100%</span>
                  <span className="cap-stat-lbl">Context Retention</span>
                </div>
                <div className="cap-stat cap-stat--memory">
                  <span className="cap-stat-val">∞</span>
                  <span className="cap-stat-lbl">Cross-channel Memory</span>
                </div>
                <div className="cap-stat">
                  <span className="cap-stat-ico"><FiClock size={15} /></span>
                  <span className="cap-stat-val">24/7</span>
                  <span className="cap-stat-lbl">Always On</span>
                </div>
              </div>
            </article>

            {cards.map((c) => (
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
