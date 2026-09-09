export const OUTREACH_IDS = Array.from(new Set([
  process.env.OUTREACH_AGENT_DM || 'agent_9901m0sn70f1ejn84enhccrns2kt',
  process.env.OUTREACH_AGENT_NONAME || 'agent_8901m0sn6y14eegsqh7mmgdswm92',
  process.env.OUTREACH_AGENT_WARM || 'agent_1201m0sn71mvf3arwzfwv4h9s2v1',
  'agent_0301m0na3jjdfkta2sza4h317m4d',
  ...(process.env.OUTREACH_AGENT_IDS || '').split(','),
  ...(process.env.INTRO_TEST_AGENT_IDS || '').split(','),
].map(x => x.trim()).filter(Boolean)));
export const INBOUND_IDS = [
  process.env.ELEVENLABS_CALLBACK_AGENT_ID || 'agent_6201kzbayp7zenc8d3v86sa4zwra',
  process.env.ELEVENLABS_WIDGET_AGENT_ID || 'agent_7301kz312hzffr292fz3d6v04c9q',
];
export function callOwner(id: unknown): 'arc' | 'inbound' | 'unknown' {
  return typeof id === 'string' && OUTREACH_IDS.includes(id) ? 'arc'
    : typeof id === 'string' && INBOUND_IDS.includes(id) ? 'inbound' : 'unknown';
}
export function meaningfulSpeech(value: unknown) {
  return typeof value === 'string' && /[\p{L}\p{N}]/u.test(value);
}
export function callEvidence(d: any) {
  const turns = Array.isArray(d.transcript) ? d.transcript : [];
  const user = turns.filter((t: any) => t.role === 'user' && meaningfulSpeech(t.message));
  const text = user.map((t: any) => t.message).join(' ');
  const fields = d.analysis?.data_collection_results || {};
  const field = (key: string) => { const x = fields[key]; return String(x?.value ?? x ?? '').trim(); };
  const automated = /press (?:[0-9]|one|two|three|four|five|six)|at the tone|record your message|exceeded maximum attempts|no input.*try again/i.test(text);
  const callback = /call (?:me |us |back )?(?:back|later|tomorrow|at)|you can call|when.*doctor/i.test(text) || field('call_outcome') === 'callback';
  let outcome = d.status === 'failed' ? 'failed' : !['done','failed'].includes(d.status) ? 'in_progress'
    : automated ? 'no_answer' : !user.length ? 'no_answer'
    : callback ? 'callback' : ['not_interested','wrong_number','interested'].includes(field('call_outcome')) ? field('call_outcome') : 'connected';
  return { outcome, caller_spoke: user.length > 0 && !automated,
    automated, callback_request: callback ? field('callback_request') || text : null,
    qualified: false };
}
