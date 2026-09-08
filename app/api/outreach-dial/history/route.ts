import { historyAuthorized, elevenHistory, BDR_AGENT_IDS } from '../../../lib/bdrHistory';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  if (!historyAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const q = new URL(req.url).searchParams, agent = q.get('agent_id') || '';
  if (!BDR_AGENT_IDS.includes(agent)) return Response.json({ error: 'Unknown BDR agent' }, { status: 400 });
  try {
    const r = await elevenHistory('conversations?agent_id=' + encodeURIComponent(agent) + '&page_size=100' + (q.get('cursor') ? '&cursor=' + encodeURIComponent(q.get('cursor')!) : ''));
    if (!r.ok) return Response.json({ error: 'History unavailable' }, { status: 502 });
    const d = await r.json();
    return Response.json({ conversations: (d.conversations || []).map((c: any) => ({ conversation_id: c.conversation_id, start_time_unix_secs: c.start_time_unix_secs, call_duration_secs: c.call_duration_secs, status: c.status, message_count: c.message_count })), has_more: d.has_more, next_cursor: d.next_cursor }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'History unavailable' }, { status: 503 }); }
}
