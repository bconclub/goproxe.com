import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'The parent messaged at 9pm. The institute that answered got the admission. | PROXe',
  description:
    'Coaching inbound dies after class and after 7pm. Answer, qualify the exam, book the counselling. Do not wait until morning.',
  alternates: {
    canonical: 'https://goproxe.com/blog/coaching-parents-at-night',
  },
  openGraph: {
    images: ['https://goproxe.com/home/Conversations.webp'],
  },
}

const articleContent = `The parent wrote at 9:12pm. JEE, this year, demo this week. Your counsellor finished class at 8. Phone on silent. Morning they called. The parent had already booked the institute that asked the two questions at 9:14. They did not ghost you. They messaged five places. First useful reply got the seat.

What coaching desks run. Counsellor WhatsApp on a personal phone. A greeting. A PDF of batches. A CRM for the admission board. DNP is the same leak. They called, parent was in a meeting, nobody wrote on WhatsApp. The lead is not cold. The thread sat.

What to do instead. Answer on WhatsApp, Instagram, the site, the missed call. Same parent. One memory. Qualify in the thread: exam, year, city. Offer two counselling slots. Book it. Do not invent a fee or a rank. Morning the counsellor walks into a booked demo, not a list of last night's greets.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it replace the counsellor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It does the 9pm reply. The counsellor walks into a booked slot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it dump the brochure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It asks, then books.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need night staff?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk keeps working. The counsellor does not.',
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

export default function CoachingParentsAtNightPage() {
  const slug = 'coaching-parents-at-night'
  const pageUrl = 'https://goproxe.com/blog/coaching-parents-at-night'
  const pageTitle = 'The parent messaged at 9pm. The institute that answered got the admission.'

  const tocItems = [
    { id: 'what-coaching-desks-run', text: 'What coaching desks run' },
    { id: 'what-to-do-instead', text: 'What to do instead' },
    { id: 'who-this-is-for', text: 'Who this is for' },
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
              <p>The parent wrote at 9:12pm. JEE, this year, demo this week.</p>
              <p>Your counsellor finished class at 8. Phone on silent. Morning they called. The parent had already booked the institute that asked the two questions at 9:14.</p>
              <p>They did not ghost you. They messaged five places. First useful reply got the seat.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-coaching-desks-run">What coaching desks run</h2>
              <p>Counsellor WhatsApp on a personal phone. A greeting. A PDF of batches. A CRM for the admission board.</p>
              <p>DNP is the same leak. They called, parent was in a meeting, nobody wrote on WhatsApp. The lead is not cold. The thread sat.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer on WhatsApp, Instagram, the site, the missed call. Same parent. One memory.</p>
              <p>Qualify in the thread: exam, year, city. Offer two counselling slots. Book it. Do not invent a fee or a rank.</p>
              <p>Morning the counsellor walks into a booked demo, not a list of last night's greets.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Institutes that already get inbound on WhatsApp and still answer when class ends. Class ending is too late.</p>
              <p>How PROXe does this for <a href="/industries/coaching">coaching</a>. Same leak for <a href="/industries/clinics">clinics</a> and <a href="/industries/realestate">real estate</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does it replace the counsellor?</strong></p>
              <p>No. It does the 9pm reply. The counsellor walks into a booked slot.</p>
              <p><strong>Will it dump the brochure?</strong></p>
              <p>No. It asks, then books.</p>
              <p><strong>Do I need night staff?</strong></p>
              <p>No. The desk keeps working. The counsellor does not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>After class they still want a slot. Talk to PROXe on <a href="/">the site</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
