import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'One number is not a whole team | PROXe',
  description:
    "The business number lives on one phone. The owner's.",
  alternates: {
    canonical: 'https://goproxe.com/blog/one-number-a-whole-team',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/one-number-a-whole-team.png'],
  },
}

const articleContent = `The business number lives on one phone. The owner's. Staff cannot see the chats. Two people guess who already replied. The owner goes out, the phone goes with them, and so do the customers.

One number is not a desk. It is a pocket.

The job is the same as every other inbound. Answer. Two questions. Two slots. Follow up until they decide. The number has to be shareable without becoming "who has the phone."

WhatsApp is the front door. Home services, clinics, advisory. "Are you free Thursday." Same job as a conversation that books. Same question as who answers the customer.

What people run instead:

The owner's personal WhatsApp. They screenshot a chat into a group. The lead waits while the screenshot travels.

WhatsApp Business on one handset. Labels. Quick replies. Still one pair of eyes. Night jobs, site visits, the phone is in a van.

A shared login. Two staff open the same thread. Both reply. The customer gets two voices. One lead, four channels, one memory.

A CRM that logs the number and never sees the thread. Your CRM will not answer.

When the owner leaves, they take the inbox. The team inherits silence.

Any named person can pick up a live thread without asking who has the phone. The customer does not repeat themselves. Two people do not write at once. When the owner is on a job, the 2pm slot still gets offered.

If the inbox dies when one handset leaves the building, you do not have a team. You have a phone.

Home services, professional services, clinics. Anyone whose WhatsApp is the business and lives on one person.

If a booking dies because the owner was on site, this page is the map.

PROXe is the desk on that number.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The staff see the same thread. The owner can leave. The customer is one person, not three inboxes. It does not replace the technician. It does the 2pm reply so they walk into a booked slot.

What is PROXe?

Talk to PROXe at goproxe.com.

Can a team share one WhatsApp number?

Yes. The number is the door. The desk has to be more than one phone.

Why do chats get missed on one phone?

Because the phone left with someone. Or two people guessed. Or nobody was looking.

Do we still need WhatsApp Business?

The channel stays. The desk cannot be one handset.

Does it invent a price?

No. It books the slot and hands you the thread.

How long to go live?

48 hours.

One number is the door. The team is the desk. Talk to PROXe on the site.

Related: Your CRM will not answer. They called while you were on a job. The crew that answered got the work. One lead, four channels, one memory. Industries: home services, professional services.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can a team share one WhatsApp number?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The number is the door. The desk has to be more than one phone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do chats get missed on one phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because the phone left with someone. Or two people guessed. Or nobody was looking.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do we still need WhatsApp Business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The channel stays. The desk cannot be one handset.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it invent a price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It books the slot and hands you the thread.',
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

export default function OneNumberAWholeTeamPage() {
  const slug = 'one-number-a-whole-team'
  const pageUrl = 'https://goproxe.com/blog/one-number-a-whole-team'
  const pageTitle = 'One number is not a whole team'

  const tocItems = [
    { id: 'the-hidden-tax', text: 'The hidden tax' },
    { id: 'how-you-know-the-number-is-a-desk', text: 'How you know the number is a desk' },
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
              <p>The business number lives on one phone. The owner's. Staff cannot see the chats. Two people guess who already replied. The owner goes out, the phone goes with them, and so do the customers.</p>
              <p>One number is not a desk. It is a pocket.</p>
              <p>The job is the same as every other inbound. Answer. Two questions. Two slots. Follow up until they decide. The number has to be shareable without becoming "who has the phone."</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-hidden-tax">The hidden tax</h2>
              <p>WhatsApp is the front door. Home services, clinics, advisory. "Are you free Thursday." Same job as <a href="/blog/conversation-that-books">a conversation that books</a>. Same question as <a href="/blog/who-answers-the-customer">who answers the customer</a>.</p>
              <p>What people run instead:</p>
              <p>The owner's personal WhatsApp. They screenshot a chat into a group. The lead waits while the screenshot travels.</p>
              <p>WhatsApp Business on one handset. Labels. Quick replies. Still one pair of eyes. Night jobs, site visits, the phone is in a van.</p>
              <p>A shared login. Two staff open the same thread. Both reply. The customer gets two voices. <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>.</p>
              <p>A CRM that logs the number and never sees the thread. <a href="/blog/crm-wont-answer">Your CRM will not answer</a>.</p>
              <p>When the owner leaves, they take the inbox. The team inherits silence.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-the-number-is-a-desk">How you know the number is a desk</h2>
              <p>Any named person can pick up a live thread without asking who has the phone. The customer does not repeat themselves. Two people do not write at once. When the owner is on a job, the 2pm slot still gets offered.</p>
              <p>If the inbox dies when one handset leaves the building, you do not have a team. You have a phone.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Home services, professional services, clinics. Anyone whose WhatsApp is the business and lives on one person.</p>
              <p>If a booking dies because the owner was on site, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk on that number.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. The staff see the same thread. The owner can leave. The customer is one person, not three inboxes. It does not replace the technician. It does the 2pm reply so they walk into a booked slot.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Can a team share one WhatsApp number?</strong></p>
              <p>Yes. The number is the door. The desk has to be more than one phone.</p>
              <p><strong>Why do chats get missed on one phone?</strong></p>
              <p>Because the phone left with someone. Or two people guessed. Or nobody was looking.</p>
              <p><strong>Do we still need WhatsApp Business?</strong></p>
              <p>The channel stays. The desk cannot be one handset.</p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the slot and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>One number is the door. The team is the desk. Talk to PROXe on the site.</p>
              <p>Related: <a href="/blog/crm-wont-answer">Your CRM will not answer</a>. <a href="/blog/home-services-on-a-job">They called while you were on a job. The crew that answered got the work.</a> <a href="/blog/one-memory-every-channel">One lead, four channels, one memory</a>. Industries: <a href="/industries/home-services">home services</a>, <a href="/industries/professional-services">professional services</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
