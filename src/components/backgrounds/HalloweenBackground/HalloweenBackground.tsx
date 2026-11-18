import { CSSProperties, memo } from 'react';

import { Particles } from '../shared/Particles';
import { Flyer, GlowGradient, Twinkles, Window } from '../shared/shapes';

// Styles
import '../shared/background.css';
import './HalloweenBackground.css';

const BAT_WING = 'M0,0 C-8,-10 -20,-14 -34,-10 C-30,-6 -30,-2 -32,2 C-26,-2 -20,0 -18,4 C-14,0 -8,0 0,6Z';

/** Bat with flapping wings. */
const Bat = ({ scale = 1, flap = 0.18 }: { scale?: number; flap?: number }) => (
  <g transform={`scale(${scale})`} className="bat">
    <g className="flap" style={{ '--flap-duration': `${flap}s` } as CSSProperties}>
      <path d={BAT_WING} />
      <path d={BAT_WING} transform="scale(-1 1)" />
    </g>
    <ellipse cx="0" cy="2" rx="6" ry="9" />
    <path d="M-5,-5 L-6,-13 L-1,-7Z M5,-5 L6,-13 L1,-7Z" />
  </g>
);

type PumpkinProps = { x: number; y: number; scale?: number; delay?: number };

/** Jack-o'-lantern whose candle light flickers (`.pumpkin-light`). */
const Pumpkin = ({ x, y, scale = 1, delay = 0 }: PumpkinProps) => (
  <g className="pumpkin" transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle className="pumpkin-glow" cx="0" cy="-6" r="120" fill="url(#halloween-candle-glow)" style={{ animationDelay: `${delay}s` }} />
    <path d="M-4,-52 C-4,-64 4,-70 12,-72 L14,-66 C8,-64 6,-58 6,-52Z" fill="#3E5B2A" />
    <ellipse cx="-30" cy="0" rx="34" ry="48" fill="#D9580D" />
    <ellipse cx="30" cy="0" rx="34" ry="48" fill="#D9580D" />
    <ellipse cx="0" cy="0" rx="36" ry="52" fill="#F07A1A" />
    <ellipse cx="-46" cy="-12" rx="6" ry="24" fill="#F59A3C" opacity="0.6" />
    <g className="pumpkin-light" style={{ animationDelay: `${delay}s` }}>
      <path d="M-34,-14 L-16,-26 L-12,-8Z M34,-14 L16,-26 L12,-8Z M-6,0 L6,0 L0,10Z" />
      <path d="M-40,14 Q0,44 40,14 L30,20 L24,14 L16,24 L8,18 L0,26 L-8,18 L-16,24 L-24,14 L-30,20Z" />
    </g>
  </g>
);

/** Two glowing eyes hiding in a bush, blinking from time to time. */
const Eyes = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className="eyes" style={{ animationDelay: `${delay}s` }}>
      <ellipse cx="-10" cy="0" rx="6" ry="4" />
      <ellipse cx="10" cy="0" rx="6" ry="4" />
    </g>
  </g>
);

const TOMBSTONES: [number, number, number, number, number][] = [
  // x, base, width, height, rotation
  [250, 905, 70, 100, -6], [380, 925, 60, 80, 4], [520, 915, 80, 110, -2], [1040, 920, 64, 86, 5], [1160, 930, 56, 72, -4],
];

const renderEmber = () => <circle r="5" className="ember" />;
const EMBER_X: [number, number] = [0, 1600];

/**
 * Halloween: a purple night with a huge moon, bats, a haunted house with flickering windows,
 * a graveyard with a floating ghost, glowing jack-o'-lanterns, creeping fog and rising embers.
 * Styles and animations: HalloweenBackground.css.
 */
export const HalloweenBackground = memo(() => (
  <svg id="halloween-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="halloween-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.55" />
        <stop className="sky-bottom" offset="1" />
      </linearGradient>
      <radialGradient id="halloween-moon-glow-gradient">
        <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.6" />
        <stop offset="0.45" stopColor="#F7B267" stopOpacity="0.18" />
        <stop offset="1" stopColor="#F7B267" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halloween-fog-gradient">
        <stop offset="0" stopColor="#D9C8F0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#D9C8F0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halloween-ghost-gradient" cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="1" stopColor="#E6DDF7" stopOpacity="0.7" />
      </radialGradient>
      <GlowGradient id="halloween-window-glow" color="#FF9F1C" />
      <GlowGradient id="halloween-candle-glow" color="#FFB347" />
    </defs>

    <rect id="halloween-sky" width="1600" height="1000" fill="url(#halloween-sky-gradient)" />
    <Twinkles id="halloween-stars" count={45} seed={31} area={{ x: [0, 1600], y: [0, 480] }} size={[1, 2.5]} />

    <g id="halloween-moon">
      <circle className="moon-glow pulse" cx="300" cy="240" r="340" fill="url(#halloween-moon-glow-gradient)" />
      <circle className="moon-disc" cx="300" cy="240" r="140" />
      <circle cx="255" cy="200" r="24" fill="#F2D58A" opacity="0.55" />
      <circle cx="345" cy="280" r="30" fill="#F2D58A" opacity="0.45" />
      <circle cx="330" cy="180" r="12" fill="#F2D58A" opacity="0.5" />
      <circle cx="240" cy="300" r="14" fill="#F2D58A" opacity="0.5" />
    </g>

    <g id="halloween-clouds">
      <g className="drift drift--long" style={{ '--drift-duration': '40s' } as CSSProperties}>
        <path className="cloud" d="M120,300 C140,270 190,270 210,290 C230,260 300,260 320,290 C350,280 400,290 410,310 C330,318 200,318 120,300Z" />
      </g>
      <g className="drift drift--long drift--reverse" style={{ '--drift-duration': '55s' } as CSSProperties}>
        <path className="cloud" d="M900,150 C920,122 970,122 990,142 C1010,112 1080,112 1100,142 C1130,132 1180,142 1190,160 C1110,168 980,168 900,150Z" />
        <path className="cloud" d="M1300,90 C1316,70 1350,70 1366,84 C1380,62 1430,62 1444,84 C1466,78 1500,84 1508,98 C1450,104 1360,104 1300,90Z" />
      </g>
    </g>

    <g id="halloween-bats" className="bats">
      <Flyer y={160} duration={22} delay={-4} rise={-60} bobDistance={18} bobDuration={1.6}><Bat scale={1.1} /></Flyer>
      <Flyer y={230} duration={26} delay={-15} rise={40} bobDistance={24} bobDuration={2}><Bat scale={0.8} flap={0.15} /></Flyer>
      <Flyer y={110} duration={30} delay={-9} reverse rise={30} bobDistance={14} bobDuration={1.4}><Bat scale={0.6} flap={0.14} /></Flyer>
      <Flyer y={300} duration={19} delay={-1} reverse rise={-80} bobDistance={20} bobDuration={1.8}><Bat scale={0.9} /></Flyer>
      <Flyer y={70} duration={34} delay={-22} rise={20} bobDistance={10} bobDuration={1.2}><Bat scale={0.5} flap={0.12} /></Flyer>
    </g>

    <g id="halloween-hills">
      <path d="M0,640 C220,600 420,640 640,620 C860,600 1020,560 1200,520 C1320,494 1480,500 1600,520 L1600,1000 L0,1000Z" fill="#2B1644" />
      <path d="M0,760 C240,720 520,760 780,745 C1040,730 1300,770 1600,740 L1600,1000 L0,1000Z" fill="#1F0F33" />
    </g>

    <g id="halloween-haunted-house" className="haunted-house">
      <path d="M1270,520 L1270,360 L1250,360 L1330,280 L1410,360 L1390,360 L1390,520Z" />
      <path d="M1390,520 L1390,420 L1380,420 L1445,360 L1510,420 L1500,420 L1500,520Z" />
      <path d="M1300,300 L1300,200 L1290,200 L1320,120 L1350,200 L1340,200 L1340,300Z" />
      <path d="M1472,392 L1472,340 L1488,340 L1488,408Z" />
      <path d="M1320,120 L1320,100" strokeWidth="3" stroke="#1A0C29" />
      <g id="halloween-windows">
        <Window x={1308} y={214} width={24} height={36} glowId="halloween-window-glow" arched delay={-3} cycle={9} />
        <Window x={1290} y={390} width={30} height={40} glowId="halloween-window-glow" steady delay={-1} />
        <Window x={1342} y={390} width={30} height={40} glowId="halloween-window-glow" delay={-6} cycle={11} />
        <Window x={1430} y={440} width={30} height={36} glowId="halloween-window-glow" delay={-2} cycle={7} />
        <Window x={1315} y={310} width={30} height={30} glowId="halloween-window-glow" arched delay={-8} cycle={13} />
      </g>
      <path className="door" d="M1318,520 L1318,470 Q1330,456 1342,470 L1342,520Z" style={{ fill: '#0E0618' }} />
    </g>

    <g id="halloween-ghost" className="ghost">
      <g className="bob" style={{ '--bob-duration': '3.2s' } as CSSProperties}>
        <g className="ghost-body">
          <path d="M760,820 C760,760 790,730 820,730 C850,730 880,760 880,820 L880,880 L866,868 L852,882 L838,868 L824,882 L810,868 L796,882 L782,868 L768,882 L760,872Z" fill="url(#halloween-ghost-gradient)" />
          <ellipse cx="805" cy="790" rx="7" ry="10" fill="#2B1644" />
          <ellipse cx="835" cy="790" rx="7" ry="10" fill="#2B1644" />
          <ellipse cx="820" cy="818" rx="9" ry="12" fill="#2B1644" />
        </g>
      </g>
    </g>

    <g id="halloween-graveyard">
      <path className="fence" d="M600,880 H1000 M600,900 H1000" strokeWidth="5" />
      {Array.from({ length: 11 }, (_, index) => (
        <path key={index} className="fence-picket" d={`M${604 + index * 39},930 V856 L${610 + index * 39},844 L${616 + index * 39},856 V930Z`} />
      ))}
      {TOMBSTONES.map(([x, base, width, height, rotation]) => (
        <g key={x} transform={`rotate(${rotation} ${x} ${base})`} className="tombstone">
          <path d={`M${x - width / 2},${base} V${base - height + width / 2} A${width / 2},${width / 2} 0 0 1 ${x + width / 2},${base - height + width / 2} V${base}Z`} />
          <path className="tombstone-engraving" d={`M${x - width * 0.2},${base - height * 0.55} H${x + width * 0.2} M${x},${base - height * 0.7} V${base - height * 0.3}`} />
        </g>
      ))}
    </g>

    <g id="halloween-dead-tree" className="dead-tree">
      <path d="M40,1000 C60,880 50,760 20,650 C0,580 -30,520 -60,480 L-40,470 C-10,505 20,560 40,610 C50,540 80,470 130,420 L145,432 C110,480 80,560 80,630 C120,560 190,500 260,470 L266,484 C200,520 130,590 110,680 C150,650 210,630 250,632 L248,646 C200,650 140,680 110,740 C100,820 110,920 130,1000Z" />
      <path className="spider-thread" d="M215,492 V560" strokeWidth="1.5" />
      <g id="halloween-spider">
        <g className="bob" style={{ '--bob-duration': '2.8s' } as CSSProperties}>
          <path className="spider-thread" d="M215,540 V585" strokeWidth="1.5" />
          <g className="spider" transform="translate(215 594)">
            <ellipse cx="0" cy="0" rx="10" ry="12" />
            <circle cx="0" cy="-12" r="6" />
            <path d="M-8,-4 L-22,-14 L-28,-2 M-8,2 L-24,0 L-28,12 M-8,6 L-20,14 L-22,26 M8,-4 L22,-14 L28,-2 M8,2 L24,0 L28,12 M8,6 L20,14 L22,26" strokeWidth="2.5" fill="none" />
          </g>
        </g>
      </g>
    </g>

    <g id="halloween-bushes" className="bushes">
      <path d="M1400,940 C1390,880 1450,860 1480,880 C1500,840 1570,850 1580,890 C1610,880 1640,910 1620,940Z" />
      <path d="M140,980 C130,930 180,910 210,925 C230,890 300,900 305,940 C330,935 350,960 340,985Z" />
    </g>
    <g id="halloween-eyes">
      <Eyes x={1500} y={900} delay={-1} />
      <Eyes x={240} y={948} delay={-3.5} />
    </g>

    <g id="halloween-fog">
      <g className="drift drift--long" style={{ '--drift-duration': '26s' } as CSSProperties}>
        <ellipse cx="400" cy="900" rx="520" ry="70" fill="url(#halloween-fog-gradient)" />
        <ellipse cx="1300" cy="930" rx="480" ry="60" fill="url(#halloween-fog-gradient)" />
      </g>
      <g className="drift drift--long drift--reverse" style={{ '--drift-duration': '34s' } as CSSProperties}>
        <ellipse cx="850" cy="960" rx="620" ry="60" fill="url(#halloween-fog-gradient)" />
        <ellipse cx="1500" cy="780" rx="360" ry="50" fill="url(#halloween-fog-gradient)" />
      </g>
    </g>

    <g id="halloween-pumpkins">
      <Pumpkin x={1260} y={930} scale={1} delay={0} />
      <Pumpkin x={1352} y={952} scale={0.7} delay={-0.7} />
      <Pumpkin x={470} y={945} scale={0.8} delay={-1.3} />
    </g>

    <Particles id="halloween-embers" direction="rise" count={22} seed={13} renderParticle={renderEmber} x={EMBER_X} scale={[0.4, 1]} duration={[14, 24]} sway={[20, 60]} />
  </svg>
));
HalloweenBackground.displayName = 'HalloweenBackground';
