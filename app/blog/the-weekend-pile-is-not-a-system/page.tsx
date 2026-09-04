import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'The weekend pile is not a system | PROXe',
  description: 'Monday catch-up is not the desk.',
  alternates: {
    canonical: 'https://goproxe.com/blog/the-weekend-pile-is-not-a-system',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/the-weekend-pile-is-not-a-system.png'],
  },
}

const articleContent = `Friday at 7pm the leads keep writing. You save them for Monday. By Monday the pile is a wall.
Some booked elsewhere over the weekend. Your side calls that a backlog. Their side calls it silence.
A weekend pile is a stack. A system answers, qualifies, books, and follows up while you are off. The desk does the second one.

A pile means you will look later. The lead still waits now.
A system means every inbound gets a next line when it lands. Two facts. Two times. Or a clear handoff.
If the plan is catch up on Monday, you parked the weekend. You did not desk.

Mute WhatsApp Friday night. Open Monday.
Away message until Monday. No slot offered.
Staff screenshots into a weekend group. No line back to the lead.
CRM status Weekend. Still New on Monday.

You can open any Friday thread and point at the last line the lead got before Monday.
If that line is missing until your Monday scroll, you ran a pile. You did not run a desk.

Clinics, coaches, home services, anyone whose Monday starts with a weekend wall and empty calendar gaps.
If weekend leads keep vanishing before Monday, this page is the map.

PROXe is the desk that runs when the weekend pile would grow.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

Is catching up Monday fine? Fine for you. Not for the lead who wrote Friday.
Does PROXe work on weekends? Yes. It writes the next useful line when the lead writes.
What if you need a person? It asks two facts, then hands the thread with context.
Does it replace the clinic? No. It runs the desk until a person or a slot.
How long to go live? 48 hours.

The weekend pile is not a system. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is catching up Monday fine?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fine for you. Not for the lead who wrote Friday.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe work on weekends?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It writes the next useful line when the lead writes.',
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

export default function TheWeekendPileIsNotASystemPage() {
  const slug = 'the-weekend-pile-is-not-a-system'
  const pageUrl = 'https://goproxe.com/blog/the-weekend-pile-is-not-a-system'
  const pageTitle = 'The weekend pile is not a system'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-system', text: 'How you know it was a system' },
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
              <p>Friday at 7pm the leads keep writing. You save them for Monday. By Monday the pile is a wall.</p>
              <p>Some booked elsewhere over the weekend. Your side calls that a backlog. Their side calls it silence.</p>
              <p>A weekend pile is a stack. A system answers, qualifies, books, and follows up while you are off. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A pile means you will look later. The lead still waits now.</p>
              <p>A system means every inbound gets a next line when it lands. Two facts. Two times. Or a clear handoff.</p>
              <p>If the plan is catch up on Monday, you parked the weekend. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Mute WhatsApp Friday night. Open Monday.</p>
              <p>Away message until Monday. No slot offered.</p>
              <p>Staff screenshots into a weekend group. No line back to the lead.</p>
              <p>CRM status Weekend. Still New on Monday.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-system">How you know it was a system</h2>
              <p>You can open any Friday thread and point at the last line the lead got before Monday.</p>
              <p>If that line is missing until your Monday scroll, you ran a pile. You did not run a desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose Monday starts with a weekend wall and empty calendar gaps.</p>
              <p>If weekend leads keep vanishing before Monday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that runs when the weekend pile would grow.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is catching up Monday fine?</strong></p>
              <p>Fine for you. Not for the lead who wrote Friday.</p>
              <p><strong>Does PROXe work on weekends?</strong></p>
              <p>Yes. It writes the next useful line when the lead writes.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The weekend pile is not a system. Talk to PROXe on the site.</p>
              <p>Related: <a href="/blog/closing-the-inbox-is-not-done">Closing the inbox is not done</a>. <a href="/blog/silence-is-not-a-decision">Silence is not a decision</a>. <a href="/blog/follow-up-is-a-system">Follow-up is a system</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
