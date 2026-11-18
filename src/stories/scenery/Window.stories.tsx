import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { GlowGradient, Window } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/**
 * A window whose light is switched on and off by CSS (colours: `--window-off`, `--window-on`, `--window-frame`).
 * Its halo uses a radial gradient (see GlowGradient), referenced by `glowId`.
 */
const meta = {
  title: 'Scenery/Window',
  component: Window,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#1E2F5E', renderDefs: () => <GlowGradient id="story-window-glow" color="#FFC46B" /> } },
  args: { x: 170, y: 110, width: 60, height: 70, glowId: 'story-window-glow', cycle: 4, delay: 0, steady: false, arched: false },
  argTypes: { cycle: { control: { type: 'range', min: 2, max: 20, step: 1 } } },
  render: (args) => (
    <>
      <rect x="110" y="60" width="180" height="190" fill="#8A4A2C" />
      <Window {...args} />
    </>
  ),
} satisfies Meta<typeof Window>;

type Story = StoryObj<typeof meta>;

/** The light goes on and off smoothly, every `cycle` seconds (4 s here; 14 to 23 s in the scenes). */
export const SwitchingOnAndOff = {} satisfies Story;

/** Steady windows stay lit and only flicker softly, like a fireplace. */
export const Steady = { args: { steady: true } } satisfies Story;

export const Arched = { args: { arched: true, steady: true } } satisfies Story;

export default meta;
