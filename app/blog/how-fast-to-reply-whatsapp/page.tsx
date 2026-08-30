import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'
import { getRelatedPosts, getRecentPosts, getPrevNextPosts } from '../../lib/blog'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'How fast should you reply to a WhatsApp lead | PROXe',
  description:
    'First useful reply gets the slot. Thanks, we will call you, is not a reply.',
  alternates: {
    canonical: 'https://goproxe.com/blog/how-fast-to-reply-whatsapp',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How fast is fast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In the thread, in seconds, with a slot. Not a receipt.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need someone on the phone at 11pm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk has to keep working. The human does not.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is an auto-reply enough?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Auto-reply parks. See after-hours.',
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

export default function HowFastToReplyWhatsAppPage() {
  const currentSlug = 'how-fast-to-reply-whatsapp'
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
          <h1 className={styles.title}>How fast should you reply to a WhatsApp lead</h1>
          <p className={styles.updated}>August 30, 2026</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <p>They sent one line at 9:12pm. You replied at 10am. They booked at 9:14 with whoever wrote back.</p>
              <p>People ask how fast. Fast is not a green tick. Fast is a useful reply: answer, qualify, two slots.</p>
            </section>

            <section className={styles.section}>
              <h2>What actually happens</h2>
              <p>The message lands while you are in a consult, a class, a site visit. An away message thanks them. A bot dumps the brochure. Morning you call. They already chose.</p>
              <p>Parents message five institutes. Patients message two clinics. Buyers tap three brokers. The first useful reply wins.</p>
            </section>

            <section className={styles.section}>
              <h2>What useful means</h2>
              <p>Not "hi, thanks for messaging us." Not "we will call you tomorrow."</p>
              <p>Ask the one question that qualifies. Offer Tuesday or Wednesday. Book it in the thread.</p>
              <p>Seconds, not hours. Night and Sunday count.</p>
            </section>

            <section className={styles.section}>
              <h2>What not to do</h2>
              <p>Do not quote a 5-minute rule as if it were your number. Old lead-response studies are not WhatsApp India, and they are not ours. The job is still the same: first useful reply gets the work.</p>
              <p>A CRM row at 10am is not a reply. A chatbot greeting is not a reply.</p>
            </section>

            <section className={styles.section}>
              <h2>Who this is for</h2>
              <p>Businesses that already get inbound and still answer when they are free. Free is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/people-miss-conversations">Why people miss conversations</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>.</p>
            </section>

            <section className={styles.section}>
              <h2>Questions people ask</h2>
              <p><strong>How fast is fast?</strong></p>
              <p>In the thread, in seconds, with a slot. Not a receipt.</p>
              <p><strong>Do I need someone on the phone at 11pm?</strong></p>
              <p>No. The desk has to keep working. The human does not.</p>
              <p><strong>Is an auto-reply enough?</strong></p>
              <p>No. Auto-reply parks. See <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>First useful reply gets the slot. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
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
