import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'What is PROXe? | PROXe',
  description:
    'PROXe answers, qualifies, books and follows up on every lead, on every channel.',
  alternates: {
    canonical: 'https://goproxe.com/blog/what-is-proxe',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/what-is-proxe.png'],
  },
}

const articleContent = `PROXe is an AI that runs the customer side of your business. It answers every enquiry across WhatsApp, Instagram, your website and calls in seconds, qualifies the lead, books the appointment, and keeps following up until they decide, remembering every conversation along the way. That is the whole product. Not a chatbot you paste into WhatsApp. Not a CRM you have to open.

The leak it is built for. The lead messages while you are with someone else. You see it at 8am. They already booked the business that answered. Clinics lose the new patient in consult. Coaches lose the parent who wrote after 9pm. Brokers lose the site visit they already paid for. The ad did not fail. The conversation sat there.

What it actually does. Answers in seconds. Night, Sunday, peak hour. Asks one useful question. Doctor. Exam. Area. Job type. Books the slot in the same thread. Follows up until they say yes or no. Remembers the thread. They never repeat themselves. WhatsApp, Instagram, the site, and calls write into one memory.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is PROXe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An AI that answers, qualifies, books and follows up on every lead, on every channel, so you never miss a lead again.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is PROXe a WhatsApp chatbot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. WhatsApp is one channel. It also runs Instagram, the site, and calls, and it remembers all of them as one conversation.',
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
    {
      '@type': 'Question',
      name: 'Does it invent a price or a quote?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the call or the visit and hands you the thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if they go silent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It follows up until they book, commit, or opt out.',
      },
    },
  ],
}

export default function WhatIsProxePage() {
  const slug = 'what-is-proxe'
  const pageUrl = 'https://goproxe.com/blog/what-is-proxe'
  const pageTitle = 'What is PROXe?'

  const tocItems = [
    { id: 'the-leak-it-is-built-for', text: 'The leak it is built for' },
    { id: 'what-it-actually-does', text: 'What it actually does' },
    { id: 'what-it-is-not', text: 'What it is not' },
    { id: 'who-it-is-for', text: 'Who it is for' },
    { id: 'questions-people-ask', text: 'Questions people ask' },
  ]

  return (
    <BlogPostWrapper
      slug={slug}
      title={pageTitle}
      pageUrl={pageUrl}
      tocItems={tocItems}
      articleContent={articleContent}
      jsonLdSchemas={[faqSchema]}
    >
            <section className={styles.section}>
              <p>PROXe is an AI that runs the customer side of your business. It answers every enquiry across WhatsApp, Instagram, your website and calls in seconds, qualifies the lead, books the appointment, and keeps following up until they decide, remembering every conversation along the way.</p>
              <p>That is the whole product. Not a chatbot you paste into WhatsApp. Not a CRM you have to open.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-leak-it-is-built-for">The leak it is built for</h2>
              <p>The lead messages while you are with someone else. You see it at 8am. They already booked the business that answered.</p>
              <p>Clinics lose the new patient in consult. Coaches lose the parent who wrote after 9pm. Brokers lose the site visit they already paid for.</p>
              <p>The ad did not fail. The conversation sat there.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-actually-does">What it actually does</h2>
              <p>1. Answers in seconds. Night, Sunday, peak hour.</p>
              <p>2. Asks one useful question. Doctor. Exam. Area. Job type.</p>
              <p>3. Books the slot in the same thread.</p>
              <p>4. Follows up until they say yes or no.</p>
              <p>5. Remembers the thread. They never repeat themselves.</p>
              <p>WhatsApp, Instagram, the site, and calls write into one memory. You do the work. The inbox does not sit.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-is-not">What it is not</h2>
              <p>It is not a WhatsApp auto-reply. An auto-reply says "we will call you tomorrow." That tells them you are closed.</p>
              <p>It is not a CRM. A CRM stores the lead after you already lost them.</p>
              <p>It is not a bot you prompt yourself. We train it on your business and it is live in 48 hours.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-it-is-for">Who it is for</h2>
              <p>Businesses that already get inbound. WhatsApp. Instagram. The site. The phone. If the enquiry exists and you answer late, this is for you.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>, <a href="/industries/d2c">D2C</a>, and <a href="/industries/spa">spa</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. Read about <a href="/blog/people-miss-conversations">why people miss conversations</a> in the first place.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>What is PROXe?</strong></p>
              <p>An AI that answers, qualifies, books and follows up on every lead, on every channel, so you never miss a lead again.</p>
              <p><strong>Is PROXe a WhatsApp chatbot?</strong></p>
              <p>No. WhatsApp is one channel. It also runs Instagram, the site, and calls, and it remembers all of them as one conversation.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
              <p><strong>Does it invent a price or a quote?</strong></p>
              <p>No. It books the call or the visit and hands you the thread.</p>
              <p><strong>What happens if they go silent?</strong></p>
              <p>It follows up until they book, commit, or opt out.</p>
            </section>

            <section className={styles.section}>
              <p>Why people miss conversations is the leak. This page is the product. Talk to PROXe on <a href="/">the site</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
