import type { Metadata } from 'next'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = {
  title: 'People miss conversations. Then they lose the lead. | PROXe',
  description:
    'WhatsApp leads go cold overnight. Clinics, coaches, and brokers miss the chat. How fast to reply, what after-hours enquiries do, and how to stop the leak.',
  alternates: {
    canonical: 'https://goproxe.com/blog/people-miss-conversations',
  },
  openGraph: {
    images: ['https://goproxe.com/home/Conversations.webp'],
  },
}

const articleContent = `Parents do not enquire at 10am because that is when your counsellor is free. They enquire at 11pm. After the kid is in bed. After they have compared three institutes on Instagram. After they have already messaged two other numbers. You see the chat at 8:40 the next morning. You type a polite reply. They have already booked a counselling slot somewhere else. This is the leak. Not the ad. Not the offer. The conversation you were not in.

The searches are blunt. missed WhatsApp leads. how fast should I reply on WhatsApp. after hours WhatsApp enquiry. parents message at night coaching. patients WhatsApp during consult. site visit lead no reply. first broker to reply. They are not searching for AI transformation. They are searching because a chat sat there and the person on the other side left.

The five-minute window. Industry research on lead response is ugly and simple: reply inside five minutes and you are in the conversation. Wait thirty minutes and you are a callback they will ignore. WhatsApp makes that worse. The person is already in the app. They sent the same message to two other businesses. The first useful reply gets the slot.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How fast should I reply to a WhatsApp lead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Inside five minutes. On WhatsApp, seconds is better. After thirty minutes you are usually second.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do WhatsApp leads go cold overnight?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because they messaged more than one business. The one that answered after hours kept the thread.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I reply the next morning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can still recover some. Most of the high-intent ones already booked.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do clinics handle WhatsApp during consults?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They do not, if it lives on one phone. The inbox has to answer while the doctor is with a patient.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do academies handle parent chats after 9pm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Parents message after class/work/9pm; counsellor is off; by morning they booked the place that asked exam and batch.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do brokers not miss site-visit chats after 7pm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Same rule. First useful reply gets the visit. Paid leads die in unread chat.',
      },
    },
  ],
}

export default function BlogPostPage() {
  const slug = 'people-miss-conversations'
  const pageUrl = 'https://goproxe.com/blog/people-miss-conversations'
  const pageTitle = 'People miss conversations. Then they lose the lead.'

  const tocItems = [
    { id: 'what-clinics-coaches-and-brokers-are-actually-searching', text: 'What clinics, coaches, and brokers are actually searching' },
    { id: 'the-five-minute-window', text: 'The five-minute window' },
    { id: 'clinic', text: 'Clinic' },
    { id: 'coaching-academy', text: 'Coaching academy' },
    { id: 'real-estate', text: 'Real estate' },
    { id: 'what-not-to-do', text: 'What not to do' },
    { id: 'what-a-real-reply-does', text: 'What a real reply does' },
    { id: 'proxe', text: 'PROXe' },
    { id: 'questions-people-type-into-search-and-the-short-answers', text: 'Questions people type into search (and the short answers)' },
    { id: 'if-you-only-do-one-thing-this-week', text: 'If you only do one thing this week' },
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
              <p>Parents do not enquire at 10am because that is when your counsellor is free.</p>
              <p>They enquire at 11pm. After the kid is in bed. After they have compared three institutes on Instagram. After they have already messaged two other numbers.</p>
              <p>You see the chat at 8:40 the next morning. You type a polite reply.</p>
              <p>They have already booked a counselling slot somewhere else.</p>
              <p>This is the leak. Not the ad. Not the offer. The conversation you were not in.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-clinics-coaches-and-brokers-are-actually-searching">What clinics, coaches, and brokers are actually searching</h2>
              <p>The searches are blunt.</p>
              <p>missed WhatsApp leads</p>
              <p>how fast should I reply on WhatsApp</p>
              <p>after hours WhatsApp enquiry</p>
              <p>parents message at night coaching</p>
              <p>patients WhatsApp during consult</p>
              <p>site visit lead no reply</p>
              <p>first broker to reply</p>
              <p>They are not searching for "AI transformation." They are searching because a chat sat there and the person on the other side left.</p>
            </section>

            <section className={styles.section}>
              <h2 id="the-five-minute-window">The five-minute window</h2>
              <p>Industry research on lead response (MIT / InsideSales, cited across sales teams) is ugly and simple: reply inside five minutes and you are in the conversation. Wait thirty minutes and you are a callback they will ignore.</p>
              <p>WhatsApp makes that worse. The person is already in the app. They sent the same message to two other businesses. The first useful reply gets the slot.</p>
              <p>A next-morning reply is not late.</p>
              <p>It is a different conversation. They have already decided.</p>
            </section>

            <section className={styles.section}>
              <h2 id="clinic">Clinic</h2>
              <p>You are in consult. WhatsApp fills up. A new patient asked for a slot. You cannot type. They book the next clinic that answered.</p>
              <p>The search behind that: "patients WhatsApp during consult" and "never miss an appointment lead."</p>
              <p>The job is not a clever auto-reply. The job is: answer, qualify (new vs follow-up, which doctor, when), book, remind.</p>
              <p>How PROXe does this for <a href="/industries/clinics">clinics</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="coaching-academy">Coaching academy</h2>
              <p>Parents message after class. After work. After 9pm. Your counsellor is off. By morning the parent has a demo booked at the place that asked which exam and which batch.</p>
              <p>The search: "coaching admission WhatsApp" and "parents message at night."</p>
              <p>The job: answer, qualify (exam, class, locality), book counselling, follow up till they decide.</p>
              <p>How PROXe does this for <a href="/industries/coaching">coaching</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="real-estate">Real estate</h2>
              <p>You paid for the Meta lead. The site-visit chat lands while you are on another visit. You reply at 7pm. They are already with another broker.</p>
              <p>The search: "site visit enquiry no reply" and "first reply wins."</p>
              <p>The job: answer every channel, hold the conversation, book the visit, remind them the day before.</p>
              <p>How PROXe does this for <a href="/industries/realestate">real estate</a>.</p>
              <p>How PROXe does this for <a href="/industries/wellness">wellness</a>.</p>
              <p>How PROXe does this for <a href="/industries/professional-services">professional services</a>.</p>
              <p>How PROXe does this for <a href="/industries/home-services">home services</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-not-to-do">What not to do</h2>
              <p>A "we will call you tomorrow" greeting is not a conversation.</p>
              <p>It tells them you are closed. They will find someone who is not.</p>
              <p>Leaving the chat on a personal phone is not a system. The owner is in consult, in class, or on a site. The inbox does not care.</p>
              <p>Stopping after two follow-ups is how quiet leads die. Most of them were comparing, not rejecting you.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-a-real-reply-does">What a real reply does</h2>
              <p>1. Answers in seconds. Even at 11pm.</p>
              <p>2. Asks one useful question. Exam. Doctor. Budget range. Area. Timeline.</p>
              <p>3. Books the thing. Counselling, slot, site visit.</p>
              <p>4. Follows up until they decide.</p>
              <p>5. Remembers the thread. So the next message is not "hi, who is this?"</p>
              <p>That is the whole product.</p>
            </section>

            <section className={styles.section}>
              <h2 id="proxe">PROXe</h2>
              <p>PROXe is the AI that runs the customer side of your business. It answers every enquiry across WhatsApp, Instagram, your website and calls in seconds, qualifies the lead, books the appointment, and keeps following up until they decide, remembering every conversation along the way.</p>
              <p>You keep working.</p>
              <p>The conversation does not sit unread.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-people-type-into-search-and-the-short-answers">Questions people type into search (and the short answers)</h2>
              <p><strong>How fast should I reply to a WhatsApp lead?</strong></p>
              <p>Inside five minutes. On WhatsApp, seconds is better. After thirty minutes you are usually second.</p>
              <p><strong>Why do WhatsApp leads go cold overnight?</strong></p>
              <p>Because they messaged more than one business. The one that answered after hours kept the thread.</p>
              <p><strong>What if I reply the next morning?</strong></p>
              <p>You can still recover some. Most of the high-intent ones already booked.</p>
              <p><strong>How do clinics handle WhatsApp during consults?</strong></p>
              <p>They do not, if it lives on one phone. The inbox has to answer while the doctor is with a patient.</p>
              <p><strong>How do brokers not miss site-visit chats?</strong></p>
              <p>Same rule. First useful reply gets the visit. Paid leads die in unread chat.</p>
            </section>

            <section className={styles.section}>
              <h2 id="if-you-only-do-one-thing-this-week">If you only do one thing this week</h2>
              <p>Open last night's WhatsApp.</p>
              <p>Count the chats that sat more than an hour.</p>
              <p>That number is not "pending."</p>
              <p>It is conversations you were not in.</p>
              <p>Talk to PROXe on the site when you want the inbox to stop leaking.</p>
              <p><a href="https://goproxe.com">Talk to PROXe</a></p>
            </section>
    </BlogPostWrapper>
  )
}
