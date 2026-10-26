import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BDR_COOKIE, verifyBdrSession } from '../../lib/bdrSession'
import { BDR_HOOKS } from '../../lib/bdrHooks'

export const dynamic = 'force-dynamic'

/** Every opening line, playable in the call voice. Sample names stand in for the real ones. */
export default async function HooksPage() {
  const cookieStore = await cookies()
  if (!verifyBdrSession(cookieStore.get(BDR_COOKIE)?.value)) redirect('/bdr/login')
  const groups = ['Live now', 'New options'] as const
  return (
    <main style={{ minHeight: '100vh', background: '#0d0b12', color: '#f3efff', font: '16px/1.5 -apple-system, Segoe UI, sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ letterSpacing: '.12em', fontSize: 12, color: '#a78bfa', margin: 0 }}>PROXE DIALER</p>
        <h1 style={{ fontSize: 28, margin: '6px 0 4px' }}>Opening lines</h1>
        <p style={{ color: '#b7aed0', margin: '0 0 28px' }}>
          Each one in the voice the calls use. Ramesh and Bright Smile Dental stand in for the real name and business.{' '}
          <a href="/bdr" style={{ color: '#c4b5fd' }}>Back to the dialer</a>
        </p>
        {groups.map((g) => (
          <section key={g} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase', color: '#a78bfa', margin: '0 0 12px' }}>{g}</h2>
            {BDR_HOOKS.filter((h) => h.group === g).map((h) => (
              <div key={h.id} style={{ padding: '14px 0', borderTop: '1px solid #241f33' }}>
                <div style={{ fontWeight: 600 }}>{h.label}</div>
                <div style={{ color: '#d9d2ee', margin: '4px 0 8px' }}>&ldquo;{h.text}&rdquo;</div>
                <audio controls preload="none" src={`/api/outreach-dial/hooks/${h.id}`} style={{ width: '100%', maxWidth: 420, height: 36 }} />
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}
