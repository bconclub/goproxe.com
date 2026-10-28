import { historyAuthorized, authorizedCall } from '../../../../lib/bdrHistory'
import { callEvidence } from '../../../../lib/outreachPolicy'

/**
 * GET /api/outreach-dial/history/brief?ids=conv_a,conv_b  (up to 60)
 * Who each call was to and how it went, for the dashboard's call list
 * (Z, 26 Oct 2026: "who are we calling, show it even if it failed, show good
 * versus bad"). A finished call never changes, so each answer is kept.
 */
export const dynamic = 'force-dynamic'

type Brief = { id: string; business: string | null; first_name: string | null; phone: string | null; outcome: string; opener: string | null; why: string | null; cost_usd: number | null; fail: { code: string; label: string; side: 'theirs' | 'ours' | 'network' } | null; duration: number | null; their_turns: number; owner: boolean }

// A bot line, IVR or hold message, not a person (Z, 26 Oct 2026: music on the
// other end and the agent kept talking).
const BOT_LINE = /thank(s| you) for calling|for calling us|please (hold|wait|stay on the line)|stay on the line|this person is available|is not available|not reachable|switched off|your call (is|has been)|all (our|of our) (agents|lines|executives)|press (any|[0-9])|after the (tone|beep)|is busy|call is being (forwarded|transferred)|currently unavailable/i
const cache = new Map<string, Brief>()

// Why a call did not ring, from the SIP answer the network gave (Z, 26 Oct
// 2026: "was it our end or theirs, wrong number, whatever it is").
function failReason(err: string): Brief['fail'] {
  const code = (err.match(/sip status:?\s*(\d{3})/i) || err.match(/\b(4\d\d|5\d\d|6\d\d)\b/) || [])[1] || ''
  const t: Record<string, [string, 'theirs' | 'ours' | 'network']> = {
    '486': ['Line busy', 'theirs'], '600': ['Line busy', 'theirs'],
    '480': ['Phone off or out of coverage', 'theirs'],
    '404': ["Number doesn't exist", 'theirs'], '484': ["Number doesn't exist", 'theirs'], '604': ["Number doesn't exist", 'theirs'],
    '603': ['They rejected the call', 'theirs'], '487': ['Call cancelled before answer', 'ours'],
    '403': ['Network refused our call', 'ours'], '401': ['Our line not authorised', 'ours'], '407': ['Our line not authorised', 'ours'],
    '488': ['Our line settings were refused', 'ours'], '408': ['Network did not respond', 'network'],
    '500': ['Network error', 'network'], '502': ['Network error', 'network'], '503': ['Network busy', 'network'], '504': ['Network did not respond', 'network'],
  }
  if (t[code]) return { code, label: t[code][0], side: t[code][1] }
  if (/timed out|timeout/i.test(err)) return { code: 'timeout', label: 'Network did not respond', side: 'network' }
  return err ? { code: code || 'other', label: 'Call did not go through', side: 'network' } : null
}

function brief(id: string, d: any): Brief {
  const dyn = d?.conversation_initiation_client_data?.dynamic_variables || {}
  const md = d?.metadata || {}
  const first = String(dyn.first_name || '').trim()
  const err = String(md.error?.reason || md.error?.message || md.termination_reason || '')
  const fail = d?.status === 'failed' ? failReason(err) : null
  const why = d?.status === 'failed' ? (err || 'The number did not ring').slice(0, 140) : null
  return {
    id,
    business: String(dyn.business_name || '').trim() || null,
    first_name: first && first.toLowerCase() !== 'there' ? first : null,
    phone: md.phone_call?.external_number || null,
    outcome: (() => {
      const o = callEvidence(d).outcome
      const said = (Array.isArray(d?.transcript) ? d.transcript : []).filter((t: any) => t.role === 'user').map((t: any) => String(t.message || '')).join(' ')
      if (o !== 'failed' && o !== 'in_progress' && BOT_LINE.test(said)) return 'automated'
      // Booked is decided by PROXe holding a real booking (the dashboard checks
      // that), never guessed from the AI summary: "callback scheduled" was
      // tagging busy people as booked (Z, 28 Oct 2026).
      return o
    })(),
    cost_usd: typeof md.cost_fiat === 'number' ? md.cost_fiat : null,
    // For "worth a follow-up" (Z, 27 Oct 2026: show any decent call a person
    // or owner actually spoke on): how long, how many real replies, and
    // whether the owner / doctor / founder / manager was on the line.
    duration: typeof md.call_duration_secs === 'number' ? md.call_duration_secs : null,
    their_turns: (Array.isArray(d?.transcript) ? d.transcript : []).filter((t: any) => t.role === 'user' && /[a-z]{2,}/i.test(String(t.message || '')) && !/^\s*(hello|hi|hallo)[?!. ]*$/i.test(String(t.message || ''))).length,
    owner: /\b(owner|founder|co-founder|director|proprietor|principal|doctor|managing|manager|partner|ceo|head)\b|\bdr\.? [a-z]/i.test(String(d?.analysis?.transcript_summary || '')),
    fail,
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
