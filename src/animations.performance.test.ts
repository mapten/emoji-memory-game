import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Guards the performance rules of the animations (see README "Performance").
 * - Keyframes only animate `transform` and `opacity`: the browser runs those on the compositor.
 *   Anything else (background-position, box-shadow...) makes the main thread redraw every frame,
 *   which also re-styles every animation of the background and made card flips stutter.
 * - Keyframes contain no CSS variables: `var()` inside keyframes must be re-resolved for every
 *   animated element each time the main thread draws a frame.
 */

const cssFiles = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return cssFiles(path);
  return path.endsWith('.css') ? [path] : [];
});

/** All `@keyframes name { ... }` blocks of a stylesheet. */
const keyframes = (css: string) => [...css.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g)]
  .map(([, name, body]) => ({ name, body }));

const files = cssFiles(join(process.cwd(), 'src'));
const allKeyframes = files.flatMap((file) => keyframes(readFileSync(file, 'utf8')).map((kf) => ({ ...kf, file: file.split('/src/')[1] })));

describe('animation performance rules', () => {
  it('should find the stylesheets and their keyframes', () => {
    expect(allKeyframes.length).toBeGreaterThan(40);
  });

  it.each(allKeyframes)('$name ($file) only animates transform and opacity', ({ body }) => {
    const properties = [...body.matchAll(/([\w-]+)\s*:/g)].map(([, property]) => property);
    expect(properties.filter((property) => property !== 'transform' && property !== 'opacity')).toEqual([]);
  });

  it.each(allKeyframes)('$name ($file) has no CSS variables', ({ body }) => {
    expect(body).not.toContain('var(');
  });
});
