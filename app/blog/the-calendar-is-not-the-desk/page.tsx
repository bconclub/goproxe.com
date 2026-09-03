import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'The calendar is not the desk | PROXe',
  description: `A link is not a booking.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/the-calendar-is-not-the-desk',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/the-calendar-is-not-the-desk.png'],
  },
}

const articleContent = `A link is not a booking. A Calendly page is not a thread. Most teams send the URL and call it done. The work is two times in the chat they already opened.

They asked for Thursday. Someone pasted a link. They never tapped it.

The calendar is a tool. The desk is the conversation that books.

A link is not a booking. A Calendly page is not a thread. Most teams send the URL and call it done. The work is two times in the chat they already opened. They asked for Thursday. Someone pasted a link. They never tapped it. The calendar is a tool. The desk is the conversation that books. The calendar holds the slots. That is real. It is not the inbound desk. The thread is the desk. Two questions. Two times, written in the chat. They pick one. A conversation that books. The website is not the desk. Instagram engagement is not a lead. If you only send a link, you will look organised and still sit empty. A Calendly in the WhatsApp greeting. They have to leave the thread. Most do not. A bio link after a comment. Second hunt. Same miss. A "pick a time here" with no times in the message. You made them do a job. A CRM that logs the click and never sees the thread. Your CRM will not answer. There is a day and a time in the thread they already had. Not a calendar notification. Not a unique link they never opened. If you cannot point at the message where they chose Thursday, you have a link. You do not have a booking. Clinics, coaches, home services, anyone who pastes Calendly into WhatsApp and wonders why the week is empty. If your report is links sent and not Thursday 4pm, this page is the map. PROXe is the desk in the thread. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two times in the chat they already opened. It does not send them hunting. It does not invent a fee. It books Thursday and hands you the thread. What is PROXe? Talk to PROXe at goproxe.com. Because it is another job. They are already in a thread. Most will not leave it. No. Write two times. Let them pick there. Yes. The calendar holds the slots. The desk offers them in the chat. No. It books the consult and hands you the thread. 48 hours. The calendar is not the desk. Talk to PROXe on the site. Related: A conversation that books. The website is not the desk. Instagram engagement is not a lead. Do not invent the price.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Why don't people book from a calendar link?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Because it is another job. They are already in a thread. Most will not leave it.`,
      },
    },
    {
      '@type': 'Question',
      name: `Should I send Calendly on WhatsApp?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Write two times. Let them pick there.`,
      },
    },
    {
      '@type': 'Question',
      name: `Do I still need a calendar?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. The calendar holds the slots. The desk offers them in the chat.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it invent a price?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It books the consult and hands you the thread.`,
      },
    },
    {
      '@type': 'Question',
      name: `How long to go live?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `48 hours.`,
      },
    },
  ],
}

export default function TheCalendarIsNotTheDeskPage() {
  const slug = 'the-calendar-is-not-the-desk'
  const pageUrl = 'https://goproxe.com/blog/the-calendar-is-not-the-desk'
  const pageTitle = 'The calendar is not the desk'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-became-a-book', text: 'How you know it became a book' },
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
              <p>A link is not a booking. A Calendly page is not a thread. Most teams send the URL and call it done. The work is two times in the chat they already opened.</p>
              <p>They asked for Thursday. Someone pasted a link. They never tapped it.</p>
              <p>The calendar is a tool. The desk is the conversation that books.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The calendar holds the slots. That is real. It is not the inbound desk.</p>
              <p>The thread is the desk. Two questions. Two times, written in the chat. They pick one. <a href="/blog/conversation-that-books">A conversation that books</a>. <a href="/blog/the-website-is-not-the-desk">The website is not the desk</a>. <a href="/blog/instagram-engagement-is-not-a-lead">Instagram engagement is not a lead</a>.</p>
              <p>If you only send a link, you will look organised and still sit empty.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A Calendly in the WhatsApp greeting. They have to leave the thread. Most do not.</p>
              <p>A bio link after a comment. Second hunt. Same miss.</p>
              <p>A "pick a time here" with no times in the message. You made them do a job.</p>
              <p>A CRM that logs the click and never sees the thread. <a href="/blog/crm-wont-answer">Your CRM will not answer</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-became-a-book">How you know it became a book</h2>
              <p>There is a day and a time in the thread they already had. Not a calendar notification. Not a unique link they never opened.</p>
              <p>If you cannot point at the message where they chose Thursday, you have a link. You do not have a booking.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone who pastes Calendly into WhatsApp and wonders why the week is empty.</p>
              <p>If your report is links sent and not Thursday 4pm, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk in the thread.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Two times in the chat they already opened. It does not send them hunting. It does not invent a fee. It books Thursday and hands you the thread.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Why don&apos;t people book from a calendar link?</strong></p>
              <p>Because it is another job. They are already in a thread. Most will not leave it.</p>
              <p><strong>Should I send Calendly on WhatsApp?</strong></p>
              <p>No. Write two times. Let them pick there.</p>
              <p><strong>Do I still need a calendar?</strong></p>
              <p>Yes. The calendar holds the slots. The desk offers them in the chat.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The calendar is not the desk. Talk to PROXe on the site.</p>
            </section>

            <section className={styles.section}>
              <p>Related: <a href="/blog/conversation-that-books">A conversation that books</a>. <a href="/blog/the-website-is-not-the-desk">The website is not the desk</a>. <a href="/blog/instagram-engagement-is-not-a-lead">Instagram engagement is not a lead</a>. <a href="/blog/dont-invent-the-price">Do not invent the price</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
