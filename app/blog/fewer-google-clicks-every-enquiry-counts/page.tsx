import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('fewer-google-clicks-every-enquiry-counts', {
  title: 'Google clicks are falling. What to do with the ones you get',
  description:
    'AI answers on Google mean fewer clicks to your site. If you run a clinic, academy or service business, here is how to treat every visitor who still comes.',
  alternates: {
    canonical: 'https://goproxe.com/blog/fewer-google-clicks-every-enquiry-counts',
  },
})

const articleContent = `If you run a clinic, a coaching academy, an interiors studio or a car service centre, you have probably heard it from your website person: "traffic is down."

Maybe you have seen it yourself. Fewer visits in the report, same effort on the site.

The question owners ask is simple. If fewer people click, how do I still get enquiries?

SparkToro looked at US Google searches for the first four months of 2026. Search Engine Land reports that 68.01% of searches ended without a click. In 2024 the figure was 60.45%. TechWyse's summary of the same study gives the same numbers.

The study also says AI Overviews now show on more than 20% of searches, and when they do, clicks fall by nearly 60%.

Three things to keep in mind:

This is US data. We could not find a study that measures this for Indian clinics, academies or local service businesses, so do not read it as your number. Read it as the direction.

The two years used different data sources, so the size of the jump is not exact. Treat the direction as more reliable than the decimal.

The study does not prove AI Overviews caused the whole rise. It says they likely contribute.

The direction is clear enough: Google answers more of the question on its own page.

Fewer people click through. That part you cannot control.

What you can control is what happens to the person who does click, or who skips the click and messages you straight from your Google profile or Instagram.

That person already read an answer. They are not browsing. They are close to asking something specific: the fee, a slot, whether you do it at all.

If they land on a form and wait, you lose them. A form is not a booking. If they came from an ad, it is worse: you paid for the visit and nobody answered.

Check your real numbers. Open Google Search Console. Look at impressions and clicks for the last 90 days. If impressions are steady and clicks fell, this is the trend, not a broken site.

Count enquiries, not visits. Write down how many people asked you something last month across calls, WhatsApp, Instagram and the site. That number matters more than traffic. Here is what to measure on inbound.

Put a way to talk on every page. A WhatsApp button, a call button, a chat on the site. One tap, not a form with seven fields.

Decide who picks it up. Fewer visitors means each one is worth more of your time. Decide who sees the new enquiry, and who talks to them first.

Google can explain what a root canal is. It cannot tell someone your fee, your Thursday slot or whether you take a particular scan.

Those are the questions people bring to you. Answer them from your real details, and do not invent the price. If you do not know, say so and bring in a person.

How quickly you answer matters too. We wrote about how fast to reply on WhatsApp.

Say a physio clinic gets 300 website visits a month and 30 enquiries. Next quarter visits drop to 220. If the enquiries drop to 22, the clinic lost eight conversations it could have had.

Now say the clinic changes nothing on the site but makes sure each of those 22 gets a real answer the same day, from someone who knows the fee and the free slots. It will likely end the quarter ahead of where a busier site with slow replies would. These numbers are made up to show the maths. Use your own.

The point: traffic is the top of the funnel, and you do not own it. The conversation is the part you do own.

When fewer people reach you, the ones who do cannot be left in a queue.

PROXe keeps the conversation from your website chat, WhatsApp and Instagram in one thread. It answers from the details you gave it, and shows your team who is ready to talk. When a person needs to step in, they see the whole conversation and do not start over.

So the team spends its time on the right lead at the right moment, instead of on whoever messaged last.

It works the same for clinics, coaching academies, real estate and other service businesses with a steady flow of enquiries. Details are on the pricing page.

You cannot make Google send more clicks. You can make sure the enquiries you do get become a conversation with a person.

If you want to see how that looks on your own enquiries, book a demo.`

export default function FewerGoogleClicksEveryEnquiryCountsPage() {
  const slug = 'fewer-google-clicks-every-enquiry-counts'
  const pageUrl = 'https://goproxe.com/blog/fewer-google-clicks-every-enquiry-counts'
  const pageTitle = 'Google clicks are falling. What to do with the ones you get'

  const tocItems = [
    { id: 'what-the-data-says', text: 'What the data says' },
    { id: 'what-changes-for-you', text: 'What changes for you' },
    { id: 'four-things-to-do-this-week', text: 'Four things to do this week' },
    { id: 'answer-what-the-summary-cannot', text: 'Answer what the summary cannot' },
    { id: 'a-small-example', text: 'A small example' },
    { id: 'where-proxe-fits', text: 'Where PROXe fits' },
    { id: 'the-takeaway', text: 'The takeaway' },
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
              <p>If you run a clinic, a coaching academy, an interiors studio or a car service centre, you have probably heard it from your website person: "traffic is down."</p>
              <p>Maybe you have seen it yourself. Fewer visits in the report, same effort on the site.</p>
              <p>The question owners ask is simple. If fewer people click, how do I still get enquiries?</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-the-data-says">What the data says</h2>
              <p>SparkToro looked at US Google searches for the first four months of 2026. <a href="https://searchengineland.com/google-zero-click-searches-2026-study-479717" target="_blank" rel="noopener noreferrer">Search Engine Land reports</a> that 68.01% of searches ended without a click. In 2024 the figure was 60.45%. <a href="https://www.techwyse.com/news/reports-data/google-zero-click-searches-68-percent-2026" target="_blank" rel="noopener noreferrer">TechWyse's summary</a> of the same study gives the same numbers.</p>
              <p>The study also says AI Overviews now show on more than 20% of searches, and when they do, clicks fall by nearly 60%.</p>
              <p>Three things to keep in mind:</p>
              <ul>
                <li>This is US data. We could not find a study that measures this for Indian clinics, academies or local service businesses, so do not read it as your number. Read it as the direction.</li>
                <li>The two years used different data sources, so the size of the jump is not exact. Treat the direction as more reliable than the decimal.</li>
                <li>The study does not prove AI Overviews caused the whole rise. It says they likely contribute.</li>
              </ul>
              <p>The direction is clear enough: Google answers more of the question on its own page.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-changes-for-you">What changes for you</h2>
              <p>Fewer people click through. That part you cannot control.</p>
              <p>What you can control is what happens to the person who does click, or who skips the click and messages you straight from your Google profile or Instagram.</p>
              <p>That person already read an answer. They are not browsing. They are close to asking something specific: the fee, a slot, whether you do it at all.</p>
              <p>If they land on a form and wait, you lose them. <a href="/blog/the-website-is-not-the-desk">A form is not a booking</a>. If they came from an ad, it is worse: you paid for the visit and <a href="/blog/paid-lead-no-reply">nobody answered</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="four-things-to-do-this-week">Four things to do this week</h2>
              <ol>
                <li><strong>Check your real numbers.</strong> Open Google Search Console. Look at impressions and clicks for the last 90 days. If impressions are steady and clicks fell, this is the trend, not a broken site.</li>
                <li><strong>Count enquiries, not visits.</strong> Write down how many people asked you something last month across calls, WhatsApp, Instagram and the site. That number matters more than traffic. Here is <a href="/blog/what-to-measure-on-inbound">what to measure on inbound</a>.</li>
                <li><strong>Put a way to talk on every page.</strong> A WhatsApp button, a call button, a chat on the site. One tap, not a form with seven fields.</li>
                <li><strong>Decide who picks it up.</strong> Fewer visitors means each one is worth more of your time. Decide who sees the new enquiry, and who talks to them first.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h2 id="answer-what-the-summary-cannot">Answer what the summary cannot</h2>
              <p>Google can explain what a root canal is. It cannot tell someone your fee, your Thursday slot or whether you take a particular scan.</p>
              <p>Those are the questions people bring to you. Answer them from your real details, and <a href="/blog/dont-invent-the-price">do not invent the price</a>. If you do not know, say so and bring in a person.</p>
              <p>How quickly you answer matters too. We wrote about <a href="/blog/how-fast-to-reply-whatsapp">how fast to reply on WhatsApp</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="a-small-example">A small example</h2>
              <p>Say a physio clinic gets 300 website visits a month and 30 enquiries. Next quarter visits drop to 220. If the enquiries drop to 22, the clinic lost eight conversations it could have had.</p>
              <p>Now say the clinic changes nothing on the site but makes sure each of those 22 gets a real answer the same day, from someone who knows the fee and the free slots. It will likely end the quarter ahead of where a busier site with slow replies would. These numbers are made up to show the maths. Use your own.</p>
              <p>The point: traffic is the top of the funnel, and you do not own it. The conversation is the part you do own.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>When fewer people reach you, the ones who do cannot be left in a queue.</p>
              <p>PROXe keeps the conversation from your website chat, WhatsApp and Instagram in <a href="/blog/one-memory-every-channel">one thread</a>. It answers from the details you gave it, and shows your team who is ready to talk. When a person needs to step in, <a href="/blog/handoff-without-starting-over">they see the whole conversation</a> and do not start over.</p>
              <p>So the team spends its time on the right lead at the right moment, instead of on whoever messaged last.</p>
              <p>It works the same for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching academies</a>, <a href="/industries/realestate">real estate</a> and other service businesses with a steady flow of enquiries. Details are on the <a href="/pricing">pricing page</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-takeaway">The takeaway</h2>
              <p>You cannot make Google send more clicks. You can make sure the enquiries you do get become a conversation with a person.</p>
              <p>If you want to see how that looks on your own enquiries, <a href="/demo">book a demo</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
