import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('ai-returns-first-whatsapp-reply', {
  title: "Only 13% see AI returns. Fix the first reply",
  description:
    "Gartner found only 13% of companies see major returns from AI. For a clinic, academy or property desk, one job pays back first: the first WhatsApp reply.",
  alternates: {
    canonical: 'https://goproxe.com/blog/ai-returns-first-whatsapp-reply',
  },
})

const articleContent = `A parent messages your coaching academy on WhatsApp at 9pm. They want fees and the next batch timing.

You are home, off the clock. The message sits until morning. By then they have asked another academy, and that one answered in two minutes.

No report shows you this loss. That is the problem, and it is the cheapest one to fix.

Gartner surveyed 2,002 CIOs and other technology leaders and presented the results at its IT Symposium in Orlando. Only 13% said they see major or transformative returns from AI.

Spending is not slowing down. 75% of CEOs still plan to raise technology spend. And 44% of CEOs have trouble showing stakeholders the financial return AI produces.

Gartner's advice to the companies that do get returns is plain. Decide early which projects are worth pursuing, and shut down the ones that are not, even those already running.

Large companies buy AI as a project. A platform, a pilot, a team, a roadmap. A year later someone asks what number it moved, and nobody can say.

You do not have a year. You have a phone that buzzes while you are with a patient, on a site visit or teaching a class.

The lesson from the survey is not "avoid AI". It is "attach it to a number before you buy it".

AI ROI for a small business comes down to a job with a number. Here is one: how long a new lead waits for the first reply.

You can count it with three figures:

Leads that came in this week.

Leads that got a useful reply within five minutes.

Leads that ended up booked.

If you want to go deeper, our post on what to measure on inbound walks through the full list. Start with these three.

Most businesses have never counted the second one. When they do, it is usually lower than they expected.

Clinic. A patient asks if the doctor is free tomorrow. The reply has the open slots in the first minute, even while the doctor is in a consult. We wrote about what happens when WhatsApp arrives during a consult.

Coaching academy. The parent gets fees, batch timing and a counsellor slot at 9pm, not at 10am. The story for parents is the same every night, which we covered in coaching parents at night.

Real estate. The buyer sends "price?" while you are driving to a site. They get the project facts and a visit time before they open another portal.

None of this needs a transformation programme. It needs the first reply to happen.

A lead who gets a reply in minutes is still thinking about you. A lead who waits until tomorrow has moved on, and you will not know it happened.

That is why this one job pays back faster than a big AI project. The cost is fixed. The leads are already coming. You paid for them with ads, referrals or years of reputation. The only open question is whether they get an answer.

Our post on how fast to reply on WhatsApp covers what to aim for.

Say 60 leads came in this week. If 20 got a reply within five minutes and 8 of those booked, you have a baseline. Those figures are an example, not a benchmark. Use your own.

Now look at the other 40. Most of them waited hours. Ask how many of them you would have booked with a reply in the first five minutes. You do not need an exact answer. Even a rough one tells you whether this job is worth fixing before you spend on anything else.

Run the count again in two weeks. If the second number moved, the spend paid back. If it did not, shut it down, which is exactly what Gartner says the winners do.

PROXe is the desk that answers when you cannot.

It listens on WhatsApp, Instagram, your website, email, SMS and voice. It answers in your voice, asks the two or three questions that matter, books the call and follows up so nothing goes cold. You see every conversation in one founder dashboard.

It does not invent a fee or promise something you did not tell it. If it does not know, it says a person will call, and passes the whole chat to your team.

It is one job, done every time. That is a return you can count.

Take a second phone. At 9pm, message your own business number: "What are your timings and fees?"

Write down the time. Then write down how long a useful reply took, and whether it was correct.

If the answer is "tomorrow morning", that is your number. It is also what the next customer gets.

If you would rather see it on your own questions, book a demo at goproxe.com. We will set it up with your fees, timings and slots on the call, so you can time the reply yourself.

Source: The Decoder on the Gartner survey.`

export default function AiReturnsFirstWhatsappReplyPage() {
  const slug = 'ai-returns-first-whatsapp-reply'
  const pageUrl = 'https://goproxe.com/blog/ai-returns-first-whatsapp-reply'
  const pageTitle = "Only 13% see AI returns. Fix the first reply"

  const tocItems = [
    { id: "what-gartner-just-found", text: "What Gartner just found" },
    { id: "why-most-ai-spend-does-not-pay-back", text: "Why most AI spend does not pay back" },
    { id: "pick-one-job-with-a-number-on-it", text: "Pick one job with a number on it" },
    { id: "what-it-looks-like-at-a-real-desk", text: "What it looks like at a real desk" },
    { id: "why-speed-is-the-return", text: "Why speed is the return" },
    { id: "a-simple-way-to-read-your-numbers", text: "A simple way to read your numbers" },
    { id: "where-proxe-fits", text: "Where PROXe fits" },
    { id: "try-this-tonight", text: "Try this tonight" },
    { id: "book-a-demo", text: "Book a demo" },
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
              <p>A parent messages your coaching academy on WhatsApp at 9pm. They want fees and the next batch timing.</p>
              <p>You are home, off the clock. The message sits until morning. By then they have asked another academy, and that one answered in two minutes.</p>
              <p>No report shows you this loss. That is the problem, and it is the cheapest one to fix.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-gartner-just-found">What Gartner just found</h2>
              <p>Gartner surveyed 2,002 CIOs and other technology leaders and presented the results at its IT Symposium in Orlando. <a href="https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/" target="_blank" rel="noopener noreferrer">Only 13% said they see major or transformative returns from AI</a>.</p>
              <p>Spending is not slowing down. 75% of CEOs still plan to raise technology spend. And 44% of CEOs have trouble showing stakeholders the financial return AI produces.</p>
              <p>Gartner's advice to the companies that do get returns is plain. Decide early which projects are worth pursuing, and shut down the ones that are not, even those already running.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-most-ai-spend-does-not-pay-back">Why most AI spend does not pay back</h2>
              <p>Large companies buy AI as a project. A platform, a pilot, a team, a roadmap. A year later someone asks what number it moved, and nobody can say.</p>
              <p>You do not have a year. You have a phone that buzzes while you are with a patient, on a site visit or teaching a class.</p>
              <p>The lesson from the survey is not "avoid AI". It is "attach it to a number before you buy it".</p>
            </section>

            <section className={styles.section}>
              <h2 id="pick-one-job-with-a-number-on-it">Pick one job with a number on it</h2>
              <p>AI ROI for a small business comes down to a job with a number. Here is one: how long a new lead waits for the first reply.</p>
              <p>You can count it with three figures:</p>
              <ol><li>Leads that came in this week.</li><li>Leads that got a useful reply within five minutes.</li><li>Leads that ended up booked.</li></ol>
              <p>If you want to go deeper, our post on <a href="/blog/what-to-measure-on-inbound">what to measure on inbound</a> walks through the full list. Start with these three.</p>
              <p>Most businesses have never counted the second one. When they do, it is usually lower than they expected.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-it-looks-like-at-a-real-desk">What it looks like at a real desk</h2>
              <p><strong>Clinic.</strong> A patient asks if the doctor is free tomorrow. The reply has the open slots in the first minute, even while the doctor is in a consult. We wrote about <a href="/blog/clinics-whatsapp-during-consult">what happens when WhatsApp arrives during a consult</a>.</p>
              <p><strong>Coaching academy.</strong> The parent gets fees, batch timing and a counsellor slot at 9pm, not at 10am. The story for parents is the same every night, which we covered in <a href="/blog/coaching-parents-at-night">coaching parents at night</a>.</p>
              <p><strong>Real estate.</strong> The buyer sends "price?" while you are driving to a site. They get the project facts and a visit time before they open another portal.</p>
              <p>None of this needs a transformation programme. It needs the first reply to happen.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-speed-is-the-return">Why speed is the return</h2>
              <p>A lead who gets a reply in minutes is still thinking about you. A lead who waits until tomorrow has moved on, and you will not know it happened.</p>
              <p>That is why this one job pays back faster than a big AI project. The cost is fixed. The leads are already coming. You paid for them with ads, referrals or years of reputation. The only open question is whether they get an answer.</p>
              <p>Our post on <a href="/blog/how-fast-to-reply-whatsapp">how fast to reply on WhatsApp</a> covers what to aim for.</p>
            </section>

            <section className={styles.section}>
              <h2 id="a-simple-way-to-read-your-numbers">A simple way to read your numbers</h2>
              <p>Say 60 leads came in this week. If 20 got a reply within five minutes and 8 of those booked, you have a baseline. Those figures are an example, not a benchmark. Use your own.</p>
              <p>Now look at the other 40. Most of them waited hours. Ask how many of them you would have booked with a reply in the first five minutes. You do not need an exact answer. Even a rough one tells you whether this job is worth fixing before you spend on anything else.</p>
              <p>Run the count again in two weeks. If the second number moved, the spend paid back. If it did not, shut it down, which is exactly what Gartner says the winners do.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>PROXe is the desk that answers when you cannot.</p>
              <p>It listens on WhatsApp, Instagram, your website, email, SMS and voice. It answers in your voice, asks the two or three questions that matter, books the call and follows up so nothing goes cold. You see every conversation in one founder dashboard.</p>
              <p>It does not invent a fee or promise something you did not tell it. If it does not know, it says a person will call, and passes the whole chat to your team.</p>
              <p>It is one job, done every time. That is a return you can count.</p>
            </section>

            <section className={styles.section}>
              <h2 id="try-this-tonight">Try this tonight</h2>
              <p>Take a second phone. At 9pm, message your own business number: "What are your timings and fees?"</p>
              <p>Write down the time. Then write down how long a useful reply took, and whether it was correct.</p>
              <p>If the answer is "tomorrow morning", that is your number. It is also what the next customer gets.</p>
            </section>

            <section className={styles.section}>
              <h2 id="book-a-demo">Book a demo</h2>
              <p>If you would rather see it on your own questions, <a href="/demo">book a demo at goproxe.com</a>. We will set it up with your fees, timings and slots on the call, so you can time the reply yourself.</p>
              <p><em>Source: <a href="https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/" target="_blank" rel="noopener noreferrer">The Decoder on the Gartner survey</a>.</em></p>
            </section>
    </BlogPostWrapper>
  )
}
