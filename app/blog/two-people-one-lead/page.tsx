import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Two people, one lead | PROXe',
  description:
    'Two humans on the same chat is not coverage.',
  alternates: {
    canonical: 'https://goproxe.com/blog/two-people-one-lead',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/two-people-one-lead.png'],
  },
}

const articleContent = `One lead. Two phones. Two different answers. The lead picks the cheaper one and ghosts the other.

Coverage is not two people typing. Coverage is one owner, same memory, one next line.

One number, a whole team is the setup. This page is what breaks when two humans both answer without a desk.

One owner runs the thread. Asks. Books. Hands off with context.
Two people answering is a race. Price slips. Slot clashes. The lead hears two brands.
If both of you are online and neither owns the chat, you do not have coverage. You have noise.

Owner replies on WhatsApp. Partner replies on Instagram. Different fee.
Night shift rewrites the morning promise.
Both book a slot. Neither checks the calendar.
Handoff is a screenshot with no thread.

You can name who speaks next. You can open one thread and see every ask and every slot.
If the lead has to reconcile two chats, you did not desk. You split.

Clinics, coaches, home services, partner shops sharing inbound.
If two of you answer and your calendar still has holes, this page is the map.

PROXe is one desk on every channel.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. One memory. One next line. It does not invent a fee. It does not replace the clinic. When a person is needed, it hands the full thread over.
What is PROXe?
Talk to PROXe at goproxe.com.

Can two humans still help?
Yes. After one desk owns the thread, or after a clean handoff.
Does PROXe let both partners type at once?
No. One desk. One memory.
What if the lead asks for a person?
It asks two facts, then hands the thread with context.
Does it replace the clinic?
No. It runs the desk until a person or a slot.
How long to go live?
48 hours.

Two people, one lead. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can two humans still help?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. After one desk owns the thread, or after a clean handoff.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe let both partners type at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. One desk. One memory.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the lead asks for a person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It asks two facts, then hands the thread with context.',
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

export default function TwoPeopleOneLeadPage() {
  const slug = 'two-people-one-lead'
  const pageUrl = 'https://goproxe.com/blog/two-people-one-lead'
  const pageTitle = 'Two people, one lead'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-one-owner-is-real', text: 'How you know one owner is real' },
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
              <p>One lead. Two phones. Two different answers. The lead picks the cheaper one and ghosts the other.</p>
              <p>Coverage is not two people typing. Coverage is one owner, same memory, one next line.</p>
              <p><a href="/blog/one-number-a-whole-team">One number, a whole team</a> is the setup. This page is what breaks when two humans both answer without a desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>One owner runs the thread. Asks. Books. Hands off with context.</p>
              <p>Two people answering is a race. Price slips. Slot clashes. The lead hears two brands.</p>
              <p>If both of you are online and neither owns the chat, you do not have coverage. You have noise.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Owner replies on WhatsApp. Partner replies on Instagram. Different fee.</p>
              <p>Night shift rewrites the morning promise.</p>
              <p>Both book a slot. Neither checks the calendar.</p>
              <p>Handoff is a screenshot with no thread.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-one-owner-is-real">How you know one owner is real</h2>
              <p>You can name who speaks next. You can open one thread and see every ask and every slot.</p>
              <p>If the lead has to reconcile two chats, you did not desk. You split.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, partner shops sharing inbound.</p>
              <p>If two of you answer and your calendar still has holes, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is one desk on every channel.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. One memory. One next line. It does not invent a fee. It does not replace the clinic. When a person is needed, it hands the full thread over.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Can two humans still help?</strong></p>
              <p>Yes. After one desk owns the thread, or after a clean handoff.</p>
              <p><strong>Does PROXe let both partners type at once?</strong></p>
              <p>No. One desk. One memory.</p>
              <p><strong>What if the lead asks for a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Two people, one lead. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
