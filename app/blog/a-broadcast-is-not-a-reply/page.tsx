import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'A broadcast is not a reply',
  description:
    'A blast is marketing. Inbound still needs a reply in their thread.',
  alternates: {
    canonical: 'https://goproxe.com/blog/a-broadcast-is-not-a-reply',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-broadcast-is-not-a-reply.png'],
  },
}

const articleContent = `You sent 400 WhatsApps at 9. That is a campaign. The person who wrote at 9:12 still has no answer.

A broadcast is one message to many. A reply is one thread, one person, until they book or they say no.

Marketing fills the pipe. The desk works the pipe.

A blast is outbound. Offer, reminder, promo. The ad is not the desk. A reply is inbound. They wrote. You ask. You offer two times. Qualify before you book. Who answers the customer. If you count sends and skip the new chats, you ran a campaign and missed the lead.

A morning broadcast, then a closed laptop. Status labels on the blast. Unread inbound sitting under it. A catalogue dump to the list, and no slot in any thread. Do not invent the price. Treating a delivery tick as a conversation.

You can point at their thread. Two questions. Two times. Or a no. If the last thing they got is the same line 400 other people got, they did not get a desk.

Clinics, coaches, home services, anyone whose WhatsApp is a blast tool with a silent inbox under it. If your sends are high and your bookings are not, this page is the map.

PROXe is the desk on inbound. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. WhatsApp, IG, site, call. The blast is not the job. The new chat is. It does not invent a fee. It does not replace the clinic. It does not send the campaign for you. What is PROXe? Talk to PROXe at goproxe.com.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I still send a broadcast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. That is marketing. Then open the new chats.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does a delivery tick count as a reply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A reply is in their thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe send blasts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It runs the inbound desk.',
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

export default function ABroadcastIsNotAReplyPage() {
  const slug = 'a-broadcast-is-not-a-reply'
  const pageUrl = 'https://goproxe.com/blog/a-broadcast-is-not-a-reply'
  const pageTitle = 'A broadcast is not a reply'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-reply', text: 'How you know it was a reply' },
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
              <p>You sent 400 WhatsApps at 9. That is a campaign. The person who wrote at 9:12 still has no answer.</p>
              <p>A broadcast is one message to many. A reply is one thread, one person, until they book or they say no.</p>
              <p>Marketing fills the pipe. The desk works the pipe.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A blast is outbound. Offer, reminder, promo. <a href="/blog/the-ad-is-not-the-desk">The ad is not the desk</a></p>
              <p>A reply is inbound. They wrote. You ask. You offer two times. <a href="/blog/qualify-before-you-book">Qualify before you book</a>. <a href="/blog/who-answers-the-customer">Who answers the customer</a></p>
              <p>If you count sends and skip the new chats, you ran a campaign and missed the lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A morning broadcast, then a closed laptop.</p>
              <p>Status labels on the blast. Unread inbound sitting under it.</p>
              <p>A catalogue dump to the list, and no slot in any thread. <a href="/blog/dont-invent-the-price">Do not invent the price</a></p>
              <p>Treating a delivery tick as a conversation.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-reply">How you know it was a reply</h2>
              <p>You can point at their thread. Two questions. Two times. Or a no.</p>
              <p>If the last thing they got is the same line 400 other people got, they did not get a desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is a blast tool with a silent inbox under it.</p>
              <p>If your sends are high and your bookings are not, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk on inbound.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. WhatsApp, IG, site, call. The blast is not the job. The new chat is. It does not invent a fee. It does not replace the clinic. It does not send the campaign for you.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Can I still send a broadcast?</strong></p>
              <p>Yes. That is marketing. Then open the new chats.</p>
              <p><strong>Does a delivery tick count as a reply?</strong></p>
              <p>No. A reply is in their thread.</p>
              <p><strong>Does PROXe send blasts?</strong></p>
              <p>No. It runs the inbound desk.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A broadcast is not a reply. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
