import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Bush } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

const meta = {
  title: 'Scenery/Bush',
  component: Bush,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#FCE6C6' } },
  args: { x: 200, base: 270, size: 150, colors: ['#C8402A', '#E4572E', '#FFB27A'] },
  argTypes: { size: { control: { type: 'range', min: 40, max: 200, step: 10 } } },
} satisfies Meta<typeof Bush>;

type Story = StoryObj<typeof meta>;

/** Colours: [body, light top, highlight]. */
export const Default = {} satisfies Story;

export const Green = {
  args: { colors: ['#4E9A3E', '#6DBE5A', '#B8E59A'] },
} satisfies Story;

export default meta;
