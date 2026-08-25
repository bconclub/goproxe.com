/**
 * The industry registry, single source of truth.
 *
 * One record per industry drives FOUR surfaces: the landing-page carousel
 * cards (IndustriesSection), the /industries/[slug] internal pages, the
 * sitemap/OG metadata, and the demo dashboard's theming + simulation at
 * demo.goproxe.com/[slug]. Content lives here precisely so those surfaces can
 * never drift apart, change a stat once, it changes everywhere.
 *
 * Deep hand-written page content (clinics, realestate, coaching) lives in
 * ./industry-content/*.ts and overrides the generated default. The other five
 * industries get defaultPageContent(), which derives a serviceable page from
 * the card seed (desc/activities/flow/stat) until they earn hand-written copy.
 *
 * react-icons components are plain functions, so this module is safe to import
 * from server components and generateMetadata.
 */
import {
  FiMessageCircle,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiBell,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiShoppingCart,
  FiSend,
  FiMail,
  FiPackage,
  FiTool,
  FiTruck,
  FiActivity,
  FiZap,
  FiClock,
  FiBriefcase,
  FiAward,
  FiPhoneCall,
} from 'react-icons/fi';
import { FiHome } from 'react-icons/fi';
import { LuGraduationCap, LuStethoscope, LuDumbbell, LuCar } from 'react-icons/lu';
import clinicsPage from './industry-content/clinics';
import realestatePage from './industry-content/realestate';
import coachingPage from './industry-content/coaching';

export type Activity = { Icon: React.ElementType; top: string; sub: string };
export type Step = { Icon: React.ElementType; label: string };

/** A pain card and its 1:1 fix, the page renders them in the same order so
    the mapping is unmistakable. */
export type PainFix = {
  pain: { title: string; body: string };
  fix: { title: string; body: string };
};

export type IndustryPageContent = {
  seoTitle: string;
  seoDesc: string;
  heroHeadline: string;
  heroSub: string;
  painIntro: string;
  painFixes: PainFix[];
  /** Day-to-day walkthrough, expands the card's 4-step flow. */
  steps: Array<{ Icon: React.ElementType; label: string; title: string; body: string }>;
  /** The six capability cards ("everything your front desk needs"). Absent →
      generic defaults from defaultFeatures(). Always capability claims, never
      outcome numbers, same sourcing rule as `stat` above. */
  features?: Array<{ Icon: React.ElementType; title: string; body: string }>;
  faq: Array<{ q: string; a: string }>;
};

export type IndustryDemoConfig = {
  business: { name: string; initials: string; tagline: string };
  /** Pipeline column labels, in order. */
  stages: string[];
  /** What a landed conversion is called in this industry. */
  bookingNoun: string;
  /** Lead names fitting the market, the sim draws from these. */
  personas: string[];
  sources: Array<'WhatsApp' | 'Website' | 'Instagram' | 'Call'>;
  /** Opening customer messages. */
  inquiries: string[];
  /** Scripted agent responses (paired loosely with inquiries). */
  aiReplies: string[];
  /** Replies the simulated customer sends when the visitor types in a thread. */
  userReplyPool: string[];
  metricLabels: { m1: string; m2: string; m3: string; m4: string };
};

export type Industry = {
  id: string;
  /** Same as id, explicit, because it is a public URL segment. */
  slug: string;
  color: string;
  gradient: string;
  image?: string;
  Icon: React.ElementType;
  title: string;
  desc: string;
  activities: Activity[];
  flow: Step[];
  /**
   * DELIBERATELY not an outcome claim. These read as capability statements
   * ("Reminders / automated on WhatsApp and voice") rather than results
   * ("68% fewer no-shows"), because we cannot yet source per-client outcome
   * numbers and an unsourced statistic is the same credibility liability as a
   * fabricated testimonial, eight times over.
   *
   * The single exception is Home Services' "5x faster lead response": that is
   * a property of the product (an agent replies in seconds where a human
   * replies in hours), not a result that needs a client study behind it.
   *
   * When real deployment data exists, restore outcome numbers AND add a
   * source line ("Based on N deployments, <period>").
   */
  stat: string;
  statLabel: string;
  /**
   * What one inbound thing is CALLED in this industry, as a countable noun
   * ("a new enquiry", "a new abandoned cart"). Absent → 'enquiry'.
   *
   * Exists because defaultPageContent used to borrow `flow[0].label` for this.
   * Flow labels are step names and several are verbs, so D2C rendered the line
   * "A new abandon lands from any channel" on the live page. A step name and a
   * countable noun are different things; conflating them only reads correctly
   * by luck.
   */
  leadNoun?: string;
  /**
   * Whether this industry's conversion occupies a time slot. Absent → true,
   * which is right for appointments, site visits, test drives and the rest.
   *
   * D2C is the exception: an order is placed, not slotted into a calendar, so
   * the generic feature card was promising "real open slots" for buying a
   * serum. Copy that describes a different business than the reader's is worse
   * than no copy on that card.
   */
  booksTimeSlots?: boolean;
  /** Hand-written page content; absent → defaultPageContent() is used. */
  page?: IndustryPageContent;
  /**
   * Per-page layout variants, only where the approved reference designs
   * differ from each other: hero product visual and leak/fix treatment.
   * Absent → 'dashboard' + 'columns' (the clinic reference, the default).
   */
  variant?: { hero?: 'dashboard' | 'cards'; leak?: 'columns' | 'arrows' | 'orb' };
  /**
   * Section photography (Unsplash, committed to /public/unsplash/, credits in
   * _credits.json): `live` sits beside the live-in-action panels, `closing`
   * backs the closing band. Absent → the section renders without a photo.
   */
  images?: { live?: string; closing?: string };
  demo: IndustryDemoConfig;
};

export const INDUSTRIES: Industry[] = [
  {
    id: 'clinics',
    slug: 'clinics',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #06b6d4 110%)',
    image: '/industries/Healthcare.webp',
    Icon: LuStethoscope,
    title: 'Clinics & Healthcare',
    desc: 'Handle appointment requests across WhatsApp and calls. Never miss a patient.',
    activities: [
      { Icon: FiCalendar,    top: 'Appointment Request', sub: 'via WhatsApp' },
      { Icon: FiClock,       top: 'Tomorrow · 10:30 AM',  sub: '' },
      { Icon: FiCheckCircle, top: 'Confirmed',            sub: '' },
    ],
    flow: [
      { Icon: FiCalendar,    label: 'Request'  },
      { Icon: FiCheckCircle, label: 'Confirm'  },
      { Icon: FiBell,        label: 'Remind'   },
      { Icon: FiHeart,       label: 'Follow-up'},
    ],
    stat: 'Reminders',
    statLabel: 'automated on WhatsApp and voice',
    page: clinicsPage,
    images: { live: '/unsplash/clinics-live-eiqmc6c4.webp', closing: '/unsplash/clinics-closing-tl447mek.webp' },
    demo: {
      business: { name: 'Sunrise Dental Care', initials: 'SD', tagline: 'Multi-chair dental clinic · Indiranagar' },
      stages: ['New', 'Contacted', 'Booked', 'Visited'],
      bookingNoun: 'Appointment',
      personas: ['Ananya Rao', 'Vikram Shetty', 'Priya Nair', 'Rohit Malhotra', 'Sneha Kulkarni', 'Imran Khan', 'Divya Menon', 'Arjun Reddy', 'Kavitha Iyer', 'Suresh Patil', 'Meera Joshi', 'Farhan Ali'],
      sources: ['WhatsApp', 'Call', 'Website', 'WhatsApp'],
      inquiries: [
        'Hi, do you have any slot for teeth cleaning tomorrow?',
        'My son has tooth pain since last night. Can we come today?',
        'How much does a root canal cost at your clinic?',
        'Do you take Star Health insurance?',
        'Need an appointment for braces consultation this weekend.',
        'Is Dr. Shetty available on Saturday morning?',
      ],
      aiReplies: [
        'We have 11:00 AM and 4:30 PM open tomorrow. Which works better for you?',
        'So sorry to hear that, we keep emergency slots for exactly this. Can you come at 2:15 PM today?',
        'A root canal here is ₹6,500–₹9,000 depending on the tooth. The doctor confirms the exact cost after an X-ray, which is free with the consultation.',
        'Yes, we accept Star Health for all procedures above ₹5,000. Just carry your e-card.',
        'Saturday 10:30 AM is open for a braces consultation, shall I book it?',
      ],
      userReplyPool: [
        '11 AM works, thank you!',
        'Okay, booking it. Please send the address.',
        'That is fine. Do I need to bring anything?',
        'Great, see you then.',
      ],
      metricLabels: { m1: 'Appointments booked', m2: 'No-shows prevented', m3: 'After-hours requests caught', m4: 'Avg. response time' },
    },
  },
  {
    id: 'realestate',
    slug: 'realestate',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 60%, #34d399 110%)',
    image: '/industries/Real%20Estate.webp',
    Icon: FiHome,
    title: 'Real Estate',
    desc: 'Qualify buyers, book site visits, and follow up until the deal closes.',
    activities: [
      { Icon: FiCalendar,   top: 'Site Visit Scheduled', sub: 'via Website' },
      { Icon: FiTrendingUp, top: 'Lead Score',            sub: '92' },
    ],
    flow: [
      { Icon: FiUser,        label: 'Lead'   },
      { Icon: FiStar,        label: 'Score'  },
      { Icon: FiCalendar,    label: 'Visit'  },
      { Icon: FiCheckCircle, label: 'Close'  },
    ],
    stat: 'Site visits',
    statLabel: 'buyers qualified and booked automatically',
    page: realestatePage,
    variant: { hero: 'cards', leak: 'orb' },
    images: { live: '/unsplash/realestate-live-4453diqw.webp', closing: '/unsplash/realestate-closing-xfdfdmvy.webp' },
    demo: {
      business: { name: 'Skyline Properties', initials: 'SP', tagline: 'Residential & commercial · Whitefield' },
      stages: ['New', 'Qualified', 'Site Visit', 'Negotiation', 'Closed'],
      bookingNoun: 'Site visit',
      personas: ['Rahul Sharma', 'Deepika Verma', 'Manoj Pillai', 'Aisha Siddiqui', 'Karthik Subramanian', 'Neha Agarwal', 'Vivek Choudhary', 'Lakshmi Raghavan', 'Sameer Desai', 'Pooja Hegde', 'Aditya Kapoor', 'Ritu Bansal'],
      sources: ['Website', 'WhatsApp', 'Instagram', 'Call'],
      inquiries: [
        'Interested in the 3BHK in Whitefield. Is it still available?',
        'What is the price per sqft for the Sarjapur project?',
        'Looking for a 2BHK under 90L, ready to move. What do you have?',
        'Can I schedule a site visit this Sunday?',
        'Is the Whitefield property RERA registered?',
        'Do you have anything near good schools in HSR Layout?',
      ],
      aiReplies: [
        'Yes, two units are left, east-facing on the 8th and 11th floors. Would you like the floor plan and a site visit this week?',
        'The Sarjapur project is ₹7,200/sqft base, with possession in March. I can send the full cost sheet on WhatsApp.',
        'Three options fit that: 2BHKs in Whitefield (₹82L), Marathahalli (₹78L) and HSR (₹89L), all ready to move. Want the comparison sheet?',
        'Sunday works, 10:30 AM or 3:00 PM slot? Our site manager will walk you through personally.',
        'Fully RERA registered. PRM/KA/RERA/1251. I can send the certificate along with the brochure.',
      ],
      userReplyPool: [
        'Send me the cost sheet please.',
        'Sunday 10:30 works for the visit.',
        'What about the loan process?',
        'Okay, sharing my email for the brochure.',
      ],
      metricLabels: { m1: 'Site visits booked', m2: 'Leads qualified', m3: 'Follow-ups sent', m4: 'Avg. response time' },
    },
  },
  {
    id: 'd2c',
    slug: 'd2c',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fbbf24 110%)',
    image: '/industries/D2C.webp',
    Icon: FiShoppingCart,
    title: 'D2C & E-commerce',
    desc: 'Recover abandoned carts, answer product questions, and nudge hesitant buyers.',
    activities: [
      { Icon: FiShoppingCart, top: 'Abandoned Cart', sub: 'via Website' },
      { Icon: FiSend,         top: 'AI Nudge Sent',  sub: '15% Off Offer' },
    ],
    flow: [
      { Icon: FiShoppingCart, label: 'Abandon' },
      { Icon: FiSend,         label: 'Nudge'   },
      { Icon: FiMail,         label: 'Engage'  },
      { Icon: FiPackage,      label: 'Recover' },
    ],
    stat: 'Carts',
    statLabel: 'abandoned carts followed up automatically',
    leadNoun: 'abandoned cart',
    booksTimeSlots: false,
    variant: { hero: 'cards', leak: 'arrows' },
    images: { live: '/unsplash/d2c-live-g6q3lfae.webp', closing: '/unsplash/d2c-closing-k63or81f.webp' },
    demo: {
      business: { name: 'Aura Skincare', initials: 'AS', tagline: 'Clean beauty D2C · pan-India shipping' },
      stages: ['New', 'Engaged', 'Cart', 'Purchased'],
      bookingNoun: 'Order',
      personas: ['Shreya Gupta', 'Tanvi Mehta', 'Aarav Singh', 'Ishita Bose', 'Nikhil Jain', 'Riya Chatterjee', 'Zoya Khan', 'Dhruv Patel', 'Ankita Saxena', 'Varun Nambiar', 'Simran Kaur', 'Aditi Kulkarni'],
      sources: ['Instagram', 'Website', 'WhatsApp', 'Website'],
      inquiries: [
        'Is the vitamin C serum good for oily skin?',
        'I added the night cream to cart but does it work for sensitive skin?',
        'When will my order #4821 be delivered?',
        'Do you have COD for Delhi?',
        'Any offer running on the sunscreen combo?',
        'My previous order caused slight redness. What should I use instead?',
      ],
      aiReplies: [
        'Yes, it is oil-free and non-comedogenic, our most repurchased serum by oily-skin customers. Want me to apply the first-order 10% off?',
        'The night cream is fragrance-free and dermat-tested for sensitive skin. If it does not suit you, returns are free within 15 days.',
        'Order #4821 is out for delivery and should reach you by 7 PM today. Tracking: bit.ly/aura4821',
        'COD is available across Delhi NCR, no extra charge.',
        'The sunscreen combo is at 20% off till Sunday, and your cart qualifies for free shipping too.',
      ],
      userReplyPool: [
        'Okay, applying the code now.',
        'Great, placing the order!',
        'Thanks, that was fast.',
        'Can you suggest a moisturizer to go with it?',
      ],
      metricLabels: { m1: 'Carts recovered', m2: 'Orders assisted', m3: 'Questions answered', m4: 'Avg. response time' },
    },
  },
  {
    id: 'coaching',
    slug: 'coaching',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 60%, #ec4899 110%)',
    image: '/industries/Coaching.webp',
    Icon: LuGraduationCap,
    title: 'Coaching Academies',
    desc: 'Capture student inquiries, qualify intent, book consultations automatically.',
    activities: [
      { Icon: FiMessageCircle, top: 'New inquiry',  sub: 'MBA Program · via WhatsApp' },
      { Icon: FiUser,          top: 'AI Qualified', sub: 'High intent' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Inquiry'  },
      { Icon: FiUser,          label: 'Qualify'  },
      { Icon: FiCalendar,      label: 'Book'     },
      { Icon: FiCheckCircle,   label: 'Enroll'   },
    ],
    stat: 'Counselling',
    statLabel: 'inquiries qualified and calls booked',
    page: coachingPage,
    images: { live: '/unsplash/coaching-live-i4llt9g8.webp', closing: '/unsplash/coaching-closing-klbapl9m.webp' },
    demo: {
      business: { name: 'Ascent Academy', initials: 'AA', tagline: 'CAT / GMAT / UPSC coaching · Koramangala' },
      stages: ['Inquiry', 'Qualified', 'Consultation', 'Enrolled'],
      bookingNoun: 'Consultation',
      personas: ['Akash Tiwari', 'Sanya Malik', 'Harsha Vardhan', 'Nandini Krishnan', 'Yash Thakur', 'Fatima Sheikh', 'Pranav Kulkarni', 'Ishaan Bhatt', 'Mahima Reddy', 'Kabir Anand', 'Tara Menon', 'Rohan Dubey'],
      sources: ['WhatsApp', 'Instagram', 'Website', 'Call'],
      inquiries: [
        'What is the fee for the CAT 2027 batch?',
        'My daughter is in 12th. Which batch should she join for CLAT?',
        'Do you have weekend-only batches for working professionals?',
        'How were your CAT results last year?',
        'Is there a demo class before enrolling?',
        'Difference between your classroom and online program?',
      ],
      aiReplies: [
        'The CAT 2027 comprehensive batch is ₹65,000 with EMI options. There is an early-bird ₹8,000 off till the 15th, shall I book you a free counselling call to walk through it?',
        'For CLAT starting in 12th, our 1-year foundation batch fits best, classes after school hours. A quick call with our counsellor would map her prep plan; when is she free?',
        'Yes. Saturday-Sunday batches, 9 AM to 1 PM, designed for working professionals. Same faculty as weekday batches.',
        '41 of our students crossed 99 percentile last year, 6 converted IIM A/B/C. Happy to share the full result sheet.',
        'Absolutely, attend any one live class free before you decide. Which subject would you like to sit in on?',
      ],
      userReplyPool: [
        'Book the counselling call please.',
        'Saturday works for the demo class.',
        'Send the result sheet.',
        'What are the EMI options?',
      ],
      metricLabels: { m1: 'Consultations booked', m2: 'Inquiries qualified', m3: 'Follow-ups sent', m4: 'Avg. response time' },
    },
  },
  {
    id: 'fitness',
    slug: 'fitness',
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, #831843 0%, #db2777 60%, #f472b6 110%)',
    image: '/industries/Wellness.webp',
    Icon: LuDumbbell,
    title: 'Fitness & Wellness',
    desc: 'Convert trial signups, reduce no-shows, and re-engage lapsed members.',
    activities: [
      { Icon: FiUser,        top: 'Free Trial Inquiry', sub: 'via Instagram' },
      { Icon: FiCheckCircle, top: 'Trial Booked',       sub: 'Session #1' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Inquiry'   },
      { Icon: FiCalendar,      label: 'Trial'     },
      { Icon: FiBell,          label: 'Follow-up' },
      { Icon: FiHeart,         label: 'Retain'    },
    ],
    stat: 'Trials',
    statLabel: 'booked, reminded and followed up',
    images: { live: '/unsplash/fitness-live-cqfnt66t.webp', closing: '/unsplash/fitness-closing-pktk6guc.webp' },
    demo: {
      business: { name: 'Pulse Fitness Studio', initials: 'PF', tagline: 'Strength · CrossFit · Yoga · HSR Layout' },
      stages: ['Inquiry', 'Trial Booked', 'Trial Done', 'Member'],
      bookingNoun: 'Trial session',
      personas: ['Aditya Rane', 'Kriti Sharma', 'Joel Mathew', 'Nisha Patel', 'Siddharth Rao', 'Ayesha Merchant', 'Kunal Bhatia', 'Ramya Srinivasan', 'Arnav Ghosh', 'Tanya Kapoor', 'Vishal Yadav', 'Leah Fernandes'],
      sources: ['Instagram', 'WhatsApp', 'Website', 'Call'],
      inquiries: [
        'What are your membership plans?',
        'Do you have ladies-only batch timings?',
        'I want to try one CrossFit class before joining.',
        'Is there a trainer for weight loss programs?',
        'What time does the 6 AM batch fill up?',
        'I was a member last year. Any rejoining offer?',
      ],
      aiReplies: [
        'Monthly is ₹2,500, quarterly ₹6,500, annual ₹19,000 with 2 months free. First trial session is on us, want me to book one?',
        'Yes, ladies-only batches at 10 AM and 5 PM with our female trainers. Shall I book a trial in either slot?',
        'Love it. Free trial CrossFit class, tomorrow 7 AM or 6:30 PM. Which one do I lock in?',
        'Our transformation program pairs you with a dedicated trainer + diet plan, 12 weeks. First assessment session is free.',
        'The 6 AM batch usually fills by month-start. Two spots are open right now, should I reserve one?',
      ],
      userReplyPool: [
        'Book me for 7 AM tomorrow!',
        'The 5 PM ladies batch please.',
        'What should I bring for the trial?',
        'Reserve the spot, I will confirm by evening.',
      ],
      metricLabels: { m1: 'Trials booked', m2: 'No-shows prevented', m3: 'Members re-engaged', m4: 'Avg. response time' },
    },
  },
  {
    id: 'pro',
    slug: 'pro',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #075985 0%, #0284c7 60%, #38bdf8 110%)',
    image: '/industries/Proffesional-services.webp',
    Icon: FiBriefcase,
    title: 'Professional Services',
    desc: 'Qualify leads, book discovery calls, and route hot prospects to partners.',
    activities: [
      { Icon: FiPhoneCall,   top: 'Discovery Call', sub: 'via LinkedIn' },
      { Icon: FiCalendar,    top: 'Call Booked',    sub: 'Tue, 4:00 PM' },
    ],
    flow: [
      { Icon: FiUser,        label: 'Lead'    },
      { Icon: FiCheckCircle, label: 'Qualify' },
      { Icon: FiCalendar,    label: 'Book'    },
      { Icon: FiActivity,    label: 'Route'   },
    ],
    stat: 'Discovery',
    statLabel: 'leads qualified and calls scheduled',
    leadNoun: 'lead',
    images: { live: '/unsplash/pro-live-hpdjdl8m.webp', closing: '/unsplash/pro-closing-rayjmmma.webp' },
    demo: {
      business: { name: 'Meridian Advisors', initials: 'MA', tagline: 'CA firm · tax, audit & compliance' },
      stages: ['Lead', 'Qualified', 'Discovery Call', 'Proposal'],
      bookingNoun: 'Discovery call',
      personas: ['Rajesh Krishnamurthy', 'Shalini Gupta', 'Mohammed Rizwan', 'Preeti Chandra', 'Ashok Menon', 'Gauri Deshpande', 'Nitin Aggarwal', 'Swati Kulkarni', 'Venkat Raman', 'Alisha D’Souza', 'Manish Tripathi', 'Rekha Pillai'],
      sources: ['Website', 'Call', 'WhatsApp', 'Website'],
      inquiries: [
        'I need help with GST filing for my new business.',
        'What do you charge for private limited company registration?',
        'Got an income tax notice, need urgent consultation.',
        'Do you handle payroll compliance for a 40-person company?',
        'Can you take over our books mid-financial-year?',
        'Need an audit done before our funding round.',
      ],
      aiReplies: [
        'We handle end-to-end GST, registration, monthly filing, reconciliation. For a new business it starts at ₹2,000/month. A 20-minute discovery call would scope it exactly; tomorrow 4 PM work?',
        'Pvt Ltd registration is ₹12,999 all-inclusive (govt fees + DSC + DIN), done in 10–12 days. Want the checklist of documents?',
        'Notices are time-sensitive. I am marking this urgent. Our senior partner has a slot today at 6 PM; shall I book it and you can share the notice copy meanwhile?',
        'Yes, payroll, PF, ESI, PT compliance for teams up to 200. We would need one call to see your current setup.',
        'Mid-year takeovers are routine for us, we reconcile from your last filed period. Discovery call this week to review the books?',
      ],
      userReplyPool: [
        'Tomorrow 4 PM works.',
        'Send the document checklist.',
        'Booking the 6 PM slot, sharing the notice now.',
        'Yes, let us do a call this week.',
      ],
      metricLabels: { m1: 'Discovery calls booked', m2: 'Leads qualified', m3: 'Urgent cases routed', m4: 'Avg. response time' },
    },
  },
  {
    id: 'auto',
    slug: 'auto',
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 60%, #94a3b8 110%)',
    image: '/industries/Car%20Dealerships.webp',
    Icon: LuCar,
    title: 'Auto Dealerships',
    desc: 'Answer inventory questions, book test drives, and reactivate cold leads.',
    activities: [
      { Icon: FiTruck,    top: 'Inventory Inquiry', sub: 'via Website' },
      { Icon: FiCalendar, top: 'Test Drive Booked', sub: 'Sat, 11:00 AM' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Inquiry' },
      { Icon: FiZap,           label: 'Respond' },
      { Icon: FiCalendar,      label: 'Book'    },
      { Icon: LuCar,           label: 'Drive'   },
    ],
    stat: 'Test drives',
    statLabel: 'enquiries answered and drives booked',
    images: { live: '/unsplash/auto-live-rvedgpd.webp', closing: '/unsplash/auto-closing-ebpfjy7t.webp' },
    demo: {
      business: { name: 'Velocity Motors', initials: 'VM', tagline: 'Multi-brand dealership · Old Madras Road' },
      stages: ['Inquiry', 'Qualified', 'Test Drive', 'Purchased'],
      bookingNoun: 'Test drive',
      personas: ['Suraj Naik', 'Priyanka Das', 'Feroz Ahmed', 'Anjali Bhosale', 'Girish Kamath', 'Namrata Singh', 'Terence D’Cruz', 'Bhavana Shetty', 'Alok Mishra', 'Sherin Thomas', 'Raghav Khanna', 'Mitali Shah'],
      sources: ['Website', 'Call', 'WhatsApp', 'Instagram'],
      inquiries: [
        'Is the Creta SX(O) diesel available in white?',
        'What is the on-road price of the Nexon EV in Bangalore?',
        'Best exchange value for my 2021 Baleno?',
        'Can I book a test drive for this Saturday?',
        'Any year-end offers on the XUV700?',
        'How long is the waiting period for the Scorpio-N?',
      ],
      aiReplies: [
        'White SX(O) diesel is in stock, one unit, arriving Thursday. I can hold it 48 hours with a refundable ₹5,000. Test drive this week?',
        'Nexon EV Prime on-road Bangalore is ₹16.8L. With the current corporate discount it comes to ₹16.3L. Want the detailed breakup?',
        'A 2021 Baleno in good condition fetches ₹5.2–5.8L in exchange right now, plus ₹20,000 exchange bonus this month. Bring it in for a 15-minute evaluation?',
        'Saturday test drives: 11 AM and 4 PM open. Which one, and which variant would you like to drive?',
        'Year-end on XUV700: ₹45,000 cash discount + accessories worth ₹15,000 on AX5 and above, till stocks last.',
      ],
      userReplyPool: [
        'Book Saturday 11 AM.',
        'Send the price breakup on WhatsApp.',
        'I will come for the evaluation tomorrow.',
        'Hold the white one for me.',
      ],
      metricLabels: { m1: 'Test drives booked', m2: 'Inquiries answered', m3: 'Cold leads revived', m4: 'Avg. response time' },
    },
  },
  {
    id: 'home',
    slug: 'home',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fbbf24 110%)',
    image: '/industries/House%20Service.webp',
    Icon: FiTool,
    title: 'Home Services',
    desc: 'Dispatch jobs fast. Capture, qualify, and schedule every service request.',
    activities: [
      { Icon: FiTool,        top: 'Service Request', sub: 'via WhatsApp' },
      { Icon: FiCalendar,    top: 'Job Scheduled',    sub: 'Wed, 2:00 PM' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Request'  },
      { Icon: FiCheckCircle,   label: 'Qualify'  },
      { Icon: FiCalendar,      label: 'Schedule' },
      { Icon: FiAward,         label: 'Complete' },
    ],
    stat: '5×',
    statLabel: 'faster lead response',
    leadNoun: 'job request',
    images: { live: '/unsplash/home-live-is5gdeld.webp', closing: '/unsplash/home-closing-wrzbarqn.webp' },
    demo: {
      business: { name: 'HomeFix Services', initials: 'HF', tagline: 'AC · plumbing · electrical · painting' },
      stages: ['Request', 'Qualified', 'Scheduled', 'Completed'],
      bookingNoun: 'Job',
      personas: ['Ramesh Iyer', 'Sunita Devi', 'Abdul Kareem', 'Jyoti Bhatt', 'Prakash Naidu', 'Helen Varghese', 'Dinesh Rawat', 'Kalpana Shinde', 'Sohail Qureshi', 'Vidya Murthy', 'Gopal Krishnan', 'Asha Rani'],
      sources: ['WhatsApp', 'Call', 'Website', 'WhatsApp'],
      inquiries: [
        'My AC is not cooling at all. Can someone come today?',
        'Need a plumber for a leaking kitchen tap.',
        'What do you charge for full house deep cleaning, 2BHK?',
        'Power keeps tripping in one room. Electrician needed.',
        'Want a quote for painting a 3BHK interior.',
        'Geyser stopped working this morning.',
      ],
      aiReplies: [
        'Our AC technician can reach you between 3 and 5 PM today. Visit charge ₹249, waived if you go ahead with the repair. Shall I book it?',
        'Tap leak, our plumber has a 6 PM slot today or 10 AM tomorrow. Which one should I lock?',
        '2BHK deep cleaning is ₹3,499 (kitchen + 2 bathrooms included), 4–5 hours, eco-friendly chemicals. Weekday slots have 10% off.',
        'Frequent tripping usually means an overloaded circuit or a faulty MCB, our electrician can diagnose today evening. Booking the 5 PM visit?',
        'For a 3BHK interior our estimator visits free, measures, and gives a fixed quote in 24 hours. Tomorrow morning work?',
      ],
      userReplyPool: [
        'Yes book the 3–5 PM slot.',
        '10 AM tomorrow please.',
        'Weekday is fine, book the cleaning.',
        'Send the technician today itself.',
      ],
      metricLabels: { m1: 'Jobs scheduled', m2: 'Requests captured', m3: 'Same-day dispatches', m4: 'Avg. response time' },
    },
  },
];

export const INDUSTRY_SLUGS = INDUSTRIES.map((i) => i.slug);

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

/**
 * Serviceable page content generated from the card seed, used for industries
 * that have not yet earned hand-written copy. Deliberately concrete: pains are
 * scenes, not abstractions, and each fix mirrors its pain 1:1.
 */
export function defaultPageContent(ind: Industry): IndustryPageContent {
  // NOT flow[0].label — those are step names, and several are verbs. See the
  // leadNoun docs on the Industry type.
  const first = ind.leadNoun ?? 'enquiry';
  return {
    seoTitle: `PROXe for ${ind.title}`,
    seoDesc: `${ind.desc} See how PROXe runs ${ind.title.toLowerCase()} on autopilot, ${ind.stat} ${ind.statLabel}.`,
    heroHeadline: `${ind.title} lose leads every day. PROXe doesn't.`,
    heroSub: ind.desc + ' PROXe answers on WhatsApp, your website, Instagram and calls, instantly, 24/7, and follows up until the job is done.',
    painIntro: 'Every one of these is happening in your business this week:',
    painFixes: [
      {
        pain: { title: 'Leads arrive after hours', body: 'Messages land at 9 PM, calls come on Sunday. By the time someone replies on Monday, they have already gone with whoever answered first.' },
        fix: { title: 'PROXe answers in seconds, 24/7', body: 'Every WhatsApp message, website chat and missed call gets an instant, useful reply, at 9 PM, on Sunday, always. You are permanently the first to respond.' },
      },
      {
        pain: { title: 'Follow-ups depend on memory', body: 'Interested people go quiet, and nobody has time to chase every one of them. The quiet ones are where the revenue leaks.' },
        fix: { title: 'Automatic, persistent follow-up', body: 'PROXe nudges every unanswered lead across WhatsApp, email and SMS until they respond, politely, on schedule, without anyone remembering to.' },
      },
      {
        pain: { title: 'No one knows which lead is hot', body: 'Every inquiry looks the same in a full inbox. The serious buyer waits in the same queue as the tyre-kicker.' },
        fix: { title: 'Every lead scored and sorted', body: 'PROXe scores intent from the conversation itself, so your team opens the day looking at the hottest leads first, with full context attached.' },
      },
    ],
    steps: ind.flow.map((s, i) => ({
      Icon: s.Icon,
      label: s.label,
      title: `${i + 1}. ${s.label}`,
      body:
        i === 0
          ? `A new ${first.toLowerCase()} lands from any channel. PROXe captures it, replies instantly, and starts the conversation.`
          : i === 1
            ? 'PROXe asks the right questions, answers theirs, and moves the conversation forward on its own, no staff time spent.'
            : i === ind.flow.length - 1
              ? 'PROXe keeps the thread warm until it actually converts, and logs every touch on the lead so nothing is lost.'
              : 'Scheduling, confirmations and reminders happen inside the conversation, on time, without anyone chasing.',
    })),
    faq: [
      { q: 'How fast can PROXe go live for my business?', a: 'Deployment takes about a week: we train PROXe on your services, prices, tone and FAQs, connect your WhatsApp and website, and hand you the dashboard.' },
      { q: 'Does it speak my customers’ language?', a: 'Yes. PROXe converses naturally in English, Hindi and regional languages, and switches automatically to whatever the customer uses.' },
      { q: 'What happens when it can’t answer something?', a: 'It says so honestly, captures the question, and routes the conversation to you instantly, you get an alert with full context.' },
      { q: 'Do I need new software or a new number?', a: 'No. PROXe connects to your existing WhatsApp number and website. Your team just gets one dashboard where everything lands.' },
    ],
  };
}

/**
 * Generic capability cards for industries without hand-written ones.
 * Phrased as product properties (what PROXe does), never as client outcomes,
 * same sourcing rule as `stat`.
 */
export function defaultFeatures(ind: Industry): NonNullable<IndustryPageContent['features']> {
  const noun = ind.demo.bookingNoun.toLowerCase();
  return [
    { Icon: FiPhoneCall, title: 'Missed-call recovery', body: `A missed call gets an instant WhatsApp reply, so the lead is in a conversation before they dial a competitor.` },
    { Icon: FiZap, title: 'Instant answers, 24/7', body: 'Prices, availability, directions, common questions, answered in seconds on every channel, at any hour.' },
    ind.booksTimeSlots === false
      ? { Icon: FiCalendar, title: `${ind.demo.bookingNoun} completion`, body: `PROXe answers the last question, applies the offer and closes the ${noun} inside the conversation, no back-and-forth, no forms.` }
      : { Icon: FiCalendar, title: `${ind.demo.bookingNoun} booking`, body: `PROXe offers real open slots and books the ${noun} in the conversation, no back-and-forth, no forms.` },
    { Icon: FiBell, title: 'Reminders and follow-ups', body: 'Confirmations, day-before reminders and polite nudges go out on schedule, without anyone remembering to send them.' },
    { Icon: FiTrendingUp, title: 'Every lead scored', body: 'Intent is read from the conversation itself, so your team opens the day on the hottest leads with full context attached.' },
    { Icon: FiMessageCircle, title: 'One dashboard', body: 'Every conversation from every channel writes back to one system, nothing lives in a personal phone.' },
  ];
}

/** The page content for an industry, hand-written when present, generated otherwise. */
export function getPageContent(ind: Industry): IndustryPageContent {
  return ind.page ?? defaultPageContent(ind);
}
