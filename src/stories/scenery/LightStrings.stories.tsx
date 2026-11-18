import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { LightStrings } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';
import { BULB_COLORS, christmasNight } from './christmasLights';

/**
 * Several strings of Christmas lights. Bulbs are grouped in chase phases (`--phase`): each phase blinks a
 * little after the previous one, so the light seems to run along the wires. Colours and timing come from
 * ChristmasBackground.css (`--bulb-red`, `--light-cycle`, `--light-chase-step`...).
 */
const meta = {
  title: 'Scenery/LightStrings',
  component: LightStrings,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: christmasNight },
  args: {
    strings: [
      { from: [20, 80], to: [200, 70], sag: 20, count: 9 },
      { from: [200, 70], to: [380, 90], sag: 20, count: 9, startIndex: 9 },
      { from: [40, 200], to: [360, 190], sag: 30, count: 14, startIndex: 2 },
    ],
    colors: BULB_COLORS,
    glowPrefix: 'story-glow',
    phases: 4,
  },
  argTypes: { phases: { control: { type: 'range', min: 1, max: 6, step: 1 } } },
} satisfies Meta<typeof LightStrings>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export default meta;
