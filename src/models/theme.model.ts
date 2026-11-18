export type SeasonThemeId = 'spring' | 'summer' | 'autumn' | 'winter';
export type HolidayThemeId = 'christmas' | 'halloween' | 'easter';
export type ThemeId = SeasonThemeId | HolidayThemeId;

/** What the user picked in the theme selector: a specific theme, or "follow the calendar". */
export type ThemeSelection = ThemeId | 'auto';

export type Hemisphere = 'north' | 'south';

/**
 * Application colours of a theme, as hex strings.
 * They replace the Tailwind theme variables (`--color-primary`...), so `text-primary`, `bg-tertiary`... follow the active theme.
 */
export interface ThemeColors {
  /** Titles, labels, card-back border, modal border. */
  primary: string;
  /** "Restart" button. */
  secondary: string;
  /** Card back, "Solution" button, modal close button. */
  tertiary: string;
  /** Main buttons, level selector, counter values. */
  quaternary: string;
  /** Accent colour. */
  quinary: string;
  /** Ink colour of the "Edition" stamp (holidays only). */
  stamp: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  /** Seasons are the default themes; holidays override them and show the "Edition" stamp. */
  kind: 'season' | 'holiday';
  /** Emoji that represents the theme (selector, stamp, tab title and favicon). */
  icon: string;
  /** Emojis the cards are drawn from. Needs at least as many entries as the biggest level has pairs. */
  emojis: string[];
  colors: ThemeColors;
}
