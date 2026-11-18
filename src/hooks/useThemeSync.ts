import { useEffect, useLayoutEffect, useRef } from 'react';

import { Theme } from '../models/theme.model';
import { useThemeStore } from '../store/theme.store';
import { useActiveTheme } from './useActiveTheme';

export const APP_TITLE = 'Emoji Memory Game';
/** How often the date is checked, so the theme changes by itself when a new period starts. */
const AUTO_THEME_REFRESH_INTERVAL = 60 * 1000;
/** Must match the colour transition duration in index.css. */
const THEME_TRANSITION_DURATION = 900;

const applyThemeColors = (theme: Theme) => {
  const root = document.documentElement;

  // Overrides the Tailwind theme variables (see @theme in index.css).
  Object.entries(theme.colors).forEach(([name, hex]) => {
    root.style.setProperty(`--color-${name}`, hex);
  });
  root.dataset.theme = theme.id;
};

const applyDocumentIdentity = (theme: Theme) => {
  document.title = `${theme.icon} ${APP_TITLE}`;

  const favicon = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${theme.icon}</text></svg>`,
  )}`;
  let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = favicon;
};

/**
 * Keeps the document in sync with the active theme: colour variables, `data-theme` attribute,
 * tab title and favicon. It also re-evaluates the date-based theme every minute and whenever
 * the tab becomes visible again, so a game left open over midnight switches period by itself.
 *
 * Use it once, at the root of the application.
 */
export const useThemeSync = () => {
  const theme = useActiveTheme();
  const refreshAutoTheme = useThemeStore((state) => state.refreshAutoTheme);
  const previousThemeId = useRef<string | null>(null);

  // Layout effect: colours are applied before the first paint, so there is no flash of the default palette.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const isThemeChange = previousThemeId.current !== null && previousThemeId.current !== theme.id;
    previousThemeId.current = theme.id;

    if (!isThemeChange) {
      applyThemeColors(theme);
      return;
    }

    root.classList.add('theme-changing');
    applyThemeColors(theme);
    const timer = setTimeout(() => root.classList.remove('theme-changing'), THEME_TRANSITION_DURATION);

    return () => {
      clearTimeout(timer);
      root.classList.remove('theme-changing');
    };
  }, [theme]);

  useEffect(() => {
    applyDocumentIdentity(theme);
  }, [theme]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshAutoTheme();
    };
    const interval = setInterval(refreshAutoTheme, AUTO_THEME_REFRESH_INTERVAL);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshAutoTheme]);
};
