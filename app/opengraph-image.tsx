import { ImageResponse } from 'next/og'

// Branded link-preview card (1200×630). Next auto-wires this as og:image.
export const alt =
  'PROXe — Never Miss a Lead Ever Again. The AI Customer Acquisition System.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background:
            'linear-gradient(135deg, #0b0620 0%, #2e1065 55%, #4c1d95 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -1,
              color: '#ffffff',
            }}
          >
            PROX<span style={{ color: '#a78bfa' }}>e</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#c4b5fd',
              marginBottom: 22,
            }}
          >
            The AI Customer Acquisition System
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.04,
              color: '#ffffff',
            }}
          >
            Never Miss a Lead
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.04,
              color: '#ffffff',
            }}
          >
            Ever Again.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', fontSize: 27, color: 'rgba(255,255,255,0.82)' }}>
            Website · WhatsApp · Social · Calls — one AI pipeline
          </div>
          <div style={{ display: 'flex', fontSize: 27, fontWeight: 700, color: '#a78bfa' }}>
            goproxe.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
