import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'A missed call is still a lead | PROXe',
  description: `A ring is not a booking.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/a-missed-call-is-still-a-lead',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-missed-call-is-still-a-lead.png'],
  },
}

const articleContent = `A ring is not a booking. A voicemail is not a booking. "We will call you back" is not a booking. Most teams treat the missed call as noise. The work is the thread that still has to answer, qualify, and put two slots in front of them.

They rang at 2:10. Nobody picked up. The clinic that wrote on WhatsApp got Thursday.

The ring is discovery. The desk is what happens after.

## Two different jobs

The call gets attention. Ring, voicemail, a missed-call log. That is inbound. It is real. It is not a lead until someone is in a conversation that can book. [A conversation that books](/blog/conversation-that-books)

The thread is the desk. Same job as WhatsApp and Instagram. Write back on a channel they will read. Two questions. Two slots. Follow up until they decide. Do not promise a call you will not place. [Who answers the customer](/blog/who-answers-the-customer). [How fast to reply on WhatsApp](/blog/how-fast-to-reply-whatsapp)

If you only staff the phone, you will look busy and still miss the consult.

## What people run instead

A callback they never make. The lead waited. Then they booked someone else.

An IVR that says we missed you, we will call. No thread. No slot. [After hours on WhatsApp](/blog/after-hours-whatsapp)

A CRM row with the number and a note to follow up. Nobody sits in a conversation. [Your CRM will not answer](/blog/crm-wont-answer)

Two staff guessing who already rang them back. Two voices. One confused lead.

## How you know it became a lead

There is a thread. There is a day and a time they picked. Not a missed-call count. Not a voicemail they never heard.

If you cannot point at the message where they chose Thursday, you have a ring. You do not have a lead.

## Who this is for

Clinics, home services, coaches, anyone whose inbound still includes a phone number on ads and Google.

If your report is missed calls and you cannot show Thursday 4pm, this page is the map.

## Then PROXe

PROXe is the desk after the ring.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The missed call, the WhatsApp they open next: one person. Two slots in the thread. It does not invent a fee. It does not place a call it cannot keep. It does the 2:10 reply so they walk into a booked consult.

[What is PROXe?](/blog/what-is-proxe)

Talk to PROXe at [goproxe.com](/).

## Questions people ask

What do you do with a missed call?
Write on a channel they will read. Two questions. Two times. Book there.

Should a missed call get a WhatsApp?
Yes, if that is where they will answer. The ring is not the desk.

Do I still need a phone number?
Yes. The number gets the ring. The desk gets the slot.

Does it invent a price?
No. It books the consult and hands you the thread.

How long to go live?
48 hours.

The ring is not the desk. Talk to PROXe on the site.

Related: After hours on WhatsApp. How fast to reply on WhatsApp. Who answers the customer. A conversation that books.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `What do you do with a missed call?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Write on a channel they will read. Two questions. Two times. Book there.`,
      },
    },
    {
      '@type': 'Question',
      name: `Should a missed call get a WhatsApp?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes, if that is where they will answer. The ring is not the desk.`,
      },
    },
    {
      '@type': 'Question',
      name: `Do I still need a phone number?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. The number gets the ring. The desk gets the slot.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it invent a price?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It books the consult and hands you the thread.`,
      },
    },
    {
      '@type': 'Question',
      name: `How long to go live?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `48 hours.`,
      },
    },
  ],
}

export default function AMissedCallIsStillALeadPage() {
  const slug = 'a-missed-call-is-still-a-lead'
  const pageUrl = 'https://goproxe.com/blog/a-missed-call-is-still-a-lead'
  const pageTitle = 'A missed call is still a lead'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-became-a-lead', text: 'How you know it became a lead' },
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
              <p>A ring is not a booking. A voicemail is not a booking. "We will call you back" is not a booking. Most teams treat the missed call as noise. The work is the thread that still has to answer, qualify, and put two slots in front of them.</p>
              <p>They rang at 2:10. Nobody picked up. The clinic that wrote on WhatsApp got Thursday.</p>
              <p>The ring is discovery. The desk is what happens after.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The call gets attention. Ring, voicemail, a missed-call log. That is inbound. It is real. It is not a lead until someone is in a conversation that can book. <a href="/blog/conversation-that-books">A conversation that books</a></p>
              <p>The thread is the desk. Same job as WhatsApp and Instagram. Write back on a channel they will read. Two questions. Two slots. Follow up until they decide. Do not promise a call you will not place. <a href="/blog/who-answers-the-customer">Who answers the customer</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast to reply on WhatsApp</a></p>
              <p>If you only staff the phone, you will look busy and still miss the consult.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A callback they never make. The lead waited. Then they booked someone else.</p>
              <p>An IVR that says we missed you, we will call. No thread. No slot. <a href="/blog/after-hours-whatsapp">After hours on WhatsApp</a></p>
              <p>A CRM row with the number and a note to follow up. Nobody sits in a conversation. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
              <p>Two staff guessing who already rang them back. Two voices. One confused lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-became-a-lead">How you know it became a lead</h2>
              <p>There is a thread. There is a day and a time they picked. Not a missed-call count. Not a voicemail they never heard.</p>
              <p>If you cannot point at the message where they chose Thursday, you have a ring. You do not have a lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, home services, coaches, anyone whose inbound still includes a phone number on ads and Google.</p>
              <p>If your report is missed calls and you cannot show Thursday 4pm, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk after the ring.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The missed call, the WhatsApp they open next: one person. Two slots in the thread. It does not invent a fee. It does not place a call it cannot keep. It does the 2:10 reply so they walk into a booked consult.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>What do you do with a missed call?</strong></p>
              <p>Write on a channel they will read. Two questions. Two times. Book there.</p>
              <p><strong>Should a missed call get a WhatsApp?</strong></p>
              <p>Yes, if that is where they will answer. The ring is not the desk.</p>
              <p><strong>Do I still need a phone number?</strong></p>
              <p>Yes. The number gets the ring. The desk gets the slot.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The ring is not the desk. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
