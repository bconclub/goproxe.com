import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Closing the inbox is not done | PROXe',
  description:
    'Zero unread is not zero open leads.',
  alternates: {
    canonical: 'https://goproxe.com/blog/closing-the-inbox-is-not-done',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/closing-the-inbox-is-not-done.png'],
  },
}

const articleContent = `You cleared every chat. The badge is gone. Three leads still have no Thursday and no next line.

Done is a booked slot, a clear no, or a handoff with context. Clearing unread is filing. It is not the desk.

A status is not a message. Closing the thread in your head is the same trick.

Inbox zero is a view. You hid the red dots.
The desk leaves a next ask, two times, or a named owner.
If unread is empty and the calendar is empty, you cleaned the UI. You did not finish the lead.

Archive after reading. No reply.
Mark unread as read so the badge dies. Silence is not a decision.
Mute the chat. The lead still waits.
Close WhatsApp at 6pm with open asks still hanging. I'll get back to you is not a reply.

You can point at the slot, the no, or the handoff in the thread.
If the only win is a quiet badge, you filed. You did not desk.

Clinics, coaches, home services, anyone who confuses a clean inbox with a clean pipeline.
If your unread hits zero and your books stay light, this page is the map.

PROXe is the desk that does not stop at clear.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It keeps the thread alive until a decision. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

Is archive ever ok?
After a book, a no, or a handoff. Not instead of them.
Does PROXe chase forever?
No. It follows a system until a decision or a stop rule.
Does clearing unread count as follow-up?
No. Follow-up is a message the lead gets.
Does it replace the clinic?
No. It runs the desk until a person or a slot.
How long to go live?
48 hours.

Closing the inbox is not done. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is archive ever ok?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After a book, a no, or a handoff. Not instead of them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe chase forever?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It follows a system until a decision or a stop rule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does clearing unread count as follow-up?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Follow-up is a message the lead gets.',
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

export default function ClosingTheInboxIsNotDonePage() {
  const slug = 'closing-the-inbox-is-not-done'
  const pageUrl = 'https://goproxe.com/blog/closing-the-inbox-is-not-done'
  const pageTitle = 'Closing the inbox is not done'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-done', text: 'How you know it was done' },
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
              <p>You cleared every chat. The badge is gone. Three leads still have no Thursday and no next line.</p>
              <p>Done is a booked slot, a clear no, or a handoff with context. Clearing unread is filing. It is not the desk.</p>
              <p><a href="/blog/a-status-is-not-a-message">A status is not a message</a>. Closing the thread in your head is the same trick.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Inbox zero is a view. You hid the red dots.</p>
              <p>The desk leaves a next ask, two times, or a named owner.</p>
              <p>If unread is empty and the calendar is empty, you cleaned the UI. You did not finish the lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Archive after reading. No reply.</p>
              <p>Mark unread as read so the badge dies. <a href="/blog/silence-is-not-a-decision">Silence is not a decision</a>.</p>
              <p>Mute the chat. The lead still waits.</p>
              <p>Close WhatsApp at 6pm with open asks still hanging. <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-done">How you know it was done</h2>
              <p>You can point at the slot, the no, or the handoff in the thread.</p>
              <p>If the only win is a quiet badge, you filed. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone who confuses a clean inbox with a clean pipeline.</p>
              <p>If your unread hits zero and your books stay light, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that does not stop at clear.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It keeps the thread alive until a decision. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is archive ever ok?</strong></p>
              <p>After a book, a no, or a handoff. Not instead of them.</p>
              <p><strong>Does PROXe chase forever?</strong></p>
              <p>No. It follows a system until a decision or a stop rule.</p>
              <p><strong>Does clearing unread count as follow-up?</strong></p>
              <p>No. Follow-up is a message the lead gets.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Closing the inbox is not done. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
