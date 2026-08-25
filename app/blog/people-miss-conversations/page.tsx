import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { FiArrowLeft } from 'react-icons/fi'
import styles from '../../styles/legal.module.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

export const metadata: Metadata = {
  title: 'People miss conversations',
  description:
    'A parent WhatsApps the academy at 11pm. The owner is asleep. Or in class. Or on a site visit. By morning the chat is still unread.',
  alternates: {
    canonical: 'https://goproxe.com/blog/people-miss-conversations',
  },
}

export default function BlogPostPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>
            People miss <span className={styles.accent}>conversations</span>
          </h1>
          <p className={styles.updated}>August 25, 2026</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <p>A parent WhatsApps the academy at 11pm.</p>
              <p>The owner is asleep. Or in class. Or on a site visit.</p>
              <p>By morning the chat is still unread. The parent already booked somewhere else.</p>
              <p>This is not a marketing problem.</p>
              <p>It is a missed conversation.</p>
              <p>Every clinic, coaching shop, broker, and studio I have watched has the same leak. They paid for the enquiry. Then they were busy. The person on the other side did not wait.</p>
              <p>PROXe is the AI that runs the customer side of your business. It answers every enquiry across WhatsApp, Instagram, your website and calls in seconds, qualifies the lead, books the appointment, and keeps following up until they decide, remembering every conversation along the way.</p>
              <p>You keep working.</p>
              <p>The conversation does not sit there.</p>
            </section>

            <div className={styles.footer}>
              <a href="/" className={styles.backLink}>
                <FiArrowLeft size={14} /> Back to home
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
