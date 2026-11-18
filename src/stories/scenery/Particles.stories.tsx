import { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Components
import { Particles } from '../../components/backgrounds/shared/Particles';
import { Leaf } from '../../components/backgrounds/AutumnBackground/leaves';
import { Random } from '../../components/backgrounds/shared/random';
import { withSceneFrame } from './SceneFrame';

type ParticleRenderer = (random: Random, index: number) => ReactNode;

const renderSnowflake: ParticleRenderer = () => <circle r="6" fill="#FFFFFF" />;
const renderLeaf: ParticleRenderer = (random) => (
  <Leaf kind={random.pick(['maple', 'oak', 'oval'] as const)} color={random.pick(['#E4572E', '#F29E4C', '#F1C453', '#C8402A'])} />
);
const renderEmber: ParticleRenderer = () => <circle r="5" fill="#FFB347" />;

/**
 * Falling (or rising) particles, drawn in the 1600×1000 coordinate system of the scenes.
 * One CSS animation per particle: it crosses the scene while swaying (and, with `tumble`, spinning and turning over).
 */
const meta = {
  title: 'Scenery/Particles',
  component: Particles,
  decorators: [withSceneFrame],
  parameters: { sceneFrame: { viewBox: '0 0 1600 1000', width: 640, height: 400, background: '#B9B3E8' } },
  args: { id: 'story-snow', count: 60, seed: 1, renderParticle: renderSnowflake, scale: [0.6, 1.2], duration: [8, 14], sway: [15, 50] },
  argTypes: {
    renderParticle: { control: false },
    count: { control: { type: 'range', min: 5, max: 120, step: 5 } },
    direction: { control: 'inline-radio', options: ['fall', 'rise'] },
  },
} satisfies Meta<typeof Particles>;

type Story = StoryObj<typeof meta>;

export const Snow = {} satisfies Story;

/** `tumble`: leaves and petals spin and turn over while they fall. */
export const Leaves = {
  args: { id: 'story-leaves', count: 30, renderParticle: renderLeaf, scale: [0.3, 0.5], duration: [9, 16], sway: [30, 90], tumble: true },
  parameters: { sceneFrame: { viewBox: '0 0 1600 1000', width: 640, height: 400, background: '#F9CFA1' } },
} satisfies Story;

/** `direction: 'rise'`: embers, bubbles... go up. */
export const Embers = {
  args: { id: 'story-embers', count: 30, renderParticle: renderEmber, direction: 'rise', duration: [8, 14], sway: [20, 60] },
  parameters: { sceneFrame: { viewBox: '0 0 1600 1000', width: 640, height: 400, background: '#2B1644' } },
} satisfies Story;

export default meta;
