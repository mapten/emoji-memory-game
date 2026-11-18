import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { themeOrder } from '../../configuration/themes.configuration';
import { backgrounds } from '.';

describe('backgrounds', () => {
  it.each(themeOrder)('%s: should render a decorative, CSS-styleable SVG scene', (themeId) => {
    const Background = backgrounds[themeId];
    const { container } = render(<Background />);

    const svg = container.querySelector('svg');
    expect(svg?.id).toBe(`${themeId}-background`);
    expect(svg).toHaveProperty('classList');
    expect(svg?.classList.contains('themed-background')).toBe(true);
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    // Sections are identifiable from CSS, and prefixed with the theme id.
    expect(container.querySelector(`#${themeId}-sky`)).not.toBeNull();
    container.querySelectorAll('[id]').forEach((element) => expect(element.id.startsWith(`${themeId}-`)).toBe(true));
  });

  it.each(themeOrder)('%s: should not repeat ids', (themeId) => {
    const Background = backgrounds[themeId];
    const { container } = render(<Background />);

    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should keep every id unique when two scenes are displayed together (cross-fade)', () => {
    const { container } = render(<>{themeOrder.map((themeId) => { const Background = backgrounds[themeId]; return <Background key={themeId} />; })}</>);

    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(themeOrder)('%s: should animate something', (themeId) => {
    const Background = backgrounds[themeId];
    const { container } = render(<Background />);

    expect(container.querySelectorAll('.particle, .twinkle, .flyer, .window, .sway, .drift').length).toBeGreaterThan(0);
  });
});
