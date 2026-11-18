import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import * as deviceUtils from '../utils/device.utils';
import { usePerformanceStore } from '../store/performance.store';
import { useThemeStore } from '../store/theme.store';
import { FRAME_RATE_WARM_UP, usePerformanceMonitor } from './usePerformanceMonitor';

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  document.dispatchEvent(new Event('visibilitychange'));
};

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'christmas' });
    usePerformanceStore.setState({ hardwareReasons: [], lowFrameRateDetectedAt: null, detectionDisabled: false });
    setVisibility('visible');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should flag the device as low-end when the animated scene runs slowly', async () => {
    const measure = vi.spyOn(deviceUtils, 'measureFrameRate').mockResolvedValue(22);
    renderHook(() => usePerformanceMonitor());

    expect(measure).not.toHaveBeenCalled(); // waits for the scene to settle first
    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));

    expect(measure).toHaveBeenCalledTimes(1);
    expect(usePerformanceStore.getState().lowFrameRateDetectedAt).not.toBeNull();
    expect(document.documentElement.dataset.performance).toBe('low');
  });

  it('should keep the animations on a smooth device', async () => {
    vi.spyOn(deviceUtils, 'measureFrameRate').mockResolvedValue(60);
    renderHook(() => usePerformanceMonitor());

    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));

    expect(usePerformanceStore.getState().lowFrameRateDetectedAt).toBeNull();
    expect(document.documentElement.dataset.performance).toBe('normal');
  });

  it('should measure each theme only once per visit', async () => {
    const measure = vi.spyOn(deviceUtils, 'measureFrameRate').mockResolvedValue(60);
    renderHook(() => usePerformanceMonitor());
    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));

    act(() => useThemeStore.getState().setSelection('summer'));
    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));
    act(() => useThemeStore.getState().setSelection('auto'));
    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));

    expect(measure).toHaveBeenCalledTimes(2); // christmas, summer
  });

  it('should not measure while the background is static', async () => {
    const measure = vi.spyOn(deviceUtils, 'measureFrameRate').mockResolvedValue(60);
    useThemeStore.setState({ animationsPaused: true });
    renderHook(() => usePerformanceMonitor());

    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP * 2));

    expect(measure).not.toHaveBeenCalled();
  });

  it('should not measure when the device is already known to be low-end', async () => {
    const measure = vi.spyOn(deviceUtils, 'measureFrameRate').mockResolvedValue(60);
    usePerformanceStore.setState({ hardwareReasons: ['low-memory'] });
    renderHook(() => usePerformanceMonitor());

    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP * 2));

    expect(measure).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.performance).toBe('low');
  });

  it('should wait for the tab to be visible (hidden tabs are throttled)', async () => {
    const measure = vi.spyOn(deviceUtils, 'measureFrameRate').mockResolvedValue(60);
    setVisibility('hidden');
    renderHook(() => usePerformanceMonitor());

    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP * 2));
    expect(measure).not.toHaveBeenCalled();

    act(() => setVisibility('visible'));
    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));
    expect(measure).toHaveBeenCalledTimes(1);
  });

  it('should discard a measure interrupted by hiding the tab', async () => {
    let finish: (value: number | null) => void = () => {};
    vi.spyOn(deviceUtils, 'measureFrameRate').mockImplementation((_duration, signal) => new Promise((resolve) => {
      finish = resolve;
      signal?.addEventListener('abort', () => resolve(null));
    }));
    renderHook(() => usePerformanceMonitor());
    await act(() => vi.advanceTimersByTimeAsync(FRAME_RATE_WARM_UP));

    act(() => setVisibility('hidden'));
    await act(async () => finish(5));

    expect(usePerformanceStore.getState().lowFrameRateDetectedAt).toBeNull();
  });
});
