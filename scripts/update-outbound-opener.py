#!/usr/bin/env python3
"""[DEV] Patch Intro DM + Intro Cold openers to BDR SoT.

Default is dry-run (prints what would change). Pass --apply on the BDR/VPS
host to PATCH ElevenLabs. Reads ELEVENLABS_API_KEY from
/var/www/goproxe/.env.local and never prints it.

Live agents:
  Intro DM   agent_9901m0sn70f1ejn84enhccrns2kt
  Intro Cold agent_8901m0sn6y14eegsqh7mmgdswm92

Does NOT touch Follow-up or inbound callback agents.
Backups land in /root/proxe-call-controls-backups (mode 0600).
"""
from __future__ import annotations

import copy
import datetime
import json
import os
import pathlib
import sys
import urllib.request

APPLY = "--apply" in sys.argv
OPENER = "Hi — PROXe. We answer WhatsApp and Instagram leads in seconds and book them. Got twenty seconds?"
IDS = [
    "agent_9901m0sn70f1ejn84enhccrns2kt",  # Intro DM
    "agent_8901m0sn6y14eegsqh7mmgdswm92",  # Intro Cold
]


def load_env() -> dict:
    env: dict[str, str] = {}
    path = pathlib.Path("/var/www/goproxe/.env.local")
    if not path.exists():
        raise SystemExit("missing /var/www/goproxe/.env.local")
    for line in path.read_text().splitlines():
        k, s, v = line.strip().partition("=")
        if s:
            env[k] = v.strip().strip('"').strip("'")
    if not env.get("ELEVENLABS_API_KEY"):
        raise SystemExit("ELEVENLABS_API_KEY missing")
    return env


def api(env: dict, path: str, body=None):
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/convai" + path,
        headers={
            "xi-api-key": env["ELEVENLABS_API_KEY"],
            "Content-Type": "application/json",
        },
        data=json.dumps(body).encode() if body is not None else None,
        method="PATCH" if body is not None else "GET",
    )
    with urllib.request.urlopen(req, timeout=45) as res:
        return json.load(res)


def transform(prompt: str) -> str:
    p = prompt
    p = p.replace(
        "You are Proxy (written PROXe, always SAY and spell it Proxy in speech), an AI that answers customer enquiries for businesses.",
        "You are PROXe (always SAY and spell it PROXe in speech — never say Proxy), an AI that answers customer enquiries for businesses.",
    )
    p = p.replace(
        "OPENING SEQUENCE V3, CONFIRM THEN INTRODUCE",
        "OPENING SEQUENCE V4, BDR SoT OPENER",
    )
    old2 = (
        'After confirmation say: "Hi, I\'m Proxy, an AI, and I\'d like to introduce myself. '
        'Can I have thirty seconds?" Then stop and wait.'
    )
    new2 = (
        f'After confirmation say EXACTLY: "{OPENER}" Then stop and wait. '
        "Never say Proxy. Never ask for thirty seconds."
    )
    if old2 not in p and OPENER in p and "OPENING SEQUENCE V4" in p:
        return p  # already applied
    if old2 not in p:
        raise SystemExit("unexpected prompt: opening step 2 not found")
    p = p.replace(old2, new2)
    old_who = (
        'answer "I\'m Proxy, an AI calling to introduce myself. Have I reached {{business_name}}?" '
        "Then wait. Once confirmed, do not repeat your introduction; ask only for thirty seconds."
    )
    new_who = (
        'answer "PROXe — we answer WhatsApp and Instagram leads in seconds and book them. '
        'Have I reached {{business_name}}?" Then wait. Once confirmed, do not repeat the product line; '
        'ask only: "Got twenty seconds?"'
    )
    if old_who not in p:
        raise SystemExit("unexpected prompt: who-is-this branch not found")
    p = p.replace(old_who, new_who)
    p = p.replace(
        "give one brief relevant sentence, then ask whether they have thirty seconds.",
        'give one brief relevant sentence, then ask: "Got twenty seconds?"',
    )
    p = p.replace(
        "A yes to thirty seconds is only permission to explain, not agreement to a demo.",
        "A yes to twenty seconds is only permission to continue, not agreement to a demo.",
    )
    p = p.replace(
        "A no to permission for thirty seconds is not a usefulness objection.",
        "A no to permission for twenty seconds is not a usefulness objection.",
    )
    p = p.replace(
        "3. Only an affirmative answer to that permission question permits the short product explanation below. Never skip the introduction because they said yes to the business question.",
        "3. Only an affirmative answer to that permission question permits continuing. Never skip the PROXe opener because they said yes to the business question.",
    )
    old_short = (
        'After explicit permission to explain, say only: "I take care of the customer side of your business. '
        "Whether an enquiry comes through WhatsApp, your website or Instagram, I follow up and pass interested "
        'customers to your sales team." Stop and listen. Do not append a usefulness question or demo ask to this explanation.'
    )
    new_short = (
        "After explicit permission (yes to twenty seconds), do NOT re-pitch: the opener already stated the product. "
        'Ask only: "Would this be useful for you?" Stop and wait. Do not append a demo ask to this turn.'
    )
    if old_short not in p:
        raise SystemExit("unexpected prompt: short explanation block not found")
    p = p.replace(old_short, new_short)
    old_ack = (
        'After they acknowledge the explanation, for example "okay", ask only: "Would this be useful for you?" '
        "Stop and wait for their answer. Their earlier okay acknowledged hearing you; it did not establish usefulness or demo consent."
    )
    new_ack = (
        "If they already answered the usefulness question, do not ask it again. "
        'If their answer is only "okay" or unclear, clarify once: "Is that something you need help with?" '
        "Do not infer agreement to a demo."
    )
    if old_ack in p:
        p = p.replace(old_ack, new_ack)
    dup = (
        'If their answer to the usefulness question is only "okay" or unclear, clarify once: '
        '"Is that something you need help with?" Do not infer agreement to a demo.\n'
    )
    first = p.find(dup)
    if first != -1:
        second = p.find(dup, first + 1)
        if second != -1:
            p = p[:second] + p[second + len(dup) :]
    for a, b in [
        ("Where are you calling from: Proxy, in Bangalore.", "Where are you calling from: PROXe, in Bangalore."),
        (
            "with Proxy you would not need one. Proxy handles every enquiry",
            "with PROXe you would not need one. PROXe handles every enquiry",
        ),
        (
            "(Proxy is not replacing your team, it makes sure nothing reaches them cold)",
            "(PROXe is not replacing your team, it makes sure nothing reaches them cold)",
        ),
        (
            "Proxy is not replacing your team, it makes sure nothing reaches them cold",
            "PROXe is not replacing your team, it makes sure nothing reaches them cold",
        ),
    ]:
        p = p.replace(a, b)
    if OPENER not in p:
        raise SystemExit("opener missing after transform")
    if "I'm Proxy" in p or "I am Proxy" in p or "spell it Proxy" in p:
        raise SystemExit("spoken Proxy identity still present")
    bad_thirty = [
        line
        for line in p.splitlines()
        if "thirty" in line.lower() and "never ask for thirty" not in line.lower()
    ]
    if bad_thirty:
        raise SystemExit("thirty-seconds ask still present: " + repr(bad_thirty[:3]))
    return p


def main() -> None:
    env = load_env()
    for aid in IDS:
        before = api(env, "/agents/" + aid)
        name = before.get("name")
        cfg = before["conversation_config"]
        old_prompt = cfg["agent"]["prompt"]["prompt"]
        new_prompt = transform(old_prompt)
        already = new_prompt == old_prompt
        summary = {
            "agent": name,
            "agent_id": aid,
            "already_applied": already,
            "prompt_chars": len(new_prompt),
            "opener": OPENER,
            "first_message_unchanged": cfg["agent"].get("first_message"),
            "apply": APPLY,
        }
        print(json.dumps(summary, ensure_ascii=False))
        if already:
            print(name + ": already on BDR SoT opener")
            continue
        if not APPLY:
            print(name + ": dry-run only (pass --apply to PATCH)")
            continue
        folder = pathlib.Path("/root/proxe-call-controls-backups")
        folder.mkdir(mode=0o700, exist_ok=True)
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        backup = folder / f"{aid}-opener-before-{stamp}.json"
        backup.write_text(json.dumps(before, indent=2))
        os.chmod(backup, 0o600)
        patch = {
            "conversation_config": {
                "agent": {
                    "prompt": {
                        "prompt": new_prompt,
                    }
                }
            }
        }
        api(env, "/agents/" + aid, patch)
        after = api(env, "/agents/" + aid)
        ac = after["conversation_config"]
        assert ac["tts"] == cfg["tts"] and ac["asr"] == cfg["asr"]
        assert ac["agent"]["first_message"] == cfg["agent"]["first_message"]
        assert OPENER in ac["agent"]["prompt"]["prompt"]
        assert "I'm Proxy" not in ac["agent"]["prompt"]["prompt"]
        print(name + ": opener patched and read-back verified; backup=" + str(backup))


if __name__ == "__main__":
    main()
