import { describe, it, expect, vi } from 'vitest';
import { ignoreAnimationIterationListeners } from './dom.utils';

describe('ignoreAnimationIterationListeners', () => {
  it('should ignore animationiteration listeners and keep the others', () => {
    const container = document.createElement('div');
    ignoreAnimationIterationListeners(container);
    const iteration = vi.fn();
    const click = vi.fn();
    const end = vi.fn();

    container.addEventListener('animationiteration', iteration);
    container.addEventListener('click', click);
    container.addEventListener('animationend', end, { capture: true });
    container.dispatchEvent(new Event('animationiteration'));
    container.dispatchEvent(new Event('click'));
    container.dispatchEvent(new Event('animationend'));

    expect(iteration).not.toHaveBeenCalled();
    expect(click).toHaveBeenCalledTimes(1);
    expect(end).toHaveBeenCalledTimes(1);
  });
});
