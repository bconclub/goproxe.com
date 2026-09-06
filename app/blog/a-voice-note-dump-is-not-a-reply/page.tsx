import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `A voice note dump is not a reply`,
  description: `A long clip is not the next line.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/a-voice-note-dump-is-not-a-reply',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-voice-note-dump-is-not-a-reply.png'],
  },
}

const articleContent = `They asked for a slot. You sent a three-minute voice note. Price, story, parking tips, and a maybe. The lead still has no clear time. Your side felt thorough. A voice note dump is a file. A reply is an ask, two times, or a handoff. The desk does the second one.

A long clip can explain. The lead still needs a next step they can act on. A reply moves the thread. Two facts. Two times. Or a clear handoff to a person. If the last thing you sent is a dump with no ask, you talked. You did not desk.

Record everything. Hit send. Hope they listen. Voice note plus noted. Still no slot. Forward a staff voice note into the lead thread. No clear question. Type a wall, then convert it to audio. Same park, spoken.

You can open the thread and point at the last line the lead got. If that line is only a long clip with no two times and no ask, you dumped. You did not offer a slot.

Clinics, coaches, home services, anyone whose WhatsApp is full of voice notes and empty calendars. If you keep dumping clips and still miss Thursday, this page is the map.

PROXe is the desk that writes the next useful line, not a long dump. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic. What is PROXe? Talk to PROXe at goproxe.com.

Are voice notes bad?
No. A dump with no next step is.

Does PROXe send long voice notes?
No. It sends the next useful line and books when it can.

What if you need a person?
It asks two facts, then hands the thread with context.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

A voice note dump is not a reply. Talk to PROXe on the site.

Related: Noted is not a next line. Seen is not a reply. I'll get back to you is not a reply.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Are voice notes bad?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. A dump with no next step is.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe send long voice notes?`,
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

export default function AVoiceNoteDumpIsNotAReplyPage() {
  const slug = 'a-voice-note-dump-is-not-a-reply'
  const pageUrl = 'https://goproxe.com/blog/a-voice-note-dump-is-not-a-reply'
  const pageTitle = `A voice note dump is not a reply`

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
              <p>They asked for a slot. You sent a three-minute voice note. Price, story, parking tips, and a maybe.</p>
              <p>The lead still has no clear time. Your side felt thorough.</p>
              <p>A voice note dump is a file. A reply is an ask, two times, or a handoff. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A long clip can explain. The lead still needs a next step they can act on.</p>
              <p>A reply moves the thread. Two facts. Two times. Or a clear handoff to a person.</p>
              <p>If the last thing you sent is a dump with no ask, you talked. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Record everything. Hit send. Hope they listen.</p>
              <p>Voice note plus <a href="/blog/noted-is-not-a-next-line">noted</a>. Still no slot.</p>
              <p>Forward a staff voice note into the lead thread. No clear question.</p>
              <p>Type a wall, then convert it to audio. Same park, spoken.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-reply">How you know it was a reply</h2>
              <p>You can open the thread and point at the last line the lead got.</p>
              <p>If that line is only a long clip with no two times and no ask, you dumped. You did not offer a slot.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of voice notes and empty calendars.</p>
              <p>If you keep dumping clips and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that writes the next useful line, not a long dump.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Are voice notes bad?</strong></p>
              <p>No. A dump with no next step is.</p>
              <p><strong>Does PROXe send long voice notes?</strong></p>
              <p>No. It sends the next useful line and books when it can.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A voice note dump is not a reply. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
