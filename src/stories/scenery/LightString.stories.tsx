import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { LightString } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';
import { BULB_COLORS, christmasNight } from './christmasLights';

/** A single string of Christmas lights (a shortcut for LightStrings with one string). */
const meta = {
  title: 'Scenery/LightString',
  component: LightString,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: christmasNight },
  args: { from: [30, 100], to: [370, 110], sag: 35, count: 12, colors: BULB_COLORS, glowPrefix: 'story-glow', bulbSize: 9 },
  argTypes: {
    sag: { control: { type: 'range', min: 0, max: 80, step: 5 } },
    count: { control: { type: 'range', min: 2, max: 24, step: 1 } },
  },
} satisfies Meta<typeof LightString>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export default meta;
