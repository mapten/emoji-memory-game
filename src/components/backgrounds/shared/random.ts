/**
 * Small deterministic pseudo-random generator (mulberry32).
 * Backgrounds use it so particles and decorations are "random" but identical on every render.
 */
export const createRandom = (seed: number) => {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    /** Random float in [min, max). */
    between: (min: number, max: number) => min + next() * (max - min),
    /** Random item of a list. */
    pick: <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
  };
};

export type Random = ReturnType<typeof createRandom>;

/** Rounds to one decimal: keeps the generated SVG markup short. */
export const r1 = (value: number) => Math.round(value * 10) / 10;
