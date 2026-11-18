import { CSSProperties, memo } from 'react';

import { Particles } from '../shared/Particles';
import { Bush, ChimneySmoke, Cloud, GlowGradient, PineTree, RoundTree, Sway, Window } from '../shared/shapes';
import { createHillProfile, snowCapPath } from '../shared/geometry';
import { createRandom, r1, Random } from '../shared/random';
import { Leaf, LeafKind } from './leaves';

// Styles
import '../shared/background.css';
import './AutumnBackground.css';

const LEAF_COLORS = ['#E4572E', '#F29E4C', '#F1C453', '#C8402A', '#A44A3F'];
const LEAF_KINDS: LeafKind[] = ['maple', 'maple', 'oak', 'oval'];

type TreeColors = [string, string, string];
const FAR_COLORS: TreeColors[] = [['#D9744A', '#E88C5C', '#F4B08A'], ['#E0904F', '#EDA865', '#F7C58F'], ['#C95F41', '#D9744F', '#EE9C7A']];
const MID_COLORS: TreeColors[] = [['#E4572E', '#F0743F', '#FFB27A'], ['#F29E4C', '#F7B864', '#FFD89A'], ['#C8402A', '#DD5636', '#F59A78'], ['#F1C453', '#F7D774', '#FFF0B3']];

const MOUNTAINS = 'M0,560 L140,430 L230,500 L360,370 L500,520 L620,440 L760,540 L900,420 L1040,520 L1180,400 L1330,510 L1460,430 L1600,500 L1600,700 L0,700Z';
/** Snow-capped peaks: [peak, left foot, right foot, cap height]. */
const PEAKS: [[number, number], [number, number], [number, number], number][] = [
  [[360, 370], [230, 500], [500, 520], 48],
  [[900, 420], [760, 540], [1040, 520], 40],
  [[1180, 400], [1040, 520], [1330, 510], 44],
];
const FAR_HILL = 'M0,620 C200,560 380,600 560,575 C760,545 960,610 1160,570 C1340,535 1480,575 1600,560 L1600,760 L0,760Z';
const VALLEY = 'M0,700 C220,640 420,690 640,665 C860,640 1060,700 1280,660 C1420,635 1520,650 1600,645 L1600,1000 L0,1000Z';
const farHillAt = createHillProfile(FAR_HILL);
const valleyAt = createHillProfile(VALLEY);

// Scenery generated once, with a fixed seed: the scene is identical on every visit.
const sceneRandom = createRandom(7);
const farForest = Array.from({ length: 23 }, (_, index) => {
  const x = 30 + index * 70 + sceneRandom.between(-20, 20);
  return {
    x: r1(x),
    // Trees are planted on the hill (a little below its edge), never floating above it.
    base: r1(farHillAt(x) + sceneRandom.between(6, 22)),
    height: r1(sceneRandom.between(60, 90)),
    pine: sceneRandom.next() < 0.3,
    colors: sceneRandom.pick(FAR_COLORS),
  };
});
const midTrees = [70, 190, 300, 1010, 1130, 1240].map((x) => ({
  x,
  base: r1(valleyAt(x) + 28),
  height: r1(sceneRandom.between(150, 190)),
  colors: sceneRandom.pick(MID_COLORS),
}));
const groundLeaves = Array.from({ length: 36 }, () => ({
  x: r1(sceneRandom.next() < 0.5 ? sceneRandom.between(560, 760) : sceneRandom.between(900, 1600)),
  y: r1(sceneRandom.between(870, 1000)),
  scale: r1(sceneRandom.between(0.18, 0.3) * 100) / 100,
  rotation: r1(sceneRandom.between(0, 360)),
  kind: sceneRandom.pick(LEAF_KINDS),
  color: sceneRandom.pick(LEAF_COLORS),
}));
const bigTreeCrown: [number, number, number, string][] = [
  [1290, 420, 110, '#C8402A'], [1420, 330, 150, '#E4572E'], [1560, 380, 150, '#C8402A'], [1360, 250, 120, '#F0743F'],
  [1520, 220, 150, '#E4572E'], [1600, 260, 120, '#F29E4C'], [1250, 330, 80, '#F29E4C'], [1460, 170, 110, '#F7B864'],
  [1580, 120, 130, '#F0743F'], [1370, 430, 70, '#F29E4C'],
];

const renderFallingLeaf = (random: Random) => (
  <Leaf kind={random.pick(LEAF_KINDS)} color={random.pick(LEAF_COLORS)} />
);
const FALL_X: [number, number] = [-50, 1650];
const FALL_SCALE: [number, number] = [0.26, 0.5];
const FALL_DURATION: [number, number] = [11, 20];
const FALL_SWAY: [number, number] = [30, 90];

/**
 * Autumn: a golden-hour valley with a winding path, a cosy cabin with lit windows and a smoking
 * chimney, a big swaying tree and leaves falling all over the scene.
 * Styles and animations: AutumnBackground.css.
 */
export const AutumnBackground = memo(() => (
  <svg id="autumn-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="autumn-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.55" />
        <stop className="sky-bottom" offset="1" />
      </linearGradient>
      <radialGradient id="autumn-sun-glow-gradient">
        <stop offset="0" stopColor="#FFF6DF" stopOpacity="0.95" />
        <stop offset="0.35" stopColor="#FFE9C0" stopOpacity="0.6" />
        <stop offset="1" stopColor="#FFE2B0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="autumn-streak-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFF3E3" stopOpacity="0.85" />
        <stop offset="1" stopColor="#FFF3E3" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="autumn-path-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F3D2A6" />
        <stop offset="1" stopColor="#E9B985" />
      </linearGradient>
      <linearGradient id="autumn-trunk-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4A2A1E" />
        <stop offset="0.6" stopColor="#6B3D28" />
        <stop offset="1" stopColor="#4A2A1E" />
      </linearGradient>
      <GlowGradient id="autumn-window-glow" color="#FFC86B" />
    </defs>

    <rect id="autumn-sky" width="1600" height="1000" fill="url(#autumn-sky-gradient)" />

    <g id="autumn-sun">
      <circle className="sun-glow pulse" cx="560" cy="360" r="330" fill="url(#autumn-sun-glow-gradient)" />
      <circle className="sun-disc" cx="560" cy="360" r="95" />
    </g>

    <g id="autumn-clouds">
      <g className="drift" style={{ '--drift-duration': '70s' } as CSSProperties}>
        {[[80, 140, 520, -12], [820, 90, 600, -8], [1000, 260, 420, -10], [250, 300, 380, -14]].map(([x, y, w, rotation]) => (
          <ellipse key={x} className="cloud-streak" cx={x + w / 2} cy={y} rx={w / 2} ry="16" fill="url(#autumn-streak-gradient)" transform={`rotate(${rotation} ${x + w / 2} ${y})`} />
        ))}
      </g>
      <g className="drift" style={{ '--drift-duration': '45s' } as CSSProperties}>
        <Cloud x={180} y={210} scale={0.9} />
        <Cloud x={860} y={330} scale={0.6} />
      </g>
      <g className="drift drift--reverse" style={{ '--drift-duration': '55s' } as CSSProperties}>
        <Cloud x={1180} y={170} scale={1.1} />
      </g>
    </g>

    <g id="autumn-mountains">
      <path d={MOUNTAINS} fill="#EBB08F" opacity="0.9" />
      {PEAKS.map(([peak, left, right, depth]) => <path key={peak[0]} className="snow-cap" d={snowCapPath(peak, left, right, depth)} fill="#FBE2CB" opacity="0.8" />)}
    </g>

    <g id="autumn-far-forest">
      <path d={FAR_HILL} fill="#E29A72" />
      {farForest.map((tree) => tree.pine
        ? <PineTree key={tree.x} x={tree.x} base={tree.base} height={tree.height + 10} color="#B65B3E" shade="#D88060" />
        : <RoundTree key={tree.x} x={tree.x} base={tree.base} height={tree.height} colors={tree.colors} />)}
    </g>

    <g id="autumn-valley">
      <path d={VALLEY} fill="#D27B45" />
      {midTrees.map((tree, index) => (
        <Sway key={tree.x} origin={[tree.x, tree.base]} duration={5 + index * 0.7} delay={-index} angle={1.2}>
          <RoundTree x={tree.x} base={tree.base} height={tree.height} colors={tree.colors} />
        </Sway>
      ))}
      <PineTree x={360} base={r1(valleyAt(360) + 26)} height={190} color="#7A3A26" shade="#A4583B" />
      <PineTree x={1080} base={r1(valleyAt(1080) + 26)} height={190} color="#7A3A26" shade="#A4583B" />
    </g>

    <g id="autumn-ground">
      <path d="M0,820 C180,770 360,800 520,790 C700,780 820,850 1000,860 C1200,860 1450,840 1600,815 L1600,1000 L0,1000Z" fill="#B8582F" />
      <path d="M0,900 C200,870 420,900 600,930 C700,950 760,980 780,1000 L0,1000Z" fill="#A94E2A" opacity="0.6" />
      <g id="autumn-path">
        <path d="M700,1000 C720,900 640,850 760,790 C860,740 975,735 1008,688 Q1013,683 1018,688 C1015,745 900,770 830,820 C730,880 860,930 900,1000Z" fill="url(#autumn-path-gradient)" />
        <path d="M770,1000 C760,930 720,880 790,830 C850,790 930,760 995,712" stroke="#FBE6C8" strokeWidth="6" fill="none" opacity="0.5" strokeDasharray="30 26" />
      </g>
    </g>

    <g id="autumn-cabin">
      <ChimneySmoke id="autumn-chimney-smoke" x={356} y={696} color="#FFF3E6" />
      {/* Chimney first: the roof covers its base. */}
      <rect x="340" y="700" width="32" height="90" fill="#7A3A26" />
      <rect x="334" y="692" width="44" height="14" rx="3" fill="#5A2A1A" />
      {/* Log walls, gable (same wood) with its attic window, then the roof on top of them. */}
      <path d="M150,900 L150,800 L420,800 L420,900Z" fill="#8A4A2C" />
      <path d="M150,825 H420 M150,850 H420 M150,875 H420" stroke="#6E3A22" strokeWidth="4" />
      <path d="M150,800 L285,722 L420,800Z" fill="#96522F" />
      <path d="M190,800 H380 M228,778 H342" stroke="#6E3A22" strokeWidth="4" />
      <path className="roof" d="M122,814 L285,712 L448,814 L430,824 L285,734 L140,824Z" fill="#5A2A1A" />
      <path d="M285,712 L448,814 L440,819 L285,722Z" fill="#000000" opacity="0.15" />
      <path d="M265,900 V842 Q285,826 305,842 V900Z" fill="#4A2418" />
      <circle cx="297" cy="874" r="3" fill="#F2B134" />
      <g id="autumn-windows">
        <Window x={180} y={830} width={52} height={42} glowId="autumn-window-glow" steady delay={0} />
        <Window x={338} y={830} width={52} height={42} glowId="autumn-window-glow" delay={-4} cycle={22} />
        <Window x={270} y={752} width={30} height={30} glowId="autumn-window-glow" arched delay={-13} cycle={18} />
      </g>
    </g>

    <g id="autumn-big-tree">
      <Sway origin={[1440, 1000]} duration={7} angle={0.8}>
        <path d="M1430,1000 C1440,880 1420,760 1380,640 C1360,580 1320,520 1270,470 L1300,455 C1340,490 1380,540 1410,600 C1420,520 1440,440 1480,380 L1510,395 C1480,460 1460,560 1465,640 C1500,560 1560,500 1600,470 L1600,1000Z" fill="url(#autumn-trunk-gradient)" />
        <path d="M1445,1000 C1450,900 1440,800 1420,700" stroke="#7C4A30" strokeWidth="10" fill="none" opacity="0.6" />
        <Sway className="sway tree-crown" origin={[1440, 420]} duration={4.5} delay={-2} angle={1.6}>
          {bigTreeCrown.map(([cx, cy, r, color]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={color} />)}
          {[[1340, 215, 22], [1450, 140, 26], [1270, 320, 16], [1530, 110, 20], [1410, 290, 14]].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#FFE0A8" opacity="0.45" />
          ))}
        </Sway>
      </Sway>
    </g>

    <g id="autumn-foreground">
      {/* Fallen leaves first: mushrooms, acorns and bushes sit on top of them. */}
      <g id="autumn-ground-leaves">
        {groundLeaves.map((leaf, index) => (
          <g key={index} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotation}) scale(${leaf.scale})`}>
            <Leaf kind={leaf.kind} color={leaf.color} />
          </g>
        ))}
      </g>
      <g id="autumn-bushes">
        <Bush x={40} base={1010} size={120} colors={['#C8402A', '#E4572E', '#FFB27A']} />
        <Bush x={150} base={1020} size={85} colors={['#D9532B', '#F0743F', '#FFC48F']} />
      </g>
      <g id="autumn-mushrooms">
        {[[470, 915, 0.8], [520, 925, 0.55]].map(([x, y, scale]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}>
            <path d="M-12,0 C-14,-20 -10,-30 -8,-34 L8,-34 C10,-30 14,-20 12,0Z" fill="#F6E7CF" />
            <path d="M-40,-30 C-40,-70 40,-70 40,-30 C40,-24 -40,-24 -40,-30Z" fill="#D9462B" />
            <circle cx="-18" cy="-44" r="6" fill="#FFF6EA" />
            <circle cx="8" cy="-52" r="5" fill="#FFF6EA" />
            <circle cx="22" cy="-38" r="4" fill="#FFF6EA" />
          </g>
        ))}
      </g>
      <g id="autumn-acorns">
        {[[1180, 935, 0.7, -20], [1230, 950, 0.55, 25]].map(([x, y, scale, rotation]) => (
          <g key={x} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
            <ellipse cx="0" cy="14" rx="22" ry="28" fill="#C98B4B" />
            <ellipse cx="-7" cy="10" rx="6" ry="14" fill="#DFA764" opacity="0.7" />
            <path d="M-27,-2 C-27,-22 27,-22 27,-2 C27,4 -27,4 -27,-2Z" fill="#7A4A2A" />
            <path d="M0,-16 C0,-24 4,-28 8,-30" stroke="#7A4A2A" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <g id="autumn-grass" stroke="#8E3F22" strokeWidth="4" fill="none" strokeLinecap="round">
        {[[560, 870], [640, 905], [1000, 900], [1350, 880], [470, 845]].map(([x, y]) => (
          <path key={x} d={`M${x},${y} q-6,-26 -16,-34 M${x},${y} q0,-30 4,-40 M${x},${y} q8,-22 20,-28`} />
        ))}
      </g>
    </g>

    <Particles
      id="autumn-falling-leaves"
      count={28}
      seed={42}
      renderParticle={renderFallingLeaf}
      x={FALL_X}
      scale={FALL_SCALE}
      duration={FALL_DURATION}
      sway={FALL_SWAY}
      tumble
    />
  </svg>
));
AutumnBackground.displayName = 'AutumnBackground';
