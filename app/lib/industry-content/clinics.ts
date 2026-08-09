import { FiCalendar, FiCheckCircle, FiBell, FiHeart } from 'react-icons/fi';
import type { IndustryPageContent } from '../industries';

/**
 * Clinics & Healthcare — hand-written page content.
 *
 * Written to the clinic OWNER, in scenes from their actual week. Every pain
 * has its fix in the same row; the stat quoted is the card's own (68% fewer
 * no-shows), never a new invented number.
 */
const clinics: IndustryPageContent = {
  seoTitle: 'PROXe for Clinics & Healthcare — never miss a patient again',
  seoDesc:
    'Clinics miss 4 in 10 appointment calls. PROXe answers every WhatsApp message and call instantly, books and confirms appointments, sends reminders, and cuts no-shows by 68%.',
  heroHeadline: 'Your front desk misses 4 in 10 calls. PROXe answers all of them.',
  heroSub:
    'PROXe is an AI receptionist for your clinic — it answers every WhatsApp message and phone call in seconds, books appointments into your calendar, reminds patients so they actually show up, and follows up after the visit. Your staff treats patients; PROXe handles the queue.',
  painIntro: 'Walk through your last week. All four of these happened:',
  painFixes: [
    {
      pain: {
        title: 'The 9 PM WhatsApp that never got answered',
        body: 'A patient messages at night — tooth pain, needs an appointment "as soon as possible". Nobody sees it till 10 AM. By then they have called the clinic two lanes down and gone there instead.',
      },
      fix: {
        title: 'Answered in seconds, at any hour',
        body: 'PROXe replies instantly — sympathises, offers tomorrow’s open slots, books one, confirms. The patient who messaged at 9 PM is in your chair at 10:30 AM, not your competitor’s.',
      },
    },
    {
      pain: {
        title: 'No-shows quietly eating the day',
        body: 'Three booked patients simply don’t turn up. No reminder went out, nobody called to confirm, and the doctor sat idle in slots someone else needed.',
      },
      fix: {
        title: 'Confirm + remind, automatically',
        body: 'Every booking gets a confirmation, a day-before reminder and a morning-of nudge on WhatsApp — with one-tap reschedule instead of silent absence. That flow is where the 68% fewer no-shows number comes from.',
      },
    },
    {
      pain: {
        title: 'Front desk drowning at peak hours',
        body: 'Between 10 and 12 the phone rings nonstop while a queue stands at the counter. Your receptionist can answer the call or the person in front of them — not both.',
      },
      fix: {
        title: 'The routine 80% handled by PROXe',
        body: 'Slot queries, price questions, directions, insurance checks, rescheduling — PROXe answers all of it on WhatsApp and calls. The desk handles the humans in the room; the phone stops being a second queue.',
      },
    },
    {
      pain: {
        title: 'No follow-up after the visit',
        body: 'The patient leaves and the relationship ends. No post-procedure check-in, no recall when the next cleaning is due — they come back only if they remember to.',
      },
      fix: {
        title: 'Follow-ups and recalls on schedule',
        body: 'PROXe checks in after the procedure, answers aftercare questions, and messages when the next visit is due. Patients feel looked after; your chair stays booked from your own patient base.',
      },
    },
  ],
  steps: [
    {
      Icon: FiCalendar,
      label: 'Request',
      title: '1. A patient reaches out',
      body: 'WhatsApp, website chat or a call — PROXe answers immediately, understands what they need, and offers real open slots from your calendar.',
    },
    {
      Icon: FiCheckCircle,
      label: 'Confirm',
      title: '2. The appointment is booked',
      body: 'PROXe books the slot, sends a confirmation with directions and prep instructions, and logs the patient with full context in your dashboard.',
    },
    {
      Icon: FiBell,
      label: 'Remind',
      title: '3. Reminders go out',
      body: 'Day-before and morning-of reminders with one-tap confirm or reschedule. A cancelled slot goes back into the pool instead of dying quietly.',
    },
    {
      Icon: FiHeart,
      label: 'Follow-up',
      title: '4. After the visit',
      body: 'Post-visit check-in, aftercare answers, and automatic recall when the next cleaning or review is due. The relationship doesn’t end at the door.',
    },
  ],
  faq: [
    {
      q: 'Is patient information safe with PROXe?',
      a: 'Yes. Conversations and patient details live in your own dashboard, are never used to train public models, and are never shared. You can export or delete any patient’s data at any time.',
    },
    {
      q: 'Does it work with my existing clinic number?',
      a: 'Yes — PROXe connects to your existing WhatsApp number, and can answer your clinic’s phone line with a natural voice agent. Patients notice faster replies, not a new number.',
    },
    {
      q: 'What about Hindi and regional languages?',
      a: 'PROXe converses naturally in English, Hindi and major regional languages, and switches automatically to whatever language the patient writes or speaks in.',
    },
    {
      q: 'What happens with a medical question it shouldn’t answer?',
      a: 'PROXe never gives medical advice. Anything clinical is acknowledged, captured, and routed to your staff instantly — the patient is told the doctor’s team will respond, and you get an alert with the full conversation.',
    },
    {
      q: 'How long does setup take?',
      a: 'About a week. We train PROXe on your treatments, prices, doctors, timings and FAQs, connect WhatsApp and your calendar, and hand you the dashboard. Your staff needs zero new software.',
    },
  ],
};

export default clinics;
