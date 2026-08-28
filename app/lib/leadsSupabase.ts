// Server-only module: imported exclusively by app/api/lead/route.ts. Uses the
// Supabase service-role client, so it must never be pulled into a client bundle.
import { getSupabaseServiceClient } from './supabase'

/**
 * Server-side lead sink → the shared PROXe/Beacon Supabase (`all_leads`).
 *
 * goproxe.com dogfoods PROXe: every captured form lead lands in the SAME
 * Supabase the product runs on (Beacon's instance — we don't spin up a separate
 * DB for PROXe). Leads stay manageable because each row is tagged with a `brand`
 * (default `proxe`, override via `PROXE_LEAD_BRAND`) and a `source`, so PROXe
 * traffic is trivially segmentable from Beacon's own leads in the same table.
 *
 * This runs alongside the existing Google-Sheet forward in `/api/lead` — the
 * sheet stays as a human-readable backup. NEVER throws: a failed DB write must
 * not break the form UX. When Supabase isn't configured it returns a soft
 * `not_configured` so the route can carry on.
 *
 * Dedup mirrors the chat widget (`chatSessions.ensureAllLeads`): match on the
 * last-10-digits of the phone + brand, so a form lead and a later chat/voice
 * session collapse onto one unified `all_leads` row.
 */

const BRAND = process.env.PROXE_LEAD_BRAND || 'proxe'

export interface SupabaseLeadInput {
  type?: 'lead' | 'booking'
  name?: string
  email?: string
  phone?: string
  brandName?: string
  websiteUrl?: string
  source?: string
  bookingLabel?: string
  bookingTime?: string
  // First-touch attribution (merged in by the client before POST).
  channel?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
  landingPage?: string
}

export type SupabaseLeadResult =
  | { ok: true; leadId: string | null }
  | { ok: false; reason: 'not_configured' | 'no_phone' | 'no_match' | 'db_error' }

/** Last-10-digits normalization — identical to chatSessions so rows collapse. */
function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits || digits.length < 10) return null
  return digits.slice(-10)
}

function trimOrNull(v: string | null | undefined): string | null {
  const t = (v ?? '').trim()
  return t || null
}

/**
 * Attribution + brand/site/source folded into unified_context.web.
 *
 * Only carries keys the submission actually has a value for — a later, thinner
 * submit (e.g. the booking step, or a retargeting form with no website field)
 * must never null-out what an earlier submit captured. Merges are shallow
 * spreads, so an absent key preserves the existing value.
 */
function buildContext(input: SupabaseLeadInput) {
  const web: Record<string, unknown> = {}
  if (input.source) web.source = input.source
  const brandName = trimOrNull(input.brandName)
  if (brandName) web.brand_name = brandName
  const websiteUrl = trimOrNull(input.websiteUrl)
  if (websiteUrl) web.website_url = websiteUrl

  const attribution: Record<string, unknown> = {}
  if (input.channel) attribution.channel = input.channel
  if (input.utmSource) attribution.utm_source = input.utmSource
  if (input.utmMedium) attribution.utm_medium = input.utmMedium
  if (input.utmCampaign) attribution.utm_campaign = input.utmCampaign
  if (input.referrer) attribution.referrer = input.referrer
  if (input.landingPage) attribution.landing_page = input.landingPage
  if (Object.keys(attribution).length > 0) web.attribution = attribution

  return { web }
}

/**
 * Upsert a captured form lead into `all_leads`, tagged brand + source.
 * Deduplicates by normalized phone + brand.
 */
export async function upsertProxeLead(input: SupabaseLeadInput): Promise<SupabaseLeadResult> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return { ok: false, reason: 'not_configured' }

  const normalizedPhone = normalizePhone(input.phone)
  if (!normalizedPhone) return { ok: false, reason: 'no_phone' }

  const name = trimOrNull(input.name)
  const email = trimOrNull(input.email)
  const phone = trimOrNull(input.phone)
  const ctx = buildContext(input)

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('all_leads')
      .select('id, unified_context')
      .eq('customer_phone_normalized', normalizedPhone)
      .eq('brand', BRAND)
      .maybeSingle()

    if (fetchError) {
      console.error('[leadsSupabase] fetch failed', fetchError.code, fetchError.message)
      return { ok: false, reason: 'db_error' }
    }

    if (existing) {
      const existingContext = (existing.unified_context as Record<string, any>) || {}
      const mergedContext = {
        ...existingContext,
        web: { ...(existingContext.web || {}), ...ctx.web },
      }
      const updates: Record<string, unknown> = {
        last_touchpoint: 'web',
        last_interaction_at: new Date().toISOString(),
        unified_context: mergedContext,
      }
      if (name) updates.customer_name = name
      if (email) updates.email = email
      if (phone) updates.phone = phone

      const { error: updateError } = await supabase
        .from('all_leads')
        .update(updates)
        .eq('id', existing.id)

      if (updateError) {
        console.error('[leadsSupabase] update failed', updateError.code, updateError.message)
        return { ok: false, reason: 'db_error' }
      }
      return { ok: true, leadId: existing.id as string }
    }

    const { data: created, error: createError } = await supabase
      .from('all_leads')
      .insert({
        customer_name: name,
        email,
        phone,
        customer_phone_normalized: normalizedPhone,
        first_touchpoint: 'web',
        last_touchpoint: 'web',
        last_interaction_at: new Date().toISOString(),
        brand: BRAND,
        unified_context: ctx,
      })
      .select('id')
      .single()

    if (createError) {
      console.error('[leadsSupabase] insert failed', createError.code, createError.message)
      return { ok: false, reason: 'db_error' }
    }
    return { ok: true, leadId: (created?.id as string) ?? null }
  } catch (err) {
    console.error('[leadsSupabase] upsert threw', err)
    return { ok: false, reason: 'db_error' }
  }
}

/**
 * Stamp `unified_context.billing.checkout_started_at` on a lead the moment we
 * hand them to Dodo.
 *
 * This is what makes abandonment visible: the lead row already exists (captured
 * before payment), the webhook writes `status` only once money actually moves,
 * so anyone with a `checkout_started_at` and no `payment_id` bailed on the
 * payment page. Server-side on purpose — it does not depend on the visitor
 * coming back to the site.
 *
 * Never throws; a failed stamp must not block checkout.
 */
export async function markCheckoutStarted(input: {
  email?: string | null
  sessionId?: string | null
  market?: string | null
  source?: string | null
}): Promise<void> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return

  const email = trimOrNull(input.email)
  if (!email) return

  try {
    const { data: existing } = await supabase
      .from('all_leads')
      .select('id, unified_context')
      .eq('email', email)
      .eq('brand', BRAND)
      .order('last_interaction_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!existing) return

    const ctx = (existing.unified_context as Record<string, any>) || {}
    await supabase
      .from('all_leads')
      .update({
        last_interaction_at: new Date().toISOString(),
        unified_context: {
          ...ctx,
          billing: {
            ...(ctx.billing || {}),
            checkout_started_at: new Date().toISOString(),
            checkout_session_id: input.sessionId ?? null,
            checkout_market: input.market ?? null,
            checkout_source: input.source ?? null,
            provider: 'dodo',
          },
        },
      })
      .eq('id', existing.id)
  } catch (err) {
    console.error('[leadsSupabase] markCheckoutStarted failed', err)
  }
}

/**
 * Stamp an outbound callback onto the lead it belongs to.
 *
 * Every hero-capture call is a real conversation with a real prospect, and
 * until now it happened entirely outside the system: the lead row said someone
 * left a number, and nothing recorded that PROXe rang them, whether it
 * connected, or that a conversation exists. The dashboard could not show what
 * was actually happening to a lead.
 *
 * Matched on phone (the only thing the hero capture collects) rather than
 * email, and written under `unified_context.voice` alongside the existing
 * `web` and `billing` namespaces.
 */
/**
 * When did we last dial this number? Null if never, or if we cannot tell.
 *
 * The 24-hour "one call per number" limit lived in a module-level Map, so every
 * deploy and every pm2 restart wiped it — on a site that redeploys on each
 * push, the limit was closer to "one call per number per deploy". The durable
 * record already existed (recordCallbackDial writes
 * unified_context.voice.last_call_at); nothing was reading it back.
 *
 * Returns the timestamp of the last DIAL ATTEMPT, successful or failed.
 * A failed attempt still consumed a dial, so it still counts against the limit.
 *
 * On any error this returns null, i.e. "allow the call". A database blip must
 * not silently stop the product doing the one thing the hero promises; the
 * in-memory guard in the route still catches rapid double-taps regardless.
 */
export async function lastCallbackAt(phone: string | null | undefined): Promise<Date | null> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return null

  const normalized = normalizePhone(phone ?? '')
  if (!normalized) return null

  try {
    const { data } = await supabase
      .from('all_leads')
      .select('unified_context')
      .eq('customer_phone_normalized', normalized)
      .eq('brand', BRAND)
      .order('last_interaction_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const voice = (data?.unified_context as Record<string, any> | null)?.voice
    const at = voice?.last_call_at
    if (!at) return null

    const when = new Date(at)
    if (Number.isNaN(when.getTime())) return null

    // The 24h window exists to stop someone re-triggering a REAL, billable
    // call. It must not punish a caller for a call that never happened.
    //
    // Two ways a dial dies without ringing anyone:
    //   1. The HTTP request fails (401/404/...) → recorded status 'failed'.
    //   2. ElevenLabs returns 200 and the conversation then fails to
    //      initialise → recorded 'dialing', but 0 messages and 0 seconds.
    // Case 2 is the one that bit us: an expired subscription made every dial
    // look accepted, so each attempt locked that number out for a day and the
    // retry answered "recently_called" — the product appearing to refuse to
    // call, on top of an outage that already stopped it calling.
    if (voice?.last_call_status === 'failed') return null

    // A connected call always leaves a transcript from the post-call webhook.
    // Give the webhook a grace window to arrive; inside it, treat the dial as
    // real so a double-tap still cannot fire two calls.
    const GRACE_MS = 10 * 60 * 1000
    const conversationId = voice?.last_conversation_id
    const transcripts = Array.isArray(voice?.transcripts) ? voice.transcripts : []
    const connected = conversationId
      ? transcripts.some((t: any) => t?.conversation_id === conversationId)
      : false

    if (!connected && Date.now() - when.getTime() > GRACE_MS) return null

    return when
  } catch (err) {
    console.error('[leadsSupabase] lastCallbackAt failed', err)
    return null
  }
}

/**
 * Schedule a callback for a later time when the lead was captured during quiet hours.
 *
 * Writes scheduled_callback_at into unified_context.voice so the cron job can
 * find and dial these leads when the time comes. The timestamp is when we
 * PROMISED to call, not when we actually did.
 */
export async function scheduleCallback(input: {
  phone?: string | null
  scheduledFor: Date
}): Promise<void> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return

  const normalized = normalizePhone(input.phone ?? '')
  if (!normalized) return

  // The hero fires TWO requests at once: /api/lead (capture) and
  // /api/callback (dial). Both read-modify-write unified_context, and the
  // capture's write was landing AFTER this one, wiping the stamp - which is
  // why the morning cron logged "found pending: 0" forever and no promised
  // 9 AM callback was ever placed (Z's own 21:10 test, 28 Aug). Let the race
  // settle, then write, then VERIFY the stamp survived; retry once.
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      await new Promise((r) => setTimeout(r, attempt === 0 ? 1500 : 2500))
      const { data: existing } = await supabase
        .from('all_leads')
        .select('id, unified_context')
        .eq('customer_phone_normalized', normalized)
        .eq('brand', BRAND)
        .order('last_interaction_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!existing) return

      const ctx = (existing.unified_context as Record<string, any>) || {}
      const prior = (ctx.voice || {}) as Record<string, any>

      await supabase
        .from('all_leads')
        .update({
          last_interaction_at: new Date().toISOString(),
          unified_context: {
            ...ctx,
            voice: {
              ...prior,
              scheduled_callback_at: input.scheduledFor.toISOString(),
              scheduled_callback_status: 'pending',
            },
          },
        })
        .eq('id', existing.id)

      const { data: check } = await supabase
        .from('all_leads').select('unified_context').eq('id', existing.id).maybeSingle()
      if ((check?.unified_context as any)?.voice?.scheduled_callback_at) return
      console.warn('[leadsSupabase] scheduleCallback stamp lost to a concurrent write, retrying')
    }
    console.error('[leadsSupabase] scheduleCallback could not persist the stamp after retries')
  } catch (err) {
    console.error('[leadsSupabase] scheduleCallback failed', err)
  }
}

/**
 * Fetch leads with pending scheduled callbacks that are due now.
 *
 * Returns leads where:
 * - scheduled_callback_at is in the past
 * - scheduled_callback_status is 'pending'
 * - NOT currently in quiet hours
 * - Has a valid phone number
 */
export async function getPendingScheduledCallbacks(): Promise<Array<{
  id: string
  phone: string
  scheduledFor: Date
}>> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return []

  try {
    const now = new Date().toISOString()
    
    // Fetch leads with pending scheduled callbacks
    const { data, error } = await supabase
      .from('all_leads')
      .select('id, phone, unified_context')
      .eq('brand', BRAND)
      .not('phone', 'is', null)
      .not('unified_context->voice->scheduled_callback_at', 'is', null)

    if (error) {
      console.error('[leadsSupabase] getPendingScheduledCallbacks fetch failed', error)
      return []
    }

    if (!data) return []

    // Filter in-memory for due callbacks with pending status
    const pending: Array<{ id: string; phone: string; scheduledFor: Date }> = []
    
    for (const lead of data) {
      const voice = (lead.unified_context as Record<string, any> | null)?.voice
      if (!voice) continue
      
      const scheduledAt = voice.scheduled_callback_at
      const status = voice.scheduled_callback_status
      
      if (status !== 'pending') continue
      if (!scheduledAt) continue
      
      const scheduledDate = new Date(scheduledAt)
      if (Number.isNaN(scheduledDate.getTime())) continue
      if (scheduledDate > new Date()) continue
      
      pending.push({
        id: lead.id as string,
        phone: lead.phone as string,
        scheduledFor: scheduledDate,
      })
    }
    
    return pending
  } catch (err) {
    console.error('[leadsSupabase] getPendingScheduledCallbacks threw', err)
    return []
  }
}

/**
 * Mark a scheduled callback as processed (dialed or failed).
 */
export async function markScheduledCallbackProcessed(input: {
  leadId: string
  status: 'dialed' | 'failed'
}): Promise<void> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return

  try {
    const { data: existing } = await supabase
      .from('all_leads')
      .select('id, unified_context')
      .eq('id', input.leadId)
      .eq('brand', BRAND)
      .maybeSingle()

    if (!existing) return

    const ctx = (existing.unified_context as Record<string, any>) || {}
    const prior = (ctx.voice || {}) as Record<string, any>

    await supabase
      .from('all_leads')
      .update({
        unified_context: {
          ...ctx,
          voice: {
            ...prior,
            scheduled_callback_status: input.status,
            scheduled_callback_processed_at: new Date().toISOString(),
          },
        },
      })
      .eq('id', existing.id)
  } catch (err) {
    console.error('[leadsSupabase] markScheduledCallbackProcessed failed', err)
  }
}

export async function recordCallbackDial(input: {
  phone?: string | null
  status: 'dialing' | 'failed'
  reason?: string | null
  conversationId?: string | null
}): Promise<void> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return

  const normalized = normalizePhone(input.phone ?? '')
  if (!normalized) return

  try {
    const { data: existing } = await supabase
      .from('all_leads')
      .select('id, unified_context')
      .eq('customer_phone_normalized', normalized)
      .eq('brand', BRAND)
      .order('last_interaction_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // The lead is written in parallel with the dial, so on a first-ever capture
    // this can lose the race. No row means nothing to annotate; the next call
    // for the same number will find it.
    if (!existing) return

    const ctx = (existing.unified_context as Record<string, any>) || {}
    const prior = (ctx.voice || {}) as Record<string, any>
    const history = Array.isArray(prior.calls) ? prior.calls : []

    await supabase
      .from('all_leads')
      .update({
        last_touchpoint: 'voice',
        last_interaction_at: new Date().toISOString(),
        unified_context: {
          ...ctx,
          voice: {
            ...prior,
            last_call_at: new Date().toISOString(),
            last_call_status: input.status,
            last_call_reason: input.reason ?? null,
            // Flat copy of the id, not just the one nested in calls[]. The
            // post-call webhook matches on this when the caller's number is
            // withheld and there is nothing else to join on — `contains` cannot
            // reach inside an array element.
            last_conversation_id: input.conversationId ?? null,
            provider: 'elevenlabs',
            source: 'hero_phone',
            // Keep the last 10 attempts so a repeat caller reads as a history
            // rather than a single overwritten timestamp.
            calls: [
              ...history.slice(-9),
              {
                at: new Date().toISOString(),
                status: input.status,
                reason: input.reason ?? null,
                conversation_id: input.conversationId ?? null,
              },
            ],
          },
        },
      })
      .eq('id', existing.id)
  } catch (err) {
    console.error('[leadsSupabase] recordCallbackDial failed', err)
  }
}

/**
 * Writes a finished call's transcript onto the lead.
 *
 * Called by the ElevenLabs post-call webhook. Two ways in, because the webhook
 * does not always carry both: the caller's number, or the conversation_id that
 * recordCallbackDial already stored on the lead when it placed the call. The
 * id path is what makes this work for calls where the number is withheld.
 *
 * Idempotent by conversation_id — ElevenLabs retries on any non-2xx, and a
 * retry must not append the same transcript twice.
 */
export async function recordCallTranscript(input: {
  phone?: string | null
  conversationId?: string | null
  transcript: Array<{ role: string; text: string; at: number | null }>
  durationSecs?: number | null
  status?: string | null
  summary?: string | null
  callerName?: string | null
  businessType?: string | null
  interest?: string | null
  city?: string | null
}): Promise<void> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return

  const normalized = normalizePhone(input.phone ?? '')
  if (!normalized && !input.conversationId) return

  try {
    let row: { id: string; unified_context: any; customer_name?: string | null } | null = null

    if (normalized) {
      const { data } = await supabase
        .from('all_leads')
        .select('id, unified_context, customer_name')
        .eq('customer_phone_normalized', normalized)
        .eq('brand', BRAND)
        .order('last_interaction_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      row = data as any
    }

    // Fall back to the conversation_id stamped on the lead at dial time.
    if (!row && input.conversationId) {
      const { data } = await supabase
        .from('all_leads')
        .select('id, unified_context, customer_name')
        .eq('brand', BRAND)
        .contains('unified_context', { voice: { last_conversation_id: input.conversationId } })
        .limit(1)
        .maybeSingle()
      row = data as any
    }

    if (!row) {
      console.warn('[leadsSupabase] recordCallTranscript: no lead matched', input.conversationId)
      return
    }

    const ctx = (row.unified_context as Record<string, any>) || {}
    const prior = (ctx.voice || {}) as Record<string, any>
    const transcripts = Array.isArray(prior.transcripts) ? prior.transcripts : []

    // The name said ON THE CALL wins over junk names, not over real ones.
    // WhatsApp push names are routinely the COMPANY ("Dynamic English Training
    // Institute", "Ex Director Vitavibe") or the bare phone number, and we then
    // call a human by their brand name (Z, 28 Aug). So:
    //   blank / phone-digits          -> take the caller's name
    //   company-ish / matches their
    //   stated business               -> take the caller's name, and MOVE the
    //                                    old value into the brand-name slot
    //   looks like a real person name -> keep it (a typed form name outranks
    //                                    one transcribed off a phone line)
    const existingName =
      typeof row.customer_name === 'string' ? row.customer_name.trim() : ''
    const caller = (input.callerName || '').trim()
    const phoneLike = (s: string) => /^[+\d][\d\s().-]{5,}$/.test(s)
    const COMPANYISH = /\b(ltd|pvt|private|llp|inc|institute|academy|clinic|hospital|director|enterprises?|traders?|solutions?|technologies|tech|studio|salon|spa|realty|properties|homes?|constructions?|builders?|classes|coaching|training|centre|center|agency|services|foods?|cafe|restaurant|hotel|motors|travels?|tours?|exports?|imports?|industries|group|company|co\.)\b/i
    let nameUpdate: Record<string, unknown> = {}
    let movedCompany: string | null = null
    if (caller && caller.toLowerCase() !== existingName.toLowerCase()) {
      const biz = String(input.businessType || '').trim().toLowerCase()
      const looksLikeBiz = biz.length > 2 && existingName.toLowerCase().includes(biz)
      if (!existingName || phoneLike(existingName)) {
        nameUpdate = { customer_name: caller }
      } else if (COMPANYISH.test(existingName) || looksLikeBiz) {
        nameUpdate = { customer_name: caller }
        movedCompany = existingName
      }
    }

    // Same conversation arriving twice (a retry) replaces rather than appends.
    const withoutThis = transcripts.filter(
      (t: any) => t?.conversation_id !== input.conversationId
    )

    // The displaced company name lands in the brand-name slot the dashboard
    // reads (web.profile.company) - enrichment, not deletion.
    const webCtx = (ctx.web || {}) as Record<string, any>
    const webProfile = (webCtx.profile || {}) as Record<string, any>
    const companyFold = movedCompany && !webProfile.company
      ? { web: { ...webCtx, profile: { ...webProfile, company: movedCompany } } }
      : {}

    await supabase
      .from('all_leads')
      .update({
        ...nameUpdate,
        last_touchpoint: 'voice',
        last_interaction_at: new Date().toISOString(),
        unified_context: {
          ...ctx,
          ...companyFold,
          voice: {
            ...prior,
            last_transcript_at: new Date().toISOString(),
            last_call_summary: input.summary ?? prior.last_call_summary ?? null,
            caller_name: input.callerName ?? prior.caller_name ?? null,
            business_type: input.businessType ?? prior.business_type ?? null,
            interest: input.interest ?? prior.interest ?? null,
            city: input.city ?? prior.city ?? null,
            transcripts: [
              ...withoutThis.slice(-4),
              {
                conversation_id: input.conversationId ?? null,
                at: new Date().toISOString(),
                duration_secs: input.durationSecs ?? null,
                status: input.status ?? null,
                summary: input.summary ?? null,
                turns: input.transcript,
              },
            ],
          },
        },
      })
      .eq('id', row.id)

    // Audit trail: renames must be visible in the Activity feed, same as
    // dashboard edits ("Lead updated by ...").
    if (nameUpdate.customer_name) {
      await supabase.from('activities').insert({
        lead_id: row.id,
        activity_type: 'note',
        note: `Lead updated by PROXe: Name: ${existingName || 'empty'} -> ${caller}`
          + (movedCompany ? `; Brand name: ${movedCompany}` : '')
          + ' (heard on the call)',
        created_by: 'proxe-voice',
      }).then(({ error }: any) => { if (error) console.warn('[leadsSupabase] rename audit failed:', error.message) })
    }

    // ALSO write a `voice_sessions` row: the dashboard's Calls page reads
    // ONLY that table, so calls recorded just into unified_context and
    // conversations left it saying "No calls yet" while real calls sat in the
    // thread. Keyed on call_sid = conversation_id, so a webhook retry updates
    // rather than duplicates.
    if (input.conversationId) {
      const transcription = input.transcript
        .map((t) => `${t.role === 'agent' ? 'agent' : 'caller'}: ${t.text}`)
        .join('\n')
      const { data: existing } = await supabase
        .from('voice_sessions')
        .select('id')
        .eq('call_sid', input.conversationId)
        .maybeSingle()
      const sessionRow = {
        lead_id: row.id,
        brand: BRAND,
        customer_name: input.callerName ?? row.customer_name ?? null,
        customer_phone: input.phone ?? null,
        customer_phone_normalized: normalized || null,
        call_sid: input.conversationId,
        external_session_id: input.conversationId,
        call_duration_seconds: input.durationSecs ?? null,
        call_status: input.status ?? 'completed',
        call_direction: 'outbound',
        transcription,
        call_summary: input.summary ?? null,
      }
      const vs = existing?.id
        ? await supabase.from('voice_sessions').update(sessionRow).eq('id', existing.id)
        : await supabase.from('voice_sessions').insert(sessionRow)
      if (vs.error) console.error('[leadsSupabase] voice_sessions write failed', vs.error.message)
    }

    // ALSO write the turns as `conversations` rows. unified_context is what the
    // lead record reads, but the Chats inbox reads `conversations` - so a
    // transcript stored only in unified_context is invisible exactly where
    // someone goes looking for it. 'voice' is already an accepted channel
    // there alongside whatsapp and web.
    if (input.conversationId && input.transcript.length) {
      // Idempotent: clear this conversation's rows before re-inserting, so a
      // webhook retry replaces rather than duplicates the thread.
      await supabase
        .from('conversations')
        .delete()
        .eq('lead_id', row.id)
        .eq('channel', 'voice')
        .eq('metadata->>conversation_id', input.conversationId)

      const base = Date.now() - (input.durationSecs ?? 0) * 1000
      // ElevenLabs emits a turn of "..." whenever a side said nothing (silence,
      // or the agent's thinking filler). Written verbatim those became a
      // customer "..." answered by an agent "..." in the Chats inbox, which
      // reads as the bot talking to itself (seen live 19 Aug). Silence is not
      // a message - drop those turns at ingest.
      const spoken = input.transcript.filter(
        (t) => String(t.text || '').replace(/[.…\s]/g, '').length > 0,
      )
      if (!spoken.length) return
      await supabase.from('conversations').insert(
        spoken.map((t) => ({
          lead_id: row.id,
          brand: BRAND,
          channel: 'voice',
          // The table's vocabulary is customer/agent, not caller/agent.
          sender: t.role === 'agent' ? 'agent' : 'customer',
          content: t.text,
          message_type: 'text',
          metadata: { conversation_id: input.conversationId, call_id: input.conversationId, at_secs: t.at },
          // Spread across the call's real duration so the thread reads in order
          // instead of collapsing onto one timestamp.
          created_at: new Date(base + (t.at ?? 0) * 1000).toISOString(),
        }))
      )
    }
  } catch (err) {
    // Rethrown: the webhook route turns this into a 500 so ElevenLabs retries.
    console.error('[leadsSupabase] recordCallTranscript failed', err)
    throw err
  }
}

export interface BillingEventInput {
  eventType: string
  webhookId?: string
  email?: string | null
  name?: string | null
  subscriptionId?: string | null
  paymentId?: string | null
  productId?: string | null
  status?: string | null
  currency?: string | null
  /** Minor units as Dodo sends them (paise / cents). */
  amountMinor?: number | null
  nextBillingDate?: string | null
  market?: string | null
  seats?: number | null
  occurredAt?: string | null
}

/**
 * Fold a verified Dodo billing event onto the customer's `all_leads` row, under
 * `unified_context.billing`. One record then carries the whole story: where the
 * lead came from, what they talked about, and what they now pay.
 *
 * Matched by email + brand. A payer we've never seen as a lead (e.g. someone who
 * went straight to a payment link) is INSERTED rather than dropped — losing a
 * paying customer because they skipped the form would be the worse failure. Such
 * rows have no phone, so `customer_phone_normalized` stays null and the usual
 * phone-based dedupe simply doesn't apply to them.
 */
export async function recordBillingEvent(input: BillingEventInput): Promise<SupabaseLeadResult> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return { ok: false, reason: 'not_configured' }

  const email = trimOrNull(input.email)
  if (!email) return { ok: false, reason: 'no_match' }

  const billing = {
    status: input.status ?? null,
    last_event: input.eventType,
    last_event_at: input.occurredAt ?? new Date().toISOString(),
    webhook_id: input.webhookId ?? null,
    subscription_id: input.subscriptionId ?? null,
    payment_id: input.paymentId ?? null,
    product_id: input.productId ?? null,
    currency: input.currency ?? null,
    amount_minor: input.amountMinor ?? null,
    next_billing_date: input.nextBillingDate ?? null,
    market: input.market ?? null,
    seats: input.seats ?? null,
    provider: 'dodo',
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('all_leads')
      .select('id, unified_context')
      .eq('email', email)
      .eq('brand', BRAND)
      .order('last_interaction_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('[leadsSupabase] billing fetch failed', fetchError.code, fetchError.message)
      return { ok: false, reason: 'db_error' }
    }

    if (existing) {
      const existingContext = (existing.unified_context as Record<string, any>) || {}
      const { error: updateError } = await supabase
        .from('all_leads')
        .update({
          last_touchpoint: 'billing',
          last_interaction_at: new Date().toISOString(),
          unified_context: {
            ...existingContext,
            billing: { ...(existingContext.billing || {}), ...billing },
          },
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('[leadsSupabase] billing update failed', updateError.code, updateError.message)
        return { ok: false, reason: 'db_error' }
      }
      return { ok: true, leadId: existing.id as string }
    }

    // Never seen this payer — create the row so the customer isn't lost.
    const { data: created, error: createError } = await supabase
      .from('all_leads')
      .insert({
        customer_name: trimOrNull(input.name),
        email,
        first_touchpoint: 'billing',
        last_touchpoint: 'billing',
        last_interaction_at: new Date().toISOString(),
        brand: BRAND,
        unified_context: { billing },
      })
      .select('id')
      .single()

    if (createError) {
      console.error('[leadsSupabase] billing insert failed', createError.code, createError.message)
      return { ok: false, reason: 'db_error' }
    }
    return { ok: true, leadId: (created?.id as string) ?? null }
  } catch (err) {
    console.error('[leadsSupabase] billing event threw', err)
    return { ok: false, reason: 'db_error' }
  }
}

/**
 * Record a booking against an existing `all_leads` row. The booking payload only
 * carries an email (the calendar step), so we match by email + brand and fold
 * the slot into unified_context.web.booking_*.
 */
export async function updateProxeBooking(input: SupabaseLeadInput): Promise<SupabaseLeadResult> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) return { ok: false, reason: 'not_configured' }

  const email = trimOrNull(input.email)
  if (!email) return { ok: false, reason: 'no_match' }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('all_leads')
      .select('id, unified_context')
      .eq('email', email)
      .eq('brand', BRAND)
      .order('last_interaction_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('[leadsSupabase] booking fetch failed', fetchError.code, fetchError.message)
      return { ok: false, reason: 'db_error' }
    }
    if (!existing) return { ok: false, reason: 'no_match' }

    const existingContext = (existing.unified_context as Record<string, any>) || {}
    const mergedContext = {
      ...existingContext,
      web: {
        ...(existingContext.web || {}),
        booking_label: trimOrNull(input.bookingLabel),
        booking_time: trimOrNull(input.bookingTime),
        booking_status: 'Call Booked',
      },
    }

    const { error: updateError } = await supabase
      .from('all_leads')
      .update({
        last_touchpoint: 'web',
        last_interaction_at: new Date().toISOString(),
        unified_context: mergedContext,
      })
      .eq('id', existing.id)

    if (updateError) {
      console.error('[leadsSupabase] booking update failed', updateError.code, updateError.message)
      return { ok: false, reason: 'db_error' }
    }
    return { ok: true, leadId: existing.id as string }
  } catch (err) {
    console.error('[leadsSupabase] booking threw', err)
    return { ok: false, reason: 'db_error' }
  }
}
