import { isBdrOperator } from '../../../../lib/bdrSession'
import { BDR_HOOKS } from '../../../../lib/bdrHooks'

/**
 * GET /api/outreach-dial/hooks/<id> - one opening line as audio, in the
 * website callback agent's voice and settings (the voice every outbound call
 * uses). Fixed lines only, never free text. Kept in memory once made.
 */
const API_KEY = process.env.ELEVENLABS_API_KEY
const REF_AGENT = process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra'
const cache = new Map<string, ArrayBuffer>()

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBdrOperator(request)) return new Response('unauthorized', { status: 401 })
  if (!API_KEY) return new Response('not configured', { status: 503 })
  const { id } = await params
  const hook = BDR_HOOKS.find((h) => h.id === id)
  if (!hook) return new Response('not found', { status: 404 })
  let audio = cache.get(id)
  if (!audio) {
    const ref: any = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${REF_AGENT}`, { headers: { 'xi-api-key': API_KEY }, cache: 'no-store' }).then((r) => (r.ok ? r.json() : null))
    const t = ref?.conversation_config?.tts
    if (!t?.voice_id) return new Response('voice unreadable', { status: 502 })
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${t.voice_id}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: hook.text, model_id: t.model_id, voice_settings: { stability: t.stability, similarity_boost: t.similarity_boost, speed: t.speed } }),
    })
    if (!res.ok) return new Response(`tts ${res.status}`, { status: 502 })
    audio = await res.arrayBuffer()
    cache.set(id, audio)
  }
  return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=3600' } })
}
