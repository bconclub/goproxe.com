import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'
import { getBlogPost, getRelatedPosts, getRecentPosts, getPrevNextPosts, formatBlogDate } from '../../lib/blog'
import { BlogShareRail } from '../../components/blog/BlogShareRail'
import { BlogToc } from '../../components/blog/BlogToc'
import { BlogRelatedRecent } from '../../components/blog/BlogRelatedRecent'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'They WhatsApped while you were with a client. The firm that answered got the brief. | PROXe',
  description:
    'CA, lawyer, consultant inbound dies in the meeting. Answer, qualify, book the consult. Do not wait until you hang up.',
  alternates: {
    canonical: 'https://goproxe.com/blog/professional-services-with-a-client',
  },
  openGraph: {
    title: 'They WhatsApped while you were with a client. The firm that answered got the brief.',
    description:
      'CA, lawyer, consultant inbound dies in the meeting. Answer, qualify, book the consult. Do not wait until you hang up.',
    url: 'https://goproxe.com/blog/professional-services-with-a-client',
    images: [
      {
        url: 'https://goproxe.com/home/Conversations.webp',
        width: 1200,
        height: 630,
        alt: 'They WhatsApped while you were with a client. The firm that answered got the brief.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'They WhatsApped while you were with a client. The firm that answered got the brief.',
    description:
      'CA, lawyer, consultant inbound dies in the meeting. Answer, qualify, book the consult. Do not wait until you hang up.',
    images: ['https://goproxe.com/home/Conversations.webp'],
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does it replace you?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It does the reply while you are with a client. You do the work.",
      },
    },
    {
      "@type": "Question",
      name: "Will it quote a fee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It books the consult and hands you the thread.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need someone on the phone in court?",
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

export default function ProfessionalServicesWithAClientPage() {
  const currentSlug = "professional-services-with-a-client"
  const post = getBlogPost(currentSlug)
  const relatedPosts = getRelatedPosts(currentSlug, 3)
  const recentPosts = getRecentPosts(currentSlug, 3)
  const { prev, next } = getPrevNextPosts(currentSlug)

  const pageUrl = 'https://goproxe.com/blog/professional-services-with-a-client'
  const pageTitle = 'They WhatsApped while you were with a client. The firm that answered got the brief.'

  const tocItems = [
    { id: 'what-firms-actually-run', text: 'What firms actually run' },
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
          <h1 className={styles.title}>They WhatsApped while you were with a client. The firm that answered got the brief.</h1>
          <p className={styles.updated}>{post ? formatBlogDate(post.date) : ''}</p>

          <article className={styles.body}>
            <BlogToc items={tocItems} />
            <section className={styles.section}>
              <p>They wrote at 2:10pm. GST notice. Can you take this.</p>
              <p>You were in a meeting. Phone down. You replied at 6. They had already booked the CA who asked two questions at 2:12.</p>
              <p>Silence is not professionalism. It is a lost brief.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-firms-actually-run">What firms actually run</h2>
              <p>Personal WhatsApp. A greeting. Email tomorrow. A CRM for the file.</p>
              <p>Lawyer in court, consultant on a call, CA in a close: same leak. After hours the same. They wanted a slot this week.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer on WhatsApp, Instagram, the site, the missed call. Same person. One memory.</p>
              <p>Qualify: what, when, who. Offer two consult slots. Book it. Do not invent a fee.</p>
              <p>You hang up. The next brief is already on the calendar.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Firms that already get inbound and still answer when the meeting ends. The meeting ending is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/professional-services">professional services</a>. Same leak for <a href="/industries/clinics">clinics</a> and <a href="/industries/coaching">coaching</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does it replace you?</strong></p>
              <p>No. It does the reply while you are with a client. You do the work.</p>
              <p><strong>Will it quote a fee?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>Do I need someone on the phone in court?</strong></p>
              <p>No. The desk keeps working. You do not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>You do the work. The inbox does not sit. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>

            {/* Related Posts */}
            <BlogRelatedRecent posts={relatedPosts} title="Related" cardClassName={styles.relatedCard} />

            {/* Recent Posts */}
            <BlogRelatedRecent posts={recentPosts} title="Recent" cardClassName={styles.recentCard} />


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
