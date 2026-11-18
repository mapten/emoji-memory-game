import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { RoundTree, Sway } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

const tree = <RoundTree x={200} base={285} height={240} colors={['#F49AC1', '#F9BBD5', '#FFE3EE']} trunk="#8A6A4A" />;

/**
 * Gives its children a gentle wind sway around `origin` (e.g. the base of a trunk).
 * `angle` is rounded to one of the variants: gentle (1°), medium (3.5°) or strong (8°).
 */
const meta = {
  title: 'Scenery/Sway',
  component: Sway,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#C3EBFC' } },
  args: { origin: [200, 285], duration: 2, angle: 3.5, children: tree },
  argTypes: {
    angle: { control: 'select', options: [1, 3.5, 8] },
    duration: { control: { type: 'range', min: 0.5, max: 8, step: 0.5 } },
    children: { control: false },
  },
} satisfies Meta<typeof Sway>;

type Story = StoryObj<typeof meta>;

export const Medium = {} satisfies Story;

export const Gentle = { args: { angle: 1 } } satisfies Story;

export const Strong = { args: { angle: 8 } } satisfies Story;

export default meta;
