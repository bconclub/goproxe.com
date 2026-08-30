import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'
import { getRelatedPosts, getRecentPosts, getPrevNextPosts, getBlogPost } from '../../lib/blog'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'Your CRM will not answer that WhatsApp | PROXe',
  description:
    'A CRM stores the lead. It does not answer, qualify, book, or follow up. That is why the chat still sits.',
  alternates: {
    canonical: 'https://goproxe.com/blog/crm-wont-answer',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is PROXe a CRM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. PROXe answers, qualifies, books, and follows up. Your CRM can still hold the file.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I keep LeadSquared or Zoho?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The leak is the unanswered chat, not the missing board.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why not just a WhatsApp chatbot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A bot dumps FAQs. It does not book, follow up, or remember the call.',
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

export default function CrmWontAnswerPage() {
  const currentSlug = 'crm-wont-answer'
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
          <h1 className={styles.title}>Your CRM will not answer that WhatsApp</h1>
          <p className={styles.updated}>August 30, 2026</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <p>They messaged at 9:12pm. Your CRM made a row. Name, number, source. Status: New.</p>
              <p>Nobody answered. At 9:18 they booked the clinic that wrote back.</p>
              <p>The row is still New in the morning. That is not a CRM bug. That is what a CRM is.</p>
            </section>

            <section className={styles.section}>
              <h2>What people actually do</h2>
              <p>Most Indian clinics, coaching desks, and brokers run some mix of three things.</p>
              <p>A personal phone. The counsellor's WhatsApp. When they leave, the thread leaves with them.</p>
              <p>A shared inbox. Everyone sees everything. Nobody owns the 11pm message.</p>
              <p>A CRM. LeadSquared, Zoho, whatever. WhatsApp is a connector. A webhook. A template when the stage changes. The conversation still waits for a person to type.</p>
              <p>You are not failing at software. You bought a filing cabinet for a conversation.</p>
            </section>

            <section className={styles.section}>
              <h2>What a CRM is for</h2>
              <p>A CRM is a record. Pipeline. Who owns the lead. What stage. What you last logged. Reports for the owner.</p>
              <p>That work is real. It is not the first 30 seconds. It is not the 9pm WhatsApp. It is not the Instagram comment that became a site form that became a missed call.</p>
            </section>

            <section className={styles.section}>
              <h2>What it will not do</h2>
              <p>It will not answer in seconds when the counsellor is in a consult.</p>
              <p>It will not ask the two questions that qualify the job, then offer two slots.</p>
              <p>It will not book the calendar.</p>
              <p>It will not follow up until they decide. It will sit on New until someone remembers.</p>
              <p>It will not remember that this is the same person who DMed on Instagram yesterday and called at lunch.</p>
              <p>LeadSquared and the rest bolt WhatsApp on as a channel. You still need a BSP, templates, a human in the 24-hour window. The CRM logs the chat. It does not run it.</p>
            </section>

            <section className={styles.section}>
              <h2>How you should manage a lead</h2>
              <p>Treat the inbound as a conversation, not a row.</p>
              <p>Answer on the channel they used. WhatsApp, Instagram, the site, the call. Same person. One memory.</p>
              <p>Qualify in the thread. Book a slot. Follow up until yes or no. Log the outcome after, if you still want a CRM.</p>
              <p>The record comes after the reply. Not instead of it.</p>
            </section>

            <section className={styles.section}>
              <h2>Who this is for</h2>
              <p>Businesses that already get inbound and already have a board. Excel, Zoho, LeadSquared. The board is not the leak. The unanswered chat is.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. What PROXe is (<a href="/blog/what-is-proxe">/blog/what-is-proxe</a>). Why people miss conversations (<a href="/blog/people-miss-conversations">/blog/people-miss-conversations</a>).</p>
            </section>

            <section className={styles.section}>
              <h2>Questions people ask</h2>
              <p><strong>Is PROXe a CRM?</strong></p>
              <p>No. PROXe answers, qualifies, books, and follows up. Your CRM can still hold the file.</p>
              <p><strong>Can I keep LeadSquared or Zoho?</strong></p>
              <p>Yes. The leak is the unanswered chat, not the missing board.</p>
              <p><strong>Why not just a WhatsApp chatbot?</strong></p>
              <p>A bot dumps FAQs. It does not book, follow up, or remember the call.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The CRM is the file. This page is the desk. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
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
