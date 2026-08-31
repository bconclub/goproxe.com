import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'One lead, four channels, one memory | PROXe',
  description:
    'WhatsApp Monday. Instagram Thursday. Site Saturday. Call later. Same person. They should never repeat themselves.',
  alternates: {
    canonical: 'https://goproxe.com/blog/one-memory-every-channel',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/one-memory-every-channel.png'],
  },
}

const articleContent = `They DMed Instagram at night. WhatsApp in the morning. Form on the site at lunch. Called at 4. You asked their name four times. They hung up. That is not four leads. That is one person hitting four inboxes.

What people run. A WhatsApp bot. An Instagram reply from someone else. A site form into a CRM. A missed-call list on paper. Each tool has a slice. None of them know it is the same parent, the same patient, the same buyer. A CRM can store four rows. It still does not remember the thread.

What one memory means. WhatsApp, Instagram, the website, the call write into one conversation. They never repeat the exam, the tooth, the locality, the job type. You pick up where they left. Night, Sunday, peak hour.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it remember across WhatsApp, Instagram, and the site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Same thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a shared inbox?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A shared inbox is still one channel. This is one memory across every channel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to integrate a CRM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your CRM still owns the file. This runs the conversation.',
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

export default function OneMemoryEveryChannelPage() {
  const slug = 'one-memory-every-channel'
  const pageUrl = 'https://goproxe.com/blog/one-memory-every-channel'
  const pageTitle = 'One lead, four channels, one memory'

  const tocItems = [
    { id: 'what-people-run', text: 'What people run' },
    { id: 'what-one-memory-means', text: 'What one memory means' },
    { id: 'what-it-is-not', text: 'What it is not' },
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
              <p>They DMed Instagram at night. WhatsApp in the morning. Form on the site at lunch. Called at 4.</p>
              <p>You asked their name four times. They hung up.</p>
              <p>That is not four leads. That is one person hitting four inboxes.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run">What people run</h2>
              <p>A WhatsApp bot. An Instagram reply from someone else. A site form into a CRM. A missed-call list on paper.</p>
              <p>Each tool has a slice. None of them know it is the same parent, the same patient, the same buyer.</p>
              <p>A CRM can store four rows. It still does not remember the thread.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-one-memory-means">What one memory means</h2>
              <p>WhatsApp, Instagram, the website, the call write into one conversation.</p>
              <p>They never repeat the exam, the tooth, the locality, the job type.</p>
              <p>You pick up where they left. Night, Sunday, peak hour.</p>
              <p>This is not a shared inbox. A shared inbox is still one channel. This is one person across every channel they already use.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-is-not">What it is not</h2>
              <p>Not four chatbots glued together. Not a transcript dump into Zoho. Not "also Instagram" as a toggle.</p>
              <p>If they switch channel, the desk still knows them.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Businesses that already get inbound on more than WhatsApp and still treat each ping as new.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
            </section>

            <section className={styles.section}>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/not-a-whatsapp-bot">PROXe is not a WhatsApp chatbot</a>. <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is this a WhatsApp tool that also does Instagram?</strong></p>
              <p>No. One memory. Four channels. Same person.</p>
              <p><strong>Will they have to start over on the call?</strong></p>
              <p>No. The call is the same thread.</p>
              <p><strong>Does the CRM replace this?</strong></p>
              <p>No. The CRM files it after. See <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>One person. One memory. Every channel. Talk to PROXe on the site (<a href="/">goproxe.com</a>).</p>
            </section>
    </BlogPostWrapper>
  )
}
