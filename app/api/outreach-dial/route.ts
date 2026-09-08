import { NextResponse } from 'next/server'
import { lastCallbackAt } from '../../lib/leadsSupabase'
import { isQuiet, nextOpenTime } from '../../lib/quietHours'

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
 * Auth: Authorization: Bearer <DIAL_API_KEY> (the bots) or <BDR_DIAL_KEY>
 * (the BDR team's passcode, typed into /bdr). Fail closed.
 *
 * SAFETY - the batch lock lives HERE, not in the bots' judgment:
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
 * Quiet hours (8 PM - 9 AM IST) are refused here too: an AI cold call at
 * night is the one thing no BDR should be able to do by accident.
 *
 * [DEV] RETRY POLICY FOR CALLERS:
 * NEVER retry on HTTP 504 / timeout without first checking the phone's status.
 * The server records the dial as soon as ElevenLabs accepts it, even if the
 * nginx proxy times out before returning the response. A blind retry will hit
 * the recently_called guard and be refused. To retry safely:
 * 1. Wait 5+ seconds for the DB write to settle.
 * 2. Call again; if you get {reason: "recently_called"}, the first call placed.
 * 3. If you get another timeout, the phone is blocked or there's an infra issue.
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
  if (digits.length >= 11) return `+${digits}`
  return null
}

export async function POST(request: Request) {
  const got = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const keys = [process.env.DIAL_API_KEY, process.env.BDR_DIAL_KEY].filter((k): k is string => !!k)
  if (!got || !keys.includes(got)) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }
  const caller = got === process.env.BDR_DIAL_KEY ? 'bdr' : 'bot'
  if (!API_KEY) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  let body: any
  try { body = await request.json() } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 })
  }

  const phone = toE164(body.phone)
  if (!phone) return NextResponse.json({ ok: false, reason: 'bad_phone' }, { status: 400 })

  const agentKey = String(body.agent || '')
  const agentId = AGENTS[agentKey]
  if (!agentId) {
    return NextResponse.json({ ok: false, reason: 'unknown_agent', agents: Object.keys(AGENTS) }, { status: 400 })
  }

  // The batch lock. While the allowlist is set, everything else is refused,
  // loudly, so a bot cannot start a batch nobody approved.
  // Compare on the last 10 digits: entries are typed bare (9731660933)
  // while phone is E164 (+919731660933), and a mismatch here blocked the
  // one number the lock exists to allow.
  const allow = (process.env.DIAL_ALLOWLIST || '').split(',').map((s) => s.replace(/\D/g, '').slice(-10)).filter(Boolean)
  if (allow.length && !allow.includes(phone.replace(/\D/g, '').slice(-10))) {
    return NextResponse.json({ ok: false, reason: 'not_in_allowlist' }, { status: 403 })
  }

  // Read historical cooldowns during migration; never create or update a PROXe lead.
  const previous = await lastCallbackAt(phone);
  if (previous && Date.now() - previous.getTime() < 24 * 60 * 60 * 1000) return NextResponse.json({ ok: false, reason: 'recently_called', last_called_at: previous.toISOString() }, { status: 409 });
  const now = new Date()
  if (isQuiet(now) && body.dry_run !== true) {
    return NextResponse.json({ ok: false, reason: 'quiet_hours', opens_at: nextOpenTime(now).toISOString() }, { status: 409 })
  }

  const v = body.vars && typeof body.vars === 'object' ? body.vars : {}
  // Every variable the prompts reference gets a value: an unfilled {{var}}
  // read aloud as literal braces would torch the call.
  const dynamic_variables = {
    business_name: String(v.business_name || 'your business'),
    vertical: String(v.vertical || 'business'),
    city: String(v.city || 'Bangalore'),
    first_name: String(v.first_name || 'there'),
    research_hook: String(v.research_hook || 'They run a local business that gets enquiries online.'),
    last_summary: String(v.last_summary || 'They previously showed interest in PROXe.'),
    wa_number: process.env.OUTREACH_WA_NUMBER || '+91 81238 08817',
  }

  if (body.dry_run === true) {
    return NextResponse.json({ ok: true, dry_run: true, would_dial: phone, agent: agentKey, agent_id: agentId, dynamic_variables })
  }

  // Reserve in ARC before dialing. No stub PROXe lead, and concurrent workers cannot double-dial.
  const arcKey = process.env.ARC_INGEST_SECRET;
  if (!arcKey) return NextResponse.json({ ok: false, reason: 'arc_not_configured' }, { status: 503 });
  try {
    const reserve = await fetch((process.env.ARC_INGEST_BASE || 'https://arc.bconclub.com') + '/api/agent/outreach/reserve', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + arcKey, 'X-Agent-Name': 'bdr-' + caller },
      body: JSON.stringify({ phone }), signal: AbortSignal.timeout(15000),
    });
    if (!reserve.ok) return NextResponse.json({ ok: false, reason: reserve.status === 409 ? 'recently_called' : 'arc_reservation_failed' }, { status: reserve.status === 409 ? 409 : 503 });
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
