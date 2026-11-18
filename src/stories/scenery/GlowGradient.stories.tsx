import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { GlowGradient } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/** Radial gradient (to put in `<defs>`) used for the halos of windows, lamps and Christmas bulbs. */
const meta = {
  title: 'Scenery/GlowGradient',
  component: GlowGradient,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#1E2F5E' } },
  args: { id: 'story-glow', color: '#FFD27A' },
  argTypes: { color: { control: 'color' } },
  render: (args) => (
    <>
      <defs>
        <GlowGradient {...args} />
      </defs>
      <circle cx="200" cy="150" r="130" fill={`url(#${args.id})`} />
    </>
  ),
} satisfies Meta<typeof GlowGradient>;

type Story = StoryObj<typeof meta>;

export const Warm = {} satisfies Story;

export const Cold = { args: { color: '#5BC0EB' } } satisfies Story;

export default meta;
