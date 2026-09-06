import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Your CRM will not answer that WhatsApp',
  description:
    'A CRM stores the lead. It does not answer, qualify, book, or follow up. That is why the chat still sits.',
  alternates: {
    canonical: 'https://goproxe.com/blog/crm-wont-answer',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/crm-wont-answer.png'],
  },
}

const articleContent = `They messaged at 9:12pm. Your CRM made a row. Name, number, source. Status: New. Nobody answered. At 9:18 they booked the clinic that wrote back. The row is still New in the morning. That is not a CRM bug. That is what a CRM is.

What people actually do. Most Indian clinics, coaching desks, and brokers run some mix of three things. A personal phone. The counsellor's WhatsApp. When they leave, the thread leaves with them. A shared inbox. Everyone sees everything. Nobody owns the 11pm message. A CRM. LeadSquared, Zoho, whatever. WhatsApp is a connector. A webhook. A template when the stage changes. The conversation still waits for a person to type.

What a CRM is for. A CRM is a record. Pipeline. Who owns the lead. What stage. What you last logged. Reports for the owner. That work is real. It is not the first 30 seconds. It is not the 9pm WhatsApp.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is PROXe a CRM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. PROXe answers, qualifies, books, and follows up. Your CRM can still hold the file.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I keep LeadSquared or Zoho?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The leak is the unanswered chat, not the missing board.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why not just a WhatsApp chatbot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A bot dumps FAQs. It does not book, follow up, or remember the call.',
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

export default function CrmWontAnswerPage() {
  const slug = 'crm-wont-answer'
  const pageUrl = 'https://goproxe.com/blog/crm-wont-answer'
  const pageTitle = 'Your CRM will not answer that WhatsApp'

  const tocItems = [
    { id: 'what-people-actually-do', text: 'What people actually do' },
    { id: 'what-a-crm-is-for', text: 'What a CRM is for' },
    { id: 'what-it-will-not-do', text: 'What it will not do' },
    { id: 'how-you-should-manage-a-lead', text: 'How you should manage a lead' },
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
              <p>They messaged at 9:12pm. Your CRM made a row. Name, number, source. Status: New.</p>
              <p>Nobody answered. At 9:18 they booked the clinic that wrote back.</p>
              <p>The row is still New in the morning. That is not a CRM bug. That is what a CRM is.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-actually-do">What people actually do</h2>
              <p>Most Indian clinics, coaching desks, and brokers run some mix of three things.</p>
              <p>A personal phone. The counsellor's WhatsApp. When they leave, the thread leaves with them.</p>
              <p>A shared inbox. Everyone sees everything. Nobody owns the 11pm message.</p>
              <p>A CRM. LeadSquared, Zoho, whatever. WhatsApp is a connector. A webhook. A template when the stage changes. The conversation still waits for a person to type.</p>
              <p>You are not failing at software. You bought a filing cabinet for a conversation.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-a-crm-is-for">What a CRM is for</h2>
              <p>A CRM is a record. Pipeline. Who owns the lead. What stage. What you last logged. Reports for the owner.</p>
              <p>That work is real. It is not the first 30 seconds. It is not the 9pm WhatsApp. It is not the Instagram comment that became a site form that became a missed call.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-will-not-do">What it will not do</h2>
              <p>It will not answer in seconds when the counsellor is in a consult.</p>
              <p>It will not ask the two questions that qualify the job, then offer two slots.</p>
              <p>It will not book the calendar.</p>
              <p>It will not follow up until they decide. It will sit on New until someone remembers.</p>
              <p>It will not remember that this is the same person who DMed on Instagram yesterday and called at lunch.</p>
              <p>LeadSquared and the rest bolt WhatsApp on as a channel. You still need a BSP, templates, a human in the 24-hour window. The CRM logs the chat. It does not run it.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-should-manage-a-lead">How you should manage a lead</h2>
              <p>Treat the inbound as a conversation, not a row.</p>
              <p>Answer on the channel they used. WhatsApp, Instagram, the site, the call. Same person. One memory.</p>
              <p>Qualify in the thread. Book a slot. Follow up until yes or no. Log the outcome after, if you still want a CRM.</p>
              <p>The record comes after the reply. Not instead of it.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Businesses that already get inbound and already have a board. Excel, Zoho, LeadSquared. The board is not the leak. The unanswered chat is.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/people-miss-conversations">Why people miss conversations</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is PROXe a CRM?</strong></p>
              <p>No. PROXe answers, qualifies, books, and follows up. Your CRM can still hold the file.</p>
              <p><strong>Can I keep LeadSquared or Zoho?</strong></p>
              <p>Yes. The leak is the unanswered chat, not the missing board.</p>
              <p><strong>Why not just a WhatsApp chatbot?</strong></p>
              <p>A bot dumps FAQs. It does not book, follow up, or remember the call.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The CRM is the file. This page is the desk. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>
    </BlogPostWrapper>
  )
}
