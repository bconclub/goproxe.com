# Changelog

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
