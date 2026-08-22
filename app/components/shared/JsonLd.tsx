/**
 * Structured data for AI answer engines and search. Organization grounds who
 * PROXe is; SoftwareApplication carries the product + price range so "AI lead
 * conversion India" style answers can cite goproxe.com with real facts.
 * FAQPage matches the 10 visible FAQs on the homepage.
 */

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PROXe',
  url: 'https://goproxe.com',
  logo: 'https://goproxe.com/proxe/icon-512.png',
  description:
    'PROXe is an AI lead conversion system for small and medium businesses. It answers every lead in seconds across website chat, WhatsApp, Instagram, email and voice, qualifies them, and follows up until they respond.',
  foundingDate: '2025',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressCountry: 'IN',
  },
};

const SOFTWARE = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PROXe',
  url: 'https://goproxe.com',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI lead conversion for SMBs: every channel answered in seconds, one memory per customer, automatic follow-up, live dashboard. Up to 500 leads/month with 2 team seats.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '9999',
    highPrice: '24999',
    offerCount: '2',
  },
};

const FAQ_PAGE = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How fast is setup?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most businesses go live within 48 hours. Our team handles the setup, builds your custom flows, and trains the AI on your knowledge base. No technical work from your side.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you integrate with my CRM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PROXe replaces the need for a separate CRM by capturing, qualifying, and tracking every lead in one place. If you already use a CRM, we can sync leads, conversations, and stages into it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What channels are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Website chat, WhatsApp, Instagram DM, Facebook Messenger, Email, and Voice (inbound and outbound calls). All channels share one unified memory, so customers never repeat themselves.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All customer data is encrypted in transit and at rest. We are GDPR and CCPA compliant, and built to SOC 2 controls, though we are not yet SOC 2 certified. Scale includes a compliance review and private cloud deployment options.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can my team take over conversations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anytime. PROXe hands off to your team the moment you jump in, with full conversation context across every channel. The AI picks back up when you step away.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I go over 500 leads in a month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nothing switches off. We keep everything running and true up at renewal, and if you are consistently above 500 we move you to Scale on volume pricing. No lead is ever dropped for hitting a limit.',
      },
    },
    {
      '@type': 'Question',
      name: 'What counts as a lead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One lead is one unique person, no matter how many messages they send or how many channels they use. If someone messages you on WhatsApp, then Instagram, then calls, that is still one lead because it is one person. You are counted per person, never per message or per channel.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if a lead goes silent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PROXe automatically follows up across available channels. Smart nudges on WhatsApp, calls, email, and SMS bring cold prospects back. No opportunity dies from silence.',
      },
    },
    {
      '@type': 'Question',
      name: "Does it speak my customers' language?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. PROXe handles English, Hindi, Tamil, Telugu, Malayalam, Kannada, and more. Voice supports Indian languages with native accents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel anytime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. No long-term contracts on Core. Cancel anytime, keep your data export.',
      },
    },
  ],
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_PAGE) }}
      />
    </>
  );
}
