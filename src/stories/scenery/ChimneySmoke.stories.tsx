import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { ChimneySmoke } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/** Puffs of smoke rising from a chimney: they grow and fade away while drifting to the right. */
const meta = {
  title: 'Scenery/ChimneySmoke',
  component: ChimneySmoke,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#F9CFA1' } },
  args: { id: 'story-smoke', x: 200, y: 176, puffs: 5, duration: 5, color: '#FFFFFF' },
  argTypes: {
    puffs: { control: { type: 'range', min: 1, max: 10, step: 1 } },
    duration: { control: { type: 'range', min: 2, max: 12, step: 1 } },
    color: { control: 'color' },
  },
  render: (args) => (
    <>
      <ChimneySmoke {...args} />
      <rect x="184" y="180" width="32" height="120" fill="#7A3A26" />
      <rect x="178" y="172" width="44" height="14" rx="3" fill="#5A2A1A" />
    </>
  ),
} satisfies Meta<typeof ChimneySmoke>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export default meta;
