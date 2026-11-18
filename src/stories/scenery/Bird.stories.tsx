import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Bird } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/** A bird or a seagull: two wings flapping (`.flap`). Use it inside a Flyer to make it cross the scene. */
const meta = {
  title: 'Scenery/Bird',
  component: Bird,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { viewBox: '-60 -40 120 80', width: 300, height: 200, background: '#92D8F4' } },
  args: { size: 2, color: '#4A5A7A', flapDuration: 0.4 },
  argTypes: {
    color: { control: 'color' },
    size: { control: { type: 'range', min: 0.5, max: 2.5, step: 0.1 } },
    flapDuration: { control: { type: 'range', min: 0.1, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof Bird>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Seagull = { args: { color: '#FFFFFF' } } satisfies Story;

export default meta;
