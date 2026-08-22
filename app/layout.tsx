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
        {/* Critical CSS inlined to unblock LCP (hero text "Ever Again.").
            Paints hero immediately without waiting for 40KB+ external stylesheet. */}
        <style dangerouslySetInnerHTML={{__html: `.proxe-root{--proxe-bg:#2e1e6b;--proxe-fg:#fff;--proxe-font-sans:var(--font-proxe-sans),'Inter',system-ui,-apple-system,sans-serif;--proxe-font-heading:'Hubot Sans Variable',var(--font-proxe-sans),'Inter',system-ui,sans-serif;color:var(--proxe-fg);background:var(--proxe-bg);font-family:var(--proxe-font-sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;min-height:100vh;color-scheme:light}html:has(.proxe-root),body:has(.proxe-root){background:#14102e!important}.proxe-main{width:100%;overflow-x:clip;position:relative;background:transparent}.proxe-page-grainient{position:fixed;inset:0;z-index:-1;width:100vw;height:100vh;pointer-events:none;background:linear-gradient(135deg,#7C3AED 0%,#4C1D95 50%,#1E1B4B 100%)}.proxe-container{width:100%;max-width:1200px;margin:0 auto;padding:0 24px}.proxe-float-header{position:fixed;top:18px;left:50%;transform:translateX(-50%);width:calc(100% - 64px);max-width:1160px;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:16px;pointer-events:none}.proxe-float-header>*{pointer-events:auto}.proxe-hero{position:relative;padding:180px 0 140px;text-align:center;isolation:isolate}@media (max-width:768px){.proxe-hero{padding:172px 0 96px}}.proxe-hero-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center}.proxe-hero-eyebrow{font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:18px;text-shadow:0 1px 3px rgba(10,20,60,.55)}.proxe-hero-title{font-family:var(--proxe-font-heading);font-size:clamp(30px,9.2vw,140px);line-height:.98;letter-spacing:.015em;margin:0;max-width:1200px;color:#fff;text-shadow:0 2px 30px rgba(10,20,60,.45),0 1px 2px rgba(10,20,60,.35)}.proxe-hero-line{display:block;white-space:nowrap}@media (max-width:768px){.proxe-hero-seg{display:block}.proxe-hero-title{letter-spacing:-.01em}}.proxe-hero-subtitle{margin:26px auto 0;max-width:580px;color:rgba(255,255,255,.72);font-family:var(--proxe-font-sans);font-weight:400;font-size:clamp(17px,1.55vw,22px);line-height:1.6;letter-spacing:.005em;text-shadow:0 1px 4px rgba(10,20,60,.45)}`}} />
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
