'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FiGlobe,
  FiInstagram,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiCheck,
  FiArrowRight,
  FiUsers,
  FiAward,
} from 'react-icons/fi';
import { SiWhatsapp, SiMessenger } from 'react-icons/si';
import { useDeployModal } from '../contexts/DeployModalContext';

const CHANNELS_HEADER = [
  { Icon: FiGlobe,       label: 'Web',          color: '#a78bfa' },
  { Icon: SiWhatsapp,    label: 'WhatsApp',     color: '#25d366' },
  { Icon: FiInstagram,   label: 'Instagram DM', color: '#c084fc' },
  { Icon: SiMessenger,   label: 'Messenger',    color: '#60a5fa' },
  { Icon: FiMail,        label: 'Email',        color: '#fbbf24' },
  { Icon: FiPhone,       label: 'Voice',        color: '#f472b6' },
];

const CORE_CHANNELS = [
  { Icon: FiGlobe,       label: 'Website chat',       color: '#a78bfa' },
  { Icon: SiWhatsapp,    label: 'WhatsApp',           color: '#25d366' },
  { Icon: FiInstagram,   label: 'Instagram DM',       color: '#c084fc' },
  { Icon: SiMessenger,   label: 'Facebook Messenger', color: '#60a5fa' },
  { Icon: FiMail,        label: 'Email',              color: '#fbbf24' },
  { Icon: FiPhone,       label: 'Voice',              color: '#f472b6' },
];

const CORE_FEATURES = [
  'Up to 500 leads managed per month',
  'Unified memory across every channel',
  'Live analytics dashboard',
  'Automated follow-ups',
];

const SCALE_FEATURES = [
  'Multi-location deployment',
  'Unlimited seats',
  'Volume-based pricing',
  'Priority support & onboarding',
  'Custom integrations & API access',
  'SOC 2 & GDPR compliance review',
];

/** Currency-specific price strings. INR is the home-market default. */
type Currency = 'inr' | 'usd';
const PRICES: Record<Currency, {
  symbol: string;
  core: string;
  seat: string;
}> = {
  inr: { symbol: '₹', core: '9,999', seat: '₹999' },
  usd: { symbol: '$', core: '149',   seat: '$15' },
};

/**
 * Which market is this visitor in? India → INR, everyone else → USD.
 *
 * Timezone is the strongest signal (it's the device's actual location, and
 * unlike IP it survives most VPNs people use for streaming). Language tags are
 * the backup for travellers/dual-locale setups. If every signal is unreadable
 * we fall back to INR — India is the home market.
 */
function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    // Both spellings are in the wild — Calcutta is the legacy tzdata alias.
    if (/^Asia\/(Kolkata|Calcutta)$/i.test(tz)) return 'inr';

    const locales = [navigator.language, ...(navigator.languages || [])];
    if (locales.some((l) => /-IN\b/i.test(l || ''))) return 'inr';

    // A readable, non-India signal → international pricing.
    if (tz || locales.length) return 'usd';
    return 'inr';
  } catch {
    return 'inr';
  }
}

/** Layout effect on the client, plain effect on the server (no SSR warning). */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [currency, setCurrency] = useState<Currency>('inr');
  const { openModal } = useDeployModal();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.06 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // SSR renders INR, then we correct to the visitor's market. A *layout* effect
  // runs after hydration but BEFORE the browser paints, so international
  // visitors never see ₹9,999 flash to $149 — they only ever see $149.
  useIsomorphicLayoutEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const p = PRICES[currency];

  return (
    <section ref={ref} id="pricing" className={`pr-section${vis ? ' pr-in' : ''}`}>
      <div className="proxe-container">
        {/* Header */}
        <div className="pr-header">
          <div className="pr-header-left">
            <div className="pr-label">PRICING</div>
            <h2 className="pr-h2">
              One plan. <span className="pr-h2-grad">Every channel.</span>
            </h2>
            <p className="pr-sub">
              One flat cost. Every channel, one unified memory,
              your whole team on board.
            </p>

            {/* INR ⇄ USD toggle */}
            <div className="pr-billing-toggle" role="tablist" aria-label="Currency">
              <button
                type="button"
                role="tab"
                aria-selected={currency === 'inr'}
                className={`pr-billing-opt${currency === 'inr' ? ' pr-billing-opt--active' : ''}`}
                onClick={() => setCurrency('inr')}
              >
                🇮🇳 INR
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={currency === 'usd'}
                className={`pr-billing-opt${currency === 'usd' ? ' pr-billing-opt--active' : ''}`}
                onClick={() => setCurrency('usd')}
              >
                🌐 USD
              </button>
            </div>
          </div>

          {/* Right: channel icons → curved lines → central orb */}
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

            <svg className="pr-channels-lines" viewBox="0 0 600 130" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                {CHANNELS_HEADER.map((c, i) => (
                  <linearGradient key={c.label} id={`prLine-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.color} stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.72" />
                  </linearGradient>
                ))}
              </defs>
              {[
                'M 50 8 C 120 28 180 52 300 112',
                'M 150 8 C 190 35 238 58 300 112',
                'M 250 8 C 270 42 286 72 300 112',
                'M 350 8 C 330 42 314 72 300 112',
                'M 450 8 C 410 35 362 58 300 112',
                'M 550 8 C 480 28 420 52 300 112',
              ].map((d, i) => (
                <g key={d} className="pr-channel-wire">
                  <path className="pr-channel-wire-glow" d={d} stroke={`url(#prLine-${i})`} />
                  <path className="pr-channel-wire-line" d={d} stroke={`url(#prLine-${i})`} />
                  <circle className="pr-channel-wire-dot pr-channel-wire-dot--top" cx={[50, 150, 250, 350, 450, 550][i]} cy="8" r="2.4" fill={CHANNELS_HEADER[i].color} />
                </g>
              ))}
              <circle className="pr-channel-wire-dot pr-channel-wire-dot--hub" cx="300" cy="112" r="3.2" fill="#ede9fe" />
            </svg>

            <div className="pr-hex">
              <svg className="pr-hex-frame" viewBox="0 0 80 88" aria-hidden="true">
                <defs>
                  <linearGradient id="prHexGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <polygon points="40,3 75,22 75,66 40,85 5,66 5,22"
                  fill="rgba(124,58,237,0.18)" stroke="url(#prHexGrad)" strokeWidth="1.4" />
              </svg>
              <img
                className="pr-hex-brand"
                src="/proxe/brand/proxe-icon-white.webp"
                alt="PROXe"
                width={36}
                height={36}
              />
            </div>

          </div>
        </div>

        {/* 2-tier cards: Core (hero) · Scale */}
        <div className="pr-grid pr-grid--3 pr-grid--duo">

          {/* ─── PROXe CORE (the everyday plan) ─── */}
          <article className="pr-card pr-card--popular">
            <span className="pr-card-popular-badge">CORE PLAN</span>
            <span className="pr-card-popular-glow" aria-hidden />
            <div className="pr-card-head">
              <div className="pr-card-tier pr-card-tier--popular">PROXe Core</div>
              <div className="pr-card-price">
                <span className="pr-card-num">{p.symbol}{p.core}</span>
                <span className="pr-card-mo">/month</span>
              </div>
              <div className="pr-card-sub">
                Everything you need to capture and convert — live on every channel.
              </div>
            </div>

            <div className="pr-card-marquee pr-card-marquee--unlimited">
              <span className="pr-card-marquee-ico"><FiMessageCircle size={16} /></span>
              <div className="pr-card-marquee-txt">
                <div className="pr-card-marquee-big">
                  <strong className="pr-grad-text">All channels</strong>, one memory
                </div>
                <div className="pr-card-marquee-small">WhatsApp · Web · Instagram · Voice · Dashboard</div>
              </div>
            </div>

            <div className="pr-card-features-label">All channels included:</div>
            <ul className="pr-list pr-list--channels">
              {CORE_CHANNELS.map((c) => (
                <li key={c.label}>
                  <span className="pr-list-ico" style={{ color: c.color }}><c.Icon size={14} /></span>
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>

            <div className="pr-card-features-label">Plus:</div>
            <ul className="pr-list">
              {CORE_FEATURES.map((f) => (
                <li key={f}>
                  <span className="pr-list-tick"><FiCheck size={11} /></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="pr-card-addon">
              <span className="pr-card-addon-ico"><FiUsers size={13} /></span>
              <span><strong>2 seats included.</strong> Extra seats {p.seat}/mo each.</span>
            </div>

            <button type="button" onClick={() => openModal('pricing_core')} className="pr-cta pr-cta--primary">
              Deploy PROXe <FiArrowRight size={14} />
            </button>
          </article>

          {/* ─── SCALE — CUSTOM ─── */}
          <article className="pr-card pr-card--enterprise">
            <span className="pr-card-scale-badge">FOR LARGER TEAMS</span>
            <div className="pr-card-head">
              <div className="pr-card-tier">Scale</div>
              <div className="pr-card-price pr-card-price--custom">
                <span className="pr-card-num pr-card-num--custom">Custom</span>
                <span className="pr-card-mo">volume pricing</span>
              </div>
              <div className="pr-card-sub">
                For multi-location operators that need volume rates and dedicated support.
              </div>
            </div>

            <div className="pr-card-marquee">
              <span className="pr-card-marquee-ico"><FiAward size={16} /></span>
              <div className="pr-card-marquee-txt">
                <div className="pr-card-marquee-big">Tailored to your scale</div>
                <div className="pr-card-marquee-small">Volume pricing + a dedicated team</div>
              </div>
            </div>

            <div className="pr-card-features-label">
              Everything in <span className="pr-grad-text">Core</span>, plus:
            </div>
            <ul className="pr-list">
              {SCALE_FEATURES.map((f) => (
                <li key={f}>
                  <span className="pr-list-tick"><FiCheck size={11} /></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="pr-card-addon">
              <span className="pr-card-addon-ico"><FiPhone size={13} /></span>
              <span><strong>Quoted on a short call.</strong> Custom contracts &amp; invoicing.</span>
            </div>

            <button type="button" onClick={() => openModal('pricing_scale')} className="pr-cta pr-cta--ghost">
              Talk to sales <FiArrowRight size={14} />
            </button>
          </article>

        </div>

      </div>
    </section>
  );
}
