import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Utils
import {
  getLowEndReasons, LOW_FRAME_RATE_THRESHOLD, LowEndReason, readDeviceHints, readPerformanceOverride,
} from '../utils/device.utils';

/** How long a low frame rate measure is remembered: the next visits start with a static background right away. */
export const LOW_FRAME_RATE_MEMORY = 7 * 24 * 60 * 60 * 1000;

const override = typeof window === 'undefined' ? null : readPerformanceOverride(window.location.search);

const detectHardwareReasons = (): LowEndReason[] => {
  if (override === 'low') return ['forced'];
  if (override === 'high') return [];
  return getLowEndReasons(readDeviceHints());
};

export interface PerformanceState {
  /** Low-end signals found in the hardware hints. Not persisted: read again on every visit. */
  hardwareReasons: LowEndReason[];
  /** When a too-low frame rate was last measured (ms timestamp), or `null`. Persisted. */
  lowFrameRateDetectedAt: number | null;
  /** `true` when `?performance=high` disables the detection. */
  detectionDisabled: boolean;
  /** Stores the result of a frame rate measure. */
  reportFrameRate: (framesPerSecond: number) => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set) => ({
      hardwareReasons: detectHardwareReasons(),
      lowFrameRateDetectedAt: null,
      detectionDisabled: override === 'high',
      reportFrameRate: (framesPerSecond) => {
        if (framesPerSecond < LOW_FRAME_RATE_THRESHOLD) set({ lowFrameRateDetectedAt: Date.now() });
      },
    }),
    {
      name: 'emoji-memory-game:performance',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ lowFrameRateDetectedAt }) => ({ lowFrameRateDetectedAt }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PerformanceState>;
        return {
          ...current,
          lowFrameRateDetectedAt: typeof saved.lowFrameRateDetectedAt === 'number' ? saved.lowFrameRateDetectedAt : null,
        };
      },
    },
  ),
);

/** All the reasons to treat this device as low-end (empty array: the device can run the animations). */
export const selectLowEndReasons = (state: PerformanceState, now: number = Date.now()): LowEndReason[] => {
  if (state.detectionDisabled) return [];

  const lowFrameRate = state.lowFrameRateDetectedAt !== null && now - state.lowFrameRateDetectedAt < LOW_FRAME_RATE_MEMORY;
  return lowFrameRate ? [...state.hardwareReasons, 'low-frame-rate'] : state.hardwareReasons;
};
