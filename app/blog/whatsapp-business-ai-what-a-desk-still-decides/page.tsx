import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('whatsapp-business-ai-what-a-desk-still-decides', {
  title: "WhatsApp's built-in AI: what your desk still decides",
  description:
    "Meta's Business AI now answers WhatsApp chats for small businesses in India. Here is what a clinic, academy or real estate desk still has to decide.",
  alternates: {
    canonical: 'https://goproxe.com/blog/whatsapp-business-ai-what-a-desk-still-decides',
  },
})

const articleContent = `A clinic owner asked us last week: "WhatsApp now has its own AI. Do I still need anything else?"

It is a fair question, and the answer depends on how your enquiries actually reach you. Here is the plain version.

In May 2026, Meta launched Business AI on WhatsApp for small businesses in India. It sits inside the WhatsApp Business app. You open Tools, pick "Your Business AI", and follow the steps.

Per Meta's announcement, it can:

respond to customers around the clock
answer from your own information: products, services, pricing, discounts
work in all native Indian languages
hand the chat to you when you take over, or be switched off entirely

Business Today adds that it can capture leads and book appointments inside the chat. UPI payments in the chat are listed as coming soon, and the rollout to eligible businesses is gradual, so not everyone has it yet.

Meta also cites a 2025 Kantar study: 91% of online adults in India chat with a business on WhatsApp every week.

A first answer on WhatsApp is becoming normal. Your patient, parent or buyer will start to expect one.

So "do we reply?" stops being the question. A reply is the minimum. What counts is whether the right person on your team is in the right conversation at the right time.

That part is about how your desk works, whatever tool sits on top.

1. What is it allowed to say?

Fees, timings, doctor availability, batch dates, plot prices. Give it only what is true and current. If it guesses a number, the customer believes the number. We wrote about this in don't invent the price, and the same thinking applies to fast voice AI.

2. Which lead does a person pick up?

Ten messages come in. Two are ready to book. Someone on your team should be on those two this hour. Deciding which two is your process, not the AI's.

3. Where do the other channels go?

Business AI lives in WhatsApp. Your enquiries also come from a website form, Instagram DMs and phone calls. If each sits in a different place, one person gets asked the same questions three times. See one memory across every channel.

4. What does the handoff look like?

When you take over, do you see the whole conversation, or start from "hi, how can I help"? A good handoff carries the thread across. More in handoff without starting over and when they ask for a person.

A dental clinic gets a WhatsApp message at 8pm: "Do you do braces for adults, and what does it cost?"

The built-in AI can answer the first part from the services you gave it. The cost question is where it gets tested. If you gave it a range, it quotes the range. If you did not, it should say so and pass the chat to a person.

Then the patient writes: "Can I come Saturday morning?" Now a slot, a doctor and a front desk all matter. Whoever picks it up should see the earlier messages and not ask about braces again.

None of this is hard to fix. It just has to be decided before the message arrives, not after.

We think the trend is right. Customers should not wait for the front desk to finish a consult before getting an answer. We covered the after-hours side in after-hours WhatsApp.

PROXe puts your team on the right lead at the right moment. In practice:

WhatsApp, the website, Instagram and voice feed one thread per customer
it answers only from what you have given it, and passes the rest to a person with the full conversation attached
the founder dashboard shows who is ready to move, so your team spends its time there

If your whole enquiry flow is one WhatsApp Business number and a small team, the built-in tool may be enough to start. If leads also arrive from ads, a website and calls, and you want one view across all of them, that is the case PROXe is built for. Pricing is on the pricing page.

Message your own business at 9pm from another number. Time the reply.
Ask for your fee. Is the answer right?
Ask for a person. How long did it take, and did the person see the chat?
Send the same question through your website form. Does it land in the same place?

If two of those fail, that is your list for the month.

The first two matter most for clinics. For coaching academies, the fee and batch answers are the whole game. For real estate, it is the handoff on the ready buyer.

Want to see it on your own enquiries? Book a demo.`

export default function WhatsappBusinessAiWhatADeskStillDecidesPage() {
  const slug = 'whatsapp-business-ai-what-a-desk-still-decides'
  const pageUrl = 'https://goproxe.com/blog/whatsapp-business-ai-what-a-desk-still-decides'
  const pageTitle = "WhatsApp's built-in AI: what your desk still decides"

  const tocItems = [
    { id: 'what-meta-launched', text: 'What Meta launched' },
    { id: 'why-this-matters-to-a-clinic-academy-or-broker', text: 'Why this matters to a clinic, academy or broker' },
    { id: 'four-things-a-desk-still-decides', text: 'Four things a desk still decides' },
    { id: 'what-this-looks-like-on-a-tuesday', text: 'What this looks like on a Tuesday' },
    { id: 'what-we-are-doing-about-it-at-proxe', text: 'What we are doing about it at PROXe' },
    { id: 'a-five-minute-check-this-week', text: 'A five-minute check this week' },
  ]

  return (
    <BlogPostWrapper
      slug={slug}
      title={pageTitle}
      pageUrl={pageUrl}
      tocItems={tocItems}
      articleContent={articleContent}
      jsonLdSchemas={[]}
    >
            <section className={styles.section}>
              <p>A clinic owner asked us last week: "WhatsApp now has its own AI. Do I still need anything else?"</p>
              <p>It is a fair question, and the answer depends on how your enquiries actually reach you. Here is the plain version.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-meta-launched">What Meta launched</h2>
              <p>In May 2026, Meta launched Business AI on WhatsApp for small businesses in India. It sits inside the WhatsApp Business app. You open Tools, pick "Your Business AI", and follow the steps.</p>
              <p>Per Meta's announcement, it can:</p>
              <ul>
                <li>respond to customers around the clock</li>
                <li>answer from your own information: products, services, pricing, discounts</li>
                <li>work in all native Indian languages</li>
                <li>hand the chat to you when you take over, or be switched off entirely</li>
              </ul>
              <p>Business Today adds that it can capture leads and book appointments inside the chat. UPI payments in the chat are listed as coming soon, and the rollout to eligible businesses is gradual, so not everyone has it yet. (<a href="https://about.fb.com/news/2026/05/introducing-business-ai-on-whatsapp-for-small-businesses-in-india/" target="_blank" rel="noopener noreferrer">Meta India newsroom</a>, <a href="https://www.businesstoday.in/technology/story/whatsapp-launches-ai-powered-customer-support-for-small-businesses-in-india-upi-payments-coming-soon-530313-2026-05-07" target="_blank" rel="noopener noreferrer">Business Today</a>)</p>
              <p>Meta also cites a 2025 Kantar study: 91% of online adults in India chat with a business on WhatsApp every week.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-this-matters-to-a-clinic-academy-or-broker">Why this matters to a clinic, academy or broker</h2>
              <p>A first answer on WhatsApp is becoming normal. Your patient, parent or buyer will start to expect one.</p>
              <p>So "do we reply?" stops being the question. A reply is the minimum. What counts is whether the right person on your team is in the right conversation at the right time.</p>
              <p>That part is about how your desk works, whatever tool sits on top.</p>
            </section>

            <section className={styles.section}>
              <h2 id="four-things-a-desk-still-decides">Four things a desk still decides</h2>
              <p><strong>1. What is it allowed to say?</strong></p>
              <p>Fees, timings, doctor availability, batch dates, plot prices. Give it only what is true and current. If it guesses a number, the customer believes the number. We wrote about this in <a href="/blog/dont-invent-the-price">don't invent the price</a>, and the same thinking applies to <a href="/blog/fast-voice-ai-still-needs-the-right-answers">fast voice AI</a>.</p>
              <p><strong>2. Which lead does a person pick up?</strong></p>
              <p>Ten messages come in. Two are ready to book. Someone on your team should be on those two this hour. Deciding which two is your process, not the AI's.</p>
              <p><strong>3. Where do the other channels go?</strong></p>
              <p>Business AI lives in WhatsApp. Your enquiries also come from a website form, Instagram DMs and phone calls. If each sits in a different place, one person gets asked the same questions three times. See <a href="/blog/one-memory-every-channel">one memory across every channel</a>.</p>
              <p><strong>4. What does the handoff look like?</strong></p>
              <p>When you take over, do you see the whole conversation, or start from "hi, how can I help"? A good handoff carries the thread across. More in <a href="/blog/handoff-without-starting-over">handoff without starting over</a> and <a href="/blog/when-they-ask-for-a-person">when they ask for a person</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-this-looks-like-on-a-tuesday">What this looks like on a Tuesday</h2>
              <p>A dental clinic gets a WhatsApp message at 8pm: "Do you do braces for adults, and what does it cost?"</p>
              <p>The built-in AI can answer the first part from the services you gave it. The cost question is where it gets tested. If you gave it a range, it quotes the range. If you did not, it should say so and pass the chat to a person.</p>
              <p>Then the patient writes: "Can I come Saturday morning?" Now a slot, a doctor and a front desk all matter. Whoever picks it up should see the earlier messages and not ask about braces again.</p>
              <p>None of this is hard to fix. It just has to be decided before the message arrives, not after.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-we-are-doing-about-it-at-proxe">What we are doing about it at PROXe</h2>
              <p>We think the trend is right. Customers should not wait for the front desk to finish a consult before getting an answer. We covered the after-hours side in <a href="/blog/after-hours-whatsapp">after-hours WhatsApp</a>.</p>
              <p>PROXe puts your team on the right lead at the right moment. In practice:</p>
              <ul>
                <li>WhatsApp, the website, Instagram and voice feed one thread per customer</li>
                <li>it answers only from what you have given it, and passes the rest to a person with the full conversation attached</li>
                <li>the founder dashboard shows who is ready to move, so your team spends its time there</li>
              </ul>
              <p>If your whole enquiry flow is one WhatsApp Business number and a small team, the built-in tool may be enough to start. If leads also arrive from ads, a website and calls, and you want one view across all of them, that is the case PROXe is built for. Pricing is on the <a href="/pricing">pricing page</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="a-five-minute-check-this-week">A five-minute check this week</h2>
              <ol>
                <li>Message your own business at 9pm from another number. Time the reply.</li>
                <li>Ask for your fee. Is the answer right?</li>
                <li>Ask for a person. How long did it take, and did the person see the chat?</li>
                <li>Send the same question through your website form. Does it land in the same place?</li>
              </ol>
              <p>If two of those fail, that is your list for the month.</p>
              <p>The first two matter most for <a href="/industries/clinics">clinics</a>. For <a href="/industries/coaching">coaching academies</a>, the fee and batch answers are the whole game. For <a href="/industries/realestate">real estate</a>, it is the handoff on the ready buyer.</p>
              <p>Want to see it on your own enquiries? <a href="/demo">Book a demo</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
