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

export const metadata = {
  title: 'PROXe · The AI Customer Acquisition System',
  description:
    'PROXe captures every lead across Website, WhatsApp, social, and calls. Keeps the conversation alive. Delivers ready-to-buy prospects to your team.',
};

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
