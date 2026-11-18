import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Configuration
import { themeOrder, themes } from '../../configuration/themes.configuration';
// Store
import { useThemeStore } from '../../store/theme.store';
// Components
import { ThemedBackground } from '../../components/containers/ThemedBackground/ThemedBackground';

/** Pauses the animations while the story is displayed (like the pause button or a low-end device). */
const PausedBackground = () => {
  useEffect(() => {
    useThemeStore.getState().setAnimationsPaused(true);
    return () => useThemeStore.getState().setAnimationsPaused(false);
  }, []);
  return <ThemedBackground />;
};

/** Buttons to change the theme, to see the new background cross-fade over the previous one. */
const ThemeSwitcher = () => {
  const selection = useThemeStore((state) => state.selection);
  return (
    <>
      <ThemedBackground />
      <div className="relative flex flex-wrap gap-2 p-4">
        {themeOrder.map((id) => (
          <button
            key={id}
            onClick={() => useThemeStore.getState().setSelection(id)}
            className={'rounded-lg px-3 py-2 bg-white/90 shadow-md ' + (selection === id ? 'outline-4 outline-primary' : '')}
          >
            {themes[id].icon} {themes[id].name}
          </button>
        ))}
      </div>
    </>
  );
};

/**
 * Full-screen background of the active theme (use the "Theme" menu of the toolbar).
 * When the theme changes, the new scene cross-fades over the previous one.
 */
const meta = {
  title: 'Themes/ThemedBackground',
  component: ThemedBackground,
  parameters: { layout: 'fullscreen' },
  decorators: [(story) => <div className="h-screen">{story()}</div>],
} satisfies Meta<typeof ThemedBackground>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

/** Static background: what low-end devices and players who paused the animation see. */
export const Paused = { render: () => <PausedBackground /> } satisfies Story;

export const CrossFade = { render: () => <ThemeSwitcher /> } satisfies Story;

export default meta;
