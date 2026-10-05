// Every card plays in order. Edge cases sit after "Talk to PROXe" (Z, 5 Oct 2026:
// they made the run too long): swipe on from Talk to a hub of brands, tap one
// to see its edge case, and it comes back to the hub. /pitch has everything; the
// homepage and /what-is-proxe skip the pitch-only cards (traction, round).

export const EDGE_CARDS = ['built-hsh', 'built-lokazen', 'built-windchasers', 'built-bcon', 'built-khadivasthra']

export const PRODUCT_CARDS = ['cover', 'problem', 'gaps', 'stack', 'who', 'solution', 'how', 'dashboard', 'team', 'memory', 'live', 'numbers', 'proof', 'insight', 'price', 'founder']

// Homepage and /what-is-proxe.
export const CORE_EXPLAINER = [...PRODUCT_CARDS, 'talk', 'edges', 'watch']

// /pitch: the same cards, plus traction and the round after the price.
export const CORE_PITCH = [...PRODUCT_CARDS.slice(0, PRODUCT_CARDS.indexOf('price') + 1), 'traction', 'round', ...PRODUCT_CARDS.slice(PRODUCT_CARDS.indexOf('price') + 1), 'talk', 'edges', 'watch']

type Group = { key: string; label: string; cards: string[] }
// The edge cases: opened from the "edges" hub, never in the main run, no bubbles.
const EDGE: Group = { key: 'edge', label: 'Edge cases', cards: EDGE_CARDS }
export const EXTRAS_EXPLAINER: Group[] = [EDGE]
export const EXTRAS_PITCH: Group[] = [EDGE]

export const EXPLAINER_CARDS = CORE_EXPLAINER
export const PITCH_CARDS = CORE_PITCH
