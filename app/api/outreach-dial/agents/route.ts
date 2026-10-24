import { NextResponse } from 'next/server'
import { isBdrOperator } from '../../../lib/bdrSession'

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
