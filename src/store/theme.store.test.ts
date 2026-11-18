import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useThemeStore } from './theme.store';

describe('theme store', () => {
  beforeEach(() => {
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'autumn' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should follow the calendar by default', () => {
    expect(useThemeStore.getState().selection).toBe('auto');
    expect(useThemeStore.getState().animationsPaused).toBeNull();
  });

  it('should remember the player choices in localStorage', () => {
    useThemeStore.getState().setSelection('halloween');
    useThemeStore.getState().setAnimationsPaused(true);

    const saved = JSON.parse(localStorage.getItem('emoji-memory-game:theme') as string);
    expect(saved.state).toEqual({ selection: 'halloween', animationsPaused: true });
  });

  it('should not persist the date-based theme', () => {
    useThemeStore.getState().setSelection('spring');

    const saved = JSON.parse(localStorage.getItem('emoji-memory-game:theme') as string);
    expect(saved.state.autoThemeId).toBeUndefined();
  });

  it('should recompute the date-based theme when the date changes', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 31, 12));

    useThemeStore.getState().refreshAutoTheme();
    expect(useThemeStore.getState().autoThemeId).toBe('halloween');

    vi.setSystemTime(new Date(2026, 11, 24, 12));
    useThemeStore.getState().refreshAutoTheme();
    expect(useThemeStore.getState().autoThemeId).toBe('christmas');
  });

  it('should ignore invalid saved values', async () => {
    localStorage.setItem('emoji-memory-game:theme', JSON.stringify({ state: { selection: 'carnival', animationsPaused: 'yes' }, version: 0 }));

    await useThemeStore.persist.rehydrate();

    expect(useThemeStore.getState().selection).toBe('auto');
    expect(useThemeStore.getState().animationsPaused).toBeNull();
  });

  it('should restore valid saved values', async () => {
    localStorage.setItem('emoji-memory-game:theme', JSON.stringify({ state: { selection: 'easter', animationsPaused: false }, version: 0 }));

    await useThemeStore.persist.rehydrate();

    expect(useThemeStore.getState().selection).toBe('easter');
    expect(useThemeStore.getState().animationsPaused).toBe(false);
  });
});
