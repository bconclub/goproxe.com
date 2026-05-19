# Changelog

## 2026-05-19 · polish: use brand icon inside hero/orb hexes (Pricing + Capabilities)

The "brain bars" I'd hand-drawn with SVG rects were a stand-in for the PROXe brand mark. Swapped both spots to the real asset.

- **Pricing**: the hex inside the channel diagram now renders `/proxe/brand/proxe-icon-white.webp` (36×36) at its center, hex frame kept as a separate SVG behind it.
- **Capabilities Unified Memory orb**: the 3 hand-drawn pill bars inside the core were replaced with the same brand asset via an SVG `<image>` element. Removed the now-unused `capOrbBar` gradient def.

## 2026-05-19 · feat: Pricing section redesign (channel diagram + trust strip)

New `PricingSection` component replaces the inline starter/unlimited cards in `ProxeLanding.tsx`.

- **Two-column header**: left has `PRICING` label, serif headline "Start capturing *every conversation*." (gradient on the italic phrase), and a 2-line supporting paragraph. Right is a channel diagram: 6 colored channel pips (Web / WhatsApp / Instagram DM / Messenger / Email / Voice) at the top, curved SVG lines flowing down to a glowing PROXe hex-orb with the 3 brand bars inside, and a small "One memory. Every channel." floating callout on the right.
- **Two pricing cards** side by side:
  - **Starter ($249/mo)**: STARTER tag, big serif price, "1,000 AI conversations / month" headline pill, full channel list (Website chat / WhatsApp / Instagram DM / Facebook Messenger / Email / Voice) with green check ticks, two feature rows (Unified memory / Automated follow-ups), description note, ghost "Start Free Trial →" button.
  - **Unlimited ($449/mo)**: UNLIMITED tag with "MOST POPULAR" gradient pill, accent border + radial purple bloom, "∞ Unlimited AI conversations" headline (gradient text on "Unlimited"), same channel list, 4 feature rows (Unified cross-channel memory / AI follow-ups & reactivation / Multi-agent orchestration / Priority infrastructure access), description note, full-gradient "Deploy PROXe →" CTA with glow shadow.
- **Trust strip**: 6 panels with vertical dividers — SOC 2 Type II Compliant · Enterprise Grade Security · 99.9% Uptime Guaranteed · GDPR Compliant · 24/7 Priority Support · No Long Term Contracts.
- Same glass-card primitives as the rest of the site (`backdrop-filter: blur(24px)`, `border: rgba(255,255,255,0.10)`, soft outer + inset shadows).
- Staggered scroll-reveal: label → h2 → sub → header-vis → starter card → unlimited card → trust.
- Responsive: header collapses to 1 col at ≤1100px, trust strip to 3-col then 2-col, cards stack at ≤760px.

## 2026-05-19 · simplify: Dashboard — smooth scroll, no snap

- `scroll-snap-type: x mandatory` → removed from `.db2-carousel` (both desktop and mobile rules)
- `scroll-snap-align: start/center` → removed from `.db2-browser` (both desktop and mobile rules)
- Added `scroll-behavior: smooth` to the carousel so wheel + arrow-button scroll feels glidy
- Drag + native scroll + arrows still work, just without the snap-to-slide jolt

## 2026-05-19 · simplify: Dashboard — remove scroll-driven pan, arrows below the frame

Per user — the scroll-driven horizontal pan was causing more friction than it solved. Killed it; the carousel is now a plain drag/scroll/arrow-button affair.

- **Removed** the `window` scroll listener and `progress`-based `scrollLeft` writer in `DashboardSection.tsx`.
- **Removed** the `@media (min-width: 768px) { .db2-sticky-wrapper { height: 130vh; ... } }` block — the section now takes its natural content height, no more huge empty buffer.
- **Arrows moved** out of the carousel-wrap (where they sat on top of the slides) into a new `.db2-carousel-arrows` row below the dashboard frame. Restyled them as quiet 44×44 outlined circles instead of the heavy purple-glow buttons — they no longer compete with the slide content.
- Click-drag carousel + native horizontal scroll + arrow buttons all still work.

## 2026-05-19 · remove: Industries trust row + bigger channel-selector labels

- **Industries trust row removed**: the bottom "Works across 15+ industries · AI trained · Always-on · Secure · Results" strip and the `TRUST_ITEMS` constant are gone from `IndustriesSection.tsx`.
- **Channel selector labels bumped from 14/15px → 18px** (active item 19px) and the icon size from 28→32px. Better readability on desktop.

## 2026-05-19 · fix: capture pills container-less + cap-grid mobile + dashboard mobile scale

**Premium feel for Card 1 pills (CaptureVis):** removed the white pill container around each notification. Just the colored icon + text now, with a slight box-shadow on the icon for depth.
- `background: transparent`, `box-shadow: none`, larger icon (34×34 vs 30×30), text on white at 92% opacity, badge as outlined chip (was solid green).

**Capabilities grid broken on mobile:** the four cards had explicit `grid-column: 2/3` placements which forced the grid to keep 3 columns even when the template was `1fr` — that's why the hero ended up 38px wide. Reset `grid-column`/`grid-row` to `auto` on mobile (and added a proper 2-col layout at the 1100px breakpoint).

**Dashboard mobile scale not applying:** Chrome refuses to fold both `scale(calc(length/length))` and `scale(var(...))` inside `transform`, falling back to the matching `.db2-slide` rule's `translateX(60px)`. Switched to JS-driven inline transform (`scale(${factor})` set on each slide via `style.setProperty` with `!important`), and disabled the reveal-state transforms on mobile (`.db2-slide`/`.db2-slide--in { transform: none }`) so they don't clobber the scale. Each slide on mobile is now properly 343×224 instead of 1100×720.

## 2026-05-19 · feat: Industries section redesign (activity cards + flow + trust row)

Replaced the simple gradient-card "Built For" grid with a richer IndustriesSection that matches the reference structure:

- **New component**: `app/components/IndustriesSection.tsx`.
- **Header**: 2-column — left has section label `● INDUSTRIES WE POWER` + serif heading "Built for every industry. Trained for *every outcome*." (gradient on "every outcome"); right column has the supporting paragraph.
- **8 industry cards** in a 4×2 grid, each with:
  - **Top "image" panel** (gradient placeholder using each industry's accent color) with the industry icon top-left and **1-3 floating activity cards** top-right (e.g. *New inquiry · MBA Program · via WhatsApp* + *AI Qualified · High intent*).
  - Serif title + body.
  - **4-step flow row** with icon pills + arrow connectors (e.g. Inquiry → Qualify → Book → Enroll).
  - Big colored stat (4.2× / 68% / 3× …) plus label.
- **Bottom trust row**: 5 items with vertical dividers — Works across 15+ industries · AI trained on real conversations · Always-on 24/7 · Secure. Encrypted. Compliant · Results you can measure.
- Same glass-card system (`backdrop-filter: blur(24px)`, `border: 1px solid rgba(255,255,255,0.10)`, soft outer + inset shadows) as HowItWorks / Capabilities so the section reads as part of the same site.
- Stagger-reveal on scroll: label → heading → sub → cards → trust row.
- Responsive: 4-col → 3-col (≤1200) → 2-col (≤880) → 1-col (≤520). Trust row collapses to 2-col with left-aligned items at ≤880.
- Stale Built-For inline JSX + `Icon.*` placeholders removed from `ProxeLanding.tsx`.

User said "we'll keep improving it" — this is the structural foundation; copy/photo upgrades and per-card polish can iterate from here.

## 2026-05-19 · fix: third pillar card — permanent chat header anchors content

The reactivation card visualization area was looking empty during animation cycles. Even with `flex: 1` on the chat container, the chat children were `opacity: 0` until their animation step fired — so during step-0 (loop restart) and step-1/2 (before the lead reply lands) the card showed huge gaps.

- Added an **always-visible WhatsApp chat header** at the top of the card (avatar gradient + "Rahul S." + "WhatsApp · Follow-up sequence" + online dot). It's `flex-shrink: 0` and sits above the chat bubble area.
- Chat container switched from `space-around` → `space-between` so the typing slot at top and system slot at bottom anchor the layout even when their opacity is 0.
- The card now always reads as a populated conversation panel regardless of which animation step is mid-cycle.

## 2026-05-19 · remove: "Learn more →" links from Capabilities side cards

## 2026-05-19 · update: Pricing — $99 → $249 (Starter), $199 → $449 (Unlimited)

## 2026-05-19 · remove: Capabilities compliance badges row

Removed the SOC 2 / End-to-End / GDPR / Multi-Channel / Always On strip below the grid per user request. Dropped the now-unused `FiDatabase` import. (d8fc314)

## 2026-05-19 · fix: Capabilities — match existing site theme (glass-card system)

- **Section background reverted to transparent** — the page's purple shows through, matching every other section on the site (`.proxe-section`, `.hiw-section`, `.cd-section`, `.db2-section` all use `background: transparent`). The dark navy bg I added was wrong; the user wanted only the reference's *structure*, not its colors.
- **Cards (hero, side cards, compliance row)** now use the exact same glass-card primitives as HowItWorks:
  - `background: linear-gradient(180deg, rgba(8,6,24,0.5/0.55), rgba(12,9,32,0.6/0.65))`
  - `border: 1px solid rgba(255,255,255,0.10)`
  - `box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)`
  - `backdrop-filter: blur(24px)`
- Comet trail dialed down to a subtle highlight (was a heavy purple bar over a dark bg).

## 2026-05-19 · fix: dashboard→capabilities gap + Capabilities polish (reference-true orb)

**Dashboard→Capabilities gap (high-priority interrupt):**
- Reduced sticky wrapper from `180vh` → `130vh`. The dashboard section was reserving way too much vertical scroll space, leaving a huge purple gap before the next section.
- Capabilities top padding reduced `110px` → `60px`.

**Capabilities polish:**
- Section background: dark navy gradient + subtle starfield + diagonal purple comet trail in the top-right (matches the reference's own dark background instead of inheriting page purple).
- Layout: hero spans 2 rows on the left, **2×2 of equal-sized cards** on the right (not bento — that was wrong; the reference uses a uniform 2×2).
- **Orb redesigned**: viewbox 240, glowing core sphere with top-left specular highlight, **3 inner vertical bars** matching the PROXe brain/logo motif, **3 elliptical orbits** at rotated angles (atom-style), 3 particles animating along the orbits via `animateMotion`, heavy purple drop-shadow.
- **Curved glowing connector SVG**: 4 paths from each channel row → the orb center, with gradient stroke (transparent on the channel end, bright on the orb end) and a glowing drop-shadow.
- Cards: subtle purple border + dark-glass surface so they sit properly on the new dark section background.
- Frame element kept structurally but visually removed (no border / no padding).

## 2026-05-19 · fix: Capabilities — bento layout (hero 2/3, wide multi-agent)

The previous uniform 3-col grid squeezed the hero card to 438px, which crushed its internal 3-column visualization down to 89px side columns — channel names wrapped to 4 lines, AI Memory wrapped to 10+ lines. The right side was visibly cut off.

- Grid restructured to a real **bento**: 2-col grid with hero (2/3) spanning 2 rows, lead-capture + follow-ups stacked on the right (1/3 each), then multi-agent (2/3, wide) + security (1/3) in the bottom row.
- Hero is now 733px wide instead of 438px. Internal columns are 237 / 180 / 180 / 237 — content fits without wrapping.
- Multi-Agent System upgraded to a **wide horizontal network**: 4 channel-colored agent icons spread across with curved SVG connecting paths to a central orb. Visually distinct from the other side cards.
- Per-card grid placement classes (`.cap-card--capture`, `--followup`, `--agents`, `--security`) so each card sits in its bento slot.

## 2026-05-19 · rebuild: Capabilities — proper hero-frame layout, SVG orb

Full rewrite of `CapabilitiesSection.tsx` and the `.cap-*` block in `landing.css`.

**Structure:**
- Header (label / heading / sub) sits **above** a single big rounded dark-glass `.cap-frame`.
- The frame wraps the entire grid + compliance badges in one container — matches the reference instead of floating disconnected elements.
- Frame has subtle dot-grid backdrop with a radial mask + a diagonal purple light arc in the top right.

**Hero card:**
- Spans 2 rows on the left.
- Title in `--proxe-font-heading` (matches the rest of the site's serif rhythm), italic "autonomous" gradient.
- 3-column visualization: channel feed (with colored left-rail bars per channel) → glowing **SVG orb** → profile panel + AI Memory bubble.
- SVG orb: glowing core, 3 concentric orbit rings, 8 radiating rays (slow rotation), 6 pulsing particles.
- Stats row with vertical dividers; values use the heading font for editorial feel.

**Side cards:**
- 2×2 grid. Each card has icon-in-pill, serif title, body, mini visualization, and "Learn more →".
- Mini visualizations use shared `.cap-mini-core` glowing dot for consistency.
- Constellation, follow-up flow (with green check at end), agent network (curved SVG paths), and shield rings.

**Compliance row:**
- Inside the frame, with vertical dividers and consistent dark-glass styling.

**Theme:**
- Page background untouched (inherits the site's purple).
- Frame uses the same dark-glass palette as HowItWorks / Dashboard cards — visual consistency across the page.
- All accent colors stay within the existing `#7c3aed` / `#a78bfa` / `#c4b5fd` palette.

## 2026-05-19 · refine: Capabilities — match theme + reference

- Removed the dark forced background — section is now transparent and inherits the site's purple, matching the rest of the page (HowItWorks / Dashboard / etc.) instead of standing out.
- Hero card upgraded with a subtle starfield + dual radial glows on top of dark-glass surface.
- **Orb redesigned**: 160px with 3 expanding rings, pulsing core glow, and 3 particles orbiting at different speeds/radii — closer to the molecular-orbit feel in the reference.
- **Channel cards** get a colored left border (green / purple / blue / violet) matching their channel.
- **Connector lines**: animated dotted flow toward the orb (was static).
- **AI Memory bubble**: header now `nowrap` so "Just now" stays on one line; dot rendered as a true glowing avatar with inner white pip.
- **Stats row**: divided columns with vertical separators, larger value typography (heading font, 20px).
- **Side cards**: dark-glass with a subtle bottom-right radial purple glow.
- **Lead Capture vis**: added a faint dotted ring/cross-hair grid around the channel constellation.
- Fixed the "o¦o" typo → "∞" on Cross-Channel Memory stat.

## 2026-05-19 · feat: redesigned Capabilities section

- Replaced the 6-card flat grid with a richer hero + side-grid layout (matching the reference design).
- **Hero (Core Intelligence / Unified Memory)**: gradient card with a 3-column visualization — channel feed (WhatsApp / Web / Voice / Email) → glowing animated orb → Persistent Customer Profile + AI Memory bubble. Bottom stats row (100% Context Retention · ∞ Cross-Channel Memory · 24/7 Always Remembering).
- **Side cards (2×2)**: 24/7 Lead Capture, Auto Follow-Ups, Multi-Agent System, Enterprise Security — each with icon, copy, mini visualization (channel constellation / followup flow / agent network / shield rings), and "Learn more →" link.
- **Bottom compliance row**: SOC 2 Type II · End-to-End Encrypted · GDPR Compliant · Multi-Channel Connected · Always On.
- Section-level scroll-reveal with staggered animations on label, headline, sub, hero, cards, and badges.
- Responsive: hero collapses to full-width above the 2×2 grid at ≤1100px; everything stacks at ≤720px.
- New component `app/components/CapabilitiesSection.tsx`; old inline 6-card grid removed from `ProxeLanding.tsx`.

## 2026-05-19 · feat: click-drag dashboard carousel + faster scroll pacing

- **Click-drag**: pointerdown/move/up handlers on `.db2-carousel` so users can grab and drag horizontally with the mouse (not just wheel). `cursor: grab` / `grabbing`, captures pointer, suspends the scroll-driven page handler while dragging so they don't fight.
- **Faster slide pacing**: sticky wrapper height reduced from `300vh` to `180vh` — slides now advance ~67% faster per unit of page-scroll.
- User-facing: dashboard carousel is now grabbable with the mouse, and scroll-driven horizontal pan moves through slides much quicker.

## 2026-05-19 · fix: card 3 spacing, mobile thumbnail dashboard, IG chips, dial arrows

- **Card 3 (Reactivate)**: top-aligned (22px padding) like cards 1 & 2 instead of centered. Chat container now stretches with `flex: 1` and `justify-content: space-around` so content fills the frame — no more 100px of empty space at the top.
- **Mobile dashboard carousel**: reverted the responsive reflow. Each slide now keeps its desktop layout intact and is scaled down as a single "YouTube-thumbnail" using `transform: scale(calc((100vw - 32px) / 1100px))`. Negative right-margin reclaims the unscaled layout width so flex layout matches the visual width. Carousel height shrinks to the scaled-thumbnail height — no empty space below.
- **Instagram quick-reply pills**: horizontal scrollable chips (small, native-IG style) instead of a vertical stack on the right side.
- **Channel dial arrows (`cd-dial-controls`)**: hidden on mobile (`≤860px`) — channel selection happens via the icon strip on top.
- User-facing: card 3 visually matches cards 1 & 2; mobile dashboard reads as a clean YouTube-style thumbnail row; Instagram chat looks like the real app.

## 2026-05-19 · feat: restore Lenis smooth-scroll globally

- Installed `lenis` and added `app/components/shared/LenisProvider.tsx` — a client component that boots a single Lenis instance at the root and drives the page via `requestAnimationFrame`.
- Mounted `<LenisProvider />` once inside `<body>` in `app/layout.tsx`.
- Updated `app/globals.css` with the standard Lenis class hooks (`.lenis`, `.lenis-smooth`, `.lenis-stopped`, `[data-lenis-prevent]`) so native smooth-scroll defers to Lenis when active.
- Respects `prefers-reduced-motion` — falls back to native scroll for users who prefer it.
- User-facing: full-page inertial smooth scroll with expo-out easing (~1.15s duration). Wheel and trackpad feel buttery; iOS keeps native touch momentum.

## 2026-05-19 · fix: mobile dashboard, channel demo icons, third-pillar centering

- **Dashboard mobile carousel**: each slide is now `calc(100vw - 32px)` wide (one full slide per view) — replaced the broken `transform: scale()` thumbnail approach. Dashboard content reflows to 2-column grids (gauges/stats) with tighter padding and smaller fonts so it fits cleanly. Carousel arrows hidden on mobile in favor of native swipe + scroll-snap.
- **Channel demo mobile**: hide the channel labels on `≤860px` — only the brand icons remain. `min-width` removed so 5 channels fit comfortably and the row stays horizontally scrollable.
- **Third pillar card (`hiw-vis--react`)**: replaced `justify-content: flex-start !important` with `center` so the WhatsApp follow-up animation sits vertically centered like cards 1 & 2 (was top-aligned with ~190px of empty space below).
- User-facing: mobile dashboard is now a clean one-slide-per-view swipeable carousel; channel selector on mobile is a tidy icon strip; third "Never Let a Lead Go Cold" pillar now looks balanced.

## 2026-05-19 · feat: scroll-driven horizontal dashboard carousel

- Wrapped `.db2-section` in `.db2-sticky-wrapper` (300vh height on desktop) so the section pins sticky while the user scrolls
- Replaced wheel-intercept handler with a `window scroll` event listener that maps page scroll progress to carousel `scrollLeft`
- On desktop (≥768px): section sticks at `top: 0`, `scroll-snap-type: none` on carousel (prevents snap fighting programmatic scroll)
- On mobile: normal layout — section scrolls naturally, carousel is touch-swipeable
- User-facing: scroll down through the dashboard section to pan through all 3 screens (Dashboard → Conversations → Leads), then continue past to the next section

## 2026-05-19 · feat: full-bleed right carousel via CSS-only width extension

- Extended `.db2-carousel-wrap` width using `calc(100% + max(24px, (100vw - 1200px) / 2 + 24px))` — accounts for container's right padding and auto-margin to reach the viewport right edge
- Slide 2 now peeks ~84px from the right on a 1280px viewport, giving the "continuing carousel" effect
- No DOM structural changes — carousel-wrap stays inside proxe-container (the prior full-bleed approach moved it outside and broke the live site)
- Section's existing `overflow: hidden` clips the tiny scrollbar-width excess (no horizontal page scrollbar)
- Reset to `width: 100%` under the `@media (max-width: 900px)` block so mobile scaled-thumbnail layout is unaffected
- User-facing: second slide peeks out to the right viewport edge on desktop

## 2026-05-19 · revert: restore stable dashboard carousel layout

- Reverted full-bleed carousel change (af47d9c) — moving carousel-wrap outside proxe-container caused the section IntersectionObserver to stop firing, leaving the entire dashboard section invisible (opacity: 0, no animation reveal)
- User-facing: dashboard section is visible again on scroll

(d046c5e)

## 2026-05-19 · fix: clean up dashboard section shadows

- Reduced `.db2-browser` box-shadow from `0 24px 80px rgba(0,0,0,0.6)` (heavy bleed) to `0 8px 40px rgba(0,0,0,0.45)` across all three carousel slides
- Reduced purple glow from `0 0 60px` to `0 0 24px rgba(124,58,237,0.08)` — no longer bleeds past the mock frame
- Removed inline `drop-shadow` neon glow from CircleGauge SVG rings in DashboardSection
- User-facing: dashboard section looks cleaner with no large dark blotch below or neon halos on gauges

(55de422)
