import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import { usePerformanceStore } from '../store/performance.store';
import { useThemeStore } from '../store/theme.store';
import { useAnimationPauseReason, useAnimationsPaused } from './useAnimationsPaused';

const mockReducedMotion = (reduce: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

describe('useAnimationPauseReason', () => {
  beforeEach(() => {
    useThemeStore.setState({ animationsPaused: null });
    usePerformanceStore.setState({ hardwareReasons: [], lowFrameRateDetectedAt: null, detectionDisabled: false });
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should play the animations on a capable device', () => {
    expect(renderHook(() => useAnimationPauseReason()).result.current).toBeNull();
    expect(renderHook(() => useAnimationsPaused()).result.current).toBe(false);
  });

  it('should make the background static on a low-end device', () => {
    usePerformanceStore.setState({ hardwareReasons: ['low-memory'] });

    expect(renderHook(() => useAnimationPauseReason()).result.current).toBe('low-end-device');
  });

  it('should make the background static once a low frame rate has been measured', () => {
    usePerformanceStore.getState().reportFrameRate(20);

    expect(renderHook(() => useAnimationsPaused()).result.current).toBe(true);
  });

  it('should respect the system "reduce motion" setting', () => {
    mockReducedMotion(true);

    expect(renderHook(() => useAnimationPauseReason()).result.current).toBe('reduced-motion');
  });

  it('should let the player choice win', () => {
    usePerformanceStore.setState({ hardwareReasons: ['low-memory'] });
    useThemeStore.setState({ animationsPaused: false });
    expect(renderHook(() => useAnimationPauseReason()).result.current).toBeNull();

    usePerformanceStore.setState({ hardwareReasons: [] });
    useThemeStore.setState({ animationsPaused: true });
    expect(renderHook(() => useAnimationPauseReason()).result.current).toBe('player');
  });
});
