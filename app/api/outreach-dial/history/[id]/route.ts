import { callEvidence } from '../../../../lib/outreachPolicy';
import { historyAuthorized, authorizedCall } from '../../../../lib/bdrHistory';
export const dynamic = 'force-dynamic';
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!historyAuthorized(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await ctx.params; const d = await authorizedCall(id);
    if (!d) return Response.json({ error: 'BDR call not found' }, { status: 404 });
    return Response.json({ evidence: callEvidence(d), agent_id: d.agent_id, conversation_id: d.conversation_id, status: d.status, has_audio: !!d.has_audio,
      metadata: { start_time_unix_secs: d.metadata?.start_time_unix_secs, call_duration_secs: d.metadata?.call_duration_secs, phone_call: { external_number: d.metadata?.phone_call?.external_number || null }, error: { message: d.metadata?.error?.reason || d.metadata?.error?.message || null } },
      analysis: { transcript_summary: d.analysis?.transcript_summary || null },
      transcript: (d.transcript || []).map((t: any) => ({ role: t.role, message: t.message, time_in_call_secs: t.time_in_call_secs }))
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'Call unavailable' }, { status: 503 }); }
}
