import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'
import { getBlogPost, getRelatedPosts, getRecentPosts, getPrevNextPosts, formatBlogDate } from '../../lib/blog'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'The parent messaged at 9pm. The institute that answered got the admission. | PROXe',
  description:
    'Coaching inbound dies after class and after 7pm. Answer, qualify the exam, book the counselling. Do not wait until morning.',
  alternates: {
    canonical: 'https://goproxe.com/blog/coaching-parents-at-night',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it replace the counsellor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It does the 9pm reply. The counsellor walks into a booked slot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it dump the brochure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It asks, then books.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need night staff?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk keeps working. The counsellor does not.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long to go live?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '48 hours.',
      },
    },
  ],
}

export default function CoachingParentsAtNightPage() {
  const currentSlug = 'coaching-parents-at-night'
  const post = getBlogPost(currentSlug)
  const relatedPosts = getRelatedPosts(currentSlug, 3)
  const recentPosts = getRecentPosts(currentSlug, 3)
  const { prev, next } = getPrevNextPosts(currentSlug)

  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>The parent messaged at 9pm. The institute that answered got the admission.</h1>
          <p className={styles.updated}>{post ? formatBlogDate(post.date) : ''}</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <p>The parent wrote at 9:12pm. JEE, this year, demo this week.</p>
              <p>Your counsellor finished class at 8. Phone on silent. Morning they called. The parent had already booked the institute that asked the two questions at 9:14.</p>
              <p>They did not ghost you. They messaged five places. First useful reply got the seat.</p>
            </section>

            <section className={styles.section}>
              <h2>What coaching desks run</h2>
              <p>Counsellor WhatsApp on a personal phone. A greeting. A PDF of batches. A CRM for the admission board.</p>
              <p>DNP is the same leak. They called, parent was in a meeting, nobody wrote on WhatsApp. The lead is not cold. The thread sat.</p>
            </section>

            <section className={styles.section}>
              <h2>What to do instead</h2>
              <p>Answer on WhatsApp, Instagram, the site, the missed call. Same parent. One memory.</p>
              <p>Qualify in the thread: exam, year, city. Offer two counselling slots. Book it. Do not invent a fee or a rank.</p>
              <p>Morning the counsellor walks into a booked demo, not a list of last night's greets.</p>
            </section>

            <section className={styles.section}>
              <h2>Who this is for</h2>
              <p>Institutes that already get inbound on WhatsApp and still answer when class ends. Class ending is too late.</p>
              <p>How PROXe does this for <a href="/industries/coaching">coaching</a>. Same leak for <a href="/industries/clinics">clinics</a> and <a href="/industries/realestate">real estate</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2>Questions people ask</h2>
              <p><strong>Does it replace the counsellor?</strong></p>
              <p>No. It does the 9pm reply. The counsellor walks into a booked slot.</p>
              <p><strong>Will it dump the brochure?</strong></p>
              <p>No. It asks, then books.</p>
              <p><strong>Do I need night staff?</strong></p>
              <p>No. The desk keeps working. The counsellor does not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>After class they still want a slot. Talk to PROXe on <a href="/">the site</a>.</p>
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
