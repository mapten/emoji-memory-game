import { useEffect, useRef } from 'react';

import { ThemeId } from '../models/theme.model';
import { usePerformanceStore } from '../store/performance.store';
import { measureFrameRate } from '../utils/device.utils';
import { useActiveTheme } from './useActiveTheme';
import { useAnimationsPaused } from './useAnimationsPaused';
import { useLowEndDevice } from './useLowEndDevice';

/** Time left to the page/scene to settle (first paint, background cross-fade) before measuring. */
export const FRAME_RATE_WARM_UP = 1500;
/** Length of the frame rate measure. */
export const FRAME_RATE_MEASURE_DURATION = 3000;

/**
 * Watches how the device copes with the animated backgrounds.
 *
 * While a scene is animated, the frame rate is measured once per theme and per visit (scenes do not
 * all cost the same). If it is too low, the device is flagged as low-end: the background then stays
 * displayed but becomes static, and the following visits start static right away.
 * It also exposes the result as `<html data-performance="low|normal">` for stylesheets.
 *
 * Use it once, at the root of the application.
 */
export const usePerformanceMonitor = () => {
  const theme = useActiveTheme();
  const paused = useAnimationsPaused();
  const { isLowEnd } = useLowEndDevice();
  const detectionDisabled = usePerformanceStore((state) => state.detectionDisabled);
  const reportFrameRate = usePerformanceStore((state) => state.reportFrameRate);
  const measuredThemes = useRef(new Set<ThemeId>());

  useEffect(() => {
    document.documentElement.dataset.performance = isLowEnd ? 'low' : 'normal';
  }, [isLowEnd]);

  useEffect(() => {
    // Nothing to measure when the scene is static, or when the answer is already known.
    if (paused || isLowEnd || detectionDisabled || measuredThemes.current.has(theme.id)) return;

    const themeId = theme.id;
    let controller: AbortController | null = null;
    let warmUpTimer: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      clearTimeout(warmUpTimer);
      controller?.abort();
      controller = null;
    };

    const start = () => {
      stop();
      // Hidden tabs are throttled by the browser: the measure would be meaningless.
      if (document.visibilityState === 'hidden') return;

      const current = new AbortController();
      controller = current;
      warmUpTimer = setTimeout(() => {
        measureFrameRate(FRAME_RATE_MEASURE_DURATION, current.signal).then((framesPerSecond) => {
          if (framesPerSecond === null || current.signal.aborted) return;
          measuredThemes.current.add(themeId);
          reportFrameRate(framesPerSecond);
        });
      }, FRAME_RATE_WARM_UP);
    };

    const handleVisibilityChange = () => (document.visibilityState === 'hidden' ? stop() : start());

    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme.id, paused, isLowEnd, detectionDisabled, reportFrameRate]);
};
