import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'A reminder is not a reply',
  description:
    'You set a phone reminder to reply at 6. The lead needed a slot at 2. A reminder is a promise to yourself. The desk is a next line in their thread now.',
  alternates: {
    canonical: 'https://goproxe.com/blog/a-reminder-is-not-a-reply',
  },
  openGraph: {
    images: ['https://goproxe.com/blog/a-reminder-is-not-a-reply.png'],
  },
}

const articleContent = `They asked for a slot. You set a reminder for after lunch. Or after the consult. Or for 7pm when the phone is quieter.

Your side felt handled. Their side still has silence.

A reminder is a promise to yourself. The desk is an ask, two times, or a book. The desk does the second one.

A reminder means you can find the ask later. The lead still waits.

The desk means the thread moved. Two facts. Two times. Or a clear handoff to a person with context.

If the last thing you did is tap Remind Me, you filed. You did not desk.

Clinic gets a WhatsApp at 11:40. Doctor is with a patient. Front desk sets a reminder for 1:30. At 12:15 the parent books the other clinic that answered in the chat.

Coaching institute gets a parent DM at 8:40pm. Counsellor is done for the day. Reminder for 9am. By 9am the seat is gone and the parent stopped reading your number.

Broker gets a Meta lead at 2pm. On a site visit. Reminder for evening. Evening is four other chats and a tired brain. The lead already walked another project.

Home service gets a call-back request at lunch. Reminder after the job. After the job is traffic, parts, and another ring. The job went to the crew that typed back while still on the ladder.

Same pattern. Different trades. The reminder protected your calendar. It did not protect the lead.

It feels like you did something. You acknowledged the ask. You put a clock on it. You did not forget on purpose.

But the lead does not live inside your reminder app. They live in the thread they opened. Blue ticks without a next line is still silence. A calendar ping at 6pm is still six hours of nothing on their side.

You measured your intent. They measured the gap.

Set reminder. Close chat.
Snooze. Snooze again.
Add to phone Notes: "reply Priya slot".
Tell yourself you will do all reminders in one block after 7.
Pass the reminder to a junior who is also in a consult.
Mark unread so it looks urgent later. Later never comes clean.

None of that puts a line in the thread.

Open the lead thread. Point at the last line they got.

If that line is missing and only your reminder list grew, you organized your evening. You did not offer a slot.

Done looks like: asked two facts, offered two times, booked, or handed to a person with context. Not a bell on your lock screen.

Reminders get worse at night. After 7pm the intent is honest. The clock is not.

"Remind me at 9am" sounds responsible. For a parent choosing a coaching seat tonight, 9am is another school. For a patient who wants tomorrow morning, 9am is already full elsewhere.

An away message plus a reminder is still not an answer. The desk answers now, qualifies, and books what it can. Or it holds a provisional slot and hands the thread in the morning with the facts already in place.

Clinics, coaches, brokers, spas, home services. Anyone whose phone is full of reminders and whose calendar still has holes.

If you keep promising yourself you will reply later and still miss Thursday, this page is the map.

Reply in the thread first. Short is fine.

Ask two facts that matter for a slot. Time window. Service or exam. Location if it matters. Who is coming.

Offer two times you can actually hold. Or book the one they pick. Or hand to a person with those facts already written so the lead does not start over.

Then, if you still want a reminder, remind yourself to check the booking, not to start the conversation.

The order matters. Desk first. Personal reminder second. Never the other way around when the thread is still empty on their side.

PROXe is the desk that finishes the thread, not the reminder that parks it.

It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. WhatsApp. Instagram. Web. Calls. One memory. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.

You stay on the consult. The desk still moves.

Talk to PROXe at goproxe.com. Founding is open at Rs 9,999/mo if you want the desk live without building it yourself.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is a reminder wrong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A reminder without a next line is.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I am with a client right now?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Then the desk still needs a next line. Short ask. Two times. Or a handoff. Do not wait for the reminder to fire.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PROXe replace my reminders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It runs the desk so the lead is not waiting on your lock screen.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if they need a person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It asks two facts, then hands the thread with context.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it replace the clinic or the coach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It runs the desk until a person or a slot.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long to go live?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '48 hours.',
      },
    },
  ],
}

export default function AReminderIsNotAReplyPage() {
  const slug = 'a-reminder-is-not-a-reply'
  const pageUrl = 'https://goproxe.com/blog/a-reminder-is-not-a-reply'
  const pageTitle = 'A reminder is not a reply'

  const tocItems = [
    { id: 'two-different-jobs', text: 'Two different jobs' },
    { id: 'what-actually-happens', text: 'What actually happens' },
    { id: 'why-the-reminder-feels-like-work', text: 'Why the reminder feels like work' },
    { id: 'what-people-run-instead', text: 'What people run instead' },
    { id: 'how-you-know-it-was-done', text: 'How you know it was done' },
    { id: 'the-after-hours-version', text: 'The after-hours version' },
    { id: 'who-this-is-for', text: 'Who this is for' },
    { id: 'what-to-do-instead-of-a-reminder', text: 'What to do instead of a reminder' },
    { id: 'then-proxe', text: 'Then PROXe' },
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
              <p>They asked for a slot. You set a reminder for after lunch. Or after the consult. Or for 7pm when the phone is quieter.</p>
              <p>Your side felt handled. Their side still has silence.</p>
              <p>A reminder is a promise to yourself. The desk is an ask, two times, or a book. The desk does the second one.</p>
            </section>

            <section className={styles.section}>
              <h2 id="two-different-jobs">Two different jobs</h2>
              <p>A reminder means you can find the ask later. The lead still waits.</p>
              <p>The desk means the thread moved. Two facts. Two times. Or a clear handoff to a person with context.</p>
              <p>If the last thing you did is tap Remind Me, you filed. You did not desk. <a href="/blog/ill-get-back-to-you-is-not-a-reply">I'll get back to you is not a reply</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-actually-happens">What actually happens</h2>
              <p>Clinic gets a WhatsApp at 11:40. Doctor is with a patient. Front desk sets a reminder for 1:30. At 12:15 the parent books the other clinic that answered in the chat.</p>
              <p>Coaching institute gets a parent DM at 8:40pm. Counsellor is done for the day. Reminder for 9am. By 9am the seat is gone and the parent stopped reading your number.</p>
              <p>Broker gets a Meta lead at 2pm. On a site visit. Reminder for evening. Evening is four other chats and a tired brain. The lead already walked another project.</p>
              <p>Home service gets a call-back request at lunch. Reminder after the job. After the job is traffic, parts, and another ring. The job went to the crew that typed back while still on the ladder.</p>
              <p>Same pattern. Different trades. The reminder protected your calendar. It did not protect the lead.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-the-reminder-feels-like-work">Why the reminder feels like work</h2>
              <p>It feels like you did something. You acknowledged the ask. You put a clock on it. You did not forget on purpose.</p>
              <p>But the lead does not live inside your reminder app. They live in the thread they opened. Blue ticks without a next line is still silence. A calendar ping at 6pm is still six hours of nothing on their side. <a href="/blog/seen-is-not-a-reply">Seen is not a reply</a>.</p>
              <p>You measured your intent. They measured the gap.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-people-run-instead">What people run instead</h2>
              <p>Set reminder. Close chat.</p>
              <p>Snooze. Snooze again.</p>
              <p>Add to phone Notes: "reply Priya slot". <a href="/blog/noted-is-not-a-next-line">Noted is not a next line</a>.</p>
              <p>Tell yourself you will do all reminders in one block after 7.</p>
              <p>Pass the reminder to a junior who is also in a consult.</p>
              <p>Mark unread so it looks urgent later. Later never comes clean. <a href="/blog/closing-the-inbox-is-not-done">Closing the inbox is not done</a>.</p>
              <p>None of that puts a line in the thread.</p>
            </section>

            <section className={styles.section}>
              <h2 id="how-you-know-it-was-done">How you know it was done</h2>
              <p>Open the lead thread. Point at the last line they got.</p>
              <p>If that line is missing and only your reminder list grew, you organized your evening. You did not offer a slot.</p>
              <p>Done looks like: asked two facts, offered two times, booked, or handed to a person with context. Not a bell on your lock screen.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-after-hours-version">The after-hours version</h2>
              <p>Reminders get worse at night. After 7pm the intent is honest. The clock is not. <a href="/blog/after-hours-whatsapp">After-hours WhatsApp</a>.</p>
              <p>"Remind me at 9am" sounds responsible. For a parent choosing a coaching seat tonight, 9am is another school. For a patient who wants tomorrow morning, 9am is already full elsewhere.</p>
              <p>An away message plus a reminder is still not an answer. The desk answers now, qualifies, and books what it can. Or it holds a provisional slot and hands the thread in the morning with the facts already in place.</p>
            </section>

            <section className={styles.section}>
              <h2 id="who-this-is-for">Who this is for</h2>
              <p>Clinics, coaches, brokers, spas, home services. Anyone whose phone is full of reminders and whose calendar still has holes.</p>
              <p>If you keep promising yourself you will reply later and still miss Thursday, this page is the map.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-to-do-instead-of-a-reminder">What to do instead of a reminder</h2>
              <p>Reply in the thread first. Short is fine.</p>
              <p>Ask two facts that matter for a slot. Time window. Service or exam. Location if it matters. Who is coming.</p>
              <p>Offer two times you can actually hold. Or book the one they pick. Or hand to a person with those facts already written so the lead does not start over.</p>
              <p>Then, if you still want a reminder, remind yourself to check the booking, not to start the conversation.</p>
              <p>The order matters. Desk first. Personal reminder second. Never the other way around when the thread is still empty on their side.</p>
            </section>

            <section className={styles.section}>
              <h2 id="then-proxe">Then PROXe</h2>
              <p>PROXe is the desk that finishes the thread, not the reminder that parks it.</p>
              <p>It answers, qualifies, books and follows up on every lead across every channel, so you never miss a lead ever again. WhatsApp. Instagram. Web. Calls. One memory. It asks. It books. Or it hands over with context. It does not invent a fee. It does not replace the clinic.</p>
              <p>You stay on the consult. The desk still moves.</p>
              <p>Talk to PROXe at <a href="/">goproxe.com</a>. Founding is open at Rs 9,999/mo if you want the desk live without building it yourself.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-ask">Questions people ask</h2>
              <p><strong>Is a reminder wrong?</strong></p>
              <p>No. A reminder without a next line is.</p>
              <p><strong>What if I am with a client right now?</strong></p>
              <p>Then the desk still needs a next line. Short ask. Two times. Or a handoff. Do not wait for the reminder to fire.</p>
              <p><strong>Does PROXe replace my reminders?</strong></p>
              <p>No. It runs the desk so the lead is not waiting on your lock screen.</p>
              <p><strong>What if they need a person?</strong></p>
              <p>It asks two facts, then hands the thread with context.</p>
              <p><strong>Does it replace the clinic or the coach?</strong></p>
              <p>No. It runs the desk until a person or a slot.</p>
              <p><strong>How long to go live?</strong></p>
              <p>48 hours.</p>
            </section>

            <section className={styles.section}>
              <p>A reminder is not a reply. Talk to PROXe on the site.</p>
            </section>
    </BlogPostWrapper>
  )
}
