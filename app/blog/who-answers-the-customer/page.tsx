import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Who answers the customer | PROXe',
  description:
    'Most teams can show you the lead. Fewer can say who is supposed to talk to them.',
  alternates: {
    canonical: 'https://goproxe.com/blog/who-answers-the-customer',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/who-answers-the-customer.png'],
  },
}

const articleContent = `Most teams can show you the lead. Fewer can say who is supposed to talk to them.

The lead is in the CRM. The chat is in WhatsApp. The Instagram DM is on someone else's phone. The site widget said "we will get back to you." Nobody booked a slot.

That is not one problem. It is three jobs, bought as if they were the same product.

The record. A CRM stores the person. Name, number, source, stage, owner. Pipeline. Reports. That work is real. It does not speak. It will not ask who decides. It will not offer Thursday 4pm.

The inbox. WhatsApp, Instagram, the website, the missed call. A place the message lands so a human can see it. Shared inbox, Business app, a connector into Zoho. Seeing a chat is not answering it. An unread thread is still an unread thread if ten people can open it.

The desk. Someone has to do the customer side of the business on that thread. Answer on the channel they used. Qualify. Offer two slots. Book. Follow up until they decide. Remember that yesterday's Instagram DM is the same person as tonight's WhatsApp.

If the desk has no owner, the record stays New and the inbox stays bold.

An away message. That is a sign on the door. It is not a reply.

A chatbot. That is a menu. It dumps a brochure. It cannot book Tuesday. It forgets they called in the morning.

A CRM with WhatsApp bolted on. That is a filing cabinet with a pipe. The connector logs the chat. A person still has to type.

A broadcast tool. That is a megaphone. It is not a conversation.

None of those are wrong. They are the wrong job for the first thirty seconds of inbound.

You know the lead's name and nobody wrote back. You are missing the desk.

You answered, then the week went quiet, and nobody wrote again. You have a desk for the first reply and nothing for follow-up. That is a later post. Same job family.

Two people replied with two different slots. You have an inbox. You do not have one memory.

Staff leave and the chats leave with the phone. You never owned the desk. You rented a person's pocket.

If your answer to "who talks to them at 9pm" is "whoever is free," you do not have a desk. You have hope.

Answer on the channel they used. Do not drag a WhatsApp lead onto a form. Do not dump a booking link and call it a reply.

Ask the two questions that matter. What do they need. When. Who decides.

Put two slots in the thread. Book there.

Keep writing until yes or no. Silence is not a decision.

One person, every channel. They should not repeat themselves.

That is the customer side. The record can wait until after the slot exists.

Clinics, coaching desks, brokers, studios, home crews, firms. Anyone who already gets inbound and already bought software.

If you have a board and an inbox and you still cannot point at who books the slot when the owner is busy, this page is the map.

PROXe is the desk.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. One memory. The CRM can still hold the file. The inbox can still exist. The conversation does not wait for someone to be free.

It does not invent a fee. It does not replace the counsellor, the doctor, or the closer. It does the 9pm reply so they walk into a booked slot, not a cold list.

Talk to PROXe at goproxe.com.

No. A CRM is the record. PROXe runs the conversation. Keep the board if you want the file.

No. The inbox is the pipe. PROXe is who talks through it.

No. A bot parks. This finishes. Answer, qualify, two slots, follow-up, one memory.

No. The desk answers on the channel they used. Dials stay with you.

48 hours.

Name the job. Then buy the thing that does it. The record is not the desk. The inbox is not the desk. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this a CRM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A CRM is the record. PROXe runs the conversation. Keep the board if you want the file.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this an inbox?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The inbox is the pipe. PROXe is who talks through it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a chatbot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A bot parks. This finishes. Answer, qualify, two slots, follow-up, one memory.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need someone on the phone at 9pm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The desk answers on the channel they used. Dials stay with you.',
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

export default function WhoAnswersTheCustomerPage() {
  const slug = 'who-answers-the-customer'
  const pageUrl = 'https://goproxe.com/blog/who-answers-the-customer'
  const pageTitle = 'Who answers the customer'

  const tocItems = [
    { id: 'three-jobs', text: 'Three jobs' },
    { id: 'what-people-buy-instead', text: 'What people buy instead' },
    { id: 'how-to-tell-which-job-you-are-missing', text: 'How to tell which job you are missing' },
    { id: 'what-the-desk-actually-does', text: 'What the desk actually does' },
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
              <p>Most teams can show you the lead. Fewer can say who is supposed to talk to them.</p>
              <p>The lead is in the CRM. The chat is in WhatsApp. The Instagram DM is on someone else's phone. The site widget said "we will get back to you." Nobody booked a slot.</p>
              <p>That is not one problem. It is three jobs, bought as if they were the same product.</p>
            </section>

            <section className={styles.section}>
              <h2 id="three-jobs">Three jobs</h2>
              <p><strong>The record.</strong> A CRM stores the person. Name, number, source, stage, owner. Pipeline. Reports. That work is real. It does not speak. It will not ask who decides. It will not offer Thursday 4pm.</p>
              <p><strong>The inbox.</strong> WhatsApp, Instagram, the website, the missed call. A place the message lands so a human can see it. Shared inbox, Business app, a connector into Zoho. Seeing a chat is not answering it. An unread thread is still an unread thread if ten people can open it.</p>
              <p><strong>The desk.</strong> Someone has to do the customer side of the business on that thread. Answer on the channel they used. Qualify. Offer two slots. Book. Follow up until they decide. Remember that yesterday's Instagram DM is the same person as tonight's WhatsApp.</p>
              <p>If the desk has no owner, the record stays New and the inbox stays bold.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-buy-instead">What people buy instead</h2>
              <p>An away message. That is a sign on the door. It is not a reply.</p>
              <p>A chatbot. That is a menu. It dumps a brochure. It cannot book Tuesday. It forgets they called in the morning. <a href="/blog/not-a-whatsapp-bot">PROXe is not a WhatsApp chatbot</a>.</p>
              <p>A CRM with WhatsApp bolted on. That is a filing cabinet with a pipe. <a href="/blog/crm-wont-answer">Your CRM will not answer that WhatsApp</a>. The connector logs the chat. A person still has to type.</p>
              <p>A broadcast tool. That is a megaphone. It is not a conversation.</p>
              <p>None of those are wrong. They are the wrong job for the first thirty seconds of inbound.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-to-tell-which-job-you-are-missing">How to tell which job you are missing</h2>
              <p>You know the lead's name and nobody wrote back. You are missing the desk.</p>
              <p>You answered, then the week went quiet, and nobody wrote again. You have a desk for the first reply and nothing for follow-up. That is a later post. Same job family.</p>
              <p>Two people replied with two different slots. You have an inbox. You do not have one memory.</p>
              <p>Staff leave and the chats leave with the phone. You never owned the desk. You rented a person's pocket.</p>
              <p>If your answer to "who talks to them at 9pm" is "whoever is free," you do not have a desk. You have hope.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-the-desk-actually-does">What the desk actually does</h2>
              <p>Answer on the channel they used. Do not drag a WhatsApp lead onto a form. Do not dump a booking link and call it a reply.</p>
              <p>Ask the two questions that matter. What do they need. When. Who decides.</p>
              <p>Put two slots in the thread. Book there.</p>
              <p>Keep writing until yes or no. Silence is not a decision.</p>
              <p>One person, every channel. They should not repeat themselves.</p>
              <p>That is the customer side. The record can wait until after the slot exists.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaching desks, brokers, studios, home crews, firms. Anyone who already gets inbound and already bought software.</p>
              <p>If you have a board and an inbox and you still cannot point at who books the slot when the owner is busy, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. One memory. The CRM can still hold the file. The inbox can still exist. The conversation does not wait for someone to be free.</p>
              <p>It does not invent a fee. It does not replace the counsellor, the doctor, or the closer. It does the 9pm reply so they walk into a booked slot, not a cold list.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is this a CRM?</strong></p>
              <p>No. A CRM is the record. PROXe runs the conversation. Keep the board if you want the file.</p>
              <p><strong>Is this an inbox?</strong></p>
              <p>No. The inbox is the pipe. PROXe is who talks through it.</p>
              <p><strong>Is this a chatbot?</strong></p>
              <p>No. A bot parks. This finishes. Answer, qualify, two slots, follow-up, one memory.</p>
              <p><strong>Do I need someone on the phone at 9pm?</strong></p>
              <p>No. The desk answers on the channel they used. Dials stay with you.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Name the job. Then buy the thing that does it. The record is not the desk. The inbox is not the desk. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
