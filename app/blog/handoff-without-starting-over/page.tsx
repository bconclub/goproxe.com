import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: `Handoff without starting over | PROXe`,
  description: `A handoff is not a new chat.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/handoff-without-starting-over',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/handoff-without-starting-over.png'],
  },
}

const articleContent = `A handoff is not a new chat. It is not a CRM note. It is not "let me get someone to call you." The customer already said who they are and what they want. The next person has to see that thread.

They told the front desk Thursday 4pm. Then the owner opened a blank WhatsApp. They said it again.

One thread. One person. That is the job.

## Two different jobs

The first reply is the desk. Answer, two questions, two slots. [A conversation that books](/blog/conversation-that-books)

The handoff is the same desk, a different pair of hands. The owner, the tech, the coach. They pick up the live thread. The customer does not repeat themselves. [One lead, four channels, one memory](/blog/one-memory-every-channel). [One number is not a whole team](/blog/one-number-a-whole-team)

If the handoff is a new inbox, you paid for the lead twice.

## What people run instead

A screenshot into a staff group. The lead waits while the picture travels.

A CRM row with no thread. "Assigned." Nobody has the words. [Your CRM will not answer](/blog/crm-wont-answer)

A fresh WhatsApp from the owner. The customer starts over. They drop.

Two people writing in the same chat with no memory of who already offered Thursday.

## How you know the handoff worked

The second person can point at the last useful message and the slot already on the table. The customer does not restate their name, their job, or the time they picked.

If they have to say it again, you do not have a handoff. You have a restart.

## Who this is for

Home services, clinics, coaches, anyone where the person who answered is not the person who does the work.

If bookings die when the owner takes over, this page is the map.

## Then PROXe

PROXe is the desk that does not start over.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The first reply and the owner taking over are the same person in the same thread. It does not invent a fee. It does not replace the technician. It holds the Thursday slot so nobody asks again.

[What is PROXe?](/blog/what-is-proxe)

Talk to PROXe at [goproxe.com](/).

## Questions people ask

How do you hand off a WhatsApp lead?
The next person opens the same thread. They see the last useful message and the slot already offered.

Why do customers repeat themselves?
Because the handoff was a new inbox, a screenshot, or a CRM row with no words.

Does the CRM do the handoff?
No. The thread does.

Does it invent a price?
No. It books the slot and hands you the thread.

How long to go live?
48 hours.

The handoff is not a restart. Talk to PROXe on the site.

Related: One lead, four channels, one memory. One number is not a whole team. Your CRM will not answer. A conversation that books.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `How do you hand off a WhatsApp lead?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `The next person opens the same thread. They see the last useful message and the slot already offered.`,
      },
    },
    {
      '@type': 'Question',
      name: `Why do customers repeat themselves?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Because the handoff was a new inbox, a screenshot, or a CRM row with no words.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does the CRM do the handoff?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. The thread does.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it invent a price?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It books the slot and hands you the thread.`,
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

export default function HandoffWithoutStartingOverPage() {
  const slug = 'handoff-without-starting-over'
  const pageUrl = 'https://goproxe.com/blog/handoff-without-starting-over'
  const pageTitle = `Handoff without starting over`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-the-handoff-worked', text: 'How you know the handoff worked' },
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
              <p>A handoff is not a new chat. It is not a CRM note. It is not "let me get someone to call you." The customer already said who they are and what they want. The next person has to see that thread.</p>
              <p>They told the front desk Thursday 4pm. Then the owner opened a blank WhatsApp. They said it again.</p>
              <p>One thread. One person. That is the job.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>The first reply is the desk. Answer, two questions, two slots. <a href="/blog/conversation-that-books">A conversation that books</a></p>
              <p>The handoff is the same desk, a different pair of hands. The owner, the tech, the coach. They pick up the live thread. The customer does not repeat themselves. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>. <a href="/blog/one-number-a-whole-team">One number is not a whole team</a></p>
              <p>If the handoff is a new inbox, you paid for the lead twice.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>A screenshot into a staff group. The lead waits while the picture travels.</p>
              <p>A CRM row with no thread. "Assigned." Nobody has the words. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
              <p>A fresh WhatsApp from the owner. The customer starts over. They drop.</p>
              <p>Two people writing in the same chat with no memory of who already offered Thursday.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-the-handoff-worked">How you know the handoff worked</h2>
              <p>The second person can point at the last useful message and the slot already on the table. The customer does not restate their name, their job, or the time they picked.</p>
              <p>If they have to say it again, you do not have a handoff. You have a restart.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Home services, clinics, coaches, anyone where the person who answered is not the person who does the work.</p>
              <p>If bookings die when the owner takes over, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that does not start over.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The first reply and the owner taking over are the same person in the same thread. It does not invent a fee. It does not replace the technician. It holds the Thursday slot so nobody asks again.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How do you hand off a WhatsApp lead?</strong></p>
              <p>The next person opens the same thread. They see the last useful message and the slot already offered.</p>
              <p><strong>Why do customers repeat themselves?</strong></p>
              <p>Because the handoff was a new inbox, a screenshot, or a CRM row with no words.</p>
              <p><strong>Does the CRM do the handoff?</strong></p>
              <p>No. The thread does.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the slot and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>The handoff is not a restart. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
