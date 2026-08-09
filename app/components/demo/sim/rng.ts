/**
 * Deterministic randomness for the demo simulation.
 *
 * Seeded per industry (hash of the slug), so every visit to /demo/clinics
 * replays the same business — which also makes the demo assertable in QA:
 * two loads must produce identical first leads.
 *
 * Date.now()/Math.random() are used ONLY for visual timestamps ("2m ago"),
 * never for content decisions.
 */

/** mulberry32 — tiny, good-enough PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick from an array with the given rng. */
export function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Integer in [min, max] inclusive. */
export function between(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
