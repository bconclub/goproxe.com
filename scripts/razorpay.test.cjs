// Razorpay billing checks. Run: node scripts/razorpay.test.cjs
// No network and no keys: every Razorpay call is a stubbed fetch.
const fs = require('fs'), vm = require('vm'), ts = require('typescript'), assert = require('node:assert/strict'), crypto = require('node:crypto')

function load(file, mocks = {}, globals = {}) {
  const exports = {}
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText
  vm.runInNewContext(js, {
    exports,
    require: (n) => { if (n in mocks) return mocks[n]; throw Error('Unexpected import ' + n) },
    Response, Request, URL, URLSearchParams, AbortSignal, Buffer, Date, console: { ...console, error() {}, warn() {} },
    process: { env: {} }, setTimeout,
    ...globals,
  })
  return exports
}

const KEYS = { RAZORPAY_KEY_ID: 'rzp_test_unit', RAZORPAY_KEY_SECRET: 'unit-secret', RAZORPAY_WEBHOOK_SECRET: 'whsec-unit' }
const N = { NextResponse: Response }
const rzp = (env = {}, fetch = async () => { throw Error('no network in tests') }) =>
  load('app/lib/razorpay.ts', { 'node:crypto': crypto }, { process: { env }, fetch })
const pricing = load('app/lib/billing/pricing.ts')
const sign = (raw, secret = KEYS.RAZORPAY_WEBHOOK_SECRET) => crypto.createHmac('sha256', secret).update(raw).digest('hex')

let count = 0
async function check(name, fn) { await fn(); console.log('PASS ' + name); count++ }

const SUB = {
  id: 'sub_ABCDEFGH123456', plan_id: 'plan_ABCDEFGH123456', status: 'active', quantity: 1,
  current_start: 1760000000, current_end: 1762592000, charge_at: 1762592000, start_at: 1760000000, end_at: 2075000000,
  ended_at: null, total_count: 120, paid_count: 1, short_url: 'https://rzp.io/i/unit', created_at: 1759990000,
  notes: { email: 'buyer@example.com', name: 'Asha Rao', seats: '2', market: 'inr', total_minor: '1179882', subtotal_minor: '999900', gst_minor: '179982' },
}
const PLAN = { id: SUB.plan_id, period: 'monthly', interval: 1, item: { name: 'PROXe Core', amount: 1179882, currency: 'INR' } }
const PAID_INVOICE = {
  id: 'inv_1', subscription_id: SUB.id, order_id: 'order_1', payment_id: 'pay_1', status: 'paid', amount: 1179882,
  amount_paid: 1179882, amount_due: 0, currency: 'INR', short_url: 'https://rzp.io/i/inv1', issued_at: 1760000000,
  paid_at: 1760000100, billing_start: 1760000000, billing_end: 1762592000, created_at: 1760000000,
}
const pay = (status, extra = {}) => ({ id: 'pay_' + status, amount: 1179882, currency: 'INR', status, method: 'card', created_at: 1762592100, ...extra })

;(async () => {
  // ── signature ──────────────────────────────────────────────────────────────
  const lib = rzp(KEYS)
  const raw = JSON.stringify({ event: 'subscription.charged', payload: {} })
  await check('signature: correct HMAC of the raw body passes', () => assert.equal(lib.verifyWebhookSignature(raw, sign(raw)), true))
  await check('signature: uppercase hex still passes', () => assert.equal(lib.verifyWebhookSignature(raw, sign(raw).toUpperCase()), true))
  await check('signature: one changed byte in the body fails', () => assert.equal(lib.verifyWebhookSignature(raw + ' ', sign(raw)), false))
  await check('signature: signed with another secret fails', () => assert.equal(lib.verifyWebhookSignature(raw, sign(raw, 'other')), false))
  await check('signature: missing, empty and malformed signatures fail', () => {
    for (const s of [null, undefined, '', 'abc', 'zz'.repeat(32), sign(raw).slice(0, 62)]) assert.equal(lib.verifyWebhookSignature(raw, s), false)
  })
  await check('signature: no secret configured refuses everything', () => {
    const bare = rzp({ RAZORPAY_KEY_ID: 'a', RAZORPAY_KEY_SECRET: 'b' })
    assert.equal(bare.webhookSecretConfigured(), false)
    assert.equal(bare.verifyWebhookSignature(raw, sign(raw)), false)
    assert.equal(bare.verifyWebhookSignature(raw, sign(raw, '')), false)
  })

  // ── configuration and provider rule ────────────────────────────────────────
  await check('razorpayConfigured needs both keys; PASTE_ placeholders count as unset', () => {
    assert.equal(rzp({}).razorpayConfigured(), false)
    assert.equal(rzp({ RAZORPAY_KEY_ID: 'x' }).razorpayConfigured(), false)
    assert.equal(rzp({ RAZORPAY_KEY_ID: 'PASTE_ID', RAZORPAY_KEY_SECRET: 'y' }).razorpayConfigured(), false)
    assert.equal(lib.razorpayConfigured(), true)
  })
  await check('provider rule: explicit param wins, fallback only for a Razorpay-shaped id with keys set', () => {
    assert.equal(lib.explicitProvider('razorpay'), 'razorpay')
    assert.equal(lib.explicitProvider(' Dodo '), 'dodo')
    assert.equal(lib.explicitProvider(null), null)
    assert.equal(lib.explicitProvider('stripe'), null)
    assert.equal(lib.shouldTryRazorpayAfterDodo(null, SUB.id), true)
    assert.equal(lib.shouldTryRazorpayAfterDodo('dodo', SUB.id), false)
    assert.equal(lib.shouldTryRazorpayAfterDodo(null, 'sub_0NVlongerDodoStyleId123'), false)
    assert.equal(rzp({}).shouldTryRazorpayAfterDodo(null, SUB.id), false)
  })

  // ── status mapping ─────────────────────────────────────────────────────────
  await check('subscription states map to the words the dashboards read', () => {
    const want = { created: 'pending', authenticated: 'active', active: 'active', pending: 'past_due', halted: 'on_hold', cancelled: 'cancelled', completed: 'expired', expired: 'expired', paused: 'paused' }
    for (const [from, to] of Object.entries(want)) assert.equal(lib.mapSubscriptionStatus(from), to, from)
    assert.equal(lib.mapSubscriptionStatus(undefined), 'unknown')
  })
  await check('payment states and checkout states', () => {
    assert.equal(lib.mapPaymentStatus('captured'), 'succeeded')
    assert.equal(lib.mapPaymentStatus('authorized'), 'processing')
    assert.equal(lib.mapPaymentStatus('failed'), 'failed')
    assert.equal(lib.checkoutStateOf('active'), 'paid')
    assert.equal(lib.checkoutStateOf('authenticated'), 'paid')
    assert.equal(lib.checkoutStateOf('created'), 'unpaid')
    for (const s of ['pending', 'halted', 'cancelled', 'expired', 'completed']) assert.equal(lib.checkoutStateOf(s), 'failed', s)
  })

  const build = (over, attempts = [pay('captured')], invoices = [PAID_INVOICE], now) =>
    lib.buildBillingStatus({ sub: { ...SUB, ...over }, plan: PLAN, invoices, attempts, siteUrl: 'https://goproxe.com', now })
  await check('billing status: active subscription has every key the dashboards read', () => {
    const b = build({})
    for (const k of ['subscription_id', 'status', 'dodo_status', 'amount_minor', 'currency', 'tax_inclusive', 'interval', 'next_billing_date', 'previous_billing_date', 'cancel_at_next_billing_date', 'product_name', 'plan_name', 'last_payment', 'last_attempt', 'payment_state', 'grace_until', 'invoices', 'needs_payment', 'pay_url']) assert(k in b, 'missing ' + k)
    assert.equal(b.status, 'active'); assert.equal(b.payment_state, 'ok'); assert.equal(b.needs_payment, false)
    assert.equal(b.amount_minor, 1179882); assert.equal(b.currency, 'INR'); assert.equal(b.interval, 'Month'); assert.equal(b.plan_name, 'PROXe Core')
    assert.equal(b.next_billing_date, new Date(1762592000 * 1000).toISOString())
    assert.equal(b.pay_url, 'https://goproxe.com/pay/sub_ABCDEFGH123456?provider=razorpay')
    assert.equal(b.invoices.length, 1); assert.equal(b.invoices[0].invoice_url, 'https://rzp.io/i/inv1'); assert.equal(b.invoices[0].payment_id, 'pay_1')
    assert.equal(b.last_payment.status, 'succeeded')
  })
  await check('billing status: pending with a failed charge is past_due + failed', () => {
    const b = build({ status: 'pending' }, [pay('failed', { error_code: 'BAD_REQUEST_ERROR' })])
    assert.equal(b.status, 'past_due'); assert.equal(b.needs_payment, true); assert.equal(b.payment_state, 'failed')
    assert.equal(b.last_attempt.error_code, 'BAD_REQUEST_ERROR')
  })
  await check('billing status: halted with no attempt is on_hold + due; a charge in flight is processing', () => {
    assert.equal(build({ status: 'halted' }, []).payment_state, 'due')
    assert.equal(build({ status: 'halted' }, []).status, 'on_hold')
    assert.equal(build({ status: 'pending' }, [pay('authorized')]).payment_state, 'processing')
  })
  await check('billing status: grace_until in notes quietens an owed subscription', () => {
    const now = Date.parse('2026-11-10T00:00:00Z')
    const b = build({ status: 'halted', notes: { ...SUB.notes, grace_until: '2026-11-20' } }, [pay('failed')], [PAID_INVOICE], now)
    assert.equal(b.payment_state, 'grace'); assert.equal(b.grace_until, '2026-11-20')
    assert.equal(build({ status: 'halted', notes: { grace_until: '2026-11-01' } }, [pay('failed')], [], now).payment_state, 'failed')
  })
  await check('billing status: created is pending/ok, cancelled and completed have no next date', () => {
    const c = build({ status: 'created', notes: [] }, [], [])
    assert.equal(c.status, 'pending'); assert.equal(c.payment_state, 'ok'); assert.equal(c.needs_payment, false); assert.equal(c.last_attempt, null)
    assert.equal(build({ status: 'cancelled' }).next_billing_date, null)
    assert.equal(build({ status: 'completed' }).status, 'expired')
  })

  // ── tax ────────────────────────────────────────────────────────────────────
  await check('Razorpay INR quote: 18% on top with or without a GSTIN, integer paise', () => {
    assert.equal(pricing.resolveTaxMode('inr', null, true), 'gst')
    assert.equal(pricing.resolveTaxMode('inr', '29AABCU9603R1ZM', true), 'gst')
    assert.equal(pricing.resolveTaxMode('usd', null, true), 'international')
    const q = pricing.quote({ seats: 2, currency: 'INR', tax_mode: 'gst' })
    assert.equal(q.subtotal, 999900); assert.equal(q.tax, 179982); assert.equal(q.grand_total, 1179882)
    const q5 = pricing.quote({ seats: 5, currency: 'INR', tax_mode: 'gst' })
    assert.equal(q5.subtotal, 999900 + 3 * 99900); assert.equal(q5.grand_total, 1533528); assert(Number.isInteger(q5.grand_total))
  })
  await check('Dodo tax modes are unchanged', () => {
    assert.equal(pricing.resolveTaxMode('inr', null), 'b2c')
    assert.equal(pricing.resolveTaxMode('inr', '29AABCU9603R1ZM'), 'rcm')
    assert.equal(pricing.quote({ seats: 2, currency: 'INR', tax_mode: 'rcm' }).grand_total, 999900)
    assert.equal(pricing.quote({ seats: 2, currency: 'INR', tax_mode: 'b2c' }).grand_total, 1179882)
    assert.equal(pricing.quote({ seats: 2, currency: 'USD', tax_mode: 'international' }).grand_total, 14900)
  })

  // ── checkout route: which provider runs ────────────────────────────────────
  const checkout = (env, calls) => {
    const fetch = async (url, init) => {
      const body = init?.body ? JSON.parse(init.body) : null
      calls.push({ url: String(url), method: init?.method, body, auth: init?.headers?.Authorization })
      if (String(url).endsWith('/plans')) return Response.json({ ...PLAN, item: { ...PLAN.item, amount: body.item.amount } })
      if (String(url).endsWith('/subscriptions')) return Response.json({ ...SUB, status: 'created', notes: body.notes })
      return Response.json({ error: { code: 'BAD_REQUEST_ERROR', description: 'unexpected' } }, { status: 400 })
    }
    const razorpay = rzp(env, fetch)
    const dodoCalls = []
    const route = load('app/api/checkout/route.ts', {
      'next/server': N,
      '../../lib/razorpay': razorpay,
      '../../lib/billing/pricing': pricing,
      '../../lib/leadsSupabase': { markCheckoutStarted: async (i) => { calls.push({ started: i }) } },
      '../../lib/dodo': {
        INCLUDED_SEATS: 2, getCoreProductId: () => 'pdt_core', getSeatProductId: () => 'adn_seat', getBillingCurrency: () => undefined,
        getSiteUrl: () => 'https://goproxe.com',
        getDodoClient: () => ({ checkoutSessions: { create: async (p) => { dodoCalls.push(p); return { checkout_url: 'https://checkout.dodo.test/x', session_id: 'cks_1' } } } }),
      },
    })
    const post = (body) => route.POST(new Request('https://goproxe.com/api/checkout', { method: 'POST', body: JSON.stringify(body) }))
    return { post, dodoCalls }
  }
  await check('checkout: no Razorpay env, INR goes to Dodo and Razorpay is never called', async () => {
    const calls = []; const { post, dodoCalls } = checkout({}, calls)
    const r = await (await post({ market: 'inr', seats: 2, email: 'buyer@example.com', gstin: '29AABCU9603R1ZM' })).json()
    assert.equal(r.ok, true); assert.equal(r.checkoutUrl, 'https://checkout.dodo.test/x'); assert.equal(r.sessionId, 'cks_1'); assert.equal(r.provider, undefined)
    assert.equal(dodoCalls.length, 1); assert.equal(dodoCalls[0].metadata.tax_mode, 'rcm')
    assert.equal(calls.filter((c) => c.url).length, 0)
  })
  await check('checkout: Razorpay env set, INR makes a plan for subtotal + 18% and returns short_url', async () => {
    const calls = []; const { post, dodoCalls } = checkout(KEYS, calls)
    const r = await (await post({ market: 'inr', seats: 4, email: 'buyer@example.com', name: 'Asha Rao', phone: '9876543210', brandName: 'Asha Clinic', gstin: '29AABCU9603R1ZM', source: 'dashboard' })).json()
    assert.deepEqual(Object.keys(r).sort(), ['checkoutUrl', 'ok', 'provider', 'sessionId', 'subscriptionId'])
    assert.equal(r.ok, true); assert.equal(r.checkoutUrl, 'https://rzp.io/i/unit'); assert.equal(r.provider, 'razorpay')
    assert.equal(dodoCalls.length, 0)
    const [plan, sub] = calls.filter((c) => c.url)
    assert.equal(plan.url, 'https://api.razorpay.com/v1/plans'); assert.equal(plan.body.period, 'monthly'); assert.equal(plan.body.interval, 1)
    // 9,999 + 2 x 999 = 11,997.00; GST 2,159.46; total 14,156.46 even with a GSTIN.
    assert.equal(plan.body.item.amount, 1415646); assert.equal(plan.body.item.currency, 'INR')
    assert.equal(plan.auth, 'Basic ' + Buffer.from('rzp_test_unit:unit-secret').toString('base64'))
    assert.equal(sub.url, 'https://api.razorpay.com/v1/subscriptions'); assert.equal(sub.body.plan_id, PLAN.id); assert.equal(sub.body.total_count, 120)
    assert.equal(sub.body.notes.gstin, '29AABCU9603R1ZM'); assert.equal(sub.body.notes.brand_name, 'Asha Clinic'); assert.equal(sub.body.notes.seats, '4')
    assert.equal(sub.body.notes.source, 'dashboard'); assert.equal(sub.body.notes.email, 'buyer@example.com'); assert.equal(sub.body.notes.total_minor, '1415646')
    assert.equal(sub.body.notify_info.notify_phone, '+919876543210')
    assert(Object.keys(sub.body.notes).length <= 15)
    assert.equal(calls.find((c) => c.started).started.provider, 'razorpay')
  })
  await check('checkout: Razorpay env set, USD still goes to Dodo', async () => {
    const calls = []; const { post, dodoCalls } = checkout(KEYS, calls)
    const r = await (await post({ market: 'usd', seats: 2, email: 'buyer@example.com' })).json()
    assert.equal(r.checkoutUrl, 'https://checkout.dodo.test/x'); assert.equal(dodoCalls.length, 1); assert.equal(calls.filter((c) => c.url).length, 0)
  })
  await check('checkout: a Razorpay failure is a 502, never a silent switch to Dodo', async () => {
    const dodoCalls = []
    const razorpay = rzp(KEYS, async () => Response.json({ error: { code: 'SERVER_ERROR', description: 'down' } }, { status: 500 }))
    const route = load('app/api/checkout/route.ts', {
      'next/server': N, '../../lib/razorpay': razorpay, '../../lib/billing/pricing': pricing,
      '../../lib/leadsSupabase': { markCheckoutStarted: async () => {} },
      '../../lib/dodo': { INCLUDED_SEATS: 2, getDodoClient: () => { dodoCalls.push(1); return null }, getCoreProductId: () => null, getSeatProductId: () => null, getBillingCurrency: () => undefined, getSiteUrl: () => '' },
    })
    const res = await route.POST(new Request('https://goproxe.com/api/checkout', { method: 'POST', body: JSON.stringify({ market: 'inr' }) }))
    assert.equal(res.status, 502); assert.equal((await res.json()).reason, 'checkout_failed'); assert.equal(dodoCalls.length, 0)
  })

  // ── webhook route ──────────────────────────────────────────────────────────
  const webhook = (env) => {
    const recorded = [], capi = [], stamps = []
    const razorpay = rzp(env, async (url) => {
      if (String(url).includes('/invoices/inv_sub')) return Response.json({ id: 'inv_sub', subscription_id: SUB.id })
      if (String(url).includes('/invoices/')) return Response.json({ id: 'inv_other', subscription_id: null })
      if (String(url).includes('/subscriptions/')) return Response.json({ ...SUB, status: 'pending' })
      return Response.json({}, { status: 404 })
    })
    const route = load('app/api/webhooks/razorpay/route.ts', {
      'next/server': N, '../../../lib/razorpay': razorpay,
      '../../../lib/leadsSupabase': { recordBillingEvent: async (i) => { recorded.push(i); return { ok: true, leadId: 'lead_1' } }, stampMetaSent: async (...a) => { stamps.push(a) } },
      '../../../lib/metaCapi': { deriveEventId: (k, id) => k + ':' + id, matchKeys: () => ['em'], sendCapiEventResult: async (e) => { capi.push(e); return { sent: false, error: 'no_token', item: null } } },
    })
    const post = (payload, { eventId = 'evt_1', signature } = {}) => {
      const body = JSON.stringify(payload)
      return route.POST(new Request('https://goproxe.com/api/webhooks/razorpay', {
        method: 'POST', body,
        headers: { 'x-razorpay-signature': signature ?? sign(body), ...(eventId ? { 'x-razorpay-event-id': eventId } : {}) },
      }))
    }
    return { post, recorded, capi, stamps }
  }
  const charged = { entity: 'event', event: 'subscription.charged', created_at: 1760000200, payload: { subscription: { entity: SUB }, payment: { entity: { ...pay('captured'), id: 'pay_first', email: 'buyer@example.com', contact: '+919876543210' } } } }

  await check('webhook: refuses when the secret is unset, even with keys', async () => {
    const { post, recorded } = webhook({ RAZORPAY_KEY_ID: 'a', RAZORPAY_KEY_SECRET: 'b' })
    assert.equal((await post(charged)).status, 500); assert.equal(recorded.length, 0)
  })
  await check('webhook: refuses a wrong or missing signature', async () => {
    const { post, recorded } = webhook(KEYS)
    assert.equal((await post(charged, { signature: sign('something else') })).status, 401)
    assert.equal((await post(charged, { signature: '' })).status, 401)
    assert.equal(recorded.length, 0)
  })
  await check('webhook: subscription.charged records the payer and sends one Purchase', async () => {
    const { post, recorded, capi } = webhook(KEYS)
    const r = await post(charged); assert.equal(r.status, 200); assert.equal((await r.json()).recorded, true)
    await new Promise((res) => setTimeout(res, 5))
    assert.equal(recorded.length, 1)
    const e = recorded[0]
    assert.equal(e.provider, 'razorpay'); assert.equal(e.eventType, 'subscription.charged'); assert.equal(e.webhookId, 'evt_1')
    assert.equal(e.email, 'buyer@example.com'); assert.equal(e.subscriptionId, SUB.id); assert.equal(e.paymentId, 'pay_first')
    assert.equal(e.status, 'active'); assert.equal(e.amountMinor, 1179882); assert.equal(e.currency, 'INR'); assert.equal(e.seats, 2)
    assert.equal(e.nextBillingDate, new Date(1762592000 * 1000).toISOString())
    assert.equal(capi.length, 1); assert.equal(capi[0].eventName, 'Purchase'); assert.equal(capi[0].eventId, 'purchase:pay_first'); assert.equal(capi[0].value, 11798.82)
  })
  await check('webhook: the same event id twice is applied once', async () => {
    const { post, recorded, capi } = webhook(KEYS)
    await post(charged, { eventId: 'evt_dup' })
    const again = await post(charged, { eventId: 'evt_dup' })
    assert.equal(again.status, 200); assert.equal((await again.json()).duplicate, true)
    await new Promise((res) => setTimeout(res, 5))
    assert.equal(recorded.length, 1); assert.equal(capi.length, 1)
  })
  await check('webhook: lifecycle events record their state and send no Purchase', async () => {
    const { post, recorded, capi } = webhook(KEYS)
    const states = { 'subscription.authenticated': 'authenticated', 'subscription.activated': 'active', 'subscription.pending': 'pending', 'subscription.halted': 'halted', 'subscription.cancelled': 'cancelled', 'subscription.completed': 'completed' }
    let n = 0
    for (const [event, status] of Object.entries(states)) {
      const r = await post({ event, created_at: 1760000300, payload: { subscription: { entity: { ...SUB, status } } } }, { eventId: 'evt_l' + n++ })
      assert.equal(r.status, 200, event)
      const e = recorded.at(-1)
      assert.equal(e.eventType, event); assert.equal(e.status, status); assert.equal(e.email, 'buyer@example.com'); assert.equal(e.keepUnknown, true)
    }
    assert.equal(recorded.length, 6); assert.equal(recorded.at(-1).nextBillingDate, null); assert.equal(capi.length, 0)
  })
  await check('webhook: payment.failed is recorded only when it belongs to a subscription', async () => {
    const { post, recorded } = webhook(KEYS)
    const failed = (invoice_id) => ({ event: 'payment.failed', created_at: 1, payload: { payment: { entity: { ...pay('failed'), email: 'buyer@example.com', invoice_id } } } })
    const other = await post(failed('inv_other'), { eventId: 'evt_f1' })
    assert.equal((await other.json()).ignored, 'payment.failed_without_subscription'); assert.equal(recorded.length, 0)
    assert.equal((await (await post(failed(undefined), { eventId: 'evt_f2' })).json()).ignored, 'payment.failed_without_subscription')
    await post(failed('inv_sub'), { eventId: 'evt_f3' })
    assert.equal(recorded.length, 1); assert.equal(recorded[0].status, 'failed'); assert.equal(recorded[0].subscriptionId, SUB.id); assert.equal(recorded[0].paymentId, 'pay_failed')
  })
  await check('webhook: other events are acknowledged and ignored', async () => {
    const { post, recorded } = webhook(KEYS)
    const r = await post({ event: 'payment.captured', payload: {} }); assert.equal(r.status, 200); assert.equal((await r.json()).ignored, 'payment.captured'); assert.equal(recorded.length, 0)
  })

  // ── billing status route ───────────────────────────────────────────────────
  const statusRoute = (env, dodoClient) => {
    const urls = []
    const razorpay = rzp(env, async (url) => {
      urls.push(String(url))
      const u = String(url)
      if (u.includes('/subscriptions/sub_MISSING0000000')) return Response.json({ error: { code: 'BAD_REQUEST_ERROR', description: 'The id provided does not exist' } }, { status: 400 })
      if (u.includes('/subscriptions/')) return Response.json(SUB)
      if (u.includes('/plans/')) return Response.json(PLAN)
      if (u.includes('/invoices?')) return Response.json({ items: [PAID_INVOICE] })
      if (u.includes('/orders/order_1/payments')) return Response.json({ items: [pay('captured')] })
      return Response.json({}, { status: 404 })
    })
    const route = load('app/api/billing/status/route.ts', {
      'next/server': { NextResponse: Object.assign(function (b, i) { return new Response(b, i) }, { json: (b, i) => Response.json(b, i) }) },
      '../../../lib/razorpay': razorpay,
      '../../../lib/dodo': { getDodoClient: () => dodoClient, getSiteUrl: () => 'https://goproxe.com' },
    })
    return { get: (q) => route.GET(new Request('https://goproxe.com/api/billing/status?' + q)), urls }
  }
  const dodo404 = { subscriptions: { retrieve: async () => { throw Object.assign(Error('nf'), { status: 404 }) } } }
  await check('status: provider=razorpay returns the Razorpay subscription in the shared shape', async () => {
    const { get } = statusRoute(KEYS, null)
    const r = await get('subscription_id=' + SUB.id + '&provider=razorpay'); assert.equal(r.status, 200)
    const b = await r.json(); assert.equal(b.provider, 'razorpay'); assert.equal(b.status, 'active'); assert.equal(b.amount_minor, 1179882); assert.equal(b.invoices.length, 1)
  })
  await check('status: no param asks Dodo first and falls back to Razorpay only on a 404', async () => {
    const a = statusRoute(KEYS, dodo404)
    assert.equal((await (await a.get('subscription_id=' + SUB.id)).json()).provider, 'razorpay')
    const b = statusRoute(KEYS, dodo404)
    assert.equal((await b.get('subscription_id=' + SUB.id + '&provider=dodo')).status, 404); assert.equal(b.urls.length, 0)
  })
  await check('status: with no Razorpay env the Dodo answers are what they were', async () => {
    const a = statusRoute({}, dodo404)
    assert.equal((await a.get('subscription_id=' + SUB.id)).status, 404); assert.equal(a.urls.length, 0)
    const b = statusRoute({}, null)
    assert.equal((await b.get('subscription_id=' + SUB.id)).status, 503)
    assert.equal((await b.get('subscription_id=' + SUB.id + '&provider=razorpay')).status, 503)
    assert.equal((await b.get('subscription_id=nope')).status, 400)
  })
  await check('status: an id Razorpay does not know is a 404', async () => {
    const { get } = statusRoute(KEYS, null)
    const r = await get('subscription_id=sub_MISSING0000000&provider=razorpay'); assert.equal(r.status, 404); assert.equal((await r.json()).error, 'not_found')
  })

  console.log(count + ' razorpay checks passed')
})().catch((e) => { console.error(e); process.exitCode = 1 })
