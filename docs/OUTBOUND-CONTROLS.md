# Outbound call controls, 9 September 2026

Website Hero Callback and Site Widget remain inbound. Their prompts, voices and models were not changed.
Intro DM, Intro Cold and Follow-up now have end_call and a 12-second silence timeout. Voice, ASR, LLM, opening line and unrelated settings were read back unchanged. Their shared WhatsApp tool is detached only from these agents; the shared tool itself was not modified.

Phone-free provider simulations: IVR selected end_call immediately; two silent turns selected end_call after one check-in; callback 5-6 PM was retained in closing; information request plus goodbye selected end_call without another question. These are text simulations, not audio/SIP test calls.

Outbound dial requires one matching ARC target, a durable 24-hour reservation, existing batch allowlist and quiet-hours checks. Dry runs read target/readiness/cooldown but do not reserve or dial. An unavailable ARC refuses calls. Missing decision-maker name selects Intro Cold; Follow-up requires actual prior context.

On-call send verifies conversation ownership with ElevenLabs before any PROXe access. Outreach and unknown agents cannot send through PROXe. Signed outreach post-call webhooks return after ARC ingestion; every ingestion failure remains retryable, including missing targets. Callback preferences remain pending review, not scheduled calls. No automation promotes a contact.

Prerequisite: user applies ARC migration 20260908000000_outreach_activity.sql. No direct DDL performed. Deploy ARC before enabling new dials. No batch started and no customer message sent during this work.

Provider prompt backups: /root/proxe-call-controls-backups on BDR host, mode 0600. Update script defaults to dry-run; --apply updates only the three named outbound agents.

References: https://elevenlabs.io/docs/eleven-agents/customization/tools/system-tools/end-call and https://elevenlabs.io/docs/api-reference/agents/update
