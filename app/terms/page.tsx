import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import { FiArrowLeft } from 'react-icons/fi'
import styles from '../styles/legal.module.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-sans' })
const heading = Instrument_Serif({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-proxe-heading' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-proxe-mono' })

// Keep in sync with the same constant on /privacy-policy and /data-deletion.
const CONTACT_EMAIL = 'brands@bconclub.com'
const LAST_UPDATED = 'October 10, 2026'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms for businesses that use PROXe to answer and qualify leads across website chat, WhatsApp, Instagram, email and voice.',
  alternates: {
    canonical: 'https://goproxe.com/terms',
  },
}

export default function TermsPage() {
  return (
    <div className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.eyebrow}>Legal</p>
          <h1 className={styles.title}>
            Terms of <span className={styles.accent}>Service</span>
          </h1>
          <p className={styles.lede}>
            The terms that apply when a business uses PROXe to answer, qualify and follow up
            on its leads.
          </p>
          <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

          <article className={styles.body}>
            <section className={styles.section}>
              <h2>The Service</h2>
              <p>
                PROXe is an AI platform that answers and qualifies leads for businesses across
                website chat, WhatsApp, Instagram direct messages and comments, email and voice
                calls. It replies to enquiries, asks qualifying questions, books appointments,
                follows up, and hands conversations to the business&rsquo;s team. Our website
                is <a href="https://goproxe.com">https://goproxe.com</a>. By connecting an
                account to PROXe or using the service, the business agrees to these terms.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Your Responsibilities</h2>
              <p>
                The business using PROXe owns its connected accounts (such as its Instagram
                professional account, Facebook Page and WhatsApp Business number) and the
                content sent from them. The business is responsible for the messages PROXe
                sends on its behalf, for the accuracy of the information it gives PROXe about
                its products, prices and policies, and for having the right to contact the
                people it messages. When it connects Meta products, the business must follow
                Meta&rsquo;s{' '}
                <a href="https://developers.facebook.com/terms/" target="_blank" rel="noreferrer">Platform Terms</a>,
                Instagram&rsquo;s{' '}
                <a href="https://help.instagram.com/477434105621119" target="_blank" rel="noreferrer">Community Guidelines</a>{' '}
                and the WhatsApp Business policies.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Acceptable Use</h2>
              <p>
                PROXe may not be used to send spam, unsolicited bulk messages, or messages to
                people who have not contacted the business or agreed to hear from it. It may
                not be used for content that is illegal, deceptive, hateful, harassing,
                sexually explicit, or that infringes anyone&rsquo;s rights, or for any purpose
                Meta&rsquo;s platform policies prohibit. We may suspend an account that breaks
                these rules.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Meta &amp; Instagram Platform Data</h2>
              <p>
                Data PROXe receives through Meta products, including Instagram messages,
                comments and account identifiers, is used only to answer enquiries and run the
                connected business&rsquo;s conversations, and is handled as described in our{' '}
                <a href="/privacy-policy">Privacy Policy</a>. We do not sell it. Anyone can ask
                for their data to be deleted by following our{' '}
                <a href="/data-deletion">Data Deletion Instructions</a>.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Disconnecting &amp; Termination</h2>
              <p>
                A business can disconnect an Instagram, Facebook or WhatsApp account from PROXe
                at any time, by removing PROXe&rsquo;s access in that platform&rsquo;s own
                settings or by writing to us. Once disconnected, PROXe stops receiving and
                sending messages for that account. A business can stop using PROXe at any time
                by writing to us, and we may end access for a breach of these terms. When an
                account ends, the business or the people it messaged can ask us to delete
                their data, as described in the{' '}
                <a href="/privacy-policy">Privacy Policy</a> and{' '}
                <a href="/data-deletion">Data Deletion Instructions</a>.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Disclaimers</h2>
              <p>
                PROXe uses AI to write replies. AI can make mistakes, so the business should
                review important conversations, and PROXe hands a conversation to a person
                when asked. The service is provided &ldquo;as is&rdquo;. We work to keep it
                available and accurate, but we do not promise it will be uninterrupted or
                error-free, and we are not responsible for outages of WhatsApp, Instagram,
                Facebook or other third-party platforms.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Limitation of Liability</h2>
              <p>
                To the extent the law allows, PROXe is not liable for indirect, incidental or
                consequential losses, such as lost profits, lost leads or lost data. Our total
                liability for any claim is limited to the fees the business paid PROXe in the
                three months before the claim.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Changes to These Terms</h2>
              <p>
                We may update these terms. When we do, we change the &ldquo;Last updated&rdquo;
                date above, and for significant changes we tell businesses using PROXe by email
                or in the dashboard. Continuing to use PROXe after a change means accepting the
                updated terms.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Governing Law</h2>
              <p>
                These terms are governed by the laws of India, and the courts of India have
                jurisdiction over any dispute arising from them.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Contact</h2>
              <p>
                For any questions about these terms, contact us at{' '}
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
