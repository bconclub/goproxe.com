import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `A draft is not a reply | PROXe`,
  description: `Typing and leaving it is not the desk.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/a-draft-is-not-a-reply',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-draft-is-not-a-reply.png'],
  },
}

const articleContent = `They asked for a slot. You typed a careful reply. Then you left the chat. The draft sat in the box. Your side felt almost done. Their side still has silence. A draft is a private note. A reply is a next line the lead can read. The desk does the second one.

Draft means you started. The lead still waits. Reply means the thread moved. Two facts. Two times. Or a clear handoff to a person. If the last thing you did is leave text unsent, you parked. You did not desk.

Type half a reply. Switch apps. Forget. Save as draft. Plan to finish later. Rewrite three times. Never hit send. Draft on one phone. Lead is on another thread.

You can open the thread and point at the last line the lead got. If that line is missing and only your draft box grew, you typed. You did not reply.

Clinics, coaches, home services, anyone whose WhatsApp is full of unsent drafts and empty calendars. If you keep almost answering and still miss Thursday, this page is the map.

PROXe is the desk that sends the next line, not a draft that sits. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic. What is PROXe? Talk to PROXe at goproxe.com.

Is drafting wrong?
No. Leaving it unsent is.

Does PROXe leave drafts?
No. It sends the next useful line.

What if you need a person?
It asks two facts, then hands the thread with context.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

A draft is not a reply. Talk to PROXe on the site.

Related: Noted is not a next line. Seen is not a reply. I'll get back to you is not a reply.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Is drafting wrong?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Leaving it unsent is.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe leave drafts?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It sends the next useful line.`,
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

export default function ADraftIsNotAReplyPage() {
  const slug = 'a-draft-is-not-a-reply'
  const pageUrl = 'https://goproxe.com/blog/a-draft-is-not-a-reply'
  const pageTitle = `A draft is not a reply`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-reply', text: 'How you know it was a reply' },
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
              <p>They asked for a slot. You typed a careful reply. Then you left the chat. The draft sat in the box. Your side felt almost done. Their side still has silence. A draft is a private note. A reply is a next line the lead can read. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Draft means you started. The lead still waits. Reply means the thread moved. Two facts. Two times. Or a clear handoff to a person. If the last thing you did is leave text unsent, you parked. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Type half a reply. Switch apps. Forget. Save as draft. Plan to finish later. Rewrite three times. Never hit send. Draft on one phone. Lead is on another thread.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-reply">How you know it was a reply</h2>
              <p>You can open the thread and point at the last line the lead got. If that line is missing and only your draft box grew, you typed. You did not reply.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of unsent drafts and empty calendars. If you keep almost answering and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that sends the next line, not a draft that sits. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is drafting wrong?</strong></p>
              <p>No. Leaving it unsent is.</p>
              <p><strong>Does PROXe leave drafts?</strong></p>
              <p>No. It sends the next useful line.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A draft is not a reply. Talk to PROXe on the site.</p>
            </section>

            <section className={styles.section}>
              <p>Related: <a href="/blog/noted-is-not-a-next-line">Noted is not a next line</a>. <a href="/blog/seen-is-not-a-reply">Seen is not a reply</a>. <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
