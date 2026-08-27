import { notFound } from 'next/navigation';
import { INDUSTRIES, getIndustry } from '../../lib/industries';
import DemoGate from '../../components/demo/DemoGate';

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

// Next 15: params is a Promise. Only the SLUG crosses to the client —
// Industry records hold react-icons component functions, and functions
// cannot serialize across the server -> client boundary. The gate resolves
// the record from the registry on the client side.
//
// This used to mount the simulated DemoApp; per Z (Aug 09, reaffirmed 27 Aug)
// nothing ships that is not pixel-identical to the product, so the page is
// now the video + entry gate into the REAL demo dashboard.
export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getIndustry(slug)) notFound();
  return <DemoGate slug={slug} />;
}
