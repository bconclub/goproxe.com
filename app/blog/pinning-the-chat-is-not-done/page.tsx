import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `Pinning the chat is not done | PROXe`,
  description: `Starring the thread is not the desk.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/pinning-the-chat-is-not-done',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/pinning-the-chat-is-not-done.png'],
  },
}

const articleContent = `They asked for a slot. You pinned the chat so it would not get lost. Or you starred it. Your side felt organized. Their side still has no next line. Pinning is a bookmark. Done is an ask, two times, or a handoff. The desk does the second one.

Pin means you can find the chat later. The lead still waits. Done means the thread moved. Two facts. Two times. Or a clear handoff to a person. If the last thing you did is Pin, you filed. You did not desk.

Pin. Close the phone. Star. Plan to answer after lunch. Archive the noisy ones. Pin the important one. Still no reply. Move it to a labeled folder. Lead sees silence.

You can open the thread and point at the last line the lead got. If that line is missing and only your pin list grew, you organized. You did not offer a slot.

Clinics, coaches, home services, anyone whose WhatsApp is full of pins and empty calendars. If you keep starring chats and still miss Thursday, this page is the map.

PROXe is the desk that finishes the thread, not only pins it. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic. What is PROXe? Talk to PROXe at goproxe.com.

Is pinning wrong?
No. Pinning without a next line is.

Does PROXe pin chats?
No. It sends the next useful line and books when it can.

What if you need a person?
It asks two facts, then hands the thread with context.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

Pinning the chat is not done. Talk to PROXe on the site.

Related: Closing the inbox is not done. Noted is not a next line. A draft is not a reply.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Is pinning wrong?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Pinning without a next line is.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe pin chats?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It sends the next useful line and books when it can.`,
      },
    },
    {
      '@type': 'Question',
      name: `What if you need a person?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `It asks two facts, then hands the thread with context.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it replace the clinic?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It runs the desk until a person or a slot.`,
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

export default function PinningTheChatIsNotDonePage() {
  const slug = 'pinning-the-chat-is-not-done'
  const pageUrl = 'https://goproxe.com/blog/pinning-the-chat-is-not-done'
  const pageTitle = `Pinning the chat is not done`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-done', text: 'How you know it was done' },
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
              <p>They asked for a slot. You pinned the chat so it would not get lost. Or you starred it. Your side felt organized. Their side still has no next line. Pinning is a bookmark. Done is an ask, two times, or a handoff. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Pin means you can find the chat later. The lead still waits. Done means the thread moved. Two facts. Two times. Or a clear handoff to a person. If the last thing you did is Pin, you filed. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Pin. Close the phone. Star. Plan to answer after lunch. Archive the noisy ones. Pin the important one. Still no reply. Move it to a labeled folder. Lead sees silence.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-done">How you know it was done</h2>
              <p>You can open the thread and point at the last line the lead got. If that line is missing and only your pin list grew, you organized. You did not offer a slot.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of pins and empty calendars. If you keep starring chats and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that finishes the thread, not only pins it. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is pinning wrong?</strong></p>
              <p>No. Pinning without a next line is.</p>
              <p><strong>Does PROXe pin chats?</strong></p>
              <p>No. It sends the next useful line and books when it can.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Pinning the chat is not done. Talk to PROXe on the site.</p>
            </section>

            <section className={styles.section}>
              <p>Related: <a href="/blog/closing-the-inbox-is-not-done">Closing the inbox is not done</a>. <a href="/blog/noted-is-not-a-next-line">Noted is not a next line</a>. <a href="/blog/a-draft-is-not-a-reply">A draft is not a reply</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
