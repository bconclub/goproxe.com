import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Seen is not a reply | PROXe',
  description:
    'Blue ticks are not the desk.',
  alternates: {
    canonical: 'https://goproxe.com/blog/seen-is-not-a-reply',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/seen-is-not-a-reply.png'],
  },
}

const articleContent = `They wrote at 2pm. You opened it at 2:01. The ticks went blue. The thread still has no next line.

Seen is a receipt. A reply is an ask, two times, or a handoff. The desk does the second one.

Silence is not a decision. Reading without writing is the same silence with better optics.

Seen means you looked. The lead still waits.
A reply moves the thread. Two facts. Two times. Or a clear handoff.
If the only update is blue ticks, you watched. You did not desk.

Open the chat. Close it. Plan to answer later. I'll get back to you is not a reply
Screenshot to the group. No line back to the lead. The group chat is not the desk.
Mark as read so the badge dies. Closing the inbox is not done
Type one word. Delete it. Leave.

You can open the thread and point at the last line the lead got.
If the last change is only seen, you logged attention. You did not desk.

Clinics, coaches, home services, anyone whose WhatsApp is full of blue ticks and empty calendars.
If you keep opening chats and still miss Thursday, this page is the map.

PROXe is the desk that writes back, not only opens.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Seen is not enough. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

Is it ok to read first?
Yes. Then write. Reading alone is not the job.
Does PROXe leave chats on seen?
No. It sends the next useful line.
What if you need a person?
It asks two facts, then hands the thread with context.
Does it replace the clinic?
No. It runs the desk until a person or a slot.
How long to go live?
48 hours.

Seen is not a reply. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it ok to read first?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Then write. Reading alone is not the job.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe leave chats on seen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It sends the next useful line.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if you need a person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It asks two facts, then hands the thread with context.',
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

export default function SeenIsNotAReplyPage() {
  const slug = 'seen-is-not-a-reply'
  const pageUrl = 'https://goproxe.com/blog/seen-is-not-a-reply'
  const pageTitle = 'Seen is not a reply'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-real-reply', text: 'How you know it was a real reply' },
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
              <p>They wrote at 2pm. You opened it at 2:01. The ticks went blue. The thread still has no next line.</p>
              <p>Seen is a receipt. A reply is an ask, two times, or a handoff. The desk does the second one.</p>
              <p>Silence is not a decision. Reading without writing is the same silence with better optics.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Seen means you looked. The lead still waits.</p>
              <p>A reply moves the thread. Two facts. Two times. Or a clear handoff.</p>
              <p>If the only update is blue ticks, you watched. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Open the chat. Close it. Plan to answer later. <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a></p>
              <p>Screenshot to the group. No line back to the lead. The group chat is not the desk.</p>
              <p>Mark as read so the badge dies. <a href="/blog/closing-the-inbox-is-not-done">Closing the inbox is not done</a></p>
              <p>Type one word. Delete it. Leave.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-real-reply">How you know it was a real reply</h2>
              <p>You can open the thread and point at the last line the lead got.</p>
              <p>If the last change is only seen, you logged attention. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of blue ticks and empty calendars.</p>
              <p>If you keep opening chats and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that writes back, not only opens.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Seen is not enough. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is it ok to read first?</strong></p>
              <p>Yes. Then write. Reading alone is not the job.</p>
              <p><strong>Does PROXe leave chats on seen?</strong></p>
              <p>No. It sends the next useful line.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Seen is not a reply. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
