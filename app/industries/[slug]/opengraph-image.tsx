import { ImageResponse } from 'next/og';
import { INDUSTRIES, getIndustry } from '../../lib/industries';

/**
 * Generated OG card per industry — dark violet field, the industry's accent,
 * its own stat. Satori renders system fonts only here (loading brand fonts
 * would mean bundling font files); bold weights carry the look instead.
 */
export const runtime = 'nodejs';
export const alt = 'PROXe industry page';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  const title = ind?.title ?? 'PROXe';
  const acc = ind?.color ?? '#7c3aed';
  const stat = ind?.stat ?? '';
  const statLabel = ind?.statLabel ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(160deg, #1b1040 0%, #14102e 60%, #0d0a20 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* accent glow, top right */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: 640,
            background: acc,
            opacity: 0.22,
            filter: 'blur(120px)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 18,
              background: acc,
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6 }}>PROXe</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.7)' }}>
            Never miss a lead ever again.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: acc }}>{stat}</div>
          <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.75)' }}>{statLabel}</div>
        </div>
      </div>
    ),
    size
  );
}
