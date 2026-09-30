# 🔀 Context Handoff — PROXe / goproxe.com + platform — 2026-08-12

## Goal / what we're doing
Getting goproxe.com converting: the lead-capture path, the voice callback, the
WhatsApp/Meta channel connections, and a printed one-page pitch sheet for
outbound. Everything code-side is shipped and verified live. What remains is a
short list of decisions and tests only the user can do.

## Project facts
- **Landing repo:** `https://github.com/bconclub/goproxe.com` · branch `main` · dir `C:\Users\user\Builds\goproxe`
  - Deploy: push to `main` → GitHub Actions → **VPS 82.29.167.17** (nginx + pm2 `goproxe`, port 3002). NOT Vercel.
  - ⚠️ **A build can land without a restart.** Verify a deploy by pm2 uptime + `.next` mtime, NOT by `git log`. This bit us: git and `.next` both looked correct while Next served the previous build from memory for 2 hours. Fix: `pm2 restart goproxe`.
  - ⚠️ GH Actions deploys failed silently ~3 times in 2 days. Manual fallback used twice (script pattern is in `.github/workflows/deploy.yml`; run the same steps over SSH, then `pm2 restart goproxe`).
- **Platform repo:** `https://github.com/bconclub/proxe` · worktree `C:\PROXe-wt\scope` on branch `fix/leads-hook-scope` (pushes go to `main`)
  - Deploy: push to `main` → Vercel, all brands. Guarded: needs `PUSH_LIVE=1 git push`.
  - Build a brand: `cd core && npm run build:<brand>`.
  - Live now: **v0.4.4** (2026-08-12 14:03 IST) at https://proxe.goproxe.com
- **Live brands:** PROXe, BCON, Lokazen, Windchasers. **POP is OUT OF SCOPE.**

## State right now
- goproxe: `9d29691` on origin/main, **VPS confirmed on 9d29691**. Working tree clean (only untracked `HANDOFF.md`).
- platform: `91cee1a3` pushed to origin/main. Working tree clean.
- Work queue: `C:\Users\user\Builds\goproxe\.claude\state\todo.md` is the source of truth.

## What shipped this thread (newest first)
**goproxe**
- `9d29691` — Deploy modal is now TWO STEPS: name + phone saved immediately, then email/brand/website → checkout. `upsertProxeLead` matches on phone so step 2 updates the same row. The GA4/Meta Lead conversion fires ONCE, on step 1.
- `1eb71cf` — phone before email in the modal
- `053ce35` — 24h callback cooldown now counts only a CONNECTED call (transcript from the post-call webhook), 10-min grace. ElevenLabs returns HTTP 200 even when the call dies, so dead dials were locking numbers out for a day.
- `68f3b1b` / `79682e7` — WhatsApp button beside Deploy in the header (+91 93532 53817). Also trimmed the widget's collapsed iframe from 165px to 92px: ~85px of transparent iframe was swallowing clicks in that corner.
- `e0fe295` — channel icons rebuilt as one family
- `fb8d39e` — CORS on `/_next/static/*` so Clarity replays load fonts/images
- `36a5199` — industry pages: homepage header, 16 photos, per-industry colour; deploy.yml archives `.next/static` so Clarity replays survive deploys

**platform**
- `3f22a72c` — **CSP was blocking `connect.facebook.net`**, so "Failed to load the Meta SDK" killed Connect WhatsApp on every brand. Meta hosts now allowed + `frame-src` for the SDK's hidden iframe.
- `125c82d7` — Windchasers session-type UI removed from PROXe; user bubbles stopped wrapping; line breaks got real spacing; HTML escaping restored in the fork
- `52a673a1` — embedded bubble chat was see-through (backdrop-filter cannot sample the host page from inside a cross-origin iframe)
- `91cee1a3` — changelog entry restored (a relative path had written it into the wrong repo)

**Voice agent (ElevenLabs, not in git)**
- Agent `agent_6201kzbayp7zenc8d3v86sa4zwra` ("PROXe Website Callback"): first_message cut from 35 words to 18 and now ends in a question; `speed` 1.2 → 1.0; `initial_wait_time` 2.5 → 4.0 so the callee says hello first.
- Full config backed up on the VPS: `/var/www/agent-backups/callback-agent-20260812-081443.json`

**Pitch one-pager (PDF, not in git)**
- Deliverable: `C:\Users\user\Downloads\PROXe-one-pager.pdf` — single A4, black and white, press-ad layout (photo, headline, 2 columns, channel rail, connector rail, price, sign-off).
- **Build pipeline preserved at `C:\Users\user\Builds\goproxe\.claude\onepager\`** (template, scripts, base64 assets, README with the fitting rules). The `SCRATCH` path inside the two .py files still points at the old session temp dir — update it before rebuilding.

## Blocked (waiting on the user)
- 🔴 **Test call** — ElevenLabs was `past_due` (that is why every callback failed 8–11 Aug); it is now `active` and a call did connect. The new opener is UNTESTED. Tap "Call me now" and listen.
- 🔴 **Call volume is still bad.** No volume setting exists in the agent config. Likely cause: `agent_output_audio_format: pcm_16000` down an 8kHz SIP trunk (Vobiz). Standard fix is μ-law 8000, NOT applied because a wrong format yields silence, not quiet. Needs a decision + a test call.
- **"48 hours" vs "about a week"** — the one-pager says leads go live in 48 hours; the website and the voice agent both say about a week. Pick one and align all three.
- **Instagram DMs need META APP REVIEW** before they reach the dashboard.
- **Connect WhatsApp** in Agents (needs the user's Facebook login) — now unblocked by the CSP fix.
- Confirm **+91 93532 53817** actually receives WhatsApp.
- Meta CAPI token not set on the VPS · rotate Windchasers' 5 `user_invitations` tokens · Search Console sitemap + indexing.

## Open decisions for the user
1. **Certifications: still none claimed.** No HIPAA / SOC 2 / ISO 27001 / GDPR anywhere. Drop-in point is the trust strip in `IndustryPageTemplate.tsx`.
2. **Connector row on the one-pager** lists Slack · Telegram · Sheets · Calendar · Email · Your CRM · Payment links · Webhooks. Only Slack, Telegram, Calendar, Email and payments are verified in code. "Your CRM" and general webhooks are loose. User was told and chose to keep them.
3. **Channel row** lists Messenger and SMS, which are NOT built (0 references in the platform). User was told and chose to keep them.
4. **Headline size** on the one-pager is 40pt; ceiling is ~48pt (each step costs image height).
5. **"We go."** — user dictated this after the headline; unclear if it is copy. Not added.
6. Pricing insight given: "locked for life" at ₹9,999 with usage-based costs is a margin risk; $149 international is underpriced vs willingness to pay; define what happens past the 500-lead cap; the ₹24,999 anchor commits you to that as the real post-founding price.

## Re-activate in the new thread
- **Caveman mode: ON, full.** **Z Protocol: active** — first reply exactly `Yo! Z`, token estimate at the end, never use em dashes.
- End every reply with the **BUILD REVIEW** block.
- No /build queue or /loop active.

## Conventions to follow
- **Never use em dashes**, anywhere, including code comments and copy.
- **BCON** never "Beacon" · **PROXe** never "Proxy" · **Lokazen** never "location".
- Push on each commit. Platform pushes need `PUSH_LIVE=1`.
- **Verify, don't claim.** Check the DOM / DB / live endpoint. For goproxe deploys check pm2 uptime, not the commit.
- Do not put unverifiable claims in customer-facing copy (certifications, outcome numbers, integrations that do not exist). Check the codebase first.
- goproxe `CHANGELOG.md` has BOM + CRLF; scripted prepends fail silently, always read back.
- **PowerShell gotcha:** `[IO.File]` resolves relative paths against the PROCESS cwd and ignores `Set-Location`. This wrote a changelog entry into the wrong repo. Use absolute paths.
- Rendering page previews as images is the most expensive thing per turn. Verify PDFs with page count / fill % / text assertions instead.
- Relevant memories: `feedback_workflow_style`, `feedback_design_taste`, `reference_landing_structure`, `reference_browser_gotchas`, `reference_git_push_gotcha`, `reference_brand_names`, `reference_vps_access`, `reference-goproxe-changelog-encoding`.

## Links
- https://github.com/bconclub/goproxe.com · https://github.com/bconclub/proxe
- https://goproxe.com · https://proxe.goproxe.com · https://proxe.bconclub.com
- Shared DB (BCON + PROXe): Supabase `ocduyhevwgfexqaxqdsz` · Lokazen `egwwpngaoaeqemieawcx` · Windchasers `flwsyaejscxmattmiskp`

## ▶️ Start here in the new thread
Ask the user for the results of the two live tests only they can run: (1) tap
"Call me now" on goproxe.com and report how the new opener sounds and whether
volume is still low, (2) confirm the WhatsApp number receives a message. If
volume is still bad, switch the agent's `agent_output_audio_format` to μ-law
8000 (backup exists at `/var/www/agent-backups/callback-agent-20260812-081443.json`)
and have them place one more test call.
