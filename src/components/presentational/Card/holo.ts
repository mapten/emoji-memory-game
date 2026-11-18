/**
 * Holographic effects played on the front of a card when it is turned face up
 * (like a shiny trading card catching the light). See Card.css.
 */
export const HOLO_VARIANTS = ['sweep', 'rays', 'prism', 'ring', 'glitter'] as const;

export type HoloVariant = typeof HOLO_VARIANTS[number];

/**
 * Picks the effect of a card from its emoji, so both cards of a pair shine the same way
 * and the effect does not change when the card is turned again.
 */
export const getHoloVariant = (emoji: string): HoloVariant => {
  let hash = 0;
  for (const char of emoji) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  }
  return HOLO_VARIANTS[hash % HOLO_VARIANTS.length];
};

/** Position (% of the card), size (% of the card width) and delay (s) of the glitter stars. */
export const GLITTER_STARS: [top: number, left: number, size: number, delay: number][] = [
  [14, 18, 24, 0],
  [20, 74, 16, 0.12],
  [46, 10, 13, 0.3],
  [60, 84, 22, 0.2],
  [84, 30, 17, 0.42],
  [34, 50, 12, 0.55],
  [80, 66, 14, 0.08],
  [52, 60, 10, 0.36],
];
