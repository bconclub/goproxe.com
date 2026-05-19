'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FiGlobe,
  FiInstagram,
  FiMessageCircle,
  FiMail,
  FiMic,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiLock,
  FiServer,
  FiHeadphones,
  FiSlash,
  FiZap,
  FiUsers,
  FiCpu,
  FiCheckCircle,
} from 'react-icons/fi';
import { SiWhatsapp, SiFacebook } from 'react-icons/si';

const CHANNELS_HEADER = [
  { Icon: FiGlobe,       label: 'Web',          color: '#a78bfa' },
  { Icon: SiWhatsapp,    label: 'WhatsApp',     color: '#25d366' },
  { Icon: FiInstagram,   label: 'Instagram DM', color: '#c084fc' },
  { Icon: SiFacebook,    label: 'Messenger',    color: '#60a5fa' },
  { Icon: FiMail,        label: 'Email',        color: '#fbbf24' },
  { Icon: FiMic,         label: 'Voice',        color: '#f472b6' },
];

const STARTER_CHANNELS = [
  { Icon: FiGlobe,       label: 'Website chat',      color: '#a78bfa' },
  { Icon: SiWhatsapp,    label: 'WhatsApp',          color: '#25d366' },
  { Icon: FiInstagram,   label: 'Instagram DM',      color: '#c084fc' },
  { Icon: SiFacebook,    label: 'Facebook Messenger',color: '#60a5fa' },
  { Icon: FiMail,        label: 'Email',             color: '#fbbf24' },
  { Icon: FiMic,         label: 'Voice',             color: '#f472b6' },
];

const STARTER_FEATURES = [
  { Icon: FiCpu,  label: 'Unified memory across channels' },
  { Icon: FiZap,  label: 'Automated follow-ups' },
];

const UNLIMITED_FEATURES = [
  { Icon: FiCpu,        label: 'Unified cross-channel memory' },
  { Icon: FiZap,        label: 'AI follow-ups & reactivation' },
  { Icon: FiUsers,      label: 'Multi-agent orchestration' },
  { Icon: FiCheckCircle,label: 'Priority infrastructure access' },
];

const TRUST = [
  { Icon: FiShield,    top: 'SOC 2',           bot: 'Type II Compliant' },
  { Icon: FiLock,      top: 'Enterprise Grade',bot: 'Security' },
  { Icon: FiServer,    top: '99.9% Uptime',    bot: 'Guaranteed' },
  { Icon: FiGlobe,     top: 'GDPR',            bot: 'Compliant' },
  { Icon: FiHeadphones,top: '24/7 Priority',   bot: 'Support' },
  { Icon: FiSlash,     top: 'No Long Term',    bot: 'Contracts' },
];

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="pricing" className={`pr-section${vis ? ' pr-in' : ''}`}>
      <div className="proxe-container">
        {/* Header */}
        <div className="pr-header">
          <div className="pr-header-left">
            <div className="pr-label">PRICING</div>
            <h2 className="pr-h2">
              Start capturing <span className="pr-h2-grad">every conversation.</span>
            </h2>
            <p className="pr-sub">
              Across every channel. With one unified memory.<br />
              Scale from your first lead to infinite conversations.
            </p>
          </div>

          {/* Right: channel icons → curved lines → central orb + "One memory" callout */}
          <div className="pr-header-vis">
            <div className="pr-channels-row">
              {CHANNELS_HEADER.map((c) => (
                <div key={c.label} className="pr-channel-pip" style={{ color: c.color }}>
                  <span className="pr-channel-pip-ico" style={{ borderColor: `${c.color}55`, background: `${c.color}1a` }}>
                    <c.Icon size={16} />
                  </span>
                  <span className="pr-channel-pip-lbl">{c.label}</span>
                </div>
              ))}
            </div>

            <svg className="pr-channels-lines" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="prLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="rgba(196,181,253,0.6)" />
                  <stop offset="100%" stopColor="rgba(124,58,237,0.85)" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#prLine)" strokeWidth="1.4" strokeLinecap="round">
                <path d="M 50  0 Q 300 50 300 90" />
                <path d="M 150 0 Q 300 50 300 90" />
                <path d="M 250 0 Q 300 50 300 90" />
                <path d="M 350 0 Q 300 50 300 90" />
                <path d="M 450 0 Q 300 50 300 90" />
                <path d="M 550 0 Q 300 50 300 90" />
              </g>
            </svg>

            <div className="pr-hex">
              <svg viewBox="0 0 80 88" aria-hidden="true">
                <defs>
                  <linearGradient id="prHexGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <polygon points="40,3 75,22 75,66 40,85 5,66 5,22"
                  fill="rgba(124,58,237,0.18)" stroke="url(#prHexGrad)" strokeWidth="1.4" />
                <rect x="28" y="32" width="6" height="24" rx="3" fill="#fff" />
                <rect x="37" y="26" width="6" height="36" rx="3" fill="#fff" />
                <rect x="46" y="32" width="6" height="24" rx="3" fill="#fff" />
              </svg>
            </div>

            <div className="pr-callout">
              <div>One memory.</div>
              <div>Every channel.</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="pr-grid">
          {/* Starter */}
          <article className="pr-card">
            <div className="pr-card-tag">STARTER</div>
            <div className="pr-card-price">
              <span className="pr-card-num">$249</span>
              <span className="pr-card-mo">/mo</span>
            </div>

            <div className="pr-card-headline">
              <span className="pr-card-headline-ico"><FiMessageCircle size={14} /></span>
              <span><strong>1,000</strong> AI conversations / month</span>
            </div>

            <ul className="pr-list">
              {STARTER_CHANNELS.map((c) => (
                <li key={c.label}>
                  <span className="pr-list-ico" style={{ color: c.color }}><c.Icon size={14} /></span>
                  <span>{c.label}</span>
                  <span className="pr-list-tick"><FiCheck size={12} /></span>
                </li>
              ))}
              {STARTER_FEATURES.map((f) => (
                <li key={f.label}>
                  <span className="pr-list-ico pr-list-ico--feature"><f.Icon size={14} /></span>
                  <span>{f.label}</span>
                  <span className="pr-list-tick"><FiCheck size={12} /></span>
                </li>
              ))}
            </ul>

            <div className="pr-card-note">
              Perfect for growing businesses getting serious about conversations.
            </div>

            <a href="#book-demo" className="pr-cta pr-cta--ghost">
              Start Free Trial <FiArrowRight size={14} />
            </a>
          </article>

          {/* Unlimited */}
          <article className="pr-card pr-card--popular">
            <div className="pr-card-tag-row">
              <span className="pr-card-tag pr-card-tag--popular">UNLIMITED</span>
              <span className="pr-card-badge">MOST POPULAR</span>
            </div>
            <div className="pr-card-price">
              <span className="pr-card-num">$449</span>
              <span className="pr-card-mo">/mo</span>
            </div>

            <div className="pr-card-headline pr-card-headline--unlimited">
              <span className="pr-card-headline-ico pr-card-headline-ico--inf">∞</span>
              <span><strong className="pr-grad-text">Unlimited</strong> AI conversations</span>
            </div>

            <ul className="pr-list">
              {STARTER_CHANNELS.map((c) => (
                <li key={c.label}>
                  <span className="pr-list-ico" style={{ color: c.color }}><c.Icon size={14} /></span>
                  <span>{c.label}</span>
                  <span className="pr-list-tick"><FiCheck size={12} /></span>
                </li>
              ))}
              {UNLIMITED_FEATURES.map((f) => (
                <li key={f.label}>
                  <span className="pr-list-ico pr-list-ico--feature"><f.Icon size={14} /></span>
                  <span>{f.label}</span>
                  <span className="pr-list-tick"><FiCheck size={12} /></span>
                </li>
              ))}
            </ul>

            <div className="pr-card-note">
              Built for businesses that want to scale acquisition without limits.
            </div>

            <a href="#book-demo" className="pr-cta pr-cta--primary">
              Deploy PROXe <FiArrowRight size={14} />
            </a>
          </article>
        </div>

        {/* Trust strip */}
        <div className="pr-trust">
          {TRUST.map((t) => (
            <div key={t.top} className="pr-trust-item">
              <span className="pr-trust-ico"><t.Icon size={14} /></span>
              <div>
                <div className="pr-trust-top">{t.top}</div>
                <div className="pr-trust-bot">{t.bot}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
