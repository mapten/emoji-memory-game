import { CSSProperties, ReactNode } from 'react';
import { createRandom, r1 } from './random';

/* ------------------------------------------------------------------------------------------------
 * Reusable pieces of scenery for the background SVGs.
 * Elements that are animated from CSS never carry a `transform` attribute themselves
 * (a CSS transform would replace it): the positioning transform lives on a parent group.
 * --------------------------------------------------------------------------------------------- */

type CloudProps = { x: number; y: number; scale?: number; className?: string };

/** Puffy cloud. Wrap it in a group with the `drift` class to make it float sideways. */
export const Cloud = ({ x, y, scale = 1, className = 'cloud' }: CloudProps) => (
  <g className={className} transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle cx="0" cy="0" r="60" />
    <circle cx="55" cy="-20" r="70" />
    <circle cx="120" cy="0" r="55" />
    <circle cx="60" cy="20" r="60" />
    <circle cx="-45" cy="15" r="40" />
    <circle cx="165" cy="20" r="38" />
  </g>
);

type RoundTreeProps = {
  x: number;
  base: number;
  height: number;
  /** [body, light side, highlight] */
  colors: [string, string, string];
  trunk?: string;
  className?: string;
};

/** Deciduous tree made of overlapping circles. */
export const RoundTree = ({ x, base, height, colors, trunk = '#6E3B26', className = 'tree' }: RoundTreeProps) => {
  const r = height * 0.32;
  const cy = base - height * 0.62;

  return (
    <g className={className}>
      <rect x={r1(x - height * 0.035)} y={r1(base - height * 0.45)} width={r1(height * 0.07)} height={r1(height * 0.45)} fill={trunk} />
      <g className="tree-crown">
        <circle cx={x} cy={r1(cy)} r={r1(r)} fill={colors[0]} />
        <circle cx={r1(x - r * 0.55)} cy={r1(cy + r * 0.35)} r={r1(r * 0.7)} fill={colors[0]} />
        <circle cx={r1(x + r * 0.6)} cy={r1(cy + r * 0.3)} r={r1(r * 0.72)} fill={colors[0]} />
        <circle cx={r1(x - r * 0.25)} cy={r1(cy - r * 0.25)} r={r1(r * 0.6)} fill={colors[1]} />
        <circle cx={r1(x - r * 0.4)} cy={r1(cy - r * 0.4)} r={r1(r * 0.25)} fill={colors[2]} opacity="0.8" />
      </g>
    </g>
  );
};

type PineTreeProps = {
  x: number;
  base: number;
  height: number;
  color: string;
  shade: string;
  /** Colour of the snow on the branches, if any. */
  snow?: string;
  trunk?: string;
  className?: string;
};

/** Fir tree made of three stacked triangles, optionally snowy. */
export const PineTree = ({ x, base, height: h, color, shade, snow, trunk = '#5A3322', className = 'pine' }: PineTreeProps) => {
  const w = h * 0.42;
  const tiers: [number, number, number][] = [[0, 0.45, 0.6], [0.22, 0.7, 0.8], [0.45, 0.9, 1]];

  return (
    <g className={className}>
      <rect x={r1(x - h * 0.03)} y={r1(base - h * 0.15)} width={r1(h * 0.06)} height={r1(h * 0.15)} fill={trunk} />
      {tiers.map(([top, bottom, width], index) => {
        const ty = r1(base - h + top * h);
        const by = r1(base - h + bottom * h);
        const half = w * width;
        return (
          <g key={index}>
            <path d={`M${x},${ty} L${r1(x + half)},${by} L${r1(x - half)},${by}Z`} fill={color} />
            <path d={`M${x},${ty} L${r1(x - half)},${by} L${r1(x - half * 0.2)},${by}Z`} fill={shade} opacity="0.5" />
            {snow && (
              <path
                d={`M${x},${ty} L${r1(x + half * 0.45)},${r1(ty + (by - ty) * 0.45)} Q${r1(x + half * 0.2)},${r1(ty + (by - ty) * 0.55)} ${x},${r1(ty + (by - ty) * 0.42)} Q${r1(x - half * 0.2)},${r1(ty + (by - ty) * 0.55)} ${r1(x - half * 0.45)},${r1(ty + (by - ty) * 0.45)}Z`}
                fill={snow}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

type WindowProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** id of the radial gradient used for the light halo. */
  glowId: string;
  /** Seconds before the light starts its on/off cycle (can be negative). */
  delay?: number;
  /** Length, in seconds, of the on/off cycle. */
  cycle?: number;
  /** Steady windows stay lit and only flicker softly (like a fireplace). */
  steady?: boolean;
  frame?: string;
  /** Rounded top (arched window). */
  arched?: boolean;
};

/**
 * A window whose light is switched on and off by CSS (`.window-lit` in background.css).
 * Colours are CSS variables: `--window-off`, `--window-on`, `--window-frame`.
 */
export const Window = ({ x, y, width, height, glowId, delay = 0, cycle = 16, steady = false, frame, arched = false }: WindowProps) => {
  const style = { '--window-delay': `${delay}s`, '--window-cycle': `${cycle}s` } as CSSProperties;
  const pane = arched
    ? `M${x},${y + height} L${x},${y + width / 2} A${width / 2},${width / 2} 0 0 1 ${x + width},${y + width / 2} L${x + width},${y + height}Z`
    : `M${x},${y} h${width} v${height} h${-width}Z`;

  return (
    <g className={`window${steady ? ' window--steady' : ''}`} style={style}>
      <path className="window-pane" d={pane} />
      <g className="window-lit">
        <ellipse className="window-glow" cx={x + width / 2} cy={y + height / 2} rx={width * 1.9} ry={height * 1.5} fill={`url(#${glowId})`} />
        <path className="window-light" d={pane} />
      </g>
      <path
        className="window-frame"
        d={`${pane} M${x + width / 2},${y + (arched ? width / 2 - 2 : 0)} v${height - (arched ? width / 2 - 2 : 0)} M${x},${y + height * 0.55} h${width}`}
        style={frame ? { stroke: frame } : undefined}
      />
    </g>
  );
};

/** Radial gradient used as the halo of lit windows and lamps. */
export const GlowGradient = ({ id, color }: { id: string; color: string }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={color} stopOpacity="0.75" />
    <stop offset="0.45" stopColor={color} stopOpacity="0.25" />
    <stop offset="1" stopColor={color} stopOpacity="0" />
  </radialGradient>
);

export type LightStringGeometry = {
  from: [number, number];
  to: [number, number];
  /** How much the wire hangs down in the middle. */
  sag: number;
  count: number;
  /** Index of the first bulb (shifts the colour sequence). */
  startIndex?: number;
  bulbSize?: number;
};

type LightStringsProps = {
  strings: LightStringGeometry[];
  /** Bulb colour names, cycled; each has a matching `.bulb--<name>` rule and glow gradient. */
  colors: string[];
  /** Prefix of the glow gradient ids: `<glowPrefix>-<colour>`. */
  glowPrefix: string;
  /** Number of chase phases: bulb n belongs to phase n % phases. */
  phases?: number;
  className?: string;
};

/**
 * Strings of Christmas lights hanging between points.
 * Bulbs are grouped by chase phase (`.bulb-phase`, with its index in `--phase`): each phase blinks a
 * little after the previous one, which makes the light "run" along the wires. One animation per phase
 * for all the strings (instead of one per bulb) keeps the scene light for the browser.
 */
export const LightStrings = ({ strings, colors, glowPrefix, phases = 4, className = 'light-strings' }: LightStringsProps) => {
  const bulbs = strings.flatMap(({ from: [x1, y1], to: [x2, y2], sag, count, startIndex = 0, bulbSize = 7 }) => {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + sag * 2;
    // Point on the quadratic Bézier curve at t.
    const at = (t: number) => [
      (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2,
      (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2,
    ];
    return Array.from({ length: count }, (_, index) => {
      const [bx, by] = at((index + 0.5) / count);
      return { bx, by, size: bulbSize, n: index + startIndex, color: colors[(index + startIndex) % colors.length] };
    });
  });

  return (
    <g className={className}>
      {strings.map(({ from: [x1, y1], to: [x2, y2], sag }, index) => (
        <path key={index} className="light-wire" d={`M${x1},${y1} Q${r1((x1 + x2) / 2)},${r1((y1 + y2) / 2 + sag * 2)} ${x2},${y2}`} />
      ))}
      {Array.from({ length: phases }, (_, phase) => (
        <g key={phase} className="bulb-phase" style={{ '--phase': phase } as CSSProperties}>
          {bulbs.filter((bulb) => bulb.n % phases === phase).map(({ bx, by, size, color }, index) => (
            <g key={index} className={`bulb bulb--${color}`}>
              <circle className="bulb-glow" cx={r1(bx)} cy={r1(by + size)} r={size * 3.2} fill={`url(#${glowPrefix}-${color})`} />
              <rect x={r1(bx - size * 0.35)} y={r1(by - 1)} width={r1(size * 0.7)} height={size * 0.6} fill="#2F3B2F" />
              <ellipse className="bulb-glass" cx={r1(bx)} cy={r1(by + size)} rx={size * 0.6} ry={size} />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
};

/** A single string of lights (see LightStrings). */
export const LightString = ({ colors, glowPrefix, ...geometry }: LightStringGeometry & { colors: string[]; glowPrefix: string }) => (
  <LightStrings strings={[geometry]} colors={colors} glowPrefix={glowPrefix} className="light-string" />
);

type TwinklesProps = {
  id: string;
  count: number;
  seed: number;
  area: { x: [number, number]; y: [number, number] };
  size?: [number, number];
  /** `dot` for distant stars, `sparkle` for four-pointed glints. */
  shape?: 'dot' | 'sparkle';
  /** Stars are spread over this many groups, each twinkling with its own rhythm (one animation per group). */
  groups?: number;
  className?: string;
};

const sparklePath = (size: number) =>
  `M0,${-size} Q${size * 0.15},${-size * 0.15} ${size},0 Q${size * 0.15},${size * 0.15} 0,${size} Q${-size * 0.15},${size * 0.15} ${-size},0 Q${-size * 0.15},${-size * 0.15} 0,${-size}Z`;

/** Stars or glints that fade in and out (`.twinkle-group` in background.css). */
export const Twinkles = ({ id, count, seed, area, size = [1.5, 4], shape = 'dot', groups = 6, className = '' }: TwinklesProps) => {
  const random = createRandom(seed);
  const stars = Array.from({ length: count }, (_, index) => {
    const x = r1(random.between(...area.x));
    const y = r1(random.between(...area.y));
    const s = r1(random.between(...size));
    return (
      <g key={index} className="twinkle" transform={`translate(${x} ${y})`}>
        {shape === 'dot' ? <circle r={s} /> : <path d={sparklePath(s)} />}
      </g>
    );
  });

  return (
    <g id={id} className={`twinkles ${className}`}>
      {Array.from({ length: groups }, (_, group) => (
        <g
          key={group}
          className="twinkle-group"
          style={{
            '--twinkle-delay': `${r1(-random.between(0, 6))}s`,
            '--twinkle-duration': `${r1(random.between(1.6, 4.5))}s`,
          } as CSSProperties}
        >
          {stars.filter((_, index) => index % groups === group)}
        </g>
      ))}
    </g>
  );
};

/** Groups its children and gives them a gentle wind sway around `origin` (`.sway` in background.css). */
export const Sway = ({ children, className = 'sway', origin, duration = 6, delay = 0, angle = 1.5 }: {
  children: ReactNode;
  className?: string;
  /** Transform origin in viewBox units, e.g. the base of a tree trunk. */
  origin: [number, number];
  duration?: number;
  delay?: number;
  /** Maximum rotation, in degrees: rounded to the gentle (1°), medium (3.5°) or strong (8°) variant. */
  angle?: number;
}) => (
  <g
    className={`${className}${angle > 5 ? ' sway--strong' : angle > 2 ? ' sway--medium' : ''}`}
    style={{
      transformOrigin: `${origin[0]}px ${origin[1]}px`,
      '--sway-duration': `${duration}s`,
      '--sway-delay': `${delay}s`,
    } as CSSProperties}
  >
    {children}
  </g>
);

/** Puffs of smoke rising from a chimney (`.smoke-puff` in background.css). */
export const ChimneySmoke = ({ id, x, y, puffs = 5, duration = 7, color = '#FFFFFF' }: {
  id: string;
  x: number;
  y: number;
  puffs?: number;
  duration?: number;
  color?: string;
}) => (
  <g id={id} className="chimney-smoke">
    <defs>
      {/* Soft edges: puffs look like smoke rather than discs. */}
      <radialGradient id={`${id}-gradient`}>
        <stop offset="0" stopColor={color} stopOpacity="0.9" />
        <stop offset="0.6" stopColor={color} stopOpacity="0.55" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    {Array.from({ length: puffs }, (_, index) => (
      <circle
        key={index}
        className="smoke-puff"
        cx={x}
        cy={y}
        r={18}
        fill={`url(#${id}-gradient)`}
        style={{ '--smoke-delay': `${-(duration / puffs) * index}s`, '--smoke-duration': `${duration}s` } as CSSProperties}
      />
    ))}
  </g>
);

/** Rounded bush made of overlapping circles, with a flat base and a lighter top. */
export const Bush = ({ x, base, size, colors }: { x: number; base: number; size: number; colors: [string, string, string] }) => (
  <g className="bush">
    <circle cx={r1(x - size * 0.55)} cy={r1(base - size * 0.38)} r={r1(size * 0.42)} fill={colors[0]} />
    <circle cx={r1(x + size * 0.55)} cy={r1(base - size * 0.36)} r={r1(size * 0.4)} fill={colors[0]} />
    <circle cx={x} cy={r1(base - size * 0.6)} r={r1(size * 0.55)} fill={colors[0]} />
    <circle cx={r1(x - size * 0.2)} cy={r1(base - size * 0.78)} r={r1(size * 0.32)} fill={colors[1]} />
    <circle cx={r1(x + size * 0.32)} cy={r1(base - size * 0.58)} r={r1(size * 0.26)} fill={colors[1]} />
    <circle cx={r1(x - size * 0.3)} cy={r1(base - size * 0.88)} r={r1(size * 0.09)} fill={colors[2]} opacity="0.7" />
    <rect x={r1(x - size * 0.95)} y={r1(base - size * 0.3)} width={r1(size * 1.9)} height={r1(size * 0.3)} fill={colors[0]} />
  </g>
);

type FlyerProps = {
  children: ReactNode;
  /** Altitude of the flight, in viewBox units. */
  y: number;
  /** Seconds to cross the scene. */
  duration: number;
  delay?: number;
  reverse?: boolean;
  /** Vertical drift over the whole flight: negative climbs, positive descends (80px), around 0 stays level. */
  rise?: number;
  /** Up and down floating: rounded to the small (8px), medium (16px) or large (30px) variant. */
  bobDistance?: number;
  bobDuration?: number;
  className?: string;
};

/** Moves its children across the whole scene (`.flyer` + `.bob` in background.css). */
export const Flyer = ({ children, y, duration, delay = 0, reverse = false, rise = 0, bobDistance = 12, bobDuration = 2.4, className = '' }: FlyerProps) => (
  <g transform={`translate(0 ${y})`}>
    <g
      className={`flyer${reverse ? ' flyer--reverse' : ''}${rise < -20 ? ' flyer--climb' : rise > 20 ? ' flyer--descend' : ''} ${className}`}
      style={{ '--fly-duration': `${duration}s`, '--fly-delay': `${delay}s` } as CSSProperties}
    >
      <g className={`bob${bobDistance <= 10 ? ' bob--small' : bobDistance > 22 ? ' bob--large' : ''}`} style={{ '--bob-duration': `${bobDuration}s` } as CSSProperties}>
        {children}
      </g>
    </g>
  </g>
);

/** Simple bird / seagull: two arcs flapping (`.flap`). */
export const Bird = ({ size = 1, color = '#3E3A4F', flapDuration = 0.4 }: { size?: number; color?: string; flapDuration?: number }) => (
  <g className="flap" style={{ '--flap-duration': `${flapDuration}s` } as CSSProperties}>
    <path
      d={`M${-22 * size},${-4 * size} Q${-11 * size},${-14 * size} 0,0 Q${11 * size},${-14 * size} ${22 * size},${-4 * size} Q${11 * size},${-6 * size} 0,${4 * size} Q${-11 * size},${-6 * size} ${-22 * size},${-4 * size}Z`}
      fill={color}
    />
  </g>
);

/** Butterfly with fluttering wings. */
export const Butterfly = ({ colors, flapDuration = 0.22 }: { colors: [string, string]; flapDuration?: number }) => (
  <g>
    <g className="flutter" style={{ '--flap-duration': `${flapDuration}s` } as CSSProperties}>
      <path d="M0,0 C-10,-22 -30,-26 -28,-8 C-27,2 -12,4 0,0Z" fill={colors[0]} />
      <path d="M0,0 C10,-22 30,-26 28,-8 C27,2 12,4 0,0Z" fill={colors[0]} />
      <path d="M0,0 C-8,6 -22,16 -16,22 C-10,26 -4,14 0,0Z" fill={colors[1]} />
      <path d="M0,0 C8,6 22,16 16,22 C10,26 4,14 0,0Z" fill={colors[1]} />
    </g>
    <ellipse cx="0" cy="2" rx="2.5" ry="11" fill="#3B2A2A" />
    <path d="M-1,-8 Q-5,-18 -9,-20 M1,-8 Q5,-18 9,-20" stroke="#3B2A2A" strokeWidth="1.5" fill="none" />
  </g>
);
