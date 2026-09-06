import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Follow-up is a system',
  description:
    'The first reply is not the job. Most teams treat it like it is.',
  alternates: {
    canonical: 'https://goproxe.com/blog/follow-up-is-a-system',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/follow-up-is-a-system.png'],
  },
}

const articleContent = `The first reply is not the job. Most teams treat it like it is. They answered. They sent the quote. Someone said they will think about it. Then the thread sat. A week later the business that wrote again got the work. That is not a manners problem. That is no system for the week after first contact.

Inbound has two clocks. The first clock is speed. Did anyone write back on the channel they used. The second clock is the quiet. They went silent. They said maybe. They took a number and disappeared. Somebody still has to keep the conversation alive until yes or no. If you only own the first clock, you will look responsive and still lose the lead.

A note in someone's head. I will ping them Friday. Friday the counsellor is in a session. The note dies. A CRM task. Status: Follow-up. Nobody opens WhatsApp. The task is not a message. One just checking in on day three, then nothing. That is a poke. It is not a system. A broadcast on day seven. Same text to fifty people. The person who already said maybe gets a blast. The person who said no gets it too. Hope. The inbox stays bold.

It knows the state. New. Replied. Quoted. Maybe. Silent. Booked. No. It writes on the channel they already used. It does not drag them onto email because the sequence lives there. It asks a real next question. Still looking this week. Two slots. Who else decides. It does not invent a fee. It does not guilt them for going quiet. It stops at yes, no, or they asked you to stop. Silence is not a no. A no is a no. It remembers this is the same person who DMed on Instagram, filled a form, then went quiet on WhatsApp. One memory. One thread in its head. That is the desk, after the first reply.

Clinics, coaching desks, brokers, studios, crews, firms. Anyone who can answer once and then loses the week. If your follow-up lives in a person's memory, you do not have follow-up. You have a good day.

PROXe is the desk for both clocks. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Until they decide. One memory. It does not invent a quote. It does not replace the closer. It keeps writing so the closer walks into a decision, not a cold list.

On the same channel. Until yes or no. A real next question, not just checking in. Until they say no, or they ask you to stop. A quiet week is unfinished work. No. It stops at a decision. It does not blast a list. No. It books the slot and hands you the thread. 48 hours.

The first reply is the start. The system is what happens after. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How should follow-up work after first contact?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On the same channel. Until yes or no. A real next question, not "just checking in."',
      },
    },
    {
      '@type': 'Question',
      name: 'When is silence not a no?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Until they say no, or they ask you to stop. A quiet week is unfinished work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it spam them?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It stops at a decision. It does not blast a list.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the slot and hands you the thread.',
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

export default function FollowUpIsASystemPage() {
  const slug = 'follow-up-is-a-system'
  const pageUrl = 'https://goproxe.com/blog/follow-up-is-a-system'
  const pageTitle = 'Follow-up is a system'

  const tocItems = [
    { id: 'the-job-after-the-reply', text: 'The job after the reply' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'what-a-system-actually-does', text: 'What a system actually does' },
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
              <p>The first reply is not the job. Most teams treat it like it is.</p>
              <p>They answered. They sent the quote. Someone said they will think about it. Then the thread sat. A week later the business that wrote again got the work.</p>
              <p>That is not a manners problem. That is no system for the week after first contact.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-job-after-the-reply">The job after the reply</h2>
              <p>Inbound has two clocks.</p>
              <p>The first clock is speed. Did anyone write back on the channel they used. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a>.</p>
              <p>The second clock is the quiet. They went silent. They said maybe. They took a number and disappeared. Somebody still has to keep the conversation alive until yes or no.</p>
              <p>If you only own the first clock, you will look responsive and still lose the lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A note in someone's head. "I will ping them Friday." Friday the counsellor is in a session. The note dies.</p>
              <p>A CRM task. Status: Follow-up. Nobody opens WhatsApp. The task is not a message. <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>.</p>
              <p>One "just checking in" on day three, then nothing. That is a poke. It is not a system.</p>
              <p>A broadcast on day seven. Same text to fifty people. The person who already said maybe gets a blast. The person who said no gets it too.</p>
              <p>Hope. The inbox stays bold. <a href="/blog/people-miss-conversations">People miss conversations. Then they lose the lead.</a></p>
            </section>

            <section className={styles.section}>
              <h2 id="what-a-system-actually-does">What a system actually does</h2>
              <p>It knows the state. New. Replied. Quoted. Maybe. Silent. Booked. No.</p>
              <p>It writes on the channel they already used. It does not drag them onto email because the sequence lives there.</p>
              <p>It asks a real next question. Still looking this week. Two slots. Who else decides. It does not invent a fee. It does not guilt them for going quiet.</p>
              <p>It stops at yes, no, or they asked you to stop. Silence is not a no. A no is a no.</p>
              <p>It remembers this is the same person who DMed on Instagram, filled a form, then went quiet on WhatsApp. One memory. One thread in its head.</p>
              <p>That is the desk, after the first reply. <a href="/blog/who-answers-the-customer">Who answers the customer</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaching desks, brokers, studios, crews, firms. Anyone who can answer once and then loses the week.</p>
              <p>If your follow-up lives in a person's memory, you do not have follow-up. You have a good day.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk for both clocks.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Until they decide. One memory. It does not invent a quote. It does not replace the closer. It keeps writing so the closer walks into a decision, not a cold list.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How should follow-up work after first contact?</strong></p>
              <p>On the same channel. Until yes or no. A real next question, not "just checking in."</p>
              <p><strong>When is silence not a no?</strong></p>
              <p>Until they say no, or they ask you to stop. A quiet week is unfinished work.</p>
              <p><strong>Will it spam them?</strong></p>
              <p>No. It stops at a decision. It does not blast a list.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the slot and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The first reply is the start. The system is what happens after. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
