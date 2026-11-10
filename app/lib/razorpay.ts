// Server-only module: imported by the checkout, billing and webhook routes and
// by the /deploy server page. Holds the Razorpay key secret, so it must never be
// pulled into a client bundle.
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Razorpay Subscriptions, over plain REST (no SDK).
 *
 * Razorpay is the INR provider when its keys are set; Dodo stays for USD and
 * as the INR fallback when they are not. Unlike Dodo, Razorpay is NOT a
 * merchant of record: PROXe is the Indian seller, so the amount on the plan is
 * what we charge, GST included (see `quote()` tax mode 'gst').
 *
 * Field names follow the Subscriptions API docs as read on 10 Nov 2026:
 *   POST /v1/plans                        period, interval, item{name,amount,currency}
 *   POST /v1/subscriptions                plan_id, total_count, quantity, notes, notify_info
 *   GET  /v1/subscriptions/:id
 *   POST /v1/subscriptions/:id/cancel     cancel_at_cycle_end
 *   GET  /v1/invoices?subscription_id=…
 *   GET  /v1/orders/:id/payments
 * Amounts are integer paise. Timestamps are Unix seconds.
 */

const API = 'https://api.razorpay.com/v1'

/** Same placeholder rule as lib/dodo.ts: `PASTE_…` scaffolding counts as unset. */
function env(name: string): string | undefined {
  const v = process.env[name]?.trim()
  if (!v || v.startsWith('PASTE_')) return undefined
  return v
}

/** Both API keys set. The webhook secret is checked separately by the webhook. */
export function razorpayConfigured(): boolean {
  return Boolean(env('RAZORPAY_KEY_ID') && env('RAZORPAY_KEY_SECRET'))
}

/**
 * Monthly cycles a subscription runs for. Razorpay requires a finite
 * `total_count`; the docs cap the total duration (100 years overall, and
 * mandates on some methods at 30). Ten years is far inside every cap and long
 * enough that nobody's plan quietly "completes" on them.
 */
export const SUBSCRIPTION_TOTAL_COUNT = 120

/** A Razorpay subscription id: `sub_` + 14 alphanumerics (19 characters). */
export function looksLikeRazorpaySubscriptionId(id: string | null | undefined): boolean {
  return /^sub_[A-Za-z0-9]{14}$/.test(String(id ?? ''))
}

export type BillingProvider = 'dodo' | 'razorpay'

/**
 * Which provider owns a subscription id.
 *
 * Dodo and Razorpay ids both start with `sub_`, so the prefix decides nothing.
 * The rule, used by /api/billing/status, /api/checkout/verify, /pay and
 * /api/checkout/resume:
 *   1. `provider=razorpay` or `provider=dodo` on the request wins.
 *   2. No param: Dodo, exactly as before Razorpay existed.
 *   3. No param and Dodo answers 404 (or is not configured): Razorpay is tried,
 *      but only when its keys are set and the id has Razorpay's 19-character
 *      shape. `shouldTryRazorpayAfterDodo` is that step.
 */
export function explicitProvider(param: string | null | undefined): BillingProvider | null {
  const p = String(param ?? '').trim().toLowerCase()
  return p === 'razorpay' || p === 'dodo' ? p : null
}

export function shouldTryRazorpayAfterDodo(
  param: string | null | undefined,
  subscriptionId: string | null | undefined
): boolean {
  return explicitProvider(param) === null && razorpayConfigured() && looksLikeRazorpaySubscriptionId(subscriptionId)
}

export class RazorpayError extends Error {
  status: number
  code: string | null
  constructor(status: number, code: string | null, message: string) {
    super(message)
    this.name = 'RazorpayError'
    this.status = status
    this.code = code
  }
}

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const keyId = env('RAZORPAY_KEY_ID')
  const keySecret = env('RAZORPAY_KEY_SECRET')
  if (!keyId || !keySecret) throw new RazorpayError(503, 'not_configured', 'Razorpay is not configured')

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  })
  const json = (await res.json().catch(() => null)) as any
  if (!res.ok) {
    // Razorpay's error body: { error: { code, description, ... } }. Only the
    // code and description are kept; the request (which has no secrets in the
    // body, but may carry an email) is never logged from here.
    throw new RazorpayError(
      res.status,
      json?.error?.code ?? null,
      json?.error?.description ?? `Razorpay ${method} ${path.split('?')[0]} failed with ${res.status}`
    )
  }
  return json as T
}

export type RazorpaySubscriptionStatus =
  | 'created'
  | 'authenticated'
  | 'active'
  | 'pending'
  | 'halted'
  | 'cancelled'
  | 'completed'
  | 'expired'
  | 'paused'

export interface RazorpayPlan {
  id: string
  period: string
  interval: number
  item: { name: string; description?: string | null; amount: number; currency: string }
  notes?: Record<string, string> | unknown[]
}

export interface RazorpaySubscription {
  id: string
  plan_id: string
  customer_id?: string | null
  status: RazorpaySubscriptionStatus | string
  current_start: number | null
  current_end: number | null
  ended_at: number | null
  quantity: number
  /** Razorpay sends `[]` rather than `{}` when there are no notes. */
  notes?: Record<string, string> | unknown[]
  charge_at: number | null
  start_at: number | null
  end_at: number | null
  auth_attempts?: number
  total_count: number
  paid_count: number
  remaining_count?: number
  short_url: string | null
  has_scheduled_changes?: boolean
  created_at: number
}

export interface RazorpayInvoice {
  id: string
  subscription_id: string | null
  order_id: string | null
  payment_id: string | null
  /** draft | issued | partially_paid | paid | expired | cancelled | deleted */
  status: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  short_url: string | null
  issued_at: number | null
  paid_at: number | null
  billing_start: number | null
  billing_end: number | null
  created_at: number
}

export interface RazorpayPayment {
  id: string
  amount: number
  currency: string
  /** created | authorized | captured | refunded | failed */
  status: string
  method: string | null
  order_id?: string | null
  invoice_id?: string | null
  subscription_id?: string | null
  email?: string | null
  contact?: string | null
  error_code?: string | null
  error_description?: string | null
  error_reason?: string | null
  created_at: number
}

/** Razorpay allows at most 15 note pairs, each value up to 256 characters. */
export function cleanNotes(notes: Record<string, string | number | null | undefined>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(notes)) {
    if (value === null || value === undefined) continue
    const text = String(value).trim()
    if (!text) continue
    if (Object.keys(out).length >= 15) break
    out[key] = text.slice(0, 256)
  }
  return out
}

/** Notes as a plain object whatever Razorpay sent (`[]` when empty). */
export function notesOf(entity: { notes?: Record<string, string> | unknown[] } | null | undefined): Record<string, string> {
  const n = entity?.notes
  return n && !Array.isArray(n) && typeof n === 'object' ? (n as Record<string, string>) : {}
}

export function createPlan(input: {
  name: string
  description?: string
  /** Integer paise, the full amount charged each cycle. */
  amountMinor: number
  currency?: string
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  interval?: number
  notes?: Record<string, string>
}): Promise<RazorpayPlan> {
  if (!Number.isInteger(input.amountMinor) || input.amountMinor < 100) {
    throw new RazorpayError(400, 'bad_amount', 'Plan amount must be an integer number of paise, at least 100')
  }
  return call<RazorpayPlan>('POST', '/plans', {
    period: input.period ?? 'monthly',
    interval: input.interval ?? 1,
    item: {
      name: input.name,
      amount: input.amountMinor,
      currency: input.currency ?? 'INR',
      ...(input.description ? { description: input.description } : {}),
    },
    ...(input.notes && Object.keys(input.notes).length ? { notes: input.notes } : {}),
  })
}

export function fetchPlan(planId: string): Promise<RazorpayPlan> {
  return call<RazorpayPlan>('GET', `/plans/${encodeURIComponent(planId)}`)
}

/**
 * Create a subscription. The response's `short_url` is Razorpay's hosted page
 * where the customer authorises the mandate and pays the first cycle. No
 * `start_at`: billing starts with that authorisation payment.
 */
export function createSubscription(input: {
  planId: string
  totalCount?: number
  quantity?: number
  notes?: Record<string, string>
  /** Where Razorpay sends its own emails/SMS (payment failed, change card). */
  notifyEmail?: string | null
  notifyPhone?: string | null
  /** Unix seconds of the first charge. Omitted = charged at authorisation. */
  startAt?: number | null
  /** false = Razorpay sends the customer nothing; we show the link ourselves. */
  customerNotify?: boolean
}): Promise<RazorpaySubscription> {
  const notify = {
    ...(input.notifyEmail ? { notify_email: input.notifyEmail } : {}),
    ...(input.notifyPhone ? { notify_phone: input.notifyPhone } : {}),
  }
  return call<RazorpaySubscription>('POST', '/subscriptions', {
    plan_id: input.planId,
    total_count: input.totalCount ?? SUBSCRIPTION_TOTAL_COUNT,
    quantity: input.quantity ?? 1,
    customer_notify: input.customerNotify ?? true,
    ...(input.startAt ? { start_at: input.startAt } : {}),
    ...(Object.keys(notify).length ? { notify_info: notify } : {}),
    ...(input.notes && Object.keys(input.notes).length ? { notes: input.notes } : {}),
  })
}

/**
 * Every subscription on the account, newest first. Razorpay has no filter on
 * notes, so callers filter in memory; 100 a page, capped at 5 pages.
 */
export async function listSubscriptions(): Promise<RazorpaySubscription[]> {
  const out: RazorpaySubscription[] = []
  for (let skip = 0; skip < 500; skip += 100) {
    const res = await call<{ items?: RazorpaySubscription[] }>('GET', `/subscriptions?count=100&skip=${skip}`)
    const items = res.items ?? []
    out.push(...items)
    if (items.length < 100) break
  }
  return out
}

export function fetchSubscription(subscriptionId: string): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>('GET', `/subscriptions/${encodeURIComponent(subscriptionId)}`)
}

/** Newest first, as Razorpay returns them. */
export async function fetchSubscriptionInvoices(subscriptionId: string): Promise<RazorpayInvoice[]> {
  const res = await call<{ items?: RazorpayInvoice[] }>(
    'GET',
    `/invoices?subscription_id=${encodeURIComponent(subscriptionId)}`
  )
  return [...(res.items ?? [])].sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
}

export function fetchInvoice(invoiceId: string): Promise<RazorpayInvoice> {
  return call<RazorpayInvoice>('GET', `/invoices/${encodeURIComponent(invoiceId)}`)
}

/** Every attempt against one invoice's order, newest first. This is where a failed charge shows up. */
export async function fetchOrderPayments(orderId: string): Promise<RazorpayPayment[]> {
  const res = await call<{ items?: RazorpayPayment[] }>('GET', `/orders/${encodeURIComponent(orderId)}/payments`)
  return [...(res.items ?? [])].sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
}

export function fetchPayment(paymentId: string): Promise<RazorpayPayment> {
  return call<RazorpayPayment>('GET', `/payments/${encodeURIComponent(paymentId)}`)
}

/**
 * Cancel now, or at the end of the paid cycle. Razorpay refuses
 * `cancel_at_cycle_end` on a subscription that has no running cycle (still
 * `created`) or is in its last one; cancel immediately in those cases.
 */
export function cancelSubscription(subscriptionId: string, atCycleEnd = false): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>('POST', `/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
    cancel_at_cycle_end: atCycleEnd,
  })
}

/**
 * Webhook signature check: HMAC-SHA256 of the RAW request body with the webhook
 * secret, hex, compared in constant time against `X-Razorpay-Signature`.
 * The body must be the bytes Razorpay sent; a parsed-and-restringified body can
 * differ and fail. False when the secret or signature is missing.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string | null | undefined = env('RAZORPAY_WEBHOOK_SECRET')
): boolean {
  const sig = String(signature ?? '').trim().toLowerCase()
  if (!secret || !sig || !/^[0-9a-f]{64}$/.test(sig)) return false
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest()
  const given = Buffer.from(sig, 'hex')
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export function webhookSecretConfigured(): boolean {
  return Boolean(env('RAZORPAY_WEBHOOK_SECRET'))
}

/** Unix seconds to ISO, null-safe. */
export function isoFromUnix(seconds: number | null | undefined): string | null {
  return typeof seconds === 'number' && seconds > 0 ? new Date(seconds * 1000).toISOString() : null
}

/**
 * Razorpay subscription state in the words the dashboards already read (they
 * were written against Dodo's): active, pending, past_due, on_hold, cancelled,
 * expired.
 *
 *   created        link made, mandate not authorised yet        pending
 *   authenticated  mandate authorised, first cycle not started  active
 *   active         billing normally                             active
 *   pending        a charge failed, Razorpay is still retrying  past_due
 *   halted         retries exhausted, nothing more is attempted on_hold
 *   cancelled                                                   cancelled
 *   completed      all cycles billed                            expired
 *   expired        never authorised before it lapsed            expired
 *   paused         paused by us, nothing owed                   paused
 */
export function mapSubscriptionStatus(status: string | null | undefined): string {
  switch (status) {
    case 'created':
      return 'pending'
    case 'authenticated':
    case 'active':
      return 'active'
    case 'pending':
      return 'past_due'
    case 'halted':
      return 'on_hold'
    case 'cancelled':
      return 'cancelled'
    case 'completed':
    case 'expired':
      return 'expired'
    default:
      return status || 'unknown'
  }
}

/** Razorpay payment status in Dodo's words: succeeded, processing, failed, refunded. */
export function mapPaymentStatus(status: string | null | undefined): string {
  switch (status) {
    case 'captured':
      return 'succeeded'
    case 'created':
    case 'authorized':
      return 'processing'
    case 'failed':
      return 'failed'
    case 'refunded':
      return 'refunded'
    default:
      return status || 'unknown'
  }
}

/** What /thank-you shows for a Razorpay subscription. */
export function checkoutStateOf(status: string | null | undefined): 'paid' | 'processing' | 'failed' | 'unpaid' {
  if (status === 'active' || status === 'authenticated') return 'paid'
  if (status === 'created') return 'unpaid'
  // pending/halted/cancelled/expired/completed: nothing is in flight to wait for.
  return 'failed'
}

/** Plan period in the word Dodo uses for `interval`. */
export function mapInterval(period: string | null | undefined): string | null {
  switch (period) {
    case 'daily':
      return 'Day'
    case 'weekly':
      return 'Week'
    case 'monthly':
    case 'quarterly':
      return 'Month'
    case 'yearly':
      return 'Year'
    default:
      return period || null
  }
}

export type PaymentState = 'ok' | 'processing' | 'failed' | 'due' | 'grace'

function attemptView(p: RazorpayPayment) {
  const status = mapPaymentStatus(p.status)
  return {
    status,
    amount_minor: p.amount,
    currency: p.currency,
    payment_method: p.method ?? null,
    error_code: status === 'failed' ? (p.error_code ?? p.error_reason ?? null) : null,
    created_at: isoFromUnix(p.created_at),
  }
}

/**
 * The /api/billing/status body for a Razorpay subscription: the SAME keys the
 * dashboards read for a Dodo one. Pure, so it is unit-tested without the API.
 *
 * `attempts` are the payments against the newest invoice's order (newest
 * first), which is where a failed renewal appears; paid invoices only carry
 * their successful payment id.
 */
export function buildBillingStatus(input: {
  sub: RazorpaySubscription
  plan: RazorpayPlan | null
  invoices: RazorpayInvoice[]
  attempts: RazorpayPayment[]
  siteUrl: string
  now?: number
}) {
  const { sub, plan, invoices, attempts } = input
  const now = input.now ?? Date.now()
  const notes = notesOf(sub)
  const status = mapSubscriptionStatus(sub.status)
  const needsPayment = status === 'past_due' || status === 'on_hold'
  const ended = status === 'cancelled' || status === 'expired'

  const lastPayment = attempts[0] ?? null
  // A row that was only opened (status created) is not an attempt.
  const attempt = attempts.find((p) => p.status !== 'created') ?? null
  const attemptStatus = attempt ? mapPaymentStatus(attempt.status) : null

  // Hand-granted grace, same key as the Dodo path: notes.grace_until (ISO date).
  const graceUntil = typeof notes.grace_until === 'string' ? notes.grace_until : null
  const inGrace = !!graceUntil && Date.parse(graceUntil) > now

  const paymentState: PaymentState =
    inGrace && needsPayment
      ? 'grace'
      : attemptStatus === 'processing' && !ended
        ? 'processing'
        : !needsPayment
          ? 'ok'
          : attemptStatus === 'failed'
            ? 'failed'
            : 'due'

  const planAmount = plan ? plan.item.amount * (sub.quantity || 1) : null
  const notedTotal = Number(notes.total_minor)
  const planName = plan?.item?.name ?? null

  return {
    subscription_id: sub.id,
    provider: 'razorpay' as const,
    status,
    // Kept for readers of the Dodo shape: same value as `status` here.
    dodo_status: status,
    // Razorpay's own word: created/authenticated/active/pending/halted/…
    razorpay_status: sub.status,
    // What the client is charged each cycle. The plan amount already includes
    // GST (PROXe is the seller), hence tax_inclusive.
    amount_minor: planAmount ?? (Number.isFinite(notedTotal) && notedTotal > 0 ? notedTotal : null),
    currency: plan?.item?.currency ?? 'INR',
    tax_inclusive: true,
    subtotal_minor: Number(notes.subtotal_minor) || null,
    tax_minor: Number(notes.gst_minor) || null,
    interval: mapInterval(plan?.period),
    next_billing_date: ended ? null : isoFromUnix(sub.charge_at),
    previous_billing_date: isoFromUnix(sub.current_start),
    cancel_at_next_billing_date: false,
    product_name: planName,
    plan_name: planName?.split(/\s+[-(+]/)[0]?.trim() || null,
    last_payment: lastPayment ? attemptView(lastPayment) : null,
    last_attempt: attempt ? attemptView(attempt) : null,
    payment_state: paymentState,
    grace_until: inGrace ? graceUntil : null,
    // Paid bills with Razorpay's hosted invoice page, newest first.
    invoices: invoices
      .filter((inv) => inv.status === 'paid' && inv.short_url)
      .map((inv) => ({
        payment_id: inv.payment_id,
        amount_minor: inv.amount_paid || inv.amount,
        currency: inv.currency,
        created_at: isoFromUnix(inv.paid_at ?? inv.issued_at ?? inv.created_at),
        invoice_url: inv.short_url,
      })),
    needs_payment: needsPayment,
    pay_url: `${input.siteUrl}/pay/${encodeURIComponent(sub.id)}?provider=razorpay`,
  }
}

/** Everything /api/billing/status needs, in as few calls as the API allows. */
export async function loadBillingStatus(subscriptionId: string, siteUrl: string) {
  const sub = await fetchSubscription(subscriptionId)
  const [plan, invoices] = await Promise.all([
    fetchPlan(sub.plan_id).catch(() => null),
    fetchSubscriptionInvoices(subscriptionId).catch(() => [] as RazorpayInvoice[]),
  ])
  const newest = invoices[0] ?? null
  const attempts = newest?.order_id ? await fetchOrderPayments(newest.order_id).catch(() => []) : []
  return buildBillingStatus({ sub, plan, invoices, attempts, siteUrl })
}

/**
 * Where a client pays what is owed on a Razorpay subscription, or null when
 * there is no such page.
 *   created         the authorisation link itself.
 *   pending/halted  the unpaid invoice's page; paying it brings the
 *                   subscription back to active. Falls back to the
 *                   subscription link.
 */
export async function findPayLink(sub: RazorpaySubscription): Promise<string | null> {
  if (sub.status === 'created') return sub.short_url ?? null
  if (sub.status === 'pending' || sub.status === 'halted') {
    const invoices = await fetchSubscriptionInvoices(sub.id).catch(() => [] as RazorpayInvoice[])
    const unpaid = invoices.find((inv) => (inv.status === 'issued' || inv.status === 'partially_paid') && inv.short_url)
    return unpaid?.short_url ?? sub.short_url ?? null
  }
  return null
}
