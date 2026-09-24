import { spokenBusinessName } from '../../lib/spokenBusinessName'
import { NextResponse } from 'next/server'
import { isQuiet, nextOpenTime } from '../../lib/quietHours'
import { hasBdrSession, isBdrSameOrigin } from '../../lib/bdrSession'

/**
 * The bots' dial button. One authenticated POST places an outreach call from
 * one of the three PROXe outreach agents (Intro DM = dm, Intro Cold = noname, Follow-up = warm), with the prospect's story passed as
 * ElevenLabs DYNAMIC VARIABLES ({{business_name}} etc. in the agent prompts).
 *
 * Variables, never conversation_config_override: overrides shipped twice on
 * the callback route and both times calls rang and died on answer (see the
 * comment in api/callback/route.ts). Dynamic variables are the supported
 * per-call substitution and need no override permissions on the agent.
 *
 * Auth: Authorization: Bearer <DIAL_API_KEY> for bots, or signed admin
 * session cookie for manual dialing. Fail closed.
 *
 * Automated batch lock lives here, not in the bots' judgment:
 * - DIAL_ALLOWLIST (csv of numbers): while set, ONLY those numbers can be
 *   dialed. Ships set to the BDR test number; Z widens it per approved batch.
 * - One call per number per 24h, answered from the database like the hero
 *   callback, so a restart never resets it.
 *
 * Body: {
 *   phone: "9731660933",
 *   agent: "noname" | "dm" | "warm",
 *   vars?: { business_name, vertical, city, first_name, research_hook, last_summary },
 *   dry_run?: true      // resolve + report, place no call
 * }
 * Call results stay in ARC. Explicit qualification and handoff are required
 * before PROXe receives a contact. Dial reservations never create a lead.
 *
 * Quiet hours (8 PM - 9 AM IST) still apply to automated callers.
 *
 * [DEV] RETRY POLICY FOR CALLERS:
 * NEVER retry on HTTP 504 / timeout without first checking the phone's status.
 * The server records the dial as soon as ElevenLabs accepts it, even if the
 * nginx proxy times out before returning the response. A blind retry will hit
 * the recently_called guard and be refused. To retry safely:
 * 1. Wait 5+ seconds for the DB write to settle.
 * 2. Call again; if you get {reason: "recently_called"}, the first call placed.
 * 3. If you get another timeout, the phone is blocked or there's an infra issue.
 *
 * [DEV] HANDLING 409 CONFLICTS (Epitome G-P#2 race):
 * Arc's 24h dial reserve can return HTTP 409 with concrete reasons:
 * - "recently_called": genuine cooldown, call already placed in last 24h
 * - "ambiguous_target": multiple active targets for phone, needs manual resolution
 * - "target_closed": target marked closed/lost in Arc
 *
 * On 409, probe/batch scripts should check for same-minute successful conversation:
 * 1. Query PM2 database `dialed_lines` table: SELECT conversation_id WHERE phone = ? AND created_at >= NOW() - INTERVAL 1 MINUTE
 * 2. Or query Arc `/api/agent/outreach_messages` with phone + time filter for conversation_id
 * 3. If a conversation_id exists from the same minute, stamp it (race: probe logged HOLD_409 while
 *    Intro DM call actually succeeded). Do NOT skip/HOLD.
 * 4. If no conversation_id exists and reason is "recently_called", respect the cooldown and skip.
 */

const API_KEY = process.env.ELEVENLABS_API_KEY
const PHONE_NUMBER_ID = process.env.ELEVENLABS_PHONE_NUMBER_ID || 'phnum_3701m0wakhjte0zr5fyk25yjpe01'

const AGENTS: Record<string, string> = {
  noname: process.env.OUTREACH_AGENT_NONAME || 'agent_8901m0sn6y14eegsqh7mmgdswm92',
  dm: process.env.OUTREACH_AGENT_DM || 'agent_9901m0sn70f1ejn84enhccrns2kt',
  warm: process.env.OUTREACH_AGENT_WARM || 'agent_1201m0sn71mvf3arwzfwv4h9s2v1',
}


function toE164(input: string): string | null {
  const digits = String(input || '').replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  return null
}

export async function POST(request: Request) {
  const got = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const manual = hasBdrSession(request)
  const bot = !!process.env.DIAL_API_KEY && got === process.env.DIAL_API_KEY
  if (!manual && !bot) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }
  if (manual && !isBdrSameOrigin(request)) return NextResponse.json({ ok: false, reason: 'forbidden' }, { status: 403 })
  const caller = manual ? 'bdr' : 'bot'
  if (!API_KEY) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  let body: any
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  const phone = toE164(body.phone)
  if (!phone) return NextResponse.json({ ok: false, reason: 'bad_phone' }, { status: 400 })

  const requestedAgent = String(body.agent || '');
  const first = String(body.vars?.first_name || '').trim();
  if (requestedAgent === 'dm' && (!first || /^(there|unknown|n\/?a)$/i.test(first))) {
    return NextResponse.json({ ok: false, reason: 'first_name_required' }, { status: 400 })
  }
  const agentKey = requestedAgent
  const agentId = AGENTS[agentKey]
  if (!agentId) {
    return NextResponse.json({ ok: false, reason: 'unknown_agent', agents: Object.keys(AGENTS) }, { status: 400 })
  }

  if (agentKey === 'warm' && !String(body.vars?.last_summary || '').trim()) return NextResponse.json({ ok: false, reason: 'followup_context_required' }, { status: 400 });
  if (!String(body.vars?.business_name || '').trim()) return NextResponse.json({ ok: false, reason: 'business_required' }, { status: 400 });
  // The batch lock. While the allowlist is set, everything else is refused,
  // loudly, so a bot cannot start a batch nobody approved.
  // Compare on the last 10 digits: entries are typed bare (9731660933)
  // while phone is E164 (+919731660933), and a mismatch here blocked the
  // one number the lock exists to allow.
  const allow = (process.env.DIAL_ALLOWLIST || '').split(',').map((s) => s.replace(/\D/g, '').slice(-10)).filter(Boolean)
  if (caller !== 'bdr' && allow.length && !allow.includes(phone.replace(/\D/g, '').slice(-10))) {
    return NextResponse.json({ ok: false, reason: 'not_in_allowlist' }, { status: 403 })
  }

  const now = new Date()
  if (caller !== 'bdr' && isQuiet(now) && body.dry_run !== true) {
    return NextResponse.json({ ok: false, reason: 'quiet_hours', opens_at: nextOpenTime(now).toISOString() }, { status: 409 })
  }

  const v = body.vars && typeof body.vars === 'object' ? body.vars : {}
  // Every variable the prompts reference gets a value: an unfilled {{var}}
  // read aloud as literal braces would torch the call.
  const dynamic_variables = {
    business_name: spokenBusinessName(v.business_name, v.city),
    vertical: String(v.vertical || 'business'),
    city: String(v.city || 'Bangalore'),
    first_name: String(v.first_name || 'there'),
    research_hook: String(v.research_hook || 'They run a local business that gets enquiries online.'),
    last_summary: String(v.last_summary || 'No previous conversation recorded.'),
    arc_target_id: String(body.target_id || ''),
  }


  // Reserve in ARC before dialing. No stub PROXe lead, and concurrent workers cannot double-dial.
  const arcKey = process.env.ARC_INGEST_SECRET;
  if (!arcKey) return NextResponse.json({ ok: false, reason: 'arc_not_configured' }, { status: 503 });
  try {
    const reserve = await fetch((process.env.ARC_INGEST_BASE || 'https://arc.bconclub.com') + '/api/agent/outreach/reserve', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + arcKey, 'X-Agent-Name': 'bdr-' + caller },
      body: JSON.stringify({ phone, target_id: body.target_id, dry_run: body.dry_run === true,
        manual_override: caller === 'bdr', business_name: String(v.business_name || '').slice(0, 120),
        first_name: String(v.first_name || '').slice(0, 80), city: String(v.city || '').slice(0, 80),
        vertical: String(v.vertical || '').slice(0, 80) }), signal: AbortSignal.timeout(15000),
    });
    if (!reserve.ok) {
      // [DEV] Pass through Arc's concrete 409 reason instead of lumping them.
      // Arc returns JSON { reason: "recently_called" | "ambiguous_target" | "target_closed" }
      // on 409, or a generic error body on other failures. Probe/batch callers can
      // then distinguish genuine cooldown from same-minute race (see Epitome G-P#2).
      if (reserve.status === 409) {
        const arc409 = await reserve.json().catch(() => ({ reason: 'recently_called_or_ambiguous_target' }));
        const arcReason = arc409.reason || 'recently_called_or_ambiguous_target';
        return NextResponse.json({ ok: false, reason: arcReason, arc_detail: arc409 }, { status: 409 });
      }
      return NextResponse.json({ ok: false, reason: 'arc_reservation_failed' }, { status: 503 });
    }
    const reservation = await reserve.json();
    if (!reservation.target_id) return NextResponse.json({ ok: false, reason: 'arc_target_required' }, { status: 503 });
    dynamic_variables.arc_target_id = reservation.target_id;
    if (body.dry_run === true) return NextResponse.json({ ok: true, dry_run: true, would_dial: phone, agent: agentKey, agent_id: agentId, storage: 'arc', quiet_hours: isQuiet(now), dynamic_variables });
  } catch { return NextResponse.json({ ok: false, reason: 'arc_unreachable' }, { status: 503 }); }
  const res = await fetch('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: agentId,
      agent_phone_number_id: PHONE_NUMBER_ID,
      to_number: phone,
      conversation_initiation_client_data: { dynamic_variables },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[outreach-dial] dial failed', res.status, detail.slice(0, 300))
    return NextResponse.json({ ok: false, reason: `dial_http_${res.status}` }, { status: 502 })
  }

  const out = await res.json().catch(() => ({}))
  console.log(`[outreach-dial] dialed ${phone} agent=${agentKey} by=${caller} conversation_id=${out.conversation_id ?? 'null'}`)
  return NextResponse.json({ ok: true, dialed: phone, agent: agentKey, conversation_id: out.conversation_id ?? null })
}
