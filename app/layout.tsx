import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from './components/shared/LenisProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://goproxe.com'),
  title: {
    default: 'PROXe · The AI Customer Acquisition System',
    template: '%s · PROXe',
  },
  description:
    'PROXe captures every lead across Website, WhatsApp, social, and calls. Keeps the conversation alive. Delivers ready-to-buy prospects to your team.',
  icons: {
    icon: '/proxe/favicon.ico',
    apple: '/proxe/PROXe Favicon.png',
  },
  openGraph: {
    title: 'PROXe · The AI Customer Acquisition System',
    description:
      'Never miss a lead. PROXe runs the full pipeline across every channel.',
    url: 'https://goproxe.com',
    siteName: 'PROXe',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}
