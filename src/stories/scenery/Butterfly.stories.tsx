import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Butterfly } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/** A butterfly with fluttering wings. Colours: [upper wings, lower wings]. */
const meta = {
  title: 'Scenery/Butterfly',
  component: Butterfly,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { viewBox: '-40 -35 80 70', width: 300, height: 260, background: '#B9E39D' } },
  args: { colors: ['#FFB627', '#FF7F51'], flapDuration: 0.22 },
  argTypes: { flapDuration: { control: { type: 'range', min: 0.1, max: 1, step: 0.02 } } },
} satisfies Meta<typeof Butterfly>;

type Story = StoryObj<typeof meta>;

export const Monarch = {} satisfies Story;

export const Blue = { args: { colors: ['#7FB7E0', '#B388EB'] } } satisfies Story;

export default meta;
