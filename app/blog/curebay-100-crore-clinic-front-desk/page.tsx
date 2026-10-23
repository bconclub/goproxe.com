import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('curebay-100-crore-clinic-front-desk', {
  title: "CureBay raised ₹100 Cr. Is your front desk ready?",
  description:
    "CureBay raised ₹100 crore to grow rural clinics and add AI screening. Here is what a small clinic can fix first: the reply to the first message.",
  alternates: {
    canonical: 'https://goproxe.com/blog/curebay-100-crore-clinic-front-desk',
  },
})

const articleContent = `A patient messages your clinic on WhatsApp at 8:40pm. They want to know if the doctor is free tomorrow morning.

Nobody sees it until 10am. By then they have booked the clinic that answered.

You did not lose them to a bigger hospital. You lost them to a slower reply.

On 22 October 2026, rural healthcare company CureBay raised about ₹100 crore in a Pre-Series C round. IvyCap Ventures led the equity. Trifecta Capital, Alteria Capital and VentureSoul Partners put in debt.

It runs more than 250 clinics across seven states. The money goes into entering new markets such as Andhra Pradesh, and into its technology, including AI for patient screening.

That last part is the one to notice. A company with 250 clinics is spending on the first step of the patient journey: the screening and the first answer. Not the building. Not the ad.

A clinic lead is different from a shop lead. The patient is worried, or in pain, or has a child at home with a fever. They do not browse. They message two or three places and go with whoever responds.

Your front desk is also doing five other things. Checking in a patient. Taking a payment. Finding a file. Answering the landline.

The message waits. We wrote about what happens when WhatsApp arrives during a consult, and it is the same story every time.

CureBay is building a screening layer on top of clinical data. That is a big project and it fits a big network.

A single clinic or a small group needs something much smaller. Four things, in this order:

A reply in minutes. Not hours. Our post on how fast to reply on WhatsApp covers what to aim for.

Your real answers. Doctor days, consult fees, timings, what to bring. If the system guesses, patients get wrong information, and that is worse than a slow reply.

A clear handoff. When it does not know, it should say "a person from the clinic will call you today" and pass the full chat to your team.

One thread. The same patient calls, messages and fills your form. If those sit in three places, nobody sees the whole picture. A missed call is still a lead, and it should land in the same place as the WhatsApp message.

Most clinic enquiries come when the desk is closed. Evenings, Sundays, lunch break. After hours on WhatsApp is where the quiet losses happen, because nothing shows up in a report. A lead who never got a reply does not appear anywhere.

You can see it only if you look for it. That is the exercise at the end of this post.

Short. It says who is replying and what happens next.

"Hi, this is Dr. Rao's clinic. Dr. Rao sees patients tomorrow from 10 to 1. Want me to hold the 10:30 slot? Reply with the patient's name and age."

That is one message. It answers the question, offers a time, and asks for the two facts you need to book. The patient does not need to call, wait or repeat anything.

Compare it with "We will get back to you." The patient reads that as a no.

PROXe is the front desk that works when yours cannot.

It answers on WhatsApp, Instagram, your website, email and voice. It asks the two or three things a clinic needs, offers a slot, and books it. If the question is outside what you have told it, it hands the whole conversation to your team, so the patient is not asked the same thing again.

PROXe Core is ₹9,999 a month + GST. It includes 1,000 leads, 250 voice minutes, every channel and 2 seats, with a 7-day trial. You can read more on the PROXe home page.

It does not diagnose and it does not replace your doctor. It handles the front desk part: the first reply, the questions, the booking, the follow-up.

Take a second phone. At 8:30pm, send your clinic's WhatsApp number this message: "Is the doctor available tomorrow morning?"

Write down the time. Check how long the reply takes, and whether it is correct.

Then call your own number at 8:40pm and see who picks up.

If it takes more than ten minutes, that is what your next patient gets.

If you would rather see it on your own clinic's questions, book a demo at goproxe.com and we will set it up with your fees, timings and doctor days on the call.

Source: CIOL, 22 Oct 2026.`

export default function Curebay100CroreClinicFrontDeskPage() {
  const slug = 'curebay-100-crore-clinic-front-desk'
  const pageUrl = 'https://goproxe.com/blog/curebay-100-crore-clinic-front-desk'
  const pageTitle = "CureBay raised ₹100 Cr. Is your front desk ready?"

  const tocItems = [
    { id: "what-curebay-just-did", text: "What CureBay just did" },
    { id: "why-the-first-answer-matters-most", text: "Why the first answer matters most" },
    { id: "you-do-not-need-250-clinics-to-fix-this", text: "You do not need 250 clinics to fix this" },
    { id: "the-after-hours-gap", text: "The after-hours gap" },
    { id: "what-a-good-first-reply-looks-like", text: "What a good first reply looks like" },
    { id: "where-proxe-fits", text: "Where PROXe fits" },
    { id: "do-this-tonight", text: "Do this tonight" },
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
              <p>A patient messages your clinic on WhatsApp at 8:40pm. They want to know if the doctor is free tomorrow morning.</p>
              <p>Nobody sees it until 10am. By then they have booked the clinic that answered.</p>
              <p>You did not lose them to a bigger hospital. You lost them to a slower reply.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-curebay-just-did">What CureBay just did</h2>
              <p>On 22 October 2026, rural healthcare company CureBay <a href="https://www.ciol.com/funding-acquistion-merger/curebay-raises-100-crore-expand-rural-healthcare-ai-12716944" target="_blank" rel="noopener noreferrer">raised about ₹100 crore in a Pre-Series C round</a>. IvyCap Ventures led the equity. Trifecta Capital, Alteria Capital and VentureSoul Partners put in debt.</p>
              <p>It runs more than 250 clinics across seven states. The money goes into entering new markets such as Andhra Pradesh, and into its technology, including AI for patient screening.</p>
              <p>That last part is the one to notice. A company with 250 clinics is spending on the first step of the patient journey: the screening and the first answer. Not the building. Not the ad.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-the-first-answer-matters-most">Why the first answer matters most</h2>
              <p>A clinic lead is different from a shop lead. The patient is worried, or in pain, or has a child at home with a fever. They do not browse. They message two or three places and go with whoever responds.</p>
              <p>Your front desk is also doing five other things. Checking in a patient. Taking a payment. Finding a file. Answering the landline.</p>
              <p>The message waits. We wrote about <a href="/blog/clinics-whatsapp-during-consult">what happens when WhatsApp arrives during a consult</a>, and it is the same story every time.</p>
            </section>

            <section className={styles.section}>
              <h2 id="you-do-not-need-250-clinics-to-fix-this">You do not need 250 clinics to fix this</h2>
              <p>CureBay is building a screening layer on top of clinical data. That is a big project and it fits a big network.</p>
              <p>A single clinic or a small group needs something much smaller. Four things, in this order:</p>
              <ol><li><strong>A reply in minutes.</strong> Not hours. Our post on <a href="/blog/how-fast-to-reply-whatsapp">how fast to reply on WhatsApp</a> covers what to aim for.</li><li><strong>Your real answers.</strong> Doctor days, consult fees, timings, what to bring. If the system guesses, patients get wrong information, and that is worse than a slow reply.</li><li><strong>A clear handoff.</strong> When it does not know, it should say "a person from the clinic will call you today" and pass the full chat to your team.</li><li><strong>One thread.</strong> The same patient calls, messages and fills your form. If those sit in three places, nobody sees the whole picture. A <a href="/blog/a-missed-call-is-still-a-lead">missed call is still a lead</a>, and it should land in the same place as the WhatsApp message.</li></ol>
            </section>

            <section className={styles.section}>
              <h2 id="the-after-hours-gap">The after-hours gap</h2>
              <p>Most clinic enquiries come when the desk is closed. Evenings, Sundays, lunch break. <a href="/blog/after-hours-whatsapp">After hours on WhatsApp</a> is where the quiet losses happen, because nothing shows up in a report. A lead who never got a reply does not appear anywhere.</p>
              <p>You can see it only if you look for it. That is the exercise at the end of this post.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-a-good-first-reply-looks-like">What a good first reply looks like</h2>
              <p>Short. It says who is replying and what happens next.</p>
              <p>"Hi, this is Dr. Rao's clinic. Dr. Rao sees patients tomorrow from 10 to 1. Want me to hold the 10:30 slot? Reply with the patient's name and age."</p>
              <p>That is one message. It answers the question, offers a time, and asks for the two facts you need to book. The patient does not need to call, wait or repeat anything.</p>
              <p>Compare it with "We will get back to you." The patient reads that as a no.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>PROXe is the front desk that works when yours cannot.</p>
              <p>It answers on WhatsApp, Instagram, your website, email and voice. It asks the two or three things a clinic needs, offers a slot, and books it. If the question is outside what you have told it, it hands the whole conversation to your team, so the patient is not asked the same thing again.</p>
              <p>PROXe Core is ₹9,999 a month + GST. It includes 1,000 leads, 250 voice minutes, every channel and 2 seats, with a 7-day trial. You can read more on the <a href="/">PROXe home page</a>.</p>
              <p>It does not diagnose and it does not replace your doctor. It handles the front desk part: the first reply, the questions, the booking, the follow-up.</p>
            </section>

            <section className={styles.section}>
              <h2 id="do-this-tonight">Do this tonight</h2>
              <p>Take a second phone. At 8:30pm, send your clinic's WhatsApp number this message: "Is the doctor available tomorrow morning?"</p>
              <p>Write down the time. Check how long the reply takes, and whether it is correct.</p>
              <p>Then call your own number at 8:40pm and see who picks up.</p>
              <p>If it takes more than ten minutes, that is what your next patient gets.</p>
            </section>

            <section className={styles.section}>
              <h2 id="book-a-demo">Book a demo</h2>
              <p>If you would rather see it on your own clinic's questions, <a href="/">book a demo at goproxe.com</a> and we will set it up with your fees, timings and doctor days on the call.</p>
              <p><em>Source: <a href="https://www.ciol.com/funding-acquistion-merger/curebay-raises-100-crore-expand-rural-healthcare-ai-12716944" target="_blank" rel="noopener noreferrer">CIOL, 22 Oct 2026</a>.</em></p>
            </section>
    </BlogPostWrapper>
  )
}
