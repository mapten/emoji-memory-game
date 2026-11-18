/*
 * Low-end device detection.
 *
 * No browser API says "this is a low-end device", so two kinds of signals are combined:
 * 1. Hardware hints, available immediately (but not in every browser):
 *    - `navigator.deviceMemory` (GB of RAM, Chromium browsers)
 *    - `navigator.hardwareConcurrency` (number of logical CPU cores)
 *    - `navigator.connection.saveData` (the user turned on a data/battery saver)
 * 2. The frame rate actually reached while the animated background is running
 *    (works everywhere, see `measureFrameRate`). It also catches battery-saver modes that cap the frame rate.
 */

/** Devices with this much memory (GB) or less are considered low-end. */
export const LOW_END_MAX_MEMORY_GB = 2;
/** Devices with this many logical CPU cores or fewer are considered low-end. */
export const LOW_END_MAX_CPU_CORES = 2;
/** Below this frame rate (frames per second), the animated background is considered too heavy for the device. */
export const LOW_FRAME_RATE_THRESHOLD = 40;

export type LowEndReason = 'low-memory' | 'few-cpu-cores' | 'data-saver' | 'low-frame-rate' | 'forced';

export interface DeviceHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  saveData?: boolean;
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Reads the hardware hints exposed by the browser (missing ones stay undefined). */
export const readDeviceHints = (nav: Navigator | undefined = typeof navigator === 'undefined' ? undefined : navigator): DeviceHints => {
  if (!nav) return {};
  const { deviceMemory, hardwareConcurrency, connection } = nav as NavigatorWithHints;

  return {
    deviceMemory: typeof deviceMemory === 'number' ? deviceMemory : undefined,
    hardwareConcurrency: typeof hardwareConcurrency === 'number' && hardwareConcurrency > 0 ? hardwareConcurrency : undefined,
    saveData: connection?.saveData === true,
  };
};

/** Reasons, found in the hardware hints, to treat the device as low-end. Empty when nothing points to it. */
export const getLowEndReasons = (hints: DeviceHints): LowEndReason[] => {
  const reasons: LowEndReason[] = [];

  if (hints.deviceMemory !== undefined && hints.deviceMemory <= LOW_END_MAX_MEMORY_GB) reasons.push('low-memory');
  if (hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= LOW_END_MAX_CPU_CORES) reasons.push('few-cpu-cores');
  if (hints.saveData) reasons.push('data-saver');

  return reasons;
};

/**
 * `?performance=low` forces the low-end mode, `?performance=high` disables the detection
 * (handy to test both behaviours on any device). Returns `null` when the parameter is absent.
 */
export const readPerformanceOverride = (search: string): 'low' | 'high' | null => {
  const value = new URLSearchParams(search).get('performance');
  return value === 'low' || value === 'high' ? value : null;
};

type FrameScheduler = {
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (handle: number) => void;
  now: () => number;
};

const browserScheduler = (): FrameScheduler => ({
  requestFrame: (callback) => window.requestAnimationFrame(callback),
  cancelFrame: (handle) => window.cancelAnimationFrame(handle),
  now: () => performance.now(),
});

/**
 * Counts the frames painted during `duration` milliseconds and resolves with the average frame rate.
 * Resolves with `null` if aborted (e.g. the tab was hidden: hidden tabs are throttled, so the measure would be wrong).
 */
export const measureFrameRate = (
  duration: number,
  signal?: AbortSignal,
  scheduler: FrameScheduler = browserScheduler(),
): Promise<number | null> => new Promise((resolve) => {
  let frames = 0;
  let start: number | null = null;
  let handle = 0;

  const abort = () => {
    scheduler.cancelFrame(handle);
    resolve(null);
  };
  if (signal?.aborted) return resolve(null);
  signal?.addEventListener('abort', abort, { once: true });

  const tick = () => {
    const now = scheduler.now();
    if (start === null) {
      start = now; // the first callback only marks the start
    } else {
      frames++;
      if (now - start >= duration) {
        signal?.removeEventListener('abort', abort);
        resolve((frames * 1000) / (now - start));
        return;
      }
    }
    handle = scheduler.requestFrame(tick);
  };
  handle = scheduler.requestFrame(tick);
});
