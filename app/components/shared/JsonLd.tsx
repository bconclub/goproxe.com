/**
 * Structured data for AI answer engines and search. Organization grounds who
 * PROXe is; SoftwareApplication carries the product + price range so "AI lead
 * conversion India" style answers can cite goproxe.com with real facts.
 * Static by design: no FAQPage until the landing page renders matching FAQ
 * copy, mismatched markup does more harm than none.
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
    </>
  );
}
