import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Noted is not a next line | PROXe',
  description: 'Parking the ask is not the next line.',
  alternates: {
    canonical: 'https://goproxe.com/blog/noted-is-not-a-next-line',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/noted-is-not-a-next-line.png'],
  },
}

const articleContent = `They asked for a slot. You typed noted. Or ok. Or a thumbs up. The chat went quiet. Your side felt done. Their side still needs a time. Noted is a receipt. A next line is an ask, two times, or a handoff. The desk does the second one.

Two different jobs. Noted means you saw the ask. The lead still waits. A next line moves the thread. Two facts. Two times. Or a clear handoff to a person. If the last thing you sent is noted, you parked. You did not desk.

Reply noted so the badge dies. Send a thumbs up and open the calendar later. Forward the chat to the group. No line back to the lead. Type I'll get back to you and leave. Same park, longer words.

You can open the thread and point at the last line the lead got. If that line is only noted, ok, or a reaction, you logged attention. You did not offer a slot.

Clinics, coaches, home services, anyone whose WhatsApp is full of noted and empty calendars. If you keep parking asks and still miss Thursday, this page is the map.

PROXe is the desk that writes the next line, not only notes the ask. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic. What is PROXe? Talk to PROXe at goproxe.com.

Noted is not a next line. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is noted polite enough?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Polite is fine. It is still not a next line.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe send noted?',
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

export default function NotedIsNotANextLinePage() {
  const slug = 'noted-is-not-a-next-line'
  const pageUrl = 'https://goproxe.com/blog/noted-is-not-a-next-line'
  const pageTitle = 'Noted is not a next line'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-next-line', text: 'How you know it was a next line' },
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
              <p>They asked for a slot. You typed noted. Or ok. Or a thumbs up. The chat went quiet. Your side felt done. Their side still needs a time. Noted is a receipt. A next line is an ask, two times, or a handoff. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Noted means you saw the ask. The lead still waits. A next line moves the thread. Two facts. Two times. Or a clear handoff to a person. If the last thing you sent is noted, you parked. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Reply noted so the badge dies. Send a thumbs up and open the calendar later. Forward the chat to the group. No line back to the lead. Type <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you</a> and leave. Same park, longer words.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-next-line">How you know it was a next line</h2>
              <p>You can open the thread and point at the last line the lead got. If that line is only noted, ok, or a reaction, you logged attention. You did not offer a slot.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of noted and empty calendars. If you keep parking asks and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that writes the next line, not only notes the ask. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is noted polite enough?</strong></p>
              <p>Polite is fine. It is still not a next line.</p>
              <p><strong>Does PROXe send noted?</strong></p>
              <p>No. It sends the next useful line.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Noted is not a next line. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
