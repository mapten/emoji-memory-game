import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeId } from '../../models/theme.model';
import { backgrounds } from '../../components/backgrounds';

type Props = { theme: ThemeId; paused: boolean };

/** Displays one background scene on its own, full screen. */
const BackgroundPreview = ({ theme, paused }: Props) => {
  const Background = backgrounds[theme];

  return (
    <div className={`fixed inset-0${paused ? ' is-paused' : ''}`}>
      <Background />
    </div>
  );
};

const meta = {
  title: 'Themes/Backgrounds',
  component: BackgroundPreview,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    theme: { control: 'select', options: Object.keys(backgrounds) },
    paused: { control: 'boolean' },
  },
  args: { paused: false },
} satisfies Meta<typeof BackgroundPreview>;

type Story = StoryObj<typeof meta>;

export const Spring = { args: { theme: 'spring' } } satisfies Story;
export const Summer = { args: { theme: 'summer' } } satisfies Story;
export const Autumn = { args: { theme: 'autumn' } } satisfies Story;
export const Winter = { args: { theme: 'winter' } } satisfies Story;
export const Christmas = { args: { theme: 'christmas' } } satisfies Story;
export const Halloween = { args: { theme: 'halloween' } } satisfies Story;
export const Easter = { args: { theme: 'easter' } } satisfies Story;

export default meta;
