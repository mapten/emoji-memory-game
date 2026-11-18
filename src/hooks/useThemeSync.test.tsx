import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useThemeStore } from '../store/theme.store';
import { APP_TITLE, useThemeSync } from './useThemeSync';

describe('useThemeSync', () => {
  beforeEach(() => {
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'autumn' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should expose the theme colours as CSS variables', () => {
    renderHook(() => useThemeSync());

    const style = document.documentElement.style;
    expect(style.getPropertyValue('--color-primary')).toBe('#8C2F14');
    expect(style.getPropertyValue('--color-tertiary')).toBe('#F2B134');
    expect(document.documentElement.dataset.theme).toBe('autumn');
  });

  it('should update the tab title and favicon', () => {
    renderHook(() => useThemeSync());

    expect(document.title).toBe(`🍂 ${APP_TITLE}`);
    expect(document.querySelector<HTMLLinkElement>('link[rel~="icon"]')?.href).toContain(encodeURIComponent('🍂'));
  });

  it('should follow the player selection', () => {
    renderHook(() => useThemeSync());

    act(() => useThemeStore.getState().setSelection('halloween'));

    expect(document.documentElement.dataset.theme).toBe('halloween');
    expect(document.documentElement.style.getPropertyValue('--color-quaternary')).toBe('#E8630A');
    expect(document.title).toBe(`🎃 ${APP_TITLE}`);
  });

  it('should blend the colours for a moment when the theme changes', () => {
    vi.useFakeTimers();
    renderHook(() => useThemeSync());
    expect(document.documentElement.classList.contains('theme-changing')).toBe(false);

    act(() => useThemeStore.getState().setSelection('spring'));
    expect(document.documentElement.classList.contains('theme-changing')).toBe(true);

    act(() => vi.advanceTimersByTime(1000));
    expect(document.documentElement.classList.contains('theme-changing')).toBe(false);
  });

  it('should switch by itself when a new period starts', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 30, 23, 59, 30));
    renderHook(() => useThemeSync());

    act(() => vi.advanceTimersByTime(60 * 1000)); // now 1 December

    expect(useThemeStore.getState().autoThemeId).toBe('christmas');
    expect(document.documentElement.dataset.theme).toBe('christmas');
  });
});
