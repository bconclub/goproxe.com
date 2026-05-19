# Changelog

## 2026-05-19 · feat: full-bleed right carousel for dashboard section

- Moved `.db2-carousel-wrap` outside `.proxe-container` so the carousel can extend past the container's max-width boundary
- Carousel now starts at the container content's left edge (via `padding-left: calc(50vw - min(600px, 50vw) + 24px)`) and extends to the viewport right edge
- Slide width uses `calc(50vw + min(600px, 50vw) - 24px)` — fills from content-left to right viewport edge at all breakpoints
- Arrow positions updated to match new full-bleed layout
- Fixed stale SWC compiler cache that was showing a false syntax error (file was correct; restarted dev server to clear)
- User-facing: dashboard carousel reads as a wide "continuing" strip rather than a centered box

(HEAD)

## 2026-05-19 · fix: clean up dashboard section shadows

- Reduced `.db2-browser` box-shadow from `0 24px 80px rgba(0,0,0,0.6)` (heavy bleed) to `0 8px 40px rgba(0,0,0,0.45)` across all three carousel slides
- Reduced purple glow from `0 0 60px` to `0 0 24px rgba(124,58,237,0.08)` — no longer bleeds past the mock frame
- Removed inline `drop-shadow` neon glow from CircleGauge SVG rings in DashboardSection
- User-facing: dashboard section looks cleaner with no large dark blotch below or neon halos on gauges

(55de422)
