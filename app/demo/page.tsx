import Link from 'next/link';
import { INDUSTRIES } from '../lib/industries';

/** Demo chooser — demo.goproxe.com/ lands here. Pick an industry, watch it run. */
export default function DemoChooser() {
  return (
    <main className="demo-choose">
      <h1>Pick a business. Watch PROXe run it.</h1>
      <p>Live simulated dashboards — leads arriving, chats answered, bookings landing.</p>
      <div className="demo-choose-grid">
        {INDUSTRIES.map((ind) => {
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
