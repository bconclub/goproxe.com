import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import ProxeLanding from './components/ProxeLanding';
import './styles/landing.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-sans',
});

const heading = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-heading',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-proxe-mono',
});

// Title / description / OG inherited from the root layout metadata.

// Generate the homepage statically at build time to reduce TTFB
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function Page() {
  return (
    <div
      className={`proxe-root ${inter.variable} ${heading.variable} ${mono.variable}`}
      data-proxe-theme="light"
    >
      <ProxeLanding />
    </div>
  );
}
