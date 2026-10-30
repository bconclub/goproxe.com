import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('dpdp-act-whatsapp-customer-chats-small-business', {
  title: "DPDP Act and your WhatsApp chats: a 6-question check",
  description:
    "India's data protection law is back in the news. If your clinic, academy or service business keeps customer chats, here is a plain six-question check.",
  alternates: {
    canonical: 'https://goproxe.com/blog/dpdp-act-whatsapp-customer-chats-small-business',
  },
})

const articleContent = `If you run a clinic, a coaching academy, an interiors studio or a travel desk, your phone is full of other people's details. Names, numbers, scans, fee discussions, a parent saying their child is struggling in maths.

Then you see "DPDP Act" in the news again and wonder: does this apply to me, and what do I actually have to do?

This post is a plain answer. It is not legal advice. Talk to a lawyer or your CA before you act on any of it.

## What is in the news

The Digital Personal Data Protection Act became law in August 2023. The Rules that make it workable were notified in November 2025, with an 18-month phased timeline, as Entrepreneur India reported. That points to around May 2027 for most duties. KPMG's guidance note is a good further read.

This week it is back in the headlines because, as Inc42 reports, 21 news publishers, through the Digital News Publishers Association, have gone to the Supreme Court to challenge parts of the Act, with a hearing scheduled for 27 October. Their argument is about journalism and sources. It is not about clinics or coaching classes.

So what does that mean for you? Two honest points:

- The case may change parts of the law. We do not know how.
- Nothing in it says small businesses are off the hook. The law is about anyone who decides why and how personal data is used.

## Does it apply to a small service business?

Probably, in the parts that matter. If you collect a phone number and a name to answer an enquiry and then keep that chat, you are handling personal data. The same Entrepreneur India piece lists the basics: a clear, simple notice saying what you collect and why, reasonable security, telling people if there is a breach, and erasing data once you no longer need it.

It describes an 18-month transition for SMEs and says they are not subject to the extra duties for "Significant Data Fiduciaries". It does not describe a general small-business exemption, so do not assume you have one. Ask your adviser.

## Six questions to ask this week

1. Where do my customer chats actually live? On one owner's phone? Three staff phones? A WhatsApp group, a spreadsheet, a notebook at reception? Write the list down. A group chat is not a desk, and it is also very hard to account for.
2. Do people know why I am asking for their details? A short line at the point of collection works: "We use your number to reply about your enquiry and to remind you of your slot." No big legal paragraph.
3. Can I find everything I hold about one person? If a parent asks "what do you have on my child?", could you answer in a day? If the answer lives in four places, probably not.
4. Can I delete it when it is no longer needed? An enquiry from two years ago that never turned into a visit. Who deletes it, and when?
5. Who can see what? A new front-desk joiner should not be able to scroll through every patient's messages. A spreadsheet shared with everyone is the usual weak spot.
6. If something leaks, who do I tell and how fast? A staff member loses a phone with the clinic WhatsApp on it. Do you know the first three steps?

If you can answer four of six today, you are ahead of most. If you can answer none, that is normal, and it is a good week to start.

## Where this goes wrong in real businesses

It is rarely a hacker. It is a coaching academy where each counsellor keeps parents' chats on a personal phone, and one of them leaves. It is a real-estate broker with a spreadsheet of buyers' budgets on a shared drive. It is a contact saved on someone's phone and nothing else.

The common thread is that the conversation is scattered, so nobody can say what is held, by whom, or whether it is still needed.

## Where PROXe fits

We will be careful here. PROXe does not make a business compliant with any law, and we are not claiming that. Compliance is a mix of your notice, your processes and your tools.

What we can say is this. Scattered chats are the hardest thing to account for. PROXe keeps the conversation with each person in one thread across the channels you use, so your team is working from one record instead of five phones. When someone steps in, they see the whole conversation and the customer does not have to repeat themselves. And if your voice agent calls people, say it is an AI up front.

Having one place for each person's conversation is a good base for questions 1, 3 and 5 above. The notice, the deletion rules and the breach plan are still yours to set.

It works the same for clinics, coaching academies, real estate and other businesses with a steady flow of enquiries. Plans are on the pricing page.

## The takeaway

You do not need to read the whole Act this week. You need to know where your customer chats live, tell people why you collect their details, and be able to delete them.

If you want to see what one thread per customer looks like for your own enquiries, book a demo.`

export default function DpdpActWhatsappCustomerChatsPage() {
  const slug = 'dpdp-act-whatsapp-customer-chats-small-business'
  const pageUrl = 'https://goproxe.com/blog/dpdp-act-whatsapp-customer-chats-small-business'
  const pageTitle = "DPDP Act and your WhatsApp chats: a 6-question check"

  const tocItems = [
    { id: 'what-is-in-the-news', text: "What is in the news" },
    { id: 'does-it-apply-to-a-small-service-business', text: "Does it apply to a small service business?" },
    { id: 'six-questions-to-ask-this-week', text: "Six questions to ask this week" },
    { id: 'where-this-goes-wrong-in-real-businesses', text: "Where this goes wrong in real businesses" },
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
              <p>If you run a clinic, a coaching academy, an interiors studio or a travel desk, your phone is full of other people's details. Names, numbers, scans, fee discussions, a parent saying their child is struggling in maths.</p>
              <p>Then you see "DPDP Act" in the news again and wonder: does this apply to me, and what do I actually have to do?</p>
              <p>This post is a plain answer. It is not legal advice. Talk to a lawyer or your CA before you act on any of it.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-is-in-the-news">What is in the news</h2>
              <p>The Digital Personal Data Protection Act became law in August 2023. The Rules that make it workable were notified in November 2025, with an 18-month phased timeline, <a href="https://india.entrepreneur.com/news-and-trends/india-pushes-for-digital-privacy-with-dpdp-rules-2025-key/499704" target="_blank" rel="noopener noreferrer">as Entrepreneur India reported</a>. That points to around May 2027 for most duties. <a href="https://assets.kpmg.com/content/dam/kpmgsites/in/pdf/2025/11/dpdp-rules-2025-guidance-to-dpdp-act-implementation.pdf" target="_blank" rel="noopener noreferrer">KPMG's guidance note</a> is a good further read.</p>
              <p>This week it is back in the headlines because, <a href="https://inc42.com/buzz/news-publishers-move-sc-to-challenge-the-dpdp-act/" target="_blank" rel="noopener noreferrer">as Inc42 reports</a>, 21 news publishers, through the Digital News Publishers Association, have gone to the Supreme Court to challenge parts of the Act, with a hearing scheduled for 27 October. Their argument is about journalism and sources. It is not about clinics or coaching classes.</p>
              <p>So what does that mean for you? Two honest points:</p>
              <ul>
                <li>The case may change parts of the law. We do not know how.</li>
                <li>Nothing in it says small businesses are off the hook. The law is about anyone who decides why and how personal data is used.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 id="does-it-apply-to-a-small-service-business">Does it apply to a small service business?</h2>
              <p>Probably, in the parts that matter. If you collect a phone number and a name to answer an enquiry and then keep that chat, you are handling personal data. The same Entrepreneur India piece lists the basics: a clear, simple notice saying what you collect and why, reasonable security, telling people if there is a breach, and erasing data once you no longer need it.</p>
              <p>It describes an 18-month transition for SMEs and says they are not subject to the extra duties for "Significant Data Fiduciaries". It does not describe a general small-business exemption, so do not assume you have one. Ask your adviser.</p>
            </section>

            <section className={styles.section}>
              <h2 id="six-questions-to-ask-this-week">Six questions to ask this week</h2>
              <ol>
                <li><strong>Where do my customer chats actually live?</strong> On one owner's phone? Three staff phones? A WhatsApp group, a spreadsheet, a notebook at reception? Write the list down. <a href="/blog/the-group-chat-is-not-the-desk">A group chat is not a desk</a>, and it is also very hard to account for.</li>
                <li><strong>Do people know why I am asking for their details?</strong> A short line at the point of collection works: "We use your number to reply about your enquiry and to remind you of your slot." No big legal paragraph.</li>
                <li><strong>Can I find everything I hold about one person?</strong> If a parent asks "what do you have on my child?", could you answer in a day? If the answer lives in four places, probably not.</li>
                <li><strong>Can I delete it when it is no longer needed?</strong> An enquiry from two years ago that never turned into a visit. Who deletes it, and when?</li>
                <li><strong>Who can see what?</strong> A new front-desk joiner should not be able to scroll through every patient's messages. <a href="/blog/the-spreadsheet-is-not-the-desk">A spreadsheet shared with everyone</a> is the usual weak spot.</li>
                <li><strong>If something leaks, who do I tell and how fast?</strong> A staff member loses a phone with the clinic WhatsApp on it. Do you know the first three steps?</li>
              </ol>
              <p>If you can answer four of six today, you are ahead of most. If you can answer none, that is normal, and it is a good week to start.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-this-goes-wrong-in-real-businesses">Where this goes wrong in real businesses</h2>
              <p>It is rarely a hacker. It is a coaching academy where each counsellor keeps parents' chats on a personal phone, and one of them leaves. It is a real-estate broker with a spreadsheet of buyers' budgets on a shared drive. It is <a href="/blog/saving-the-contact-is-not-done">a contact saved on someone's phone and nothing else</a>.</p>
              <p>The common thread is that the conversation is scattered, so nobody can say what is held, by whom, or whether it is still needed.</p>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>We will be careful here. PROXe does not make a business compliant with any law, and we are not claiming that. Compliance is a mix of your notice, your processes and your tools.</p>
              <p>What we can say is this. Scattered chats are the hardest thing to account for. PROXe keeps the conversation with each person in <a href="/blog/one-memory-every-channel">one thread</a> across the channels you use, so your team is working from one record instead of five phones. When someone steps in, <a href="/blog/handoff-without-starting-over">they see the whole conversation</a> and the customer does not have to repeat themselves. And if your voice agent calls people, <a href="/blog/should-your-ai-caller-say-its-an-ai">say it is an AI</a> up front.</p>
              <p>Having one place for each person's conversation is a good base for questions 1, 3 and 5 above. The notice, the deletion rules and the breach plan are still yours to set.</p>
              <p>It works the same for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching academies</a>, <a href="/industries/realestate">real estate</a> and other businesses with a steady flow of enquiries. Plans are on the <a href="/pricing">pricing page</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-takeaway">The takeaway</h2>
              <p>You do not need to read the whole Act this week. You need to know where your customer chats live, tell people why you collect their details, and be able to delete them.</p>
              <p>If you want to see what one thread per customer looks like for your own enquiries, <a href="/demo">book a demo</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
