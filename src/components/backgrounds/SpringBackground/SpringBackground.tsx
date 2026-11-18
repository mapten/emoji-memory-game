import { CSSProperties, memo } from 'react';

import { Particles } from '../shared/Particles';
import { Bird, Butterfly, Cloud, Flyer, RoundTree, Sway } from '../shared/shapes';
import { createRandom, r1, Random } from '../shared/random';

// Styles
import '../shared/background.css';
import './SpringBackground.css';

type TreeColors = [string, string, string];
const BLOSSOM: TreeColors[] = [['#F49AC1', '#F9BBD5', '#FFE3EE'], ['#F7A8C4', '#FBC8DA', '#FFF0F5'], ['#EE86B3', '#F6A9C9', '#FFD9E8']];
const GREEN: TreeColors[] = [['#6DBE5A', '#88D06F', '#B8E59A'], ['#5AAE57', '#7AC46A', '#A8DB8C']];
const TULIP_COLORS = ['#F25F5C', '#FFD23F', '#F7A8C4', '#B388EB', '#FF8C42'];
const PETAL_COLORS = ['#FFC2DA', '#F9A8CB', '#F48FB8', '#F7A8C4'];

const sceneRandom = createRandom(17);
const farTrees = Array.from({ length: 18 }, (_, index) => {
  const x = 40 + index * 90 + sceneRandom.between(-25, 25);
  return {
    x: r1(x),
    base: r1(612 + 20 * Math.sin(x / 170)),
    height: r1(sceneRandom.between(55, 85)),
    colors: sceneRandom.next() < 0.45 ? sceneRandom.pick(BLOSSOM) : sceneRandom.pick(GREEN),
  };
});
const tulips = Array.from({ length: 34 }, (_, index) => ({
  x: r1(index < 17 ? 20 + index * 30 + sceneRandom.between(-10, 10) : 1020 + (index - 17) * 34 + sceneRandom.between(-10, 10)),
  y: r1(sceneRandom.between(900, 990)),
  scale: r1(sceneRandom.between(0.8, 1.3) * 100) / 100,
  color: sceneRandom.pick(TULIP_COLORS),
}));
const daisies = Array.from({ length: 40 }, () => ({
  x: r1(sceneRandom.between(0, 1600)),
  y: r1(sceneRandom.between(830, 1000)),
  scale: r1(sceneRandom.between(0.5, 1) * 100) / 100,
}));
const bigTreeCrown: [number, number, number, string][] = [
  [1300, 330, 100, '#F49AC1'], [1420, 250, 140, '#F7A8C4'], [1560, 300, 150, '#EE86B3'], [1360, 170, 110, '#F9BBD5'],
  [1510, 140, 140, '#F7A8C4'], [1620, 180, 120, '#F49AC1'], [1250, 250, 75, '#F9BBD5'], [1450, 90, 100, '#FBC8DA'],
  [1290, 430, 72, '#EE86B3'], [1420, 400, 95, '#F49AC1'], [1570, 440, 120, '#EE86B3'], [1230, 360, 55, '#F7A8C4'],
];

const Tulip = ({ color }: { color: string }) => (
  <g>
    <path d="M0,0 V-42" stroke="#4E9A3E" strokeWidth="3" />
    <path d="M0,-6 C-14,-14 -16,-28 -12,-36 C-6,-26 -2,-16 0,-10Z" fill="#5DAE4A" />
    <path d="M-10,-42 C-12,-56 -8,-64 -6,-68 L-3,-60 L0,-70 L3,-60 L6,-68 C8,-64 12,-56 10,-42 C6,-38 -6,-38 -10,-42Z" fill={color} />
  </g>
);

const Daisy = () => (
  <g>
    {[0, 45, 90, 135].map((angle) => <ellipse key={angle} rx="2.5" ry="8" fill="#FFFFFF" transform={`rotate(${angle})`} />)}
    <circle r="3.5" fill="#FFD23F" />
  </g>
);

const renderPetal = (random: Random) => (
  <path d="M0,-6 L-3,-11 C-10,-9 -10,3 0,11 C10,3 10,-9 3,-11Z" fill={random.pick(PETAL_COLORS)} />
);
const PETAL_X: [number, number] = [-40, 1640];

/**
 * Spring: a bright meadow with a turning windmill, blossoming cherry trees swaying in the breeze,
 * tulips, butterflies, birds and cherry petals drifting down. Styles: SpringBackground.css.
 */
export const SpringBackground = memo(() => (
  <svg id="spring-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="spring-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.6" />
        <stop className="sky-bottom" offset="1" />
      </linearGradient>
      <radialGradient id="spring-sun-glow-gradient">
        <stop offset="0" stopColor="#FFF6C2" stopOpacity="0.9" />
        <stop offset="0.4" stopColor="#FFF6C2" stopOpacity="0.35" />
        <stop offset="1" stopColor="#FFF6C2" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect id="spring-sky" width="1600" height="1000" fill="url(#spring-sky-gradient)" />

    <g id="spring-sun">
      <circle className="sun-glow pulse" cx="220" cy="170" r="230" fill="url(#spring-sun-glow-gradient)" />
      <g transform="translate(220 170)">
        <g className="sun-rays rotate">
          {Array.from({ length: 12 }, (_, index) => (
            <path key={index} d="M-9,-92 L0,-122 L9,-92Z" transform={`rotate(${index * 30})`} />
          ))}
        </g>
      </g>
      <circle className="sun-disc" cx="220" cy="170" r="72" />
    </g>

    <g id="spring-clouds">
      <g className="drift" style={{ '--drift-duration': '50s' } as CSSProperties}>
        <Cloud x={520} y={160} scale={0.9} />
        <Cloud x={1120} y={120} scale={0.7} />
      </g>
      <g className="drift drift--reverse" style={{ '--drift-duration': '65s' } as CSSProperties}>
        <Cloud x={850} y={300} scale={0.55} />
        <Cloud x={60} y={380} scale={0.6} />
      </g>
    </g>

    <g id="spring-birds">
      <Flyer y={230} duration={32} delay={-6} rise={-40}><Bird size={0.9} color="#4A5A7A" /></Flyer>
      <Flyer y={260} duration={32} delay={-7.2} rise={-40}><Bird size={0.7} color="#4A5A7A" flapDuration={0.35} /></Flyer>
      <Flyer y={180} duration={40} delay={-24} reverse rise={30}><Bird size={0.8} color="#4A5A7A" /></Flyer>
    </g>

    <g id="spring-hills">
      <path d="M0,600 C200,540 400,580 600,560 C820,538 1000,600 1220,570 C1400,546 1520,560 1600,556 L1600,760 L0,760Z" fill="#B9E39D" />
      {farTrees.map((tree) => <RoundTree key={tree.x} x={tree.x} base={tree.base} height={tree.height} colors={tree.colors} trunk="#8A6A4A" />)}
      <path d="M0,690 C220,640 460,690 700,670 C940,650 1160,700 1400,672 C1500,660 1560,664 1600,662 L1600,1000 L0,1000Z" fill="#95D27A" />
    </g>

    <g id="spring-windmill">
      <path d="M236,690 L254,520 L306,520 L324,690Z" fill="#F6EEDF" />
      <path d="M284,520 L306,520 L324,690 L284,690Z" fill="#000000" opacity="0.06" />
      <path d="M244,526 L280,470 L316,526Z" fill="#C8553D" />
      <path d="M266,690 V640 Q280,626 294,640 V690Z" fill="#8A5A3C" />
      <rect x="270" y="560" width="20" height="24" rx="3" fill="#7FB7E0" />
      <g transform="translate(280 500)">
        <g id="spring-windmill-blades" className="windmill-blades rotate">
          {[0, 90, 180, 270].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <rect x="-4" y="-150" width="8" height="150" fill="#8A5A3C" />
              <rect x="4" y="-140" width="26" height="104" fill="#FFFFFF" stroke="#D9CBB5" strokeWidth="2" />
              <path d="M4,-114 H30 M4,-88 H30 M4,-62 H30" stroke="#D9CBB5" strokeWidth="2" />
            </g>
          ))}
          <circle r="11" fill="#8A5A3C" />
        </g>
      </g>
    </g>

    <g id="spring-meadow">
      <path d="M0,800 C200,760 420,790 640,800 C860,810 1060,780 1280,790 C1440,798 1540,790 1600,784 L1600,1000 L0,1000Z" fill="#7CC46A" />
      <path d="M0,900 C240,870 520,900 800,912 C1080,924 1340,900 1600,880 L1600,1000 L0,1000Z" fill="#6AB85C" />
      <g id="spring-daisies">
        {daisies.map((daisy, index) => <g key={index} transform={`translate(${daisy.x} ${daisy.y}) scale(${daisy.scale})`}><Daisy /></g>)}
      </g>
    </g>

    <g id="spring-fence" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round">
      <path d="M380,820 L720,835" />
      <path d="M380,850 L720,862" />
      {Array.from({ length: 9 }, (_, index) => (
        <path key={index} d={`M${390 + index * 40},${800 + index * 0.5} V${876 + index * 1.2}`} />
      ))}
    </g>

    <g id="spring-cherry-tree">
      <Sway origin={[1450, 1000]} duration={8} angle={0.6}>
        <path d="M1420,1000 C1430,880 1415,780 1380,660 C1360,600 1320,520 1270,460 L1296,448 C1340,500 1380,570 1404,630 C1415,540 1440,440 1480,370 L1508,384 C1478,460 1460,560 1462,640 C1500,560 1560,490 1600,460 L1600,1000Z" fill="#7A5240" />
        <Sway className="sway blossom-crown" origin={[1440, 300]} duration={4} delay={-1} angle={1.4}>
          {bigTreeCrown.map(([cx, cy, r, color]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={color} />)}
          {[[1330, 150, 14], [1470, 70, 16], [1280, 250, 10], [1560, 190, 12], [1400, 230, 9], [1620, 110, 12], [1350, 380, 10], [1500, 330, 13]].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#FFF0F5" opacity="0.8" />
          ))}
        </Sway>
      </Sway>
    </g>

    <g id="spring-tulips">
      {tulips.map((tulip, index) => (
        <g key={index} transform={`translate(${tulip.x} ${tulip.y}) scale(${tulip.scale})`}>
          <Sway origin={[0, 0]} duration={2.5 + (index % 5) * 0.4} delay={-(index % 7) * 0.5} angle={4}>
            <Tulip color={tulip.color} />
          </Sway>
        </g>
      ))}
    </g>

    <g id="spring-butterflies">
      <Flyer y={700} duration={36} delay={-5} rise={-120} bobDistance={30} bobDuration={2.2}><g transform="scale(1.4)"><Butterfly colors={['#FFB627', '#FF7F51']} /></g></Flyer>
      <Flyer y={560} duration={44} delay={-26} reverse rise={80} bobDistance={40} bobDuration={2.8}><g transform="scale(1.3)"><Butterfly colors={['#7FB7E0', '#B388EB']} flapDuration={0.2} /></g></Flyer>
      <Flyer y={820} duration={40} delay={-18} rise={-60} bobDistance={26} bobDuration={1.9}><g transform="scale(1.5)"><Butterfly colors={['#F48FB8', '#FFD23F']} /></g></Flyer>
    </g>

    <Particles id="spring-petals" count={26} seed={23} renderParticle={renderPetal} x={PETAL_X} scale={[0.9, 1.6]} duration={[13, 22]} sway={[40, 100]} tumble />
  </svg>
));
SpringBackground.displayName = 'SpringBackground';
