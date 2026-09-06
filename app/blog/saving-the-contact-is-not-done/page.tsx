import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Saving the contact is not done',
  description:
    'A new contact is a file. It is not the desk.',
  alternates: {
    canonical: 'https://goproxe.com/blog/saving-the-contact-is-not-done',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/saving-the-contact-is-not-done.png'],
  },
}

const articleContent = `They asked for a fee and a slot. You tapped Save. Name. Number. Blue tick on the contact card.
The lead still has no next line. Your phone has one more row.
Saving the contact is a file. Done is an ask, two times, or a handoff. The desk does the second one.

Save means you can find them later. The lead still waits.
Done means the thread moved. Two facts. Two times. Or a clear handoff to a person.
If the last thing you did is Save, you filed. You did not desk.

Save contact. Close the chat.
Add to CRM. Leave New.
Screenshot the number into Notes. No reply.
Forward the vCard to the group. No line back to the lead.

You can open the thread and point at the last line the lead got.
If that line is missing and only the contact card grew, you logged a number. You did not offer a slot.

Clinics, coaches, home services, anyone whose phone is full of saved names and empty calendars.
If you keep saving contacts and still miss Thursday, this page is the map.

PROXe is the desk that finishes the thread, not only saves the number.
It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.
What is PROXe?
Talk to PROXe at goproxe.com.

Is saving the contact wrong? No. It is not enough.
Does PROXe only store contacts? No. It writes the next useful line and books when it can.
What if you need a person? It asks two facts, then hands the thread with context.
Does it replace the clinic? No. It runs the desk until a person or a slot.
How long to go live? 48 hours.

Saving the contact is not done. Talk to PROXe on the site.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is saving the contact wrong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It is not enough.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe only store contacts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It writes the next useful line and books when it can.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if you need a person?',
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

export default function SavingTheContactIsNotDonePage() {
  const slug = 'saving-the-contact-is-not-done'
  const pageUrl = 'https://goproxe.com/blog/saving-the-contact-is-not-done'
  const pageTitle = 'Saving the contact is not done'

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
              <p>They asked for a fee and a slot. You tapped Save. Name. Number. Blue tick on the contact card.</p>
              <p>The lead still has no next line. Your phone has one more row.</p>
              <p>Saving the contact is a file. Done is an ask, two times, or a handoff. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Save means you can find them later. The lead still waits.</p>
              <p>Done means the thread moved. Two facts. Two times. Or a clear handoff to a person.</p>
              <p>If the last thing you did is Save, you filed. You did not desk.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Save contact. <a href="/blog/closing-the-inbox-is-not-done">Close the chat</a>.</p>
              <p>Add to CRM. <a href="/blog/a-status-is-not-a-message">Leave New</a>.</p>
              <p>Screenshot the number into Notes. <a href="/blog/noted-is-not-a-next-line">No reply</a>.</p>
              <p>Forward the vCard to the group. No line back to the lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-done">How you know it was done</h2>
              <p>You can open the thread and point at the last line the lead got.</p>
              <p>If that line is missing and only the contact card grew, you logged a number. You did not offer a slot.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose phone is full of saved names and empty calendars.</p>
              <p>If you keep saving contacts and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that finishes the thread, not only saves the number.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is saving the contact wrong?</strong></p>
              <p>No. It is not enough.</p>
              <p><strong>Does PROXe only store contacts?</strong></p>
              <p>No. It writes the next useful line and books when it can.</p>
              <p><strong>What if you need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Saving the contact is not done. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
