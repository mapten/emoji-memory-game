import type { Meta } from '@storybook/react-vite';

import { ThemeControls } from '../../components/containers/ThemeControls/ThemeControls';

const meta = {
  title: 'Themes/ThemeControls',
  component: ThemeControls,
  parameters: { layout: 'fullscreen', themedBackground: true },
  decorators: [(story) => <div className="h-screen">{story()}</div>],
} satisfies Meta<typeof ThemeControls>;

export const Default = {};

export default meta;
