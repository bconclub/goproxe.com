// Server-only: moving an existing Dodo subscriber onto a Razorpay subscription.
//
// The move is per client, at their own renewal. A Razorpay subscription is
// created with `start_at` = the Dodo plan's next billing date, so the first
// Razorpay charge lands exactly where the Dodo one would have. The client
// approves the mandate on Razorpay's hosted page (a small auth charge that
// Razorpay refunds); the subscription then sits in `authenticated` until
// `start_at`. The moment it is approved we tell Dodo to stop: no charge at the
// next billing date. Until it is approved nothing changes and Dodo bills as
// usual, so a client who ignores the notice is never cut off or charged twice.
//
// The link between the two is `notes.switch_from` = the Dodo subscription id on
// the Razorpay subscription. Nothing else is stored.
import type DodoPayments from 'dodopayments'
import {
  razorpayConfigured,
  createPlan,
  createSubscription,
  listSubscriptions,
  notesOf,
  cleanNotes,
  type RazorpaySubscription,
} from '../razorpay'
import { quote, formatMoney } from './pricing'
import { INCLUDED_SEATS } from '../dodo'

/** Approved (mandate given) or further along: Razorpay now owns the billing. */
const SWITCHED = new Set(['authenticated', 'active', 'pending', 'halted'])
/** Still usable: either approved, or created and waiting for the client. */
const OPEN = new Set(['created', ...SWITCHED])

export function isSwitched(sub: RazorpaySubscription | null | undefined): boolean {
  return !!sub && SWITCHED.has(String(sub.status))
}

/**
 * A created-but-unapproved subscription whose start has passed can no longer be
 * approved (Razorpay expires it), so it must not be offered again.
 */
function usable(sub: RazorpaySubscription): boolean {
  if (!OPEN.has(String(sub.status))) return false
  if (sub.status === 'created' && sub.start_at && sub.start_at * 1000 <= Date.now() + 10 * 60 * 1000) return false
  return true
}

const CACHE_MS = 60_000
const cache = new Map<string, { at: number; sub: RazorpaySubscription | null }>()

/** The Razorpay subscription this Dodo plan is moving (or has moved) to. */
export async function findSwitch(dodoSubscriptionId: string, fresh = false): Promise<RazorpaySubscription | null> {
  if (!razorpayConfigured()) return null
  const hit = cache.get(dodoSubscriptionId)
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.sub
  const all = await listSubscriptions()
  const mine = all
    .filter((s) => notesOf(s).switch_from === dodoSubscriptionId && usable(s))
    .sort((a, b) => Number(isSwitched(b)) - Number(isSwitched(a)) || (b.created_at ?? 0) - (a.created_at ?? 0))
  const sub = mine[0] ?? null
  cache.set(dodoSubscriptionId, { at: Date.now(), sub })
  return sub
}

type DodoSub = Awaited<ReturnType<DodoPayments['subscriptions']['retrieve']>>

function seatsOf(sub: DodoSub): number {
  const extra = (sub.addons ?? []).reduce((n, a) => n + (Number(a.quantity) || 0), 0)
  return INCLUDED_SEATS + extra
}

export interface SwitchOffer {
  seats: number
  subtotal_minor: number
  tax_minor: number
  total_minor: number
  currency: 'INR'
  /** First Razorpay charge. null = charged as soon as the client approves. */
  start_at: string | null
  /** An approval link already created and still waiting, if any. */
  pending_url: string | null
}

/**
 * What the move would cost and when it would start, or null when this plan is
 * not one to move (not INR, already ending, Razorpay not set up).
 * `owesNow` = the Dodo plan has an unpaid period: Razorpay then charges at once.
 */
export function buildOffer(sub: DodoSub, owesNow: boolean, pending: RazorpaySubscription | null): SwitchOffer | null {
  if (!razorpayConfigured()) return null
  if (String(sub.currency).toUpperCase() !== 'INR') return null
  const status = String(sub.status)
  if (status !== 'active' && status !== 'on_hold') return null
  if (sub.cancel_at_next_billing_date) return null
  const seats = seatsOf(sub)
  const q = quote({ seats, currency: 'INR', tax_mode: 'gst' })
  const next = sub.next_billing_date ? Date.parse(sub.next_billing_date) : NaN
  // Razorpay refuses a start in the past; under an hour away is too tight to approve.
  const future = Number.isFinite(next) && next > Date.now() + 60 * 60 * 1000
  return {
    seats,
    subtotal_minor: q.subtotal,
    tax_minor: q.tax,
    total_minor: q.grand_total,
    currency: 'INR',
    start_at: !owesNow && future ? new Date(next).toISOString() : null,
    pending_url: pending && pending.status === 'created' ? pending.short_url : null,
  }
}

/** Create (or reuse) the Razorpay subscription the client approves. */
export async function createSwitch(
  sub: DodoSub,
  offer: SwitchOffer,
  brand: string | null
): Promise<RazorpaySubscription> {
  const existing = await findSwitch(sub.subscription_id, true)
  if (existing) return existing

  const extra = offer.seats - INCLUDED_SEATS
  const notes = cleanNotes({
    switch_from: sub.subscription_id,
    brand,
    market: 'inr',
    seats: offer.seats,
    source: 'dodo_switch',
    tax_mode: 'gst',
    subtotal_minor: offer.subtotal_minor,
    gst_minor: offer.tax_minor,
    total_minor: offer.total_minor,
    email: sub.customer?.email ?? null,
    name: sub.customer?.name ?? null,
  })
  const plan = await createPlan({
    name: extra > 0 ? `PROXe Core + ${extra} extra seat${extra === 1 ? '' : 's'}` : 'PROXe Core',
    description: `${formatMoney(offer.subtotal_minor, 'INR')} + 18% GST ${formatMoney(offer.tax_minor, 'INR')}, billed monthly`,
    amountMinor: offer.total_minor,
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    notes,
  })
  const created = await createSubscription({
    planId: plan.id,
    notes,
    startAt: offer.start_at ? Math.floor(Date.parse(offer.start_at) / 1000) : null,
    // The client approves from their dashboard; Razorpay should not also email a link.
    customerNotify: false,
  })
  cache.set(sub.subscription_id, { at: Date.now(), sub: created })
  return created
}

/**
 * Make sure Dodo takes nothing more for this plan. Safe to call repeatedly.
 * An active plan ends at its next billing date (the paid period is honoured);
 * a plan already on hold for non-payment is cancelled outright, since Dodo
 * would otherwise keep retrying the card.
 */
export async function stopDodo(client: DodoPayments, sub: DodoSub): Promise<'already' | 'stopped'> {
  const status = String(sub.status)
  if (status === 'cancelled' || status === 'expired' || status === 'failed') return 'already'
  if (status === 'active') {
    if (sub.cancel_at_next_billing_date) return 'already'
    await client.subscriptions.update(sub.subscription_id, {
      cancel_at_next_billing_date: true,
      cancel_reason: 'cancelled_by_merchant',
    })
    return 'stopped'
  }
  await client.subscriptions.update(sub.subscription_id, { status: 'cancelled', cancel_reason: 'cancelled_by_merchant' })
  return 'stopped'
}
