import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { FiArrowLeft } from 'react-icons/fi'
import styles from '../styles/legal.module.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

// One place to change the contact address used across the legal pages.
const CONTACT_EMAIL = 'brands@bconclub.com'
const LAST_UPDATED = 'June 19, 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How PROXe collects, uses, and protects information across website chat, WhatsApp, and Instagram, on behalf of the businesses that use it.',
  alternates: {
    canonical: 'https://goproxe.com/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Legal</p>
          <h1 className={styles.title}>
            Privacy <span className={styles.accent}>Policy</span>
          </h1>
          <p className={styles.lede}>
            How PROXe collects, uses, and protects your information when you contact a
            business that uses PROXe across website chat, WhatsApp, Instagram messages,
            and Instagram comments.
          </p>
          <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <h2>Who We Are</h2>
              <p>
                PROXe is an AI customer-acquisition and communication platform that helps
                businesses capture enquiries, manage conversations, follow up on leads, and
                provide support across multiple channels. Our website is{' '}
                <a href="https://goproxe.com">https://goproxe.com</a>. PROXe provides these
                services <strong>on behalf of the businesses</strong> that use it.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Data We Process</h2>
              <p>
                When you contact a business that uses PROXe — through Instagram, WhatsApp, or
                a website chat — we may collect and process information such as your name,
                username or profile identifier, phone number, email address, message and
                comment content, enquiry details, timestamps, and related conversation
                history. This information is used to respond to your enquiry, provide
                support, manage follow-ups, improve service quality, and maintain accurate
                communication records.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Instagram &amp; Meta Platform Data</h2>
              <p>
                For Instagram integrations, PROXe may receive data through Meta APIs,
                including Instagram account identifiers, direct messages, comments, and
                messaging metadata, according to the permissions each business grants to its
                connected account. This data is used only to respond to enquiries and manage
                that business&rsquo;s communication workflows. <strong>We do not sell this
                data</strong>, and we do not use it for advertising or unrelated purposes.
              </p>
            </section>

            <section className={styles.section}>
              <h2>WhatsApp Platform Data</h2>
              <p>
                PROXe receives data through Meta&rsquo;s WhatsApp Business API, including phone
                numbers, message content, sender names, message templates, conversation history,
                and delivery metadata. This data is used only to handle conversations and
                follow-ups on behalf of the business you contacted. We do not sell or share this
                data outside the business, and we do not use it for advertising or unrelated
                purposes.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Automated Processing</h2>
              <p>
                Messages, comments, and enquiries received through PROXe are processed by AI
                systems to understand intent, generate responses, qualify leads, and route
                conversations to the appropriate business. A human team at the business you
                contacted may also review your messages. You can request to opt out of automated
                processing by emailing{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Our Role</h2>
              <p>
                PROXe acts as a technology service provider. We process the data described
                above on behalf of the business you contacted, for CRM, automation,
                messaging, and support operations. Each business remains responsible for the
                communications it sends through PROXe.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How We Share Data</h2>
              <p>
                We share your information only with the business you contacted, and with
                infrastructure providers that help us operate the service (such as hosting,
                database, and messaging-delivery providers) under appropriate confidentiality
                obligations. We do not sell personal data to third parties.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Data Retention</h2>
              <p>
                We retain communication and enquiry data for as long as needed to provide the
                service to the business you contacted, and as required for legal, security, or
                legitimate business purposes. You can request deletion at any time (see below).
              </p>
            </section>

            <section className={styles.section}>
              <h2>Your Rights &amp; Data Deletion</h2>
              <p>
                You may request access to, correction of, or deletion of the personal data we
                hold about you. To request deletion, see our{' '}
                <a href="/data-deletion">Data Deletion Instructions</a>, or email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the subject line
                &ldquo;Data Deletion Request&rdquo;.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Contact</h2>
              <p>
                For any questions about this Privacy Policy, contact us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
