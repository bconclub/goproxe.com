export const BDR_AGENT_IDS = [
  process.env.OUTREACH_AGENT_DM || 'agent_9901m0sn70f1ejn84enhccrns2kt',
  process.env.OUTREACH_AGENT_NONAME || 'agent_8901m0sn6y14eegsqh7mmgdswm92',
  process.env.OUTREACH_AGENT_WARM || 'agent_1201m0sn71mvf3arwzfwv4h9s2v1',
];
export function historyAuthorized(req: Request) {
  const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return !!got && [process.env.DIAL_API_KEY, process.env.BDR_DIAL_KEY].filter(Boolean).includes(got);
}
export function elevenHistory(path: string) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Call history is not configured');
  return fetch('https://api.elevenlabs.io/v1/convai/' + path, { headers: { 'xi-api-key': key }, cache: 'no-store', signal: AbortSignal.timeout(20000) });
}
export async function authorizedCall(id: string) {
  if (!/^conv_[a-zA-Z0-9]+$/.test(id)) return null;
  const r = await elevenHistory('conversations/' + encodeURIComponent(id));
  if (!r.ok) throw new Error('Call could not be loaded');
  const d = await r.json();
  return BDR_AGENT_IDS.includes(d.agent_id) ? d : null;
}
