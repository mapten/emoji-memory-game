import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { RoundTree } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

const meta = {
  title: 'Scenery/RoundTree',
  component: RoundTree,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#FCE6C6' } },
  args: { x: 200, base: 285, height: 240, colors: ['#E4572E', '#F0743F', '#FFB27A'], trunk: '#6E3B26' },
  argTypes: { height: { control: { type: 'range', min: 60, max: 280, step: 10 } } },
} satisfies Meta<typeof RoundTree>;

type Story = StoryObj<typeof meta>;

/** Colours: [body, light side, highlight]. */
export const Autumn = {} satisfies Story;

export const CherryBlossom = {
  args: { colors: ['#F49AC1', '#F9BBD5', '#FFE3EE'], trunk: '#8A6A4A' },
  parameters: { sceneFrame: { background: '#C3EBFC' } },
} satisfies Story;

export const Summer = {
  args: { colors: ['#5AAE57', '#7AC46A', '#A8DB8C'], trunk: '#8A6A4A' },
} satisfies Story;

export default meta;
