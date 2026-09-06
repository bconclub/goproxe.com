import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `The spreadsheet is not the desk | PROXe`,
  description: `A row is not a next line.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/the-spreadsheet-is-not-the-desk',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/the-spreadsheet-is-not-the-desk.png'],
  },
}

const articleContent = `They asked for a slot. You put them in a sheet. Name, number, source, status. Your side looks tracked. Their side still has no reply. A spreadsheet is a file. The desk is an ask, two times, or a book. The desk does the second one.

A row means you can sort the lead later. The lead still waits. The desk means the thread moved. Two facts. Two times. Or a clear handoff. If the last thing you did is update a cell, you logged. You did not desk.

Paste the WhatsApp into column A. Close the chat. Color the row yellow. Plan to call after lunch. Filter by status. Still no line back to the lead. Share the sheet with the team. Nobody sends a next line.

You can open the lead thread and point at the last line they got. If that line is missing and only the sheet grew, you tracked. You did not offer a slot.

Clinics, coaches, home services, anyone whose Google Sheet is full and whose calendar is empty. If you keep adding rows and still miss Thursday, this page is the map.

PROXe is the desk that finishes the thread, not only files the row. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic. Talk to PROXe at goproxe.com.

Is a spreadsheet wrong?
No. A spreadsheet without a next line is.

Does PROXe replace your sheet?
No. It runs the desk while your sheet stays a record if you want one.

What if you need a person?
It asks two facts, then hands the thread with context.

Does it replace the clinic?
No. It runs the desk until a person or a slot.

How long to go live?
48 hours.

The spreadsheet is not the desk. Talk to PROXe on the site.

Related: The calendar is not the desk. A status is not a message. Closing the inbox is not done.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Is a spreadsheet wrong?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. A spreadsheet without a next line is.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does PROXe replace your sheet?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It runs the desk while your sheet stays a record if you want one.`,
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

export default function TheSpreadsheetIsNotTheDeskPage() {
  const slug = 'the-spreadsheet-is-not-the-desk'
  const pageUrl = 'https://goproxe.com/blog/the-spreadsheet-is-not-the-desk'
  const pageTitle = `The spreadsheet is not the desk`

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
              <p>They asked for a slot. You put them in a sheet. Name, number, source, status. Your side looks tracked. Their side still has no reply. A spreadsheet is a file. The desk is an ask, two times, or a book. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A row means you can sort the lead later. The lead still waits. The desk means the thread moved. Two facts. Two times. Or a clear handoff. If the last thing you did is update a cell, you logged. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Paste the WhatsApp into column A. Close the chat. Color the row yellow. Plan to call after lunch. Filter by status. Still no line back to the lead. Share the sheet with the team. Nobody sends a next line.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-done">How you know it was done</h2>
              <p>You can open the lead thread and point at the last line they got. If that line is missing and only the sheet grew, you tracked. You did not offer a slot.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose Google Sheet is full and whose calendar is empty. If you keep adding rows and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that finishes the thread, not only files the row. It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is a spreadsheet wrong?</strong></p>
              <p>No. A spreadsheet without a next line is.</p>
              <p><strong>Does PROXe replace your sheet?</strong></p>
              <p>No. It runs the desk while your sheet stays a record if you want one.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The spreadsheet is not the desk. Talk to PROXe on the site.</p>
            </section>

            <section className={styles.section}>
              <p>Related: <a href="/blog/the-calendar-is-not-the-desk">The calendar is not the desk</a>. <a href="/blog/a-status-is-not-a-message">A status is not a message</a>. <a href="/blog/closing-the-inbox-is-not-done">Closing the inbox is not done</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
