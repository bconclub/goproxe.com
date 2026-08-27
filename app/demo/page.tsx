import Link from 'next/link';
import { INDUSTRIES } from '../lib/industries';

/** Demo chooser — demo.goproxe.com/ lands here. Pick an industry, watch it run. */
// The four verticals ads currently run for lead the grid; the rest follow.
const FEATURED = ['clinics', 'coaching', 'spa', 'realestate'];

export default function DemoChooser() {
  const ordered = [
    ...FEATURED.map((s) => INDUSTRIES.find((i) => i.slug === s)).filter((i): i is (typeof INDUSTRIES)[number] => !!i),
    ...INDUSTRIES.filter((i) => !FEATURED.includes(i.slug)),
  ];
  return (
    <main className="demo-choose">
      <h1>Pick your business. Watch PROXe run it.</h1>
      <p>A recorded walkthrough, then the real dashboard - live, on sample data, yours to click.</p>
      <div className="demo-choose-grid">
        {ordered.map((ind) => {
          const Icon = ind.Icon;
          return (
            <Link
              key={ind.slug}
              href={`/demo/${ind.slug}`}
              className="demo-choose-card"
              style={{ ['--card-acc' as string]: ind.color }}
            >
              <span className="demo-choose-ico"><Icon size={20} /></span>
              {ind.title}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
