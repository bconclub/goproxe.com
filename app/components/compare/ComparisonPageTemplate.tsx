import Link from 'next/link';
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiInstagram,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiShield,
  FiZap,
} from 'react-icons/fi';
import { FaWhatsapp, FaPhoneAlt, FaCommentDots, FaInstagram, FaEnvelope } from 'react-icons/fa';
import type { ComparisonData } from '../../lib/comparisons';
import ComparisonFaq from './ComparisonFaq';
import IndustryHeader from '../industry/IndustryHeader';

/**
 * The comparison page template, SEO-optimized with crawlable HTML tables,
 * FAQPage JSON-LD, and canonical URLs. Fair positioning: no fabricated metrics,
 * no "#1" claims, honest where each product is stronger.
 */

export default function ComparisonPageTemplate({ comparison }: { comparison: ComparisonData }) {
  return (
    <main className="indp-root" style={{ ['--acc' as string]: '#a78bfa' }}>
      {/* ── Header ── */}
      <IndustryHeader slug="compare" />

      {/* ── Hero ── */}
      {/* Single-column on purpose: the industry hero's two-column grid assumes
          a visual in the second column, which comparison pages don't have, so
          half the viewport rendered empty. */}
      <section className="indp-hero" data-hero="dashboard">
        <div className="indp-hero-tint" aria-hidden />
        <div className="proxe-container indp-hero-inner indp-hero-inner--single">
          <div className="indp-hero-copy">
            <span className="indp-eyebrow">Product Comparison</span>
            <h1 className="indp-h1">{comparison.h1}</h1>
            {comparison.deck && <p className="indp-hero-deck">{comparison.deck}</p>}
            <p className="indp-hero-sub">{comparison.intro}</p>
            <div className="indp-hero-ctas">
              <Link href="/#pricing" className="proxe-btn proxe-btn--primary">
                Deploy PROXe
              </Link>
              <Link href="/" className="proxe-btn proxe-btn--secondary">
                Learn more
              </Link>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="proxe-container">
          <div className="indp-trust">
            <div className="indp-trust-item">
              <FiClock size={17} />
              <div>
                <b>Never miss a lead</b>
                <span>WhatsApp · web · IG · email · voice</span>
              </div>
            </div>
            <div className="indp-trust-item">
              <FiZap size={17} />
              <div>
                <b>Unified memory</b>
                <span>Customers never repeat themselves</span>
              </div>
            </div>
            <div className="indp-trust-item">
              <FiLock size={17} />
              <div>
                <b>Your data stays yours</b>
                <span>Never used to train public models</span>
              </div>
            </div>
            <div className="indp-trust-item">
              <FiShield size={17} />
              <div>
                <b>Live in about a week</b>
                <span>Trained on your business</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Positioning ── */}
      <section className="indp-section">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">What each product does</span>
            <h2 className="indp-h2">At a glance.</h2>
          </div>

          <div className="compare-positioning">
            <div className="compare-pos-card">
              <h3>PROXe</h3>
              <p>
                Multi-channel AI lead conversion OS with unified memory. Captures and converts
                leads across WhatsApp, website, Instagram, email, and voice. Built for coaches,
                clinics, real estate agents, and wellness businesses in Bangalore.
              </p>
            </div>
            <div className="compare-pos-card">
              <h3>{comparison.competitor.name}</h3>
              <p>{comparison.competitor.positioning}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Verdict table (crawlable HTML table for SEO) ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Side by side</span>
            <h2 className="indp-h2">The verdict table.</h2>
          </div>

          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>PROXe</th>
                  <th>{comparison.competitor.name}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.verdictTable.map((row, i) => (
                  <tr key={i}>
                    <td className="compare-table-dim">{row.dimension}</td>
                    <td>{row.proxe}</td>
                    <td>{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Where competitor is stronger ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Fair comparison</span>
            <h2 className="indp-h2">Where {comparison.competitor.name} is stronger.</h2>
          </div>

          <div className="compare-strengths">
            {comparison.competitorStrengths.map((strength, i) => (
              <div key={i} className="compare-strength-card">
                <h3>{strength.title}</h3>
                <p>{strength.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where PROXe is stronger ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <h2 className="indp-h2">Where PROXe is stronger.</h2>
          </div>

          <div className="compare-strengths">
            {comparison.proxeStrengths.map((strength, i) => (
              <div key={i} className="compare-strength-card compare-strength-card--proxe">
                <h3>{strength.title}</h3>
                <p>{strength.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coexistence note ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="compare-coexist">
            <h3>Can they coexist?</h3>
            <p>{comparison.coexistenceNote}</p>
          </div>
        </div>
      </section>

      {/* ── ICP scenarios ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Real-world scenarios</span>
            <h2 className="indp-h2">Which one for your business?</h2>
          </div>

          <div className="compare-scenarios">
            {comparison.icpScenarios.map((scenario, i) => (
              <div key={i} className="compare-scenario">
                <div className="compare-scenario-q">
                  <FiMessageCircle size={16} />
                  <p>{scenario.scenario}</p>
                </div>
                <div className="compare-scenario-a">
                  <FiCheckCircle size={16} />
                  <p>{scenario.verdict}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Channel row ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-channels">
            <div className="indp-center">
              <span className="indp-label">PROXe captures leads everywhere</span>
              <h2 className="indp-h2 indp-h2--sm">One platform. Every channel.</h2>
            </div>
            <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="indp-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f9ce34" />
                  <stop offset="45%" stopColor="#ee2a7b" />
                  <stop offset="100%" stopColor="#6228d7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="indp-channel-row">
              <div className="indp-channel" style={{ ['--ch' as string]: '#a78bfa' }}>
                <span className="indp-channel-ico">
                  <FaPhoneAlt size={20} />
                </span>
                <b>Phone Calls</b>
                <span>Inbound &amp; outbound</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#25d366' }}>
                <span className="indp-channel-ico">
                  <FaWhatsapp size={23} />
                </span>
                <b>WhatsApp</b>
                <span>Business API</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#38bdf8' }}>
                <span className="indp-channel-ico">
                  <FaCommentDots size={22} />
                </span>
                <b>Web Chat</b>
                <span>Live on your website</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#e1306c' }}>
                <span className="indp-channel-ico indp-channel-ico--ig">
                  <FaInstagram size={22} />
                </span>
                <b>Instagram</b>
                <span>DMs &amp; lead ads</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#f59e0b' }}>
                <span className="indp-channel-ico">
                  <FaEnvelope size={20} />
                </span>
                <b>Email</b>
                <span>Smart follow-ups</span>
              </div>
            </div>
            <p className="indp-channels-note">
              Every conversation writes back to one system with unified memory, so your team stays in
              sync and customers never repeat themselves.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Common questions</span>
            <h2 className="indp-h2 indp-h2--sm">Everything you need to know.</h2>
          </div>
          <ComparisonFaq slug={comparison.slug} items={comparison.faq} />
        </div>
      </section>

      {/* ── Closing band ── */}
      <section className="indp-close">
        <div className="proxe-container">
          <div className="indp-close-band">
            <h2 className="indp-h2">Never miss a lead ever again.</h2>
            <p className="indp-close-sub">
              PROXe captures and converts leads across WhatsApp, website, Instagram, email, and
              voice with unified memory. Deployed and trained on your business in about a week.
            </p>
            <div className="indp-close-cta">
              <Link href="/#pricing" className="proxe-btn proxe-btn--primary">
                Deploy PROXe
              </Link>
              <Link href="/" className="proxe-btn proxe-btn--secondary">
                Learn more
              </Link>
            </div>
            <div className="indp-close-checks">
              <span>
                <FiCheck size={13} /> Setup in about a week
              </span>
              <span>
                <FiCheck size={13} /> Every channel included
              </span>
              <span>
                <FiCheck size={13} /> Unified memory
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cross-links ── */}
      <section className="compare-crosslinks">
        <div className="proxe-container">
          <div className="compare-crosslinks-inner">
            <h3>More comparisons</h3>
            <div className="compare-crosslinks-grid">
              {['proxe-vs-wati', 'proxe-vs-interakt', 'proxe-vs-aisensy']
                .filter((slug) => slug !== comparison.slug)
                .map((slug) => (
                  <Link key={slug} href={`/compare/${slug}`} className="compare-crosslink">
                    {slug === 'proxe-vs-wati' && 'PROXe vs Wati'}
                    {slug === 'proxe-vs-interakt' && 'PROXe vs Interakt'}
                    {slug === 'proxe-vs-aisensy' && 'PROXe vs AiSensy'}
                    <FiArrowRight size={14} />
                  </Link>
                ))}
            </div>
            <div className="compare-crosslinks-more">
              <Link href="/#pricing">View pricing</Link>
              <Link href="/industries/coaching">PROXe for Coaching</Link>
              <Link href="/industries/clinics">PROXe for Clinics</Link>
              <Link href="/industries/realestate">PROXe for Real Estate</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
