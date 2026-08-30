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
  title: 'PROXe is not a WhatsApp chatbot | PROXe',
  description:
    'A chatbot dumps FAQs on one channel. PROXe answers, qualifies, books and follows up, on every channel, with one memory.',
  alternates: {
    canonical: 'https://goproxe.com/blog/not-a-whatsapp-bot',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it a WhatsApp Business API tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'API is the pipe. PROXe is the person on the other end of the pipe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it dump templates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It talks in the thread. Follow-up is until yes or no, not a blast.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the call or the visit and hands you the thread.',
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

export default function NotAWhatsAppBotPage() {
  const currentSlug = 'not-a-whatsapp-bot'
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
          <h1 className={styles.title}>PROXe is not a WhatsApp chatbot</h1>
          <p className={styles.updated}>{post ? formatBlogDate(post.date) : ''}</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <p>You already tried a chatbot. It said hello. It sent the brochure. It could not book Tuesday 4pm. It forgot they called in the morning.</p>
              <p>That is a bot. PROXe is not that.</p>
            </section>

            <section className={styles.section}>
              <p>A WhatsApp chatbot lives on one number. It answers from a tree or a prompt. When they switch to Instagram or the site, the bot has no idea who they are. When they go silent, it stops. When they ask for a price you have not set, it invents one or dies.</p>
              <p>PROXe runs the customer side. WhatsApp, Instagram, the website, the call. Same person. Same thread in its head. It asks the qualifying questions, offers two slots, books the calendar, and keeps writing until they decide.</p>
              <p>It does not invent a quote. It does not replace your counsellor. It does the 9pm reply so the counsellor walks into a booked slot, not a cold list.</p>
            </section>

            <section className={styles.section}>
              <h2>What it is not</h2>
              <p>It is not a menu. It is not an away message. It is not a broadcast tool. It is not a CRM with a chatbot bolted on.</p>
            </section>

            <section className={styles.section}>
              <h2>What it actually does</h2>
              <p>Answers in seconds. Qualifies in the thread. Books the slot. Follows up until yes or no. Remembers every channel as one person. Live in 48 hours.</p>
            </section>

            <section className={styles.section}>
              <h2>Who this is for</h2>
              <p>Businesses that already get inbound on WhatsApp and still lose the lead. The bot said thanks. Nobody booked.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>. <a href="/blog/people-miss-conversations">Why people miss conversations</a>.</p>
            </section>

            <section className={styles.section}>
              <h2>Questions people ask</h2>
              <p><strong>Is it a WhatsApp Business API tool?</strong></p>
              <p>API is the pipe. PROXe is the person on the other end of the pipe.</p>
              <p><strong>Will it dump templates?</strong></p>
              <p>No. It talks in the thread. Follow-up is until yes or no, not a blast.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the call or the visit and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A chatbot parks. This finishes. Talk to PROXe on <a href="/">the site</a>.</p>
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
