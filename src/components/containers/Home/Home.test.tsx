import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useThemeStore } from '../../../store/theme.store';
import { Home } from './Home';

const renderUI = () => render(<MemoryRouter><Home /></MemoryRouter>);

describe('Home', () => {
  beforeEach(() => {
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'summer' });
  });

  it('should not display the edition stamp during a regular season', () => {
    renderUI();

    expect(screen.queryByTestId('edition-stamp')).not.toBeInTheDocument();
  });

  it.each([
    ['christmas', '🎄', 'Christmas Edition'],
    ['halloween', '🎃', 'Halloween Edition'],
    ['easter', '🐣', 'Easter Edition'],
  ] as const)('should display the %s stamp with its emoji', (themeId, icon, text) => {
    renderUI();

    act(() => useThemeStore.getState().setSelection(themeId));

    expect(screen.getByTestId('edition-stamp')).toHaveTextContent(`${icon}${text}`);
  });
});
