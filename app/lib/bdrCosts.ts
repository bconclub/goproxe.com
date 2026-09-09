type Data = Record<string, any>;
const finite = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
export function elevenBilling(metadata: Data = {}) {
  const c = metadata.charging || {};
  // Only expose billing fields, not the provider's account or call metadata.
  return { cost: finite(metadata.cost), cost_fiat: finite(metadata.cost_fiat), charging: {
    platform_price: finite(c.platform_price), llm_price: finite(c.llm_price),
    llm_usage: { initiated_generation: { model_usage: c.llm_usage?.initiated_generation?.model_usage || null } },
  } };
}
export function matchVobiz(rows: Data[], sid: string, phone: string) {
  const norm = (v: unknown) => typeof v === 'string' ? v.replace(/\D/g, '') : '';
  const matches = rows.filter(r => r.sip_call_id === sid && r.call_direction === 'outbound' && norm(r.destination_number) === norm(phone));
  // Multiple legs must be reconciled rather than guessed or double-counted.
  if (matches.length !== 1) return null;
  const r = matches[0], amount = finite(r.total_cost);
  if (amount === null || typeof r.currency !== 'string' || !/^[A-Z]{3}$/.test(r.currency)) return null;
  return { amount, currency: r.currency, billable_seconds: finite(r.billsec), status: 'reported' };
}
export async function vobizBilling(d: Data) {
  const empty = (status: string) => ({ amount: null, currency: null, billable_seconds: null, status });
  const id = process.env.VOBIZ_AUTH_ID, token = process.env.VOBIZ_AUTH_TOKEN;
  if (!id || !token) return empty('not_configured');
  const phone = d.metadata?.phone_call;
  const sid = phone?.sip_call_id || phone?.call_sid;
  if (phone?.direction !== 'outbound' || !sid || !phone.external_number) return empty('unmatched');
  try {
    const query = new URLSearchParams({ sip_call_id: sid, call_direction: 'outbound', per_page: '100' });
    const response = await fetch('https://api.vobiz.ai/api/v1/Account/' + encodeURIComponent(id) + '/cdr?' + query,
      { headers: { 'X-Auth-ID': id, 'X-Auth-Token': token }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) return empty('unavailable');
    const body = await response.json();
    if (body.success !== true || body.account_id !== id) return empty('unavailable');
    const rows = Array.isArray(body.data) ? body.data : [];
    if (rows.length >= 100) return empty('unmatched');
    return matchVobiz(rows, sid, phone.external_number) || empty('unmatched');
  } catch { return empty('unavailable'); }
}
