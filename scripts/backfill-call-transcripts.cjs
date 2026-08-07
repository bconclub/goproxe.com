#!/usr/bin/env node
/**
 * Backfills transcripts for calls placed before the post-call webhook existed.
 *
 * Every dial already stored its `conversation_id`, and ElevenLabs keeps the
 * transcript against it indefinitely — so none of the earlier calls are lost,
 * they were simply never read back. This walks the agent's conversation list,
 * matches each one to a lead by phone, and writes the transcript into
 * `unified_context.voice.transcripts` in the same shape the webhook uses.
 *
 * Safe to re-run: matching is by conversation_id, and an id already present is
 * replaced rather than appended.
 *
 *   node scripts/backfill-call-transcripts.cjs [--limit 100] [--dry]
 */
const fs = require('fs')
const path = require('path')

// --- env -------------------------------------------------------------------
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '')
  }
}

const XI = process.env.ELEVENLABS_API_KEY
const AGENT = process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra'
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BRAND = process.env.PROXE_LEAD_BRAND || 'proxe'

if (!XI || !SB_URL || !SB_KEY) {
  console.error('Missing ELEVENLABS_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const LIMIT = Number(args[args.indexOf('--limit') + 1]) || 100

const xi = (p) => fetch(`https://api.elevenlabs.io/v1/convai${p}`, { headers: { 'xi-api-key': XI } }).then((r) => r.json())
const sb = (p, init) =>
  fetch(`${SB_URL}/rest/v1${p}`, {
    ...init,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      ...(init && init.headers),
    },
  })

/** Mirrors normalizePhone in app/lib/leadsSupabase.ts — last 10 digits. */
const normalize = (v) => {
  const d = String(v || '').replace(/\D/g, '')
  return d.length >= 10 ? d.slice(-10) : d || null
}

;(async () => {
  const list = await xi(`/conversations?agent_id=${AGENT}&page_size=${LIMIT}`)
  const convs = list.conversations || []
  console.log(`found ${convs.length} conversations`)

  let written = 0
  let skipped = 0

  for (const c of convs) {
    const full = await xi(`/conversations/${c.conversation_id}`)
    const turns = (full.transcript || [])
      .filter((t) => t.message)
      .map((t) => ({ role: t.role === 'agent' ? 'agent' : 'caller', text: String(t.message), at: t.time_in_call_secs ?? null }))

    if (!turns.length) {
      skipped++
      continue
    }

    const phone =
      (full.metadata && full.metadata.phone_call && full.metadata.phone_call.external_number) || null
    const norm = normalize(phone)

    // Same two routes as the webhook: phone first, then the id stamped at dial.
    let q = norm
      ? `/all_leads?select=id,unified_context&customer_phone_normalized=eq.${norm}&brand=eq.${BRAND}&limit=1`
      : `/all_leads?select=id,unified_context&brand=eq.${BRAND}&unified_context=cs.${encodeURIComponent(
          JSON.stringify({ voice: { last_conversation_id: c.conversation_id } })
        )}&limit=1`

    const rows = await sb(q).then((r) => r.json())
    const row = Array.isArray(rows) ? rows[0] : null
    if (!row) {
      console.log(`  no lead for ${c.conversation_id} (${phone || 'no number'})`)
      skipped++
      continue
    }

    const ctx = row.unified_context || {}
    const prior = ctx.voice || {}
    const existing = Array.isArray(prior.transcripts) ? prior.transcripts : []
    const without = existing.filter((t) => t && t.conversation_id !== c.conversation_id)

    const body = {
      last_touchpoint: 'voice',
      unified_context: {
        ...ctx,
        voice: {
          ...prior,
          last_transcript_at: new Date().toISOString(),
          last_call_summary:
            (full.analysis && full.analysis.transcript_summary) || prior.last_call_summary || null,
          transcripts: [
            ...without.slice(-4),
            {
              conversation_id: c.conversation_id,
              at: new Date((c.start_time_unix_secs || 0) * 1000).toISOString(),
              duration_secs: c.call_duration_secs ?? null,
              status: c.status ?? null,
              summary: (full.analysis && full.analysis.transcript_summary) || null,
              turns,
            },
          ],
        },
      },
    }

    if (DRY) {
      console.log(`  [dry] would write ${turns.length} turns -> lead ${row.id}`)
      written++
      continue
    }

    const res = await sb(`/all_leads?id=eq.${row.id}`, { method: 'PATCH', body: JSON.stringify(body) })
    if (!res.ok) {
      console.error(`  FAILED ${c.conversation_id}: ${res.status} ${await res.text()}`)
      skipped++
      continue
    }

    // Also as conversations rows — unified_context feeds the lead record, but
    // the Chats inbox reads `conversations`, which is where someone actually
    // goes looking for a transcript.
    await sb(
      `/conversations?lead_id=eq.${row.id}&channel=eq.voice&metadata->>conversation_id=eq.${c.conversation_id}`,
      { method: 'DELETE' }
    )
    const base = new Date((c.start_time_unix_secs || 0) * 1000).getTime()
    const rowsToInsert = turns.map((t) => ({
      lead_id: row.id,
      brand: BRAND,
      channel: 'voice',
      sender: t.role === 'agent' ? 'agent' : 'customer',
      content: t.text,
      message_type: 'text',
      metadata: { conversation_id: c.conversation_id, at_secs: t.at },
      created_at: new Date(base + (t.at || 0) * 1000).toISOString(),
    }))
    const cres = await sb('/conversations', { method: 'POST', body: JSON.stringify(rowsToInsert) })
    if (!cres.ok) {
      console.error(`  conversations insert FAILED: ${cres.status} ${await cres.text()}`)
    }

    console.log(`  wrote ${turns.length} turns -> lead ${row.id}`)
    written++
  }

  console.log(`\ndone. written=${written} skipped=${skipped}${DRY ? ' (dry run)' : ''}`)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
