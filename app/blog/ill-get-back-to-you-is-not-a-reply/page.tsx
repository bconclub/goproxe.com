import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'I\'ll get back to you is not a reply',
  description:
    'Parking language is not the desk.',
  alternates: {
    canonical: 'https://goproxe.com/blog/ill-get-back-to-you-is-not-a-reply',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/ill-get-back-to-you-is-not-a-reply.png'],
  },
}

const articleContent = `They asked for Thursday. You wrote I'll get back to you. That is not a reply. That is a pause with no next line.

A park is a promise with no slot. The desk asks, or books, or hands off. It does not leave the thread hanging.

Silence is not a decision. Parking language is how silence starts.

A reply moves the thread. Two facts. Two times. Or a clear handoff. Qualify before you book and When they ask for a person.
A park says later and closes the laptop. No ask. No time. No owner.
If you park every hard question, Thursday never lands.

I'll check and get back. Then nothing.
Let me confirm with the team. Then a cold thread. Silence is not a decision.
A CRM note waiting with no message in the chat. A status is not a message.
Typing one moment while the lead waits all day.

You can point at the next ask, the two times, or the handoff with context.
If the last line is I'll get back to you and nothing follows, you parked. You did not desk.

Clinics, coaches, home services, anyone whose WhatsApp is full of later with no Thursday.
If your inbox looks busy and your calendar is empty, this page is the map.

PROXe is the desk that does not park.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Ask. Two times. Or hand over with context. It does not invent a fee. It does not replace the clinic. It does not write I'll get back to you and stop.
What is PROXe?
Talk to PROXe at goproxe.com.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it ever ok to say later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only with a time you will write again. Then write again.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if you do not know the answer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ask two facts. Hand off. Do not park.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe invent a price while it waits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the consult or hands you the thread.',
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

export default function IllGetBackToYouIsNotAReplyPage() {
  const slug = 'ill-get-back-to-you-is-not-a-reply'
  const pageUrl = 'https://goproxe.com/blog/ill-get-back-to-you-is-not-a-reply'
  const pageTitle = 'I\'ll get back to you is not a reply'

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
              <p>They asked for Thursday. You wrote I'll get back to you. That is not a reply. That is a pause with no next line.</p>
              <p>A park is a promise with no slot. The desk asks, or books, or hands off. It does not leave the thread hanging.</p>
              <p>Silence is not a decision. Parking language is how silence starts.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A reply moves the thread. Two facts. Two times. Or a clear handoff. <a href="/blog/qualify-before-you-book">Qualify before you book</a> and <a href="/blog/when-they-ask-for-a-person">When they ask for a person</a>.</p>
              <p>A park says later and closes the laptop. No ask. No time. No owner.</p>
              <p>If you park every hard question, Thursday never lands.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>I'll check and get back. Then nothing.</p>
              <p>Let me confirm with the team. Then a cold thread. <a href="/blog/silence-is-not-a-decision">Silence is not a decision</a>.</p>
              <p>A CRM note waiting with no message in the chat. A status is not a message.</p>
              <p>Typing one moment while the lead waits all day.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-real-reply">How you know it was a real reply</h2>
              <p>You can point at the next ask, the two times, or the handoff with context.</p>
              <p>If the last line is I'll get back to you and nothing follows, you parked. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of later with no Thursday.</p>
              <p>If your inbox looks busy and your calendar is empty, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that does not park.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Ask. Two times. Or hand over with context. It does not invent a fee. It does not replace the clinic. It does not write I'll get back to you and stop.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is it ever ok to say later?</strong></p>
              <p>Only with a time you will write again. Then write again.</p>
              <p><strong>What if you do not know the answer?</strong></p>
              <p>Ask two facts. Hand off. Do not park.</p>
              <p><strong>Does PROXe invent a price while it waits?</strong></p>
              <p>No. It books the consult or hands you the thread.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>I'll get back to you is not a reply. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
