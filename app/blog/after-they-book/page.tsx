import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `After they book | PROXe`,
  description: `A booking is not the end.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/after-they-book',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/after-they-book.png'],
  },
}

const articleContent = `A booking is not the end. Confirm in the thread. Remind. If they no-show, they are still a lead.

They picked Thursday 4pm. Nobody wrote back. Thursday came. The slot sat empty.

The book is a start. The desk keeps going.

The book is the slot. A day and a time in the thread. A conversation that books.

After is the desk that keeps them coming. Confirm in the same thread. Remind before the slot. If they miss it, follow up until they decide again. A no-show is still a lead. Follow-up is a system. What to measure on inbound.

If you stop at booked, you will look full and still sit empty.

A calendar invite and silence. They never opened email.

A reminder SMS from a number they do not know. They ignore it.

A CRM status booked, no thread. Nobody writes the night before. Your CRM will not answer.

A no-show written off. The lead was still there. You treated the empty chair as the end.

They got a confirm in the same thread. They got a reminder. If they missed Thursday, they got a new pair of slots.

If the only proof is a calendar row, you do not have after. You have a booking.

Clinics, coaches, home services, anyone who books on WhatsApp and still eats no-shows.

If Thursday 4pm is on the calendar and the chair is empty, this page is the map.

PROXe is the desk after they book.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Confirm in the thread. Remind. If they no-show, two new slots. It does not invent a fee. It does not replace the clinic. It does the night-before message so Thursday is not empty.

What is PROXe?

Talk to PROXe at goproxe.com.

What happens after a WhatsApp booking?
Confirm in the same thread. Remind. Keep the thread alive.

How do you cut no-shows?
Write before the slot. If they miss it, offer two new times. Do not close the lead.

Is a no-show a dead lead?
No. They are still a lead until they decide.

Does it invent a price?
No. It books the next slot and hands you the thread.

How long to go live?
48 hours.

The book is not the end. Talk to PROXe on the site.

Related: A conversation that books. Follow-up is a system. What to measure on inbound. Handoff without starting over.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `What happens after a WhatsApp booking?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Confirm in the same thread. Remind. Keep the thread alive.`,
      },
    },
    {
      '@type': 'Question',
      name: `How do you cut no-shows?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Write before the slot. If they miss it, offer two new times. Do not close the lead.`,
      },
    },
    {
      '@type': 'Question',
      name: `Is a no-show a dead lead?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. They are still a lead until they decide.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it invent a price?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It books the next slot and hands you the thread.`,
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

export default function AfterTheyBookPage() {
  const slug = 'after-they-book'
  const pageUrl = 'https://goproxe.com/blog/after-they-book'
  const pageTitle = `After they book`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-after-is-working', text: 'How you know after is working' },
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
              <p>A booking is not the end. Confirm in the thread. Remind. If they no-show, they are still a lead.</p>
              <p>They picked Thursday 4pm. Nobody wrote back. Thursday came. The slot sat empty.</p>
              <p>The book is a start. The desk keeps going.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The book is the slot. A day and a time in the thread. <a href="/blog/conversation-that-books">A conversation that books</a>.</p>
              <p>After is the desk that keeps them coming. Confirm in the same thread. Remind before the slot. If they miss it, follow up until they decide again. A no-show is still a lead. <a href="/blog/follow-up-is-a-system">Follow-up is a system</a>. <a href="/blog/what-to-measure-on-inbound">What to measure on inbound</a>.</p>
              <p>If you stop at booked, you will look full and still sit empty.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A calendar invite and silence. They never opened email.</p>
              <p>A reminder SMS from a number they do not know. They ignore it.</p>
              <p>A CRM status booked, no thread. Nobody writes the night before. <a href="/blog/crm-wont-answer">Your CRM will not answer</a>.</p>
              <p>A no-show written off. The lead was still there. You treated the empty chair as the end.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-after-is-working">How you know after is working</h2>
              <p>They got a confirm in the same thread. They got a reminder. If they missed Thursday, they got a new pair of slots.</p>
              <p>If the only proof is a calendar row, you do not have after. You have a booking.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone who books on WhatsApp and still eats no-shows.</p>
              <p>If Thursday 4pm is on the calendar and the chair is empty, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk after they book.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Confirm in the thread. Remind. If they no-show, two new slots. It does not invent a fee. It does not replace the clinic. It does the night-before message so Thursday is not empty.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>What happens after a WhatsApp booking?</strong></p>
              <p>Confirm in the same thread. Remind. Keep the thread alive.</p>
              <p><strong>How do you cut no-shows?</strong></p>
              <p>Write before the slot. If they miss it, offer two new times. Do not close the lead.</p>
              <p><strong>Is a no-show a dead lead?</strong></p>
              <p>No. They are still a lead until they decide.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the next slot and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The book is not the end. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
