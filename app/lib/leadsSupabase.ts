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

/** Attribution + brand/site/source folded into unified_context.web. */
function buildContext(input: SupabaseLeadInput) {
  const web: Record<string, unknown> = {
    source: input.source || null,
    brand_name: trimOrNull(input.brandName),
    website_url: trimOrNull(input.websiteUrl),
    attribution: {
      channel: input.channel || null,
      utm_source: input.utmSource || null,
      utm_medium: input.utmMedium || null,
      utm_campaign: input.utmCampaign || null,
      referrer: input.referrer || null,
      landing_page: input.landingPage || null,
    },
  }
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
