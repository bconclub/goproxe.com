import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'The group chat is not the desk | PROXe',
  description:
    'Staff chatter is not the lead thread.',
  alternates: {
    canonical: 'https://goproxe.com/blog/the-group-chat-is-not-the-desk',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/the-group-chat-is-not-the-desk.png'],
  },
}

const articleContent = `The lead wrote on WhatsApp. You pasted it into the owner group. Six people typed. Nobody wrote the lead back.

A group chat is for your team. The desk is one owner, one memory, one next line out to the customer.

Two people, one lead is the split-answer problem. This page is the internal pile-on.

Staff chat decides who owns it.
The desk asks, books, or hands off in the lead thread.
If the only action is a screenshot in the group, you briefed the team. You did not desk.

Forward to the group. Wait for consensus.
Five opinions. Zero times offered.
Tag the closer. The lead gets silence.
Debate price in the group while the lead goes cold.

You can open the customer thread and point at the last line they got.
If the work only lives in your staff chat, you did not desk.

Clinics, coaches, partner shops, anyone whose real desk is a WhatsApp group named Leads.
If the group is loud and the customer thread is quiet, this page is the map.

PROXe is one desk on every channel.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The team can watch. The lead gets one memory and one next line. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

Can the team still help?
Yes. After one desk owns the thread, or after a clean handoff.
Does PROXe dump the lead into a group?
No. It runs the thread, then hands over with context when needed.
What if two partners need to see it?
One owner. Shared memory. One reply path.
Does it replace the clinic?
No. It runs the desk until a person or a slot.
How long to go live?
48 hours.

The group chat is not the desk. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can the team still help?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. After one desk owns the thread, or after a clean handoff.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe dump the lead into a group?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It runs the thread, then hands over with context when needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if two partners need to see it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One owner. Shared memory. One reply path.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it replace the clinic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It runs the desk until a person or a slot.',
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

export default function TheGroupChatIsNotTheDeskPage() {
  const slug = 'the-group-chat-is-not-the-desk'
  const pageUrl = 'https://goproxe.com/blog/the-group-chat-is-not-the-desk'
  const pageTitle = 'The group chat is not the desk'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-one-desk-is-real', text: 'How you know one desk is real' },
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
              <p>The lead wrote on WhatsApp. You pasted it into the owner group. Six people typed. Nobody wrote the lead back.</p>
              <p>A group chat is for your team. The desk is one owner, one memory, one next line out to the customer.</p>
              <p><a href="/blog/two-people-one-lead">Two people, one lead</a> is the split-answer problem. This page is the internal pile-on.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Staff chat decides who owns it.</p>
              <p>The desk asks, books, or hands off in the lead thread.</p>
              <p>If the only action is a screenshot in the group, you briefed the team. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Forward to the group. Wait for consensus. <a href="/blog/seen-is-not-a-reply">Seen is not a reply</a>.</p>
              <p>Five opinions. Zero times offered.</p>
              <p>Tag the closer. The lead gets silence. <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a>.</p>
              <p>Debate price in the group while the lead goes cold.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-one-desk-is-real">How you know one desk is real</h2>
              <p>You can open the customer thread and point at the last line they got.</p>
              <p>If the work only lives in your staff chat, you did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, partner shops, anyone whose real desk is a WhatsApp group named Leads.</p>
              <p>If the group is loud and the customer thread is quiet, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is one desk on every channel.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The team can watch. The lead gets one memory and one next line. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Can the team still help?</strong></p>
              <p>Yes. After one desk owns the thread, or after a clean handoff.</p>
              <p><strong>Does PROXe dump the lead into a group?</strong></p>
              <p>No. It runs the thread, then hands over with context when needed.</p>
              <p><strong>What if two partners need to see it?</strong></p>
              <p>One owner. Shared memory. One reply path.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The group chat is not the desk. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
