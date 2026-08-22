import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPARISONS, getComparison } from '../../lib/comparisons';
import { proxeFontClass } from '../../lib/fonts';
import ComparisonPageTemplate from '../../components/compare/ComparisonPageTemplate';
import '../../styles/landing.css';
import '../../styles/industry.css';
import '../../styles/compare.css';

/** All 3 comparison pages are static — the registry is code, so build-time is fine. */
export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};

  const canonicalUrl = `https://goproxe.com/compare/${slug}`;

  // FAQPage JSON-LD structured data
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: comparison.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return {
    title: comparison.seoTitle,
    description: comparison.seoDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: comparison.seoTitle,
      description: comparison.seoDesc,
      url: canonicalUrl,
    },
    other: {
      'application/ld+json': JSON.stringify(faqJsonLd),
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  return (
    <div className={`proxe-root ${proxeFontClass}`} data-proxe-theme="light">
      <ComparisonPageTemplate comparison={comparison} />
    </div>
  );
}
