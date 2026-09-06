import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'After-hours WhatsApp is how you lose the lead',
  description:
    'They wrote at 11pm. An away message is not an answer. Answer, qualify, book. Do not wait until morning.',
  alternates: {
    canonical: 'https://goproxe.com/blog/after-hours-whatsapp',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/after-hours-whatsapp.png'],
  },
}

const articleContent = `They wrote at 11pm. You sent the green tick: thanks, we are closed, we will call tomorrow. They did not want a receipt. They wanted Tuesday at 4. The clinic that stayed in the thread got Tuesday. An away message is not an answer. It is a polite way to lose.

What people run. Business hours on the WhatsApp profile. A greeting. A team will get back. Sometimes a bot that dumps timings and a PDF. That is the default. Chatbot vendors sell it. CRMs log it. The slot still goes to whoever replied.

What after-hours should do. Answer on the number they used. Ask the two questions that qualify (what, when, who). Offer two slots. Book one. Remember the thread for morning. Your counsellor walks in to a calendar, not a pile of we'll call you.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I turn off the away message?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Replace it. Closed is a fact. Unanswered is a choice.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it book while I sleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Calendar, not a callback promise.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a chatbot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A chatbot parks. This finishes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need night staff?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk has to keep working. The human does not.',
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

export default function AfterHoursWhatsAppPage() {
  const slug = 'after-hours-whatsapp'
  const pageUrl = 'https://goproxe.com/blog/after-hours-whatsapp'
  const pageTitle = 'After-hours WhatsApp is how you lose the lead'

  const tocItems = [
    { id: 'what-people-run', text: 'What people run' },
    { id: 'what-after-hours-should-do', text: 'What after-hours should do' },
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
              <p>They wrote at 11pm. You sent the green tick: thanks, we are closed, we will call tomorrow.</p>
              <p>They did not want a receipt. They wanted Tuesday at 4. The clinic that stayed in the thread got Tuesday.</p>
              <p>An away message is not an answer. It is a polite way to lose.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run">What people run</h2>
              <p>Business hours on the WhatsApp profile. A greeting. A "team will get back." Sometimes a bot that dumps timings and a PDF.</p>
              <p>That is the default. Chatbot vendors sell it. CRMs log it. The slot still goes to whoever replied.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-after-hours-should-do">What after-hours should do</h2>
              <p>Answer on the number they used.</p>
              <p>Ask the two questions that qualify (what, when, who).</p>
              <p>Offer two slots. Book one. Remember the thread for morning.</p>
              <p>Your counsellor walks in to a calendar, not a pile of "we'll call you."</p>
              <p>Clinic during consult, coaching parent at night, broker after a site visit: same leak. The human is busy. The chat is not.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Businesses that already get inbound after 7pm and treat it as tomorrow's work. Tomorrow is too late.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/people-miss-conversations">Why people miss conversations</a>. <a href="/blog/not-a-whatsapp-bot">PROXe is not a WhatsApp chatbot</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Do I turn off the away message?</strong></p>
              <p>Replace it. Closed is a fact. Unanswered is a choice.</p>
              <p><strong>Will it book while I sleep?</strong></p>
              <p>Yes. Calendar, not a callback promise.</p>
              <p><strong>Is this a chatbot?</strong></p>
              <p>No. A chatbot parks. This finishes.</p>
              <p><strong>Do I need night staff?</strong></p>
              <p>No. The desk has to keep working. The human does not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>After hours they still want a slot. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>
    </BlogPostWrapper>
  )
}
