import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Instagram engagement is not a lead | PROXe',
  description:
    'A like is not a booking. A comment is not a booking.',
  alternates: {
    canonical: 'https://goproxe.com/blog/instagram-engagement-is-not-a-lead',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/instagram-engagement-is-not-a-lead.png'],
  },
}

const articleContent = `A like is not a booking. A comment is not a booking. A save is not a booking. Most teams treat the public numbers as the work. The work is the DM that still has to answer, qualify, and put two slots in the thread.

The reel did its job. Someone commented. Someone DMed fees. Then the inbox sat. The studio that wrote in the DM got the trial.

Engagement is discovery. The desk is what happens after.

The feed gets attention. Comments, likes, shares. That is marketing. It is real. It is not a lead until someone is in a conversation that can book.

The DM is the desk. Same job as WhatsApp. Answer on that channel. Two questions. Two slots. Follow up until they decide. One memory if they also WhatsApp later. A conversation that books. One lead, four channels, one memory.

If you only staff the feed, you will look busy and still miss the trial.

A comment-to-link tool. Comment BOOK, get a Calendly. A link is another job. Most people do not tap it.

A canned "thanks for the comment, check the link in bio." Bio is a second hunt. The lead is already in a thread you did not use.

An intern who opens DMs when they finish editing. The 9pm comment is cold by morning. Follow-up is a system.

A WhatsApp number in the bio, and silence in the DM. You split the person into two inboxes. They repeat themselves. You treat them as two leads. Who answers the customer.

There is a thread. There is a day and a time they picked. Not a heart on the reel. Not a keyword comment with no follow-through.

If you cannot point at the message where they chose Thursday, you have engagement. You do not have a lead.

Gyms, spas, coaches, clinics, anyone whose inbound starts on Instagram. Reels, ads, comments, DMs.

If your team celebrates comments and cannot show bookings from those comments, this page is the map.

PROXe is the desk on Instagram too.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The comment, the DM, the WhatsApp later: one person. Two slots in the thread they already opened. It does not invent a fee. It does not replace the coach. It does the 9pm DM so they walk into a booked trial.

What is PROXe?

Talk to PROXe at goproxe.com.

Because a comment is not a conversation that books. The DM still has to answer, qualify, and offer two slots.

Write in the DM. Two questions. Two times. Book there. Do not send them to the bio.

They will use both. One memory. Do not make them start over.

No. It books the trial or the consult and hands you the thread.

48 hours.

The feed is not the desk. Talk to PROXe on the site.

Related: A conversation that books. One lead, four channels, one memory. Who answers the customer. Industries: Coaching, Wellness, Fitness.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why doesn\'t Instagram engagement become leads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because a comment is not a conversation that books. The DM still has to answer, qualify, and offer two slots.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you turn a comment into a booking?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Write in the DM. Two questions. Two times. Book there. Do not send them to the bio.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I still need WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They will use both. One memory. Do not make them start over.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the trial or the consult and hands you the thread.',
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

export default function InstagramEngagementIsNotALeadPage() {
  const slug = 'instagram-engagement-is-not-a-lead'
  const pageUrl = 'https://goproxe.com/blog/instagram-engagement-is-not-a-lead'
  const pageTitle = 'Instagram engagement is not a lead'

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
              <p>A like is not a booking. A comment is not a booking. A save is not a booking. Most teams treat the public numbers as the work. The work is the DM that still has to answer, qualify, and put two slots in the thread.</p>
              <p>The reel did its job. Someone commented. Someone DMed fees. Then the inbox sat. The studio that wrote in the DM got the trial.</p>
              <p>Engagement is discovery. The desk is what happens after.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The feed gets attention. Comments, likes, shares. That is marketing. It is real. It is not a lead until someone is in a conversation that can book.</p>
              <p>The DM is the desk. Same job as WhatsApp. Answer on that channel. Two questions. Two slots. Follow up until they decide. One memory if they also WhatsApp later. <a href="/blog/conversation-that-books">A conversation that books</a>. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>.</p>
              <p>If you only staff the feed, you will look busy and still miss the trial.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A comment-to-link tool. Comment BOOK, get a Calendly. A link is another job. Most people do not tap it.</p>
              <p>A canned "thanks for the comment, check the link in bio." Bio is a second hunt. The lead is already in a thread you did not use.</p>
              <p>An intern who opens DMs when they finish editing. The 9pm comment is cold by morning. <a href="/blog/follow-up-is-a-system">Follow-up is a system</a>.</p>
              <p>A WhatsApp number in the bio, and silence in the DM. You split the person into two inboxes. They repeat themselves. You treat them as two leads. <a href="/blog/who-answers-the-customer">Who answers the customer</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-became-a-lead">How you know it became a lead</h2>
              <p>There is a thread. There is a day and a time they picked. Not a heart on the reel. Not a keyword comment with no follow-through.</p>
              <p>If you cannot point at the message where they chose Thursday, you have engagement. You do not have a lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Gyms, spas, coaches, clinics, anyone whose inbound starts on Instagram. Reels, ads, comments, DMs.</p>
              <p>If your team celebrates comments and cannot show bookings from those comments, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk on Instagram too.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The comment, the DM, the WhatsApp later: one person. Two slots in the thread they already opened. It does not invent a fee. It does not replace the coach. It does the 9pm DM so they walk into a booked trial.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Why doesn't Instagram engagement become leads?</strong></p>
              <p>Because a comment is not a conversation that books. The DM still has to answer, qualify, and offer two slots.</p>
              <p><strong>How do you turn a comment into a booking?</strong></p>
              <p>Write in the DM. Two questions. Two times. Book there. Do not send them to the bio.</p>
              <p><strong>Do I still need WhatsApp?</strong></p>
              <p>They will use both. One memory. Do not make them start over.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the trial or the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The feed is not the desk. Talk to PROXe on the site.</p>
              <p>Related: <a href="/blog/conversation-that-books">A conversation that books</a>. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>. <a href="/blog/who-answers-the-customer">Who answers the customer</a>. Industries: <a href="/industries/coaching">Coaching</a>, <a href="/industries/wellness">Wellness</a>, <a href="/industries/wellness">Fitness</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
