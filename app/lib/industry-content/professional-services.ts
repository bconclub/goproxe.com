import {
  FiMessageCircle,
  FiCheckCircle,
  FiCalendar,
  FiUserCheck,
} from 'react-icons/fi';
import type { IndustryPageContent } from '../industries';

/**
 * Professional Services, hand-written page content.
 *
 * Written to consulting/advisory/agency partners, in scenes from lead-to-close.
 * Every leak has its fix in the same row. Outcome numbers are deliberately absent:
 * we cannot source per-client results yet, so the copy claims capability only.
 */
const professionalServices: IndustryPageContent = {
  seoTitle: 'PROXe for Professional Services, never miss a discovery call | PROXe',
  seoDesc:
    'An AI that answers WhatsApp, the site and calls, qualifies the brief, books the discovery call, and follows up until they decide. You do the work. The inbox does not sit.',
  heroHeadline: 'The inbound lead sat while you were on a call. They booked someone else.',
  heroSub:
    'An AI that answers WhatsApp, the site and calls, qualifies the brief, books the discovery call, and follows up until they decide. You do the work. The inbox does not sit.',
  painIntro: 'Every one of these is happening in your business this week:',
  painFixes: [
    {
      pain: {
        title: 'Lead while you are with a client',
        body: 'They WhatsApp at 2pm. You reply at 7. They already booked another firm.',
      },
      fix: {
        title: 'Answer in seconds, ask one brief question, offer two slots',
        body: 'Answer in seconds, ask one brief question, offer two slots.',
      },
    },
    {
      pain: {
        title: '"Send a proposal" with no call',
        body: 'The PDF dies.',
      },
      fix: {
        title: 'Book the discovery call in the same thread',
        body: 'Book the discovery call in the same thread. Proposal after they show up.',
      },
    },
    {
      pain: {
        title: 'Follow-up lives in your head',
        body: 'They said next week. Nobody wrote it down.',
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
      label: 'They enquire',
      title: '1. They enquire',
      body: 'WhatsApp, website chat or a call. PROXe answers immediately and understands the brief.',
    },
    {
      Icon: FiUserCheck,
      label: 'Qualified',
      title: '2. Qualified',
      body: 'PROXe asks qualifying questions to understand scope and fit, logs the brief with full context.',
    },
    {
      Icon: FiCalendar,
      label: 'Discovery booked',
      title: '3. Discovery booked',
      body: 'PROXe offers real slots and books the discovery call in the same thread. No PDF dies.',
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
      q: 'How fast should I reply to a WhatsApp lead?',
      a: 'Seconds. After 30 minutes you are usually second.',
    },
    {
      q: 'Can it book a discovery call on my calendar?',
      a: 'Yes. It offers real slots and reminds them.',
    },
    {
      q: 'What if they ask for a price before a call?',
      a: 'PROXe does not invent a quote. It books the call and hands you the thread.',
    },
    {
      q: 'How long to go live?',
      a: '48 hours.',
    },
  ],
  closing:
    'PROXe is the AI that runs the customer side of your business. It answers every enquiry across WhatsApp, Instagram, your website and calls in seconds, qualifies the lead, books the appointment, and keeps following up until they decide, remembering every conversation along the way.',
};

export default professionalServices;
