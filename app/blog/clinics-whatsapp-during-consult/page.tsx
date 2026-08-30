import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'They WhatsApped while you were in consult. The clinic that answered got the patient. | PROXe',
  description:
    'Clinic inbound dies in the chair, at night, and on the missed call. Answer, qualify, book. Do not wait until the next gap.',
  alternates: {
    canonical: 'https://goproxe.com/blog/clinics-whatsapp-during-consult',
  },
  openGraph: {
    images: ['/blog/clinics-whatsapp-during-consult.png'],
  },
}

const articleContent = `They messaged during a filling. Reception was with the next patient. You saw it at 8pm. They already booked the clinic that wrote back at 2:14. The ad did not fail. The consult did not fail. The chat sat there.

What clinics actually run. A personal phone at the front desk. OPD software for the file. A WhatsApp greeting: clinic hours, location, we will confirm. Reminders are not the leak. No-show templates are not the leak. The new patient who wrote are you open today while you were in the chair is the leak. After hours is the same leak. Tooth at 10pm. You reply at 9am. Gone.

What to do instead. Answer in seconds on WhatsApp, the site, Instagram, the missed call. Same person. One memory. Ask the two questions: what hurts, when can they come. Offer two slots. Book the calendar. Do not diagnose in the thread. Do not invent a fee. Morning you walk into a booked visit, not a pile of we will confirm.

Who this is for. Clinics that already get inbound on WhatsApp and still answer between patients. Between patients is too late.`

export default function ClinicsWhatsAppDuringConsultPage() {
  const slug = 'clinics-whatsapp-during-consult'
  const pageUrl = 'https://goproxe.com/blog/clinics-whatsapp-during-consult'
  const pageTitle = 'They WhatsApped while you were in consult. The clinic that answered got the patient.'

  const tocItems = [
    { id: 'what-clinics-actually-run', text: 'What clinics actually run' },
    { id: 'what-to-do-instead', text: 'What to do instead' },
    { id: 'who-this-is-for', text: 'Who this is for' },
    { id: 'questions-people-ask', text: 'Questions people ask' },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Will it give medical advice?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. It books the visit and hands you the thread.',
        },
      },
      {
        '@type': 'Question',
        name: "Can it book on the doctor's calendar?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Two slots. They pick.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need night staff?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The desk keeps working. The doctor does not.',
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
              <p>They messaged during a filling. Reception was with the next patient. You saw it at 8pm. They already booked the clinic that wrote back at 2:14.</p>
              <p>The ad did not fail. The consult did not fail. The chat sat there.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-clinics-actually-run">What clinics actually run</h2>
              <p>A personal phone at the front desk. OPD software for the file. A WhatsApp greeting: clinic hours, location, "we will confirm."</p>
              <p>Reminders are not the leak. No-show templates are not the leak. The new patient who wrote "are you open today" while you were in the chair is the leak.</p>
              <p>After hours is the same leak. Tooth at 10pm. You reply at 9am. Gone.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer in seconds on WhatsApp, the site, Instagram, the missed call. Same person. One memory.</p>
              <p>Ask the two questions: what hurts, when can they come. Offer two slots. Book the calendar. Do not diagnose in the thread. Do not invent a fee.</p>
              <p>Morning you walk into a booked visit, not a pile of "we will confirm."</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics that already get inbound on WhatsApp and still answer between patients. Between patients is too late.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>. Same leak for <a href="/industries/coaching">coaching</a> and <a href="/industries/realestate">real estate</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Will it give medical advice?</strong></p>
              <p>No. It books the visit and hands you the thread.</p>
              <p><strong>Can it book on the doctor's calendar?</strong></p>
              <p>Yes. Two slots. They pick.</p>
              <p><strong>Do I need night staff?</strong></p>
              <p>No. The desk keeps working. The doctor does not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The chair is full. The inbox should not sit. Talk to PROXe on <a href="/">the site</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
