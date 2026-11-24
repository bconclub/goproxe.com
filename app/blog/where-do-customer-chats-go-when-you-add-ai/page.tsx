import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('where-do-customer-chats-go-when-you-add-ai', {
  title: "Where do your customers' chats go when you add AI?",
  description:
    "A vendor behind a popular AI tool was breached and chat transcripts were taken. Six plain questions to ask before an AI reads your customers' enquiries.",
  alternates: {
    canonical: 'https://goproxe.com/blog/where-do-customer-chats-go-when-you-add-ai',
  },
})

const articleContent = `A patient writes to a clinic: "I have been having this pain for two weeks, can I see someone Saturday?" If the owner lets an AI read that message, who else gets to see it?

Any owner with a busy enquiry inbox should ask this: a clinic, a coaching academy, a broker, an interiors studio. It is a fair question, and two news items this week make it real.

## What happened

On 12 November, TechCrunch reported that Fireworks AI, a company that runs AI models for other businesses, said an attacker breached its cloud provider and reached one of its development systems. Billing information and some datasets were taken.

Notion, one of its customers, said chat transcripts from people who used its AI "Insights" feature were taken too. Much of the data could not be traced to a specific customer. Notion said around 1% of its customers were affected, and that on 3 November it disconnected from Fireworks and deleted the data it held there. TechCrunch notes this is Fireworks' second breach in as many months.

Read that from the user's side. People used Notion. Notion used a vendor. The vendor was breached. The people who typed the chats had never heard of Fireworks.

The same day, Inc42 reported that OpenAI now offers API data residency in India, with processing and storage both inside the country for supported workloads. It starts with one model, and customers must create a new API project and select India. OpenAI's India enterprise head said some Indian businesses have not fully deployed AI for important work because they need the information processed within the country.

So people are asking where the data lives, and vendors are starting to answer. We are reading press reports, not the companies' security pages. Treat the details as what was reported on 12 November.

## What this means for your enquiry inbox

You do not need to be scared of AI. You do need to know the path your customers' messages take.

For most small businesses it looks like this: customer, WhatsApp, your tool, an AI model somewhere, and sometimes another company behind that. Every hop can store a copy.

## Six questions to ask any vendor

Ask these before an AI reads your enquiries:

1. **Which companies touch the chat?** Not just the tool. The model provider and the cloud behind it too.
2. **Where is it stored, and for how long?** "We delete it" is not enough. Ask for a number of days.
3. **Is our chat used to train a model?** You want a plain answer, in writing.
4. **Can I see and delete a customer's chat if they ask?** The DPDP Act gives your customers rights over their data. We wrote about it in [the DPDP Act and your WhatsApp chats](/blog/dpdp-act-whatsapp-customer-chats-small-business).
5. **What did you tell customers the last time something went wrong?** Ask to see it.
6. **Who in my team can open these chats?** The risk is not only outside hackers. A shared login on a phone or a [group chat doing the desk's job](/blog/the-group-chat-is-not-the-desk) leaks too.

## Give the AI less to hold

The safest message is the one that never reached an AI. Two habits help.

- **Keep the facts in one place.** Your fees, timings, branches and how booking works should come from details you wrote down once, not from old chats. See [don't invent the price](/blog/dont-invent-the-price).
- **Hand the sensitive chat to a person.** A patient describing symptoms, a parent describing a child's results, a buyer sharing a budget: these should reach someone on your team with the full thread. We wrote about how that goes in [handoff without starting over](/blog/handoff-without-starting-over).

## What PROXe does about it

PROXe answers from the brand details you give it. Your team can read every conversation on every channel in [one thread](/blog/one-memory-every-channel), so you can see for yourself what was said. When a customer needs a person, it hands over with the whole conversation.

We do not name the AI model providers we use in a blog post, and this post is not a security certificate for PROXe. If you want to know where your customers' chats are processed and stored, ask us and we will answer in writing before you start. Plans are on the [pricing page](/pricing), and [what PROXe is](/what-is-proxe) explains the product in plain words.

## The short version

An AI tool is a chain of companies, not one. The same goes for an AI that [calls your business](/blog/when-an-ai-assistant-calls-your-business). Ask who is on the chain, where the chat sits, and for how long. Then give the AI less to hold, and put a person on the chats that matter.

## Questions people ask

**Is it safe to let an AI read my customers' WhatsApp enquiries?**

It can be, if you know the path. An AI tool is usually a chain of companies: the tool, the model provider, and the cloud behind it. Each can store a copy. Ask who is on that chain, where the chat is stored and for how long before you switch it on.

**What should I ask an AI vendor about customer chat data?**

Ask which companies touch the chat, where it is stored and for how many days, whether it is used to train a model, whether you can see and delete a customer's chat on request, what they told customers the last time something went wrong, and who in your team can open the chats.

**Which chats should go to a person instead of the AI?**

Sensitive ones: a patient describing symptoms, a parent describing a child's results, a buyer sharing a budget. These should reach someone on your team with the full thread.

Want to see how it works with your own brand details? [Book a demo](/demo).

PROXe puts your team on the right lead at the right moment.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Is it safe to let an AI read my customers' WhatsApp enquiries?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `It can be, if you know the path. An AI tool is usually a chain of companies: the tool, the model provider, and the cloud behind it. Each can store a copy. Ask who is on that chain, where the chat is stored and for how long before you switch it on.`,
      },
    },
    {
      '@type': 'Question',
      name: `What should I ask an AI vendor about customer chat data?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Ask which companies touch the chat, where it is stored and for how many days, whether it is used to train a model, whether you can see and delete a customer's chat on request, what they told customers the last time something went wrong, and who in your team can open the chats.`,
      },
    },
    {
      '@type': 'Question',
      name: `Which chats should go to a person instead of the AI?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Sensitive ones: a patient describing symptoms, a parent describing a child's results, a buyer sharing a budget. These should reach someone on your team with the full thread.`,
      },
    },
  ],
}

export default function WhereDoCustomerChatsGoWhenYouAddAiPage() {
  const slug = 'where-do-customer-chats-go-when-you-add-ai'
  const pageUrl = 'https://goproxe.com/blog/where-do-customer-chats-go-when-you-add-ai'
  const pageTitle = "Where do your customers' chats go when you add AI?"

  const tocItems = [
    { id: 'what-happened', text: 'What happened' },
    { id: 'your-enquiry-inbox', text: 'What this means for your enquiry inbox' },
    { id: 'six-questions', text: 'Six questions to ask any vendor' },
    { id: 'give-the-ai-less', text: 'Give the AI less to hold' },
    { id: 'what-proxe-does-about-it', text: 'What PROXe does about it' },
    { id: 'the-short-version', text: 'The short version' },
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
              <p>A patient writes to a clinic: &quot;I have been having this pain for two weeks, can I see someone Saturday?&quot; If the owner lets an AI read that message, who else gets to see it?</p>
              <p>Any owner with a busy enquiry inbox should ask this: a clinic, a coaching academy, a broker, an interiors studio. It is a fair question, and two news items this week make it real.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-happened">What happened</h2>
              <p>On 12 November, <a href="https://techcrunch.com/2026/11/12/cyberattack-on-fireworks-ai-allowed-hackers-to-access-notion-customers-chat-transcripts/" target="_blank" rel="noopener noreferrer">TechCrunch reported</a> that Fireworks AI, a company that runs AI models for other businesses, said an attacker breached its cloud provider and reached one of its development systems. Billing information and some datasets were taken.</p>
              <p>Notion, one of its customers, said chat transcripts from people who used its AI &quot;Insights&quot; feature were taken too. Much of the data could not be traced to a specific customer. Notion said around 1% of its customers were affected, and that on 3 November it disconnected from Fireworks and deleted the data it held there. TechCrunch notes this is Fireworks&apos; second breach in as many months.</p>
              <p>Read that from the user&apos;s side. People used Notion. Notion used a vendor. The vendor was breached. The people who typed the chats had never heard of Fireworks.</p>
              <p>The same day, <a href="https://inc42.com/buzz/openai-brings-api-inference-residency-to-india-to-deepen-enterprise-ai-adoption/" target="_blank" rel="noopener noreferrer">Inc42 reported</a> that OpenAI now offers API data residency in India, with processing and storage both inside the country for supported workloads. It starts with one model, and customers must create a new API project and select India. OpenAI&apos;s India enterprise head said some Indian businesses have not fully deployed AI for important work because they need the information processed within the country.</p>
              <p>So people are asking where the data lives, and vendors are starting to answer. We are reading press reports, not the companies&apos; security pages. Treat the details as what was reported on 12 November.</p>
            </section>

            <section className={styles.section}>
              <h2 id="your-enquiry-inbox">What this means for your enquiry inbox</h2>
              <p>You do not need to be scared of AI. You do need to know the path your customers&apos; messages take.</p>
              <p>For most small businesses it looks like this: customer, WhatsApp, your tool, an AI model somewhere, and sometimes another company behind that. Every hop can store a copy.</p>
            </section>

            <section className={styles.section}>
              <h2 id="six-questions">Six questions to ask any vendor</h2>
              <p>Ask these before an AI reads your enquiries:</p>
              <ol>
                <li><strong>Which companies touch the chat?</strong> Not just the tool. The model provider and the cloud behind it too.</li>
                <li><strong>Where is it stored, and for how long?</strong> &quot;We delete it&quot; is not enough. Ask for a number of days.</li>
                <li><strong>Is our chat used to train a model?</strong> You want a plain answer, in writing.</li>
                <li><strong>Can I see and delete a customer&apos;s chat if they ask?</strong> The DPDP Act gives your customers rights over their data. We wrote about it in <a href="/blog/dpdp-act-whatsapp-customer-chats-small-business">the DPDP Act and your WhatsApp chats</a>.</li>
                <li><strong>What did you tell customers the last time something went wrong?</strong> Ask to see it.</li>
                <li><strong>Who in my team can open these chats?</strong> The risk is not only outside hackers. A shared login on a phone or a <a href="/blog/the-group-chat-is-not-the-desk">group chat doing the desk&apos;s job</a> leaks too.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h2 id="give-the-ai-less">Give the AI less to hold</h2>
              <p>The safest message is the one that never reached an AI. Two habits help.</p>
              <ul>
                <li><strong>Keep the facts in one place.</strong> Your fees, timings, branches and how booking works should come from details you wrote down once, not from old chats. See <a href="/blog/dont-invent-the-price">don&apos;t invent the price</a>.</li>
                <li><strong>Hand the sensitive chat to a person.</strong> A patient describing symptoms, a parent describing a child&apos;s results, a buyer sharing a budget: these should reach someone on your team with the full thread. We wrote about how that goes in <a href="/blog/handoff-without-starting-over">handoff without starting over</a>.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 id="what-proxe-does-about-it">What PROXe does about it</h2>
              <p>PROXe answers from the brand details you give it. Your team can read every conversation on every channel in <a href="/blog/one-memory-every-channel">one thread</a>, so you can see for yourself what was said. When a customer needs a person, it hands over with the whole conversation.</p>
              <p>We do not name the AI model providers we use in a blog post, and this post is not a security certificate for PROXe. If you want to know where your customers&apos; chats are processed and stored, ask us and we will answer in writing before you start. Plans are on the <a href="/pricing">pricing page</a>, and <a href="/what-is-proxe">what PROXe is</a> explains the product in plain words.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-short-version">The short version</h2>
              <p>An AI tool is a chain of companies, not one. The same goes for an AI that <a href="/blog/when-an-ai-assistant-calls-your-business">calls your business</a>. Ask who is on the chain, where the chat sits, and for how long. Then give the AI less to hold, and put a person on the chats that matter.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is it safe to let an AI read my customers&apos; WhatsApp enquiries?</strong></p>
              <p>It can be, if you know the path. An AI tool is usually a chain of companies: the tool, the model provider, and the cloud behind it. Each can store a copy. Ask who is on that chain, where the chat is stored and for how long before you switch it on.</p>
              <p><strong>What should I ask an AI vendor about customer chat data?</strong></p>
              <p>Ask which companies touch the chat, where it is stored and for how many days, whether it is used to train a model, whether you can see and delete a customer&apos;s chat on request, what they told customers the last time something went wrong, and who in your team can open the chats.</p>
              <p><strong>Which chats should go to a person instead of the AI?</strong></p>
              <p>Sensitive ones: a patient describing symptoms, a parent describing a child&apos;s results, a buyer sharing a budget. These should reach someone on your team with the full thread.</p>
            </section>

            <section className={styles.section}>
              <p>Want to see how it works with your own brand details? <a href="/demo">Book a demo</a>.</p>
              <p><strong>PROXe puts your team on the right lead at the right moment.</strong></p>
            </section>
    </BlogPostWrapper>
  )
}
