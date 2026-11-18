import { ReactNode } from 'react';
import type { Decorator } from '@storybook/react-vite';

// The shared animations of the scenery (sway, drift, particles, windows...).
import '../../components/backgrounds/shared/background.css';

export type SceneFrameOptions = {
  /** SVG coordinate system. The scenery is designed for the 1600×1000 scenes. */
  viewBox?: string;
  /** Displayed size, in CSS pixels. */
  width?: number;
  height?: number;
  /** Sky behind the element. */
  background?: string;
  /**
   * Gradients and other `<defs>` the element needs (e.g. window or bulb glows). A function, because Storybook
   * deep-merges parameter objects (which would mangle React elements).
   */
  renderDefs?: () => ReactNode;
  /** Id of the SVG: lets a theme stylesheet style the element (e.g. `christmas-background`). */
  id?: string;
  /** Extra CSS for the story (colours a theme stylesheet would normally set). */
  css?: string;
};

/**
 * Draws scenery elements (which are SVG fragments) in a small SVG "scene", like the one of the backgrounds:
 * same `themed-background` class, so the same CSS animations apply.
 */
export const SceneFrame = ({ viewBox = '0 0 400 300', width = 400, height = 300, background = '#CFE8FF', renderDefs, id, css, children }: SceneFrameOptions & { children: ReactNode }) => (
  <div style={{ width, height }}>
    <svg id={id} className="themed-background" viewBox={viewBox} style={{ background, borderRadius: 12 }} aria-label="Scenery preview">
      {css && <style>{css}</style>}
      {renderDefs && <defs>{renderDefs()}</defs>}
      {children}
    </svg>
  </div>
);

/**
 * Storybook decorator rendering the story inside a SceneFrame.
 * Options come from the `sceneFrame` parameter: set it on the meta, and override it in a story if needed
 * (Storybook merges story parameters into the meta ones).
 */
export const withSceneFrame: Decorator = (Story, { parameters }) => (
  <SceneFrame {...(parameters.sceneFrame as SceneFrameOptions | undefined)}>
    <Story />
  </SceneFrame>
);
