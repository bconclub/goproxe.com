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
  title: "They called while you were on a job. The crew that answered got the work. | PROXe",
  description:
    "Plumber, AC, electrician inbound dies on the job and at night. Answer, qualify, book. Do not wait until you park.",
  alternates: {
    canonical: 'https://goproxe.com/blog/home-services-on-a-job',
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does it replace the technician?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It does the reply while you are on the job. You do the work.",
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
      name: "Do I need someone in the office at night?",
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

export default function HomeServicesOnAJobPage() {
  const currentSlug = "home-services-on-a-job"
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
          <h1 className={styles.title}>They called while you were on a job. The crew that answered got the work.</h1>
          <p className={styles.updated}>{post ? formatBlogDate(post.date) : ''}</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <p>The AC died at 2pm. They WhatsApped. You were on a roof. You replied at 7. They already booked the crew that asked address and slot at 2:04.</p>
              <p>Night is the same leak. 10pm. You see it at 8am. Gone.</p>
              <p>You did not lose the job to a bigger brand. You lost it because the chat sat while you worked.</p>
            </section>

            <section className={styles.section}>
              <h2>What crews actually run</h2>
              <p>Personal phone. JustDial, the site, Instagram, the missed call. Four inboxes. No memory. Quote sent, never followed.</p>
            </section>

            <section className={styles.section}>
              <h2>What to do instead</h2>
              <p>Answer on the channel they used. Same person. One memory.</p>
              <p>Qualify: address, job type, when. Offer two slots. Book tomorrow&apos;s first if it is night. Do not invent a quote.</p>
              <p>You finish the current job. The next one is already on the calendar.</p>
            </section>

            <section className={styles.section}>
              <h2>Who this is for</h2>
              <p>Home-service crews that already get inbound and still answer when they park. Parking is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/home-services">home services</a>. Same leak for <a href="/industries/wellness">wellness</a> and <a href="/industries/clinics">clinics</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2>Questions people ask</h2>
              <p><strong>Does it replace the technician?</strong></p>
              <p>No. It does the reply while you are on the job. You do the work.</p>
              <p><strong>Will it quote a price?</strong></p>
              <p>No. It books the visit and hands you the thread.</p>
              <p><strong>Do I need someone in the office at night?</strong></p>
              <p>No. The desk keeps working. You do not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>You do the work. The inbox does not sit. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
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
