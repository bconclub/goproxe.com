import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `A no-show is still a lead | PROXe`,
  description: `Empty chair is not closed.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/a-no-show-is-still-a-lead',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-no-show-is-still-a-lead.png'],
  },
}

const articleContent = `Thursday 4pm. The chair is empty. You mark No-show and move on. The lead still has no next line.

A no-show is not a lost deal. It is an open thread. Rebook two times, or clear a no. The desk does not file and forget.

After they book is the booking job. This page is what happens when they do not sit.

A booking puts a slot on the calendar.
A no-show is a miss. The next line is a new slot or a clear stop.
If the only update is a no-show tag, you logged a miss. You did not desk.

Mark No-show. Never write again.
Shame text. No times. Silence is not a decision.
Wait for them to apologise. The inbox stays quiet. Closing the inbox is not done.
Book another lead over the slot and lose the first one forever.

You can point at two new times, a new booked slot, or a clear no in the thread.
If the last line is only a CRM no-show, you filed. You did not desk.

Clinics, coaches, home services, anyone whose calendar has empty chairs and no follow-up.
If no-shows die in the CRM and never get a second chance, this page is the map.

PROXe is the desk that treats a miss as still open.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. After a no-show it offers times again, or clears. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

How many times do you rebook?
Two clean offers. Then a clear stop if they go quiet.

Does PROXe shame the lead?
No. It offers times or hands off.

Is a no-show a lost lead?
Not until you clear it. Until then it is open.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

A no-show is still a lead. Talk to PROXe on the site.

Related: After they book. Silence is not a decision. Follow-up is a system.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `How many times do you rebook?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Two clean offers. Then a clear stop if they go quiet.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe shame the lead?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It offers times or hands off.`,
      },
    },
    {
      '@type': 'Question',
      name: `Is a no-show a lost lead?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Not until you clear it. Until then it is open.`,
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

export default function ANoShowIsStillALeadPage() {
  const slug = 'a-no-show-is-still-a-lead'
  const pageUrl = 'https://goproxe.com/blog/a-no-show-is-still-a-lead'
  const pageTitle = `A no-show is still a lead`

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
              <p>Thursday 4pm. The chair is empty. You mark No-show and move on. The lead still has no next line.</p>
              <p>A no-show is not a lost deal. It is an open thread. Rebook two times, or clear a no. The desk does not file and forget.</p>
              <p><a href="/blog/after-they-book">After they book</a> is the booking job. This page is what happens when they do not sit.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A booking puts a slot on the calendar.</p>
              <p>A no-show is a miss. The next line is a new slot or a clear stop.</p>
              <p>If the only update is a no-show tag, you logged a miss. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Mark No-show. Never write again.</p>
              <p>Shame text. No times. <a href="/blog/silence-is-not-a-decision">Silence is not a decision</a>.</p>
              <p>Wait for them to apologise. The inbox stays quiet. <a href="/blog/closing-the-inbox-is-not-done">Closing the inbox is not done</a>.</p>
              <p>Book another lead over the slot and lose the first one forever.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-done">How you know it was done</h2>
              <p>You can point at two new times, a new booked slot, or a clear no in the thread.</p>
              <p>If the last line is only a CRM no-show, you filed. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose calendar has empty chairs and no follow-up.</p>
              <p>If no-shows die in the CRM and never get a second chance, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that treats a miss as still open.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. After a no-show it offers times again, or clears. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How many times do you rebook?</strong></p>
              <p>Two clean offers. Then a clear stop if they go quiet.</p>
              <p><strong>Does PROXe shame the lead?</strong></p>
              <p>No. It offers times or hands off.</p>
              <p><strong>Is a no-show a lost lead?</strong></p>
              <p>Not until you clear it. Until then it is open.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A no-show is still a lead. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
