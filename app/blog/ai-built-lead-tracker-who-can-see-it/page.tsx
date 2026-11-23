import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('ai-built-lead-tracker-who-can-see-it', {
  title: 'Your team built a lead tracker with AI. Who can open it?',
  description:
    'Most Grok-built apps tested were open without a login, some holding patient data. Five checks before your enquiry data goes into an AI-built app.',
  alternates: {
    canonical: 'https://goproxe.com/blog/ai-built-lead-tracker-who-can-see-it',
  },
})

const articleContent = `Someone on your team opens an AI tool on a quiet afternoon and builds a small app. A page where the front desk types in each new enquiry. A tracker for who still needs a call back. It takes an hour. It works. Everyone is pleased.

Nobody asks the one question that matters: who else can open it?

If you run a clinic, an academy, an interiors studio or a travel desk, this is closer than it sounds. Staff already paste enquiries into whatever is quickest. An AI-built app is just the newest quick thing.

## What was found this week

On 10 November 2026, a security firm called Claroc published a scan of apps built in Grok's Build mode and put on grok.me addresses. It tested on 8 November. Of 37,571 apps still online, 35,578 opened without any login. That is 94.7 percent.

Most were games, landing pages and calculators. Claroc estimates 650 to 800 held private data. Among what it found: an ICU patient's lab values, a hospital group's roster of more than 3,500 staff, and a timesheet app with plaintext passwords. The Decoder reported it on 11 November.

Claroc's explanation is plain. In the paid account it tested with, "Anyone with the link" was already selected in the publish step. It also says app names show up in commercial passive DNS databases after the first visit, where anyone with an account can search them. The vendor, SpaceXSI (formerly xAI), told the press that apps are private until shared and that employee accounts default to "Only you". The two accounts differ, and we have only read them. Do not take this post as a verdict on any one tool. Take it as a pattern.

The pattern is that a quick AI-built app can go live before anyone has decided who is allowed in.

## Why this matters to a business with a lot of enquiries

An enquiry tracker is not a games page. It holds names, phone numbers, what the person asked about, and sometimes more. At a clinic that can be a health concern. At a coaching academy it is a parent's number and a child's marks. For real estate it is a budget and a family's plans.

Under India's DPDP Act, that is personal data your business is responsible for, even if a tool made the page. We wrote about the rules for WhatsApp chats in [the DPDP Act post](/blog/dpdp-act-whatsapp-customer-chats-small-business). The same logic applies to any app that stores them.

There is also a quieter cost. A tracker that lives on one person's laptop or one shared link is a worse record than one thread per customer. It is the same problem as [the spreadsheet that is not the desk](/blog/the-spreadsheet-is-not-the-desk).

## Five checks before enquiry data goes into any AI-built app

You do not need to be technical. Ask the person who built it, or ask the tool's support, these five things.

1. **Does it need a login?** Open the link in a private window on your phone, on mobile data, signed out. If it opens, anyone can see it.
2. **Who is on the access list?** Look for "anyone with the link", "any Google account" or "public". The answer you want is a named list of your people.
3. **Where does the data sit, and who owns that account?** If it is on the builder's personal account, it leaves with them.
4. **Does it hold passwords or phone numbers in plain text?** If you can see them on screen without a hidden field, so can everyone else.
5. **What happens when someone leaves?** There should be one place to remove their access, today.

If you cannot answer all five in ten minutes, take the app offline until you can. Moving your data is easier than explaining a leak.

If the answer to the first check is "it opened", do three things today. Take the link down. Change any password that sat in it. Make a list of whose details were in there, because you may need to tell them. Then decide who on your team is allowed to start a new tool that touches customer data, and make that one named person.

## What PROXe does about it

We think about this from the other side. PROXe is not an app someone builds on a shared link. It is a system your team signs in to.

- Every enquiry, from WhatsApp, Instagram, the website or a call, lands in one thread per customer, so you do not need a side tracker.
- Your team works from the founder dashboard behind a login, with seats for the people who need them.
- When a conversation needs a person, the handover shows them the whole thread, so nothing gets copied into a spare sheet. See [handoff without starting over](/blog/handoff-without-starting-over).

The point is not the lock. It is that your team stays on the right lead at the right moment, and the record of who said what stays in one place, owned by your business. For the idea behind that, read [one memory, every channel](/blog/one-memory-every-channel).

Ask us the same five questions about PROXe on a [demo](/demo). We would rather you ask.

If you run a clinic, the [clinics page](/industries/clinics) shows how a front desk works from one thread. Plans start on the [pricing page](/pricing).

## Questions people ask

**Are apps built with AI tools safe for customer data?**

They can be, but a quick AI-built app can go live before anyone has decided who is allowed in. In one November 2026 scan of Grok-built apps, 94.7 percent of those still online opened without a login. Check the access settings before any customer data goes in.

**How do I check if our enquiry tracker is public?**

Open its link in a private window on your phone, on mobile data, signed out. If it opens and shows names or numbers, anyone with the link can see them.

**What should we do if the tracker opened without a login?**

Take the link down today, change any password stored in it, and list whose details were in there, because you may need to tell them. Then name one person who decides which new tools may touch customer data.

**Today's step:** open your enquiry tracker in a private window, signed out. If it opens, you have your answer.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: `Are apps built with AI tools safe for customer data?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `They can be, but a quick AI-built app can go live before anyone has decided who is allowed in. In one November 2026 scan of Grok-built apps, 94.7 percent of those still online opened without a login. Check the access settings before any customer data goes in.`,
      },
    },
    {
      '@type': 'Question',
      name: `How do I check if our enquiry tracker is public?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Open its link in a private window on your phone, on mobile data, signed out. If it opens and shows names or numbers, anyone with the link can see them.`,
      },
    },
    {
      '@type': 'Question',
      name: `What should we do if the tracker opened without a login?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Take the link down today, change any password stored in it, and list whose details were in there, because you may need to tell them. Then name one person who decides which new tools may touch customer data.`,
      },
    },
  ],
}

export default function AiBuiltLeadTrackerWhoCanSeeItPage() {
  const slug = 'ai-built-lead-tracker-who-can-see-it'
  const pageUrl = 'https://goproxe.com/blog/ai-built-lead-tracker-who-can-see-it'
  const pageTitle = 'Your team built a lead tracker with AI. Who can open it?'

  const tocItems = [
    { id: 'what-was-found-this-week', text: 'What was found this week' },
    { id: 'why-this-matters', text: 'Why this matters to a business with a lot of enquiries' },
    { id: 'five-checks', text: 'Five checks before enquiry data goes into any AI-built app' },
    { id: 'what-proxe-does-about-it', text: 'What PROXe does about it' },
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
              <p>Someone on your team opens an AI tool on a quiet afternoon and builds a small app. A page where the front desk types in each new enquiry. A tracker for who still needs a call back. It takes an hour. It works. Everyone is pleased.</p>
              <p>Nobody asks the one question that matters: who else can open it?</p>
              <p>If you run a clinic, an academy, an interiors studio or a travel desk, this is closer than it sounds. Staff already paste enquiries into whatever is quickest. An AI-built app is just the newest quick thing.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-was-found-this-week">What was found this week</h2>
              <p>On 10 November 2026, a security firm called Claroc published <a href="https://blog.claroc.io/ghostshares-grok-build-apps/" target="_blank" rel="noopener noreferrer">a scan of apps built in Grok&apos;s Build mode</a> and put on grok.me addresses. It tested on 8 November. Of 37,571 apps still online, 35,578 opened without any login. That is 94.7 percent.</p>
              <p>Most were games, landing pages and calculators. Claroc estimates 650 to 800 held private data. Among what it found: an ICU patient&apos;s lab values, a hospital group&apos;s roster of more than 3,500 staff, and a timesheet app with plaintext passwords. <a href="https://the-decoder.com/grok-built-apps-exposed-patient-data-plaintext-passwords-and-spacexsis-own-sales-pipeline/" target="_blank" rel="noopener noreferrer">The Decoder reported it</a> on 11 November.</p>
              <p>Claroc&apos;s explanation is plain. In the paid account it tested with, &quot;Anyone with the link&quot; was already selected in the publish step. It also says app names show up in commercial passive DNS databases after the first visit, where anyone with an account can search them. The vendor, SpaceXSI (formerly xAI), told the press that apps are private until shared and that employee accounts default to &quot;Only you&quot;. The two accounts differ, and we have only read them. Do not take this post as a verdict on any one tool. Take it as a pattern.</p>
              <p>The pattern is that a quick AI-built app can go live before anyone has decided who is allowed in.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-this-matters">Why this matters to a business with a lot of enquiries</h2>
              <p>An enquiry tracker is not a games page. It holds names, phone numbers, what the person asked about, and sometimes more. At a clinic that can be a health concern. At a coaching academy it is a parent&apos;s number and a child&apos;s marks. For real estate it is a budget and a family&apos;s plans.</p>
              <p>Under India&apos;s DPDP Act, that is personal data your business is responsible for, even if a tool made the page. We wrote about the rules for WhatsApp chats in <a href="/blog/dpdp-act-whatsapp-customer-chats-small-business">the DPDP Act post</a>. The same logic applies to any app that stores them.</p>
              <p>There is also a quieter cost. A tracker that lives on one person&apos;s laptop or one shared link is a worse record than one thread per customer. It is the same problem as <a href="/blog/the-spreadsheet-is-not-the-desk">the spreadsheet that is not the desk</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="five-checks">Five checks before enquiry data goes into any AI-built app</h2>
              <p>You do not need to be technical. Ask the person who built it, or ask the tool&apos;s support, these five things.</p>
              <ol>
                <li><strong>Does it need a login?</strong> Open the link in a private window on your phone, on mobile data, signed out. If it opens, anyone can see it.</li>
                <li><strong>Who is on the access list?</strong> Look for &quot;anyone with the link&quot;, &quot;any Google account&quot; or &quot;public&quot;. The answer you want is a named list of your people.</li>
                <li><strong>Where does the data sit, and who owns that account?</strong> If it is on the builder&apos;s personal account, it leaves with them.</li>
                <li><strong>Does it hold passwords or phone numbers in plain text?</strong> If you can see them on screen without a hidden field, so can everyone else.</li>
                <li><strong>What happens when someone leaves?</strong> There should be one place to remove their access, today.</li>
              </ol>
              <p>If you cannot answer all five in ten minutes, take the app offline until you can. Moving your data is easier than explaining a leak.</p>
              <p>If the answer to the first check is &quot;it opened&quot;, do three things today. Take the link down. Change any password that sat in it. Make a list of whose details were in there, because you may need to tell them. Then decide who on your team is allowed to start a new tool that touches customer data, and make that one named person.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-proxe-does-about-it">What PROXe does about it</h2>
              <p>We think about this from the other side. PROXe is not an app someone builds on a shared link. It is a system your team signs in to.</p>
              <ul>
                <li>Every enquiry, from WhatsApp, Instagram, the website or a call, lands in one thread per customer, so you do not need a side tracker.</li>
                <li>Your team works from the founder dashboard behind a login, with seats for the people who need them.</li>
                <li>When a conversation needs a person, the handover shows them the whole thread, so nothing gets copied into a spare sheet. See <a href="/blog/handoff-without-starting-over">handoff without starting over</a>.</li>
              </ul>
              <p>The point is not the lock. It is that your team stays on the right lead at the right moment, and the record of who said what stays in one place, owned by your business. For the idea behind that, read <a href="/blog/one-memory-every-channel">one memory, every channel</a>.</p>
              <p>Ask us the same five questions about PROXe on a <a href="/demo">demo</a>. We would rather you ask.</p>
              <p>If you run a clinic, the <a href="/industries/clinics">clinics page</a> shows how a front desk works from one thread. Plans start on the <a href="/pricing">pricing page</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Are apps built with AI tools safe for customer data?</strong></p>
              <p>They can be, but a quick AI-built app can go live before anyone has decided who is allowed in. In one November 2026 scan of Grok-built apps, 94.7 percent of those still online opened without a login. Check the access settings before any customer data goes in.</p>
              <p><strong>How do I check if our enquiry tracker is public?</strong></p>
              <p>Open its link in a private window on your phone, on mobile data, signed out. If it opens and shows names or numbers, anyone with the link can see them.</p>
              <p><strong>What should we do if the tracker opened without a login?</strong></p>
              <p>Take the link down today, change any password stored in it, and list whose details were in there, because you may need to tell them. Then name one person who decides which new tools may touch customer data.</p>
            </section>

            <section className={styles.section}>
              <p><strong>Today&apos;s step:</strong> open your enquiry tracker in a private window, signed out. If it opens, you have your answer.</p>
            </section>
    </BlogPostWrapper>
  )
}
