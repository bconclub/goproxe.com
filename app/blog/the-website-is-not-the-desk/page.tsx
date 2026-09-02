import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'The website is not the desk | PROXe',
  description: "A form is not a booking.",
  alternates: {
    canonical: 'https://goproxe.com/blog/the-website-is-not-the-desk',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/the-website-is-not-the-desk.png'],
  },
}

const articleContent = `A form is not a booking. A chat widget is not a booking. A click is not a booking. Most teams treat the site as the work. The work is the thread that still has to answer, qualify, and put two slots in front of them.

They filled the form at 9:14. Name, phone, "want a consult." Then the inbox sat. The clinic that wrote in WhatsApp got Thursday.

The site is discovery. The desk is what happens after.

## Two different jobs

The page gets attention. Forms, chat, a click to WhatsApp. That is marketing. It is real. It is not a lead until someone is in a conversation that can book. [A conversation that books](/blog/conversation-that-books)

The thread is the desk. Same job as Instagram DMs and inbound WhatsApp. Answer on that channel. Two questions. Two slots. Follow up until they decide. [What to measure on inbound](/blog/what-to-measure-on-inbound)

If you only staff the site, you will look busy and still miss the consult.

## What people run instead

A thank-you page and an email. The lead is on their phone. Email is a second hunt.

A chatbot that dumps FAQs. No two questions. No two times. They bounce.

A CRM row with no thread. Someone will "get back." They do not. [Your CRM will not answer](/blog/crm-wont-answer)

A click-to-WhatsApp button, then silence. You paid for the click and left the desk empty. [Who answers the customer](/blog/who-answers-the-customer)

## How you know it became a lead

There is a thread. There is a day and a time they picked. Not a form submit. Not a chat that said hi and died.

If you cannot point at the message where they chose Thursday, you have a website hit. You do not have a lead.

## Who this is for

Clinics, coaches, home services, anyone whose ads and Google land on a site that asks for a form.

If your report is form fills and you cannot show Thursday 4pm, this page is the map.

## Then PROXe

PROXe is the desk after the form.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The form, the chat, the WhatsApp they open next: one person. Two slots in the thread they already started. It does not invent a fee. It does not replace the clinic. It does the 9:14 reply so they walk into a booked consult.

[What is PROXe?](/blog/what-is-proxe)

Talk to PROXe at [goproxe.com](/).

## Questions people ask

Does a website form count as a lead?
No. A form is discovery. A lead is a thread that can book.

Why don't site enquiries book?
Because nobody did the desk. Two questions. Two times. In a thread.

Do I still need a website?
Yes. The page gets the click. The desk gets the slot.

Does it invent a price?
No. It books the consult and hands you the thread.

How long to go live?
48 hours.

The site is not the desk. Talk to PROXe on the site.

Related: A conversation that books. What to measure on inbound. What is PROXe? Who answers the customer.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does a website form count as a lead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A form is discovery. A lead is a thread that can book.',
      },
    },
    {
      '@type': 'Question',
      name: "Why don't site enquiries book?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because nobody did the desk. Two questions. Two times. In a thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I still need a website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The page gets the click. The desk gets the slot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the consult and hands you the thread.',
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

export default function TheWebsiteIsNotTheDeskPage() {
  const slug = 'the-website-is-not-the-desk'
  const pageUrl = 'https://goproxe.com/blog/the-website-is-not-the-desk'
  const pageTitle = 'The website is not the desk'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-became-a-lead', text: 'How you know it became a lead' },
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
              <p>A form is not a booking. A chat widget is not a booking. A click is not a booking. Most teams treat the site as the work. The work is the thread that still has to answer, qualify, and put two slots in front of them.</p>
              <p>They filled the form at 9:14. Name, phone, "want a consult." Then the inbox sat. The clinic that wrote in WhatsApp got Thursday.</p>
              <p>The site is discovery. The desk is what happens after.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The page gets attention. Forms, chat, a click to WhatsApp. That is marketing. It is real. It is not a lead until someone is in a conversation that can book. <a href="/blog/conversation-that-books">A conversation that books</a></p>
              <p>The thread is the desk. Same job as Instagram DMs and inbound WhatsApp. Answer on that channel. Two questions. Two slots. Follow up until they decide. <a href="/blog/what-to-measure-on-inbound">What to measure on inbound</a></p>
              <p>If you only staff the site, you will look busy and still miss the consult.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A thank-you page and an email. The lead is on their phone. Email is a second hunt.</p>
              <p>A chatbot that dumps FAQs. No two questions. No two times. They bounce.</p>
              <p>A CRM row with no thread. Someone will "get back." They do not. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
              <p>A click-to-WhatsApp button, then silence. You paid for the click and left the desk empty. <a href="/blog/who-answers-the-customer">Who answers the customer</a></p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-became-a-lead">How you know it became a lead</h2>
              <p>There is a thread. There is a day and a time they picked. Not a form submit. Not a chat that said hi and died.</p>
              <p>If you cannot point at the message where they chose Thursday, you have a website hit. You do not have a lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose ads and Google land on a site that asks for a form.</p>
              <p>If your report is form fills and you cannot show Thursday 4pm, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk after the form.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The form, the chat, the WhatsApp they open next: one person. Two slots in the thread they already started. It does not invent a fee. It does not replace the clinic. It does the 9:14 reply so they walk into a booked consult.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does a website form count as a lead?</strong></p>
              <p>No. A form is discovery. A lead is a thread that can book.</p>
              <p><strong>Why don't site enquiries book?</strong></p>
              <p>Because nobody did the desk. Two questions. Two times. In a thread.</p>
              <p><strong>Do I still need a website?</strong></p>
              <p>Yes. The page gets the click. The desk gets the slot.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The site is not the desk. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
