import { NextResponse } from 'next/server'
import { hasBdrSession, isBdrOperator, isBdrSameOrigin } from '../../../lib/bdrSession'

/**
 * Read-only view of the outreach agents as ElevenLabs has them: first
 * message, prompt, voice and voice settings, next to the website callback
 * agent (the voice PROXe uses everywhere else) for comparison. Z, 24 Oct
 * 2026: "show me what the script is". Same operator check as /status.
 *
 * GET /api/outreach-dial/agents
 */
const API_KEY = process.env.ELEVENLABS_API_KEY

const AGENTS: Array<{ key: string; label: string; id: string }> = [
  { key: 'noname', label: 'Intro Cold', id: process.env.OUTREACH_AGENT_NONAME || 'agent_8901m0sn6y14eegsqh7mmgdswm92' },
  { key: 'dm', label: 'Intro DM', id: process.env.OUTREACH_AGENT_DM || 'agent_9901m0sn70f1ejn84enhccrns2kt' },
  { key: 'warm', label: 'Follow-up', id: process.env.OUTREACH_AGENT_WARM || 'agent_1201m0sn71mvf3arwzfwv4h9s2v1' },
  { key: 'callback', label: 'Website callback (reference)', id: process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra' },
]

async function el(path: string) {
  const res = await fetch(`https://api.elevenlabs.io${path}`, { headers: { 'xi-api-key': API_KEY || '' }, cache: 'no-store' })
  return res.ok ? res.json() : null
}

export async function GET(request: Request) {
  if (!isBdrOperator(request)) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  if (!API_KEY) return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  const voiceNames = new Map<string, string>()
  // ?all=1: every agent on the account plus the phone lines and the agent
  // each one routes to, so the outbound callers can be picked from the full
  // list (Z, 26 Oct 2026: "pull all the agents that do outbound calls").
  if (new URL(request.url).searchParams.get('all') === '1') {
    const list: any = await el('/v1/convai/agents?page_size=100')
    const phones: any = await el('/v1/convai/phone-numbers')
    const known = new Map(AGENTS.map((a) => [a.id, a.label]))
    const rows = await Promise.all(((list?.agents || []) as any[]).map(async (a) => {
      const d: any = await el(`/v1/convai/agents/${a.agent_id}`)
      const cc = d?.conversation_config || {}
      const tts = cc.tts || {}
      const voiceId = tts.voice_id || null
      if (voiceId && !voiceNames.has(voiceId)) {
        const v: any = await el(`/v1/voices/${voiceId}`)
        voiceNames.set(voiceId, v?.name || voiceId)
      }
      return {
        id: a.agent_id,
        name: a.name,
        used_by_dialer: known.get(a.agent_id) || null,
        created: a.created_at_unix_secs ? new Date(a.created_at_unix_secs * 1000).toISOString().slice(0, 10) : null,
        first_message: cc.agent?.first_message || null,
        llm: cc.agent?.prompt?.llm || null,
        voice: voiceId ? voiceNames.get(voiceId) : null,
        voice_model: tts.model_id || null,
        dynamic_vars: Object.keys(cc.agent?.dynamic_variables?.dynamic_variable_placeholders || {}),
      }
    }))
    const lines = ((Array.isArray(phones) ? phones : phones?.phone_numbers) || []).map((p: any) => ({
      id: p.phone_number_id, number: p.phone_number, label: p.label, provider: p.provider,
      agent: p.assigned_agent?.agent_name || null, agent_id: p.assigned_agent?.agent_id || null,
    }))
    return NextResponse.json({ ok: true, agents: rows, lines })
  }
  const agents = await Promise.all(AGENTS.map(async (a) => {
    const d: any = await el(`/v1/convai/agents/${a.id}`)
    if (!d) return { ...a, error: 'not_found' }
    const cc = d.conversation_config || {}
    const tts = cc.tts || {}
    const agent = cc.agent || {}
    const voiceId = tts.voice_id || null
    if (voiceId && !voiceNames.has(voiceId)) {
      const v: any = await el(`/v1/voices/${voiceId}`)
      voiceNames.set(voiceId, v?.name || voiceId)
    }
    return {
      ...a,
      name: d.name,
      language: agent.language,
      first_message: agent.first_message,
      prompt: agent.prompt?.prompt,
      llm: agent.prompt?.llm,
      voice: {
        id: voiceId,
        name: voiceId ? voiceNames.get(voiceId) : null,
        model: tts.model_id,
        stability: tts.stability,
        similarity_boost: tts.similarity_boost,
        speed: tts.speed,
        optimize_streaming_latency: tts.optimize_streaming_latency,
        output_format: tts.agent_output_audio_format,
      },
    }
  }))
  return NextResponse.json({ ok: true, agents })
}

/**
 * POST /api/outreach-dial/agents - change one of the three outreach agents.
 * Only these three, only for a signed-in operator on this site.
 *   { action: 'match_voice', key }  copies the website callback agent's voice
 *       settings (voice, model, stability, speed) onto it, so every outbound
 *       call sounds the same (Z, 26 Oct 2026: "keep the same voice across").
 *   { action: 'set_script', key, prompt?, first_message? }
 */
export async function POST(request: Request) {
  // Signed-in person only: the bots' dial key may read, never change an agent.
  if (!hasBdrSession(request) || !isBdrSameOrigin(request)) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  if (!API_KEY) return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  const body: any = await request.json().catch(() => ({}))
  // The callback agent's voice is the reference, so only its script may change.
  const target = AGENTS.find((a) => a.key === body.key && (a.key !== 'callback' || body.action === 'set_script'))
  if (!target) return NextResponse.json({ ok: false, reason: 'unknown_agent' }, { status: 400 })
  let patch: any
  if (body.action === 'match_voice') {
    const ref: any = await el(`/v1/convai/agents/${AGENTS.find((a) => a.key === 'callback')!.id}`)
    const t = ref?.conversation_config?.tts
    if (!t?.voice_id) return NextResponse.json({ ok: false, reason: 'reference_unreadable' }, { status: 502 })
    patch = { conversation_config: { tts: { voice_id: t.voice_id, model_id: t.model_id, stability: t.stability, similarity_boost: t.similarity_boost, speed: t.speed } } }
  } else if (body.action === 'set_script') {
    const agent: any = {}
    if (typeof body.prompt === 'string' && body.prompt.trim()) agent.prompt = { prompt: body.prompt }
    // An empty first_message is allowed on purpose: the agent then waits for
    // them to say hello before it speaks (Z, 26 Oct 2026: it talked over the ringing).
    if (typeof body.first_message === 'string') agent.first_message = body.first_message
    // The model, from a short list (Z, 26 Oct 2026: Intro Cold on Claude Haiku
    // read its own reasoning aloud on live calls; the Gemini agents did not).
    if (typeof body.llm === 'string' && ['claude-sonnet-5-5', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].includes(body.llm)) agent.prompt = { ...(agent.prompt || {}), llm: body.llm }
    if (!Object.keys(agent).length) return NextResponse.json({ ok: false, reason: 'nothing_to_set' }, { status: 400 })
    patch = { conversation_config: { agent } }
  } else {
    return NextResponse.json({ ok: false, reason: 'unknown_action' }, { status: 400 })
  }
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${target.id}`, {
    method: 'PATCH', headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
  })
  if (!res.ok) return NextResponse.json({ ok: false, reason: `upstream_${res.status}`, detail: (await res.text()).slice(0, 300) }, { status: 502 })
  console.log(`[outreach-agents] ${body.action} on ${target.label}`)
  return NextResponse.json({ ok: true, agent: target.label, action: body.action })
}
