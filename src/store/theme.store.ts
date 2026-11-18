import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Models
import { ThemeId, ThemeSelection } from '../models/theme.model';
// Configuration
import { isThemeId } from '../configuration/themes.configuration';
// Utils
import { parseLocalDate } from '../utils/date.utils';
import { detectHemisphere, getThemeForDate, readThemeUrlParams } from '../utils/theme.utils';

const urlParams = typeof window === 'undefined' ? null : readThemeUrlParams(window.location.search);

/**
 * Theme that matches today's date (and the player's hemisphere).
 * `?date=` and `?hemisphere=` URL parameters can override the date and the hemisphere.
 */
export const computeAutoThemeId = (now: Date = new Date()): ThemeId => {
  const date = parseLocalDate(urlParams?.date) ?? now;
  const hemisphere = urlParams?.hemisphere ?? detectHemisphere();

  return getThemeForDate(date, hemisphere);
};

const initialSelectionFromUrl = (): ThemeSelection | null => {
  const theme = urlParams?.theme;
  if (theme === 'auto' || isThemeId(theme)) return theme;
  return null;
};

export interface ThemeState {
  /** Theme chosen by the player, or `auto` to follow the calendar. Persisted. */
  selection: ThemeSelection;
  /** `true`/`false` when the player paused/resumed the animations, `null` to follow the OS "reduce motion" setting. Persisted. */
  animationsPaused: boolean | null;
  /** Theme matching the current date. Not persisted: it is recomputed on every visit. */
  autoThemeId: ThemeId;
  setSelection: (selection: ThemeSelection) => void;
  setAnimationsPaused: (paused: boolean) => void;
  refreshAutoTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selection: 'auto',
      animationsPaused: null,
      autoThemeId: computeAutoThemeId(),
      setSelection: (selection) => set({ selection }),
      setAnimationsPaused: (animationsPaused) => set({ animationsPaused }),
      refreshAutoTheme: () => set((state) => {
        const autoThemeId = computeAutoThemeId();
        return autoThemeId === state.autoThemeId ? state : { autoThemeId };
      }),
    }),
    {
      name: 'emoji-memory-game:theme',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ selection, animationsPaused }) => ({ selection, animationsPaused }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<ThemeState>;
        const savedSelection = saved.selection === 'auto' || isThemeId(saved.selection) ? saved.selection : current.selection;

        return {
          ...current,
          // A theme given in the URL wins over the saved one (and is then saved).
          selection: initialSelectionFromUrl() ?? savedSelection,
          animationsPaused: typeof saved.animationsPaused === 'boolean' ? saved.animationsPaused : null,
        };
      },
    },
  ),
);
