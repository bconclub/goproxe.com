import type { Metadata } from 'next';
import '@fontsource-variable/hubot-sans';
import './globals.css';
import LenisProvider from './components/shared/LenisProvider';
import AnalyticsScripts from './components/shared/AnalyticsScripts';
import ProxeWidget from './components/shared/ProxeWidget';
import JsonLd from './components/shared/JsonLd';
import { DeployModalProvider } from './contexts/DeployModalContext';

const TITLE = 'PROXe · Never Miss a Lead Ever Again · The AI Lead Conversion System';
const DESCRIPTION =
  'Every lead owned and answered in seconds across Website chat, WhatsApp, Instagram, Messenger, email and voice, all running on one memory so customers never repeat themselves. PROXe qualifies each lead, follows up until they respond, and hands your team the ones ready to buy. Up to 500 leads/month. 2 seats. Live dashboard.';

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
      <head>
        {/* The hero video is the first thing anyone sees, and it was paying full
            DNS + TCP + TLS to Vimeo before a single frame could move - several
            hundred ms of nothing on a cold visit. Warming both the player origin
            and the CDN that serves the segments means the connection is already
            open by the time the iframe asks for it. */}
        <link rel="preconnect" href="https://player.vimeo.com" crossOrigin="" />
        <link rel="preconnect" href="https://f.vimeocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://i.vimeocdn.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />
        <link rel="dns-prefetch" href="https://f.vimeocdn.com" />
        <JsonLd />
      </head>
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
