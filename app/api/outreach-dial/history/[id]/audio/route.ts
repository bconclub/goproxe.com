import { historyAuthorized, authorizedCall, elevenHistory } from '../../../../../lib/bdrHistory';
export const dynamic = 'force-dynamic';
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!historyAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await ctx.params; const d = await authorizedCall(id);
    if (!d?.has_audio) return Response.json({ error: 'No recording for this attempt' }, { status: 404 });
    const r = await elevenHistory('conversations/' + encodeURIComponent(id) + '/audio');
    if (!r.ok) return Response.json({ error: 'Recording unavailable' }, { status: 502 });
    return new Response(r.body, { headers: { 'Content-Type': r.headers.get('content-type') || 'audio/mpeg', 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'Recording unavailable' }, { status: 503 }); }
}
