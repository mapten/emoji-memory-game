import { r1 } from './random';

type Point = [number, number];

/**
 * Reads the top edge of a hill path (an `M x,y` followed by `C` curves, then `L` lines closing the shape)
 * and returns a function giving the height (y) of the hill at any x.
 * Used to plant trees exactly on the hills they stand on, whatever their shape.
 */
export const createHillProfile = (d: string): ((x: number) => number) => {
  const top = d.split(/[LZ]/)[0];
  const numbers = (top.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const samples: Point[] = [[numbers[0], numbers[1]]];

  for (let i = 2; i + 5 < numbers.length; i += 6) {
    const [x0, y0] = samples[samples.length - 1];
    const [x1, y1, x2, y2, x3, y3] = numbers.slice(i, i + 6);
    for (let step = 1; step <= 24; step++) {
      const t = step / 24;
      const u = 1 - t;
      samples.push([
        u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
        u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3,
      ]);
    }
  }
  samples.sort((a, b) => a[0] - b[0]);

  return (x: number) => {
    if (x <= samples[0][0]) return samples[0][1];
    for (let i = 1; i < samples.length; i++) {
      const [xa, ya] = samples[i - 1];
      const [xb, yb] = samples[i];
      if (x <= xb) return xb === xa ? yb : ya + ((yb - ya) * (x - xa)) / (xb - xa);
    }
    return samples[samples.length - 1][1];
  };
};

/**
 * Snow cap of a mountain peak: follows both slopes exactly (so it never sticks out of the mountain)
 * and ends with a zigzag edge. `depth` is the height of the cap.
 */
export const snowCapPath = (peak: Point, leftFoot: Point, rightFoot: Point, depth: number): string => {
  const [px, py] = peak;
  const along = ([fx, fy]: Point, height: number): Point => {
    const t = height / (fy - py);
    return [px + (fx - px) * t, py + height];
  };
  const left = along(leftFoot, depth);
  const right = along(rightFoot, depth * 0.9);
  const innerLeft = along(leftFoot, depth * 0.62);
  const innerRight = along(rightFoot, depth * 0.55);
  const points: Point[] = [
    peak,
    right,
    [innerRight[0] - (innerRight[0] - px) * 0.35, right[1] - depth * 0.12],
    [px + (right[0] - px) * 0.1, innerRight[1] + depth * 0.3],
    [px - (px - left[0]) * 0.3, left[1] - depth * 0.18],
    [innerLeft[0] + (px - innerLeft[0]) * 0.15, innerLeft[1] + depth * 0.2],
    left,
  ];

  return `M${points.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' L')}Z`;
};
