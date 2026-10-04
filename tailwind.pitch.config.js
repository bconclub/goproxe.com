// Tailwind for the pitch deck and its homepage sections only. It is compiled
// ahead of time into app/components/pitch/pitch.css (npm run pitch:css), so
// the rest of the site's CSS pipeline is untouched. No preflight: utilities
// are scoped under .pitch-root and a small reset lives in pitch.src.css.
module.exports = {
  content: ['./app/components/pitch/**/*.{ts,tsx}'],
  important: '.pitch-root',
  corePlugins: { preflight: false },
  theme: { extend: {} },
}
