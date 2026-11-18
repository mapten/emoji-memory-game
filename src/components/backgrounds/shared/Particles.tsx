import { CSSProperties, ReactNode, useMemo } from 'react';
import { createRandom, r1, Random } from './random';

type Range = [number, number];

/** Sway amplitudes of the motion variants defined in background.css (float-1..3 and tumble-1..3). */
const FLOAT_SWAYS = [15, 30, 50];
const TUMBLE_SWAYS = [40, 65, 90];

/** Index (1-based) of the variant whose sway is the closest to the wanted one. */
const closestVariant = (sways: number[], wanted: number) =>
  sways.reduce((best, sway, index) => (Math.abs(sway - wanted) < Math.abs(sways[best - 1] - wanted) ? index + 1 : best), 1);

type Props = {
  /** id of the group, so the particles can be targeted from CSS (e.g. `#autumn-falling-leaves`). */
  id: string;
  count: number;
  seed: number;
  /** Draws one particle centred on (0, 0). Receives the seeded random generator to vary shapes/colours. */
  renderParticle: (random: Random, index: number) => ReactNode;
  /** `fall` (snow, leaves, petals) or `rise` (bubbles, embers). */
  direction?: 'fall' | 'rise';
  /** Horizontal range, in viewBox units. */
  x?: Range;
  scale?: Range;
  /** Seconds to cross the whole scene. */
  duration?: Range;
  /** Horizontal sway amplitude, in viewBox units. */
  sway?: Range;
  /** Leaves and petals spin and turn over while falling; snow and embers just float. */
  tumble?: boolean;
  className?: string;
};

/**
 * A group of animated particles inside a background SVG.
 * Positions and timings are generated once (seeded); the motion itself is pure CSS
 * (`.particle-motion` in background.css): a single animation per particle that combines falling,
 * swaying and (with `tumble`) spinning and turning over, so the scene stays light for the browser.
 */
export const Particles = ({
  id, count, seed, renderParticle, direction = 'fall', x = [0, 1600], scale = [0.6, 1],
  duration = [10, 18], sway = [10, 40], tumble = false, className = '',
}: Props) => {
  const particles = useMemo(() => {
    const random = createRandom(seed);

    return Array.from({ length: count }, (_, index) => {
      const fallDuration = random.between(...duration);
      const style = {
        '--fall-duration': `${r1(fallDuration)}s`,
        // Negative delays: particles are already spread over the scene on the first frame.
        '--fall-delay': `${r1(-random.between(0, fallDuration))}s`,
      } as CSSProperties;
      const wantedSway = random.between(...sway);
      // Tumble variants also differ in spin (1.5 turns, -2 turns, 2.5 turns per fall).
      const variant = tumble ? `tumble-${closestVariant(TUMBLE_SWAYS, wantedSway)}` : `float-${closestVariant(FLOAT_SWAYS, wantedSway)}`;

      return {
        variant,
        x: r1(random.between(...x)),
        scale: r1(random.between(...scale) * 100) / 100,
        style,
        shape: renderParticle(random, index),
      };
    });
  }, [count, seed, renderParticle, duration, x, scale, sway, tumble]);

  return (
    <g id={id} className={`particles particles--${direction} ${className}`}>
      {particles.map((particle, index) => (
        <g key={index} className="particle" transform={`translate(${particle.x} 0)`} style={particle.style}>
          <g className={`particle-motion particle-motion--${particle.variant}`}>
            <g transform={`scale(${particle.scale})`}>{particle.shape}</g>
          </g>
        </g>
      ))}
    </g>
  );
};
