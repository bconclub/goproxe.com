# Outbound call controls, 9 September 2026

Website Hero Callback and Site Widget remain inbound. Their prompts, voices and models were not changed.
Intro DM, Intro Cold and Follow-up now have end_call and a 12-second silence timeout. Voice, ASR, LLM, opening line and unrelated settings were read back unchanged. Their shared WhatsApp tool is detached only from these agents; the shared tool itself was not modified.

Phone-free provider simulations: IVR selected end_call immediately; two silent turns selected end_call after one check-in; callback 5-6 PM was retained in closing; information request plus goodbye selected end_call without another question. These are text simulations, not audio/SIP test calls.

Outbound dial requires one matching ARC target, a durable 24-hour reservation, existing batch allowlist and quiet-hours checks. Dry runs read target/readiness/cooldown but do not reserve or dial. An unavailable ARC refuses calls. Missing decision-maker name selects Intro Cold; Follow-up requires actual prior context.

## [DEV] Arc Reserve 409 Handling (Epitome G-P#2, 21 September 2026)

Arc `/api/agent/outreach/reserve` returns HTTP 409 for multiple distinct reasons:
- `recently_called` — 24-hour cooldown active
- `ambiguous_target` — multiple leads match the phone
- `closed`, `lost`, `won` — deal stage blocks further outreach

The `/api/outreach-dial` endpoint now passes through Arc's concrete `reason` field instead of lumping all 409s as `recently_called_or_ambiguous_target`. Callers should check the specific reason before deciding how to proceed.

**Race condition**: A same-minute 409 with `reason: "recently_called"` may be a race where the dial actually succeeded (probe got 409 while Intro DM call connected). Before treating 409 as HOLD and skipping FETCH/stamp:
1. Check PM2 logs for `[outreach-dial] dialed <phone>` within the same minute, OR
2. Query Arc `outreach_messages` table for a matching phone + same-minute `conversation_id`
3. If a successful CID exists, stamp it instead of skipping

This prevents probes from logging HOLD_409 while the call is actually connecting (e.g. Epitome G-P#2 soft dig: probe logged HOLD_409, Intro DM connected 20s).

On-call send verifies conversation ownership with ElevenLabs before any PROXe access. Outreach and unknown agents cannot send through PROXe. Signed outreach post-call webhooks return after ARC ingestion; every ingestion failure remains retryable, including missing targets. Callback preferences remain pending review, not scheduled calls. No automation promotes a contact.

Prerequisite: user applies ARC migration 20260908000000_outreach_activity.sql. No direct DDL performed. Deploy ARC before enabling new dials. No batch started and no customer message sent during this work.

Provider prompt backups: /root/proxe-call-controls-backups on BDR host, mode 0600. Update script defaults to dry-run; --apply updates only the three named outbound agents.

References: https://elevenlabs.io/docs/eleven-agents/customization/tools/system-tools/end-call and https://elevenlabs.io/docs/api-reference/agents/update
