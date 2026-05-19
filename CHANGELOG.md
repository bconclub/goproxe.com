# Changelog

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
