import { CSSProperties, memo } from 'react';

import { Particles } from '../shared/Particles';
import { Butterfly, Cloud, Flyer, RoundTree } from '../shared/shapes';
import { createRandom, r1, Random } from '../shared/random';

// Styles
import '../shared/background.css';
import './EasterBackground.css';

const EGG = 'M0,-50 C26,-50 40,-8 40,14 C40,38 22,52 0,52 C-22,52 -40,38 -40,14 C-40,-8 -26,-50 0,-50Z';
const PASTELS = ['#FFB5C8', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
const RAINBOW = ['#FFB5C8', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF', '#BDB2FF'];

type EggPattern = 'stripes' | 'zigzag' | 'dots' | 'waves';

/** Decorated Easter egg (decorations are clipped to the egg shape). */
const Egg = ({ color, accent, pattern }: { color: string; accent: string; pattern: EggPattern }) => (
  <g className="egg">
    <path d={EGG} fill={color} />
    <g clipPath="url(#easter-egg-clip)" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round">
      {pattern === 'stripes' && <path d="M-45,-14 H45 M-45,14 H45 M-45,36 H45" />}
      {pattern === 'zigzag' && <path d="M-45,0 L-33,-12 L-21,0 L-9,-12 L3,0 L15,-12 L27,0 L39,-12 M-45,30 L-33,18 L-21,30 L-9,18 L3,30 L15,18 L27,30 L39,18" />}
      {pattern === 'waves' && <path d="M-45,-6 Q-35,-16 -25,-6 T-5,-6 T15,-6 T35,-6 T55,-6 M-45,24 Q-35,14 -25,24 T-5,24 T15,24 T35,24 T55,24" />}
      {pattern === 'dots' && (
        <g fill={accent} stroke="none">
          {[[-18, -20], [14, -24], [-24, 10], [4, 2], [24, 14], [-10, 32], [16, 38]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" />)}
        </g>
      )}
    </g>
    <ellipse cx="-14" cy="-18" rx="7" ry="14" fill="#FFFFFF" opacity="0.45" transform="rotate(20 -14 -18)" />
  </g>
);

const sceneRandom = createRandom(29);
const PATTERNS: EggPattern[] = ['stripes', 'zigzag', 'dots', 'waves'];
const eggs = [
  [120, 935, 0.9], [390, 940, 0.7], [560, 945, 0.85], [700, 935, 0.6], [960, 945, 0.75],
  [1080, 930, 0.55], [1220, 945, 0.8], [1500, 945, 0.7], [290, 960, 0.6],
].map(([x, y, scale], index) => ({
  x, y, scale,
  color: PASTELS[index % PASTELS.length],
  accent: sceneRandom.pick(['#FFFFFF', '#F48FB8', '#8E5CC6', '#4CC9A6', '#FF9F68']),
  pattern: PATTERNS[index % PATTERNS.length],
  wobble: index % 3 === 0,
  rotation: r1(sceneRandom.between(-15, 15)),
}));
const farTrees = Array.from({ length: 16 }, (_, index) => {
  const x = 50 + index * 100 + sceneRandom.between(-25, 25);
  return {
    x: r1(x),
    base: r1(650 + 18 * Math.sin(x / 160)),
    height: r1(sceneRandom.between(55, 80)),
    colors: sceneRandom.pick<[string, string, string]>([['#FFC6DD', '#FFDCEA', '#FFF2F7'], ['#BFE6A8', '#D3F0C0', '#EEF9E6'], ['#E4D4FF', '#EFE4FF', '#F8F3FF']]),
  };
});
const flowers = Array.from({ length: 50 }, () => ({
  x: r1(sceneRandom.between(0, 1600)),
  y: r1(sceneRandom.between(820, 1000)),
  scale: r1(sceneRandom.between(0.5, 1.1) * 100) / 100,
  color: sceneRandom.pick(['#FFFFFF', '#FFD6E8', '#FFF3B0', '#E4D4FF']),
}));

const renderConfetti = (random: Random) => (
  <path d="M0,-6 L-3,-11 C-10,-9 -10,3 0,11 C10,3 10,-9 3,-11Z" fill={random.pick(['#FFB5C8', '#FFD6A5', '#BDB2FF', '#A0C4FF', '#CAFFBF'])} />
);
const CONFETTI_X: [number, number] = [-40, 1640];

/**
 * Easter: a pastel meadow under a shimmering rainbow, with decorated eggs hidden in the grass,
 * a bunny twitching its ear, a chick peeking out of its shell, butterflies and drifting petals.
 * Styles and animations: EasterBackground.css.
 */
export const EasterBackground = memo(() => (
  <svg id="easter-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="easter-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.55" />
        <stop className="sky-bottom" offset="1" />
      </linearGradient>
      <radialGradient id="easter-sun-glow-gradient">
        <stop offset="0" stopColor="#FFF8D6" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#FFF8D6" stopOpacity="0.3" />
        <stop offset="1" stopColor="#FFF8D6" stopOpacity="0" />
      </radialGradient>
      <clipPath id="easter-chick-clip">
        <rect x="-60" y="-130" width="120" height="150" />
      </clipPath>
      <clipPath id="easter-egg-clip">
        <path d={EGG} />
      </clipPath>
    </defs>

    <rect id="easter-sky" width="1600" height="1000" fill="url(#easter-sky-gradient)" />

    <g id="easter-sun">
      <circle className="sun-glow pulse" cx="1360" cy="150" r="200" fill="url(#easter-sun-glow-gradient)" />
      <circle className="sun-disc" cx="1360" cy="150" r="62" />
    </g>

    <g id="easter-rainbow" className="rainbow">
      {RAINBOW.map((color, index) => (
        <path key={color} d={`M${130 + index * 26},700 A${670 - index * 26},${560 - index * 26} 0 0 1 ${1470 - index * 26},700`} stroke={color} strokeWidth="28" fill="none" />
      ))}
    </g>

    <g id="easter-clouds">
      <g className="drift" style={{ '--drift-duration': '55s' } as CSSProperties}>
        <Cloud x={60} y={200} scale={0.9} />
        <Cloud x={1280} y={420} scale={0.8} />
      </g>
      <g className="drift drift--reverse" style={{ '--drift-duration': '70s' } as CSSProperties}>
        <Cloud x={640} y={110} scale={0.6} />
        <Cloud x={180} y={470} scale={0.6} />
      </g>
    </g>

    <g id="easter-butterflies">
      <Flyer y={300} duration={38} delay={-8} rise={120} bobDistance={34} bobDuration={2.4}><g transform="scale(1.3)"><Butterfly colors={['#BDB2FF', '#FFC6FF']} /></g></Flyer>
      <Flyer y={760} duration={46} delay={-30} reverse rise={-90} bobDistance={28} bobDuration={2}><g transform="scale(1.4)"><Butterfly colors={['#FFD6A5', '#FFB5C8']} flapDuration={0.2} /></g></Flyer>
    </g>

    <g id="easter-hills">
      <path d="M0,650 C220,600 440,640 660,625 C880,610 1080,660 1300,630 C1440,612 1540,620 1600,618 L1600,800 L0,800Z" fill="#CDEBB8" />
      {farTrees.map((tree) => <RoundTree key={tree.x} x={tree.x} base={tree.base} height={tree.height} colors={tree.colors} trunk="#B08968" />)}
      <path d="M0,740 C260,700 520,740 780,728 C1040,716 1300,756 1600,724 L1600,1000 L0,1000Z" fill="#B5E29C" />
      <path d="M0,860 C300,830 620,860 900,872 C1180,884 1420,860 1600,850 L1600,1000 L0,1000Z" fill="#A3D98A" />
    </g>

    <g id="easter-flowers">
      {flowers.map((flower, index) => (
        <g key={index} transform={`translate(${flower.x} ${flower.y}) scale(${flower.scale})`}>
          {[0, 45, 90, 135].map((angle) => <ellipse key={angle} rx="3" ry="9" fill={flower.color} transform={`rotate(${angle})`} />)}
          <circle r="4" fill="#FFD23F" />
        </g>
      ))}
    </g>

    <g id="easter-bunny" transform="translate(250 905)">
      <ellipse cx="10" cy="0" rx="90" ry="12" fill="#8CC873" opacity="0.6" />
      <circle className="bunny-fur" cx="-64" cy="-52" r="18" />
      <ellipse className="bunny-fur" cx="0" cy="-58" rx="64" ry="58" />
      <ellipse className="bunny-shade" cx="-20" cy="-38" rx="46" ry="38" />
      <ellipse className="bunny-fur" cx="36" cy="-6" rx="28" ry="10" />
      <g className="bunny-ear bunny-ear--back">
        <ellipse className="bunny-fur" cx="28" cy="-196" rx="14" ry="50" transform="rotate(-14 28 -196)" />
        <ellipse className="bunny-ear-inner" cx="28" cy="-192" rx="6" ry="36" transform="rotate(-14 28 -192)" />
      </g>
      <circle className="bunny-fur" cx="48" cy="-128" r="40" />
      <g className="bunny-ear bunny-ear--front">
        <ellipse className="bunny-fur" cx="62" cy="-200" rx="14" ry="50" transform="rotate(10 62 -200)" />
        <ellipse className="bunny-ear-inner" cx="62" cy="-196" rx="6" ry="36" transform="rotate(10 62 -196)" />
      </g>
      <circle cx="64" cy="-134" r="5.5" fill="#3B2A2A" />
      <circle cx="66" cy="-136" r="1.8" fill="#FFFFFF" />
      <ellipse cx="72" cy="-116" rx="9" ry="5" fill="#FFB5C8" opacity="0.7" />
      <ellipse className="bunny-nose" cx="87" cy="-124" rx="5" ry="4" fill="#F48FB8" />
      <path d="M86,-118 Q82,-110 76,-112 M86,-118 Q90,-110 94,-113" stroke="#C98A9C" strokeWidth="2" fill="none" />
    </g>

    <g id="easter-eggs">
      {eggs.map((egg) => (
        <g key={egg.x} transform={`translate(${egg.x} ${egg.y}) rotate(${egg.rotation}) scale(${egg.scale})`}>
          <g className={egg.wobble ? 'egg-wobble' : undefined} style={{ animationDelay: `${-egg.x / 300}s` }}>
            <Egg color={egg.color} accent={egg.accent} pattern={egg.pattern} />
          </g>
        </g>
      ))}
    </g>

    <g id="easter-hatching-egg" transform="translate(820 950)">
      <g clipPath="url(#easter-chick-clip)">
        <g className="chick">
          <circle cx="0" cy="-40" r="30" fill="#FFE066" />
          <circle cx="-10" cy="-46" r="4" fill="#3B2A2A" />
          <circle cx="10" cy="-46" r="4" fill="#3B2A2A" />
          <path d="M-6,-36 L0,-28 L6,-36Z" fill="#FF9F1C" />
          <path d="M-4,-70 Q0,-82 6,-70 Q10,-80 12,-68" stroke="#FFE066" strokeWidth="4" fill="none" />
        </g>
      </g>
      <path d="M-44,-30 L-30,-44 L-16,-30 L-2,-46 L12,-30 L26,-44 L44,-28 C46,8 28,30 0,30 C-28,30 -46,8 -44,-30Z" fill="#FFF8EC" />
      <path d="M-44,-4 Q0,8 44,-4" stroke="#A0C4FF" strokeWidth="6" fill="none" />
    </g>

    <g id="easter-basket" transform="translate(1330 960)">
      <path d="M-90,-60 Q0,-190 90,-60" stroke="#B07D4F" strokeWidth="12" fill="none" />
      {[[-50, -66, '#FFB5C8'], [-10, -80, '#9BF6FF'], [34, -70, '#FDFFB6'], [62, -60, '#BDB2FF'], [-70, -56, '#CAFFBF']].map(([x, y, color]) => (
        <g key={`${x}`} transform={`translate(${x} ${y}) scale(0.55)`}><path d={EGG} fill={color as string} /></g>
      ))}
      <path d="M-100,-64 L100,-64 L80,10 L-80,10Z" fill="#C8915A" />
      <path d="M-96,-44 H96 M-90,-24 H90 M-86,-4 H86" stroke="#A8733F" strokeWidth="5" />
      <path d="M-60,-64 L-50,10 M-20,-64 L-16,10 M20,-64 L16,10 M60,-64 L50,10" stroke="#A8733F" strokeWidth="4" />
      <path d="M-100,-64 Q-70,-84 -40,-64 Q-10,-84 20,-64 Q50,-84 100,-64" fill="#CAFFBF" />
      <g id="easter-basket-bow" transform="translate(74 -82)">
        <path d="M0,0 C-22,-16 -26,8 0,0Z M0,0 C22,-16 26,8 0,0Z" fill="#F48FB8" />
        <path d="M0,0 L-8,18 L-3,16 L0,2 M0,0 L8,18 L3,16 L0,2" fill="#F48FB8" />
        <circle cx="0" cy="0" r="4.5" fill="#E56B9F" />
      </g>
    </g>

    <Particles id="easter-petals" count={22} seed={37} renderParticle={renderConfetti} x={CONFETTI_X} scale={[0.9, 1.5]} duration={[14, 22]} sway={[40, 90]} tumble />
  </svg>
));
EasterBackground.displayName = 'EasterBackground';
