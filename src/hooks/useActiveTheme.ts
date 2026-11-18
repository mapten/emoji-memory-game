import { themes } from '../configuration/themes.configuration';
import { Theme } from '../models/theme.model';
import { useThemeStore } from '../store/theme.store';

/**
 * The theme currently displayed: the one picked by the player, or the one matching today's date.
 */
export const useActiveTheme = (): Theme => {
  const selection = useThemeStore((state) => state.selection);
  const autoThemeId = useThemeStore((state) => state.autoThemeId);

  return themes[selection === 'auto' ? autoThemeId : selection];
};
