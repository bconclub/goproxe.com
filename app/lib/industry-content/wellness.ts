import {
  FiCalendar,
  FiCheckCircle,
  FiBell,
  FiHeart,
  FiPhoneCall,
  FiMessageCircle,
  FiRepeat,
  FiUserCheck,
  FiClock,
} from 'react-icons/fi';
import type { IndustryPageContent } from '../industries';

/**
 * Fitness & Wellness, hand-written page content.
 *
 * Written to studio owners, in scenes from trial-to-membership. Every leak
 * has its fix in the same row. Outcome numbers are deliberately absent: we
 * cannot source per-client results yet, so the copy claims capability only.
 */
const wellness: IndustryPageContent = {
  seoTitle: 'PROXe for Fitness & Wellness, never miss a trial again | PROXe',
  seoDesc:
    'Your studio loses trials after 9pm. PROXe answers WhatsApp, Instagram and calls, books the trial, reminds them, and follows up when they ghost.',
  heroHeadline: "Your studio loses trials after 9pm. PROXe doesn't.",
  heroSub:
    'An AI that answers WhatsApp, Instagram and calls, books the trial, reminds them, and follows up when they ghost. You coach. The inbox does not sit.',
  painIntro: 'Walk through your last week. All four of these happened:',
  painFixes: [
    {
      pain: {
        title: 'After-hours trial chat',
        body: 'They message at 10pm. You reply at 9am. They booked the gym that answered.',
      },
      fix: {
        title: "Answer in seconds, offer tomorrow's trial slot, book it",
        body: "PROXe replies instantly, sympathises, offers tomorrow's open slots, books one, confirms. The trial who messaged at 10 PM is in your studio at 9 AM, not your competitor's.",
      },
    },
    {
      pain: {
        title: 'Trials that never show',
        body: 'No reminder. Empty slot.',
      },
      fix: {
        title: 'Confirm, day-before, morning-of, one-tap reschedule',
        body: 'Every booking gets a confirmation, a day-before reminder and a morning-of nudge on WhatsApp, with one-tap reschedule instead of silent absence. A trial who cannot make it says so, instead of simply not arriving.',
      },
    },
    {
      pain: {
        title: 'Front desk on the floor',
        body: "You're training. WhatsApp fills up.",
      },
      fix: {
        title: 'PROXe takes the routine 80%. You take the people in the room',
        body: 'Slot queries, price questions, plan details, trial bookings. PROXe answers all of it on WhatsApp, Instagram and calls. You handle the humans in the room; the phone stops being a second job.',
      },
    },
    {
      pain: {
        title: 'Join after the trial dies',
        body: "They said they'll think about it. Nobody followed up.",
      },
      fix: {
        title: 'Follow up until they join or opt out. Remember the thread',
        body: "PROXe checks in after the trial, answers membership questions, and nudges politely until they join or say no. The relationship doesn't end when they walk out the door.",
      },
    },
  ],
  steps: [
    {
      Icon: FiMessageCircle,
      label: 'Message',
      title: '1. They message',
      body: 'WhatsApp, Instagram DM, website chat or a call. PROXe answers immediately, understands what they need, and offers real open trial slots.',
    },
    {
      Icon: FiCalendar,
      label: 'Book',
      title: '2. Trial booked',
      body: 'PROXe books the slot, sends a confirmation with directions and what to bring, and logs the trial with full context in your dashboard.',
    },
    {
      Icon: FiBell,
      label: 'Remind',
      title: '3. Reminded',
      body: 'Day-before and morning-of reminders with one-tap confirm or reschedule. A cancelled slot goes back into the pool instead of dying quietly.',
    },
    {
      Icon: FiHeart,
      label: 'Follow-up',
      title: '4. Followed up to membership',
      body: 'Post-trial check-in, membership plan answers, and automatic follow-up until they join or opt out. The thread is remembered.',
    },
  ],
  features: [
    {
      Icon: FiClock,
      title: 'After-hours capture',
      body: "A trial inquiry at 10 PM gets an instant reply and tomorrow's slot offered, so you are permanently the first to respond.",
    },
    {
      Icon: FiBell,
      title: 'WhatsApp reminders',
      body: 'Automated confirmations, day-before reminders and morning-of nudges, with one-tap confirm or reschedule built in.',
    },
    {
      Icon: FiHeart,
      title: 'Follow-up automation',
      body: 'Post-trial check-ins, membership plan answers, and polite nudges until they join or opt out, on autopilot.',
    },
    {
      Icon: FiMessageCircle,
      title: 'Instagram DMs from ads',
      body: 'Same memory as WhatsApp and the site. Every DM from a lead ad is answered instantly and the trial is booked.',
    },
    {
      Icon: FiRepeat,
      title: 'Reschedule made easy',
      body: 'Trials reschedule in the chat, without ever calling. A cancelled slot goes back into the pool immediately.',
    },
    {
      Icon: FiUserCheck,
      title: 'Trial intake',
      body: 'Names, contact details, fitness goal and trial preference are collected in the conversation and land structured in your dashboard.',
    },
  ],
  faq: [
    {
      q: 'How fast should I reply to a WhatsApp trial?',
      a: 'Seconds. After 30 minutes you are usually second.',
    },
    {
      q: 'Can it handle Instagram DMs from ads?',
      a: 'Yes. Same memory as WhatsApp and the site.',
    },
    {
      q: 'What if they ask a form question?',
      a: 'PROXe does not invent a plan. It books the trial and hands the coach the thread.',
    },
    {
      q: 'How long to go live?',
      a: '48 hours.',
    },
  ],
  closing: 'true',
};

export default wellness;
