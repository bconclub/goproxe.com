import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * The share card for a narrated page (/pitch, /what-is-proxe): the brand
 * gradient, the PROXe wordmark, the page's own headline and one line under it.
 * Inter (500 and 800) is bundled from app/lib/fonts so the headline is truly bold.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export async function pageOg({ eyebrow, title, line, chips }: { eyebrow: string; title: string[]; line: string; chips: string[] }) {
  const dir = path.join(process.cwd(), 'app/lib');
  const [logo, regular, bold] = await Promise.all([
    readFile(path.join(dir, 'og-proxe-logo-white.png')),
    readFile(path.join(dir, 'fonts/Inter-500.ttf')),
    readFile(path.join(dir, 'fonts/Inter-800.ttf')),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 72, color: '#fff', fontFamily: 'Inter', position: 'relative',
          background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 48%, #1E1B4B 100%)',
        }}
      >
        <div style={{ position: 'absolute', top: -200, right: -160, width: 620, height: 620, borderRadius: 620, background: '#a78bfa', opacity: 0.28, filter: 'blur(120px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={234} height={50} alt="PROXe" />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 500, letterSpacing: 1, color: 'rgba(255,255,255,0.8)' }}>{eyebrow}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 80, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2.5 }}>
            {title.map((t) => <span key={t}>{t}</span>)}
          </div>
          <div style={{ fontSize: 34, color: 'rgba(255,255,255,0.8)', maxWidth: 960 }}>{line}</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {chips.map((c) => (
            <div key={c} style={{ display: 'flex', padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 24, fontWeight: 500 }}>{c}</div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [
      { name: 'Inter', data: regular, weight: 500, style: 'normal' },
      { name: 'Inter', data: bold, weight: 800, style: 'normal' },
    ] },
  );
}
