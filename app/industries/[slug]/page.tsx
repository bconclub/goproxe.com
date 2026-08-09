import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INDUSTRIES, getIndustry, getPageContent } from '../../lib/industries';
import { proxeFontClass } from '../../lib/fonts';
import IndustryPageTemplate from '../../components/industry/IndustryPageTemplate';
import '../../styles/landing.css';
import '../../styles/industry.css';

/** All 8 pages are static — the registry is code, so build-time is fine. */
export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

// Next 15: params is a Promise — await it, everywhere, or the build warns/breaks.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  const page = getPageContent(industry);
  return {
    title: page.seoTitle,
    description: page.seoDesc,
    alternates: { canonical: `https://goproxe.com/industries/${slug}` },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDesc,
      url: `https://goproxe.com/industries/${slug}`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return (
    <div className={`proxe-root ${proxeFontClass}`} data-proxe-theme="light">
      <IndustryPageTemplate industry={industry} />
    </div>
  );
}
