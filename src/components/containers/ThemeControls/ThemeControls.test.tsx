import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { useThemeStore } from '../../../store/theme.store';
import { usePerformanceStore } from '../../../store/performance.store';
import { ThemeControls } from './ThemeControls';

describe('ThemeControls', () => {
  beforeEach(() => {
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'autumn' });
    usePerformanceStore.setState({ hardwareReasons: [], lowFrameRateDetectedAt: null, detectionDisabled: false });
  });

  it('should show the active theme and keep the menu closed', () => {
    render(<ThemeControls />);

    expect(screen.getByRole('button', { name: 'Change theme (current: Autumn)' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should list "Automatic" with today\'s theme, the seasons and the holidays', () => {
    render(<ThemeControls />);
    fireEvent.click(screen.getByRole('button', { name: /Change theme/ }));

    const options = screen.getAllByRole('menuitemradio');
    expect(options).toHaveLength(8);
    expect(options[0]).toHaveTextContent('Automatic');
    expect(options[0]).toHaveTextContent('Today: 🍂 Autumn');
    expect(options[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('should let the player pick a theme, and go back to automatic', () => {
    render(<ThemeControls />);
    fireEvent.click(screen.getByRole('button', { name: /Change theme/ }));

    fireEvent.click(screen.getByRole('menuitemradio', { name: /Halloween/ }));
    expect(useThemeStore.getState().selection).toBe('halloween');
    expect(screen.getByRole('menuitemradio', { name: /Halloween/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: 'Change theme (current: Halloween)' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitemradio', { name: /Automatic/ }));
    expect(useThemeStore.getState().selection).toBe('auto');
  });

  it('should close the menu with Escape or a click outside', () => {
    render(<ThemeControls />);
    const toggle = screen.getByRole('button', { name: /Change theme/ });

    fireEvent.click(toggle);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should pause and resume the background animation', () => {
    render(<ThemeControls />);

    fireEvent.click(screen.getByRole('button', { name: 'Pause background animation' }));
    expect(useThemeStore.getState().animationsPaused).toBe(true);
    expect(screen.getByRole('button', { name: 'Play background animation' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Play background animation' }));
    expect(useThemeStore.getState().animationsPaused).toBe(false);
  });

  it('should explain that the background is static on a low-end device, and still let the player play it', () => {
    usePerformanceStore.setState({ hardwareReasons: ['few-cpu-cores'] });
    render(<ThemeControls />);

    const play = screen.getByRole('button', { name: 'Play background animation' });
    expect(play).toHaveAttribute('title', 'Play background animation (paused to keep the game smooth on this device)');

    fireEvent.click(play);
    expect(useThemeStore.getState().animationsPaused).toBe(false);
    expect(screen.getByRole('button', { name: 'Pause background animation' })).toBeInTheDocument();
  });
});
