import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Do not invent the price | PROXe',
  description: `A fee you made up is not a booking.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/dont-invent-the-price',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/dont-invent-the-price.png'],
  },
}

const articleContent = `A fee you made up is not a booking. A guess in the thread is not a consult. Most teams think the desk has to quote. The desk has to book.

They asked "how much." Someone typed a number they did not own. The lead argued. Then they left.

The job is two questions, two slots, and a thread the owner can finish. Not a price you invented.

The quote is a decision the owner makes. Rate card. Package. What this job actually costs. That is not the inbound desk.

The desk is the conversation that can book. Answer. Two questions. Two slots. Hand the thread. A conversation that books. Handoff without starting over.

If you quote what you do not know, you will look fast and still lose the consult.

A canned "starts at" line with a number nobody approved.

A bot that invents a package to keep the chat going.

A form that asks budget, then nobody writes back. The website is not the desk.

An intern guessing. The owner finds out when the lead shows up angry.

The thread has a day and a time. It does not have a fee the business does not stand behind.

If you cannot point at who set the number, you do not have a quote. You have a leak.

Clinics, home services, coaches, anyone whose inbound asks "how much" before they book.

If the first reply is a number you cannot defend, this page is the map.

PROXe is the desk that does not invent a fee.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two questions. Two slots. The owner finishes the price. It does not make up a number. It does not replace the clinic. It books the consult and hands you the thread.

What is PROXe?

Talk to PROXe at goproxe.com.

No. It books the consult. The owner sets the fee.

Two questions. Two times. Do not guess. Hand the thread.

No.

Yes. That is the owner. That is not the inbound desk.

48 hours.

Do not invent the price. Talk to PROXe on the site.

Related: A conversation that books. Handoff without starting over. What is PROXe? The website is not the desk.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Should an AI quote a price on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the consult. The owner sets the fee.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if they ask the fee first?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Two questions. Two times. Do not guess. Hand the thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I still need a rate card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. That is the owner. That is not the inbound desk.',
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

export default function DontInventThePricePage() {
  const slug = 'dont-invent-the-price'
  const pageUrl = 'https://goproxe.com/blog/dont-invent-the-price'
  const pageTitle = 'Do not invent the price'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-did-not-invent-a-price', text: 'How you know it did not invent a price' },
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
              <p>A fee you made up is not a booking. A guess in the thread is not a consult. Most teams think the desk has to quote. The desk has to book.</p>
              <p>They asked "how much." Someone typed a number they did not own. The lead argued. Then they left.</p>
              <p>The job is two questions, two slots, and a thread the owner can finish. Not a price you invented.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The quote is a decision the owner makes. Rate card. Package. What this job actually costs. That is not the inbound desk.</p>
              <p>The desk is the conversation that can book. Answer. Two questions. Two slots. Hand the thread. <a href="/blog/conversation-that-books">A conversation that books</a>. <a href="/blog/handoff-without-starting-over">Handoff without starting over</a>.</p>
              <p>If you quote what you do not know, you will look fast and still lose the consult.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A canned "starts at" line with a number nobody approved.</p>
              <p>A bot that invents a package to keep the chat going.</p>
              <p>A form that asks budget, then nobody writes back. <a href="/blog/the-website-is-not-the-desk">The website is not the desk</a>.</p>
              <p>An intern guessing. The owner finds out when the lead shows up angry.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-did-not-invent-a-price">How you know it did not invent a price</h2>
              <p>The thread has a day and a time. It does not have a fee the business does not stand behind.</p>
              <p>If you cannot point at who set the number, you do not have a quote. You have a leak.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, home services, coaches, anyone whose inbound asks "how much" before they book.</p>
              <p>If the first reply is a number you cannot defend, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that does not invent a fee.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two questions. Two slots. The owner finishes the price. It does not make up a number. It does not replace the clinic. It books the consult and hands you the thread.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="https://goproxe.com">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Should an AI quote a price on WhatsApp?</strong></p>
              <p>No. It books the consult. The owner sets the fee.</p>
              <p><strong>What if they ask the fee first?</strong></p>
              <p>Two questions. Two times. Do not guess. Hand the thread.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No.</p>
              <p><strong>Do I still need a rate card?</strong></p>
              <p>Yes. That is the owner. That is not the inbound desk.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Do not invent the price. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
