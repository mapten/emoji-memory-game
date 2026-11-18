import { useThemeStore } from '../store/theme.store';
import { useLowEndDevice } from './useLowEndDevice';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type AnimationPauseReason = 'player' | 'reduced-motion' | 'low-end-device';

/**
 * Why the background animations are paused, or `null` when they play.
 * The player's own choice (pause/play button) always wins; otherwise animations are paused
 * when the operating system asks for reduced motion, or when the device is low-end
 * (the background then stays displayed, but static).
 */
export const useAnimationPauseReason = (): AnimationPauseReason | null => {
  const playerChoice = useThemeStore((state) => state.animationsPaused);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isLowEnd } = useLowEndDevice();

  if (playerChoice !== null) return playerChoice ? 'player' : null;
  if (prefersReducedMotion) return 'reduced-motion';
  if (isLowEnd) return 'low-end-device';
  return null;
};

/** Whether the background animations are paused (see `useAnimationPauseReason`). */
export const useAnimationsPaused = (): boolean => useAnimationPauseReason() !== null;
