import type { Metadata } from 'next';
import { proxeFontClass } from '../lib/fonts';
import '../styles/landing.css';
import '../styles/demo.css';

/**
 * Demo layout — served at demo.goproxe.com/* via the middleware host rewrite,
 * and directly at /demo/* (dev, previews, pre-DNS prod).
 *
 * noindex is enforced three ways: here, the middleware's X-Robots-Tag, and a
 * disallow-all robots.txt on the demo host. Sales demos must never outrank
 * the real landing pages.
 */
export const metadata: Metadata = {
  title: 'Live Demo',
  description: 'Watch PROXe run a business like yours — live simulated dashboard.',
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`proxe-root ${proxeFontClass}`} data-proxe-theme="dark">
      {children}
    </div>
  );
}
