import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('when-an-ai-assistant-calls-your-business', {
  title: "Gemini can call businesses to book. What will it find?",
  description:
    "Google's Gemini can phone businesses to book appointments for users. A plain checklist for clinics and service businesses on what that call should find.",
  alternates: {
    canonical: 'https://goproxe.com/blog/when-an-ai-assistant-calls-your-business',
  },
})

const articleContent = `A patient rings your clinic at 1 pm. The front desk is with someone at the counter, so the phone rings out. She tries the next clinic on her list and books there.

You see one missed call and never learn what she wanted. A missed call is still a lead and this is how it usually goes.

Now add a new kind of caller. Here is a question worth asking before it comes up: what happens when a customer's AI assistant phones you?

What was reported

TechCrunch's write-up of the Pixel 11 launch in August says Gemini can call businesses on a user's behalf to book table reservations or appointments. It also says users can take over or stop a task at any point, and review transcripts of AI-operated calls afterwards. The same report names Angi, Thumbtack and Zocdoc as connected apps arriving over the following weeks. Daring Fireball's note repeats the same points.

What we do not know

Be careful with this one.

- It is a launch report. We have not seen Google's own documentation on how the calling works.
- Zocdoc, Thumbtack and Angi are mostly US services. We could not confirm when, or whether, this works for Indian clinics or in Indian languages.
- Nobody has published numbers on how many such calls businesses receive.

So this is not a reason to panic. It is a reason to check something you should have checked anyway.

The real question for an owner

Whether the caller is a person or an assistant, it asks the same things. Are you open Thursday? Is there a slot after 5? What is the fee? Where do I park?

An assistant just asks politely and writes the answer down. If your answer changes depending on who picks up, it writes down the wrong one. A person who got the wrong fee on the phone would also go somewhere else.

This also fits what we saw in fewer Google clicks, every enquiry counts more: the people who reach you are closer to a decision, and they want an answer, not a form.

Five things to check this week

1. Call your own number. Ring it from another phone at lunchtime and at 7 pm. Who answers, how long does it take, what do they say? If it rings out, you are losing the same lead as the patient above.
2. Write the five facts on one page. Hours, fee range, how booking works, location, what to bring. Everyone who answers should say the same thing. Do not invent the price when you do not know it. Say a person will confirm.
3. Make slots real. If you say "Thursday 5 pm is free", it should be free. A diary on one desk and a second list on WhatsApp will disagree.
4. Decide what a person must handle. Fee negotiations, complaints, anything medical or legal. Everything else can be answered from the page you wrote in step 2.
5. Keep one record. After the call, the booking and the notes should land where the whole team can see them, not in one person's phone. That is the point of one memory across every channel.

Treat an AI caller like any caller

Answer plainly, confirm the booking, note it. If you answer calls with an AI yourself, say so. We wrote about whether your AI caller should say it is an AI.

A small example

Say a dental clinic gets 40 calls a week and misses 8 while the front desk is with patients. If some of the callers are assistants booking for a customer, a missed call is a booking that quietly goes to the next clinic on the list. These numbers are made up to show the maths. Count your own missed calls for one week.

Where PROXe fits

The trend is voice getting good enough for real calls. We covered the other side of it in fast voice AI still needs the right answers: speed is no longer the problem, what the voice is allowed to say is.

PROXe has a voice agent that answers from the details you give it: hours, fee range, slots. It keeps the call in the same thread as that person's WhatsApp and website chats. When something needs a person, your team member sees the whole conversation and does not start over.

So your front desk spends its time on the right lead at the right moment, not on picking up every ring.

It works the same for clinics, coaching academies, real estate and other service businesses with a steady flow of enquiries. Voice minutes are part of the plan; details are on the pricing page.

The takeaway

Whoever calls, a customer or their assistant, the answer should be the same, and a person should be ready when it matters.

If you want to see how a call and a WhatsApp chat look in one thread, book a demo.`

export default function WhenAnAiAssistantCallsYourBusinessPage() {
  const slug = 'when-an-ai-assistant-calls-your-business'
  const pageUrl = 'https://goproxe.com/blog/when-an-ai-assistant-calls-your-business'
  const pageTitle = "Gemini can call businesses to book. What will it find?"

  const tocItems = [
    { id: 'what-was-reported', text: "What was reported" },
    { id: 'what-we-do-not-know', text: "What we do not know" },
    { id: 'the-real-question-for-an-owner', text: "The real question for an owner" },
    { id: 'five-things-to-check-this-week', text: "Five things to check this week" },
    { id: 'treat-an-ai-caller-like-any-caller', text: "Treat an AI caller like any caller" },
    { id: 'a-small-example', text: "A small example" },
    { id: 'where-proxe-fits', text: "Where PROXe fits" },
    { id: 'the-takeaway', text: "The takeaway" },
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
              <p>A patient rings your clinic at 1 pm. The front desk is with someone at the counter, so the phone rings out. She tries the next clinic on her list and books there.</p>
              <p>You see one missed call and never learn what she wanted. <a href="/blog/a-missed-call-is-still-a-lead">A missed call is still a lead</a> and this is how it usually goes.</p>
              <p>Now add a new kind of caller. Here is a question worth asking before it comes up: what happens when a customer&#39;s AI assistant phones you?</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-was-reported">What was reported</h2>
              <p><a href="https://techcrunch.com/2026/08/12/pixel-11-has-few-hardware-changes-and-more-gemini/" target="_blank" rel="noopener noreferrer">TechCrunch&#39;s write-up of the Pixel 11 launch</a> in August says Gemini can call businesses on a user&#39;s behalf to book table reservations or appointments. It also says users can take over or stop a task at any point, and review transcripts of AI-operated calls afterwards. The same report names Angi, Thumbtack and Zocdoc as connected apps arriving over the following weeks. <a href="https://daringfireball.net/linked/2026/08/12/techcrunch-pixel-11-lineup" target="_blank" rel="noopener noreferrer">Daring Fireball&#39;s note</a> repeats the same points.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-we-do-not-know">What we do not know</h2>
              <p>Be careful with this one.</p>
              <ul>
                <li>It is a launch report. We have not seen Google&#39;s own documentation on how the calling works.</li>
                <li>Zocdoc, Thumbtack and Angi are mostly US services. We could not confirm when, or whether, this works for Indian clinics or in Indian languages.</li>
                <li>Nobody has published numbers on how many such calls businesses receive.</li>
              </ul>
              <p>So this is not a reason to panic. It is a reason to check something you should have checked anyway.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-real-question-for-an-owner">The real question for an owner</h2>
              <p>Whether the caller is a person or an assistant, it asks the same things. Are you open Thursday? Is there a slot after 5? What is the fee? Where do I park?</p>
              <p>An assistant just asks politely and writes the answer down. If your answer changes depending on who picks up, it writes down the wrong one. A person who got the wrong fee on the phone would also go somewhere else.</p>
              <p>This also fits what we saw in <a href="/blog/fewer-google-clicks-every-enquiry-counts">fewer Google clicks, every enquiry counts more</a>: the people who reach you are closer to a decision, and they want an answer, not a form.</p>
            </section>

            <section className={styles.section}>
              <h2 id="five-things-to-check-this-week">Five things to check this week</h2>
              <ol>
                <li><strong>Call your own number.</strong> Ring it from another phone at lunchtime and at 7 pm. Who answers, how long does it take, what do they say? If it rings out, you are losing the same lead as the patient above.</li>
                <li><strong>Write the five facts on one page.</strong> Hours, fee range, how booking works, location, what to bring. Everyone who answers should say the same thing. <a href="/blog/dont-invent-the-price">Do not invent the price</a> when you do not know it. Say a person will confirm.</li>
                <li><strong>Make slots real.</strong> If you say &quot;Thursday 5 pm is free&quot;, it should be free. A diary on one desk and a second list on WhatsApp will disagree.</li>
                <li><strong>Decide what a person must handle.</strong> Fee negotiations, complaints, anything medical or legal. Everything else can be answered from the page you wrote in step 2.</li>
                <li><strong>Keep one record.</strong> After the call, the booking and the notes should land where the whole team can see them, not in one person&#39;s phone. That is the point of <a href="/blog/one-memory-every-channel">one memory across every channel</a>.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h2 id="treat-an-ai-caller-like-any-caller">Treat an AI caller like any caller</h2>
              <p>Answer plainly, confirm the booking, note it. If you answer calls with an AI yourself, say so. We wrote about <a href="/blog/should-your-ai-caller-say-its-an-ai">whether your AI caller should say it is an AI</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="a-small-example">A small example</h2>
              <p>Say a dental clinic gets 40 calls a week and misses 8 while the front desk is with patients. If some of the callers are assistants booking for a customer, a missed call is a booking that quietly goes to the next clinic on the list. These numbers are made up to show the maths. Count your own missed calls for one week.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>The trend is voice getting good enough for real calls. We covered the other side of it in <a href="/blog/fast-voice-ai-still-needs-the-right-answers">fast voice AI still needs the right answers</a>: speed is no longer the problem, what the voice is allowed to say is.</p>
              <p>PROXe has a voice agent that answers from the details you give it: hours, fee range, slots. It keeps the call in the same thread as that person&#39;s WhatsApp and website chats. When something needs a person, your team member <a href="/blog/handoff-without-starting-over">sees the whole conversation and does not start over</a>.</p>
              <p>So your front desk spends its time on the right lead at the right moment, not on picking up every ring.</p>
              <p>It works the same for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching academies</a>, <a href="/industries/realestate">real estate</a> and other service businesses with a steady flow of enquiries. Voice minutes are part of the plan; details are on the <a href="/pricing">pricing page</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-takeaway">The takeaway</h2>
              <p>Whoever calls, a customer or their assistant, the answer should be the same, and a person should be ready when it matters.</p>
              <p>If you want to see how a call and a WhatsApp chat look in one thread, <a href="/demo">book a demo</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
