// Every card plays in order, as before the core/bubbles experiment (Z, 5 Oct 2026:
// bring the older slides back). /pitch has everything; the homepage and
// /what-is-proxe have everything except the pitch-only cards (traction, round).

export const PRODUCT_CARDS = ['cover', 'problem', 'gaps', 'stack', 'who', 'solution', 'how', 'dashboard', 'team', 'memory', 'built-hsh', 'built-lokazen', 'built-windchasers', 'built-bcon', 'built-khadivasthra', 'live', 'numbers', 'proof', 'insight', 'price', 'founder']

// Homepage and /what-is-proxe.
export const CORE_EXPLAINER = [...PRODUCT_CARDS, 'talk', 'watch']

// /pitch: the same cards, plus traction and the round after the price.
export const CORE_PITCH = [...PRODUCT_CARDS.slice(0, PRODUCT_CARDS.indexOf('price') + 1), 'traction', 'round', ...PRODUCT_CARDS.slice(PRODUCT_CARDS.indexOf('price') + 1), 'talk', 'watch']

type Group = { key: string; label: string; cards: string[] }
// No on-demand bubbles: everything is in the main run again.
export const EXTRAS_EXPLAINER: Group[] = []
export const EXTRAS_PITCH: Group[] = []

export const EXPLAINER_CARDS = CORE_EXPLAINER
export const PITCH_CARDS = CORE_PITCH
