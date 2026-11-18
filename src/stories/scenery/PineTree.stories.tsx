import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { PineTree } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

const meta = {
  title: 'Scenery/PineTree',
  component: PineTree,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#E6E9FF' } },
  args: { x: 200, base: 290, height: 260, color: '#2B6E4F', shade: '#3E8E66' },
  argTypes: { height: { control: { type: 'range', min: 60, max: 280, step: 10 } } },
} satisfies Meta<typeof PineTree>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

/** With `snow`, each tier gets a snow cap (winter and Christmas scenes). */
export const Snowy = {
  args: { color: '#5C6FA8', shade: '#7F90C4', snow: '#FFFFFF', trunk: '#4B4A6E' },
} satisfies Story;

export default meta;
