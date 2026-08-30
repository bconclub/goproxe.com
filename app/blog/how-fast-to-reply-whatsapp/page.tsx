import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'How fast should you reply to a WhatsApp lead | PROXe',
  description:
    'First useful reply gets the slot. Thanks, we will call you, is not a reply.',
  alternates: {
    canonical: 'https://goproxe.com/blog/how-fast-to-reply-whatsapp',
  },
  openGraph: {
    images: ['https://goproxe.com/home/Conversations.webp'],
  },
}

const articleContent = `They sent one line at 9:12pm. You replied at 10am. They booked at 9:14 with whoever wrote back. People ask how fast. Fast is not a green tick. Fast is a useful reply: answer, qualify, two slots.

What actually happens. The message lands while you are in a consult, a class, a site visit. An away message thanks them. A bot dumps the brochure. Morning you call. They already chose. Parents message five institutes. Patients message two clinics. Buyers tap three brokers. The first useful reply wins.

What useful means. Not hi, thanks for messaging us. Not we will call you tomorrow. Ask the one question that qualifies. Offer Tuesday or Wednesday. Book it in the thread. Seconds, not hours. Night and Sunday count.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How fast is fast enough?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Useful reply in seconds. Night and Sunday. If they are in the app, you can win.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if they message at 11pm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Answer at 11pm. Book the slot. Morning is second.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need night staff?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk needs to keep working. You do not.',
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

export default function HowFastToReplyWhatsAppPage() {
  const slug = 'how-fast-to-reply-whatsapp'
  const pageUrl = 'https://goproxe.com/blog/how-fast-to-reply-whatsapp'
  const pageTitle = 'How fast should you reply to a WhatsApp lead'

  const tocItems = [
    { id: 'what-actually-happens', text: 'What actually happens' },
    { id: 'what-useful-means', text: 'What useful means' },
    { id: 'what-not-to-do', text: 'What not to do' },
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
              <p>They sent one line at 9:12pm. You replied at 10am. They booked at 9:14 with whoever wrote back.</p>
              <p>People ask how fast. Fast is not a green tick. Fast is a useful reply: answer, qualify, two slots.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-actually-happens">What actually happens</h2>
              <p>The message lands while you are in a consult, a class, a site visit. An away message thanks them. A bot dumps the brochure. Morning you call. They already chose.</p>
              <p>Parents message five institutes. Patients message two clinics. Buyers tap three brokers. The first useful reply wins.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-useful-means">What useful means</h2>
              <p>Not "hi, thanks for messaging us." Not "we will call you tomorrow."</p>
              <p>Ask the one question that qualifies. Offer Tuesday or Wednesday. Book it in the thread.</p>
              <p>Seconds, not hours. Night and Sunday count.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-not-to-do">What not to do</h2>
              <p>Do not quote a 5-minute rule as if it were your number. Old lead-response studies are not WhatsApp India, and they are not ours. The job is still the same: first useful reply gets the work.</p>
              <p>A CRM row at 10am is not a reply. A chatbot greeting is not a reply.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Businesses that already know they lose leads when they reply late and want to know what fast actually is.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/people-miss-conversations">Why people miss conversations</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How fast is fast enough?</strong></p>
              <p>Useful reply in seconds. Night and Sunday. If they are in the app, you can win.</p>
              <p><strong>What if they message at 11pm?</strong></p>
              <p>Answer at 11pm. Book the slot. Morning is second.</p>
              <p><strong>Do I need night staff?</strong></p>
              <p>No. The desk needs to keep working. You do not.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>First useful reply wins. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>
    </BlogPostWrapper>
  )
}
