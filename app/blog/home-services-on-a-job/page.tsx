import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'They called while you were on a job. The crew that answered got the work.',
  description:
    'Plumber, AC, electrician inbound dies on the job and at night. Answer, qualify, book. Do not wait until you park.',
  alternates: {
    canonical: 'https://goproxe.com/blog/home-services-on-a-job',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/home-services-on-a-job.png'],
  },
}

const articleContent = `The AC died at 2pm. They WhatsApped. You were on a roof. You replied at 7. They already booked the crew that asked address and slot at 2:04. Night is the same leak. 10pm. You see it at 8am. Gone. You did not lose the job to a bigger brand. You lost it because the chat sat while you worked.

What crews actually run. Personal phone. JustDial, the site, Instagram, the missed call. Four inboxes. No memory. Quote sent, never followed.

What to do instead. Answer on the channel they used. Same person. One memory. Qualify: address, job type, when. Offer two slots. Book tomorrow's first if it is night. Do not invent a quote. You finish the current job. The next one is already on the calendar.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it replace the technician?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It does the reply while you are on the job. You do the work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it quote a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the visit and hands you the thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need someone in the office at night?',
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

export default function HomeServicesOnAJobPage() {
  const slug = 'home-services-on-a-job'
  const pageUrl = 'https://goproxe.com/blog/home-services-on-a-job'
  const pageTitle = 'They called while you were on a job. The crew that answered got the work.'

  const tocItems = [
    { id: 'what-crews-actually-run', text: 'What crews actually run' },
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
              <p>The AC died at 2pm. They WhatsApped. You were on a roof. You replied at 7. They already booked the crew that asked address and slot at 2:04.</p>
              <p>Night is the same leak. 10pm. You see it at 8am. Gone.</p>
              <p>You did not lose the job to a bigger brand. You lost it because the chat sat while you worked.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-crews-actually-run">What crews actually run</h2>
              <p>Personal phone. JustDial, the site, Instagram, the missed call. Four inboxes. No memory. Quote sent, never followed.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer on the channel they used. Same person. One memory.</p>
              <p>Qualify: address, job type, when. Offer two slots. Book tomorrow&apos;s first if it is night. Do not invent a quote.</p>
              <p>You finish the current job. The next one is already on the calendar.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Home-service crews that already get inbound and still answer when they park. Parking is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/home-services">home services</a>. Same leak for <a href="/industries/wellness">wellness</a> and <a href="/industries/clinics">clinics</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does it replace the technician?</strong></p>
              <p>No. It does the reply while you are on the job. You do the work.</p>
              <p><strong>Will it quote a price?</strong></p>
              <p>No. It books the visit and hands you the thread.</p>
              <p><strong>Do I need someone in the office at night?</strong></p>
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
