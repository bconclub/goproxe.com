import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `A reschedule needs a slot`,
  description: `Let's move it is not done.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/a-reschedule-needs-a-slot',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-reschedule-needs-a-slot.png'],
  },
}

const articleContent = `They said Thursday does not work. You wrote no problem, we will move it. No new times. The thread died.

A reschedule is not a soft maybe. It is two new times, or a clear stop. The desk names the next slot.

The calendar is not the desk is the link dump. This page is the move without a time.

A cancel closes the old slot.
A reschedule opens a new one. Two times. Confirm. Or clear.
If the only line is we will move it, you parked. You did not desk.

Ok we will shift. No times. I'll get back to you is not a reply.
Wait for them to pick a day. Silence is not a decision.
Leave the old slot hanging. Double book later.
Say anytime next week. No ask.

You can point at two new times, or a new booked slot, in the thread.
If the last line is only move it, you did not desk.

Clinics, coaches, home services, anyone whose calendar is full of moved with no new time.
If reschedules vanish into later, this page is the map.

PROXe is the desk that finishes the move.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. When they move, it offers times again. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

How many times do you offer?
Two clean times. Then follow up or clear.

Does PROXe keep the old slot open forever?
No. It closes or replaces it.

Can they pick later?
Yes. After you name times, not instead of times.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

A reschedule needs a slot. Talk to PROXe on the site.

Related: A no-show is still a lead. The calendar is not the desk. After they book. Silence is not a decision.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `How many times do you offer?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Two clean times. Then follow up or clear.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe keep the old slot open forever?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It closes or replaces it.`,
      },
    },
    {
      '@type': 'Question',
      name: `Can they pick later?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes. After you name times, not instead of times.`,
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

export default function ARescheduleNeedsASlotPage() {
  const slug = 'a-reschedule-needs-a-slot'
  const pageUrl = 'https://goproxe.com/blog/a-reschedule-needs-a-slot'
  const pageTitle = `A reschedule needs a slot`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-a-real-reschedule', text: 'How you know it was a real reschedule' },
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
              <p>They said Thursday does not work. You wrote no problem, we will move it. No new times. The thread died.</p>
              <p>A reschedule is not a soft maybe. It is two new times, or a clear stop. The desk names the next slot.</p>
              <p><a href="/blog/the-calendar-is-not-the-desk">The calendar is not the desk</a> is the link dump. This page is the move without a time.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A cancel closes the old slot.</p>
              <p>A reschedule opens a new one. Two times. Confirm. Or clear.</p>
              <p>If the only line is we will move it, you parked. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Ok we will shift. No times. <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a>.</p>
              <p>Wait for them to pick a day. <a href="/blog/silence-is-not-a-decision">Silence is not a decision</a>.</p>
              <p>Leave the old slot hanging. Double book later.</p>
              <p>Say anytime next week. No ask.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-a-real-reschedule">How you know it was a real reschedule</h2>
              <p>You can point at two new times, or a new booked slot, in the thread.</p>
              <p>If the last line is only move it, you did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose calendar is full of moved with no new time.</p>
              <p>If reschedules vanish into later, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that finishes the move.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. When they move, it offers times again. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How many times do you offer?</strong></p>
              <p>Two clean times. Then follow up or clear.</p>
              <p><strong>Does PROXe keep the old slot open forever?</strong></p>
              <p>No. It closes or replaces it.</p>
              <p><strong>Can they pick later?</strong></p>
              <p>Yes. After you name times, not instead of times.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A reschedule needs a slot. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
