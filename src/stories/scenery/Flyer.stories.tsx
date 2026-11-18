import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Bird, Butterfly, Flyer } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/**
 * Moves its children across the whole scene (1600×1000 coordinates), floating up and down.
 * `rise` is rounded to a variant: level, climbing (< -20) or descending (> 20); `bobDistance` to small,
 * medium or large.
 */
const meta = {
  title: 'Scenery/Flyer',
  component: Flyer,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { viewBox: '0 0 1600 1000', width: 640, height: 400, background: '#92D8F4' } },
  args: { y: 450, duration: 6, rise: 0, reverse: false, bobDistance: 16, bobDuration: 1.6, children: <Bird size={3} color="#FFFFFF" /> },
  argTypes: {
    children: { control: false },
    rise: { control: 'select', options: [-80, 0, 80] },
    bobDistance: { control: 'select', options: [8, 16, 30] },
    duration: { control: { type: 'range', min: 2, max: 30, step: 1 } },
  },
} satisfies Meta<typeof Flyer>;

type Story = StoryObj<typeof meta>;

export const Seagull = {} satisfies Story;

export const ClimbingRightToLeft = {
  args: { reverse: true, rise: -80, children: <Bird size={3} color="#4A5A7A" /> },
} satisfies Story;

export const ButterflyFlight = {
  args: { duration: 9, bobDistance: 30, bobDuration: 2.2, children: <g transform="scale(3)"><Butterfly colors={['#FFB627', '#FF7F51']} /></g> },
  parameters: { sceneFrame: { viewBox: '0 0 1600 1000', width: 640, height: 400, background: '#B9E39D' } },
} satisfies Story;

export default meta;
