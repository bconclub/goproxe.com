import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { FiArrowLeft } from 'react-icons/fi'
import styles from '../styles/legal.module.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

// Keep in sync with the same constant on /privacy-policy.
const CONTACT_EMAIL = 'connect@bconclub.com'
const LAST_UPDATED = 'June 13, 2026'

export const metadata: Metadata = {
  title: 'Data Deletion',
  description:
    'How to request deletion of personal data associated with PROXe-powered communication channels, including Instagram, WhatsApp, and website chat.',
}

export default function DataDeletionPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Legal</p>
          <h1 className={styles.title}>
            User Data <span className={styles.accent}>Deletion</span>
          </h1>
          <p className={styles.lede}>
            Instructions for requesting deletion of personal data associated with
            PROXe-powered communication channels.
          </p>
          <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <h2>Who This Applies To</h2>
              <p>
                These instructions apply to anyone who has contacted a business through
                Instagram, WhatsApp, website chat, forms, or other PROXe-powered
                communication channels.
              </p>
            </section>

            <section className={styles.section}>
              <h2>What Data May Be Stored</h2>
              <p>
                Depending on how you got in touch, we may store: your name, phone number,
                email address, Instagram username or account identifier, Instagram comments
                and direct messages, WhatsApp messages, website chat messages, timestamps,
                enquiry details, and follow-up notes.
              </p>
            </section>

            <section className={styles.section}>
              <h2>PROXe&rsquo;s Role</h2>
              <p>
                Businesses use PROXe as a technology service provider to manage CRM,
                messaging, automation, and support workflows. PROXe processes data on behalf
                of the business you contacted and does not sell user data.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Instagram &amp; Meta Data</h2>
              <p>
                If you interact with a business through Instagram, we may receive data through
                Meta APIs, including Instagram account identifiers, direct messages, comments,
                messaging metadata, and related interaction history. This data is used only to
                respond to your enquiry and manage that business&rsquo;s communication
                workflows.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How To Request Deletion</h2>
              <div className={styles.callout}>
                <p>
                  Email{' '}
                  <a href={`mailto:${CONTACT_EMAIL}?subject=Data%20Deletion%20Request`}>
                    {CONTACT_EMAIL}
                  </a>{' '}
                  with the subject line <strong>&ldquo;Data Deletion Request&rdquo;</strong>.
                </p>
              </div>
              <p style={{ marginTop: 14 }}>
                Please include enough information for us to identify your records — such as
                your Instagram username, phone number, email address, or the channel through
                which you made contact.
              </p>
            </section>

            <section className={styles.section}>
              <h2>What Happens Next</h2>
              <p>
                After verifying your request, we will delete or anonymize the associated
                records from active systems, including PROXe-powered CRM and messaging
                records, unless retention is required for legal, security, dispute-resolution,
                or legitimate business purposes.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Timeline</h2>
              <p>
                We aim to process valid deletion requests within <strong>30 days</strong> of
                receiving sufficient identifying information.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Contact</h2>
              <p>
                For privacy or data-deletion questions, contact{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{' '}
                <a href="/privacy-policy">Privacy Policy</a>.
              </p>
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
