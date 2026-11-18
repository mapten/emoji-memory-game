import { describe, it, expect, beforeEach } from 'vitest';
import { LOW_FRAME_RATE_MEMORY, selectLowEndReasons, usePerformanceStore } from './performance.store';

describe('performance store', () => {
  beforeEach(() => {
    usePerformanceStore.setState({ hardwareReasons: [], lowFrameRateDetectedAt: null, detectionDisabled: false });
  });

  it('should consider the device capable by default', () => {
    expect(selectLowEndReasons(usePerformanceStore.getState())).toEqual([]);
  });

  it('should flag the device when the frame rate is too low, and remember it', () => {
    usePerformanceStore.getState().reportFrameRate(24);

    expect(selectLowEndReasons(usePerformanceStore.getState())).toEqual(['low-frame-rate']);
    const saved = JSON.parse(localStorage.getItem('emoji-memory-game:performance') as string);
    expect(typeof saved.state.lowFrameRateDetectedAt).toBe('number');
  });

  it('should ignore a good frame rate', () => {
    usePerformanceStore.getState().reportFrameRate(58);

    expect(usePerformanceStore.getState().lowFrameRateDetectedAt).toBeNull();
  });

  it('should forget an old low frame rate measure', () => {
    const now = Date.now();
    usePerformanceStore.setState({ lowFrameRateDetectedAt: now - LOW_FRAME_RATE_MEMORY - 1 });

    expect(selectLowEndReasons(usePerformanceStore.getState(), now)).toEqual([]);
  });

  it('should combine hardware and frame rate reasons', () => {
    usePerformanceStore.setState({ hardwareReasons: ['low-memory'], lowFrameRateDetectedAt: Date.now() });

    expect(selectLowEndReasons(usePerformanceStore.getState())).toEqual(['low-memory', 'low-frame-rate']);
  });

  it('should report nothing when the detection is disabled (?performance=high)', () => {
    usePerformanceStore.setState({ hardwareReasons: ['few-cpu-cores'], lowFrameRateDetectedAt: Date.now(), detectionDisabled: true });

    expect(selectLowEndReasons(usePerformanceStore.getState())).toEqual([]);
  });

  it('should restore the saved measure, and ignore invalid values', async () => {
    localStorage.setItem('emoji-memory-game:performance', JSON.stringify({ state: { lowFrameRateDetectedAt: 123 }, version: 0 }));
    await usePerformanceStore.persist.rehydrate();
    expect(usePerformanceStore.getState().lowFrameRateDetectedAt).toBe(123);

    localStorage.setItem('emoji-memory-game:performance', JSON.stringify({ state: { lowFrameRateDetectedAt: 'yesterday' }, version: 0 }));
    await usePerformanceStore.persist.rehydrate();
    expect(usePerformanceStore.getState().lowFrameRateDetectedAt).toBeNull();
  });
});
