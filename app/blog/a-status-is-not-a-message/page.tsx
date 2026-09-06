import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'A status is not a message',
  description:
    'The CRM moved. The lead did not hear you.',
  alternates: {
    canonical: 'https://goproxe.com/blog/a-status-is-not-a-message',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-status-is-not-a-message.png'],
  },
}

const articleContent = `You flipped the lead to Follow up. The board looks clean. The WhatsApp thread is still empty.

A status is a note for your team. A message is a line the lead can read. The desk does the second one.

I'll get back to you is not a reply. A status with no send is the same park, inside the CRM.

A status tracks where you are. Won. Lost. Booked. Waiting.
A message moves the thread. Two facts. Two times. Or a clear handoff.
If the board updates and the chat does not, the lead still thinks you vanished.

Moved to Warm. No text.
Left a comment for the closer. The lead never saw it.
Set a reminder for Friday. Friday comes with no message. Silence is not a decision.
Marked Contacted after reading the chat and writing nothing back.

You can open the thread and point at the last line the lead got.
If the only update is a pipeline stage, you logged work. You did not desk.

Clinics, coaches, home services, anyone whose CRM is busy and whose WhatsApp is quiet.
If your stages move faster than your replies, this page is the map.

PROXe is the desk that writes in the thread, not only on the board.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Stage can follow the chat. The chat does not wait on a stage. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

Can the desk update the CRM too?
Yes. After it writes the lead a real line.
Is a reminder a message?
No. A reminder is a status for you.
Does PROXe leave leads on Waiting with no text?
No. It asks, books, or hands off.
Does it replace the clinic?
No. It runs the desk until a person or a slot.
How long to go live?
48 hours.

A status is not a message. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can the desk update the CRM too?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. After it writes the lead a real line.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a reminder a message?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A reminder is a status for you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe leave leads on Waiting with no text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It asks, books, or hands off.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it replace the clinic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It runs the desk until a person or a slot.',
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

export default function AStatusIsNotAMessagePage() {
  const slug = 'a-status-is-not-a-message'
  const pageUrl = 'https://goproxe.com/blog/a-status-is-not-a-message'
  const pageTitle = 'A status is not a message'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-real-message', text: 'How you know it was a real message' },
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
              <p>You flipped the lead to Follow up. The board looks clean. The WhatsApp thread is still empty.</p>
              <p>A status is a note for your team. A message is a line the lead can read. The desk does the second one.</p>
              <p><a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a>. A status with no send is the same park, inside the CRM.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A status tracks where you are. Won. Lost. Booked. Waiting.</p>
              <p>A message moves the thread. Two facts. Two times. Or a clear handoff.</p>
              <p>If the board updates and the chat does not, the lead still thinks you vanished.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Moved to Warm. No text.</p>
              <p>Left a comment for the closer. The lead never saw it.</p>
              <p>Set a reminder for Friday. Friday comes with no message. <a href="/blog/silence-is-not-a-decision">Silence is not a decision</a>.</p>
              <p>Marked Contacted after reading the chat and writing nothing back.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-real-message">How you know it was a real message</h2>
              <p>You can open the thread and point at the last line the lead got.</p>
              <p>If the only update is a pipeline stage, you logged work. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose CRM is busy and whose WhatsApp is quiet.</p>
              <p>If your stages move faster than your replies, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that writes in the thread, not only on the board.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Stage can follow the chat. The chat does not wait on a stage. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Can the desk update the CRM too?</strong></p>
              <p>Yes. After it writes the lead a real line.</p>
              <p><strong>Is a reminder a message?</strong></p>
              <p>No. A reminder is a status for you.</p>
              <p><strong>Does PROXe leave leads on Waiting with no text?</strong></p>
              <p>No. It asks, books, or hands off.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A status is not a message. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
