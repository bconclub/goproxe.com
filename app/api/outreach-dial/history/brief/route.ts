import { historyAuthorized, authorizedCall } from '../../../../lib/bdrHistory'
import { callEvidence } from '../../../../lib/outreachPolicy'

/**
 * GET /api/outreach-dial/history/brief?ids=conv_a,conv_b  (up to 60)
 * Who each call was to and how it went, for the dashboard's call list
 * (Z, 26 Oct 2026: "who are we calling, show it even if it failed, show good
 * versus bad"). A finished call never changes, so each answer is kept.
 */
export const dynamic = 'force-dynamic'

type Brief = { id: string; business: string | null; first_name: string | null; phone: string | null; outcome: string; opener: string | null; why: string | null }
const cache = new Map<string, Brief>()

function brief(id: string, d: any): Brief {
  const dyn = d?.conversation_initiation_client_data?.dynamic_variables || {}
  const md = d?.metadata || {}
  const first = String(dyn.first_name || '').trim()
  const why = d?.status === 'failed'
    ? String(md.termination_reason || md.error?.message || md.phone_call?.call_status || 'The number did not ring').slice(0, 120)
    : null
  return {
    id,
    business: String(dyn.business_name || '').trim() || null,
    first_name: first && first.toLowerCase() !== 'there' ? first : null,
    phone: md.phone_call?.external_number || null,
    outcome: callEvidence(d).outcome,
    opener: dyn.opener_variant ? String(dyn.opener_variant) : null,
    why,
  }
}

export async function GET(req: Request) {
  if (!historyAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const ids = (new URL(req.url).searchParams.get('ids') || '').split(',').map((s) => s.trim())
    .filter((s) => /^conv_[a-zA-Z0-9]+$/.test(s)).slice(0, 60)
  const out: Brief[] = []
  const todo = ids.filter((id) => { const hit = cache.get(id); if (hit) out.push(hit); return !hit })
  for (let i = 0; i < todo.length; i += 10) {
    const batch = await Promise.all(todo.slice(i, i + 10).map(async (id) => {
      try {
        const d = await authorizedCall(id)
        if (!d) return null
        const b = brief(id, d)
        if (d.status === 'done' || d.status === 'failed') cache.set(id, b)
        return b
      } catch { return null }
    }))
    for (const b of batch) if (b) out.push(b)
  }
  return Response.json({ calls: out }, { headers: { 'Cache-Control': 'private, no-store' } })
}
