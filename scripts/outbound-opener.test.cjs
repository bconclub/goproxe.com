const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const OPENER = 'Hi — PROXe. We answer WhatsApp and Instagram leads in seconds and book them. Got twenty seconds?';
const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'scripts/update-outbound-opener.py'), 'utf8');
const docs = fs.readFileSync(path.join(root, 'docs/OUTBOUND-OPENER.md'), 'utf8');

assert.ok(script.includes(OPENER), 'apply script embeds BDR SoT opener');
assert.ok(docs.includes(OPENER), 'docs embed BDR SoT opener');
assert.ok(script.includes('agent_9901m0sn70f1ejn84enhccrns2kt'), 'targets Intro DM');
assert.ok(script.includes('agent_8901m0sn6y14eegsqh7mmgdswm92'), 'targets Intro Cold');
assert.ok(!script.includes('agent_1201m0sn71mvf3arwzfwv4h9s2v1') || script.includes('Does NOT touch Follow-up'), 'Follow-up out of scope');
assert.ok(script.includes('Never say Proxy'), 'kills Proxy naming');
assert.ok(script.includes('Never ask for thirty seconds'), 'kills 30s ask');
assert.ok(docs.includes('research_hook'), 'docs explain ignored research_hook');
console.log('PASS outbound opener SoT checks');
