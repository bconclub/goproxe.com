import { historyAuthorized, elevenHistory, BDR_AGENT_IDS } from '../../../lib/bdrHistory';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  if (!historyAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const q = new URL(req.url).searchParams, agent = q.get('agent_id') || '';
  if (agent && !BDR_AGENT_IDS.includes(agent)) return Response.json({ error: 'Unknown BDR agent' }, { status: 400 });
  try {
    const agents = agent ? [agent] : BDR_AGENT_IDS;
    const pages = await Promise.all(agents.map(async (id) => {
      const r = await elevenHistory('conversations?agent_id=' + encodeURIComponent(id) + '&page_size=100' + (agent && q.get('cursor') ? '&cursor=' + encodeURIComponent(q.get('cursor')!) : ''));
      if (!r.ok) throw new Error('History unavailable');
      return { id, data: await r.json() };
    }));
    const conversations = pages.flatMap(({ id, data }) => (data.conversations || []).map((c: any) => ({ conversation_id: c.conversation_id, agent_id: id, start_time_unix_secs: c.start_time_unix_secs, call_duration_secs: c.call_duration_secs, status: c.status, message_count: c.message_count })))
      .sort((a: any, b: any) => b.start_time_unix_secs - a.start_time_unix_secs);
    return Response.json({ conversations, has_more: agent ? pages[0].data.has_more : pages.some(({ data }) => data.has_more), next_cursor: agent ? pages[0].data.next_cursor : null }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'History unavailable' }, { status: 503 }); }
}
