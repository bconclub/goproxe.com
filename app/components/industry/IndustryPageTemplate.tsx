import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import type { Industry } from '../../lib/industries';
import { getPageContent } from '../../lib/industries';
import IndustryCtas from './IndustryCtas';
import IndustryFaq from './IndustryFaq';

/**
 * The one template all 8 industry pages render through. Server component —
 * only the CTAs and the FAQ accordion are client islands.
 *
 * Narrative order is deliberate and fixed:
 *   hero → what's happening (pain) → how PROXe fixes it (1:1) → the steps →
 *   see it running (demo) → proof + price → FAQ → closing CTA.
 * A visitor who reads top to bottom hears: "you have this problem, here is
 * exactly how it goes away, watch it run, here is what it costs."
 */
export default function IndustryPageTemplate({ industry }: { industry: Industry }) {
  const page = getPageContent(industry);
  const { demo } = industry;

  return (
    <main
      className="indp-root"
      style={{ ['--acc' as string]: industry.color }}
    >
      {/* ── Hero ── */}
      <section className="indp-hero">
        {industry.image && (
          <div
            className="indp-hero-photo"
            style={{ backgroundImage: `url(${industry.image})` }}
            aria-hidden
          />
        )}
        <div className="indp-hero-tint" aria-hidden />
        <div className="proxe-container indp-hero-inner">
          <div className="indp-crumb">
            <Link href="/">PROXe</Link>
            <span className="indp-crumb-dot">·</span>
            <Link href="/#industries">Industries</Link>
            <span className="indp-crumb-dot">·</span>
            <span>{industry.title}</span>
          </div>
          <h1 className="indp-h1">{page.heroHeadline}</h1>
          <p className="indp-hero-sub">{page.heroSub}</p>
          <IndustryCtas slug={industry.slug} fireView />
        </div>
      </section>

      {/* ── Pain → Fix, 1:1 ── */}
      <section className="indp-section">
        <div className="proxe-container">
          <span className="indp-label">What&rsquo;s happening</span>
          <h2 className="indp-h2">The leak, and the fix.</h2>
          <p className="indp-section-sub">{page.painIntro}</p>

          {page.painFixes.map(({ pain, fix }, i) => (
            <div key={i} className="indp-pf-row">
              <div className="indp-pf-card indp-pf-card--pain">
                <span className="indp-pf-tag">The problem</span>
                <h3 className="indp-pf-title">{pain.title}</h3>
                <p className="indp-pf-body">{pain.body}</p>
              </div>
              <div className="indp-pf-arrow" aria-hidden>
                <FiArrowRight size={20} />
              </div>
              <div className="indp-pf-card indp-pf-card--fix">
                <span className="indp-pf-tag">With PROXe</span>
                <h3 className="indp-pf-title">{fix.title}</h3>
                <p className="indp-pf-body">{fix.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The steps ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <span className="indp-label">Day to day</span>
          <h2 className="indp-h2">How it runs, step by step.</h2>
          <p className="indp-section-sub">
            No new software to learn. PROXe works your existing channels and
            hands you one dashboard where everything lands.
          </p>
          <div className="indp-steps">
            {page.steps.map((s, i) => {
              const Icon = s.Icon;
              return (
                <div key={i} className="indp-step">
                  <span className="indp-step-ico"><Icon size={19} /></span>
                  <h3 className="indp-step-title">{s.title}</h3>
                  <p className="indp-step-body">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── See it running ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-demo-band">
            <div className="indp-demo-copy">
              <span className="indp-label">Live demo</span>
              <h2 className="indp-h2">Watch PROXe run a business like yours.</h2>
              <p>
                A live dashboard for &ldquo;{demo.business.name}&rdquo; — leads
                arriving, chats being answered, {demo.bookingNoun.toLowerCase()}s
                landing. Click around, open conversations, talk to the agent.
                No sign-up, nothing to install.
              </p>
              <IndustryCtas slug={industry.slug} />
            </div>
            {/* CSS-only teaser of the demo — real persona names from the same
                registry the demo itself uses, so it never goes stale. */}
            <div className="indp-mini" aria-hidden>
              <div className="indp-mini-top">
                <span className="indp-mini-ava">{demo.business.initials}</span>
                {demo.business.name}
                <span className="indp-mini-live">● LIVE</span>
              </div>
              <div className="indp-mini-body">
                <div className="indp-mini-nav">
                  <span>Inbox</span>
                  <span>Leads</span>
                  <span>Pipeline</span>
                  <span>Analytics</span>
                </div>
                <div className="indp-mini-rows">
                  <div className="indp-mini-row indp-mini-row--new">
                    <b>{demo.personas[0]}</b> {demo.sources[0]} <em>new lead</em>
                  </div>
                  <div className="indp-mini-row">
                    <b>{demo.personas[1]}</b> {demo.bookingNoun} confirmed <em>score 86</em>
                  </div>
                  <div className="indp-mini-row">
                    <b>{demo.personas[2]}</b> replied · PROXe answering <em>typing…</em>
                  </div>
                  <div className="indp-mini-row">
                    <b>{demo.personas[3]}</b> follow-up sent <em>day 2</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof + pricing pull-through ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-proof">
            <div>
              {/* Numeric stats ("5×") keep the display scale; word stats
                  ("Counselling") would overflow the column at 120px, so they
                  get their own size via the --word modifier. */}
              <div className={`indp-proof-num${/^[\d.]/.test(industry.stat) ? '' : ' indp-proof-num--word'}`}>
                {industry.stat}
              </div>
              <p className="indp-proof-label">{industry.statLabel}</p>
            </div>
            <div className="indp-proof-copy">
              <p>
                One price, everything included: every channel, the full
                dashboard, follow-ups, scoring and the voice agent. Deployed
                and trained on your business in about a week.
              </p>
              <Link
                href="/#pricing"
                className="indp-cta indp-cta--deploy"
              >
                See founding member pricing <FiArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <span className="indp-label">Questions</span>
          <h2 className="indp-h2">Asked by every {industry.title.toLowerCase()} owner.</h2>
          <IndustryFaq slug={industry.slug} items={page.faq} />
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="indp-close">
        <div className="proxe-container">
          <h2 className="indp-h2">Never miss a lead again.</h2>
          <p className="indp-section-sub">
            See it working for a business like yours first — then deploy it on your own.
          </p>
          <IndustryCtas slug={industry.slug} />
        </div>
      </section>
    </main>
  );
}
