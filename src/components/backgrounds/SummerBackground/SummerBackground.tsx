import { CSSProperties, memo } from 'react';

import { Bird, Cloud, Flyer, Sway, Twinkles } from '../shared/shapes';

// Styles
import '../shared/background.css';
import './SummerBackground.css';

const WAVE_PERIOD = 120;

/** A row of small wave crests, wider than the scene so it can scroll by one period seamlessly. */
const WaveRow = ({ y, duration, opacity, size = 1 }: { y: number; duration: number; opacity: number; size?: number }) => {
  const crest = `q${15 * size},${-7 * size} ${30 * size},0 q${15 * size},${-7 * size} ${30 * size},0`;
  const d = Array.from({ length: Math.ceil(1900 / WAVE_PERIOD) }, (_, index) => `M${-100 + index * WAVE_PERIOD + (y % 60)},${y} ${crest}`).join(' ');

  return (
    <g className="wave-scroll" style={{ '--wave-duration': `${duration}s` } as CSSProperties}>
      <path className="wave-crest" d={d} opacity={opacity} strokeWidth={2 + size} />
    </g>
  );
};

type PalmProps = { x: number; base: number; top: [number, number]; scale?: number; delay?: number };

const FROND = 'M0,0 C40,-34 110,-40 170,4 C150,-4 130,-6 112,-2 C90,-14 60,-16 36,-6 C24,-4 10,-2 0,0Z';

/** Palm tree with a curved trunk and swaying fronds. */
const Palm = ({ x, base, top, scale = 1, delay = 0 }: PalmProps) => {
  const [tx, ty] = top;
  const mx = (x + tx) / 2 + (tx > x ? -40 : 40);
  const my = (base + ty) / 2;

  return (
    <g className="palm">
      <path d={`M${x - 18},${base} Q${mx - 14},${my} ${tx - 9},${ty} L${tx + 9},${ty} Q${mx + 14},${my} ${x + 18},${base}Z`} fill="#A8703F" />
      <path d={`M${x - 6},${base - 40} Q${mx - 4},${my} ${tx - 2},${ty + 30}`} stroke="#8A5A30" strokeWidth="4" strokeDasharray="4 22" fill="none" />
      <Sway origin={[tx, ty]} duration={3.5} delay={delay} angle={3}>
        <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
          {[-172, -132, -96, -58, -18, 22, 158].map((angle, index) => (
            // Fronds pointing left are mirrored so they arch upwards before drooping, like the right ones.
            <path key={angle} d={FROND} fill={index % 2 ? '#2F9E5B' : '#3DB26A'} transform={`rotate(${angle})${Math.abs(angle) > 90 ? ' scale(1 -1)' : ''}`} />
          ))}
          <circle cx="-10" cy="8" r="10" fill="#6B4A2A" />
          <circle cx="8" cy="10" r="10" fill="#7A5530" />
        </g>
      </Sway>
    </g>
  );
};

/**
 * Summer: a sunny beach with a scrolling sea, a bobbing sailboat, glints on the water, palm trees,
 * seagulls, waves washing the shore and a crab taking a walk. Styles: SummerBackground.css.
 */
export const SummerBackground = memo(() => (
  <svg id="summer-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="summer-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.45" />
        <stop className="sky-bottom" offset="0.58" />
      </linearGradient>
      <radialGradient id="summer-sun-glow-gradient">
        <stop offset="0" stopColor="#FFF3B0" stopOpacity="0.95" />
        <stop offset="0.4" stopColor="#FFF3B0" stopOpacity="0.35" />
        <stop offset="1" stopColor="#FFF3B0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="summer-sea-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sea-far" offset="0" />
        <stop className="sea-near" offset="1" />
      </linearGradient>
      <clipPath id="summer-umbrella-clip">
        <path d="M-135,52 Q-125,-8 0,-40 Q125,-8 135,52 Q112,40 90,52 Q68,40 45,52 Q22,40 0,52 Q-22,40 -45,52 Q-68,40 -90,52 Q-112,40 -135,52Z" />
      </clipPath>
      <linearGradient id="summer-sand-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F9DFA8" />
        <stop offset="1" stopColor="#F2C57C" />
      </linearGradient>
    </defs>

    <rect id="summer-sky" width="1600" height="1000" fill="url(#summer-sky-gradient)" />

    <g id="summer-sun">
      <circle className="sun-glow pulse" cx="1180" cy="160" r="260" fill="url(#summer-sun-glow-gradient)" />
      <circle className="sun-disc" cx="1180" cy="160" r="82" />
    </g>

    <g id="summer-clouds">
      <g className="drift" style={{ '--drift-duration': '60s' } as CSSProperties}>
        <Cloud x={160} y={150} scale={0.8} />
        <Cloud x={700} y={90} scale={0.6} />
      </g>
      <g className="drift drift--reverse" style={{ '--drift-duration': '75s' } as CSSProperties}>
        <Cloud x={1380} y={330} scale={0.55} />
        <Cloud x={420} y={360} scale={0.45} />
      </g>
    </g>

    <g id="summer-seagulls">
      <Flyer y={250} duration={28} delay={-3} rise={-50} bobDistance={16}><Bird size={1.3} color="#FFFFFF" flapDuration={0.5} /></Flyer>
      <Flyer y={300} duration={34} delay={-19} reverse rise={40} bobDistance={20}><Bird size={1} color="#F4F7FA" flapDuration={0.45} /></Flyer>
      <Flyer y={200} duration={30} delay={-12} rise={30} bobDistance={12}><Bird size={0.8} color="#FFFFFF" flapDuration={0.4} /></Flyer>
    </g>

    <g id="summer-sea">
      <rect x="0" y="560" width="1600" height="300" fill="url(#summer-sea-gradient)" />
      <g id="summer-island">
        <path d="M540,562 C580,532 700,524 760,562Z" fill="#7FB069" />
        <path d="M600,548 C630,538 660,540 690,552" stroke="#9CC785" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M668,546 Q662,506 676,476" stroke="#8A5A30" strokeWidth="5" fill="none" />
        <g transform="translate(676 476) scale(0.3)">
          {[-172, -132, -96, -58, -18, 22, 158].map((angle) => (
            <path key={angle} d={FROND} fill="#2F9E5B" transform={`rotate(${angle})${Math.abs(angle) > 90 ? ' scale(1 -1)' : ''}`} />
          ))}
        </g>
      </g>
      <g id="summer-waves">
        <WaveRow y={585} duration={14} opacity={0.35} size={0.6} />
        <WaveRow y={625} duration={11} opacity={0.45} size={0.8} />
        <WaveRow y={680} duration={9} opacity={0.5} />
        <WaveRow y={745} duration={7} opacity={0.55} size={1.2} />
      </g>
      <Twinkles id="summer-sea-glints" count={30} seed={44} area={{ x: [0, 1600], y: [570, 780] }} size={[4, 9]} shape="sparkle" />
    </g>

    <g id="summer-sailboat">
      <g className="drift drift--long" style={{ '--drift-duration': '40s' } as CSSProperties}>
        <g className="bob boat-bob bob--small" style={{ '--bob-duration': '2.6s', transformOrigin: '1000px 640px' } as CSSProperties}>
          <path d="M1000,636 L1000,480" stroke="#6B4A2A" strokeWidth="5" />
          <path d="M1004,486 L1062,626 L1004,626Z" fill="#FFF6E9" />
          <path d="M996,500 L948,626 L996,626Z" fill="#F25F4C" />
          <path d="M1000,480 L1024,488 L1000,496Z" fill="#FFD166" />
          <path d="M930,630 L1070,630 L1050,660 L950,660Z" fill="#FFFFFF" />
          <path d="M936,640 L1064,640" stroke="#F25F4C" strokeWidth="6" />
        </g>
      </g>
    </g>

    <g id="summer-beach">
      <path d="M0,800 C200,780 420,800 640,790 C900,778 1160,810 1400,792 C1500,784 1560,786 1600,786 L1600,1000 L0,1000Z" fill="url(#summer-sand-gradient)" />
      <path id="summer-wet-sand" d="M0,800 C200,780 420,800 640,790 C900,778 1160,810 1400,792 C1500,784 1560,786 1600,786 L1600,830 C1400,840 1160,850 900,834 C640,826 400,846 200,830 C120,824 40,824 0,828Z" fill="#E9BC73" opacity="0.7" />
      <g className="shore-wave">
        <path d="M-20,802 C200,782 420,802 640,792 C900,780 1160,812 1400,794 C1500,786 1560,788 1620,788 L1620,800 C1500,808 1420,800 1400,808 C1160,826 900,796 640,808 C420,818 200,798 -20,818Z" fill="#FFFFFF" opacity="0.85" />
      </g>
    </g>

    <g id="summer-palms">
      <Palm x={150} base={1000} top={[250, 500]} scale={1.25} />
      <Palm x={1500} base={1000} top={[1380, 560]} scale={1.1} delay={-1.5} />
    </g>

    <g id="summer-beach-props">
      <g id="summer-umbrella">
        {/* Shade on the sand, under the canopy. */}
        <ellipse cx="1150" cy="950" rx="150" ry="18" fill="#C99650" opacity="0.25" />
        <path d="M1262,940 L1220,700" stroke="#8A5A30" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="1262" cy="940" rx="16" ry="5" fill="#D9A85F" />
        {/* The canopy is drawn around its top (0,0) and tilted by the pole's angle (about 10°). */}
        <g transform="translate(1220 700) rotate(-9.9)">
          <path d="M-135,52 Q-125,-8 0,-40 Q125,-8 135,52 Q112,40 90,52 Q68,40 45,52 Q22,40 0,52 Q-22,40 -45,52 Q-68,40 -90,52 Q-112,40 -135,52Z" fill="#F25F4C" />
          <g clipPath="url(#summer-umbrella-clip)" fill="#FFF6E9">
            {/* White panels between the seams (seam lines extended past the hem, with the same slope). */}
            <path d="M0,-40 L-107.6,70 L-53.8,70Z M0,-40 L0,70 L53.8,70Z M0,-40 L107.6,70 L170,70 L170,-40Z" />
          </g>
          <path d="M0,-40 L-90,52 M0,-40 L-45,52 M0,-40 L0,52 M0,-40 L45,52 M0,-40 L90,52" stroke="#000000" strokeOpacity="0.08" strokeWidth="2" />
          <circle cx="0" cy="-42" r="5" fill="#8A5A30" />
        </g>
      </g>
      <path d="M1000,930 L1190,902 L1230,958 L1040,988Z" fill="#0E9AA7" />
      <path d="M1020,960 L1208,930 M1030,974 L1218,944" stroke="#FFD166" strokeWidth="6" />
      <g id="summer-ball">
        <circle cx="880" cy="950" r="32" fill="#FFFFFF" />
        <path d="M880,918 A32,32 0 0 1 912,950 L880,950Z" fill="#F25F4C" />
        <path d="M848,950 A32,32 0 0 0 880,982 L880,950Z" fill="#0E9AA7" />
        <path d="M880,918 A32,32 0 0 0 848,950 L880,950Z" fill="#FFD166" />
      </g>
      <g id="summer-sandcastle" fill="#E7B66A">
        <rect x="420" y="900" width="130" height="60" />
        <rect x="400" y="870" width="40" height="90" />
        <rect x="530" y="870" width="40" height="90" />
        <rect x="460" y="860" width="50" height="45" />
        <path d="M400,870 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 M530,870 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 M460,860 h10 v-8 h10 v8 h10 v-8 h10 v8 h10" stroke="#E7B66A" strokeWidth="0" />
        <path d="M485,860 V828" stroke="#6B4A2A" strokeWidth="3" />
        <path className="flag" d="M486,828 L510,836 L486,844Z" fill="#F25F4C" />
        <path d="M475,960 V930 Q485,918 495,930 V960Z" fill="#C99650" />
      </g>
      <g id="summer-shells">
        <g transform="translate(705 935) rotate(-12)">
          <path d="M0,8 L-20,-8 Q-14,-26 0,-28 Q14,-26 20,-8Z" fill="#FFB4A2" />
          <path d="M0,8 L-13,-22 M0,8 L-5,-27 M0,8 L5,-27 M0,8 L13,-22" stroke="#F28F79" strokeWidth="2" />
          <path d="M-7,8 H7 V13 H-7Z" fill="#F28F79" />
        </g>
        <g transform="translate(345 975) rotate(20)">
          <path d="M0,8 L-16,-6 Q-11,-21 0,-22 Q11,-21 16,-6Z" fill="#FFD6C9" />
          <path d="M0,8 L-10,-17 M0,8 L-4,-21 M0,8 L4,-21 M0,8 L10,-17" stroke="#F2B5A2" strokeWidth="2" />
        </g>
        <g transform="translate(775 968) rotate(14)">
          <path d="M0,-24 Q5,-8 14,-7 Q23,-6 22,-2 Q14,3 9,7 Q13,21 9,23 Q3,20 0,13 Q-3,20 -9,23 Q-13,21 -9,7 Q-14,3 -22,-2 Q-23,-6 -14,-7 Q-5,-8 0,-24Z" fill="#F7B267" />
          {[[0, -10], [7, -3], [-7, -3], [4, 7], [-4, 7], [0, 0]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#E08E3C" />)}
        </g>
      </g>
    </g>

    <g id="summer-crab">
      <g className="crab-walk">
        <g transform="translate(620 975)">
          <path d="M-34,-10 L-45,-30 M-30,-4 L-48,-10 M34,-10 L45,-30 M30,-4 L48,-10 M-26,6 L-40,16 M26,6 L40,16" stroke="#E4572E" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="0" cy="0" rx="34" ry="20" fill="#F25F4C" />
          {/* Pincers: an open claw at the end of each arm. */}
          <path d="M-44,-28 C-62,-30 -62,-50 -48,-54 L-46,-44 C-52,-42 -52,-36 -44,-36Z" fill="#F25F4C" />
          <path d="M44,-28 C62,-30 62,-50 48,-54 L46,-44 C52,-42 52,-36 44,-36Z" fill="#F25F4C" />
          <path d="M-8,-18 V-30 M8,-18 V-30" stroke="#E4572E" strokeWidth="3" />
          <circle cx="-8" cy="-32" r="5" fill="#FFFFFF" />
          <circle cx="8" cy="-32" r="5" fill="#FFFFFF" />
          <circle cx="-8" cy="-32" r="2.5" fill="#1B1B1B" />
          <circle cx="8" cy="-32" r="2.5" fill="#1B1B1B" />
        </g>
      </g>
    </g>
  </svg>
));
SummerBackground.displayName = 'SummerBackground';
