import { FiMessageCircle, FiUser, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import type { IndustryPageContent } from '../industries';

/**
 * Coaching Academies — hand-written page content.
 *
 * Written to the academy founder/counselling head. The card's own stat
 * (4.2× more enrollments) is the only claimed result.
 */
const coaching: IndustryPageContent = {
  seoTitle: 'PROXe for Coaching Academies — every inquiry becomes a counselling call',
  seoDesc:
    'Academies lose admissions in the gap between inquiry and counselling. PROXe answers every student and parent instantly, qualifies intent, books counselling calls, and follows up through the decision — 4.2× more enrollments.',
  heroHeadline: 'Admission season is won in the first five minutes.',
  heroSub:
    'A student asks about your batch, and four other academies too. PROXe answers instantly — fees, batches, results, demo classes — qualifies seriousness, books the counselling call, and follows up with the parent until the seat is taken.',
  painIntro: 'Every admission season, the same four leaks:',
  painFixes: [
    {
      pain: {
        title: 'Inquiries flooding in, counsellors drowning',
        body: 'Season peaks, 60 WhatsApp inquiries a day, two counsellors. Replies slip to the evening; by then the student’s parent has already visited the academy that answered at 11 AM.',
      },
      fix: {
        title: 'Every inquiry answered the minute it arrives',
        body: 'Fees, batch timings, faculty, results, EMI options — PROXe answers instantly and correctly at any volume, and the counselling call gets proposed in that first conversation.',
      },
    },
    {
      pain: {
        title: 'No way to tell serious from curious',
        body: 'The 12th-grader who needs a seat this month and the 10th-grader "just checking fees" look identical in the inbox. Counsellor hours go to the wrong conversations.',
      },
      fix: {
        title: 'Intent qualified in the conversation',
        body: 'Target exam, current class, timeline, budget comfort — PROXe learns them naturally and scores every inquiry, so counsellors spend their day on families ready to decide.',
      },
    },
    {
      pain: {
        title: 'Counselling calls that never get scheduled',
        body: '"We will visit this weekend" — and the weekend passes. Nobody chased, because chasing 40 maybes by hand is a full-time job nobody has.',
      },
      fix: {
        title: 'Calls booked and reminded automatically',
        body: 'PROXe proposes concrete slots, books the counselling call or campus visit, reminds the family, and reschedules no-shows — the calendar fills itself. That flow is where 4.2× more enrollments comes from.',
      },
    },
    {
      pain: {
        title: 'The decision window closes silently',
        body: 'After the counselling call, the family "will think about it". Two weeks later they’ve enrolled elsewhere — nobody followed up while they were deciding.',
      },
      fix: {
        title: 'Follow-up through the whole decision',
        body: 'Result proofs, batch-start reminders, early-bird deadlines, a check-in with the parent — PROXe runs the sequence until the family decides, and alerts your counsellor the moment they re-engage.',
      },
    },
  ],
  steps: [
    {
      Icon: FiMessageCircle,
      label: 'Inquiry',
      title: '1. A student (or parent) asks',
      body: 'WhatsApp, Instagram, website or a call — PROXe answers immediately with your fees, batches and results, in the language they wrote in.',
    },
    {
      Icon: FiUser,
      label: 'Qualify',
      title: '2. Seriousness is qualified',
      body: 'Exam, class, timeline and budget surface in the chat. Every inquiry is scored, so counsellors see decision-ready families first.',
    },
    {
      Icon: FiCalendar,
      label: 'Book',
      title: '3. The counselling call is booked',
      body: 'PROXe proposes slots, books the call or campus visit, and reminds the family — no-shows get rescheduled automatically.',
    },
    {
      Icon: FiCheckCircle,
      label: 'Enroll',
      title: '4. Followed up to enrollment',
      body: 'Through the deciding weeks, PROXe keeps the family engaged — results, deadlines, gentle nudges — until the seat is taken.',
    },
  ],
  faq: [
    {
      q: 'Parents ask in Hindi and regional languages. Can it handle that?',
      a: 'Yes — PROXe converses naturally in English, Hindi and major regional languages, switching automatically to whatever the parent writes in.',
    },
    {
      q: 'Can it quote our exact fee structure and discounts?',
      a: 'Yes. PROXe is trained on your batches, fees, EMI plans and scholarship criteria, and quotes only what you’ve approved — no invented discounts.',
    },
    {
      q: 'What about existing students asking doubts or schedules?',
      a: 'PROXe recognises existing students and handles schedule queries, batch changes and fee reminders too — admissions is just where it pays for itself first.',
    },
    {
      q: 'We run multiple branches. Does it route correctly?',
      a: 'Yes — it asks the preferred branch naturally and books the counselling call at the right one, with each branch seeing its own leads in the dashboard.',
    },
    {
      q: 'How long does it take to set up before peak season?',
      a: 'About a week: we train PROXe on your programs, results and fees, connect WhatsApp and your ad forms, and your counsellors keep their exact workflow — with a fuller calendar.',
    },
  ],
};

export default coaching;
