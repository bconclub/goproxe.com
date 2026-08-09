import { notFound } from 'next/navigation';
import { INDUSTRIES, getIndustry } from '../../lib/industries';
import DemoApp from '../../components/demo/DemoApp';

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

// Next 15: params is a Promise. Only the SLUG crosses to the client —
// Industry records hold react-icons component functions, and functions
// cannot serialize across the server -> client boundary. DemoApp resolves
// the record from the registry on the client side.
export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getIndustry(slug)) notFound();
  return <DemoApp slug={slug} />;
}
