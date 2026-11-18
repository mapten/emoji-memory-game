import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Leaf } from '../../components/backgrounds/AutumnBackground/leaves';
import { withSceneFrame } from './SceneFrame';

/** An autumn leaf (about 100 units tall, centred on 0,0): fallen on the ground or falling as a particle. */
const meta = {
  title: 'Scenery/Leaf',
  component: Leaf,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { viewBox: '-70 -65 140 130', width: 220, height: 200, background: '#FCE6C6' } },
  args: { kind: 'maple', color: '#E4572E' },
  argTypes: {
    kind: { control: 'inline-radio', options: ['maple', 'oak', 'oval'] },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Leaf>;

type Story = StoryObj<typeof meta>;

export const Maple = {} satisfies Story;

export const Oak = { args: { kind: 'oak', color: '#A44A3F' } } satisfies Story;

export const Oval = { args: { kind: 'oval', color: '#F1C453' } } satisfies Story;

export default meta;
