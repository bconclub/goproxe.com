// Copy for /pricing. A plain module (not 'use client') so the server page can
// build the FAQ JSON-LD from the same list the page renders.
import { PRICING } from '../lib/billing/pricing'
import { CORE_ALLOWANCE, GST_PERCENT, inr, num } from '../lib/billing/plan'

const SEAT_PRICE = PRICING.seat_price.INR / 100

export const INCLUDED = [
  'Website chat, WhatsApp, Instagram DM, Messenger, email and voice',
  'One memory per customer across every channel',
  'AI qualification and booking into your calendar',
  'Automated follow-ups until the lead answers',
  'Reminder calls before appointments',
  'Live dashboard with the voice assistant built in',
  'Hand-off to your team at any point, with full context',
]

export const HOW = [
  { t: 'Monthly reset.', d: 'Your included minutes and leads renew every month. Unused top-ups roll over to the next month.' },
  { t: 'Pay only for answered calls.', d: 'Unanswered or failed calls are free.' },
  { t: 'No lead is missed.', d: 'If you run out, PROXe still replies to every lead by text. Only calls pause until you add a pack.' },
  { t: 'WhatsApp fees are separate.', d: 'Meta bills them directly to your Meta Business account.' },
]

export const PRICING_FAQ: { q: string; a: string }[] = [
  {
    q: 'What counts as a lead?',
    a: 'One lead is one unique person PROXe handles in the month, however many messages they send and however many channels they use. Someone who messages on WhatsApp, then Instagram, then calls, is one lead.',
  },
  {
    q: 'What uses voice minutes?',
    a: `AI calls to your leads, reminder calls before appointments, and the voice assistant on your dashboard. Core includes ${num(CORE_ALLOWANCE.minutes)} minutes a month. Only answered calls count: unanswered or failed calls are free.`,
  },
  {
    q: 'What happens when I run out?',
    a: 'Nothing goes silent. PROXe keeps replying to every lead by text; only calls pause until you add a top-up pack.',
  },
  {
    q: 'How do top-up packs work?',
    a: 'Each pack is bought as either minutes or leads, your choice at purchase. Top-ups never expire at month end: anything unused rolls over, so your pool of extra minutes and leads keeps building.',
  },
  {
    q: 'Are WhatsApp charges included?',
    a: 'No. WhatsApp conversation fees are set by Meta and billed by Meta directly to your Meta Business account. PROXe does not mark them up.',
  },
  {
    q: 'How does GST work?',
    a: `All prices are in INR and exclusive of ${GST_PERCENT}% GST. If you add a valid GSTIN at checkout, reverse charge applies and GST is not added to the invoice; you self-assess it and claim the input credit.`,
  },
  {
    q: 'Can I add team members?',
    a: `Core includes ${CORE_ALLOWANCE.seats} seats. Add more anytime at ${inr(SEAT_PRICE)} per seat per month.`,
  },
  {
    q: 'When should I move to Scale?',
    a: 'If you are buying top-ups every month or running several locations, Scale prices your volume up front, with dedicated onboarding and support.',
  },
]
