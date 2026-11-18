import { describe, it, expect, vi } from 'vitest';
import { getLowEndReasons, measureFrameRate, readDeviceHints, readPerformanceOverride } from './device.utils';

/** Fake frame scheduler: every frame advances the clock by `frameDuration` ms. */
const fakeScheduler = (frameDuration: number) => {
  let now = 0;
  return {
    requestFrame: (callback: FrameRequestCallback) => {
      const handle = setTimeout(() => {
        now += frameDuration;
        callback(now);
      }, 0) as unknown as number;
      return handle;
    },
    cancelFrame: (handle: number) => clearTimeout(handle),
    now: () => now,
  };
};

describe('readDeviceHints', () => {
  it('should read the hints exposed by the browser', () => {
    const nav = { deviceMemory: 2, hardwareConcurrency: 8, connection: { saveData: true } } as unknown as Navigator;
    expect(readDeviceHints(nav)).toEqual({ deviceMemory: 2, hardwareConcurrency: 8, saveData: true });
  });

  it('should leave the hints the browser does not expose undefined', () => {
    expect(readDeviceHints({ hardwareConcurrency: 0 } as unknown as Navigator)).toEqual({
      deviceMemory: undefined, hardwareConcurrency: undefined, saveData: false,
    });
    expect(readDeviceHints({} as Navigator)).toEqual({ deviceMemory: undefined, hardwareConcurrency: undefined, saveData: false });
  });
});

describe('getLowEndReasons', () => {
  it('should not flag a capable device', () => {
    expect(getLowEndReasons({ deviceMemory: 8, hardwareConcurrency: 8, saveData: false })).toEqual([]);
  });

  it('should not flag a device that exposes no hints', () => {
    expect(getLowEndReasons({})).toEqual([]);
  });

  it('should flag little memory, few cores and the data saver', () => {
    expect(getLowEndReasons({ deviceMemory: 1 })).toEqual(['low-memory']);
    expect(getLowEndReasons({ deviceMemory: 2, hardwareConcurrency: 2 })).toEqual(['low-memory', 'few-cpu-cores']);
    expect(getLowEndReasons({ deviceMemory: 4, hardwareConcurrency: 4, saveData: true })).toEqual(['data-saver']);
  });
});

describe('readPerformanceOverride', () => {
  it('should read ?performance=low|high', () => {
    expect(readPerformanceOverride('?performance=low')).toBe('low');
    expect(readPerformanceOverride('?theme=easter&performance=high')).toBe('high');
    expect(readPerformanceOverride('?performance=turbo')).toBeNull();
    expect(readPerformanceOverride('')).toBeNull();
  });
});

describe('measureFrameRate', () => {
  it('should measure a smooth 60 fps', async () => {
    vi.useFakeTimers();
    const result = measureFrameRate(1000, undefined, fakeScheduler(1000 / 60));
    await vi.runAllTimersAsync();

    expect(Math.round(await result as number)).toBe(60);
    vi.useRealTimers();
  });

  it('should measure a struggling 20 fps', async () => {
    vi.useFakeTimers();
    const result = measureFrameRate(1000, undefined, fakeScheduler(50));
    await vi.runAllTimersAsync();

    expect(Math.round(await result as number)).toBe(20);
    vi.useRealTimers();
  });

  it('should resolve with null when aborted', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const result = measureFrameRate(1000, controller.signal, fakeScheduler(16));
    await vi.advanceTimersByTimeAsync(5);
    controller.abort();

    expect(await result).toBeNull();
    vi.useRealTimers();
  });

  it('should resolve with null when already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    expect(await measureFrameRate(1000, controller.signal, fakeScheduler(16))).toBeNull();
  });
});
