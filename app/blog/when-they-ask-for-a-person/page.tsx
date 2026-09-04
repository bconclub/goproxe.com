import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'When they ask for a person | PROXe',
  description:
    '"Can I talk to someone" is not a dump. The desk still asks, then hands the thread over.',
  alternates: {
    canonical: 'https://goproxe.com/blog/when-they-ask-for-a-person',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/when-they-ask-for-a-person.png'],
  },
}

const articleContent = `They wrote can I talk to a person. You dumped the chat. That is not a handoff. That is quitting on message 1.

Ask for a person is still a lead. The desk asks two questions, then hands the same thread over. Not a new chat. Not a blank inbox.

Handoff without starting over is memory. This page is the job before that handoff.

The desk stays on the thread. Two or three facts. Then a human. Qualify before you book. Handoff without starting over.
A dump is closing the chat and hoping someone calls. No ask. No summary. No slot.
If you bail on message 1, you taught them that writing gets them nowhere.

Sure, someone will call you. Then silence.
A new WhatsApp from a different number with no history. One memory, every channel.
Forward to email and leave the thread empty.
Typing please wait while I transfer with no questions asked.

You can point at the thread. What they need. When they can do. Then a person with that context.
If the last line is can I talk to someone and the next is a dead chat, you dumped it.

Clinics, coaches, home services, anyone whose team freezes when a lead asks for a human.
If your WhatsApp dies the moment they ask for a person, this page is the map.

PROXe is the desk that asks, then hands over.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two questions. Same thread. Full context for the human. It does not invent a fee. It does not replace the clinic. It does not dump the chat on message 1.
What is PROXe?
Talk to PROXe at goproxe.com.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you force AI forever?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. When they ask for a person, you hand the thread over with context.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if they only want a human?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ask two facts. Then hand off. Do not restart.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does handoff wipe the chat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Same thread. Same memory.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the consult or hands you the thread.',
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

export default function WhenTheyAskForAPersonPage() {
  const slug = 'when-they-ask-for-a-person'
  const pageUrl = 'https://goproxe.com/blog/when-they-ask-for-a-person'
  const pageTitle = 'When they ask for a person'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-desk-handoff', text: 'How you know it was a desk handoff' },
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
              <p>They wrote can I talk to a person. You dumped the chat. That is not a handoff. That is quitting on message 1.</p>
              <p>Ask for a person is still a lead. The desk asks two questions, then hands the same thread over. Not a new chat. Not a blank inbox.</p>
              <p>Handoff without starting over is memory. This page is the job before that handoff.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The desk stays on the thread. Two or three facts. Then a human. <a href="/blog/qualify-before-you-book">Qualify before you book</a>. <a href="/blog/handoff-without-starting-over">Handoff without starting over</a>.</p>
              <p>A dump is closing the chat and hoping someone calls. No ask. No summary. No slot.</p>
              <p>If you bail on message 1, you taught them that writing gets them nowhere.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Sure, someone will call you. Then silence.</p>
              <p>A new WhatsApp from a different number with no history. <a href="/blog/one-memory-every-channel">One memory, every channel</a>.</p>
              <p>Forward to email and leave the thread empty. <a href="/blog/email-is-not-the-desk">Email is not the desk</a>.</p>
              <p>Typing please wait while I transfer with no questions asked.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-desk-handoff">How you know it was a desk handoff</h2>
              <p>You can point at the thread. What they need. When they can do. Then a person with that context.</p>
              <p>If the last line is can I talk to someone and the next is a dead chat, you dumped it.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose team freezes when a lead asks for a human.</p>
              <p>If your WhatsApp dies the moment they ask for a person, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that asks, then hands over.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two questions. Same thread. Full context for the human. It does not invent a fee. It does not replace the clinic. It does not dump the chat on message 1.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Do you force AI forever?</strong></p>
              <p>No. When they ask for a person, you hand the thread over with context.</p>
              <p><strong>What if they only want a human?</strong></p>
              <p>Ask two facts. Then hand off. Do not restart.</p>
              <p><strong>Does handoff wipe the chat?</strong></p>
              <p>No. Same thread. Same memory.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult or hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>When they ask for a person. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
