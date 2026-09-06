import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'They WhatsApped while you were with a client. The firm that answered got the brief.',
  description:
    'CA, lawyer, consultant inbound dies in the meeting. Answer, qualify, book the consult. Do not wait until you hang up.',
  alternates: {
    canonical: 'https://goproxe.com/blog/professional-services-with-a-client',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/professional-services-with-a-client.png'],
  },
}

const articleContent = `They wrote at 2:10pm. Can you take a new brief. Need someone this week. You were in a meeting. Phone down. You replied at 6. They had already booked the CA who asked two questions at 2:12. Silence is not professionalism. It is a lost brief.

What firms actually run. Personal WhatsApp. A greeting. Email tomorrow. A CRM for the file. Lawyer in court, consultant on a call, CA in a close: same leak. After hours the same. They wanted a slot this week.

What to do instead. Answer on WhatsApp, Instagram, the site, the missed call. Same person. One memory. Qualify: what, when, who. Offer two consult slots. Book it. Do not invent a fee. You hang up. The next brief is already on the calendar.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it replace you?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It does the reply while you are with a client. You do the work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it quote a fee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the consult and hands you the thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need someone on the phone in court?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk keeps working. You do not.',
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

export default function ProfessionalServicesWithAClientPage() {
  const slug = 'professional-services-with-a-client'
  const pageUrl = 'https://goproxe.com/blog/professional-services-with-a-client'
  const pageTitle = 'They WhatsApped while you were with a client. The firm that answered got the brief.'

  const tocItems = [
    { id: 'what-firms-actually-run', text: 'What firms actually run' },
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
              <p>They wrote at 2:10pm. Can you take a new brief. Need someone this week.</p>
              <p>You were in a meeting. Phone down. You replied at 6. They had already booked the CA who asked two questions at 2:12.</p>
              <p>Silence is not professionalism. It is a lost brief.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-firms-actually-run">What firms actually run</h2>
              <p>Personal WhatsApp. A greeting. Email tomorrow. A CRM for the file.</p>
              <p>Lawyer in court, consultant on a call, CA in a close: same leak. After hours the same. They wanted a slot this week.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer on WhatsApp, Instagram, the site, the missed call. Same person. One memory.</p>
              <p>Qualify: what, when, who. Offer two consult slots. Book it. Do not invent a fee.</p>
              <p>You hang up. The next brief is already on the calendar.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Firms that already get inbound and still answer when the meeting ends. The meeting ending is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/professional-services">professional services</a>. Same leak for <a href="/industries/clinics">clinics</a> and <a href="/industries/coaching">coaching</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does it replace you?</strong></p>
              <p>No. It does the reply while you are with a client. You do the work.</p>
              <p><strong>Will it quote a fee?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>Do I need someone on the phone in court?</strong></p>
              <p>No. The desk keeps working. You do not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>You do the work. The inbox does not sit. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>
    </BlogPostWrapper>
  )
}
