import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from './components/shared/LenisProvider';
import AnalyticsScripts from './components/shared/AnalyticsScripts';
import ProxeWidget from './components/shared/ProxeWidget';
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
  // Explicit list so every surface gets the right file: the .ico carries
  // 16/32/48 for browser tabs and Windows shortcuts, the PNGs cover retina
  // tabs, Android/PWA installs and the iOS home screen.
  icons: {
    icon: [
      { url: '/proxe/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/proxe/icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/proxe/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/proxe/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/proxe/favicon.ico',
    apple: [{ url: '/proxe/brand/proxe-app-icon-1024.png', sizes: '180x180' }],
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
        {/* The real PROXe agent, live on its own site. */}
        <ProxeWidget />
        <LenisProvider />
        <DeployModalProvider>
          {children}
        </DeployModalProvider>
      </body>
    </html>
  );
}
