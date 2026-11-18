import { describe, it, expect } from 'vitest';
import { isThemeId, themeOrder, themes } from './themes.configuration';
import { levels } from './game.configuration';

const maxPairs = Math.max(...levels.map((level) => level.horizontalCards * level.verticalCards / 2));

describe('themes configuration', () => {
  it('should list every theme once in the selector order', () => {
    expect([...themeOrder].sort()).toEqual(Object.keys(themes).sort());
  });

  it('should have 4 seasons and 3 holidays', () => {
    const kinds = Object.values(themes).map((theme) => theme.kind);
    expect(kinds.filter((kind) => kind === 'season')).toHaveLength(4);
    expect(kinds.filter((kind) => kind === 'holiday')).toHaveLength(3);
  });

  it.each(Object.values(themes))('$name should have enough distinct emojis for the biggest level', (theme) => {
    expect(new Set(theme.emojis).size).toBe(theme.emojis.length);
    expect(theme.emojis.length).toBeGreaterThanOrEqual(maxPairs);
  });

  it.each(Object.values(themes))('$name should define every colour as hex', (theme) => {
    Object.values(theme.colors).forEach((color) => expect(color).toMatch(/^#[0-9A-F]{6}$/i));
  });

  it('should recognise theme ids', () => {
    expect(isThemeId('easter')).toBe(true);
    expect(isThemeId('auto')).toBe(false);
    expect(isThemeId(undefined)).toBe(false);
  });
});
