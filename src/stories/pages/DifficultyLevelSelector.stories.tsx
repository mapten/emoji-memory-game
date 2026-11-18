import type { Meta } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

// Components
import { DifficultyLevelSelector } from '../../components/containers/DifficultyLevelSelector/DifficultyLevelSelector';

const meta = {
  title: 'Pages/DifficultyLevelSelector',
  component: DifficultyLevelSelector,
  parameters: { layout: 'fullscreen', themedBackground: true },
  decorators: [(story) => <MemoryRouter initialEntries={['test?difficulty=easy']}>{story()}</MemoryRouter>],
} satisfies Meta<typeof DifficultyLevelSelector>;

export const Default = {};

export default meta;