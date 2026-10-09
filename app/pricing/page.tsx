import type { Metadata } from 'next'
import { proxeFontClass } from '../lib/fonts'
import PricingPage from './PricingPage'
import { PRICING_FAQ } from './content'
import '../styles/landing.css'

const TITLE = 'Plan & pricing'
const DESCRIPTION =
  'PROXe Core is ₹9,999 a month: 250 voice minutes, 1,000 leads and 2 team seats. Top-up packs roll over. Extra seats ₹999 a month.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://goproxe.com/pricing' },
  openGraph: { title: `${TITLE} · PROXe`, description: DESCRIPTION, url: 'https://goproxe.com/pricing' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PRICING_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

export default function Pricing() {
  return (
    <div className={`proxe-root ${proxeFontClass}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PricingPage />
    </div>
  )
}
