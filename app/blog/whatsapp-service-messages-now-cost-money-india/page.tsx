import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('whatsapp-service-messages-now-cost-money-india', {
  title: 'WhatsApp now charges for replies in India. What to do?',
  description:
    'From 1 October 2026, free-form WhatsApp replies on the Business Platform in India are billed after 1,000 a month. A plain checklist for owners.',
  alternates: {
    canonical: 'https://goproxe.com/blog/whatsapp-service-messages-now-cost-money-india',
  },
})

const articleContent = `Owners of clinics, academies and service businesses are asking the same thing right now: "WhatsApp replies used to be free. Now my provider is sending a bill. Do I stop replying so much?"

No. But it is worth knowing what changed, and which habits quietly cost money now.

## What changed

From 1 October 2026, according to Indian press and WhatsApp provider write-ups, Meta started charging for service messages on the WhatsApp Business Platform in India. A service message is a free-form reply you send inside the 24 hour window after a customer writes to you.

What these reports agree on:

- the charge is about ₹0.115 per delivered message (one provider lists a different figure, so check the rate on your own invoice)
- each business phone number gets 1,000 free service messages a month, and unused ones do not carry over
- utility templates sent inside that window are billed too (one report is unclear on this, so check your invoice)

What we could not confirm: we read press and vendor posts, not Meta's own rate card, and they do not always agree. Open Meta's pricing page or ask your provider for the current rate before you plan around any number here.

Who this affects: businesses whose WhatsApp runs through the Business Platform (the API, usually via a provider or an automation tool). The press reports say the regular WhatsApp Business app on a phone is not covered. If you are not sure which one you use, ask whoever set it up.

## What it means in rupees

Take a clinic with 6,000 service messages in a month. 1,000 are free, 5,000 are billed: 5,000 x ₹0.115 = ₹575, before any tax. These are illustrative numbers, not a client's. It is small. The point is not the bill, it is the habit behind it.

A reply that answers the question in one go costs one message. A reply that needs four follow-ups to get the date, the branch, the fee and the time costs five. The same message count is also the number of times your customer waited.

## Five things to do this week

1. **Find out which kind of WhatsApp you have.** App on a phone, or API through a provider. Only the second is billed this way.
2. **Read your last invoice.** How many service messages, and how many were free? Most owners have never looked.
3. **Write the five facts once.** Hours, fee range, how booking works, location, what to bring. A reply that carries all five in one message beats five short replies. See [don't invent the price](/blog/dont-invent-the-price) for what to do when you do not know a fee.
4. **Stop auto-replies that start loops.** A "thanks!" that triggers an automatic "you're welcome!" now costs money and adds nothing.
5. **Do not cut off the people who are ready.** The cheapest message is not the best one. If a customer is asking about a slot, a person should be in that chat. Rationing replies to save ₹0.115 loses the lead.

## Reminders and broadcasts are different

Reminders and broadcasts are template messages with their own pricing, set by category. We wrote about why [a reminder is not a reply](/blog/a-reminder-is-not-a-reply) and [a broadcast is not a reply](/blog/a-broadcast-is-not-a-reply). What changed in October is the free-form reply, the one thing most owners assumed would always be free.

## A reply is not the same as a conversation

Think about what your day looks like with a full inbox. Fifty chats open, most of them "what is the fee?" or "where are you?", and two or three people who want a slot this week. The cost per message is the same for all of them. The value is not.

That is the real lesson of the new charge. It nudges you to look at where your team's time goes, not just where the rupees go. A clean answer for the simple questions, and a person for the ready ones.

## The number that matters more

Cost per message is easy to count. What is harder: of all the chats you answered, which ones were people ready to book, and did your team get to them? We covered what to track in [what to measure on inbound](/blog/what-to-measure-on-inbound). If you spend the same effort on every chat, you pay the same for the browsers and the buyers.

If you are also weighing Meta's own AI on WhatsApp, read [what your desk still decides](/blog/whatsapp-business-ai-what-a-desk-still-decides).

## Where PROXe fits

We will not guess at your provider's bill, and we are not saying PROXe makes WhatsApp cheaper. What we can speak to is where the effort goes.

- A customer is one thread, whether they wrote on WhatsApp, Instagram or your website, so your team does not ask the same question twice. See [one memory, every channel](/blog/one-memory-every-channel).
- Answers come from your brand details, one source your team also reads, so the reply matches what your team would say.
- When someone is ready to book or needs a person, the handover carries the whole conversation. See [handoff without starting over](/blog/handoff-without-starting-over).

The idea stays the same: your team on the right lead at the right moment. See the [clinics page](/industries/clinics), the [pricing page](/pricing), or [book a demo](/demo) and bring last month's invoice.

## Questions people ask

**Are WhatsApp replies still free in India?**

On the WhatsApp Business Platform, press and provider reports say free-form replies are billed from 1 October 2026 after 1,000 free service messages per business number each month. Check your own invoice for the exact rate.

**Does this apply to the WhatsApp Business app on my phone?**

The press reports say the regular WhatsApp Business app is not covered. It applies to businesses on the Business Platform (the API), usually through a provider.

**Should I reply less to save money?**

No. Write replies that answer in one go, stop automatic loops, and make sure a person reaches the customers who are ready to book.

**Today's step:** find your last WhatsApp invoice and write down two numbers: how many service messages you sent, and how many of those chats became a booking.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Are WhatsApp replies still free in India?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `On the WhatsApp Business Platform, press and provider reports say free-form replies are billed from 1 October 2026 after 1,000 free service messages per business number each month. Check your own invoice for the exact rate.`,
      },
    },
    {
      '@type': 'Question',
      name: `Does this apply to the WhatsApp Business app on my phone?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `The press reports say the regular WhatsApp Business app is not covered. It applies to businesses on the Business Platform (the API), usually through a provider.`,
      },
    },
    {
      '@type': 'Question',
      name: `Should I reply less to save money?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No. Write replies that answer in one go, stop automatic loops, and make sure a person reaches the customers who are ready to book.`,
      },
    },
  ],
}

export default function WhatsappServiceMessagesNowCostMoneyIndiaPage() {
  const slug = 'whatsapp-service-messages-now-cost-money-india'
  const pageUrl = 'https://goproxe.com/blog/whatsapp-service-messages-now-cost-money-india'
  const pageTitle = 'WhatsApp now charges for replies in India. What to do?'

  const tocItems = [
    { id: 'what-changed', text: 'What changed' },
    { id: 'what-it-means-in-rupees', text: 'What it means in rupees' },
    { id: 'five-things-to-do-this-week', text: 'Five things to do this week' },
    { id: 'reminders-and-broadcasts-are-different', text: 'Reminders and broadcasts are different' },
    { id: 'a-reply-is-not-the-same-as-a-conversation', text: 'A reply is not the same as a conversation' },
    { id: 'the-number-that-matters-more', text: 'The number that matters more' },
    { id: 'where-proxe-fits', text: 'Where PROXe fits' },
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
              <p>Owners of clinics, academies and service businesses are asking the same thing right now: &quot;WhatsApp replies used to be free. Now my provider is sending a bill. Do I stop replying so much?&quot;</p>
              <p>No. But it is worth knowing what changed, and which habits quietly cost money now.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-changed">What changed</h2>
              <p>From 1 October 2026, according to Indian press and WhatsApp provider write-ups, Meta started charging for service messages on the WhatsApp Business Platform in India. A service message is a free-form reply you send inside the 24 hour window after a customer writes to you.</p>
              <p>What these reports agree on:</p>
              <ul>
                <li>the charge is about ₹0.115 per delivered message (one provider lists a different figure, so check the rate on your own invoice)</li>
                <li>each business phone number gets 1,000 free service messages a month, and unused ones do not carry over</li>
                <li>utility templates sent inside that window are billed too (one report is unclear on this, so check your invoice)</li>
              </ul>
              <p>What we could not confirm: we read press and vendor posts, not Meta&apos;s own rate card, and they do not always agree. Open Meta&apos;s pricing page or ask your provider for the current rate before you plan around any number here.</p>
              <p>Who this affects: businesses whose WhatsApp runs through the Business Platform (the API, usually via a provider or an automation tool). The press reports say the regular WhatsApp Business app on a phone is not covered. If you are not sure which one you use, ask whoever set it up.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-means-in-rupees">What it means in rupees</h2>
              <p>Take a clinic with 6,000 service messages in a month. 1,000 are free, 5,000 are billed: 5,000 x ₹0.115 = ₹575, before any tax. These are illustrative numbers, not a client&apos;s. It is small. The point is not the bill, it is the habit behind it.</p>
              <p>A reply that answers the question in one go costs one message. A reply that needs four follow-ups to get the date, the branch, the fee and the time costs five. The same message count is also the number of times your customer waited.</p>
            </section>

            <section className={styles.section}>
              <h2 id="five-things-to-do-this-week">Five things to do this week</h2>
              <ol>
                <li><strong>Find out which kind of WhatsApp you have.</strong> App on a phone, or API through a provider. Only the second is billed this way.</li>
                <li><strong>Read your last invoice.</strong> How many service messages, and how many were free? Most owners have never looked.</li>
                <li><strong>Write the five facts once.</strong> Hours, fee range, how booking works, location, what to bring. A reply that carries all five in one message beats five short replies. See <a href="/blog/dont-invent-the-price">don&apos;t invent the price</a> for what to do when you do not know a fee.</li>
                <li><strong>Stop auto-replies that start loops.</strong> A &quot;thanks!&quot; that triggers an automatic &quot;you&apos;re welcome!&quot; now costs money and adds nothing.</li>
                <li><strong>Do not cut off the people who are ready.</strong> The cheapest message is not the best one. If a customer is asking about a slot, a person should be in that chat. Rationing replies to save ₹0.115 loses the lead.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h2 id="reminders-and-broadcasts-are-different">Reminders and broadcasts are different</h2>
              <p>Reminders and broadcasts are template messages with their own pricing, set by category. We wrote about why <a href="/blog/a-reminder-is-not-a-reply">a reminder is not a reply</a> and <a href="/blog/a-broadcast-is-not-a-reply">a broadcast is not a reply</a>. What changed in October is the free-form reply, the one thing most owners assumed would always be free.</p>
            </section>

            <section className={styles.section}>
              <h2 id="a-reply-is-not-the-same-as-a-conversation">A reply is not the same as a conversation</h2>
              <p>Think about what your day looks like with a full inbox. Fifty chats open, most of them &quot;what is the fee?&quot; or &quot;where are you?&quot;, and two or three people who want a slot this week. The cost per message is the same for all of them. The value is not.</p>
              <p>That is the real lesson of the new charge. It nudges you to look at where your team&apos;s time goes, not just where the rupees go. A clean answer for the simple questions, and a person for the ready ones.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-number-that-matters-more">The number that matters more</h2>
              <p>Cost per message is easy to count. What is harder: of all the chats you answered, which ones were people ready to book, and did your team get to them? We covered what to track in <a href="/blog/what-to-measure-on-inbound">what to measure on inbound</a>. If you spend the same effort on every chat, you pay the same for the browsers and the buyers.</p>
              <p>If you are also weighing Meta&apos;s own AI on WhatsApp, read <a href="/blog/whatsapp-business-ai-what-a-desk-still-decides">what your desk still decides</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>We will not guess at your provider&apos;s bill, and we are not saying PROXe makes WhatsApp cheaper. What we can speak to is where the effort goes.</p>
              <ul>
                <li>A customer is one thread, whether they wrote on WhatsApp, Instagram or your website, so your team does not ask the same question twice. See <a href="/blog/one-memory-every-channel">one memory, every channel</a>.</li>
                <li>Answers come from your brand details, one source your team also reads, so the reply matches what your team would say.</li>
                <li>When someone is ready to book or needs a person, the handover carries the whole conversation. See <a href="/blog/handoff-without-starting-over">handoff without starting over</a>.</li>
              </ul>
              <p>The idea stays the same: your team on the right lead at the right moment. See the <a href="/industries/clinics">clinics page</a>, the <a href="/pricing">pricing page</a>, or <a href="/demo">book a demo</a> and bring last month&apos;s invoice.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Are WhatsApp replies still free in India?</strong></p>
              <p>On the WhatsApp Business Platform, press and provider reports say free-form replies are billed from 1 October 2026 after 1,000 free service messages per business number each month. Check your own invoice for the exact rate.</p>
              <p><strong>Does this apply to the WhatsApp Business app on my phone?</strong></p>
              <p>The press reports say the regular WhatsApp Business app is not covered. It applies to businesses on the Business Platform (the API), usually through a provider.</p>
              <p><strong>Should I reply less to save money?</strong></p>
              <p>No. Write replies that answer in one go, stop automatic loops, and make sure a person reaches the customers who are ready to book.</p>
            </section>

            <section className={styles.section}>
              <p><strong>Today&apos;s step:</strong> find your last WhatsApp invoice and write down two numbers: how many service messages you sent, and how many of those chats became a booking.</p>
            </section>
    </BlogPostWrapper>
  )
}
