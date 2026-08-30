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
  title: 'One lead, four channels, one memory | PROXe',
  description:
    'WhatsApp Monday. Instagram Thursday. Site Saturday. Call later. Same person. They should never repeat themselves.',
  alternates: {
    canonical: 'https://goproxe.com/blog/one-memory-every-channel',
  },
  openGraph: {
    title: 'One lead, four channels, one memory',
    description:
      'WhatsApp Monday. Instagram Thursday. Site Saturday. Call later. Same person. They should never repeat themselves.',
    url: 'https://goproxe.com/blog/one-memory-every-channel',
    images: [
      {
        url: 'https://goproxe.com/home/Leads.webp',
        width: 1200,
        height: 630,
        alt: 'One lead, four channels, one memory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One lead, four channels, one memory',
    description:
      'WhatsApp Monday. Instagram Thursday. Site Saturday. Call later. Same person. They should never repeat themselves.',
    images: ['https://goproxe.com/home/Leads.webp'],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this a WhatsApp tool that also does Instagram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. One memory. Four channels. Same person.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will they have to start over on the call?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The call is the same thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the CRM replace this?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The CRM files it after. See Your CRM will not answer that WhatsApp.',
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

export default function OneMemoryEveryChannelPage() {
  const currentSlug = 'one-memory-every-channel'
  const post = getBlogPost(currentSlug)
  const relatedPosts = getRelatedPosts(currentSlug, 3)
  const recentPosts = getRecentPosts(currentSlug, 3)
  const { prev, next } = getPrevNextPosts(currentSlug)

  const pageUrl = 'https://goproxe.com/blog/one-memory-every-channel'
  const pageTitle = 'One lead, four channels, one memory'

  const tocItems = [
    { id: 'what-people-run', text: 'What people run' },
    { id: 'what-one-memory-means', text: 'What one memory means' },
    { id: 'what-it-is-not', text: 'What it is not' },
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
          <h1 className={styles.title}>One lead, four channels, one memory</h1>
          <p className={styles.updated}>{post ? formatBlogDate(post.date) : ''}</p>

          <article className={styles.body}>
            <BlogToc items={tocItems} />
            <section className={styles.section}>
              <p>They DMed Instagram at night. WhatsApp in the morning. Form on the site at lunch. Called at 4.</p>
              <p>You asked their name four times. They hung up.</p>
              <p>That is not four leads. That is one person hitting four inboxes.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run">What people run</h2>
              <p>A WhatsApp bot. An Instagram reply from someone else. A site form into a CRM. A missed-call list on paper.</p>
              <p>Each tool has a slice. None of them know it is the same parent, the same patient, the same buyer.</p>
              <p>A CRM can store four rows. It still does not remember the thread.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-one-memory-means">What one memory means</h2>
              <p>WhatsApp, Instagram, the website, the call write into one conversation.</p>
              <p>They never repeat the exam, the tooth, the locality, the job type.</p>
              <p>You pick up where they left. Night, Sunday, peak hour.</p>
              <p>This is not a shared inbox. A shared inbox is still one channel. This is one person across every channel they already use.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-is-not">What it is not</h2>
              <p>Not four chatbots glued together. Not a transcript dump into Zoho. Not "also Instagram" as a toggle.</p>
              <p>If they switch channel, the desk still knows them.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Businesses that already get inbound on more than WhatsApp and still treat each ping as new.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/not-a-whatsapp-bot">PROXe is not a WhatsApp chatbot</a>. <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is this a WhatsApp tool that also does Instagram?</strong></p>
              <p>No. One memory. Four channels. Same person.</p>
              <p><strong>Will they have to start over on the call?</strong></p>
              <p>No. The call is the same thread.</p>
              <p><strong>Does the CRM replace this?</strong></p>
              <p>No. The CRM files it after. See <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>One person. One memory. Every channel. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
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
