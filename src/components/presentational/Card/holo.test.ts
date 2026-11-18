import { describe, it, expect } from 'vitest';
import { getHoloVariant, HOLO_VARIANTS } from './holo';

describe('getHoloVariant', () => {
  it('should always give the same effect for the same emoji (both cards of a pair shine alike)', () => {
    ['🎃', '🧝‍♀️', '🌸', '❄️'].forEach((emoji) => expect(getHoloVariant(emoji)).toBe(getHoloVariant(emoji)));
  });

  it('should return one of the available effects', () => {
    expect(HOLO_VARIANTS).toContain(getHoloVariant('🦄'));
  });

  it('should use every effect across a deck', () => {
    const deck = ['🎅', '🎄', '❄️', '🎁', '🥂', '🌠', '☃️', '⛄', '🤶', '🎉', '💫', '🧦', '🌟', '🍪', '🦌', '🕯️', '👼', '🥳', '🎊'];
    expect(new Set(deck.map(getHoloVariant)).size).toBe(HOLO_VARIANTS.length);
  });
});
