import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { useThemeStore } from '../../../store/theme.store';
import { usePerformanceStore } from '../../../store/performance.store';
import { ThemedBackground } from './ThemedBackground';

/**
 * jsdom has no AnimationEvent, so React listens to the prefixed `webkitAnimationEnd` there
 * (browsers use `animationend`): fire both.
 */
const endAnimation = (element: Element) => {
  fireEvent.animationEnd(element);
  fireEvent(element, new Event('webkitAnimationEnd', { bubbles: true }));
};

describe('ThemedBackground', () => {
  beforeEach(() => {
    useThemeStore.setState({ selection: 'auto', animationsPaused: null, autoThemeId: 'winter' });
    usePerformanceStore.setState({ hardwareReasons: [], lowFrameRateDetectedAt: null, detectionDisabled: false });
  });

  it('should display the background of the active theme', () => {
    render(<ThemedBackground />);

    expect(screen.getByTestId('background-winter')).toBeInTheDocument();
    expect(document.getElementById('winter-background')).toBeInTheDocument();
  });

  it('should cross-fade to the new background when the theme changes', () => {
    render(<ThemedBackground />);

    act(() => useThemeStore.getState().setSelection('halloween'));

    // Both scenes are displayed during the fade, the new one on top.
    expect(screen.getByTestId('background-winter')).toBeInTheDocument();
    expect(screen.getByTestId('background-halloween')).toHaveClass('is-entering');

    endAnimation(screen.getByTestId('background-halloween'));

    expect(screen.queryByTestId('background-winter')).not.toBeInTheDocument();
    expect(screen.getByTestId('background-halloween')).toBeInTheDocument();
  });

  it('should ignore the end of the animations inside the scene', () => {
    render(<ThemedBackground />);
    act(() => useThemeStore.getState().setSelection('spring'));

    endAnimation(document.querySelector('#spring-background .sun-glow') as Element);

    expect(screen.getByTestId('background-winter')).toBeInTheDocument();
  });

  it('should pause the animations when the player asks for it', () => {
    render(<ThemedBackground />);
    expect(screen.getByTestId('background-winter')).not.toHaveClass('is-paused');

    act(() => useThemeStore.getState().setAnimationsPaused(true));

    expect(screen.getByTestId('background-winter')).toHaveClass('is-paused');
  });

  it('should keep a static background on a low-end device', () => {
    usePerformanceStore.setState({ hardwareReasons: ['low-memory'] });
    render(<ThemedBackground />);

    expect(screen.getByTestId('background-winter')).toHaveClass('is-paused');
    expect(document.getElementById('winter-background')).toBeInTheDocument();
    expect(screen.getByTestId('themed-background')).toHaveAttribute('data-static', 'true');
  });

  it('should switch backgrounds instantly, without cross-fade, on a low-end device', () => {
    usePerformanceStore.setState({ hardwareReasons: ['low-memory'] });
    render(<ThemedBackground />);

    act(() => useThemeStore.getState().setSelection('halloween'));

    expect(screen.queryByTestId('background-winter')).not.toBeInTheDocument();
    expect(screen.getByTestId('background-halloween')).not.toHaveClass('is-entering');
  });
});
