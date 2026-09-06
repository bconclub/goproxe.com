import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'What to measure on inbound',
  description:
    'Most teams measure the wrong clock.',
  alternates: {
    canonical: 'https://goproxe.com/blog/what-to-measure-on-inbound',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/what-to-measure-on-inbound.png'],
  },
}

const articleContent = `Most teams measure the wrong clock. First reply. Tickets closed. Chat volume. None of those say whether a lead was answered, qualified, booked, and followed until they decided.

The job has four clocks. Not a dashboard of vanity.

## Four clocks

First useful reply. Someone wrote back with the next step, not a thanks-for-reaching-out. [How fast to reply on WhatsApp](/blog/how-fast-to-reply-whatsapp)

Booked. A day and a time in the thread. [A conversation that books](/blog/conversation-that-books)

Followed up. The silent ones got a second and a third pass. [Follow-up is a system](/blog/follow-up-is-a-system)

Still silent. How many threads died with no book and no follow-up. [People miss conversations](/blog/people-miss-conversations)

If you cannot point at those four, you are measuring activity.

## What people run instead

Average first response time. Fast and empty still loses the slot.

Open conversations. A pile is not a pipeline.

A weekly screenshot of we replied to everyone. No names. No times. No books.

A CRM count of new leads. The CRM did not sit in the thread. [Your CRM will not answer](/blog/crm-wont-answer)

Invented close rates. Do not put a percent on this page you did not earn.

## How you know the inbound is working

You can name last week: how many got a useful reply, how many booked, how many were followed, how many are still silent.

Speed without a book is a miss. A book without follow-up on the rest is a miss.

## Who this is for

Anyone whose inbound is WhatsApp, Instagram, the site, or a missed call. Gyms, clinics, home services, coaches.

If your report is we were fast and you cannot show Thursday 4pm, this page is the map.

## Then PROXe

PROXe is the desk that produces those four clocks.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. First useful reply. Two slots. Follow-up until they decide. One memory. It does not invent a conversion rate. It hands you the thread.

[What is PROXe?](/blog/what-is-proxe)

Talk to PROXe at [goproxe.com](/).

## Questions people ask

What should I measure on WhatsApp inbound?

First useful reply. Booked. Followed up. Still silent. That is the job.

Is first reply enough?

No. Fast and empty still misses the slot.

Do I need a fancy dashboard?

No. Four counts you can say out loud.

Does it invent a percent?

No. Honest clocks only.

How long to go live?

48 hours.

Measure the desk, not the noise. Talk to PROXe on the site.

Related: How fast to reply on WhatsApp. People miss conversations. What is PROXe? Follow-up is a system.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should I measure on WhatsApp inbound?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'First useful reply. Booked. Followed up. Still silent. That is the job.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is first reply enough?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Fast and empty still misses the slot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a fancy dashboard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Four counts you can say out loud.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a percent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Honest clocks only.',
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

export default function WhatToMeasureOnInboundPage() {
  const slug = 'what-to-measure-on-inbound'
  const pageUrl = 'https://goproxe.com/blog/what-to-measure-on-inbound'
  const pageTitle = 'What to measure on inbound'

  const tocItems = [
    { id: 'four-clocks', text: 'Four clocks' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-the-inbound-is-working', text: 'How you know the inbound is working' },
    { id: 'who-this-is-for', text: 'Who this is for' },
    { id: 'then-proxe', text: 'Then PROXe' },
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
              <p>Most teams measure the wrong clock. First reply. Tickets closed. Chat volume. None of those say whether a lead was answered, qualified, booked, and followed until they decided.</p>
              <p>The job has four clocks. Not a dashboard of vanity.</p>
            </section>

            <section className={styles.section}>
              <h2 id="four-clocks">Four clocks</h2>
              <p>First useful reply. Someone wrote back with the next step, not a thanks-for-reaching-out. <a href="/blog/how-fast-to-reply-whatsapp">How fast to reply on WhatsApp</a></p>
              <p>Booked. A day and a time in the thread. <a href="/blog/conversation-that-books">A conversation that books</a></p>
              <p>Followed up. The silent ones got a second and a third pass. <a href="/blog/follow-up-is-a-system">Follow-up is a system</a></p>
              <p>Still silent. How many threads died with no book and no follow-up. <a href="/blog/people-miss-conversations">People miss conversations</a></p>
              <p>If you cannot point at those four, you are measuring activity.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Average first response time. Fast and empty still loses the slot.</p>
              <p>Open conversations. A pile is not a pipeline.</p>
              <p>A weekly screenshot of we replied to everyone. No names. No times. No books.</p>
              <p>A CRM count of new leads. The CRM did not sit in the thread. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
              <p>Invented close rates. Do not put a percent on this page you did not earn.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-the-inbound-is-working">How you know the inbound is working</h2>
              <p>You can name last week: how many got a useful reply, how many booked, how many were followed, how many are still silent.</p>
              <p>Speed without a book is a miss. A book without follow-up on the rest is a miss.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Anyone whose inbound is WhatsApp, Instagram, the site, or a missed call. Gyms, clinics, home services, coaches.</p>
              <p>If your report is we were fast and you cannot show Thursday 4pm, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that produces those four clocks.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. First useful reply. Two slots. Follow-up until they decide. One memory. It does not invent a conversion rate. It hands you the thread.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>What should I measure on WhatsApp inbound?</strong></p>
              <p>First useful reply. Booked. Followed up. Still silent. That is the job.</p>
              <p><strong>Is first reply enough?</strong></p>
              <p>No. Fast and empty still misses the slot.</p>
              <p><strong>Do I need a fancy dashboard?</strong></p>
              <p>No. Four counts you can say out loud.</p>
              <p><strong>Does it invent a percent?</strong></p>
              <p>No. Honest clocks only.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Measure the desk, not the noise. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
