import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'The ad is not the desk | PROXe',
  description: `A click is not a booking.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/the-ad-is-not-the-desk',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/the-ad-is-not-the-desk.png'],
  },
}

const articleContent = `A click is not a booking. A WhatsApp that opened from an ad is not a booked slot. Most teams treat the click as the work. The work is the thread that still has to answer, qualify, and put two times in front of them.

They tapped. The chat opened. Then it sat.

The ad is discovery. The desk is what happens after.

## Two different jobs

The ad gets attention. Click to WhatsApp. Click to the site. That is marketing. It is real. It is not a lead until someone is in a conversation that can book. [Who answers the customer](/blog/who-answers-the-customer). [A paid lead with no reply](/blog/paid-lead-no-reply)

The thread is the desk. Answer on that channel. Two questions. Two slots. Follow up until they decide. [What to measure on inbound](/blog/what-to-measure-on-inbound)

If you only staff the ad, you will pay for clicks and still miss the consult.

## What people run instead

A click-to-WhatsApp button, then silence. You bought the open. You left the desk empty.

An auto greeting and no two times. They bounce.

A form after the click. Another job. [The website is not the desk](/blog/the-website-is-not-the-desk)

A CRM row for the click and no thread. [Your CRM will not answer](/blog/crm-wont-answer)

## How you know the click became a lead

There is a thread. There is a day and a time they picked. Not a click count. Not a CTR.

If you cannot point at the message where they chose Thursday, you have a click. You do not have a lead.

## Who this is for

Anyone running ads into WhatsApp, Instagram, or the site. Clinics, coaches, home services.

If your report is clicks and you cannot show Thursday 4pm, this page is the map.

## Then PROXe

PROXe is the desk after the click.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The ad, the open, the WhatsApp: one person. Two slots in the thread they just opened. It does not invent a fee. It does not replace the clinic. It does the first reply so the click was not wasted.

[What is PROXe?](/blog/what-is-proxe)

Talk to PROXe at [goproxe.com](/).

## Questions people ask

Why do paid WhatsApp clicks not book?
Because the click is discovery. The desk still has to answer, qualify, and offer two slots.

What should happen after a click-to-WhatsApp ad?
A useful reply. Two questions. Two times. In that thread.

Do I still need ads?
Yes. The ad gets the click. The desk gets the slot.

Does it invent a price?
No. It books the consult and hands you the thread.

How long to go live?
48 hours.

The ad is not the desk. Talk to PROXe on the site.

Related: A paid lead with no reply. Who answers the customer. What to measure on inbound. The website is not the desk.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why do paid WhatsApp clicks not book?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because the click is discovery. The desk still has to answer, qualify, and offer two slots.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should happen after a click-to-WhatsApp ad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A useful reply. Two questions. Two times. In that thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I still need ads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The ad gets the click. The desk gets the slot.',
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

export default function TheAdIsNotTheDeskPage() {
  const slug = 'the-ad-is-not-the-desk'
  const pageUrl = 'https://goproxe.com/blog/the-ad-is-not-the-desk'
  const pageTitle = 'The ad is not the desk'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-the-click-became-a-lead', text: 'How you know the click became a lead' },
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
              <p>A click is not a booking. A WhatsApp that opened from an ad is not a booked slot. Most teams treat the click as the work. The work is the thread that still has to answer, qualify, and put two times in front of them.</p>
              <p>They tapped. The chat opened. Then it sat.</p>
              <p>The ad is discovery. The desk is what happens after.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The ad gets attention. Click to WhatsApp. Click to the site. That is marketing. It is real. It is not a lead until someone is in a conversation that can book. <a href="/blog/who-answers-the-customer">Who answers the customer</a>. <a href="/blog/paid-lead-no-reply">A paid lead with no reply</a></p>
              <p>The thread is the desk. Answer on that channel. Two questions. Two slots. Follow up until they decide. <a href="/blog/what-to-measure-on-inbound">What to measure on inbound</a></p>
              <p>If you only staff the ad, you will pay for clicks and still miss the consult.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A click-to-WhatsApp button, then silence. You bought the open. You left the desk empty.</p>
              <p>An auto greeting and no two times. They bounce.</p>
              <p>A form after the click. Another job. <a href="/blog/the-website-is-not-the-desk">The website is not the desk</a></p>
              <p>A CRM row for the click and no thread. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-the-click-became-a-lead">How you know the click became a lead</h2>
              <p>There is a thread. There is a day and a time they picked. Not a click count. Not a CTR.</p>
              <p>If you cannot point at the message where they chose Thursday, you have a click. You do not have a lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Anyone running ads into WhatsApp, Instagram, or the site. Clinics, coaches, home services.</p>
              <p>If your report is clicks and you cannot show Thursday 4pm, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk after the click.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The ad, the open, the WhatsApp: one person. Two slots in the thread they just opened. It does not invent a fee. It does not replace the clinic. It does the first reply so the click was not wasted.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Why do paid WhatsApp clicks not book?</strong></p>
              <p>Because the click is discovery. The desk still has to answer, qualify, and offer two slots.</p>
              <p><strong>What should happen after a click-to-WhatsApp ad?</strong></p>
              <p>A useful reply. Two questions. Two times. In that thread.</p>
              <p><strong>Do I still need ads?</strong></p>
              <p>Yes. The ad gets the click. The desk gets the slot.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The ad is not the desk. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
