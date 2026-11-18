import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Cloud } from '../../components/backgrounds/shared/shapes';
import { withSceneFrame } from './SceneFrame';

const meta = {
  title: 'Scenery/Cloud',
  component: Cloud,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { css: '.cloud { fill: #FFFFFF; }' } },
  args: { x: 120, y: 150, scale: 1 },
  argTypes: { scale: { control: { type: 'range', min: 0.3, max: 1.6, step: 0.1 } } },
} satisfies Meta<typeof Cloud>;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

/** In the scenes, clouds are wrapped in a `.drift` group and float slowly from side to side (sped up here). */
export const Drifting = {
  render: (args) => (
    <g className="drift" style={{ '--drift-duration': '4s' } as CSSProperties}>
      <Cloud {...args} />
    </g>
  ),
} satisfies Story;

export default meta;
