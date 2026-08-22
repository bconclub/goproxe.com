/**
 * Comparison page registry — single source of truth for all /compare/proxe-vs-*
 * pages. Each comparison is fair, factual, and cites no fabricated metrics.
 */

export type ComparisonFaq = { q: string; a: string };

export type ComparisonData = {
  slug: string;
  seoTitle: string;
  seoDesc: string;
  h1: string;
  competitor: {
    name: string;
    positioning: string;
  };
  intro: string;
  verdictTable: Array<{
    dimension: string;
    proxe: string;
    competitor: string;
  }>;
  competitorStrengths: Array<{ title: string; body: string }>;
  proxeStrengths: Array<{ title: string; body: string }>;
  coexistenceNote: string;
  icpScenarios: Array<{ scenario: string; verdict: string }>;
  faq: ComparisonFaq[];
};

export const COMPARISONS: ComparisonData[] = [
  {
    slug: "proxe-vs-wati",
    seoTitle: "PROXe vs Wati — AI Lead OS vs WhatsApp Inbox",
    seoDesc:
      "Compare PROXe and Wati. Wati excels as a WhatsApp Business inbox. PROXe converts leads across WhatsApp, web, IG, email & voice with unified memory.",
    h1: "PROXe vs Wati: Multi-Channel AI Lead OS vs WhatsApp BSP Inbox",
    competitor: {
      name: "Wati",
      positioning:
        "Wati is a WhatsApp Business Service Provider (BSP) platform focused on WhatsApp Business API access, team inbox, and broadcast capabilities.",
    },
    intro:
      "Wati is built around WhatsApp: it gives you official WhatsApp Business API access, a team inbox for managing conversations, and tools for broadcasting messages and automating replies on WhatsApp. PROXe is a multi-channel AI lead conversion OS: it unifies WhatsApp with your website, Instagram, email, and voice into one system with unified memory, so you never miss a lead no matter where they start.",
    verdictTable: [
      {
        dimension: "Core focus",
        proxe: "Multi-channel AI lead conversion with unified memory",
        competitor: "WhatsApp Business API platform & shared inbox",
      },
      {
        dimension: "Channels",
        proxe: "WhatsApp, Website, Instagram, Email, Voice",
        competitor: "WhatsApp (primary focus)",
      },
      {
        dimension: "Memory",
        proxe: "Unified memory across all channels — customers never repeat themselves",
        competitor: "WhatsApp conversation history",
      },
      {
        dimension: "Best for",
        proxe: "Coaches, clinics, real estate, wellness (Bangalore ICP) capturing leads everywhere",
        competitor: "Teams needing WhatsApp Business API + team inbox",
      },
    ],
    competitorStrengths: [
      {
        title: "Official WhatsApp BSP",
        body: "Wati is a Meta-approved WhatsApp Business Service Provider, giving you direct access to WhatsApp Business API with green tick verification.",
      },
      {
        title: "WhatsApp-first team inbox",
        body: "Built for teams managing high volumes of WhatsApp conversations with assignment, tags, and collaboration features.",
      },
      {
        title: "Broadcast & campaigns",
        body: "Strong Whatsapp broadcast tools for sending bulk messages, campaigns, and promotional content to opted-in contacts.",
      },
    ],
    proxeStrengths: [
      {
        title: "Multi-channel unified memory",
        body: "A lead can start on your website, continue on WhatsApp, and call later — PROXe remembers the entire conversation so they never repeat themselves.",
      },
      {
        title: "Voice AI included",
        body: "PROXe answers inbound calls and makes outbound follow-up calls in natural conversation, all in the same system.",
      },
      {
        title: "Lead conversion focus",
        body: "PROXe qualifies intent, scores leads, books appointments, and follows up automatically until the lead converts — not just a messaging platform.",
      },
    ],
    coexistenceNote:
      "PROXe and Wati can coexist: if you need WhatsApp Business API access through a BSP, you can use Wati for that layer while PROXe handles multi-channel lead conversion, scoring, and unified memory across all your channels.",
    icpScenarios: [
      {
        scenario:
          "Coaching academy in Bangalore getting inquiries on website, WhatsApp, and Instagram",
        verdict:
          "PROXe — unified memory means a student asking about batch timings on your website and following up on WhatsApp gets a coherent conversation, not two disconnected threads.",
      },
      {
        scenario:
          "Clinic receiving appointment requests via WhatsApp, website chat, and phone calls after hours",
        verdict:
          "PROXe — voice AI answers calls 24/7 and books appointments in the same system where WhatsApp and web leads land, all with unified memory.",
      },
      {
        scenario:
          "Team needing only WhatsApp Business API + team inbox for customer support",
        verdict:
          "Wati — if WhatsApp is the only channel you care about and you need team collaboration features, Wati's WhatsApp-first inbox is purpose-built for this.",
      },
      {
        scenario:
          "Real estate agency capturing leads from Google Ads, website, and WhatsApp, needing lead scoring and follow-up",
        verdict:
          "PROXe — multi-channel capture, automatic qualification, lead scoring, and persistent follow-up across WhatsApp, web, email, and voice.",
      },
    ],
    faq: [
      {
        q: "Is PROXe a Wati alternative?",
        a: "PROXe and Wati serve different needs. Wati is a WhatsApp Business Service Provider focused on WhatsApp messaging and team inbox. PROXe is a multi-channel AI lead OS that unifies WhatsApp, web, Instagram, email, and voice with unified memory — it's for converting leads across every channel, not just managing WhatsApp.",
      },
      {
        q: "Does PROXe replace WhatsApp API tools like Wati?",
        a: "PROXe includes WhatsApp as one channel in its multi-channel system. If your only need is WhatsApp Business API access and a team inbox, Wati is purpose-built for that. If you need to capture and convert leads across WhatsApp, web, Instagram, email, and voice with unified memory, PROXe is the system.",
      },
      {
        q: "Who should stay on Wati?",
        a: "Stay on Wati if WhatsApp is your primary or only channel and you need a team inbox with assignment, tags, and collaboration for managing high-volume WhatsApp support or campaigns.",
      },
      {
        q: "What does PROXe cost compared to Wati?",
        a: "PROXe Founding Core is ₹9,999/month (all channels, unified memory, 2 seats, up to 500 leads/month, voice AI included). Wati pricing varies by usage — check their website for current plans.",
      },
      {
        q: "How long does PROXe setup take?",
        a: "About 48 hours with assisted onboarding: we connect your channels (WhatsApp, website, Instagram, email, voice), train PROXe on your business, services, and tone, and hand you the dashboard. Wati setup depends on your WhatsApp Business API verification timeline.",
      },
    ],
  },
  {
    slug: "proxe-vs-interakt",
    seoTitle: "PROXe vs Interakt — Lead OS vs WhatsApp Marketing",
    seoDesc:
      "Interakt is WhatsApp marketing for growing brands. PROXe is a multi-channel AI lead OS — WhatsApp, web, IG, email, voice — with unified memory.",
    h1: "PROXe vs Interakt: AI Lead Conversion Across Channels vs WhatsApp Marketing",
    competitor: {
      name: "Interakt",
      positioning:
        "Interakt is a WhatsApp marketing and customer engagement platform focused on WhatsApp commerce, campaigns, and conversational marketing for growing brands.",
    },
    intro:
      "Interakt specializes in WhatsApp marketing: it helps e-commerce and D2C brands run campaigns, recover abandoned carts, and engage customers through WhatsApp with broadcast, automation, and catalog features. PROXe is a multi-channel AI lead conversion OS: it captures and converts leads across WhatsApp, website, Instagram, email, and voice with unified memory, focused on service businesses like coaching, clinics, real estate, and wellness in Bangalore.",
    verdictTable: [
      {
        dimension: "Core focus",
        proxe: "Multi-channel AI lead conversion for service businesses",
        competitor: "WhatsApp marketing & engagement for e-commerce/D2C",
      },
      {
        dimension: "Channels",
        proxe: "WhatsApp, Website, Instagram, Email, Voice",
        competitor: "WhatsApp (primary), integrations with e-commerce platforms",
      },
      {
        dimension: "Memory",
        proxe: "Unified memory across all channels — no repeated questions",
        competitor: "WhatsApp conversation history and e-commerce order data",
      },
      {
        dimension: "Best for",
        proxe: "Coaches, clinics, real estate, wellness capturing & converting leads",
        competitor: "E-commerce & D2C brands running WhatsApp campaigns",
      },
    ],
    competitorStrengths: [
      {
        title: "WhatsApp commerce features",
        body: "Interakt integrates with Shopify, WooCommerce, and other platforms for cart recovery, order updates, and product catalog sharing on WhatsApp.",
      },
      {
        title: "Campaign & broadcast tools",
        body: "Built for running marketing campaigns, drip sequences, and bulk broadcasts on WhatsApp with segmentation and analytics.",
      },
      {
        title: "E-commerce focus",
        body: "Purpose-built for online stores and D2C brands using WhatsApp as a sales and retention channel.",
      },
    ],
    proxeStrengths: [
      {
        title: "Service business ICP",
        body: "PROXe is built for coaches, clinics, real estate agents, and wellness businesses where the conversion journey is qualification → appointment → close, not cart → checkout.",
      },
      {
        title: "Voice AI included",
        body: "PROXe answers inbound calls and makes outbound follow-ups in natural conversation, essential for service businesses where phone calls are part of the lead journey.",
      },
      {
        title: "Multi-channel unified memory",
        body: "A lead inquiring on your website, following up on WhatsApp, and calling later gets one coherent conversation — PROXe remembers everything so customers never repeat themselves.",
      },
    ],
    coexistenceNote:
      "PROXe and Interakt target different ICPs: Interakt is for e-commerce/D2C brands using WhatsApp for commerce and campaigns; PROXe is for service businesses (coaching, clinics, real estate, wellness) capturing and converting leads across WhatsApp, web, Instagram, email, and voice.",
    icpScenarios: [
      {
        scenario:
          "D2C skincare brand sending abandoned cart reminders and product updates on WhatsApp",
        verdict:
          "Interakt — purpose-built for e-commerce WhatsApp campaigns, cart recovery, and order updates with platform integrations.",
      },
      {
        scenario:
          "Coaching academy in Bangalore getting inquiries on website, WhatsApp, Instagram, and calls",
        verdict:
          "PROXe — multi-channel unified memory means the same lead across 4 channels gets one coherent conversation, and voice AI handles after-hours calls.",
      },
      {
        scenario:
          "Online store running WhatsApp campaigns to drive repeat purchases and referrals",
        verdict:
          "Interakt — built for WhatsApp marketing campaigns, segmentation, and commerce automation for online brands.",
      },
      {
        scenario:
          "Real estate agency qualifying buyers across web forms, WhatsApp, and phone, needing lead scoring",
        verdict:
          "PROXe — captures leads everywhere, qualifies intent, scores leads, books site visits, and follows up across WhatsApp, web, email, and voice.",
      },
    ],
    faq: [
      {
        q: "Is PROXe an Interakt alternative?",
        a: "PROXe and Interakt serve different markets. Interakt is for e-commerce and D2C brands running WhatsApp campaigns and commerce automation. PROXe is a multi-channel AI lead OS for service businesses (coaching, clinics, real estate, wellness) capturing and converting leads across WhatsApp, web, Instagram, email, and voice.",
      },
      {
        q: "Can I use both PROXe and Interakt?",
        a: "Unlikely to need both — they target different ICPs. If you're an e-commerce brand, Interakt's WhatsApp commerce tools fit. If you're a service business capturing leads across channels and needing voice AI, PROXe is the system.",
      },
      {
        q: "Does Interakt work for service businesses in India?",
        a: "Interakt is built for e-commerce WhatsApp marketing. Service businesses (coaches, clinics, real estate) need multi-channel lead capture, qualification, appointment booking, and voice AI — that's PROXe's focus.",
      },
      {
        q: "What is PROXe's founding price?",
        a: "PROXe Founding Core is ₹9,999/month: all channels (WhatsApp, web, Instagram, email, voice), unified memory, 2 seats, up to 500 leads/month, voice AI included. Interakt pricing varies — check their site.",
      },
      {
        q: "Who is PROXe built for?",
        a: "PROXe is built for coaching academies, clinics, real estate agents, and wellness businesses in Bangalore capturing leads across WhatsApp, website, Instagram, email, and calls, needing unified memory and automatic qualification.",
      },
    ],
  },
  {
    slug: "proxe-vs-aisensy",
    seoTitle: "PROXe vs AiSensy — Conversion OS vs WhatsApp API",
    seoDesc:
      "AiSensy focuses on WhatsApp API & automation. PROXe unifies WhatsApp with web, Instagram, email, and voice into one AI lead conversion system.",
    h1: "PROXe vs AiSensy: Lead Conversion AI vs WhatsApp API Platform",
    competitor: {
      name: "AiSensy",
      positioning:
        "AiSensy is a WhatsApp Business API platform providing WhatsApp automation, chatbots, broadcasts, and team inbox for businesses in India.",
    },
    intro:
      "AiSensy provides WhatsApp Business API access, chatbot automation, broadcast campaigns, and a team inbox for managing WhatsApp conversations at scale. PROXe is a multi-channel AI lead conversion OS: it unifies WhatsApp with your website, Instagram, email, and voice into one system with unified memory, built for coaches, clinics, real estate agents, and wellness businesses in Bangalore that need to capture and convert leads everywhere.",
    verdictTable: [
      {
        dimension: "Core focus",
        proxe: "Multi-channel AI lead conversion with unified memory",
        competitor: "WhatsApp Business API platform & automation",
      },
      {
        dimension: "Channels",
        proxe: "WhatsApp, Website, Instagram, Email, Voice",
        competitor: "WhatsApp (primary)",
      },
      {
        dimension: "Memory",
        proxe: "Unified memory across all channels — leads never repeat themselves",
        competitor: "WhatsApp conversation history",
      },
      {
        dimension: "Best for",
        proxe: "Service businesses (coaches, clinics, real estate, wellness) in Bangalore",
        competitor: "Businesses needing WhatsApp API + automation",
      },
    ],
    competitorStrengths: [
      {
        title: "WhatsApp API infrastructure",
        body: "AiSensy provides official WhatsApp Business API access with green tick verification, shared team inbox, and WhatsApp Business account management.",
      },
      {
        title: "WhatsApp automation & chatbots",
        body: "Strong WhatsApp chatbot builder for automating FAQs, flows, and customer journeys within WhatsApp conversations.",
      },
      {
        title: "Broadcast at scale",
        body: "Built for sending bulk WhatsApp campaigns, drip sequences, and promotional messages to large contact lists with templates and scheduling.",
      },
    ],
    proxeStrengths: [
      {
        title: "Multi-channel unified memory",
        body: "PROXe remembers the entire conversation across website chat, WhatsApp, Instagram, email, and voice — a lead never has to repeat what they already told you.",
      },
      {
        title: "Voice AI for inbound & outbound calls",
        body: "PROXe answers calls 24/7, books appointments over the phone, and makes follow-up calls automatically, all in the same system where your web and WhatsApp leads land.",
      },
      {
        title: "Lead conversion, not just messaging",
        body: "PROXe qualifies intent, scores leads, books appointments, and follows up automatically until conversion — purpose-built for service businesses, not just a messaging API.",
      },
    ],
    coexistenceNote:
      "PROXe and AiSensy serve different needs: AiSensy provides WhatsApp API infrastructure and automation; PROXe is a multi-channel lead conversion OS. If you only need WhatsApp with chatbot automation, AiSensy fits. If you need to capture and convert leads across WhatsApp, web, Instagram, email, and voice with unified memory and voice AI, PROXe is the system.",
    icpScenarios: [
      {
        scenario:
          "Business needing only WhatsApp Business API + chatbot automation for customer support",
        verdict:
          "AiSensy — purpose-built for WhatsApp API access, chatbots, and automation if WhatsApp is your primary or only channel.",
      },
      {
        scenario:
          "Clinic in Bangalore getting appointment requests via website, WhatsApp, and after-hours calls",
        verdict:
          "PROXe — voice AI answers calls 24/7, books appointments, and unifies web + WhatsApp + voice with one memory so patients never repeat themselves.",
      },
      {
        scenario:
          "Real estate agency capturing leads from website forms, WhatsApp, Instagram DMs, and calls, needing lead scoring",
        verdict:
          "PROXe — multi-channel capture, automatic qualification, lead scoring, and persistent follow-up across web, WhatsApp, Instagram, email, and voice.",
      },
      {
        scenario:
          "E-commerce brand sending order updates and cart recovery messages via WhatsApp",
        verdict:
          "AiSensy — strong WhatsApp broadcast and automation tools for transactional messaging and campaigns at scale.",
      },
    ],
    faq: [
      {
        q: "Is PROXe an AiSensy alternative?",
        a: "PROXe and AiSensy serve different needs. AiSensy provides WhatsApp Business API access and automation. PROXe is a multi-channel AI lead OS that unifies WhatsApp with website, Instagram, email, and voice — it's for converting leads everywhere, not just managing WhatsApp.",
      },
      {
        q: "Does PROXe include WhatsApp like AiSensy?",
        a: "Yes, PROXe includes WhatsApp as one channel in its multi-channel system. Unlike AiSensy, PROXe unifies WhatsApp with your website, Instagram, email, and voice so leads get one coherent conversation with unified memory across all channels.",
      },
      {
        q: "Does PROXe have voice AI?",
        a: "Yes. PROXe includes voice AI for inbound and outbound calls. It answers calls 24/7, books appointments over the phone, and makes follow-up calls automatically — all in the same system where your web, WhatsApp, and Instagram leads land.",
      },
      {
        q: "How long does PROXe setup take?",
        a: "About 48 hours with assisted onboarding: we connect your channels (WhatsApp, website, Instagram, email, voice), train PROXe on your business, services, and tone, and hand you the dashboard. You're live in about a week.",
      },
      {
        q: "What does PROXe cost?",
        a: "PROXe Founding Core is ₹9,999/month: all channels (WhatsApp, website, Instagram, email, voice), unified memory, 2 seats, up to 500 leads/month, voice AI included. AiSensy pricing varies by usage — check their website.",
      },
    ],
  },
];

export const COMPARISON_SLUGS = COMPARISONS.map((c) => c.slug);

export function getComparison(slug: string): ComparisonData | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
