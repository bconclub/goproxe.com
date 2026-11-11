import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('whatsapp-usernames-customer-phone-number-hidden', {
  title: 'WhatsApp usernames: what if the number is hidden?',
  description:
    'WhatsApp now lets people hide their phone number behind a username. What it means for your follow-up and what to do this week.',
  alternates: {
    canonical: 'https://goproxe.com/blog/whatsapp-usernames-customer-phone-number-hidden',
  },
})

const articleContent = `A patient messages your clinic on WhatsApp on Saturday. Your front desk replies, the patient asks about a Monday slot, then the chat goes quiet. On Monday the receptionist goes to call them. There is no number to call.

That is not a bug in your phone. It is a change WhatsApp has started to make.

## What WhatsApp announced

On 29 June 2026, WhatsApp said people can reserve a username and hide their phone number from anyone who does not have it saved. According to [BleepingComputer's report](https://bleepingcomputer.com/news/security/whatsapp-rolls-out-usernames-to-help-users-hide-their-phone-number) of Meta's announcement, "people will need to know your exact username to contact you for the first time." Users can reserve a name now, but the feature is rolling out gradually over several months, and people are notified when it reaches their country.

For businesses on WhatsApp's business platform, messaging provider 360dialog [explains the practical change](https://360dialog.com/blog/whatsapp-usernames-business-impact-2026/) (page last updated July 2026). A customer who adopts a username can arrive as a business-scoped user ID instead of a phone number. The same customer gets a different ID with each business. Their advice: keep the phone numbers you already have, add a field for the new ID, and do not assume every new chat comes with a number.

360dialog also warns that flows such as click-to-WhatsApp ad conversations can break if a system only expects phone numbers. If you pay for those ads, that matters. Our post on a [paid lead with no reply](/blog/paid-lead-no-reply) is about how expensive a silent chat already is.

We have not seen Meta spell out every detail for the free WhatsApp Business app that many small clinics and academies use. So treat the exact behaviour there as something to check, not something we can promise.

## Why it matters if you run a service business

Most small teams treat the phone number as the customer. It is the name in the follow-up sheet, the number on the reminder, the key that says "this is the same person who asked last week."

If a growing share of customers hide their number, three things get shaky:

1. **Follow-up by phone call.** No number, no call from the desk.
2. **Spotting a repeat enquiry.** The same parent writing again may look like a stranger.
3. **Lists and reminders** built only on phone numbers will quietly miss people.

This hits owner-led businesses hardest. A clinic, a coaching academy, a broker or an interior designer often runs on one WhatsApp number and one sheet. When the sheet's key column goes blank, nobody notices until a lead has gone cold.

## Five things to do this week

1. **Look at your last 20 new chats.** How many came with a number you can see? Note the date you first see one without it.
2. **Stop keeping the number as the only key.** Your sheet or system should hold a name, the channel and the chat itself, with the number as one field.
3. **Ask for the number in the chat when you need to call.** One plain line: "Shall I call you on this number, or is there a better one?" Say why you are asking. Our post on the [DPDP Act and customer chats](/blog/dpdp-act-whatsapp-customer-chats-small-business) covers keeping that request reasonable. On the business platform, 360dialog also points to a "Request Contact Info" button for this.
4. **Reply inside the chat first.** If the chat is the thing you can always reach, [follow-up has to live in the chat](/blog/follow-up-is-a-system), not only on a phone list. A [missed call is still a lead](/blog/a-missed-call-is-still-a-lead), and so is a chat with no number.
5. **Make sure the next person sees the whole thread.** If the number is not there to anchor the story, the conversation has to be. See [handoff without starting over](/blog/handoff-without-starting-over).

## Where PROXe fits

PROXe keeps one thread per customer across the channels you use, so what they asked, what they were told and what they want next sits in one place, not in a phone book. That is the idea behind [one memory across every channel](/blog/one-memory-every-channel) and why [saving the contact is not the same as following up](/blog/saving-the-contact-is-not-done). Your team opens a conversation and sees the whole story, on the right lead at the right moment.

How PROXe handles customers who hide their number depends on how your WhatsApp is connected, so ask for it in the [demo](/demo) and we will show you on your own setup. It is built for [clinics](/industries/clinics), [coaching academies](/industries/coaching), [real estate](/industries/realestate) and other businesses with a steady flow of enquiries. Plan details are on the [pricing page](/pricing).

## The takeaway

Do not let a phone number be the only thing that tells you who a customer is. Keep the conversation as the record, ask for a number when you truly need one, and check this week how many of your new chats already arrive without it.

If you want to see what one thread per customer looks like on your own enquiries, [book a demo](/demo).`

export default function WhatsappUsernamesCustomerPhoneNumberHiddenPage() {
  const slug = 'whatsapp-usernames-customer-phone-number-hidden'
  const pageUrl = 'https://goproxe.com/blog/whatsapp-usernames-customer-phone-number-hidden'
  const pageTitle = 'WhatsApp usernames: what if the number is hidden?'

  const tocItems = [
    { id: 'what-whatsapp-announced', text: 'What WhatsApp announced' },
    { id: 'why-it-matters-if-you-run-a-service-business', text: 'Why it matters if you run a service business' },
    { id: 'five-things-to-do-this-week', text: 'Five things to do this week' },
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
              <p>A patient messages your clinic on WhatsApp on Saturday. Your front desk replies, the patient asks about a Monday slot, then the chat goes quiet. On Monday the receptionist goes to call them. There is no number to call.</p>
              <p>That is not a bug in your phone. It is a change WhatsApp has started to make.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-whatsapp-announced">What WhatsApp announced</h2>
              <p>On 29 June 2026, WhatsApp said people can reserve a username and hide their phone number from anyone who does not have it saved. According to <a href="https://bleepingcomputer.com/news/security/whatsapp-rolls-out-usernames-to-help-users-hide-their-phone-number">BleepingComputer's report</a> of Meta's announcement, &quot;people will need to know your exact username to contact you for the first time.&quot; Users can reserve a name now, but the feature is rolling out gradually over several months, and people are notified when it reaches their country.</p>
              <p>For businesses on WhatsApp's business platform, messaging provider 360dialog <a href="https://360dialog.com/blog/whatsapp-usernames-business-impact-2026/">explains the practical change</a> (page last updated July 2026). A customer who adopts a username can arrive as a business-scoped user ID instead of a phone number. The same customer gets a different ID with each business. Their advice: keep the phone numbers you already have, add a field for the new ID, and do not assume every new chat comes with a number.</p>
              <p>360dialog also warns that flows such as click-to-WhatsApp ad conversations can break if a system only expects phone numbers. If you pay for those ads, that matters. Our post on a <a href="/blog/paid-lead-no-reply">paid lead with no reply</a> is about how expensive a silent chat already is.</p>
              <p>We have not seen Meta spell out every detail for the free WhatsApp Business app that many small clinics and academies use. So treat the exact behaviour there as something to check, not something we can promise.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-it-matters-if-you-run-a-service-business">Why it matters if you run a service business</h2>
              <p>Most small teams treat the phone number as the customer. It is the name in the follow-up sheet, the number on the reminder, the key that says &quot;this is the same person who asked last week.&quot;</p>
              <p>If a growing share of customers hide their number, three things get shaky:</p>
              <ol>
                <li><strong>Follow-up by phone call.</strong> No number, no call from the desk.</li>
                <li><strong>Spotting a repeat enquiry.</strong> The same parent writing again may look like a stranger.</li>
                <li><strong>Lists and reminders</strong> built only on phone numbers will quietly miss people.</li>
              </ol>
              <p>This hits owner-led businesses hardest. A clinic, a coaching academy, a broker or an interior designer often runs on one WhatsApp number and one sheet. When the sheet's key column goes blank, nobody notices until a lead has gone cold.</p>
            </section>

            <section className={styles.section}>
              <h2 id="five-things-to-do-this-week">Five things to do this week</h2>
              <ol>
                <li><strong>Look at your last 20 new chats.</strong> How many came with a number you can see? Note the date you first see one without it.</li>
                <li><strong>Stop keeping the number as the only key.</strong> Your sheet or system should hold a name, the channel and the chat itself, with the number as one field.</li>
                <li><strong>Ask for the number in the chat when you need to call.</strong> One plain line: &quot;Shall I call you on this number, or is there a better one?&quot; Say why you are asking. Our post on the <a href="/blog/dpdp-act-whatsapp-customer-chats-small-business">DPDP Act and customer chats</a> covers keeping that request reasonable. On the business platform, 360dialog also points to a &quot;Request Contact Info&quot; button for this.</li>
                <li><strong>Reply inside the chat first.</strong> If the chat is the thing you can always reach, <a href="/blog/follow-up-is-a-system">follow-up has to live in the chat</a>, not only on a phone list. A <a href="/blog/a-missed-call-is-still-a-lead">missed call is still a lead</a>, and so is a chat with no number.</li>
                <li><strong>Make sure the next person sees the whole thread.</strong> If the number is not there to anchor the story, the conversation has to be. See <a href="/blog/handoff-without-starting-over">handoff without starting over</a>.</li>
              </ol>
            </section>

            <section className={styles.section}>
              <h2 id="where-proxe-fits">Where PROXe fits</h2>
              <p>PROXe keeps one thread per customer across the channels you use, so what they asked, what they were told and what they want next sits in one place, not in a phone book. That is the idea behind <a href="/blog/one-memory-every-channel">one memory across every channel</a> and why <a href="/blog/saving-the-contact-is-not-done">saving the contact is not the same as following up</a>. Your team opens a conversation and sees the whole story, on the right lead at the right moment.</p>
              <p>How PROXe handles customers who hide their number depends on how your WhatsApp is connected, so ask for it in the <a href="/demo">demo</a> and we will show you on your own setup. It is built for <a href="/industries/clinics">clinics</a>, <a href="/industries/coaching">coaching academies</a>, <a href="/industries/realestate">real estate</a> and other businesses with a steady flow of enquiries. Plan details are on the <a href="/pricing">pricing page</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-takeaway">The takeaway</h2>
              <p>Do not let a phone number be the only thing that tells you who a customer is. Keep the conversation as the record, ask for a number when you truly need one, and check this week how many of your new chats already arrive without it.</p>
              <p>If you want to see what one thread per customer looks like on your own enquiries, <a href="/demo">book a demo</a>.</p>
            </section>
    </BlogPostWrapper>
  )
}
