import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'They wanted 7pm. You replied at 10am. The other studio got the booking. | PROXe',
  description:
    'Spa, gym, yoga inbound dies after hours. Answer, qualify, book the slot. Do not wait until the next class.',
  alternates: {
    canonical: 'https://goproxe.com/blog/wellness-after-hours',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/wellness-after-hours.png'],
  },
}

const articleContent = `They wrote at 8:40pm. Trial tomorrow. First class. Reception left at 8. Greeting said closed. Morning you called. They had already booked the studio that offered 7pm or 8pm at 8:41. The leak is not membership software. The leak is the after-7pm WhatsApp that sat.

What wellness desks run. A personal phone at the desk. A greeting. A brochure of packages. Instagram DMs on someone else's phone. Gym, spa, yoga: same pattern. They want a slot tonight or first thing. We will call you tomorrow is how they pick the other place.

What to do instead. Answer on WhatsApp, Instagram, the site, the missed call. Same person. One memory. Qualify: trial or member, which service, when. Offer two slots. Book it. Do not invent a package price. Morning you walk into a booked trial, not a pile of last night's greets.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it replace the trainer or therapist?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It does the 9pm reply. You do the session.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it quote a package?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the visit and hands you the thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need night staff?',
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

export default function WellnessAfterHoursPage() {
  const slug = 'wellness-after-hours'
  const pageUrl = 'https://goproxe.com/blog/wellness-after-hours'
  const pageTitle = 'They wanted 7pm. You replied at 10am. The other studio got the booking.'

  const tocItems = [
    { id: 'what-wellness-desks-run', text: 'What wellness desks run' },
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
              <p>They wrote at 8:40pm. Trial tomorrow. First class.</p>
              <p>Reception left at 8. Greeting said closed. Morning you called. They had already booked the studio that offered 7pm or 8pm at 8:41.</p>
              <p>The leak is not membership software. The leak is the after-7pm WhatsApp that sat.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-wellness-desks-run">What wellness desks run</h2>
              <p>A personal phone at the desk. A greeting. A brochure of packages. Instagram DMs on someone else&apos;s phone.</p>
              <p>Gym, spa, yoga: same pattern. They want a slot tonight or first thing. "We will call you tomorrow" is how they pick the other place.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead">What to do instead</h2>
              <p>Answer on WhatsApp, Instagram, the site, the missed call. Same person. One memory.</p>
              <p>Qualify: trial or member, which service, when. Offer two slots. Book it. Do not invent a package price.</p>
              <p>Morning you walk into a booked trial, not a pile of last night&apos;s greets.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Studios that already get inbound after 7pm and still treat it as tomorrow&apos;s work. Tomorrow is too late.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/wellness">wellness</a>. Same leak for <a href="/industries/clinics">clinics</a> and <a href="/industries/home-services">home services</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>. <a href="/blog/what-is-proxe">What PROXe is</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Does it replace the trainer or therapist?</strong></p>
              <p>No. It does the 9pm reply. You do the session.</p>
              <p><strong>Will it quote a package?</strong></p>
              <p>No. It books the visit and hands you the thread.</p>
              <p><strong>Do I need night staff?</strong></p>
              <p>No. The desk keeps working. You do not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>After hours they still want a slot. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>
    </BlogPostWrapper>
  )
}
