import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'Silence is not a decision | PROXe',
  description: `No reply is not a no.`,
  alternates: {
    canonical: 'https://goproxe.com/blog/silence-is-not-a-decision',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/silence-is-not-a-decision.png'],
  },
}

const articleContent = `No reply is not a no. An empty thread is not a closed lead. Most teams wait once, then stop. The work is follow up until they pick a slot or they say no.

They asked for Thursday. You wrote. They went quiet. You treated quiet as done.

Silence is a pause. A decision is a yes or a no.

Two different jobs

Follow-up is the desk after the first reply. Same thread. New pass. Until they decide. Follow-up is a system. After they book

A decision is a booked slot or a clear no. Then you stop. Quiet is not that.

If you treat silence as a no, you will close leads who were still thinking.

What people run instead

One bump at 9am, then archive.

A CRM status cold with no second message. Your CRM will not answer

Endless pings after they said no. That is not the desk. That is noise.

A weekly screenshot of unreplied chats and no count of still silent. What to measure on inbound

How you know they decided

They picked a time. Or they said no. You can point at that message.

If the last line is yours and they have not answered, you do not have a decision. You have work left.

Who this is for

Clinics, coaches, home services, anyone whose WhatsApp fills with quiet threads they wrote off too soon.

If your pipeline dies at first silence, this page is the map.

Then PROXe

PROXe is the desk that keeps going until they decide.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Quiet gets another pass. A no stops it. It does not invent a fee. It does not replace the clinic. It does the second and third write so Thursday is not lost to silence.

What is PROXe?

Talk to PROXe at goproxe.com.

Questions people ask

How long should you follow up a WhatsApp lead?
Until they pick a slot or they say no. Silence is not the end of that.

When do you stop?
When they decide. A booked time or a clear no.

Is a no-show a no?
No. Offer two new times. After they book

Does it invent a price?
No. It books the consult and hands you the thread.

How long to go live?
48 hours.

Silence is not a decision. Talk to PROXe on the site.

Related: Follow-up is a system. After they book. What to measure on inbound. A conversation that books.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `How long should you follow up a WhatsApp lead?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Until they pick a slot or they say no. Silence is not the end of that.`,
      },
    },
    {
      '@type': 'Question',
      name: `When do you stop?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `When they decide. A booked time or a clear no.`,
      },
    },
    {
      '@type': 'Question',
      name: `Is a no-show a no?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Offer two new times.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does it invent a price?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. It books the consult and hands you the thread.`,
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

export default function SilenceIsNotADecisionPage() {
  const slug = 'silence-is-not-a-decision'
  const pageUrl = 'https://goproxe.com/blog/silence-is-not-a-decision'
  const pageTitle = `Silence is not a decision`

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-they-decided', text: 'How you know they decided' },
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
              <p>No reply is not a no. An empty thread is not a closed lead. Most teams wait once, then stop. The work is follow up until they pick a slot or they say no.</p>
              <p>They asked for Thursday. You wrote. They went quiet. You treated quiet as done.</p>
              <p>Silence is a pause. A decision is a yes or a no.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>Follow-up is the desk after the first reply. Same thread. New pass. Until they decide. <a href="/blog/follow-up-is-a-system">Follow-up is a system</a>. <a href="/blog/after-they-book">After they book</a></p>
              <p>A decision is a booked slot or a clear no. Then you stop. Quiet is not that.</p>
              <p>If you treat silence as a no, you will close leads who were still thinking.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>One bump at 9am, then archive.</p>
              <p>A CRM status cold with no second message. <a href="/blog/crm-wont-answer">Your CRM will not answer</a></p>
              <p>Endless pings after they said no. That is not the desk. That is noise.</p>
              <p>A weekly screenshot of unreplied chats and no count of still silent. <a href="/blog/what-to-measure-on-inbound">What to measure on inbound</a></p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-they-decided">How you know they decided</h2>
              <p>They picked a time. Or they said no. You can point at that message.</p>
              <p>If the last line is yours and they have not answered, you do not have a decision. You have work left.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, home services, anyone whose WhatsApp fills with quiet threads they wrote off too soon.</p>
              <p>If your pipeline dies at first silence, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that keeps going until they decide.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. Quiet gets another pass. A no stops it. It does not invent a fee. It does not replace the clinic. It does the second and third write so Thursday is not lost to silence.</p>
              <p><a href="/blog/what-is-proxe">What is PROXe?</a></p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>How long should you follow up a WhatsApp lead?</strong></p>
              <p>Until they pick a slot or they say no. Silence is not the end of that.</p>
              <p><strong>When do you stop?</strong></p>
              <p>When they decide. A booked time or a clear no.</p>
              <p><strong>Is a no-show a no?</strong></p>
              <p>No. Offer two new times. <a href="/blog/after-they-book">After they book</a></p>
              <p><strong>Does it invent a price?</strong></p>
              <p>No. It books the consult and hands you the thread.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>Silence is not a decision. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
