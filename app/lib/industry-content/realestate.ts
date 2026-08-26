import { FiUser, FiStar, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import type { IndustryPageContent } from '../industries';

/**
 * Real Estate, hand-written page content.
 *
 * Written to the broker/builder sales head. Outcome numbers are deliberately
 * absent, capability claims only, until per-client results can be sourced.
 */
const realestate: IndustryPageContent = {
  seoTitle: 'PROXe for Real Estate, every portal lead answered in seconds',
  seoDesc:
    'Real estate leads go cold in minutes. PROXe answers every inquiry instantly, qualifies budget and intent, books site visits, and follows up until the deal closes.',
  heroHeadline: 'The buyer messaged 5 builders. The first reply wins.',
  heroSub:
    'PROXe answers every property inquiry in seconds. WhatsApp, website, Instagram, calls, qualifies budget and timeline, books the site visit, and keeps following up until the deal moves. Your team talks only to buyers worth their time.',
  painIntro: 'Ask your sales team about last month. These four happened weekly:',
  painFixes: [
    {
      pain: {
        title: 'Portal leads going cold in the queue',
        body: 'A 99acres or MagicBricks lead lands, sits in someone’s inbox for six hours, and gets a call the next day. The buyer shortlisted with whoever replied while your lead was waiting.',
      },
      fix: {
        title: 'First reply in seconds, every time',
        body: 'PROXe engages the moment the inquiry lands, shares the floor plan, answers price and possession questions, and proposes a site visit before your competitor’s telecaller has picked up the phone.',
      },
    },
    {
      pain: {
        title: 'Telecallers chasing tyre-kickers',
        body: 'Half the day goes to callers with no budget match and no timeline. The serious ₹1.2 Cr buyer waits in the same list as someone browsing for 2029.',
      },
      fix: {
        title: 'Budget and intent qualified before a human touches it',
        body: 'PROXe asks the qualifying questions naturally in conversation, budget, location, timeline, loan status, and scores every lead. Your team opens the day with the hottest buyers on top, context attached.',
      },
    },
    {
      pain: {
        title: 'Site visits that never get booked',
        body: '“Interested” buyers stay interested and nothing more. Between shift changes and follow-up lists in someone’s head, the visit that closes deals never lands on a calendar.',
      },
      fix: {
        title: 'Visits proposed, booked and reminded automatically',
        body: 'PROXe offers concrete slots in the conversation, books the visit, sends directions, and reminds the buyer on the morning, so the visit that closes deals actually happens.',
      },
    },
    {
      pain: {
        title: 'Follow-up dies after the first call',
        body: 'The buyer said "call me after Diwali" and nobody did. CRM notes exist; the follow-up doesn’t. Deals leak in the gap between intention and memory.',
      },
      fix: {
        title: 'Persistent, polite follow-up until the deal moves',
        body: 'PROXe schedules and sends every follow-up on time, new inventory, price revisions, gentle nudges, across WhatsApp and email, and alerts your closer the moment the buyer re-engages.',
      },
    },
  ],
  steps: [
    {
      Icon: FiUser,
      label: 'Lead',
      title: '1. An inquiry lands',
      body: 'Portal, website, Instagram ad or a call. PROXe responds instantly with the right project details and starts a real conversation.',
    },
    {
      Icon: FiStar,
      label: 'Score',
      title: '2. Qualified and scored',
      body: 'Budget, location, timeline and loan status surface naturally in chat. Every lead gets a score, so your team sees the serious buyers first.',
    },
    {
      Icon: FiCalendar,
      label: 'Visit',
      title: '3. The site visit is booked',
      body: 'PROXe proposes slots, books the visit, sends directions and reminders, and reschedules without your team touching it.',
    },
    {
      Icon: FiCheckCircle,
      label: 'Close',
      title: '4. Follow-up until it closes',
      body: 'After the visit, PROXe keeps the thread alive, answers, documents, nudges, and hands your closer a buyer who is ready to talk numbers.',
    },
  ],
  faq: [
    {
      q: 'Does PROXe work with leads from 99acres, MagicBricks and Housing?',
      a: 'Yes. Portal leads, website forms, Instagram ads, WhatsApp and calls all land in one dashboard, deduplicated by phone number, each answered instantly.',
    },
    {
      q: 'Can it handle multiple projects with different pricing?',
      a: 'Yes. PROXe is trained on each project’s inventory, pricing, floor plans and possession dates, and answers with the right project’s details based on what the buyer asks.',
    },
    {
      q: 'What about RERA compliance in what it says?',
      a: 'PROXe only quotes the approved project information you give it. RERA numbers, carpet areas, prices. It never invents specifications or promises.',
    },
    {
      q: 'My team uses its own CRM. Does this replace it?',
      a: 'PROXe gives you a lead dashboard out of the box, and your team can keep closing the way they do today, you’ll simply stop losing leads before they reach the CRM.',
    },
    {
      q: 'How fast can it go live for my project?',
      a: '48 hours: we train PROXe on your projects, connect WhatsApp and your lead sources, and your telecallers keep working exactly as before, just on hotter leads.',
    },
  ],
};

export default realestate;
