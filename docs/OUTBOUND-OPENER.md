# Outbound opener SoT (BDR), 21 September 2026

## Root cause (Batch G FAIL)

`POST /api/outreach-dial` correctly forwards `research_hook` as an ElevenLabs dynamic variable, but **Intro DM** and **Intro Cold** agent prompts never reference `{{research_hook}}`. Their OPENING SEQUENCE V3 hard-coded spoken identity as **Proxy** and permission as **thirty seconds**, so Batch G hooks could not change the live opener.

## Exact first-talk path (after business confirm)

Keep `first_message`: `Hi, is this {{business_name}}?`

After business confirmation, say EXACTLY:

> Hi — PROXe. We answer WhatsApp and Instagram leads in seconds and book them. Got twenty seconds?

Never say Proxy. Never ask for thirty seconds. Clinics may still pass `first_name=Doctor` (title/placeholder rules unchanged).

## Agents

| Role | Agent id | Name |
|------|----------|------|
| Intro DM | `agent_9901m0sn70f1ejn84enhccrns2kt` | Intro DM |
| Intro Cold | `agent_8901m0sn6y14eegsqh7mmgdswm92` | Intro Cold |

Follow-up (`agent_1201m0sn71mvf3arwzfwv4h9s2v1`) is out of scope for this opener SoT.

## Apply (VPS / BDR host)

```bash
cd /var/www/goproxe
python3 scripts/update-outbound-opener.py          # dry-run
python3 scripts/update-outbound-opener.py --apply  # PATCH EL + backup
```

EL prompt PATCH is live immediately (no goproxe rebuild, no brands Vercel). CEO gates merge of this PR; dials stay HOLD until the EL apply is confirmed.

## Tests

```bash
node scripts/outbound-opener.test.cjs
```
