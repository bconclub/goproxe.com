import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'PROXe is not a WhatsApp chatbot | PROXe',
  description:
    'A chatbot dumps FAQs on one channel. PROXe answers, qualifies, books and follows up, on every channel, with one memory.',
  alternates: {
    canonical: 'https://goproxe.com/blog/not-a-whatsapp-bot',
  },
  openGraph: {
    images: ['https://goproxe.com/home/Leads.webp'],
  },
}

const articleContent = `You already tried a chatbot. It said hello. It sent the brochure. It could not book Tuesday 4pm. It forgot they called in the morning. That is a bot. PROXe is not that.

A WhatsApp chatbot lives on one number. It answers from a tree or a prompt. When they switch to Instagram or the site, the bot has no idea who they are. When they go silent, it stops. When they ask for a price you have not set, it invents one or dies.

PROXe runs the customer side. WhatsApp, Instagram, the website, the call. Same person. Same thread in its head. It asks the qualifying questions, offers two slots, books the calendar, and keeps writing until they decide. It does not invent a quote. It does not replace your counsellor.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it a WhatsApp Business API tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'API is the pipe. PROXe is the person on the other end of the pipe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it dump templates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It talks in the thread. Follow-up is until yes or no, not a blast.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the call or the visit and hands you the thread.',
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

export default function NotAWhatsAppBotPage() {
  const slug = 'not-a-whatsapp-bot'
  const pageUrl = 'https://goproxe.com/blog/not-a-whatsapp-bot'
  const pageTitle = 'PROXe is not a WhatsApp chatbot'

  const tocItems = [
    { id: 'what-it-is-not', text: 'What it is not' },
    { id: 'what-it-actually-does', text: 'What it actually does' },
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
              <p>You already tried a chatbot. It said hello. It sent the brochure. It could not book Tuesday 4pm. It forgot they called in the morning.</p>
              <p>That is a bot. PROXe is not that.</p>
            </section>

            <section className={styles.section}>
              <p>A WhatsApp chatbot lives on one number. It answers from a tree or a prompt. When they switch to Instagram or the site, the bot has no idea who they are. When they go silent, it stops. When they ask for a price you have not set, it invents one or dies.</p>
              <p>PROXe runs the customer side. WhatsApp, Instagram, the website, the call. Same person. Same thread in its head. It asks the qualifying questions, offers two slots, books the calendar, and keeps writing until they decide.</p>
              <p>It does not invent a quote. It does not replace your counsellor. It does the 9pm reply so the counsellor walks into a booked slot, not a cold list.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-is-not">What it is not</h2>
              <p>It is not a menu. It is not an away message. It is not a broadcast tool. It is not a CRM with a chatbot bolted on.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-actually-does">What it actually does</h2>
              <p>Answers in seconds. Qualifies in the thread. Books the slot. Follows up until yes or no. Remembers every channel as one person. Live in 48 hours.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Businesses that already get inbound on WhatsApp and still lose the lead. The bot said thanks. Nobody booked.</p>
            </section>

            <section className={styles.section}>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching</a>, <a href="/industries/realestate">real estate</a>, <a href="/industries/wellness">wellness</a>, <a href="/industries/professional-services">professional services</a>, <a href="/industries/home-services">home services</a>.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. <a href="/blog/what-is-proxe">What PROXe is</a>. <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp is how you lose the lead</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is it a WhatsApp Business API tool?</strong></p>
              <p>API is the pipe. PROXe is the person on the other end of the pipe.</p>
              <p><strong>Will it dump templates?</strong></p>
              <p>No. It talks in the thread. Follow-up is until yes or no, not a blast.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the call or the visit and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A chatbot parks. This finishes. Talk to PROXe on <a href="/">the site</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
