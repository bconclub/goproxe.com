# Changelog

## 2026-08-24 23:40 IST · outreach dialing: endpoint, agent routing, batch lock

- POST /api/outreach-dial (Bearer DIAL_API_KEY): places a call from one of
  the three PROXe outreach agents with the prospect's story as dynamic
  variables (never config overrides, those killed calls twice). One call
  per number per 24h from the DB, and a DIAL_ALLOWLIST batch lock that
  ships holding only the BDR test number.
- ElevenLabs post-call webhook now routes OUTREACH agents' transcripts to
  ARC (record + summary + stage on the prospect), never into PROXe. The
  website-callback flow is untouched. Prospects reach PROXe only when
  interest earns a deliberate promotion.

## 2026-08-24 21:10 IST · compare pages: brand violet + breathing room

- Accent color was a hardcoded generic blue (#60a5fa) on a purple-brand
  site. Now the brand violet (#a78bfa), the same token the homepage's own
  CTA card uses, so eyebrow, glow, table highlights and cards all read as
  PROXe. User-facing.
- Hero gets real air: 200px top inset on desktop (was the shared 138px,
  cramped under the floating header), 150px on mobile. User-facing.

## 2026-08-23 20:15 IST · compare + industry pages: full audit pass

- Compare heroes rebuilt: short H1 (PROXe vs X) + one-line deck; the old
  60-char H1s rendered as 5-line towers next to an empty half-viewport
  (the industry grid expects a visual the compare pages never had). Hero is
  now one centered column. User-facing.
- Compare intros cut to two sentences. '(Bangalore ICP)' internal jargon
  removed from a public table; audience wording widened to India.
- Interakt facts refreshed: they cover Instagram DMs now, table said
  WhatsApp only.
- Industry dashboard mock no longer overflows a 375px screen (grid track
  floored at content width on /industries/pro). Industry H1 cap 58px -> 50px.
- Em dashes swept out of all comparison copy per house style.
- Verified: 15 routes x mobile+desktop, zero horizontal overflow, zero
  element overlap, H1s <= 3 lines desktop.

## 2026-08-23 19:30 IST · deploy modal step 2: all optional + WhatsApp exit

- Email, brand name and brand website are optional now. Step 1 already banked
  a reachable lead; required fields here only manufactured bail-outs. Email
  keeps a format check when typed. Any email is fine, work or Gmail.
- New quiet 'Chat on WhatsApp' button under the payment CTA: banks whatever
  step 2 holds, opens wa.me on the PROXe number with a prefilled line.
  Payment stays the loud path. User-facing.

## 2026-08-23 19:05 IST · deploy modal: drop the data-capture subtitle

- Step 1 subtitle no longer announces 'we save it right away, so we can reach
  you even if you stop here', which read as surveillance, not reassurance.
  Now: 'Two quick steps and PROXe is yours.' User-facing.

## 2026-08-23 18:25 IST · hero: Play brings sound with it

- Pressing Play on the demo now unmutes automatically, an explicit play press
  is a clear ask for sound. Preloaded player unmutes instantly; a cold click
  unmutes the moment the player reports ready. The Mute pill still works and
  still wins permanently once touched. User-facing.
- (`286120c`)

## 2026-08-23 12:33 IST · hero: honest CTA label + video plays without the wait

- Hero phone-capture button now reads 'Get a call back', it triggers a callback,
  it never dialed the visitor's ear on the spot. User-facing.
- Pressing Play on the demo poster starts the video instantly: the Vimeo player
  now mounts muted BEHIND the poster once the frame nears the viewport, so the
  click just lifts the cover off an already-playing video (was: cold player
  boot after the click, which read as nothing happening). First paint still
  ships zero Vimeo bytes. User-facing.
- (`5c7f186`)

## 2026-08-11 · feat(deploy): two-step form, name and phone are saved before anything else is asked

- Step 1 asks for name and phone only, and SAVES the lead immediately. Step 2
  collects email, brand name and website, then goes to checkout. Previously a
  five-field wall meant anyone who gave up at "Brand website" left nothing
  behind at all, on a site currently getting about one lead a week.
- `upsertProxeLead` matches on the normalised phone from step 1, so step 2
  updates that same row instead of creating a duplicate.
- The GA4 `form_completed` / Meta `Lead` conversion moved to step 1, the
  moment the person becomes contactable, and fires exactly once. Firing it
  again on step 2 would have reported two leads per person and halved the
  apparent cost per lead.
- Fields are hidden with the `hidden` attribute rather than unmounted, so
  typed values survive stepping back and forth. Needed an explicit
  `.formGroup[hidden] { display: none }`: the group's own `display: flex`
  outranks the browser default for `[hidden]`, so every field stayed on
  screen until that was added.
- Step indicator and a Back link on step 2.

## 2026-08-11 · fix(deploy): phone before email in the Deploy modal

- Field order is now Name, Phone, Work email, Brand name, Brand website, then
  Continue to payment. The two fields that let a human actually reach the
  person are filled first, instead of a work email address sitting between
  them.
- Validation errors now surface in the same order the fields render, so the
  first error points at the first blank field on screen.
- Note: `DeployFormInline.tsx` carries a similar form and is imported nowhere.
  Left untouched rather than silently edited or deleted.

## 2026-08-11 · fix(callback): a call that never connected no longer locks the number out for 24h

- Found while checking why callbacks stopped: the ElevenLabs subscription had
  gone `past_due`, so every dial died. Both attempts today failed at 0
  seconds; on 7 and 8 August the same agent held real 18 to 138 second
  conversations. Billing is now `active` again.
- The outage exposed a worse bug. ElevenLabs returns HTTP 200 even when the
  conversation then fails to initialise, so each dead dial was recorded as
  `dialing` and consumed the caller's 24h cooldown. The retry answered
  `recently_called` and no call was placed. Production logs show exactly that:
  `suppressed, called within 24h { hoursLeft: 19 }`. On top of an outage that
  already stopped it calling, the product then appeared to refuse to call.
- `lastCallbackAt` now only enforces the window for a call that actually
  connected, proven by a transcript from the post-call webhook, with a 10
  minute grace so a double-tap still cannot fire two real calls. An explicit
  `failed` status never counts.
- User-facing: a number whose call silently failed can retry after 10 minutes
  instead of being locked out for a day.

## 2026-08-11 · fix(whatsapp): move the WhatsApp button into the header, beside Deploy

- The float above the chat bubble stacked three circles in one corner and
  dominated the page. It is now a small 34px WhatsApp button sitting directly
  beside the Deploy pill in the floating header, on the homepage and all 8
  industry pages. Same number, same prefilled message.
- The widget dead-zone click fix stays (it blocks clicks on page content
  regardless of the button) and moved to ProxeWidget, where that geometry
  belongs.

## 2026-08-11 · feat(whatsapp): WhatsApp float above the chat bubble

- New WhatsApp button sits directly above the live chat bubble on every page
  (not on /demo), opening a chat to +91 93532 53817 prefilled with "Hi, I
  want to know more about PROXe." A visitor who will not talk to an AI on a
  website still gets a one-tap door into a channel they already use.
- It hides itself while the chat is open (the widget posts wc-chat-open /
  wc-chat-close), so it never floats over a live conversation.
- **Fixed a click-blocking bug found while placing it:** the widget's
  collapsed iframe is 165px tall but the bubble only fills the bottom 80px.
  The remaining ~85px is transparent iframe that still swallowed every click
  over it, so anything in that corner, including the new button, was
  unclickable. The host now trims the collapsed box to 92px and re-applies it
  after the widget's own close handler resets it.
- Analytics: new `whatsapp_click` event, mapped to Meta's STANDARD `Contact`
  (not a custom name) so paid traffic can actually be optimised toward
  WhatsApp conversations.

## 2026-08-11 · fix(industries): channel icons rebuilt, hero card icons legible

- The channel row mixed three icon families as thin outline glyphs dropped
  into saturated solid circles, which read as clip art. Now one family (Font
  Awesome solid) at consistent weight, in a tinted glass chip, with each
  channel carrying its own real colour: WhatsApp green, Instagram in its
  actual brand gradient (a real SVG `<defs>`, since fills cannot take a CSS
  gradient), Web Chat blue, Email amber, Phone the industry accent.
- Fixed alongside: the icon is a `<span>`, so the `.indp-channel span` label
  rule outranked the single-class icon rule and washed every glyph to 52%
  white. The icon rule now carries two classes.
- Hero floating-card icons were invisible against photography: thicker
  stroke, brighter tint, a border, and higher-contrast subtext.

## 2026-08-11 · fix(clarity): CORS on static assets so replays render fonts and images

- Second half of the replay fix. Clarity replays run on clarity.microsoft.com
  and re-fetch our assets cross-origin; browsers CORS-enforce font (and
  canvas image) loads, and we sent no Access-Control-Allow-Origin, so even
  replays with CSS intact rendered in serif system fonts.
- next.config.js now sends `Access-Control-Allow-Origin: *` on
  /_next/static/* and on /unsplash/, /industries/, /proxe/ public assets.
  Static files only, nothing credentialed.
- Together with the chunk archive: sessions recorded from today replay with
  correct layout, fonts and images across future deploys.

## 2026-08-11 · feat(industries): homepage header, real photography, per-industry color

- Industry pages now use THE homepage header: same floating boxed bar, same
  logo assets with the wordmark-to-icon swap on scroll, same glass Deploy
  pill with the label collapse. The page-private nav is gone.
- Real photography on every page: 16 Unsplash photos (2 per industry,
  optimized WebP, committed to /public/unsplash/, credits in _credits.json).
  The live-in-action band gets a photo pane (banner on mobile), the closing
  band gets a tinted photo backdrop.
- De-purpled: sections now theme from each industry's own accent (leak/fix
  panels, orb, steps, channel icons, bands, plus a faint accent tint in the
  page base) so no two industries feel the same. Purple stays only on the
  Deploy CTA, the brand button.
- User-facing: every /industries/* page looks distinct and matches the
  homepage chrome.

## 2026-08-11 · fix(deploy): Clarity replays no longer break on every deploy

- Session replays played back completely unstyled (raw text, no layout).
  Cause: replays request the hashed CSS/JS chunk filenames that existed when
  the session was recorded; the deploy's `rm -rf .next` deleted them, so
  every replay recorded before a deploy 404'd its stylesheets.
- deploy.yml now archives `.next/static` to /var/www/goproxe-static-archive
  before the wipe and merges it back no-clobber after the build (new files
  always win), pruned after 30 days. Open tabs across a deploy get the same
  protection. Replays recorded from now on survive future deploys; replays
  from before today reference chunks that are already gone and stay broken.

## 2026-08-10 · feat(industries): all 8 pages rebuilt to the reference designs

- One shared template, one-to-one with the approved reference mocks: nav,
  split hero with a product visual, trust strip, leak/fix, numbered steps,
  live-in-action panels, six feature cards, capability band, channel row,
  two-column FAQ, closing band.
- Where the three references differ, the registry's new `variant` field picks
  the treatment per industry: clinics gets the dashboard hero + leak/fix
  columns, D2C gets floating cards + arrow rows, real estate gets floating
  cards + the two panels around the PROXe orb. The other five inherit the
  clinic defaults.
- Clinics hero copy updated to the reference. Six hand-written clinic feature
  cards; the other industries get capability-true generated ones.
- The reference mocks' compliance and outcome claims (HIPAA, SOC 2 Type II,
  ISO 27001, GDPR, "99.5% Uptime", "4.9/5 from 500+ brands", "Recovered
  4.2 Cr+", "28% / 2.3x / 35%") are deliberately NOT shipped: unverified
  certifications and unsourced numbers. The trust strip and capability band
  carry claims true of the product today; certifications drop into one place
  when confirmed.
- Fixed on generated pages: steps 2 and 3 were identical and one rendered a
  quoted variable ('PROXe handles "trial" automatically').
- Fixed: hero container lost its horizontal padding on mobile (a bare `0` in
  a padding shorthand stripped the container inset).

## 2026-08-10 · fix(cta): two labels across the whole page, and each one keeps its promise

- The page carried FIVE CTA labels across seven buttons: Deploy, Deploy PROXe,
  Get a call back, Not ready? Book a call, Talk to sales, Talk to us, Book a
  Demo. Now there are two: **Deploy PROXe** and **Call me now**.
- This is also the fix for "it did not go to payment at all... I went to the
  call booking". A sales-path CTA looked identical to the payment one, so the
  wrong door got clicked.
- Destinations were changed too, not only wording. A label that names an
  action has to perform it:
  - The closing CTA said Book a Demo and opened a calendar. It now says Deploy
    PROXe and goes to checkout - closing_cta was removed from SALES_SOURCES,
    which is what had been sending the page's largest, most committed button
    to a booking form.
  - Secondaries said "Book a call" and opened a calendar. They now say "Call
    me now" and actually dial, through the same /api/callback the hero uses.
- The hero keeps a call-framed label rather than becoming Deploy PROXe. It is
  the one button that rings your phone within seconds; calling it Deploy would
  promise deployment and deliver a phone call, turning the page's strongest
  proof into its most misleading moment.
- New CallMeNowButton: one button closed, expands in place into a phone field
  so nothing shifts for people who never touch it. The 24h one-call-per-number
  limit is server-side and anyone who already tried the hero will hit it here,
  so that answer offers the booking calendar instead of reading as an error.
  Failed dials do the same.
- Every new CSS rule is prefixed with .proxe-root. The reset
  ".proxe-root button { background: none; border: none }" is specificity
  (0,1,1) and beats a bare class at (0,1,0) - the trap that left the pricing
  CTAs unstyled for weeks. Verified in the browser: the call button computes
  rgba(124, 58, 237, 0.22) with a 1px border, so the prefix held.
- Verified on the dev server: seven CTAs, two distinct labels, the control
  expands, auto-focuses, and shows a market-aware placeholder (+91 in India).
  Build clean, 40/40 pages.

## 2026-08-10 · fix(callback): the 24h call limit now survives a deploy

- The "one call per number per 24 hours" rule lived in a module-level Map, so
  every deploy and every pm2 restart emptied it. On a site that redeploys on
  each push the real behaviour was closer to one call per number PER DEPLOY -
  precisely the repeat dialling and burnt voice minutes the limit was added to
  stop.
- The durable record already existed and nothing read it: recordCallbackDial
  has been writing unified_context.voice.last_call_at onto the lead since the
  dialler shipped. New lastCallbackAt() reads it back, and /api/callback now
  answers the 24h question from the database.
- Failed dials still count. The attempt consumed a call either way, so a
  failure does not hand out a free retry.
- Fails OPEN on a database error: a blip must not silently stop the product
  doing the one thing the hero promises. The in-memory guard stays for rapid
  double-taps inside a single process, as does the 60s per-IP window (several
  people can legitimately share one office or mobile IP).
- The blocked response now carries hoursLeft, so the UI can say when rather
  than just no.
- Verified against production data: 5 of the 10 most recent PROXe leads carry
  voice.last_call_at, ages 50-79h, all correctly evaluated as allow.

## 2026-08-10 · fix(analytics): Clarity was installed and had never recorded a session

- The Microsoft Clarity tag has been on the page for a while and was
  downloading fine, which is exactly why this looked like a Clarity-side
  problem. It had never started a session.
- Cause: `<Script id="clarity">`. Any element with `id="x"` becomes `window.x`
  through DOM named access, so `window.clarity` was the `<script>` ELEMENT.
  Clarity's snippet opens with `c[a] = c[a] || function(){...}` — it saw that
  truthy element and kept it, so the queue stub was never installed. When the
  real library loaded it called `window.clarity(...)` and threw
  `a[c] is not a function`.
- Fix is the id: `clarity` → `ms-clarity`. Verified on production before and
  after — before: `typeof window.clarity === 'object'` (an HTMLScriptElement),
  no `_clck`/`_clsk` cookies, zero requests to `l.clarity.ms/collect`. After
  renaming: `typeof window.clarity === 'function'`, both cookies set,
  `scripts.clarity.ms/0.8.69/clarity.js` loaded, three POSTs to `/collect`.
- The other tag ids (`ga-config`, `gtm-loader`, `meta-pixel`) are hyphenated,
  so they cannot shadow the globals their snippets use. Clarity's was the only
  single-word id on the page.
- User-facing: none directly, but session recordings and heatmaps start
  arriving, which is the whole point of having it.

## 2026-08-09 16:20 IST · v0.3.11 — positioning: "AI Lead Conversion System"

- User-facing: product line renamed everywhere it appears — hero eyebrow now
  "AI Lead Conversion", page title + meta/OG/Twitter description, capabilities
  heading ("autonomous lead conversion"), footer tagline, callback agent's
  spoken self-intro. Was "AI Customer Acquisition System".
- Meta description replaced with the new positioning copy (every lead owned
  and answered in seconds… 500 leads/month, 2 seats, live dashboard).
- Live ElevenLabs callback agent config synced from the VPS to match the
  reviewed script in route.ts (prompt phrase + first message + voice
  0muxiGNHAVvmM1qWRtyV) — no override on the dial, per the v0.2.x breakages.
- Internal: package.json + README descriptions aligned.

## 2026-08-09 14:30 IST · v0.3.10 — dashboard strip, channel countdown, phone-safe checkout

- User-facing: the Dashboard section no longer renders as a clipped ~146px
  strip after the window has ever been narrower than 900px; the desktop
  resize pass now clears the mobile row height it used to leave behind.
- User-facing: on mobile, the auto-advance countdown line sits directly under
  the channel tab strip (beneath the highlighted channel) instead of hanging
  below the phone mockup.
- User-facing: typing a bare local phone number ("9876543210") in the Deploy
  form no longer silently dumps the buyer on the booking calendar. Dodo
  requires E.164; the checkout route now normalises the number by market,
  and if Dodo still rejects the session with a phone attached it retries
  once without it, so a phone can never cost the sale.
- `9f5a523`, `60bcf1a`, `2c27773`

## 2026-08-09 · feat: industry pages + demo.goproxe.com

- User-facing: all 8 industry cards now open full internal pages at
  /industries/[slug] — pain → fix rows, day-to-day steps, FAQ, per-industry
  OG cards. Clinics, Real Estate and Coaching carry hand-written deep copy.
- User-facing: "See it live" opens a simulated PROXe dashboard themed per
  industry (demo.goproxe.com/[slug] once DNS lands; /demo/[slug] everywhere) —
  seeded live simulation, interactive chats, a website-widget pane that turns
  your message into a lead before your eyes, and a 6-step guided tour ending
  on the Deploy CTA.
- lib/industries.ts is the single registry driving cards, pages, sitemap, OG
  images and the demo. Demo is noindexed three ways and structurally cannot
  write real data.
- 7 new analytics events wire the funnel (industry_page_view → demo_start →
  demo_deploy_click).
- (`98bf5a7`)

## 2026-08-08 16:25 IST · style(hiw): drop the white card outline

- User-facing: the "How It Works" cards lose their 1px white border and the
  inset white top-highlight. Both made sense on all-pale cards; against the
  dark copy half they drew a hard bright line around every card that read
  louder than the content. The drop shadow still separates card from violet.

## 2026-08-09 · feat: Meta Conversions API (server-side conversions)

- Leads, bookings and purchases now reach Meta from our SERVER as well as the
  browser pixel. Ad blockers, iOS tracking prevention and private browsers drop
  10-30% of pixel events today; every dropped one is a conversion Meta never
  learns from, so campaigns optimise on a partial picture and report a worse
  cost-per-result than reality.
- Deduplication is the part that had to be right: Meta merges a pixel event and
  a server event into ONE only when event_name AND event_id match. trackLead()
  now returns the id it used, every capture point hands that same id to
  submitLead(), and the pixel carries it as eventID. Without that the same lead
  would have counted twice - worse than not sending it at all.
- Purchase fires from the Dodo webhook, not the browser: a buyer who closes the
  tab before /thank-you still counts, and the id derives from the payment id so
  Dodo's retries dedupe instead of counting twice.
- PII is SHA-256 hashed (lowercased, trimmed; phones digits-only) before it
  leaves the server. _fbp/_fbc cookies are forwarded from the browser because
  the server cannot read them and they carry the ad click id.
- Inert until META_CAPI_ACCESS_TOKEN is set; the pixel keeps working alone.
- `2d2c750`

## 2026-08-09 · fix: credibility blockers + callback funnel tracking

- User-facing: the three invented testimonials are gone. Zero testimonials
  beats fake ones — one detected fake makes every true claim suspect. The
  carousel component stays unrendered so real customers are a data swap.
- User-facing: seven industry "results" (68% fewer no-shows, 3x site visits,
  4.2x enrollments...) reframed as capabilities. Unsourced outcome numbers are
  the same liability as a fake testimonial, eight times over. Only Home
  Services' 5x faster response survives — that is a property of the product,
  not a client result. Deep copy for clinics/realestate/coaching stripped of
  the same numbers so cards and pages agree.
- User-facing: final-CTA microcopy replaced. "No credit card" was false (Deploy
  goes to a paid checkout), "Setup in minutes" contradicted the 48-hour FAQ,
  "ROI from day one" was unverifiable. Now: Live in 48 hours / No technical
  work from your side / Cancel anytime.
- User-facing: pricing headline "Your entire marketing department" ->
  "Every channel. One memory. One price." The old line reclaimed the
  acquisition framing the new category line had just dropped.
- User-facing: the How It Works lead score no longer renders 0. The gauge faded
  in 150ms before the count-up started and reset to 0 every loop. Target 82.
- Callback rate limit is now one call per number per 24 hours (was 90 seconds,
  which only stopped a double-tap and let one person burn voice minutes).
- 14 new analytics events, GA4 + Meta. The callback funnel is the point:
  callback_start / submit / dialed / failed / blocked make the ~33% of dials
  that never connect visible for the first time.
- `4837ffa`

## 2026-08-08 16:05 IST · fix(pricing): the pricing buttons had no styling at all

- User-facing: "Deploy PROXe" and the Scale button now actually render their
  gradients, borders and glow. They never have. A reset near the top of
  `landing.css` — `.proxe-root button { border: none; background: none; color:
  inherit }` — is specificity (0,1,1) and beat every `.pr-cta--*` rule at
  (0,1,0), so both pricing CTAs painted as bare text. That is why the paid
  action did not look clickable and the "Not ready? Book a call" link below it
  was collecting clicks meant for checkout.
- The hero CTA already carries a `.proxe-root` prefix with a comment explaining
  this exact trap; the pricing CTAs never got it. Prefixed now.
- Confirmed against production before changing anything: `.pr-cta--primary`
  computed to `background-image: none`, `border-color: rgb(255,255,255)` on
  live goproxe.com. Not a colour-choice problem.
- Primary also lifted off near-navy (`#4c1d95` → `#312e81`) onto the brand stop
  (`#6d28d9` → `#7c3aed` → `#6366f1`) so it reads as the lit thing in the card.
- Removed a duplicate `.pr-cta--ghost:hover` block, keeping the later one's
  values since those were the ones actually winning.

## 2026-08-08 15:20 IST · style(hiw): dark card halves, animations at 2x

- User-facing: the three "How It Works" cards now read as dark objects with a
  lit window in them, instead of two pale halves floating on the violet. Only
  the animation panel stays light — the copy half is the page's own deep violet
  (`#1b1040` → `#150c30`), with the title and body inverted to white.
- Every animation beat halved, so all three cards move at 2x. Card 1 capture
  rows 400/1200/2000 → 200/600/1000 (loop 4800 → 2400); card 2 memory rows
  300/1100/1900/2700 → 150/550/950/1350, score count-up 1000ms → 500ms
  (loop 6400 → 3200); card 3 reply build-up 250/700/1200/1500 →
  125/350/600/750 (loop 6500 → 3250). Ratios preserved, so the choreography is
  unchanged — it just no longer spends most of its time waiting.

## 2026-08-06 17:10 IST · feat(hero): v0.1.11 — the ring-fill call circle, wired to a real dialler

- User-facing: hero capture is now one gesture — "Talk to PROXe" pill collapses
  into a circle on the first digit; a ring around it fills digit by digit
  (full at 10), lights the brand gradient, and the tap makes PROXe actually
  call the visitor. Success state: "Ringing… pick up." with a call-wave pulse.
- NEW /api/callback: ElevenLabs outbound dial from our SIP number
  (+91 80467 33388) as the new "PROXe Website Callback" agent
  (`agent_6201kzbayp7zenc8d3v86sa4zwra`) — a website-greeter persona, distinct
  from the on-page demo orb. E.164 normalisation by market, per-phone (5 min) +
  per-IP (60s) cooldowns, failed dials don't burn the cooldown, dial failure
  falls back to "Number saved — PROXe will call you shortly."
- Lead capture and dial fire in parallel; neither blocks the other.
- Hero pill narrowed to 320px — number-width, not form-width.
- Idle button label: "Talk to PROXe" (was "Get a callback"); always-on hint
  line removed.
- Orb connecting ring: reduced-motion users saw the 25% arc frozen mid-sweep
  ("stuck at quarter") — now shows a full steady ring instead.
- Deploy note: VPS .env.local must contain ELEVENLABS_API_KEY or the hero
  saves leads without ringing (route logs + returns 503).

## 2026-08-06 16:05 IST Â· feat(hero): v0.1.10 â€” bigger headline, Call-me morph button, tighter copy

- Hero headline scaled up (`clamp(56px, 13.6vw, 140px)`) after several rounds
  of user sizing; subtitle down to 15.5px.
- Eyebrow now reads "AI Customer System" (was "AI Customer Acquisition").
- "What's PROXe?" CTA removed from the hero â€” the phone capture is the one action.
- Phone-capture hint reads just "PROXe calls you right away." (no-spam line cut).
- User-facing: the moment a digit is typed, "Get a callback" morphs into a
  purple-gradient "Call me" button with a phone icon and a calm breathing glow.
- Dev-only: second dev server can run beside another session's â€”
  `NEXT_DIST_DIR=.next-alt` distDir opt-in in next.config.js, `goproxe-dev-alt`
  launch config on port 3003, `.next-alt/` gitignored.
- `(d177ad1)`

## 2026-08-06 14:15 IST Â· feat(hero): v0.1.5 â€” phone quick-capture, sound-on video, Hubot Sans headings

- Hero phone capture: one `tel` field + "Get a callback" pill under the hero
  subtitle â€” the lowest-friction conversion on the page. Fires the same funnel
  events as the deploy form (`lead_form_start` â†’ `form_completed`/Meta `Lead`,
  source `hero_phone`), lands in the same `/api/lead` sink (Supabase
  `all_leads` upserts by phone, sheet backup), and pre-fills the chat widget
  via localStorage (merged, never clobbers a stored name/email).
- Demo video now starts with sound ON. If the browser blocks unmuted autoplay,
  a 1.5s fallback drops to muted playback (silent playing beats a frozen
  frame); `timeupdate` subscription is the playing signal so an
  already-playing video is never wrongly muted, and scrolling away cancels the
  pending fallback.
- Headings switched from Instrument Serif to Hubot Sans (Fontsource variable,
  weight 650, tighter tracking) across every big section headline.
- Mobile mute toggle shrunk to a 30px translucent chip â€” the old 640px
  override lacked the `.proxe-root` specificity prefix, so phones were
  getting the full 88Ã—40 desktop pill.
- User-facing: hero gains a phoneâ†’callback field; demo video plays with sound
  where the browser allows; all headlines render in a bold sans.
- `6ab8044`

## 2026-08-03 22:10 IST Â· feat(checkout): v0.1.4 â€” lean Dodo checkout, full prefill, INR mandate ceiling

The hosted Dodo page opened with the order summary expanded and every optional
field switched on. Each option below defaults to ON in Dodo, so each line is a
field or panel deliberately removed.

- `show_order_details: false` â€” the summary no longer opens expanded. On mobile
  this genuinely collapses it and lifts the first form field to 264px from the
  top. On desktop Dodo renders the summary as a fixed side panel regardless;
  that part is their layout and is not configurable.
- `allow_discount_code: false` â€” an empty "promo code?" box only invites people
  to leave and hunt for one. No public codes exist on founding pricing.
- `allow_tax_id: false` â€” we don't collect GST/VAT, so the field was dead weight.
- `allow_currency_selection: false` â€” we quote by detected market and charge in
  that same currency. A switcher on Dodo's page would let someone see â‚¹9,999 and
  be billed $149, the exact mismatch shared market detection exists to prevent.
- `minimal_address: true` â€” only zipcode required; street/city/state aren't
  needed to bill a subscription and every required field costs completions.
- `redirect_immediately: true` â€” skips Dodo's own success screen and lands the
  buyer straight on /thank-you, where the onboarding call gets booked.

Prefill now covers phone. The deploy form already collected it and sent it to
our lead API, but never to Dodo, so buyers retyped a number they'd given one
screen earlier. Name, email and phone all arrive prefilled; country resolves
to IN automatically.

INR e-mandate ceiling set explicitly to â‚¹25,000 (`mandate_min_amount_inr_paise`).
RBI recurring card payments authorise a maximum amount up front. Dodo sends
`max(this, actual charge)` and falls back to a â‚¹15,000 default, so â‚¹9,999 works
today by luck â€” but a customer adding 6+ seats at â‚¹999 crosses â‚¹15,000 and the
renewal fails a month later, silently. The ceiling costs the customer nothing
(they're still only charged the real amount) and cannot be raised later without
re-subscribing everyone. This closes the renewal risk flagged earlier.

User-facing: shorter, faster checkout with fewer fields to fill.

Verified against the live Dodo API: every option accepted (session
cks_0NkbN3iVWDV6R0gylDJjP), and the rendered page confirms name/email/phone
prefilled, no promo field, no currency switcher, address reduced to zipcode.


## 2026-08-03 21:05 IST Â· feat(analytics): v0.1.3 â€” turn the Meta Pixel on and map every event to it

The Meta Pixel loader had been in `AnalyticsScripts.tsx` for months but never
fired once: it was gated on `NEXT_PUBLIC_META_PIXEL_ID`, which was never set in
Vercel, so the guard was always false. Every ad conversion the site has ever
driven went unreported.

- Pixel id `1480338647459819` is now a hardcoded default, same pattern GA4 and
  Clarity already use in this file. A pixel id ships in the client bundle and is
  readable in page source, so there is nothing env was protecting â€” and env is
  precisely what kept it dark.
- All 17 landing events now reach the pixel, not just `form_completed`. Meta
  only optimises toward its own STANDARD event names, so the mapping is
  explicit: 7 standard (`Lead`, `InitiateCheckout`, `Purchase`, `Schedule`,
  `CompleteRegistration`, `ViewContent`) via `fbq('track')`, 10 custom via
  `fbq('trackCustom')`. A non-standard name sent through 'track' is silently
  dropped by ad delivery â€” visible in the debugger, useless for optimisation.
- `Purchase` now carries real revenue. It previously fired with no value at all,
  which reports every campaign as earning zero. New `trackPurchase()` sends the
  actual subscription amount in the buyer's own currency.
- `Lead` value was a flat `1 USD` for everyone. It now sends the market's real
  Core price, so value-optimised bidding stops treating an Indian signup and an
  international one as worth the same (they differ ~20x).
- Numeric prices moved to `CORE_PLAN` / `planValue()` in `lib/market.ts` so the
  amount reported as revenue is the same one quoted and charged. PricingSection
  holds display strings ('9,999') which cannot be sent to an ad platform.
- New `pricing_view` event (Meta `ViewContent`) fires once when the pricing
  section scrolls into view â€” the clearest buying signal short of a click, and
  what retargeting audiences get built from.

User-facing: no visible change. Analytics/ads instrumentation only.

Clarity (`u43ad5p156`) and GA4 (`G-GZ7HN8BM1M`) were already correct and live;
verified, not changed.

Verified against a production build served locally: pixel init + noscript
fallback, GA4 config and Clarity tag all present in the served HTML; all 16 Meta
names compiled into the client bundle; 17/17 events mapped with no unmapped
events, no orphan mappings, and no invalid standard names.


## 2026-05-31 Â· feat: persist leads to a Google Sheet

Leads were going nowhere retrievable â€” the deploy form only wrote to the visitor's
own localStorage + an anonymized GA event (a `setTimeout` stood in for a real API).
Now every submission is written to the leads spreadsheet.

Flow: `submitLead()` (`lib/leads.ts`) â†’ `POST /api/lead` (server route, hides the
URL) â†’ Google Apps Script Web App â†’ the sheet. The Apps Script upserts by email.

- `POST /api/lead` forwards to `LEADS_WEBHOOK_URL` (server-only env). If unset it
  returns `{ ok:false, reason:'not_configured' }` so the form still works â€” leads
  just aren't written yet. Never throws to the client.
- `DeployModal`: the lead row is written the moment the **form** completes (so we
  keep leads who skip the calendar); confirming a slot sends a **booking** update
  that fills the same row's Booking columns (matched by email). Removed the old
  fake `setTimeout` placeholder.
- `DeployFormInline` (chat form) writes leads the same way.
- `google-apps-script/leads-sheet.gs` + README â€” paste into the sheet's Apps Script,
  deploy as a Web App, set `LEADS_WEBHOOK_URL`. Sheet ID is pre-filled.

Verified in preview: form submit posts the full contact payload, booking confirm
posts the slot â€” both to /api/lead. No console errors.

**Action required:** deploy the Apps Script and set `LEADS_WEBHOOK_URL` (see
`google-apps-script/README.md`) before the sheet starts filling.

## 2026-05-31 Â· chore: rename analytics events for clarity

- `generate_lead` â†’ `form_completed` (the deploy form was submitted). Still maps to
  Meta `Lead` and keeps the `value`/`currency` params.
- `thank_you_view` â†’ `demo_booked` (reached /thank-you after picking a slot).

Note: `form_completed` is a custom name (not the GA4-recommended `generate_lead`), so
if you mark it as a Key Event / conversion in GA4 it won't auto-inherit the recommended
lead semantics â€” flag it manually in Admin â†’ Events.

## 2026-05-31 Â· feat: deploy modal flip-side booking calendar

The deploy modal flips to an inline month + time picker after the form, instead of
jumping straight to /thank-you. Flow is now: fill form â†’ **lead fires once** â†’ card
flips to the booking calendar â†’ pick a day + time â†’ **/thank-you** (no second lead).

- New `BookingCalendar` (`BookingCalendar.tsx` + `.module.css`) â€” month grid with
  prev/next nav, past days + Sundays disabled, time-slot pills that appear once a
  day is chosen, and a confirm button. Opens on the first month that actually has a
  bookable day (so landing on a month-end Sunday doesn't show an all-greyed month).
- `DeployModal` restored to a flip card: front = capture form (fires `generate_lead`
  on submit), back = `BookingCalendar`. Confirming a slot stores it, fires
  `booking_confirm` (day-of-week + time, no PII), and routes to /thank-you. The lead
  event does **not** fire again.
- Booking persisted via `storeBooking`/`getStoredBooking` (`proxe.booking`).
- `/thank-you` now reflects the chosen slot: "You're booked", the date + time in the
  meta box, and an "Add to your calendar" CTA. Falls back to the generic
  pick-a-time copy if no slot was chosen.
- New event `booking_confirm`; `thank_you_view` / `book_call_click` now carry
  `has_booking`.

Verified end-to-end in preview: form â†’ flip â†’ June calendar â†’ June 1 Â· 11:00 AM â†’
/thank-you showing the slot. No console errors.

## 2026-05-30 Â· fix: don't report analytics from dev / localhost

Local `npm run dev` was loading the live GA property (`G-GZ7HN8BM1M`) and sending
real hits â€” so preview testing showed up as extra users/events in the dashboard.
Now `AnalyticsScripts` renders nothing unless `NODE_ENV === 'production'`, and
`track()` additionally short-circuits on localhost / loopback hosts (belt-and-
suspenders for a prod build run locally). The deployed site is unaffected.

Also confirmed the `thank_you_view` event fires exactly **once** per visit (verified
in the raw GA `/g/collect` beacons); the inflated realtime counts were cumulative
dev-testing hits, and the two "Thank you" page titles were the pre/post title-fix
transition (old `Thank you Â· PROXe Â· PROXe` vs current `Thank you Â· PROXe`).

## 2026-05-30 Â· feat: /thank-you page + site-wide analytics events (lead tracking)

Added a dedicated confirmation page and a single, typed analytics layer that fans
custom events out to GA4 (gtag) + the Meta Pixel.

**New analytics layer** (`lib/analytics.ts`) â€” one SSR-safe `track(event, params)`
that guards every `gtag`/`fbq` call (both load `afterInteractive`, so early clicks
won't throw). Uses GA4 `transport_type: 'beacon'` so conversion hits survive the
navigation to `/thank-you`. A `ProxeEvent` union is the single source of truth for
every event name. Helpers: `trackLead()` (fires GA4 `generate_lead` + Meta `Lead`,
**PII-free** â€” sends `source` / `has_brand` / `has_website` / `value`, never the raw
email or phone) and `initScrollDepthTracking()` (one-shot 25/50/75/90% milestones).

**The lead event** â€” `generate_lead` now fires on every deploy-form submit, from both
the global `DeployModal` and the chat-widget `DeployFormInline`.

**New `/thank-you` page** (`app/thank-you/*`) â€” self-contained route (own server page
for fonts/metadata + `ThankYouContent` client view + `thankyou.module.css`). Same
visual language as the landing: deep-purple field, frosted glass card with a neon
lavender edge, Instrument Serif headline, drifting aurora. Reads the captured name
from local storage to greet the visitor ("Thank you, {name}."), hosts the calendar
CTA + email fallback, and is `noindex`. On submit, `DeployModal` now fires the lead
event then `router.push('/thank-you')` â€” replacing the old in-modal flip-to-booking
face (flip state + back face removed).

**Custom events wired across the page** (param in parens):
- `deploy_modal_open` (source) â€” centralized in `DeployModalContext.openModal(source)`;
  every deploy CTA passes where it came from: `header_deploy`, `header_mobile_deploy`,
  `floating_header`, `closing_cta`, `scroll_popup`, `ig_demo`, `industries`,
  `pricing_starter` / `pricing_unlimited` / `pricing_enterprise`.
- `lead_form_start` (source) â€” first field interaction on either form (funnel top).
- `generate_lead`, `thank_you_view`, `book_call_click` â€” the conversion funnel tail.
- `cta_click` (location) â€” non-modal hero anchor CTAs.
- `channel_demo_select` (channel, surface) â€” `ChannelDemo` dial + landing coverflow.
- `voice_demo_start` â€” tapping the live VapiOrb.
- `video_unmute` â€” un-muting the hero demo video.
- `faq_open` (question), `nav_click` (label, location), `newsletter_subscribe`,
  `scroll_depth` (percent).

Verified live in the dev preview: modal open â†’ form start â†’ `generate_lead`
(currency/value/has_brand/has_website) â†’ route to `/thank-you` â†’ `thank_you_view`
(name-personalized, StrictMode-guarded to fire once) â†’ `book_call_click`. No console
errors.

## 2026-05-21 Â· feat: Closing CTA glass card + footer redesign + iPhone status bar + IG/Messenger mockup polish

Hero + footer overhaul, plus a bunch of mockup polish.

**Closing CTA section** (`ProxeLanding.tsx`, `landing.css`) â€” the "Stop losing leads" block above the footer is now a full glass card matching the user's reference design:
- Glass-card wrapper with a true **neon-border treatment** â€” visible 1px lavender border, with multi-stop outer `box-shadow @ 0 0 ...` emanating outward from the border line itself (no in-card radial blooms â€” those read as random glow, not structured boundary).
- "AI THAT CLOSES" eyebrow chip with a small sparkle SVG, mono uppercase letterspacing in a lavender-tinted pill.
- Split headline: "Stop losing leads." in white serif on line 1, "Start closing them." as a lavenderâ†’purple gradient-clipped text on line 2.
- Reuses the hero's lavender pill CTA + dark arrow circle â€” same beautiful button, now opens the Deploy modal.
- Trust strip below: Shield Â· No credit card / Lightning Â· Setup in minutes / Trend Â· ROI from day one.
- **Fixed**: the big CTA selector was scoped under `.proxe-hero-ctas .proxe-hero-big-cta`, which meant when reused inside the closing card it lost all styles â†’ unstyled white-on-white button. Now prefixed `.proxe-root .proxe-hero-big-cta` (specificity 0,2,0) so it beats the global `.proxe-root button { background: none }` reset.

**Footer** (`ProxeLanding.tsx`, `landing.css`):
- Brand-new `.pf-*` block â€” 5-col grid: Brand info / Product / Company / Legal / Social.
- **Giant outline `PROXe` wordmark** as an atmospheric watermark above the columns â€” now uses the actual `proxe-logo-white.webp` brand asset at 92% width / 14% opacity (was CSS text-stroke, which didn't match the real letterforms).
- Removed the duplicate small `<img>` PROXe wordmark from the brand column. The giant outline above is the only brand mark now.
- **Newsletter signup** replaces the removed small wordmark â€” eyebrow label "GET PRODUCT UPDATES", pill input row with lavender border (focus-within state pumps the border + adds a glow), inline gradient subscribe button, success message line. TODO: wire submit to a real list endpoint.
- Real X / LinkedIn / Instagram SVG glyphs in 38px circular buttons (no more "in"/"ig" text placeholders).

**Phone mockup** (`ProxeLanding.tsx`, `landing.css`) â€” replaced the bare notch with a proper iOS status bar:
- Left: `9:41` in SF Pro semibold (canonical iOS marketing time).
- Center: **Dynamic Island** â€” 120Ã—34 black pill, absolutely positioned, with a 1px inset highlight + a tiny camera-lens dot (radial gradient with faint purple tint) inside.
- Right: cellular bars (4 ascending) + WiFi arcs + battery (rounded rect with 82% fill + tip nub), all SVG.

**Mockup polish**:
- **Instagram quick-reply pills** â€” were `flex-wrap: nowrap` + `justify-content: flex-end` + `overflow-x: auto`, so the third pill ("Pricing") clipped against the phone bezel. Now `flex-wrap: wrap` + `justify-content: flex-start` â€” pills flow to a second line if they don't fit one row, no more clipping.
- **Messenger avatar** â€” `<SiMessenger />` was rendering invisible (default `1em` sizing collapsed in the flex container). Added explicit `size={18}` / `size={14}` props and a defensive `.ms-h-avatar svg { color: #fff; fill: #fff }` rule. The Messenger lightning-bolt glyph now actually appears in the avatar circles.

User-facing: closing CTA + footer feel like a real designed-as-a-block end of the page, the phone mockup reads as an actual iPhone, and the IG/Messenger conversation previews don't have visual bugs.

## 2026-05-21 Â· feat: Deploy modal + Multi-Agent flowchart + Pricing 3 tiers + Industries carousel rework + Testimonials carousel

Massive batch. The site's main conversion paths and showcase sections all got rebuilt in one pass.

**Global Deploy modal â€” flip card** (`DeployModal.tsx`, `DeployModal.module.css`, `DeployModalContext.tsx`, `layout.tsx`, `chatLocalStorage.ts`, every section file with a CTA):
- New 3D card-flip modal â€” front face is a compact 5-field capture form (name / work email / phone / brand name / brand website), back face is the "Book a a 30-min call" view with calendar link, meta strip (30 min Â· Google Meet Â· pick any open slot), and email fallback. Submit triggers a `rotateY(180deg)` on the inner card so it visibly hands off form â†’ booking.
- Title font pinned to an Inter + system-ui sans stack (the modal portals outside `.proxe-root` so it lost the font variable and was falling back to Times).
- `DeployModalProvider` mounted at root layout â€” every CTA across the site now opens this modal: header Deploy, floating "Deploy PROXe", pricing buttons, industries "Talk to us", testimonials, footer "Book a Demo", scroll-popup, IG demo "Book a Demo". All anchors switched to `<button onClick={openModal}>`.
- Form fields persist via `LocalUserProfile` (added `brandName` to the type). Body-scroll lock + ESC-to-close added.
- Booking URL is a placeholder (`https://cal.com/bconclub/proxe-intro`) â€” swap for the real scheduling link before shipping.

**Multi-Agent System â€” fan-in/fan-out flowchart** (`CapabilitiesSection.tsx`, `landing.css`):
- Killed the 7-edge W-mesh that looked unstructured. Now: 5 nodes laid out as a true 2â†’1â†’2 flowchart pointing right â€” WhatsApp + Web (left, inputs) â†’ Voice/Phone (center, orchestrator) â†’ Email + SMS (right, outputs). 4 directional dashed edges with arrowheads at every destination ring. Pulse cycle reordered to read left-to-right over 9s.

**Pricing â€” 3 tiers with dominant middle card** (`PricingSection.tsx`, `landing.css`):
- Went from 2 cards to 3: **Starter $249** / **Unlimited $449** (MOST POPULAR) / **Enterprise Â· Custom** (italic serif, no price).
- Middle card visually wins: `translateY(-12px) scale(1.035)` lift + scale (with a high-specificity rule that survives the entry animation), gradient border ring, radial purple bloom inside the padding-box, brighter "MOST POPULAR" floating badge, gradient-clipped "Unlimited" tier label.
- New `.pr-card-marquee` highlight box on every card â€” Starter: "**1,000** conversations / per month, across every channel"; Unlimited: "**Unlimited** conversations / No cap. Scale to a million chats a month." (gradient bg); Enterprise: "Tailored to your scale".
- 2-column compact channels list (`.pr-list--channels`) on both Starter AND Unlimited so neither card looks empty â€” Facebook Messenger icon fixed (`SiFacebook` â†’ `SiMessenger`).
- CTA buttons made actually visible: ghost variants now `1.5px @ 55% lavender` border + 6% white fill + drop shadow; primary now `1.5px @ 30% white` border + inset highlight + stronger purple glow. Starter CTA copy changed from "Start Free Trial" â†’ "Deploy PROXe" so the page reads consistently. Enterprise stays "Talk to sales".
- "One memory. Every channel." callout removed from the header visualization.

**Industries â€” carousel restored, bigger, smarter wheel hand-off** (`IndustriesSection.tsx`, `landing.css`):
- Reverted from a 3Ã—3 static grid back to a horizontal carousel (per user feedback). Cards bumped from 360 â†’ **440px** desktop with a **240px photo header**, and **`.ind-title` jumped from 20 â†’ 28px** serif. Responsive ladder: 440 â†’ 400 (â‰¤1024) â†’ 340 (â‰¤880) â†’ `calc(100vw - 56px)` on mobile.
- Three input methods for the carousel: mouse click-drag (window-level pointer listeners with `car.contains()` filter), trackpad / touch native swipe, and mouse wheel translated to horizontal scroll.
- **Wheel hand-off to Lenis at the boundaries** â€” when the carousel can't scroll further in the wheel's direction, the handler explicitly calls `window.__lenis.scrollTo(lenis.scroll + e.deltaY)` so the page resumes vertical scrolling without trapping the user. `LenisProvider` now exposes the instance on `window.__lenis` while mounted. Removed the `data-lenis-prevent` attribute (which was the cause of the trap).
- Arrow buttons removed (looked awkward at the bottom). Photo bottom border removed (was a visible white line under every image).

**Testimonials â€” centered single-card carousel with photos** (`ProxeLanding.tsx`, `landing.css`):
- Replaced the 3-card horizontal scroll with a single-card centered carousel. Auto-advances every 6.5s, pauses on hover, click-to-jump dot nav. Cross-fades with a small Y-translate + scale.
- Three testimonials with photos in `public/testimonials/`: Ankush Verma (Coachly Academy), Priya Sharma (Helix Health), Rohan Kapoor (Skyline Realty). 48px circular avatars with `object-fit: cover`, lavender border, purple glow shadow. Gradient-initials fallback path retained for any future no-photo testimonial.
- Removed the `Placeholder` tag.
- Dot nav fixed â€” the global `.proxe-root button { background: none; border: none }` reset was wiping the dot bg/border, so they painted invisible. Bumped the selector to `.tm-dots .tm-dot` (higher specificity) and switched to a solid white pill with opacity (45% inactive â†’ 100% active 36px pill) for max contrast.

User-facing: every CTA opens a real lead-capture modal, pricing finally reads as a proper 3-tier ladder with the middle plan as the obvious choice, the industries showcase is back to swipeable cards with a hero-sized photo and serif title, and the testimonials section has real-feel founder photos with proper dot navigation.

## 2026-05-21 Â· feat: Industries grid + hero font + Card 2 rewrite + score gradient + Lenis tune

Batched five things into one push.

- **Hero title smaller** (`app/styles/landing.css`): `.proxe-hero-title` font-size cap `clamp(56px, 11vw, 156px)` â†’ `clamp(48px, 9vw, 128px)`. Feels right on desktop now; previous size dominated the viewport.
- **Card 2 title rewrite** (`HowItWorks.tsx`): "One memory. Every conversation." â†’ **"One Memory. Full context."** Snappier.
- **Card 2 lead-score bar â€” red â†’ amber â†’ green** (`HowItWorks.tsx`): old gradient ran gray â†’ amber â†’ purple, which read as "neutral â†’ caution â†’ brand" instead of the obvious "bad â†’ meh â†’ good" semantics of a score. New interpolation: `#EF4444` (red) â†’ `#F59E0B` (amber) below 37, â†’ `#10B981` (green) above 37. Width still animates 0â†’74 in lockstep so the bar visibly heats up as the score climbs.
- **Industries section rebuilt as a real 3Ã—3 grid** (`IndustriesSection.tsx`, `landing.css`): killed the horizontal carousel â€” `.ind-grid` flex/overflow â†’ `display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px`. Removed the click-drag JS (`onPointer*` listeners on window), removed the `â€¹ â€º` arrow buttons, removed the off-canvas `.ind-track-wrap` bleed. Added a 9th slot â€” `.ind-card--cta` "Your business next?" â€” dashed brand-tinted border, "+" icon, copy ("We train PROXe on your playbookâ€¦"), pill "Talk to us â†’" button. Responsive: 3-col â†’ 2-col @1024px â†’ 1-col @600px.
- **Lenis smooth scroll â€” butter** (`LenisProvider.tsx`, `globals.css`): switched from `duration: 1.15` + custom expo-out easing to **`lerp: 0.1`** (Lenis's frame-rate-independent linear-interpolation model). Imported official `lenis/dist/lenis.css` so the state classes are correct. Stripped the hand-rolled `html.lenis` overrides from `globals.css` and set `html { scroll-behavior: auto }` so the browser's native CSS smooth-scroll stops fighting Lenis on anchor jumps. This is the BCON Club setup.

User-facing: scroll feels smooth, score bar tells the right story at a glance, industries section now actually grids out instead of asking for a swipe.

## 2026-05-21 Â· fix: HowItWorks 3-card polish (container-less pills, glass-tint rows, header padding)

- **Card 1** (CaptureVis pills): removed the solid colored square container behind each icon. Icon now just the SVG glyph (size 14â†’22) in its brand color with a soft `drop-shadow(0 0 6px <brand>)` glow.
- **Card 2** (MemoryVis rows): rows switched from solid `rgba(255,255,255,0.90)` to real glass â€” `linear-gradient(color-mix(in srgb, var(--accent) 28%/12%, rgba(15,10,38,0.5)))`, `backdrop-filter: blur(14px) saturate(140%)`, accent border, accent glow, inset white highlight. Each row picks up its own channel tint (WA green / Voice blue / Web purple).
- **Card 3** (ReactivateVis): `.hiw-vis--react` `padding-top` 0 â†’ 14px so the chat header sits a touch down from the top edge.
- Earlier in the same chain: gap above wrap fixed via `flex: 1 1 auto` on `.hiw-card-content` (commit `bc53a1b`), and inner `padding-top` overshoot corrected here.

## 2026-05-21 Â· revert: Card 3 chat-bubble layout + feat: Multi-Agent peer mesh

**Card 3 reverted to the chat-bubble layout** (user: "revert the third video back to how it was earlier... it was something earlier"). The Card-2-clone approach I'd taken (`68b0326` / `d692077` / `29ad280`) was a mistake â€” they liked the chat-bubble version. Restored from `git show 68b0326^:app/components/HowItWorks.tsx`:
- `ReactivateVis` back to its chat-bubble version: WhatsApp avatar header, âœ“ RESPONDED badge, PROXe greeting bubble, lead reply bubble, system message with score-badge transition.
- All `.hiw-vis--react` / `.hiw-react-*` CSS restored (chat header / typing dots / bubble styles / system message / score badge).
- Removed the `.hiw-mem-row--cold/--warm/--hot` temperature CSS â€” Card 3 no longer uses `.hiw-mem-row`.

**Multi-Agent System redesigned as a peer-to-peer mesh** (user reference: 6 robots in a 2-row mesh with criss-cross arrows). 5 channel agents arranged as:
```
   WhatsApp     Web Chat      Voice
        \   X   |   X   /
          Email      SMS
```
- 3 agents on the top row (WhatsApp, Web Chat, Voice).
- 2 agents on the bottom row (Email, SMS) offset between the top three.
- **7 SVG edge lines** connecting every adjacent pair: 2 horizontal top + 1 horizontal bottom + 4 cross-row diagonals.
- Each agent still pulses in its own brand color in turn (`tl â†’ tc â†’ tr â†’ br â†’ bl`, like a circuit going clockwise around the mesh).

## 2026-05-21 Â· polish: Card 3 â€” coldâ†’warmâ†’hot row temperature progression

User: "the third one is actually running the same video... the third one had a different video."

Card 3 was structurally cloned from Card 2 in `68b0326`, which fixed the layout but made the two cards look near-identical mid-animation. Added a temperature progression so each row of Card 3 has a unique visual character that tells the cold â†’ reactivated story:

- **Row 1 â€” Lead went cold (Day 1)**: muted gray background (`rgba(75,85,99,0.55)`), text at 78% opacity â€” feels dormant.
- **Row 2 â€” PROXe sent follow-up (Day 4)**: WhatsApp-green tinted background + 1px green border â€” warming up.
- **Row 3 â€” Replied Â· Reactivated (Now)**: purple gradient background + purple border + a pulsing outer glow (`hiwReactHotPulse`, 2.4s loop) â€” visibly celebrating the reactivation.
- Each row carries text in full white + 600-weight for the warm/hot states (vs Card 2's default dark text on white pills).

Result: Card 2 and Card 3 share the proven layout skeleton, but Card 3 now tells a distinct color story that Card 2 doesn't. Top spacing verified identical (both `leadY: 23`).

## 2026-05-20 Â· fix: Card 3 (Never Let a Lead Go Cold) â€” clone Card 2 structure

User: "duplicate the second card, change the video, and then change the text".

The chat-bubble layout for Card 3 had been a recurring trouble spot. Rewrote `ReactivateVis` so it uses **the exact same JSX + CSS as `MemoryVis`** â€” `.hiw-vis` (no `--react` modifier), `.hiw-mem-lead` pill, `.hiw-mem-list` timeline rows, `.hiw-score-wrap` gauge + tag pills.

- Top pill: "Rahul S." (same as Card 2).
- Timeline rows (replacing chat bubbles):
  - Day 1 Â· Lead went cold (clock, gray)
  - Day 4 Â· PROXe sent follow-up (WhatsApp, green)
  - Now Â· Replied Â· Reactivated (check, purple)
- Score gauge animates **0 â†’ 82** (vs 0 â†’ 74 on card 2), same setInterval ramp + color-mix bar gradient.
- Tag pills: Reactivated Â· Responded Â· Hot Lead.
- DOM verified identical layout to card 2: `leadY: 23`, `firstRowY: 71`, `scoreY: 255`, top/bottom card gaps `23/26`.
- Old `hiw-react-*` CSS left in `landing.css` for now (harmless dead rules; later pass).

## 2026-05-20 Â· feat: Multi-Agent â€” branching tree layout (2 â†’ hub â†’ 2)

User wanted the icons NOT in a straight line â€” instead a branching tree where one node flows into multiple.

- 5 nodes positioned in an **X-pattern**:
  - top-left: WhatsApp (entry)
  - top-right: Web Chat (entry)
  - center: Voice (the hub)
  - bottom-left: Email (output)
  - bottom-right: SMS (output)
- **4 SVG branch paths** drawn with curved quadratic-bezier strokes:
  - WhatsApp â†’ Voice
  - Web Chat â†’ Voice
  - Voice â†’ Email
  - Voice â†’ SMS
- **4 `animateMotion` data pulses** travel along each branch at staggered offsets (6s loop, -1.5s/-3s/-4.5s starts) so something is always moving through the network.
- Each node still pulses in its own brand color via the existing `--brand` variable + `capAgentRingPulse` keyframe.
- Card min-height bumped from 80 â†’ 130px to house the tree shape.

## 2026-05-20 Â· polish: Multi-Agent â€” drop labels + dotted track + brand-color pop-ups

User: "Text is not visible. The text should be very small, the lines are going below it. I don't think it should be needed. Color them properly with brand colors when they pop up."

- **Labels removed** under each icon. They were being ellipsis-truncated to "Whatsâ€¦", "Web Câ€¦" â€” not adding any value.
- **Wavy SVG path + traveling data dots removed**. The wave dipped below the icon row and read as messy.
- Replaced with a **single subtle dotted track** running horizontally through the icon centers â€” clean connector that doesn't compete with the icons.
- **Brand colors per icon, popping in on the active pulse**: WhatsApp `#25d366` Â· Web Chat `#a78bfa` Â· Voice `#60a5fa` Â· Email `#c084fc` Â· SMS `#34d399`. Each cell carries a `--brand` CSS variable; the `capAgentRingPulse` keyframe uses `color-mix(in srgb, var(--brand) â€¦%, transparent)` so the icon's resting purple-tint snaps to its brand color when it lights up, then fades back to neutral. Visually distinct, still on the same animation cadence.

## 2026-05-20 Â· revert: hero sub back below the title (no box)

User: "place back the subtext how it was, because putting it in a box is not looking good."

- Removed `.cap-hero-header` 2-col grid (heading left / sub-in-a-card right).
- Tag, title, and sub are now stacked single-column on the left of the hero again â€” same as the original layout before the stats-column experiment.
- `.cap-hero-sub` styling reverted to plain text (no dark-glass card, no padding/border/radius).

## 2026-05-20 Â· polish: Multi-Agent rings match flow-node tint + slower animation

User: "Icons can be our own icons, like we have used for 24/7 and auto follow-ups; movement doesn't have to be this fast."

- `.cap-agent-ring` style updated to match `.cap-flow-node` exactly:
  - **Filled tinted gradient** background `linear-gradient(135deg, rgba(167,139,250,0.22), rgba(124,58,237,0.10))` (was transparent center + 1.5px stroke).
  - 1px purple border + soft shadow + inset highlight â€” same recipe as the other cards.
  - Highlight state (when active) uses the brighter `0.55 / 0.30` gradient.
- Ring pulse animation: 5s â†’ **9s** loop, stagger 1s â†’ **1.8s** between siblings. Each ring now sits "active" for ~1.8s before handing off â€” feels calm, not flashy.
- SVG data-dots on the wavy path slowed: 4s â†’ **9s** so the motion matches the ring pulse cadence.

## 2026-05-20 Â· feat: Multi-Agent redesign (5-icon wavy row) + Capabilities header 2-col

**Multi-Agent System redesign** to match the reference image:
- Dropped the central hub + 3 people-avatars layout.
- New: **5 outlined channel-icon rings** in a row â€” WhatsApp / Web Chat / Voice / Email / SMS â€” each a 36Ã—36 transparent-center circle with a 1.5px purple stroke and a glowing inset. Labels sit below each ring.
- A wavy SVG path (`Q ... T ...` curve weaving up-down-up-down) threads through all 5 icon centers, with 3 `animateMotion` data-dots traveling along it at staggered offsets.
- Each ring runs a `capAgentRingPulse` keyframe with a 1s offset between siblings, so the icons sequentially light up brighter as the active dot crosses through them (5s loop).

**Capabilities section header is now 2-column** like Industries and Pricing:
- Wrapped `.cap-h2` + `.cap-sub` in a `.cap-section-header` grid (`1.4fr 1fr`).
- Heading on the left, sub paragraph aligned to the bottom-right.
- Collapses to single column at â‰¤1100px.

## 2026-05-20 Â· fix: hero stats removed, sub-text moved up + Multi-Agent System redesign

Three changes in one shot:

**Hero header restructured (user: "remove this not needed; put this text there"):**
- The vertical stats column (`100% Context Â· âˆž Cross-Channel Â· 24/7 Always Remembering`) is gone.
- The "One memory across every channel. Context follows the customer, not the conversation." sub now sits where the stats were â€” top-right slot of the header. Renders in a quiet dark-glass card so it has its own visual weight.
- Left column of the header is just the `âœ¦ CORE INTELLIGENCE` tag + the `Unified Memory` title (the sub no longer duplicates underneath).

**Multi-Agent System mini-vis redesigned** (user: "the icons are not correct, this shouldn't be shown like this"):
- Old layout was 5 small channel-icon pips in a horizontal row. Confusing â€” it looked like channels, not agents.
- New layout: **3 specialist agent chips** arranged around a **central PROXe hub** (`FiUsers` glyph in a 44Ã—44 glowing orb). Each agent is a 38Ã—38 person-avatar (`FiUser` glyph) with a small colored **channel-specialty badge** in the corner â€” WhatsApp green / Phone blue / Mail violet â€” reading clearly as "this agent handles this channel".
- Curved dotted SVG paths connect each agent â†’ hub, with `animateMotion` data packets traveling toward the hub.
- Each agent avatar runs a `capAgentPulse` keyframe with staggered delay so one agent lights up at a time (3s loop, 1s active per agent) â€” gives the network a heartbeat without being noisy.

## 2026-05-20 Â· fix: remove duplicate stats row at bottom of Unified Memory hero

When I moved the stats to the top-right in the previous commit, I forgot to remove the original block at the bottom of the hero â€” they were rendering in both places. Removed the bottom JSX block; only the new top-right stats column remains. (ddcd033)

## 2026-05-20 Â· polish: hero stats to top-right + Multi-Agent + Enterprise Security upgrades

**Hero stats moved from bottom to top-right** (filling the empty space next to the heading the user drew on). The hero card is now `header { text | stats }` over the visualization; stats become a vertical card column (3 rows: 100% Context Â· âˆž Cross-Channel Â· 24/7 Always) instead of a horizontal row.

**Multi-Agent System mini-vis** redesigned with the same polish as Lead Capture / Follow-Ups:
- 4 channel agents radiate from a central PROXe hub via curved SVG paths.
- Each path has an `animateMotion` data-packet circle traveling toward the hub at a slightly different speed/offset, so the network looks alive.
- Pip sizes bumped (corners 26â†’32, mid 22â†’28); all share the brand-purple gradient + glow.

**Enterprise Security mini-vis** redesigned:
- Lock core now bigger (40Ã—40) with a stronger glow + inset highlight.
- Replaced the static 3 concentric rings with **animated radar pulses** â€” three expanding rings on a 3s stagger that fade as they grow (`capShieldPulse` keyframe).
- Added a **green "verified" check badge** that pings (`capShieldVerified` keyframe) at the bottom-right of the lock, anchoring the SOC2-compliant message.

## 2026-05-20 Â· feat: Industries reorder + Auto Follow-Ups step-by-step pulse animation

**Industries reorder (user request):** new order is **Clinics & Healthcare â†’ Real Estate â†’ D2C & E-commerce â†’ Coaching Academies â†’ Fitness & Wellness â†’ Professional Services â†’ Auto Dealerships â†’ Home Services** (was Coaching first). Healthcare-led so the strongest photo cards land in the first three slots.

**Auto Follow-Ups card â€” sequential pulse animation:** four `@keyframes` cycle the 4 flow nodes through different highlight colors on a 5s loop:
- 0â€“22%: node 1 (Message) **purple** highlight
- 25â€“47%: node 2 (Email) **blue** highlight
- 50â€“72%: node 3 (Clock) **amber** highlight
- 75â€“100%: node 4 (Check) **green** highlight â€” holds for ~1.25s before the loop restarts
- Nodes that aren't currently active sit at a dim resting state. `transition: 0.35s` on background/border/color/box-shadow so the steps cross-fade rather than snap.
- The `.cap-flow-node--done` static green styling is gone â€” the green now comes from the `capFlowStep4` keyframes during the hold phase.

## 2026-05-20 Â· fix+assets: flip Healthcare + wire Wellness + refresh Real Estate

- **Healthcare.webp** horizontal-flipped with `ffmpeg -vf hflip`. The doctor was looking right (into the activity-card pills sitting at the top-right corner), which made the composition feel like the pills were eating him. Flipped so he faces left into the empty half of the photo.
- **Wellness.webp** added (new asset) and wired to the Fitness & Wellness card.
- **Real Estate.webp** refreshed â€” newer version dropped into `public/industries/`.
- 4 of 8 industry cards now use real photos (Coaching, Clinics, Real Estate, Fitness). 4 still on gradient placeholders.

## 2026-05-20 Â· polish: Industries floating activity cards â€” proper glass

The pills (e.g. "New inquiry Â· MBA Program Â· via WhatsApp", "Appointment Request Â· via WhatsApp", "Site Visit Scheduled Â· via Website") were 85% opaque dark purple over the photo, obscuring most of the image behind them.

- Background `rgba(20, 14, 50, 0.85)` â†’ `rgba(15, 10, 38, 0.32)` so the photo reads through.
- `backdrop-filter: blur(8px)` â†’ `blur(16px) saturate(140%)` for a real glass feel; saturation boost keeps the underlying photo colors lively through the blur.
- Border bumped from `rgba(255,255,255,0.10)` â†’ `rgba(255,255,255,0.16)` + an inset highlight for definition against any background brightness.
- Activity icon container got a real brand-accent glow (`box-shadow: 0 0 8px color-mix(in srgb, var(--acc) 40%, transparent)`) and slightly larger (`18â†’20px`) so it owns the chip even with the body now translucent.

## 2026-05-20 Â· assets+wire: Academies, Healthcare, Real Estate industry images

- Added `Academies.webp` (70 KB), `Healthcare.webp` (52 KB), and `Real Estate.webp` (75 KB) under `public/industries/`.
- Coaching Academies card now uses `Academies.webp` (was `Coaching.webp`).
- Clinics & Healthcare card now uses `Healthcare.webp` (was `Clinics.webp`).
- Real Estate card uses `Real Estate.webp` â€” filename has a space, URL-encoded as `%20` in the JSX so the request resolves cleanly.
- 3 of 8 industry cards now render real photos (the other 5 keep gradient placeholders until photos drop in `public/industries/`).

## 2026-05-19 Â· polish: brand-color WhatsApp + Instagram pips + real Cross-Channel SVG

- **Lead Capture channel pips:** the WhatsApp pip now uses its real brand green (`#25d366 â†’ #128c7e`) and the bottom-right pip switched from a generic mail envelope to **Instagram** with the brand gradient (`#fcb045 â†’ #fd1d1d â†’ #833ab4`). The other two pips (web chat, phone) keep the brand-purple house tint, so the row reads as "two real channel icons + two neutral ones," matching the user's "Instagram and WhatsApp will be real, the other two are normal" direction.
- **Cross-Channel Memory stat icon:** replaced the Unicode `âˆž` text glyph (which rendered as a thin, weak character) with an inline **infinity SVG path** (Lucide-style) so the box has a proper stroke-weight icon matching the other two stat icons (`FiActivity`, `FiZap`). The value still reads `âˆž`.

## 2026-05-19 Â· fix: Pricing Most-Popular â€” clean dark body + bright gradient border (no wash)

The previous "highlight" treatment combined a translucent purple gradient on the card body + two radial blooms + a pulsing outer halo. The result was a washed-out, cloudy card that looked worse than the Starter, not premium.

Stripped back to the right primitive:

- Card body uses the **same dark glass as Starter** (no extra tint, no inner blooms, no pulse). Visually the card sits next to Starter as an equal.
- The only highlight is a **`background-clip: border-box` gradient stroke** â€” a 1.5px bright purple ring (`#c4b5fd â†’ #a78bfa â†’ #7c3aed`) wraps the card.
- A single **soft outer glow** (`0 0 24px rgba(124,58,237,0.35)`) provides the lift without bleeding into the body.

Net: same readable contrast as Starter + a crisp bright border that says "pick me."

## 2026-05-19 Â· polish: Industries bigger + Pricing Most-Popular glow border + Voice call icon + touch drag fix

Four rapid-fire user requests bundled:

- **Industries cards bigger**: `flex: 0 0 320px` â†’ `360px`. Image panel `180px` â†’ `200px`. Shows ~3 cards instead of ~3.8, but each is much more readable.
- **Pricing "Most Popular" highlight**: transparent border + `background-clip: border-box` gradient (`#c4b5fd â†’ #a78bfa â†’ #7c3aed â†’ #c4b5fd`) draws a bright purple ring. Added a pulsing outer halo (`::after` with blur(14)) on a 4s loop and a top + bottom radial bloom inside the card. Card now reads as the obvious primary choice.
- **Voice â†’ call icon**: replaced `FiMic` with `FiPhone` in the pricing channel list (and import). "Voice" line now uses the universal phone icon.
- **Touch drag fix (Industries)**: JS pointer-drag handler now only intercepts `pointerType === 'mouse'`. Touch swipe falls back to the browser's native `overflow-x: auto` horizontal scroll â€” much more responsive on mobile than re-implementing inertia in JS.

## 2026-05-19 Â· polish: Capabilities mobile â€” wider cards inside the hero

User: "There is space on both sides of these cards. We can make it a little bit wider, the unified memory and cards."

On mobile (â‰¤760px) the Unified Memory hero card had `padding: 20px 18px` and the inner channel/profile/memory rows had their own padding on top of that, so the rows were noticeably narrower than the hero with empty space on both sides.

- Hero card mobile padding `20/18 â†’ 18/14` â€” cards stretch closer to the card edge.
- Cap-frame mobile padding `12 â†’ 4` â€” the outer frame eats less width.
- Channel rows mobile padding `9/11 â†’ 10/12` (just trimmed the left-inset).
- Profile + Memory cards mobile padding `14/16 â†’ 12/14`.
- Hero-vis grid padding tightened (`6/0 24 â†’ 4/0 8`).
- Side cards (`.cap-card`) get the same mobile padding as the hero for visual consistency when they stack below.

Net: inner rows went from ~265px wide â†’ **289px wide** on a 375px viewport (only the hero's own 14px padding sits between them and the card edge now).

## 2026-05-19 Â· fix: Industries drag + unify all Capabilities pips to brand purple

**Industries drag fix:** The carousel pointer listeners were attached to `.ind-grid` itself, but real mouse events were getting eaten by child elements (background-image divs, activity card pills, SVG icons) before they could bubble. DOM-dispatched events worked, real mouse events did not.

- Moved pointer listeners from `track.addEventListener` â†’ `window.addEventListener` with a `car.contains(e.target)` filter. Nothing inside the carousel can prevent the handler from seeing the event now.
- Drag state now flips `.ind-grid--dragging` only AFTER 3px of movement, so a clean click on a card still works normally (and the class is removed in a `requestAnimationFrame` so it doesn't block a follow-up click).
- `touch-action: pan-y` on the track so vertical page scroll keeps working; horizontal pan belongs to us.
- `* { pointer-events: none !important }` while dragging so the cursor doesn't get caught by hover transitions, image native-drag, or any inline element.
- Dropped the `:hover { transform: translateY(-3px) }` on cards (was fighting with the drag).

**Unified pip colors (Capabilities):**
- ChannelConstellation pips, AgentNetwork pips, and the shared `.cap-mini-ico` all now use the same brand-purple gradient + border + soft shadow as the Auto Follow-Ups flow nodes (`linear-gradient(135deg, rgba(167,139,250,0.22), rgba(124,58,237,0.10))`, `border: rgba(167,139,250,0.32)`, `color: #e9d5ff`).
- Removed the per-channel inline `style={{ color }}` props (WhatsApp green / phone blue / etc.) â€” all icons now read in the brand violet so the four cards read as one visual family.
- Pip sizes bumped (`26â†’32`, `28â†’36`) and icon glyphs slightly larger.

## 2026-05-19 Â· feat: Industries â€” horizontal carousel instead of 4Ã—2 grid

User: "rather than showing it as a column, make it a carousel and make the cards a bit bigger and show three and a half cards so we have more space to show the image and what we have written there."

- `.ind-grid` switched from a CSS grid to a horizontal flex row with `overflow-x: auto`, `scroll-behavior: smooth`, no snap.
- Wrapped in `.ind-track-wrap` that extends past the container's right edge so the 4th card visibly peeks out at the standard 1200px container width.
- **Cards bumped from `1fr` columns to `flex: 0 0 320px`** â€” fixed-width carousel slides.
- **Image panel height 132 â†’ 180px** â€” more breathing room for the photo + floating activity cards.
- Pointer-driven **click-drag** scroll handler (same pattern as `DashboardSection`): mousedown â†’ record startX + startScrollLeft, mousemove â†’ update `scrollLeft`, mouseup â†’ release. `cursor: grab` / `grabbing`.
- **Arrow buttons** (`â€¹` / `â€º`) added below the carousel, each scrolling by one card width.
- Responsive: cards shrink to 280px at â‰¤880px and to `calc(100vw - 64px)` (effectively one-per-view) at â‰¤520px; arrows hide on the smallest viewport.

## 2026-05-19 Â· polish: Capabilities cards â€” consistent tinted icons + bigger flow nodes

User showed how the reference cards have tinted-square icons + bigger polished flow nodes that read better.

- **Dropped the special "24" eyebrow** (circular concentric badge with spinning dashed ring) on the Lead Capture card. Replaced with the standard tinted-square `.cap-card-icon` so all four cards share the exact same eyebrow look.
- **Eyebrow icon upgraded** from `36Ã—36` flat to `42Ã—42` with a subtle gradient background (`rgba(167,139,250,0.22)` â†’ `rgba(124,58,237,0.10)`), purple border, soft shadow + inset highlight. Icon glyph size bumped 18 â†’ 20.
- **Auto Follow-Ups flow nodes** upgraded from `28Ã—28` flat to `38Ã—38` with the same gradient + shadow treatment. Inner icon size 12 â†’ 16. Final "done" node now uses a brighter purple tint instead of green so it matches the brand. Connector dashes get a small `â€º` arrowhead at the end and tighter widths so the row fits without overflowing.

## 2026-05-19 Â· fix: Capabilities orb â€” brand icon was lost in the center glow

User: "Foxy icon is not visible. It's too much brightness coming in from the center."

- **Inverted the core gradient**: was bright at top-left (`#f5f3ff` â†’ `#3b0764`) creating a white wash that ate the icon. Now goes bright on the rim, dark in the center (`#2e1065` â†’ `#a78bfa`). The icon sits in a darker well with white-ish glow around it.
- **Replaced the wide specular ellipse** with a small focused glint (radial-gradient circle, r=10) at the top-left, so the highlight reads as a glint rather than a full hemisphere wash.
- **Icon bumped from 38Ã—38 â†’ 48Ã—48** and given a `drop-shadow(0 1px 3px rgba(0,0,0,0.45))` filter â€” owns the center, never gets eaten by the gradient.
- Added a thin inner stroke (`rgba(255,255,255,0.18)`) for sphere definition.

## 2026-05-19 Â· polish: Capabilities orb â€” smaller, wired both sides, more breathing room

User: "inside this should be a little bit bigger so the text inside this can breathe. The center thing glowing and having doesn't need this much space... it can just wire to these so it can take details from the WhatsApp website. Connect the wires to these two things and give it a little bit of space to breathe."

- **Orb shrunk**: `UnifiedMemoryOrb` SVG viewbox 240â†’140; the visible glowing sphere is now ~140Ã—140 (was 240Ã—240). Removed the 3 tilted elliptical orbits and the 3 `animateMotion` particles â€” it's a clean halo + sphere + brand mark now (no more atomic-electron feel).
- **Wired both sides**: the connector SVG now draws 4 paths from the left channels â†’ orb AND 2 paths from orb â†’ Persistent Customer Profile + AI Memory cards. Used two gradient strokes so the brightness pools at the orb on the left half and at the cards on the right half.
- **Breathing room**: hero-vis grid columns retuned to `1fr / auto / 1.05fr` (was `1fr / auto / 1fr`) with `gap: 28px` (was 14px). Channel rows / profile / memory padding bumped to `10â€“14px / 12â€“16px` and border-radius up to 12px. Min visualization height up to 340px (was 320px). Net effect: text inside the cards no longer wraps tight; the orb has less visual weight and acts as a hub.

## 2026-05-19 Â· feat: Industries cards â€” use real photos from public/industries/

- `Industry` type gained an optional `image?: string` field.
- Wired `/industries/Coaching.webp` and `/industries/Clinics.webp` (already in `public/`) to the corresponding cards.
- Added `.ind-top--photo` modifier: when an image is present, the top panel renders the photo with `background-size: cover` and a `.ind-top-tint` overlay that uses the card's accent color (`--acc`) at the top + a dark gradient at the bottom so the floating activity cards still read well.
- The other six industries (Real Estate / D2C / Fitness / Pro / Auto / Home) keep their gradient placeholders until images land in `public/industries/`. Just drop a `<id>.webp` in there and add `image: '/industries/<id>.webp'` to the entry â€” no other changes needed.

## 2026-05-19 Â· chore: record HowItWorks card animations as MP4 files

User asked for the three card animations to be saved as videos under `public/`.

- Added `scripts/record-hiw.mjs` â€” a Playwright + ffmpeg pipeline that:
  1. Launches headless Chromium at 1400Ã—900 with `deviceScaleFactor: 2`
  2. Loads the live dev server, scrolls the HowItWorks section into view
  3. Reads each `.hiw-card-vis-wrap` bounding box
  4. Records the page as WebM for 8s (one full loop of the longest card)
  5. Uses ffmpeg to crop each region and re-encode as H.264 (CRF 20, `slower` preset, yuv420p, `+faststart`)
- Saved outputs:
  - `public/how-it-works/01-capture.mp4` (~1.5 MB) â€” notification pills
  - `public/how-it-works/02-memory.mp4` (~1.1 MB) â€” chat history + score + tags
  - `public/how-it-works/03-reactivate.mp4` (~1.0 MB) â€” WhatsApp follow-up + RESPONDED
- Added `playwright` as a devDependency.
- The live React/CSS animations in `HowItWorks.tsx` are unchanged â€” they still render on the site. The MP4s are exports the user can use elsewhere (social posts, embeds, etc.). If you want me to swap the live components for `<video autoplay loop muted playsinline>` tags, say the word.

## 2026-05-19 Â· polish: 24/7 Lead Capture card â€” "24" eyebrow + card indexes + 3D orbits

Addresses the user's earlier "night and day" comparison.

- **Circular "24" eyebrow badge** replaces the plain lightning icon on the Lead Capture card. The badge has an outer solid ring + an inner dashed ring that slowly spins, with a serif "24" in the center.
- **Card index** `01` / `02` / `03` / `04` (mono font, low-contrast) added to the top-right of each capability card so they read as a numbered set.
- **Constellation visualization redesigned** with 3D-style tilted elliptical orbits (two ellipses at different rotations) instead of flat dotted circles. Two SVG `animateMotion` particles trail along the outermost orbit at different speeds. Channel pips now sit on the orbit corners with a real drop-shadow + inset highlight, giving them depth.
- Headline gradient end stop changed from pink (`#ec4899`) to deep purple (`#7c3aed`) on Industries + Pricing + the Pricing "Unlimited" word so they match the Capabilities "autonomous" treatment (user: "we are colouring it unwanted").

## 2026-05-19 Â· remove: Pricing trust strip

Removed the 6-panel trust strip (SOC 2 Â· Enterprise Â· 99.9% Uptime Â· GDPR Â· 24/7 Priority Â· No Long Term) below the pricing cards per user request. Dropped the `TRUST` const and unused icon imports.

## 2026-05-19 Â· polish: use brand icon inside hero/orb hexes (Pricing + Capabilities)

The "brain bars" I'd hand-drawn with SVG rects were a stand-in for the PROXe brand mark. Swapped both spots to the real asset.

- **Pricing**: the hex inside the channel diagram now renders `/proxe/brand/proxe-icon-white.webp` (36Ã—36) at its center, hex frame kept as a separate SVG behind it.
- **Capabilities Unified Memory orb**: the 3 hand-drawn pill bars inside the core were replaced with the same brand asset via an SVG `<image>` element. Removed the now-unused `capOrbBar` gradient def.

## 2026-05-19 Â· feat: Pricing section redesign (channel diagram + trust strip)

New `PricingSection` component replaces the inline starter/unlimited cards in `ProxeLanding.tsx`.

- **Two-column header**: left has `PRICING` label, serif headline "Start capturing *every conversation*." (gradient on the italic phrase), and a 2-line supporting paragraph. Right is a channel diagram: 6 colored channel pips (Web / WhatsApp / Instagram DM / Messenger / Email / Voice) at the top, curved SVG lines flowing down to a glowing PROXe hex-orb with the 3 brand bars inside, and a small "One memory. Every channel." floating callout on the right.
- **Two pricing cards** side by side:
  - **Starter ($249/mo)**: STARTER tag, big serif price, "1,000 AI conversations / month" headline pill, full channel list (Website chat / WhatsApp / Instagram DM / Facebook Messenger / Email / Voice) with green check ticks, two feature rows (Unified memory / Automated follow-ups), description note, ghost "Start Free Trial â†’" button.
  - **Unlimited ($449/mo)**: UNLIMITED tag with "MOST POPULAR" gradient pill, accent border + radial purple bloom, "âˆž Unlimited AI conversations" headline (gradient text on "Unlimited"), same channel list, 4 feature rows (Unified cross-channel memory / AI follow-ups & reactivation / Multi-agent orchestration / Priority infrastructure access), description note, full-gradient "Deploy PROXe â†’" CTA with glow shadow.
- **Trust strip**: 6 panels with vertical dividers â€” SOC 2 Type II Compliant Â· Enterprise Grade Security Â· 99.9% Uptime Guaranteed Â· GDPR Compliant Â· 24/7 Priority Support Â· No Long Term Contracts.
- Same glass-card primitives as the rest of the site (`backdrop-filter: blur(24px)`, `border: rgba(255,255,255,0.10)`, soft outer + inset shadows).
- Staggered scroll-reveal: label â†’ h2 â†’ sub â†’ header-vis â†’ starter card â†’ unlimited card â†’ trust.
- Responsive: header collapses to 1 col at â‰¤1100px, trust strip to 3-col then 2-col, cards stack at â‰¤760px.

## 2026-05-19 Â· simplify: Dashboard â€” smooth scroll, no snap

- `scroll-snap-type: x mandatory` â†’ removed from `.db2-carousel` (both desktop and mobile rules)
- `scroll-snap-align: start/center` â†’ removed from `.db2-browser` (both desktop and mobile rules)
- Added `scroll-behavior: smooth` to the carousel so wheel + arrow-button scroll feels glidy
- Drag + native scroll + arrows still work, just without the snap-to-slide jolt

## 2026-05-19 Â· simplify: Dashboard â€” remove scroll-driven pan, arrows below the frame

Per user â€” the scroll-driven horizontal pan was causing more friction than it solved. Killed it; the carousel is now a plain drag/scroll/arrow-button affair.

- **Removed** the `window` scroll listener and `progress`-based `scrollLeft` writer in `DashboardSection.tsx`.
- **Removed** the `@media (min-width: 768px) { .db2-sticky-wrapper { height: 130vh; ... } }` block â€” the section now takes its natural content height, no more huge empty buffer.
- **Arrows moved** out of the carousel-wrap (where they sat on top of the slides) into a new `.db2-carousel-arrows` row below the dashboard frame. Restyled them as quiet 44Ã—44 outlined circles instead of the heavy purple-glow buttons â€” they no longer compete with the slide content.
- Click-drag carousel + native horizontal scroll + arrow buttons all still work.

## 2026-05-19 Â· remove: Industries trust row + bigger channel-selector labels

- **Industries trust row removed**: the bottom "Works across 15+ industries Â· AI trained Â· Always-on Â· Secure Â· Results" strip and the `TRUST_ITEMS` constant are gone from `IndustriesSection.tsx`.
- **Channel selector labels bumped from 14/15px â†’ 18px** (active item 19px) and the icon size from 28â†’32px. Better readability on desktop.

## 2026-05-19 Â· fix: capture pills container-less + cap-grid mobile + dashboard mobile scale

**Premium feel for Card 1 pills (CaptureVis):** removed the white pill container around each notification. Just the colored icon + text now, with a slight box-shadow on the icon for depth.
- `background: transparent`, `box-shadow: none`, larger icon (34Ã—34 vs 30Ã—30), text on white at 92% opacity, badge as outlined chip (was solid green).

**Capabilities grid broken on mobile:** the four cards had explicit `grid-column: 2/3` placements which forced the grid to keep 3 columns even when the template was `1fr` â€” that's why the hero ended up 38px wide. Reset `grid-column`/`grid-row` to `auto` on mobile (and added a proper 2-col layout at the 1100px breakpoint).

**Dashboard mobile scale not applying:** Chrome refuses to fold both `scale(calc(length/length))` and `scale(var(...))` inside `transform`, falling back to the matching `.db2-slide` rule's `translateX(60px)`. Switched to JS-driven inline transform (`scale(${factor})` set on each slide via `style.setProperty` with `!important`), and disabled the reveal-state transforms on mobile (`.db2-slide`/`.db2-slide--in { transform: none }`) so they don't clobber the scale. Each slide on mobile is now properly 343Ã—224 instead of 1100Ã—720.

## 2026-05-19 Â· feat: Industries section redesign (activity cards + flow + trust row)

Replaced the simple gradient-card "Built For" grid with a richer IndustriesSection that matches the reference structure:

- **New component**: `app/components/IndustriesSection.tsx`.
- **Header**: 2-column â€” left has section label `â— INDUSTRIES WE POWER` + serif heading "Built for every industry. Trained for *every outcome*." (gradient on "every outcome"); right column has the supporting paragraph.
- **8 industry cards** in a 4Ã—2 grid, each with:
  - **Top "image" panel** (gradient placeholder using each industry's accent color) with the industry icon top-left and **1-3 floating activity cards** top-right (e.g. *New inquiry Â· MBA Program Â· via WhatsApp* + *AI Qualified Â· High intent*).
  - Serif title + body.
  - **4-step flow row** with icon pills + arrow connectors (e.g. Inquiry â†’ Qualify â†’ Book â†’ Enroll).
  - Big colored stat (4.2Ã— / 68% / 3Ã— â€¦) plus label.
- **Bottom trust row**: 5 items with vertical dividers â€” Works across 15+ industries Â· AI trained on real conversations Â· Always-on 24/7 Â· Secure. Encrypted. Compliant Â· Results you can measure.
- Same glass-card system (`backdrop-filter: blur(24px)`, `border: 1px solid rgba(255,255,255,0.10)`, soft outer + inset shadows) as HowItWorks / Capabilities so the section reads as part of the same site.
- Stagger-reveal on scroll: label â†’ heading â†’ sub â†’ cards â†’ trust row.
- Responsive: 4-col â†’ 3-col (â‰¤1200) â†’ 2-col (â‰¤880) â†’ 1-col (â‰¤520). Trust row collapses to 2-col with left-aligned items at â‰¤880.
- Stale Built-For inline JSX + `Icon.*` placeholders removed from `ProxeLanding.tsx`.

User said "we'll keep improving it" â€” this is the structural foundation; copy/photo upgrades and per-card polish can iterate from here.

## 2026-05-19 Â· fix: third pillar card â€” permanent chat header anchors content

The reactivation card visualization area was looking empty during animation cycles. Even with `flex: 1` on the chat container, the chat children were `opacity: 0` until their animation step fired â€” so during step-0 (loop restart) and step-1/2 (before the lead reply lands) the card showed huge gaps.

- Added an **always-visible WhatsApp chat header** at the top of the card (avatar gradient + "Rahul S." + "WhatsApp Â· Follow-up sequence" + online dot). It's `flex-shrink: 0` and sits above the chat bubble area.
- Chat container switched from `space-around` â†’ `space-between` so the typing slot at top and system slot at bottom anchor the layout even when their opacity is 0.
- The card now always reads as a populated conversation panel regardless of which animation step is mid-cycle.

## 2026-05-19 Â· remove: "Learn more â†’" links from Capabilities side cards

## 2026-05-19 Â· update: Pricing â€” $99 â†’ $249 (Starter), $199 â†’ $449 (Unlimited)

## 2026-05-19 Â· remove: Capabilities compliance badges row

Removed the SOC 2 / End-to-End / GDPR / Multi-Channel / Always On strip below the grid per user request. Dropped the now-unused `FiDatabase` import. (d8fc314)

## 2026-05-19 Â· fix: Capabilities â€” match existing site theme (glass-card system)

- **Section background reverted to transparent** â€” the page's purple shows through, matching every other section on the site (`.proxe-section`, `.hiw-section`, `.cd-section`, `.db2-section` all use `background: transparent`). The dark navy bg I added was wrong; the user wanted only the reference's *structure*, not its colors.
- **Cards (hero, side cards, compliance row)** now use the exact same glass-card primitives as HowItWorks:
  - `background: linear-gradient(180deg, rgba(8,6,24,0.5/0.55), rgba(12,9,32,0.6/0.65))`
  - `border: 1px solid rgba(255,255,255,0.10)`
  - `box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)`
  - `backdrop-filter: blur(24px)`
- Comet trail dialed down to a subtle highlight (was a heavy purple bar over a dark bg).

## 2026-05-19 Â· fix: dashboardâ†’capabilities gap + Capabilities polish (reference-true orb)

**Dashboardâ†’Capabilities gap (high-priority interrupt):**
- Reduced sticky wrapper from `180vh` â†’ `130vh`. The dashboard section was reserving way too much vertical scroll space, leaving a huge purple gap before the next section.
- Capabilities top padding reduced `110px` â†’ `60px`.

**Capabilities polish:**
- Section background: dark navy gradient + subtle starfield + diagonal purple comet trail in the top-right (matches the reference's own dark background instead of inheriting page purple).
- Layout: hero spans 2 rows on the left, **2Ã—2 of equal-sized cards** on the right (not bento â€” that was wrong; the reference uses a uniform 2Ã—2).
- **Orb redesigned**: viewbox 240, glowing core sphere with top-left specular highlight, **3 inner vertical bars** matching the PROXe brain/logo motif, **3 elliptical orbits** at rotated angles (atom-style), 3 particles animating along the orbits via `animateMotion`, heavy purple drop-shadow.
- **Curved glowing connector SVG**: 4 paths from each channel row â†’ the orb center, with gradient stroke (transparent on the channel end, bright on the orb end) and a glowing drop-shadow.
- Cards: subtle purple border + dark-glass surface so they sit properly on the new dark section background.
- Frame element kept structurally but visually removed (no border / no padding).

## 2026-05-19 Â· fix: Capabilities â€” bento layout (hero 2/3, wide multi-agent)

The previous uniform 3-col grid squeezed the hero card to 438px, which crushed its internal 3-column visualization down to 89px side columns â€” channel names wrapped to 4 lines, AI Memory wrapped to 10+ lines. The right side was visibly cut off.

- Grid restructured to a real **bento**: 2-col grid with hero (2/3) spanning 2 rows, lead-capture + follow-ups stacked on the right (1/3 each), then multi-agent (2/3, wide) + security (1/3) in the bottom row.
- Hero is now 733px wide instead of 438px. Internal columns are 237 / 180 / 180 / 237 â€” content fits without wrapping.
- Multi-Agent System upgraded to a **wide horizontal network**: 4 channel-colored agent icons spread across with curved SVG connecting paths to a central orb. Visually distinct from the other side cards.
- Per-card grid placement classes (`.cap-card--capture`, `--followup`, `--agents`, `--security`) so each card sits in its bento slot.

## 2026-05-19 Â· rebuild: Capabilities â€” proper hero-frame layout, SVG orb

Full rewrite of `CapabilitiesSection.tsx` and the `.cap-*` block in `landing.css`.

**Structure:**
- Header (label / heading / sub) sits **above** a single big rounded dark-glass `.cap-frame`.
- The frame wraps the entire grid + compliance badges in one container â€” matches the reference instead of floating disconnected elements.
- Frame has subtle dot-grid backdrop with a radial mask + a diagonal purple light arc in the top right.

**Hero card:**
- Spans 2 rows on the left.
- Title in `--proxe-font-heading` (matches the rest of the site's serif rhythm), italic "autonomous" gradient.
- 3-column visualization: channel feed (with colored left-rail bars per channel) â†’ glowing **SVG orb** â†’ profile panel + AI Memory bubble.
- SVG orb: glowing core, 3 concentric orbit rings, 8 radiating rays (slow rotation), 6 pulsing particles.
- Stats row with vertical dividers; values use the heading font for editorial feel.

**Side cards:**
- 2Ã—2 grid. Each card has icon-in-pill, serif title, body, mini visualization, and "Learn more â†’".
- Mini visualizations use shared `.cap-mini-core` glowing dot for consistency.
- Constellation, follow-up flow (with green check at end), agent network (curved SVG paths), and shield rings.

**Compliance row:**
- Inside the frame, with vertical dividers and consistent dark-glass styling.

**Theme:**
- Page background untouched (inherits the site's purple).
- Frame uses the same dark-glass palette as HowItWorks / Dashboard cards â€” visual consistency across the page.
- All accent colors stay within the existing `#7c3aed` / `#a78bfa` / `#c4b5fd` palette.

## 2026-05-19 Â· refine: Capabilities â€” match theme + reference

- Removed the dark forced background â€” section is now transparent and inherits the site's purple, matching the rest of the page (HowItWorks / Dashboard / etc.) instead of standing out.
- Hero card upgraded with a subtle starfield + dual radial glows on top of dark-glass surface.
- **Orb redesigned**: 160px with 3 expanding rings, pulsing core glow, and 3 particles orbiting at different speeds/radii â€” closer to the molecular-orbit feel in the reference.
- **Channel cards** get a colored left border (green / purple / blue / violet) matching their channel.
- **Connector lines**: animated dotted flow toward the orb (was static).
- **AI Memory bubble**: header now `nowrap` so "Just now" stays on one line; dot rendered as a true glowing avatar with inner white pip.
- **Stats row**: divided columns with vertical separators, larger value typography (heading font, 20px).
- **Side cards**: dark-glass with a subtle bottom-right radial purple glow.
- **Lead Capture vis**: added a faint dotted ring/cross-hair grid around the channel constellation.
- Fixed the "oÂ¦o" typo â†’ "âˆž" on Cross-Channel Memory stat.

## 2026-05-19 Â· feat: redesigned Capabilities section

- Replaced the 6-card flat grid with a richer hero + side-grid layout (matching the reference design).
- **Hero (Core Intelligence / Unified Memory)**: gradient card with a 3-column visualization â€” channel feed (WhatsApp / Web / Voice / Email) â†’ glowing animated orb â†’ Persistent Customer Profile + AI Memory bubble. Bottom stats row (100% Context Retention Â· âˆž Cross-Channel Memory Â· 24/7 Always Remembering).
- **Side cards (2Ã—2)**: 24/7 Lead Capture, Auto Follow-Ups, Multi-Agent System, Enterprise Security â€” each with icon, copy, mini visualization (channel constellation / followup flow / agent network / shield rings), and "Learn more â†’" link.
- **Bottom compliance row**: SOC 2 Type II Â· End-to-End Encrypted Â· GDPR Compliant Â· Multi-Channel Connected Â· Always On.
- Section-level scroll-reveal with staggered animations on label, headline, sub, hero, cards, and badges.
- Responsive: hero collapses to full-width above the 2Ã—2 grid at â‰¤1100px; everything stacks at â‰¤720px.
- New component `app/components/CapabilitiesSection.tsx`; old inline 6-card grid removed from `ProxeLanding.tsx`.

## 2026-05-19 Â· feat: click-drag dashboard carousel + faster scroll pacing

- **Click-drag**: pointerdown/move/up handlers on `.db2-carousel` so users can grab and drag horizontally with the mouse (not just wheel). `cursor: grab` / `grabbing`, captures pointer, suspends the scroll-driven page handler while dragging so they don't fight.
- **Faster slide pacing**: sticky wrapper height reduced from `300vh` to `180vh` â€” slides now advance ~67% faster per unit of page-scroll.
- User-facing: dashboard carousel is now grabbable with the mouse, and scroll-driven horizontal pan moves through slides much quicker.

## 2026-05-19 Â· fix: card 3 spacing, mobile thumbnail dashboard, IG chips, dial arrows

- **Card 3 (Reactivate)**: top-aligned (22px padding) like cards 1 & 2 instead of centered. Chat container now stretches with `flex: 1` and `justify-content: space-around` so content fills the frame â€” no more 100px of empty space at the top.
- **Mobile dashboard carousel**: reverted the responsive reflow. Each slide now keeps its desktop layout intact and is scaled down as a single "YouTube-thumbnail" using `transform: scale(calc((100vw - 32px) / 1100px))`. Negative right-margin reclaims the unscaled layout width so flex layout matches the visual width. Carousel height shrinks to the scaled-thumbnail height â€” no empty space below.
- **Instagram quick-reply pills**: horizontal scrollable chips (small, native-IG style) instead of a vertical stack on the right side.
- **Channel dial arrows (`cd-dial-controls`)**: hidden on mobile (`â‰¤860px`) â€” channel selection happens via the icon strip on top.
- User-facing: card 3 visually matches cards 1 & 2; mobile dashboard reads as a clean YouTube-style thumbnail row; Instagram chat looks like the real app.

## 2026-05-19 Â· feat: restore Lenis smooth-scroll globally

- Installed `lenis` and added `app/components/shared/LenisProvider.tsx` â€” a client component that boots a single Lenis instance at the root and drives the page via `requestAnimationFrame`.
- Mounted `<LenisProvider />` once inside `<body>` in `app/layout.tsx`.
- Updated `app/globals.css` with the standard Lenis class hooks (`.lenis`, `.lenis-smooth`, `.lenis-stopped`, `[data-lenis-prevent]`) so native smooth-scroll defers to Lenis when active.
- Respects `prefers-reduced-motion` â€” falls back to native scroll for users who prefer it.
- User-facing: full-page inertial smooth scroll with expo-out easing (~1.15s duration). Wheel and trackpad feel buttery; iOS keeps native touch momentum.

## 2026-05-19 Â· fix: mobile dashboard, channel demo icons, third-pillar centering

- **Dashboard mobile carousel**: each slide is now `calc(100vw - 32px)` wide (one full slide per view) â€” replaced the broken `transform: scale()` thumbnail approach. Dashboard content reflows to 2-column grids (gauges/stats) with tighter padding and smaller fonts so it fits cleanly. Carousel arrows hidden on mobile in favor of native swipe + scroll-snap.
- **Channel demo mobile**: hide the channel labels on `â‰¤860px` â€” only the brand icons remain. `min-width` removed so 5 channels fit comfortably and the row stays horizontally scrollable.
- **Third pillar card (`hiw-vis--react`)**: replaced `justify-content: flex-start !important` with `center` so the WhatsApp follow-up animation sits vertically centered like cards 1 & 2 (was top-aligned with ~190px of empty space below).
- User-facing: mobile dashboard is now a clean one-slide-per-view swipeable carousel; channel selector on mobile is a tidy icon strip; third "Never Let a Lead Go Cold" pillar now looks balanced.

## 2026-05-19 Â· feat: scroll-driven horizontal dashboard carousel

- Wrapped `.db2-section` in `.db2-sticky-wrapper` (300vh height on desktop) so the section pins sticky while the user scrolls
- Replaced wheel-intercept handler with a `window scroll` event listener that maps page scroll progress to carousel `scrollLeft`
- On desktop (â‰¥768px): section sticks at `top: 0`, `scroll-snap-type: none` on carousel (prevents snap fighting programmatic scroll)
- On mobile: normal layout â€” section scrolls naturally, carousel is touch-swipeable
- User-facing: scroll down through the dashboard section to pan through all 3 screens (Dashboard â†’ Conversations â†’ Leads), then continue past to the next section

## 2026-05-19 Â· feat: full-bleed right carousel via CSS-only width extension

- Extended `.db2-carousel-wrap` width using `calc(100% + max(24px, (100vw - 1200px) / 2 + 24px))` â€” accounts for container's right padding and auto-margin to reach the viewport right edge
- Slide 2 now peeks ~84px from the right on a 1280px viewport, giving the "continuing carousel" effect
- No DOM structural changes â€” carousel-wrap stays inside proxe-container (the prior full-bleed approach moved it outside and broke the live site)
- Section's existing `overflow: hidden` clips the tiny scrollbar-width excess (no horizontal page scrollbar)
- Reset to `width: 100%` under the `@media (max-width: 900px)` block so mobile scaled-thumbnail layout is unaffected
- User-facing: second slide peeks out to the right viewport edge on desktop

## 2026-05-19 Â· revert: restore stable dashboard carousel layout

- Reverted full-bleed carousel change (af47d9c) â€” moving carousel-wrap outside proxe-container caused the section IntersectionObserver to stop firing, leaving the entire dashboard section invisible (opacity: 0, no animation reveal)
- User-facing: dashboard section is visible again on scroll

(d046c5e)

## 2026-05-19 Â· fix: clean up dashboard section shadows

- Reduced `.db2-browser` box-shadow from `0 24px 80px rgba(0,0,0,0.6)` (heavy bleed) to `0 8px 40px rgba(0,0,0,0.45)` across all three carousel slides
- Reduced purple glow from `0 0 60px` to `0 0 24px rgba(124,58,237,0.08)` â€” no longer bleeds past the mock frame
- Removed inline `drop-shadow` neon glow from CircleGauge SVG rings in DashboardSection
- User-facing: dashboard section looks cleaner with no large dark blotch below or neon halos on gauges

(55de422)
