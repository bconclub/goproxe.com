import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'
import { getBlogPost, getRelatedPosts, getRecentPosts, getPrevNextPosts, formatBlogDate } from '../../lib/blog'
import { BlogShareRail } from '../../components/blog/BlogShareRail'
import { BlogToc } from '../../components/blog/BlogToc'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'You paid for the lead. Then you answered tomorrow. | PROXe',
  description:
    'Broker inbound dies on a personal WhatsApp. Site visit goes to whoever replied. Answer, qualify, book. Do not wait until the next listing.',
  alternates: {
    canonical: 'https://goproxe.com/blog/paid-lead-no-reply',
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does it replace the broker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It does the 9pm reply. You do the visit.",
      },
    },
    {
      "@type": "Question",
      name: "Will it quote a price?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It books the visit and hands you the thread.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need someone on the phone at 11pm?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The desk keeps working. You do not.",
      },
    },
    {
      "@type": "Question",
      name: "How long to go live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "48 hours.",
      },
    },
  ],
}

export default function PaidLeadNoReplyPage() {
  const currentSlug = "paid-lead-no-reply"
  const post = getBlogPost(currentSlug)
  const relatedPosts = getRelatedPosts(currentSlug, 3)
  const recentPosts = getRecentPosts(currentSlug, 3)
  const { prev, next } = getPrevNextPosts(currentSlug)

  const pageUrl = 'https://goproxe.com/blog/paid-lead-no-reply'
  const pageTitle = 'You paid for the lead. Then you answered tomorrow.'

  const tocItems = [
    { id: 'what-brokers-actually-run', text: 'What brokers actually run' },
    { id: 'what-to-do-instead', text: 'What to do instead' },
    { id: 'who-this-is-for', text: 'Who this is for' },
    { id: 'questions-people-ask', text: 'Questions people ask' },
  ]

  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BlogShareRail url={pageUrl} title={pageTitle} />
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>You paid for the lead. Then you answered tomorrow.</h1>
          <p className={styles.updated}>{post ? formatBlogDate(post.date) : ''}</p>

          <article className={styles.body}>
            <BlogToc items={tocItems} />
            <section className={styles.section}>
              <p>The buyer tapped WhatsApp off the listing at 9:12pm. Locality, budget, this weekend.</p>
              <p>Your phone was in the car. Morning you called. They had already booked the site visit with the broker who asked two questions at 9:14.</p>
              <p>You paid for that lead. You did not lose it to the portal. You lost it to silence.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-brokers-actually-run">What brokers actually run</h2>
              <p>Personal WhatsApp. A greeting. 99acres and MagicBricks dumping into the same chat. Sometimes a CRM for the developer.</p>
              <p>The leak is not attribution. The leak is the independent broker whose number is on the listing, on Instagram, and on the site, and who answers when the site visit ends.</p>
              <p>Four channels, four starts. They tell their budget four times. They hang up.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer in seconds on WhatsApp, Instagram, the site, the missed call. Same buyer. One memory.</p>
              <p>Qualify: locality, budget, when. Offer two site-visit slots. Book it. Do not invent a price.</p>
              <p>Morning you walk into a booked visit, not a list of last night&apos;s portal names.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Brokers who already buy inbound and still answer when they are free. Free is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/realestate">real estate</a>. Same leak for <a href="/industries/clinics">clinics</a> and <a href="/industries/coaching">coaching</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does it replace the broker?</strong></p>
              <p>No. It does the 9pm reply. You do the visit.</p>
              <p><strong>Will it quote a price?</strong></p>
              <p>No. It books the visit and hands you the thread.</p>
              <p><strong>Do I need someone on the phone at 11pm?</strong></p>
              <p>No. The desk keeps working. You do not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>You already paid. The chat should not sit. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className={styles.section} style={{ marginTop: '48px' }}>
                <h2>Related</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className={styles.relatedCard}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-proxe-heading)',
                          fontSize: '18px',
                          fontWeight: 400,
                          margin: '0 0 6px',
                          color: '#ede9fe',
                        }}
                      >
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(220, 215, 245, 0.75)', margin: 0 }}>
                        {post.dek}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <section className={styles.section}>
                <h2>Recent</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className={styles.recentCard}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-proxe-heading)',
                          fontSize: '18px',
                          fontWeight: 400,
                          margin: '0 0 6px',
                          color: '#ede9fe',
                        }}
                      >
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(220, 215, 245, 0.75)', margin: 0 }}>
                        {post.dek}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Prev/Next Navigation */}
            {(prev || next) && (
              <div
                style={{
                  marginTop: '48px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className={styles.prevNextLink}
                  >
                    <FiArrowLeft size={16} />
                    <span>{prev.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className={styles.prevNextLink}
                  >
                    <span>{next.title}</span>
                    <FiArrowRight size={16} />
                  </Link>
                )}
              </div>
            )}

            <div className={styles.footer}>
              <a href="/blog" className={styles.backLink}>
                <FiArrowLeft size={14} /> Back to blog
              </a>
              <span className={styles.brand}>
                <img src="/proxe/brand/proxe-logo-white.webp" alt="PROXe" />
              </span>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
