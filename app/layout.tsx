import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from './components/shared/LenisProvider';
import AnalyticsScripts from './components/shared/AnalyticsScripts';
import { DeployModalProvider } from './contexts/DeployModalContext';

const TITLE = 'PROXe · Never Miss a Lead Ever Again · The AI Customer Acquisition System';
const DESCRIPTION =
  'The AI Customer Acquisition System. PROXe captures every lead across Website, WhatsApp, social, and calls — keeps the conversation alive and delivers ready-to-buy prospects to your team.';

export const metadata: Metadata = {
  metadataBase: new URL('https://goproxe.com'),
  title: {
    default: TITLE,
    template: '%s · PROXe',
  },
  description: DESCRIPTION,
  icons: {
    icon: '/proxe/favicon.ico',
    apple: '/proxe/brand/proxe-app-icon-1024.png',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://goproxe.com',
    siteName: 'PROXe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
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
        <AnalyticsScripts />
        <LenisProvider />
        <DeployModalProvider>
          {children}
        </DeployModalProvider>
      </body>
    </html>
  );
}
