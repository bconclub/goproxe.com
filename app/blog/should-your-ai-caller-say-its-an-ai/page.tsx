import type { Metadata } from 'next'
import { withBlogSocial } from '../../lib/blogMetadata'
import { BlogPostWrapper } from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

export const metadata: Metadata = withBlogSocial('should-your-ai-caller-say-its-an-ai', {
  title: "Should your AI caller say it's an AI?",
  description:
    'AI voices now sound human. If an AI answers your clinic or academy phone, here is what to tell callers, what it may say, and when a person steps in.',
  alternates: {
    canonical: 'https://goproxe.com/blog/should-your-ai-caller-say-its-an-ai',
  },
})

const articleContent = `A patient calls your clinic at 7pm. The voice that answers is calm, warm, and gets her name right. She asks about a knee consult and talks for two minutes.

Then she asks: "Am I speaking to a real person?"

If you run a clinic, an academy or a property desk, that question is coming. This month it got more likely.

On 24 October 2026, Block (Jack Dorsey's company) showed a voice model called Dessa. Per TechCrunch, it listens and talks at the same time, and it produces laughs, pauses and crying. Block says it was trained entirely on human speech.

Two things to keep straight:

The demos are examples Block posted itself. They are not third-party evaluations.
It is not public. TechCrunch reports no public access today, and Block has asked safety researchers to test it, including for cases where a voice agent could trick people.

So this is not a tool you can buy today. It is a signal. AI voices that are hard to tell from a person are on their way. TechCrunch sets Dessa next to voice models from OpenAI, ElevenLabs and Fish Audio.

Most of us already pick up unknown numbers with some caution. A voice that sounds fully human, with no sign of what it is, adds to that.

The risk is not that the voice is too good. It is that a patient, parent or buyer feels tricked when they find out. Trust is what a clinic or an academy actually sells. A lead who feels deceived does not come back.

The good news: the fix is a few decisions you make once.

1. Does it say what it is?

We would say it in the first line: "Hi, this is the assistant for Dr Rao's clinic." Short, plain, no apology. Most callers do not mind. They mind being surprised later.

2. What is it allowed to say?

Timings, location, courses, how to book. Only what you gave it. A calm voice that guesses a fee is worse than a missed call. More in fast voice AI still needs the right answers and don't invent the price.

3. When does a person take over?

Anyone who asks for one. Anyone upset. Anyone asking something medical, legal or about money it was not given. See when they ask for a person.

4. What does the person see when they pick up?

The call summary and the earlier chat, so the caller never starts over. More in handoff without starting over.

A coaching academy gets a call at 8:40pm from a parent. The assistant says who it is, answers batch timings and the demo class slot from the details the academy gave it, and the parent asks about the fee for a scholarship case.

That one is not in its notes. It says a counsellor will call tomorrow at 10, and the counsellor opens a card with the full conversation. The parent was told the truth at each step.

Compare that with a voice that sounds like a person, guesses a fee, and gets caught.

A related read: a missed call is still a lead.

Rules on automated and AI calls in India are still settling, and sources disagree on what is binding today. We are not lawyers. Check with your telecom provider and your adviser before you run outbound AI calling. Answering calls that patients and parents make to you is the simpler case.

PROXe puts your team on the right lead at the right moment. For the phone, that means:

the voice agent answers from the details you gave it
anything outside that goes to a person, with the conversation attached
the call, the WhatsApp chat and the website enquiry sit in one thread per customer
the founder dashboard shows who is ready to move, so your team spends its time there

Want to hear how it sounds on your clinic's questions? See the clinic setup, the academy setup, or the real estate setup. Pricing is on the pricing page, or book a demo.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does an AI caller have to say it is an AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no single clear answer we can point to yet. We recommend saying it, because it protects trust whatever the rules turn out to be.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will callers hang up if it says so?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We have no data on this, so test it on your own calls. Our bet is that a wrong answer loses a caller faster than an honest opening line.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can it handle every question?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, and it should not try. Anything outside what you gave it goes to a person.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a human-sounding voice a good thing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A natural voice helps the call feel easy. It should not be used to hide what it is.',
      },
    },
  ],
}

export default function ShouldYourAiCallerSayItsAnAiPage() {
  const slug = 'should-your-ai-caller-say-its-an-ai'
  const pageUrl = 'https://goproxe.com/blog/should-your-ai-caller-say-its-an-ai'
  const pageTitle = "Should your AI caller say it's an AI?"

  const tocItems = [
    { id: 'what-happened', text: 'What happened' },
    { id: 'why-this-matters-to-your-desk', text: 'Why this matters to your desk' },
    { id: 'four-decisions-before-an-ai-answers-your-phone', text: 'Four decisions before an AI answers your phone' },
    { id: 'what-this-looks-like-on-a-tuesday', text: 'What this looks like on a Tuesday' },
    { id: 'a-note-on-rules', text: 'A note on rules' },
    { id: 'what-we-are-doing-about-it-at-proxe', text: 'What we are doing about it at PROXe' },
    { id: 'questions-we-get', text: 'Questions we get' },
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
              <p>A patient calls your clinic at 7pm. The voice that answers is calm, warm, and gets her name right. She asks about a knee consult and talks for two minutes.</p>
              <p>Then she asks: "Am I speaking to a real person?"</p>
              <p>If you run a clinic, an academy or a property desk, that question is coming. This month it got more likely.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-happened">What happened</h2>
              <p>On 24 October 2026, Block (Jack Dorsey's company) showed a voice model called Dessa. Per TechCrunch, it listens and talks at the same time, and it produces laughs, pauses and crying. Block says it was trained entirely on human speech. (<a href="https://techcrunch.com/2026/10/24/blocks-new-voice-model-sounds-eerily-human/" target="_blank" rel="noopener noreferrer">TechCrunch</a>)</p>
              <p>Two things to keep straight:</p>
              <ul>
                <li>The demos are examples Block posted itself. They are not third-party evaluations.</li>
                <li>It is not public. TechCrunch reports no public access today, and Block has asked safety researchers to test it, including for cases where a voice agent could trick people.</li>
              </ul>
              <p>So this is not a tool you can buy today. It is a signal. AI voices that are hard to tell from a person are on their way. TechCrunch sets Dessa next to voice models from OpenAI, ElevenLabs and Fish Audio.</p>
            </section>

            <section className={styles.section}>
              <h2 id="why-this-matters-to-your-desk">Why this matters to your desk</h2>
              <p>Most of us already pick up unknown numbers with some caution. A voice that sounds fully human, with no sign of what it is, adds to that.</p>
              <p>The risk is not that the voice is too good. It is that a patient, parent or buyer feels tricked when they find out. Trust is what a clinic or an academy actually sells. A lead who feels deceived does not come back.</p>
              <p>The good news: the fix is a few decisions you make once.</p>
            </section>

            <section className={styles.section}>
              <h2 id="four-decisions-before-an-ai-answers-your-phone">Four decisions before an AI answers your phone</h2>
              <p><strong>1. Does it say what it is?</strong></p>
              <p>We would say it in the first line: "Hi, this is the assistant for Dr Rao's clinic." Short, plain, no apology. Most callers do not mind. They mind being surprised later.</p>
              <p><strong>2. What is it allowed to say?</strong></p>
              <p>Timings, location, courses, how to book. Only what you gave it. A calm voice that guesses a fee is worse than a missed call. More in <a href="/blog/fast-voice-ai-still-needs-the-right-answers">fast voice AI still needs the right answers</a> and <a href="/blog/dont-invent-the-price">don't invent the price</a>.</p>
              <p><strong>3. When does a person take over?</strong></p>
              <p>Anyone who asks for one. Anyone upset. Anyone asking something medical, legal or about money it was not given. See <a href="/blog/when-they-ask-for-a-person">when they ask for a person</a>.</p>
              <p><strong>4. What does the person see when they pick up?</strong></p>
              <p>The call summary and the earlier chat, so the caller never starts over. More in <a href="/blog/handoff-without-starting-over">handoff without starting over</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-this-looks-like-on-a-tuesday">What this looks like on a Tuesday</h2>
              <p>A coaching academy gets a call at 8:40pm from a parent. The assistant says who it is, answers batch timings and the demo class slot from the details the academy gave it, and the parent asks about the fee for a scholarship case.</p>
              <p>That one is not in its notes. It says a counsellor will call tomorrow at 10, and the counsellor opens a card with the full conversation. The parent was told the truth at each step.</p>
              <p>Compare that with a voice that sounds like a person, guesses a fee, and gets caught.</p>
              <p>A related read: <a href="/blog/a-missed-call-is-still-a-lead">a missed call is still a lead</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="a-note-on-rules">A note on rules</h2>
              <p>Rules on automated and AI calls in India are still settling, and sources disagree on what is binding today. We are not lawyers. Check with your telecom provider and your adviser before you run outbound AI calling. Answering calls that patients and parents make to you is the simpler case.</p>
            </section>

            <section className={styles.section}>
              <h2 id="what-we-are-doing-about-it-at-proxe">What we are doing about it at PROXe</h2>
              <p>PROXe puts your team on the right lead at the right moment. For the phone, that means:</p>
              <ul>
                <li>the voice agent answers from the details you gave it</li>
                <li>anything outside that goes to a person, with the conversation attached</li>
                <li>the call, the WhatsApp chat and the website enquiry sit in one thread per customer</li>
                <li>the founder dashboard shows who is ready to move, so your team spends its time there</li>
              </ul>
              <p>Want to hear how it sounds on your clinic's questions? See the <a href="/industries/clinics">clinic setup</a>, the <a href="/industries/coaching">academy setup</a>, or the <a href="/industries/realestate">real estate setup</a>. Pricing is on the <a href="/pricing">pricing page</a>, or <a href="/demo">book a demo</a>.</p>
            </section>

            <section className={styles.section}>
              <h2 id="questions-we-get">Questions we get</h2>
              <p><strong>Does an AI caller have to say it is an AI?</strong></p>
              <p>There is no single clear answer we can point to yet. We recommend saying it, because it protects trust whatever the rules turn out to be.</p>
              <p><strong>Will callers hang up if it says so?</strong></p>
              <p>We have no data on this, so test it on your own calls. Our bet is that a wrong answer loses a caller faster than an honest opening line.</p>
              <p><strong>Can it handle every question?</strong></p>
              <p>No, and it should not try. Anything outside what you gave it goes to a person.</p>
              <p><strong>Is a human-sounding voice a good thing?</strong></p>
              <p>A natural voice helps the call feel easy. It should not be used to hide what it is.</p>
            </section>
    </BlogPostWrapper>
  )
}
