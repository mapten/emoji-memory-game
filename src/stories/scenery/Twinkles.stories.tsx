import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Twinkles } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

/** Stars or glints that fade in and out, by groups (one animation per group, each with its own rhythm). */
const meta = {
  title: 'Scenery/Twinkles',
  component: Twinkles,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { background: '#0B1635', css: '.twinkles { fill: #FFFFFF; }' } },
  args: { id: 'story-stars', count: 70, seed: 3, area: { x: [0, 400], y: [0, 300] }, size: [1, 3], shape: 'dot', groups: 6 },
  argTypes: {
    shape: { control: 'inline-radio', options: ['dot', 'sparkle'] },
    count: { control: { type: 'range', min: 5, max: 150, step: 5 } },
    groups: { control: { type: 'range', min: 1, max: 10, step: 1 } },
  },
} satisfies Meta<typeof Twinkles>;

type Story = StoryObj<typeof meta>;

/** Distant stars. */
export const Stars = {} satisfies Story;

/** Four-pointed glints (snow, sea, ground). */
export const Sparkles = {
  args: { shape: 'sparkle', count: 20, size: [5, 10] },
  parameters: { sceneFrame: { background: '#1479B8', css: '.twinkles { fill: #FFFFFF; }' } },
} satisfies Story;

export default meta;
