import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Email is not the desk | PROXe',
  description:
    'The enquiry is the thread they already opened.',
  alternates: {
    canonical: 'https://goproxe.com/blog/email-is-not-the-desk',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/email-is-not-the-desk.png'],
  },
}

const articleContent = `They emailed. You will reply tonight. They already wrote on WhatsApp at 2. The desk is that thread, not your inbox at 6.

A new email is not a new lead. It is the same person, on a slower channel.

The desk is the thread they opened. Email is a copy you send later, or not at all.

The desk answers where they wrote, in minutes. Email is a record, a receipt, a follow-up you chose. It is not the place the booking happens. If you wait for inbox zero, Thursday is gone. If you answer the WhatsApp, Thursday is a slot.

Auto-reply: thanks, we will email you. Then nothing in the thread. Forward the WhatsApp into Gmail and work it there, six hours late. A CRM note emailed brochure with no slot. Opening a new email when they are still on chat.

You can point at the WhatsApp (or IG, or the site chat) where they picked a time. That message is the booking. If the only line is an unread email, you have a queue. You do not have a desk.

Clinics, coaches, home services, anyone who still treats Gmail as the office while the lead is waiting on WhatsApp. If your speed-to-lead is your inbox, this page is the map.

PROXe is the desk on the thread they opened. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. WhatsApp, IG, site, call. Same memory. Email does not become the queue. It does not invent a fee. It does not replace the clinic. Talk to PROXe at goproxe.com.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you ignore email?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. You can send a copy. You book in the thread they opened.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if they only emailed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Answer there, then move the booking into a channel they will actually see. Two times.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe run email?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Book on the thread they opened.',
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

export default function EmailIsNotTheDeskPage() {
  const slug = 'email-is-not-the-desk'
  const pageUrl = 'https://goproxe.com/blog/email-is-not-the-desk'
  const pageTitle = 'Email is not the desk'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-the-desk-did-the-job', text: 'How you know the desk did the job' },
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
              <p>They emailed. You will reply tonight. They already wrote on WhatsApp at 2. The desk is that thread, not your inbox at 6.</p>
              <p>A new email is not a new lead. It is the same person, on a slower channel.</p>
              <p>The desk is the thread they opened. Email is a copy you send later, or not at all.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The desk answers where they wrote, in minutes. <a href="/blog/who-answers-the-customer">Who answers the customer</a>. <a href="/blog/one-memory-every-channel">One memory, every channel</a></p>
              <p>Email is a record, a receipt, a follow-up you chose. It is not the place the booking happens.</p>
              <p>If you wait for inbox zero, Thursday is gone. If you answer the WhatsApp, Thursday is a slot. <a href="/blog/conversation-that-books">A conversation that books</a></p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Auto-reply: thanks, we will email you. Then nothing in the thread.</p>
              <p>Forward the WhatsApp into Gmail and work it there, six hours late. <a href="/blog/how-fast-to-reply-whatsapp">How fast to reply on WhatsApp</a></p>
              <p>A CRM note emailed brochure with no slot. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
              <p>Opening a new email when they are still on chat.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-the-desk-did-the-job">How you know the desk did the job</h2>
              <p>You can point at the WhatsApp (or IG, or the site chat) where they picked a time. That message is the booking.</p>
              <p>If the only line is an unread email, you have a queue. You do not have a desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone who still treats Gmail as the office while the lead is waiting on WhatsApp.</p>
              <p>If your speed-to-lead is your inbox, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk on the thread they opened.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. WhatsApp, IG, site, call. Same memory. Email does not become the queue. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Do you ignore email?</strong></p>
              <p>No. You can send a copy. You book in the thread they opened.</p>
              <p><strong>What if they only emailed?</strong></p>
              <p>Answer there, then move the booking into a channel they will actually see. Two times. <a href="/blog/qualify-before-you-book">Qualify before you book</a></p>
              <p><strong>Does PROXe run email?</strong></p>
              <p>No. Book on the thread they opened.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Email is not the desk. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
