import { AnimationEvent, useState } from 'react';

// Models
import { ThemeId } from '../../../models/theme.model';
// Hooks
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { useAnimationsPaused } from '../../../hooks/useAnimationsPaused';
import { useLowEndDevice } from '../../../hooks/useLowEndDevice';
// Components
import { backgrounds } from '../../backgrounds';
// Styles
import './ThemedBackground.css';

type Layer = { themeId: ThemeId; entering: boolean };

/**
 * Full-screen background of the active theme, fixed behind the application.
 * When the theme changes, the new scene cross-fades over the previous one,
 * which is removed once the fade has finished.
 *
 * On low-end devices the scene is static (its animations are paused, see useAnimationPauseReason)
 * and a new theme replaces the previous one instantly, without cross-fade.
 */
export const ThemedBackground = () => {
  const theme = useActiveTheme();
  const paused = useAnimationsPaused();
  const { isLowEnd } = useLowEndDevice();
  const [layers, setLayers] = useState<Layer[]>([{ themeId: theme.id, entering: false }]);

  // Derive the layers from the theme during render (no effect needed): add the new theme on top.
  if (layers[layers.length - 1].themeId !== theme.id) {
    setLayers(isLowEnd
      ? [{ themeId: theme.id, entering: false }]
      : [...layers.filter((layer) => layer.themeId !== theme.id), { themeId: theme.id, entering: true }]);
  }

  const handleFadeInEnd = (event: AnimationEvent<HTMLDivElement>, themeId: ThemeId) => {
    if (event.target !== event.currentTarget) return; // ignore the animations inside the SVG
    // The scene is now fully visible: drop the ones below it (but keep any newer one fading in above).
    setLayers((current) => current.slice(Math.max(0, current.findIndex((layer) => layer.themeId === themeId))));
  };

  return (
    <div data-testid="themed-background" data-theme={theme.id} data-static={paused} className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {layers.map(({ themeId, entering }) => {
        const Background = backgrounds[themeId];
        return (
          <div
            key={themeId}
            data-testid={`background-${themeId}`}
            className={`themed-background-layer${entering ? ' is-entering' : ''}${paused ? ' is-paused' : ''}`}
            onAnimationEnd={entering ? (event) => handleFadeInEnd(event, themeId) : undefined}
          >
            <Background />
          </div>
        );
      })}
    </div>
  );
};
