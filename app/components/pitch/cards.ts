// Core runs are short (Z, 5 Oct 2026: four minutes loses everyone). Everything
// else is on demand from the bubbles on the last card, "Talk to PROXe".

// Homepage and /what-is-proxe: about 1:40.
export const CORE_EXPLAINER = ['cover', 'problem', 'gaps', 'solution', 'how', 'proof', 'price', 'talk']

// /pitch: about 2:00, with traction, the round and the founder.
export const CORE_PITCH = ['cover', 'problem', 'solution', 'how', 'proof', 'price', 'traction', 'round', 'founder', 'talk']

type Group = { key: string; label: string; cards: string[] }
const EDGE: Group = { key: 'edge', label: 'Edge cases', cards: ['built-hsh', 'built-lokazen', 'built-windchasers', 'built-bcon', 'built-khadivasthra'] }
const BRANDS: Group = { key: 'brands', label: 'Brands on PROXe', cards: ['live'] }
const NUMBERS: Group = { key: 'numbers', label: 'The numbers', cards: ['numbers', 'insight'] }
const DEEP: Group = { key: 'deep', label: 'More on how it works', cards: ['stack', 'who', 'dashboard', 'team', 'memory'] }
const FOUNDER: Group = { key: 'founder', label: 'Who is building it', cards: ['founder'] }
const TOUR: Group = { key: 'tour', label: 'Dashboard tour', cards: ['watch'] }

export const EXTRAS_EXPLAINER: Group[] = [EDGE, BRANDS, NUMBERS, DEEP, FOUNDER, TOUR]
export const EXTRAS_PITCH: Group[] = [EDGE, BRANDS, NUMBERS, DEEP, TOUR]

// Kept for anything still importing the old lists.
export const PRODUCT_CARDS = CORE_EXPLAINER
export const EXPLAINER_CARDS = CORE_EXPLAINER
export const PITCH_CARDS = CORE_PITCH
