#!/usr/bin/env node
/**
 * Narrate every blog post once with a real voice (ElevenLabs), so the Listen
 * button plays an mp3 instead of the browser's speech synthesizer ("too AI",
 * Z, 4 Sep). Runs on the VPS in deploy.sh before the build; safe to run any
 * time, idempotent, and never blocks a deploy (failures are logged).
 *
 *   node scripts/gen-blog-audio.mjs            # all posts, cached
 *   node scripts/gen-blog-audio.mjs --slug x   # one post
 *   node scripts/gen-blog-audio.mjs --force    # ignore the cache
 *
 * Source of truth is the `const articleContent = \`...\`` literal every post
 * page carries. Output: public/blog-audio/<slug>.mp3 + manifest.json, from a
 * persistent cache in blog-audio-cache/ keyed on sha1(text + voice + model),
 * so an unchanged post costs nothing on the next deploy.
 *
 * Env: ELEVENLABS_API_KEY (required), BLOG_TTS_VOICE_ID (default: the same
 * voice PROXe uses on calls), BLOG_TTS_MODEL (default eleven_multilingual_v2).
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
for (const f of ['.env.local', '.env']) {
  const p = path.join(root, f)
  if (!fs.existsSync(p)) continue
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE = process.env.BLOG_TTS_VOICE_ID || 'wJ5MX7uuKXZwFqGdWM4N'
const MODEL = process.env.BLOG_TTS_MODEL || 'eleven_multilingual_v2'
const MAX_CHARS = 4500 // per request, under the model's 5k cap

const args = process.argv.slice(2)
const only = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null
const force = args.includes('--force')

const blogDir = path.join(root, 'app', 'blog')
const cacheDir = path.join(root, 'blog-audio-cache')
const outDir = path.join(root, 'public', 'blog-audio')
fs.mkdirSync(cacheDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

if (!API_KEY) {
  console.error('[blog-audio] ELEVENLABS_API_KEY missing; leaving existing audio as is')
  process.exit(0)
}

function extractText(pageSrc) {
  const m = pageSrc.match(/const articleContent = `([\s\S]*?)`\s*\n/)
  if (!m) return null
  return m[1]
    .replace(/\$\{[^}]*\}/g, '')      // no template expressions in prose, but never speak one
    .replace(/\\`/g, '`')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function chunk(text) {
  const paras = text.split(/\n\s*\n/)
  const out = []
  let cur = ''
  for (const p of paras) {
    if ((cur + '\n\n' + p).length > MAX_CHARS && cur) { out.push(cur); cur = p }
    else cur = cur ? cur + '\n\n' + p : p
  }
  if (cur) out.push(cur)
  return out
}

async function tts(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      // Narration, not a sales call: steadier than the phone agent, a little
      // warmer, no exaggeration.
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true },
    }),
  })
  if (!res.ok) throw new Error(`tts ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return Buffer.from(await res.arrayBuffer())
}

const manifestPath = path.join(outDir, 'manifest.json')
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {}
const slugs = fs.readdirSync(blogDir).filter((d) => fs.existsSync(path.join(blogDir, d, 'page.tsx')) && (!only || d === only))
let made = 0, kept = 0, failed = 0

for (const slug of slugs) {
  const text = extractText(fs.readFileSync(path.join(blogDir, slug, 'page.tsx'), 'utf8'))
  if (!text) { console.warn(`[blog-audio] ${slug}: no articleContent literal, skipped`); continue }
  const hash = crypto.createHash('sha1').update(`${VOICE}|${MODEL}|${text}`).digest('hex').slice(0, 12)
  const cached = path.join(cacheDir, `${slug}.${hash}.mp3`)
  const dest = path.join(outDir, `${slug}.mp3`)
  try {
    if (!force && fs.existsSync(cached)) {
      fs.copyFileSync(cached, dest)
      kept++
    } else {
      const parts = []
      for (const c of chunk(text)) parts.push(await tts(c))
      const buf = Buffer.concat(parts)
      fs.writeFileSync(cached, buf)
      fs.copyFileSync(cached, dest)
      // drop stale cache entries for this slug
      for (const f of fs.readdirSync(cacheDir)) if (f.startsWith(`${slug}.`) && f !== path.basename(cached)) fs.unlinkSync(path.join(cacheDir, f))
      made++
      console.log(`[blog-audio] ${slug}: narrated ${text.length} chars -> ${(buf.length / 1024).toFixed(0)} KB`)
    }
    const bytes = fs.statSync(dest).size
    manifest[slug] = { hash, seconds: Math.round(bytes / (128000 / 8)), voice: VOICE, model: MODEL }
  } catch (e) {
    failed++
    console.error(`[blog-audio] ${slug}: ${e.message}`)
  }
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log(`[blog-audio] done: ${made} narrated, ${kept} from cache, ${failed} failed, ${slugs.length} posts`)
