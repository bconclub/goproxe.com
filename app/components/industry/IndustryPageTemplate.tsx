import Link from 'next/link';
import {
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiGlobe,
  FiHeart,
  FiInstagram,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiMessageSquare,
  FiPhone,
  FiPhoneCall,
  FiPhoneMissed,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaCommentDots,
  FaInstagram,
  FaEnvelope,
} from 'react-icons/fa';
import type { Industry } from '../../lib/industries';
import { getPageContent, defaultFeatures } from '../../lib/industries';
import IndustryCtas from './IndustryCtas';
import IndustryFaq from './IndustryFaq';
import IndustryHeader from './IndustryHeader';

/**
 * The one template all 8 industry pages render through. Server component,
 * only the CTAs and the FAQ accordion are client islands.
 *
 * Layout is a one-to-one build of the approved reference designs (dark,
 * purple, split hero with product visual): nav → split hero + trust strip →
 * leak/fix → how it runs → live-in-action panel → six feature cards →
 * capability band → channel row → FAQ → closing band. Where the references
 * differ per industry (hero visual, leak/fix treatment) the registry's
 * `variant` field picks the treatment; everything else is shared.
 *
 * NOTE ON TRUST CLAIMS: the reference mocks carry certifications and outcome
 * numbers we cannot source ("HIPAA Compliant", "SOC 2 Type II", "ISO 27001",
 * "GDPR", "4.9/5 from 500+ brands", "Recovered ₹4.2 Cr+", "28% / 2.3x /
 * 35%"). Those are deliberately absent here; every claim on the page is a
 * property of the product that is true today. When certifications or sourced
 * results are confirmed, add them in ONE place (the trust strip and the
 * capability band below) and all 8 pages inherit them.
 */

/** Row icons for the leak/fix section, cycled by row index. */
const PAIN_ICONS = [FiPhoneMissed, FiCalendar, FiUsers, FiMessageSquare];
const FIX_ICONS = [FiPhoneCall, FiBell, FiCpu, FiHeart];

const BOOKING_TIMES = ['11:00 AM', '1:30 PM', '3:00 PM', '4:30 PM'];
const FEED_TIMES = ['10:42 AM', '10:31 AM', '10:15 AM', '9:58 AM'];

function SourceIcon({ source }: { source: string }) {
  if (source === 'WhatsApp') return <FaWhatsapp size={14} />;
  if (source === 'Instagram') return <FiInstagram size={14} />;
  if (source === 'Call') return <FiPhone size={14} />;
  return <FiGlobe size={14} />;
}

/** The clinic-reference hero visual: mini dashboard + a WhatsApp exchange. */
function HeroDashboard({ industry }: { industry: Industry }) {
  const { demo } = industry;
  const noun = demo.bookingNoun;
  return (
    <div className="indp-hero-visual" aria-hidden>
      <div className="indp-dash">
        <div className="indp-dash-top">
          <span className="indp-mini-ava">{demo.business.initials}</span>
          <span className="indp-dash-name">{demo.business.name}</span>
          <span className="indp-mini-live">● LIVE</span>
        </div>
        <div className="indp-dash-body">
          <div className="indp-dash-nav">
            <span data-active>Overview</span>
            <span>Conversations</span>
            <span>{noun}s</span>
            <span>Leads</span>
            <span>Analytics</span>
          </div>
          <div className="indp-dash-main">
            <div className="indp-dash-glance">Today at a glance</div>
            <div className="indp-dash-tiles">
              <div className="indp-dash-tile"><b>42</b><span>{demo.metricLabels.m1}</span></div>
              <div className="indp-dash-tile"><b>12</b><span>{demo.metricLabels.m2}</span></div>
              <div className="indp-dash-tile"><b>128</b><span>{demo.metricLabels.m3}</span></div>
              <div className="indp-dash-tile"><b>52s</b><span>{demo.metricLabels.m4}</span></div>
            </div>
            <div className="indp-dash-feed">
              <div className="indp-dash-row indp-dash-row--new">
                <FiCalendar size={12} />
                <span>New {noun.toLowerCase()} booked · <b>{demo.personas[0]}</b></span>
                <em>just now</em>
              </div>
              <div className="indp-dash-row">
                <FiCheckCircle size={12} />
                <span>{noun} confirmed · <b>{demo.personas[1]}</b></span>
                <em>9:15 AM</em>
              </div>
              <div className="indp-dash-row">
                <FiBell size={12} />
                <span>Reminder sent · <b>{demo.personas[2]}</b></span>
                <em>for tomorrow</em>
              </div>
              <div className="indp-dash-row">
                <FiHeart size={12} />
                <span>Follow-up sent · <b>{demo.personas[3]}</b></span>
                <em>day 2</em>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="indp-wa">
        <div className="indp-wa-top"><FaWhatsapp size={13} /> WhatsApp · now</div>
        <div className="indp-wa-bubble indp-wa-bubble--in">{demo.inquiries[0]}</div>
        <div className="indp-wa-bubble indp-wa-bubble--out">{demo.aiReplies[0]}</div>
        <div className="indp-wa-chip"><FiCheck size={12} /> {noun} confirmed</div>
      </div>
    </div>
  );
}

/** The real-estate/D2C-reference hero visual: floating notification cards
    over the industry photo (the photo itself is the hero backdrop). */
function HeroCards({ industry }: { industry: Industry }) {
  const { demo } = industry;
  const acts = industry.activities;
  return (
    <div className="indp-hero-visual indp-hero-visual--cards" aria-hidden>
      <div className="indp-float-stack">
        {acts.slice(0, 2).map((a, i) => {
          const Icon = a.Icon;
          return (
            <div key={i} className="indp-float" style={{ animationDelay: `${i * 0.9}s` }}>
              <span className="indp-float-ico"><Icon size={15} /></span>
              <div><b>{a.top}</b>{a.sub && <span>{a.sub}</span>}</div>
            </div>
          );
        })}
        <div className="indp-float" style={{ animationDelay: '1.8s' }}>
          <span className="indp-float-ico"><FiUser size={15} /></span>
          <div><b>{demo.personas[0]} qualified</b><span>high intent · score 92</span></div>
        </div>
        <div className="indp-float" style={{ animationDelay: '2.7s' }}>
          <span className="indp-float-ico"><FiHeart size={15} /></span>
          <div><b>Follow-up sent</b><span>day 2 · automatic</span></div>
        </div>
      </div>
      <div className="indp-wa indp-wa--float">
        <div className="indp-wa-top"><FaWhatsapp size={13} /> WhatsApp · now</div>
        <div className="indp-wa-bubble indp-wa-bubble--in">{demo.inquiries[0]}</div>
        <div className="indp-wa-bubble indp-wa-bubble--out">{demo.aiReplies[0]}</div>
        <div className="indp-wa-chip"><FiCheck size={12} /> {demo.bookingNoun} confirmed</div>
      </div>
    </div>
  );
}

export default function IndustryPageTemplate({ industry }: { industry: Industry }) {
  const page = getPageContent(industry);
  const features = page.features ?? defaultFeatures(industry);
  const { demo } = industry;
  const noun = demo.bookingNoun;
  const heroVariant = industry.variant?.hero ?? 'dashboard';
  const leakVariant = industry.variant?.leak ?? 'columns';

  return (
    <main className="indp-root" style={{ ['--acc' as string]: industry.color }}>
      {/* ── Header, identical to the homepage's floating header ── */}
      <IndustryHeader slug={industry.slug} />

      {/* ── Split hero ── */}
      <section className="indp-hero" data-hero={heroVariant}>
        {industry.image && (
          <div
            className="indp-hero-photo"
            style={{ backgroundImage: `url(${industry.image})` }}
            aria-hidden
          />
        )}
        <div className="indp-hero-tint" aria-hidden />
        <div className="proxe-container indp-hero-inner">
          <div className="indp-hero-copy">
            <span className="indp-eyebrow">Built for {industry.title}</span>
            <h1 className="indp-h1">{page.heroHeadline}</h1>
            <p className="indp-hero-sub">{page.heroSub}</p>
            <IndustryCtas slug={industry.slug} fireView />
          </div>
          {heroVariant === 'cards'
            ? <HeroCards industry={industry} />
            : <HeroDashboard industry={industry} />}
        </div>

        {/* Trust strip: product properties only, no certifications. */}
        <div className="proxe-container">
          <div className="indp-trust">
            <div className="indp-trust-item">
              <FiClock size={17} />
              <div><b>Answers 24/7</b><span>Nights, weekends, peak hours</span></div>
            </div>
            <div className="indp-trust-item">
              <FiZap size={17} />
              <div><b>Replies in seconds</b><span>On every channel you have</span></div>
            </div>
            <div className="indp-trust-item">
              <FiLock size={17} />
              <div><b>Your data stays yours</b><span>Never used to train public models</span></div>
            </div>
            <div className="indp-trust-item">
              <FiShield size={17} />
              <div><b>Live in 48 hours</b><span>Trained on your business</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The leak, and the fix ── */}
      <section className="indp-section">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Where the revenue leaks, and how PROXe fixes it</span>
            <h2 className="indp-h2">The leak, and the fix.</h2>
            <p className="indp-section-sub indp-section-sub--center">{page.painIntro}</p>
          </div>

          {leakVariant === 'arrows' && (
            <div className="indp-pf-rows">
              {page.painFixes.map(({ pain, fix }, i) => {
                const PainIcon = PAIN_ICONS[i % PAIN_ICONS.length];
                const FixIcon = FIX_ICONS[i % FIX_ICONS.length];
                return (
                  <div key={i} className="indp-pf-row">
                    <div className="indp-pf-card indp-pf-card--pain">
                      <span className="indp-pf-ico indp-pf-ico--pain"><PainIcon size={16} /></span>
                      <div>
                        <h3 className="indp-pf-title">{pain.title}</h3>
                        <p className="indp-pf-body">{pain.body}</p>
                      </div>
                    </div>
                    <div className="indp-pf-arrow"><FiArrowRight size={18} /></div>
                    <div className="indp-pf-card indp-pf-card--fix">
                      <span className="indp-pf-ico indp-pf-ico--fix"><FixIcon size={16} /></span>
                      <div>
                        <h3 className="indp-pf-title">{fix.title}</h3>
                        <p className="indp-pf-body">{fix.body}</p>
                      </div>
                      <span className="indp-pf-check"><FiCheck size={13} /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {leakVariant === 'orb' && (
            <div className="indp-pf-orbwrap">
              <div className="indp-pf-panel indp-pf-panel--pain">
                <div className="indp-pf-panelhead">
                  <h3>The leak</h3>
                  <p>Where {industry.title.toLowerCase()} leads slip away</p>
                </div>
                {page.painFixes.map(({ pain }, i) => {
                  const Icon = PAIN_ICONS[i % PAIN_ICONS.length];
                  return (
                    <div key={i} className="indp-pf-item">
                      <span className="indp-pf-ico indp-pf-ico--pain"><Icon size={16} /></span>
                      <div>
                        <h3 className="indp-pf-title">{pain.title}</h3>
                        <p className="indp-pf-body">{pain.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="indp-pf-orb" aria-hidden>
                <span>PROXe</span>
              </div>
              <div className="indp-pf-panel indp-pf-panel--fix">
                <div className="indp-pf-panelhead">
                  <h3>The fix</h3>
                  <p>PROXe automates what matters</p>
                </div>
                {page.painFixes.map(({ fix }, i) => {
                  const Icon = FIX_ICONS[i % FIX_ICONS.length];
                  return (
                    <div key={i} className="indp-pf-item">
                      <span className="indp-pf-ico indp-pf-ico--fix"><Icon size={16} /></span>
                      <div>
                        <h3 className="indp-pf-title">{fix.title}</h3>
                        <p className="indp-pf-body">{fix.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {leakVariant === 'columns' && (
            <div className="indp-pf-cols">
              <div className="indp-pf-col indp-pf-col--pain">
                <div className="indp-pf-colhead">The problem</div>
                {page.painFixes.map(({ pain }, i) => {
                  const Icon = PAIN_ICONS[i % PAIN_ICONS.length];
                  return (
                    <div key={i} className="indp-pf-item">
                      <span className="indp-pf-ico indp-pf-ico--pain"><Icon size={16} /></span>
                      <div>
                        <h3 className="indp-pf-title">{pain.title}</h3>
                        <p className="indp-pf-body">{pain.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="indp-pf-col indp-pf-col--fix">
                <div className="indp-pf-colhead">With PROXe</div>
                {page.painFixes.map(({ fix }, i) => {
                  const Icon = FIX_ICONS[i % FIX_ICONS.length];
                  return (
                    <div key={i} className="indp-pf-item">
                      <span className="indp-pf-ico indp-pf-ico--fix"><Icon size={16} /></span>
                      <div>
                        <h3 className="indp-pf-title">{fix.title}</h3>
                        <p className="indp-pf-body">{fix.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── How it runs ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">How it runs, step by step</span>
            <h2 className="indp-h2">From first message to {noun.toLowerCase()}.</h2>
          </div>
          <div className="indp-steps">
            {page.steps.map((s, i) => {
              const Icon = s.Icon;
              return (
                <div key={i} className="indp-step">
                  <span className="indp-step-num">{i + 1}</span>
                  <span className="indp-step-ico"><Icon size={19} /></span>
                  <h3 className="indp-step-title">{s.title.replace(/^\d+\.\s*/, '')}</h3>
                  <p className="indp-step-body">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Live in action ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-demo-band" data-photo={industry.images?.live ? 'true' : 'false'}>
            {industry.images?.live && (
              <div
                className="indp-demo-photo"
                style={{ backgroundImage: `url(${industry.images.live})` }}
                aria-hidden
              />
            )}
            <div className="indp-demo-copy">
              <span className="indp-label">Live in action</span>
              <h2 className="indp-h2">Watch PROXe run a business like yours.</h2>
              <p>
                A dashboard for &ldquo;{demo.business.name}&rdquo;, seeded with
                the kind of week your business actually has: leads arriving,
                chats answered, {noun.toLowerCase()}s landing.
              </p>
              <ul className="indp-demo-list">
                <li><FiCheckCircle size={15} /> {demo.metricLabels.m1} today: 42</li>
                <li><FiCheckCircle size={15} /> {demo.metricLabels.m2} today: 12</li>
                <li><FiCheckCircle size={15} /> {demo.metricLabels.m3} today: 128</li>
                <li><FiCheckCircle size={15} /> {demo.metricLabels.m4}: under a minute</li>
              </ul>
              <IndustryCtas slug={industry.slug} />
            </div>
            <div className="indp-panels" aria-hidden>
              <div className="indp-panel">
                <div className="indp-panel-head">Live feed</div>
                {demo.inquiries.slice(0, 4).map((q, i) => (
                  <div key={i} className="indp-panel-row">
                    <span className="indp-panel-src"><SourceIcon source={demo.sources[i % demo.sources.length]} /></span>
                    <div className="indp-panel-msg">
                      <b>{demo.sources[i % demo.sources.length]} · {demo.personas[i + 4]}</b>
                      <span>{q}</span>
                    </div>
                    <em>{FEED_TIMES[i]}</em>
                  </div>
                ))}
              </div>
              <div className="indp-panel">
                <div className="indp-panel-head">Today&rsquo;s {noun.toLowerCase()}s</div>
                {BOOKING_TIMES.map((t, i) => (
                  <div key={i} className="indp-panel-row indp-panel-row--booking">
                    <em className="indp-panel-time">{t}</em>
                    <div className="indp-panel-msg">
                      <b>{demo.personas[i + 8]}</b>
                    </div>
                    <span className="indp-panel-ok">Confirmed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Six feature cards ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Built for {industry.title.toLowerCase()}</span>
            <h2 className="indp-h2">Everything the front line needs, handled.</h2>
          </div>
          <div className="indp-features">
            {features.map((f, i) => {
              const Icon = f.Icon;
              return (
                <div key={i} className="indp-feature">
                  <span className="indp-feature-ico"><Icon size={19} /></span>
                  <h3 className="indp-feature-title">{f.title}</h3>
                  <p className="indp-feature-body">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Capability band (the reference's stats band, truthful version) ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-band">
            <div className="indp-band-stat">
              <div className={`indp-band-num${/^[\d.]/.test(industry.stat) ? '' : ' indp-band-num--word'}`}>
                {industry.stat}
              </div>
              <p className="indp-band-label">{industry.statLabel}</p>
            </div>
            <div className="indp-band-chips">
              <div className="indp-band-chip"><FiClock size={16} /><b>24/7</b><span>coverage on every channel</span></div>
              <div className="indp-band-chip"><FiZap size={16} /><b>Seconds</b><span>to the first reply</span></div>
              <div className="indp-band-chip"><FiTrendingUp size={16} /><b>Every lead</b><span>scored and logged</span></div>
            </div>
            <div className="indp-band-copy">
              <p>
                One price, everything included: every channel, the full
                dashboard, follow-ups, scoring and the voice agent.
              </p>
              <Link href="/#pricing" className="indp-close-pricing">
                See founding member pricing <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Channel row ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-channels">
            <div className="indp-center">
              <span className="indp-label">One platform. Every channel.</span>
              <h2 className="indp-h2 indp-h2--sm">Meet your customers where they are.</h2>
            </div>
            {/* Instagram's mark is a gradient in its brand guide; SVG fills
                cannot take a CSS gradient, so it needs a real <defs> in the
                document for `fill: url(#...)` to resolve. */}
            <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="indp-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f9ce34" />
                  <stop offset="45%" stopColor="#ee2a7b" />
                  <stop offset="100%" stopColor="#6228d7" />
                </linearGradient>
              </defs>
            </svg>
            {/* One icon family (Font Awesome solid) so the weights match, and
                each channel carries its own real colour rather than a row of
                identical accent circles. */}
            <div className="indp-channel-row">
              <div className="indp-channel" style={{ ['--ch' as string]: industry.color }}>
                <span className="indp-channel-ico"><FaPhoneAlt size={20} /></span>
                <b>Phone Calls</b><span>Inbound &amp; outbound</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#25d366' }}>
                <span className="indp-channel-ico"><FaWhatsapp size={23} /></span>
                <b>WhatsApp</b><span>Business API</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#38bdf8' }}>
                <span className="indp-channel-ico"><FaCommentDots size={22} /></span>
                <b>Web Chat</b><span>Live on your website</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#e1306c' }}>
                <span className="indp-channel-ico indp-channel-ico--ig"><FaInstagram size={22} /></span>
                <b>Instagram</b><span>DMs &amp; lead ads</span>
              </div>
              <div className="indp-channel" style={{ ['--ch' as string]: '#f59e0b' }}>
                <span className="indp-channel-ico"><FaEnvelope size={20} /></span>
                <b>Email</b><span>Smart follow-ups</span>
              </div>
            </div>
            <p className="indp-channels-note">
              Every conversation writes back to one system, so your team stays
              in sync no matter where the customer started.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="indp-section indp-section--tight">
        <div className="proxe-container">
          <div className="indp-center">
            <span className="indp-label">Questions {industry.title.toLowerCase()} teams ask</span>
            <h2 className="indp-h2 indp-h2--sm">Everything you need to know.</h2>
          </div>
          <IndustryFaq slug={industry.slug} items={page.faq} />
        </div>
      </section>

      {/* ── Closing text with internal links (wellness only) ── */}
      {page.closing && (
        <section className="indp-section indp-section--tight">
          <div className="proxe-container">
            <div className="indp-center">
              <p className="indp-section-sub indp-section-sub--center">
                {page.closing}
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="indp-close-pricing">
                  Home <FiArrowRight size={13} />
                </Link>
                <Link href="/blog/people-miss-conversations" className="indp-close-pricing">
                  Why people miss conversations <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Closing band ── */}
      <section className="indp-close">
        <div className="proxe-container">
          <div className="indp-close-band">
            {industry.images?.closing && (
              <div
                className="indp-close-photo"
                style={{ backgroundImage: `url(${industry.images.closing})` }}
                aria-hidden
              />
            )}
            <h2 className="indp-h2">Never miss a lead again.</h2>
            <p className="indp-close-sub">
              PROXe works 24/7 to capture, book and follow up, deployed and
              trained on your business in 48 hours.
            </p>
            <div className="indp-close-cta">
              <IndustryCtas slug={industry.slug} />
            </div>
            <div className="indp-close-checks">
              <span><FiCheck size={13} /> Setup in 48 hours</span>
              <span><FiCheck size={13} /> Every channel included</span>
              <span><FiCheck size={13} /> No new software to learn</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
