import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `A forward is not a handoff`,
  description: `Passing the chat is not the desk.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/a-forward-is-not-a-handoff',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-forward-is-not-a-handoff.png'],
  },
}

const articleContent = `They asked for a slot. You forwarded the chat to a teammate. Done, from your side. The teammate gets a wall of screenshots. The lead gets silence. A forward is a pass. A handoff is context plus a next line the lead can act on. The desk does the second one.

Forward means someone else can see it. The lead still waits. Handoff means the thread keeps moving. Two facts. Two times. Or a clear person with the story already loaded. If the last thing you did is Forward, you moved a file. You did not desk.

Forward to the owner. No note. Screenshot into the staff group. No line back to the lead. Tag a colleague in the group chat. Lead thread stays empty. Say handing to the team. No name, no time, no ask.

You can open the lead thread and point at the last line they got. If that line is missing and only the staff side grew, you forwarded. You did not hand off.

Clinics, coaches, home services, anyone whose WhatsApp is full of forwards and empty calendars. If you keep passing chats and still miss Thursday, this page is the map.

PROXe is the desk that hands over with context, not only forwards the pile. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic. What is PROXe? Talk to PROXe at goproxe.com.

Is forwarding wrong?
No. Forward without a next line is.

Does PROXe forward chats?
It keeps one thread and hands a person the story when needed.

What if you need a person?
It asks two facts, then hands the thread with context.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

A forward is not a handoff. Talk to PROXe on the site.

Related: Handoff without starting over. The group chat is not the desk. Two people, one lead.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Is forwarding wrong?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Forward without a next line is.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe forward chats?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `It keeps one thread and hands a person the story when needed.`,
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

export default function AForwardIsNotAHandoffPage() {
  const slug = 'a-forward-is-not-a-handoff'
  const pageUrl = 'https://goproxe.com/blog/a-forward-is-not-a-handoff'
  const pageTitle = `A forward is not a handoff`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-handoff', text: 'How you know it was a handoff' },
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
              <p>They asked for a slot. You forwarded the chat to a teammate. Done, from your side.</p>
              <p>The teammate gets a wall of screenshots. The lead gets silence.</p>
              <p>A forward is a pass. A handoff is context plus a next line the lead can act on. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Forward means someone else can see it. The lead still waits.</p>
              <p>Handoff means the thread keeps moving. Two facts. Two times. Or a clear person with the story already loaded.</p>
              <p>If the last thing you did is Forward, you moved a file. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Forward to the owner. No note.</p>
              <p>Screenshot into the staff group. No line back to the lead.</p>
              <p>Tag a colleague in the group chat. Lead thread stays empty.</p>
              <p>Say handing to the team. No name, no time, no ask.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-handoff">How you know it was a handoff</h2>
              <p>You can open the lead thread and point at the last line they got.</p>
              <p>If that line is missing and only the staff side grew, you forwarded. You did not hand off.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp is full of forwards and empty calendars.</p>
              <p>If you keep passing chats and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that hands over with context, not only forwards the pile.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is forwarding wrong?</strong></p>
              <p>No. Forward without a next line is.</p>
              <p><strong>Does PROXe forward chats?</strong></p>
              <p>It keeps one thread and hands a person the story when needed.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A forward is not a handoff. Talk to PROXe on the site.</p>
            </section>

            <section className={styles.section}>
              <p>Related: <a href="/blog/handoff-without-starting-over">Handoff without starting over</a>. <a href="/blog/the-group-chat-is-not-the-desk">The group chat is not the desk</a>. <a href="/blog/two-people-one-lead">Two people, one lead</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
