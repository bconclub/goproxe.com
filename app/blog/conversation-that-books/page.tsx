import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'A conversation that books',
  description:
    'A reply is not a booking. Most first messages are a thanks, a brochure, or a link.',
  alternates: {
    canonical: 'https://goproxe.com/blog/conversation-that-books',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/conversation-that-books.png'],
  },
}

const articleContent = `A reply is not a booking. Most first messages are a thanks, a brochure, or a link. None of those put a time on the calendar.

The lead asked a real question. You sent Calendly. They closed the chat. You sent the fee sheet. They went quiet. You said we will call you. Nobody called.

The job is not to answer. The job is to leave the thread with a slot.

Three things.

An answer on the channel they used. WhatsApp stays on WhatsApp. The Instagram DM stays in the DM. Do not drag them onto a form because your process lives there.

Two questions that qualify. What do they need. When. Who decides. Not a twenty-field intake. Two.

Two slots in the thread. Thursday 4pm or Friday 11am. They pick. You book there.

That is a conversation that finishes. How fast should you reply to a WhatsApp lead is the clock. This is the content of the message.

Thanks, we will get back to you. That is a receipt.

A PDF. That is a brochure in a chat.

A Calendly, a Google calendar, a Zoho Bookings link. A link is extra work. Most people do not tap it. The thread dies on the tap they did not make.

A chatbot menu. Press 1 for fees. PROXe is not a WhatsApp chatbot. A menu is not two slots.

An away message. A sign on the door is not a booking.

There is a day and a time in the thread. Not the agreed date. Not a placeholder. A slot they chose.

If you cannot point at the message where they picked Thursday, you did not book. You hoped.

The record can wait until after the slot exists. Who answers the customer. The CRM row is not the appointment.

Clinics, coaching desks, studios, brokers, crews, firms. Anyone whose inbound is when can I come and whose reply is a link.

If the calendar only moves when you are free to paste a URL, you do not have booking. You have a website in a chat.

PROXe runs that conversation.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two questions. Two slots. In the thread. One memory if they came from Instagram yesterday and WhatsApp tonight.

It does not invent a fee. It does not dump a booking page and call it done. It puts Thursday 4pm in the chat and keeps writing until they decide. Follow-up is a system.

What is PROXe?

Talk to PROXe at goproxe.com.

An answer. Two questions. Two slots. On the channel they used.

You offer two times. They pick one. You confirm the day and the time in the same thread.

A link is another job. Most leads will not do a second job. The slot belongs in the chat.

No. It books the visit or the call and hands you the thread.

48 hours.

The first message is the booking, or it is a delay. Talk to PROXe on the site.

Related in-body relative: Who answers the customer. Follow-up is a system. How fast should you reply to a WhatsApp lead.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should the first WhatsApp reply contain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An answer. Two questions. Two slots. On the channel they used.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you book a slot in the chat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You offer two times. They pick one. You confirm the day and the time in the same thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why not just send Calendly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A link is another job. Most leads will not do a second job. The slot belongs in the chat.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the visit or the call and hands you the thread.',
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

export default function ConversationThatBooksPage() {
  const slug = 'conversation-that-books'
  const pageUrl = 'https://goproxe.com/blog/conversation-that-books'
  const pageTitle = 'A conversation that books'

  const tocItems = [
    { id: 'what-the-first-useful-reply-contains', text: 'What the first useful reply contains' },
    { id: 'what-people-send-instead', text: 'What people send instead' },
    { id: 'how-you-know-it-booked', text: 'How you know it booked' },
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
              <p>A reply is not a booking. Most first messages are a thanks, a brochure, or a link. None of those put a time on the calendar.</p>
              <p>The lead asked a real question. You sent Calendly. They closed the chat. You sent the fee sheet. They went quiet. You said we will call you. Nobody called.</p>
              <p>The job is not to answer. The job is to leave the thread with a slot.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-the-first-useful-reply-contains">What the first useful reply contains</h2>
              <p>Three things.</p>
              <p>An answer on the channel they used. WhatsApp stays on WhatsApp. The Instagram DM stays in the DM. Do not drag them onto a form because your process lives there.</p>
              <p>Two questions that qualify. What do they need. When. Who decides. Not a twenty-field intake. Two.</p>
              <p>Two slots in the thread. Thursday 4pm or Friday 11am. They pick. You book there.</p>
              <p>That is a conversation that finishes. <a href="/blog/how-fast-to-reply-whatsapp">How fast should you reply to a WhatsApp lead</a> is the clock. This is the content of the message.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-send-instead">What people send instead</h2>
              <p>Thanks, we will get back to you. That is a receipt.</p>
              <p>A PDF. That is a brochure in a chat.</p>
              <p>A Calendly, a Google calendar, a Zoho Bookings link. A link is extra work. Most people do not tap it. The thread dies on the tap they did not make.</p>
              <p>A chatbot menu. Press 1 for fees. <a href="/blog/not-a-whatsapp-bot">PROXe is not a WhatsApp chatbot</a>. A menu is not two slots.</p>
              <p>An away message. A sign on the door is not a booking.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-booked">How you know it booked</h2>
              <p>There is a day and a time in the thread. Not "the agreed date." Not a placeholder. A slot they chose.</p>
              <p>If you cannot point at the message where they picked Thursday, you did not book. You hoped.</p>
              <p>The record can wait until after the slot exists. <a href="/blog/who-answers-the-customer">Who answers the customer</a>. The CRM row is not the appointment.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaching desks, studios, brokers, crews, firms. Anyone whose inbound is "when can I come" and whose reply is a link.</p>
              <p>If the calendar only moves when you are free to paste a URL, you do not have booking. You have a website in a chat.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe runs that conversation.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two questions. Two slots. In the thread. One memory if they came from Instagram yesterday and WhatsApp tonight.</p>
              <p>It does not invent a fee. It does not dump a booking page and call it done. It puts Thursday 4pm in the chat and keeps writing until they decide. <a href="/blog/follow-up-is-a-system">Follow-up is a system</a>.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="https://goproxe.com">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>What should the first WhatsApp reply contain?</strong></p>
              <p>An answer. Two questions. Two slots. On the channel they used.</p>
              <p><strong>How do you book a slot in the chat?</strong></p>
              <p>You offer two times. They pick one. You confirm the day and the time in the same thread.</p>
              <p><strong>Why not just send Calendly?</strong></p>
              <p>A link is another job. Most leads will not do a second job. The slot belongs in the chat.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the visit or the call and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The first message is the booking, or it is a delay. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
