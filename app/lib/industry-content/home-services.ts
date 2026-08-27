import {
  FiMessageCircle,
  FiCheckCircle,
  FiCalendar,
  FiUserCheck,
} from 'react-icons/fi';
import type { IndustryPageContent } from '../industries';

/**
 * Home Services, hand-written page content.
 *
 * Written to home service providers (plumbers, electricians, AC repair, etc.),
 * in scenes from request-to-job. Every leak has its fix in the same row.
 * Outcome numbers are deliberately absent: we cannot source per-client results
 * yet, so the copy claims capability only.
 */
const homeServices: IndustryPageContent = {
  seoTitle: 'PROXe for Home Services, never miss a job | PROXe',
  seoDesc:
    'An AI that answers WhatsApp, the site and calls, qualifies the job, books the slot, and follows up until they decide. You do the work. The inbox does not sit.',
  heroHeadline: 'They called while you were on a job. The one who answered got the work.',
  heroSub:
    'An AI that answers WhatsApp, the site and calls, qualifies the job, books the slot, and follows up until they decide. You do the work. The inbox does not sit.',
  painIntro: 'Every one of these is happening in your business this week:',
  painFixes: [
    {
      pain: {
        title: 'Lead while you are on a job',
        body: 'They WhatsApp at 2pm. You reply at 7. They already booked another crew.',
      },
      fix: {
        title: 'Answer in seconds, ask address and job type, offer two slots',
        body: 'Answer in seconds, ask address and job type, offer two slots.',
      },
    },
    {
      pain: {
        title: 'After-hours leak',
        body: 'AC dies at 10pm. You see it at 8am. Gone.',
      },
      fix: {
        title: "Answer at night, book tomorrow's first slot",
        body: "Answer at night, book tomorrow's first slot.",
      },
    },
    {
      pain: {
        title: 'Quote sent, never followed',
        body: 'They said they will think. Nobody wrote it down.',
      },
      fix: {
        title: 'Follow up until they book or opt out',
        body: 'Follow up until they book or opt out. Remember the thread.',
      },
    },
    {
      pain: {
        title: 'Instagram / site / call are three inboxes',
        body: '',
      },
      fix: {
        title: 'One memory',
        body: 'One memory. They never repeat themselves.',
      },
    },
  ],
  steps: [
    {
      Icon: FiMessageCircle,
      label: 'They request',
      title: '1. They request',
      body: 'WhatsApp, website chat or a call. PROXe answers immediately and understands what they need.',
    },
    {
      Icon: FiUserCheck,
      label: 'Qualified',
      title: '2. Qualified',
      body: 'PROXe asks qualifying questions to understand the job and urgency, logs the request with full context.',
    },
    {
      Icon: FiCalendar,
      label: 'Job booked',
      title: '3. Job booked',
      body: 'PROXe offers real slots and books the job in the same thread. No quote dies.',
    },
    {
      Icon: FiCheckCircle,
      label: 'Followed up to a yes or no',
      title: '4. Followed up to a yes or no',
      body: 'PROXe follows up until they book, commit or opt out. The thread is remembered.',
    },
  ],
  faq: [
    {
      q: 'How fast should I reply to a WhatsApp job?',
      a: 'Seconds. After 30 minutes you are usually second.',
    },
    {
      q: 'Can it book a job on my calendar?',
      a: 'Yes. It offers real slots and reminds them.',
    },
    {
      q: 'What if they ask for a price before a visit?',
      a: 'PROXe does not invent a quote. It books the visit and hands you the thread.',
    },
    {
      q: 'How long to go live?',
      a: '48 hours.',
    },
  ],
  closing:
    'PROXe is the AI that runs the customer side of your business. It answers every enquiry across WhatsApp, Instagram, your website and calls in seconds, qualifies the lead, books the appointment, and keeps following up until they decide, remembering every conversation along the way.',
};

export default homeServices;
