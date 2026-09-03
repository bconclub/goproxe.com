import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Qualify before you book | PROXe',
  description: `A reply is not a qualified lead.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/qualify-before-you-book',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/qualify-before-you-book.png'],
  },
}

const articleContent = `A hello is not a lead you can book. A thanks for writing is not qualify. Most teams answer, then dump a menu, then wait. The work is two questions in the same thread, then two times.

They wrote hi. You wrote back. You still do not know the job, the area, or when they can come.

A reply is contact. Qualify is enough to book.

Two different jobs

Reply is the first line. They know a human is there. Who answers the customer

Qualify is two or three facts in that thread: what they need, where they are, when they can do. Then you offer two times. A conversation that books. The calendar is not the desk

If you book on hello, you fill Thursday with people who were never going to show. If you never ask, you never book.

What people run instead

Hi, thanks for writing, how can I help. Then silence.

The full price list in one paste. Do not invent the price

A 12-field form, then nobody writes in the thread. The website is not the desk

Booking the first person who said hello, with no area and no service.

How you know they are qualified

You can point at a message that names the job and a time they can do. Then you write two slots.

If the thread is only hi and a thanks, you have not qualified. You have a greeting.

Who this is for

Clinics, coaches, home services, anyone whose WhatsApp books people they cannot serve, or never books at all because nobody asked.

If your calendar is full of the wrong Thursday, or empty after a busy inbox, this page is the map.

Then PROXe

PROXe is the desk that asks, then books.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two or three questions. Then two times. It does not invent a fee. It does not replace the clinic. It does not book on hello.

What is PROXe?

Talk to PROXe at goproxe.com.

Questions people ask

How many questions before a slot?
Two or three. Service, area, when. Then two times.

What if they ask the price first?
Do not invent a fee. Book the consult. Hand the thread over.

Do you book every hello?
No. Qualify first. A greeting is not a slot.

Does it replace the clinic?
No. It qualifies and books. You run the visit.

How long to go live?
48 hours.

Qualify before you book. Talk to PROXe on the site.

Related: A conversation that books. Do not invent the price. The calendar is not the desk. Who answers the customer.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `How many questions before a slot?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Two or three. Service, area, when. Then two times.`,
      },
    },
    {
      '@type': 'Question',
      name: `What if they ask the price first?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Do not invent a fee. Book the consult. Hand the thread over.`,
      },
    },
    {
      '@type': 'Question',
      name: `Do you book every hello?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Qualify first. A greeting is not a slot.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it replace the clinic?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It qualifies and books. You run the visit.`,
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

export default function QualifyBeforeYouBookPage() {
  const slug = 'qualify-before-you-book'
  const pageUrl = 'https://goproxe.com/blog/qualify-before-you-book'
  const pageTitle = `Qualify before you book`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-they-are-qualified', text: 'How you know they are qualified' },
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
              <p>A hello is not a lead you can book. A thanks for writing is not qualify. Most teams answer, then dump a menu, then wait. The work is two questions in the same thread, then two times.</p>
              <p>They wrote hi. You wrote back. You still do not know the job, the area, or when they can come.</p>
              <p>A reply is contact. Qualify is enough to book.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Reply is the first line. They know a human is there. <a href="/blog/who-answers-the-customer">Who answers the customer</a></p>
              <p>Qualify is two or three facts in that thread: what they need, where they are, when they can do. Then you offer two times. <a href="/blog/conversation-that-books">A conversation that books</a>. <a href="/blog/the-calendar-is-not-the-desk">The calendar is not the desk</a></p>
              <p>If you book on hello, you fill Thursday with people who were never going to show. If you never ask, you never book.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Hi, thanks for writing, how can I help. Then silence.</p>
              <p>The full price list in one paste. <a href="/blog/dont-invent-the-price">Do not invent the price</a></p>
              <p>A 12-field form, then nobody writes in the thread. <a href="/blog/the-website-is-not-the-desk">The website is not the desk</a></p>
              <p>Booking the first person who said hello, with no area and no service.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-they-are-qualified">How you know they are qualified</h2>
              <p>You can point at a message that names the job and a time they can do. Then you write two slots.</p>
              <p>If the thread is only hi and a thanks, you have not qualified. You have a greeting.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp books people they cannot serve, or never books at all because nobody asked.</p>
              <p>If your calendar is full of the wrong Thursday, or empty after a busy inbox, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that asks, then books.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two or three questions. Then two times. It does not invent a fee. It does not replace the clinic. It does not book on hello.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How many questions before a slot?</strong></p>
              <p>Two or three. Service, area, when. Then two times.</p>
              <p><strong>What if they ask the price first?</strong></p>
              <p>Do not invent a fee. Book the consult. Hand the thread over.</p>
              <p><strong>Do you book every hello?</strong></p>
              <p>No. Qualify first. A greeting is not a slot.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It qualifies and books. You run the visit.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Qualify before you book. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
