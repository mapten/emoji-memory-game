import { CSSProperties, memo } from 'react';

import { Particles } from '../shared/Particles';
import { ChimneySmoke, Cloud, GlowGradient, PineTree, Sway, Twinkles, Window } from '../shared/shapes';
import { createRandom, r1 } from '../shared/random';
import { createHillProfile } from '../shared/geometry';

// Styles
import '../shared/background.css';
import './WinterBackground.css';

const FAR_HILL = 'M0,610 C240,560 420,600 640,580 C860,560 1060,610 1280,580 C1420,562 1520,575 1600,570 L1600,760 L0,760Z';
const farHillAt = createHillProfile(FAR_HILL);

const sceneRandom = createRandom(21);
const farPines = Array.from({ length: 30 }, (_, index) => {
  const x = index * 55 + sceneRandom.between(-15, 15);
  // Planted on the hill (a little below its edge), never floating above it.
  return { x: r1(x), base: r1(farHillAt(x) + sceneRandom.between(4, 16)), height: r1(sceneRandom.between(70, 120)) };
});
const nearPines = [[940, 735, 190], [1000, 745, 150], [1300, 745, 210], [1380, 760, 160], [80, 770, 200], [170, 790, 150]];

/** Small snowflake used in the far and middle layers. */
const renderFlake = () => <circle r="6" className="snowflake" />;
/** Six-armed crystal used for the nearest flakes. */
const renderCrystal = () => (
  <g className="snowflake snowflake--crystal">
    {[0, 60, 120].map((angle) => (
      <path key={angle} d="M0,-12 V12 M-4,-9 L0,-5 L4,-9 M-4,9 L0,5 L4,9" transform={`rotate(${angle})`} />
    ))}
  </g>
);

const X_RANGE: [number, number] = [-40, 1640];

/**
 * Winter: a quiet lavender valley with a frozen lake, a warm cabin, a snowman and snow falling in
 * three depth layers. Styles and animations: WinterBackground.css.
 */
export const WinterBackground = memo(() => (
  <svg id="winter-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="winter-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.5" />
        <stop className="sky-bottom" offset="1" />
      </linearGradient>
      <radialGradient id="winter-sun-glow-gradient">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="0.4" stopColor="#F4F0FF" stopOpacity="0.45" />
        <stop offset="1" stopColor="#F4F0FF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="winter-lake-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B8C8F0" />
        <stop offset="1" stopColor="#D6E2FA" />
      </linearGradient>
      <linearGradient id="winter-shine-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <clipPath id="winter-lake-clip">
        <path d="M330,800 C420,760 640,752 820,770 C960,784 1010,812 940,838 C820,880 520,884 380,860 C300,846 280,820 330,800Z" />
      </clipPath>
      <GlowGradient id="winter-window-glow" color="#FFC46B" />
    </defs>

    <rect id="winter-sky" width="1600" height="1000" fill="url(#winter-sky-gradient)" />

    <g id="winter-sun">
      <circle className="sun-glow pulse" cx="1150" cy="250" r="240" fill="url(#winter-sun-glow-gradient)" />
      <circle className="sun-disc" cx="1150" cy="250" r="62" />
    </g>

    <g id="winter-clouds">
      <g className="drift" style={{ '--drift-duration': '80s' } as CSSProperties}>
        <Cloud x={140} y={170} scale={1} />
        <Cloud x={760} y={120} scale={0.7} />
      </g>
      <g className="drift drift--reverse" style={{ '--drift-duration': '65s' } as CSSProperties}>
        <Cloud x={1290} y={330} scale={0.8} />
        <Cloud x={500} y={320} scale={0.5} />
      </g>
    </g>

    <g id="winter-mountains">
      <path d="M0,540 L160,380 L260,460 L420,300 L560,470 L700,390 L830,500 L980,340 L1120,480 L1260,360 L1420,470 L1600,380 L1600,700 L0,700Z" fill="#A9AEE0" />
      <path d="M160,380 L120,420 L150,412 L175,430 L205,415Z M420,300 L372,354 L408,342 L432,364 L470,350Z M980,340 L935,392 L968,380 L992,400 L1026,388Z M1260,360 L1222,404 L1252,395 L1275,412 L1300,400Z M1600,380 L1560,420 L1590,412 L1600,420Z" fill="#F4F4FF" />
    </g>

    <g id="winter-far-forest">
      <path d={FAR_HILL} fill="#C9CDF0" />
      {farPines.map((pine) => <PineTree key={pine.x} x={pine.x} base={pine.base} height={pine.height} color="#8791C9" shade="#A8AFDD" snow="#EEF0FF" trunk="#6F78B0" />)}
    </g>

    <g id="winter-hills">
      <path d="M0,700 C200,650 420,690 640,670 C880,648 1100,700 1300,680 C1440,666 1540,672 1600,668 L1600,1000 L0,1000Z" fill="#E3E7FB" />
      <path d="M0,760 C260,720 480,760 700,745 C920,730 1180,770 1400,745 C1500,735 1560,740 1600,738 L1600,1000 L0,1000Z" fill="#F3F5FF" />
      <path d="M0,790 C160,770 300,800 420,830 C300,850 120,850 0,860Z M1200,860 C1320,820 1480,810 1600,800 L1600,880 C1480,890 1320,890 1200,860Z" fill="#DCE2F8" />
    </g>

    <g id="winter-lake">
      <path d="M330,800 C420,760 640,752 820,770 C960,784 1010,812 940,838 C820,880 520,884 380,860 C300,846 280,820 330,800Z" fill="url(#winter-lake-gradient)" />
      <path d="M420,812 C560,796 720,800 860,812 M470,842 C600,832 740,836 850,830" stroke="#EAF0FF" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <g clipPath="url(#winter-lake-clip)">
        <rect className="ice-shine" x="200" y="740" width="160" height="160" fill="url(#winter-shine-gradient)" transform="skewX(-30)" />
      </g>
    </g>

    <g id="winter-pines">
      {nearPines.map(([x, base, height], index) => (
        <Sway key={x} origin={[x, base]} duration={6 + index * 0.6} delay={-index * 1.3} angle={0.8}>
          <PineTree x={x} base={base} height={height} color="#5C6FA8" shade="#7F90C4" snow="#FFFFFF" trunk="#4B4A6E" />
        </Sway>
      ))}
    </g>

    <g id="winter-cabin">
      <ChimneySmoke id="winter-chimney-smoke" x={1208} y={596} color="#FFFFFF" />
      {/* Chimney first: the roof covers its base. */}
      <rect x="1194" y="600" width="28" height="70" fill="#7A4A3A" />
      <rect x="1189" y="594" width="38" height="10" rx="3" fill="#5A3A30" />
      <path d="M1187,596 Q1208,584 1229,596Z" fill="#FFFFFF" />
      {/* Log walls, gable (same wood), then the roof and its snow on top. */}
      <path d="M1050,760 L1050,680 L1250,680 L1250,760Z" fill="#B5533C" />
      <path d="M1050,700 H1250 M1050,720 H1250 M1050,740 H1250" stroke="#9A4230" strokeWidth="3" />
      <path d="M1050,681 L1150,614 L1250,681Z" fill="#A94A35" />
      <path d="M1096,660 H1204" stroke="#9A4230" strokeWidth="3" />
      <circle cx="1150" cy="648" r="11" fill="#5A2A1E" />
      <circle cx="1150" cy="648" r="7" fill="#FFD58A" />
      <path className="roof" d="M1028,692 L1150,604 L1272,692 L1258,700 L1150,622 L1042,700Z" fill="#6B2A1E" />
      <path
        className="roof-snow"
        d="M1024,688 L1150,596 L1276,688 L1270,694 Q1262,690 1256,697 Q1248,688 1240,693 L1150,616 L1060,693 Q1052,688 1044,697 Q1038,690 1030,694Z"
        fill="#FFFFFF"
      />
      <path d="M1133,760 V716 Q1150,702 1167,716 V760Z" fill="#5A2A1E" />
      <g id="winter-windows">
        <Window x={1070} y={702} width={44} height={36} glowId="winter-window-glow" steady frame="#5A2A1E" />
        <Window x={1186} y={702} width={44} height={36} glowId="winter-window-glow" delay={-6} cycle={20} frame="#5A2A1E" />
      </g>
      <path d="M1040,762 Q1150,748 1260,762 Q1150,772 1040,762Z" fill="#FFFFFF" />
    </g>

    <g id="winter-bare-tree">
      <path d="M1500,1000 C1505,900 1490,820 1470,760 C1450,700 1420,650 1380,610 L1395,600 C1440,640 1470,690 1490,740 C1495,680 1510,620 1540,570 L1555,580 C1530,640 1520,700 1522,760 C1545,700 1575,660 1600,640 L1600,1000Z" fill="#6B4A5E" />
      {/* A little snow resting in the fork of the branches. */}
      <path d="M1484,748 Q1490,730 1506,736 Q1516,728 1526,748 Q1505,742 1484,748Z" fill="#FFFFFF" />
    </g>

    <g id="winter-snowman">
      <ellipse cx="1320" cy="960" rx="110" ry="18" fill="#D5DBF5" />
      {/* Arms behind the body, so they come out of it. */}
      <path d="M1290,812 L1220,770 M1236,782 L1226,764 M1350,812 L1420,776 M1404,786 L1418,768" stroke="#6B4A5E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="1320" cy="900" r="62" fill="#FFFFFF" />
      <circle cx="1320" cy="812" r="44" fill="#FFFFFF" />
      <circle cx="1320" cy="748" r="32" fill="#FFFFFF" />
      <path d="M1286,900 a62,62 0 0 0 96,48 a62,62 0 0 1 -96,-48Z" fill="#E4E8FA" />
      <circle cx="1309" cy="742" r="4" fill="#2F2A44" />
      <circle cx="1331" cy="742" r="4" fill="#2F2A44" />
      <path d="M1320,752 L1352,758 L1320,760Z" fill="#F28C28" />
      {[0, 1, 2].map((index) => <circle key={index} cx="1320" cy={800 + index * 18} r="4.5" fill="#2F2A44" />)}
      <rect x="1296" y="700" width="48" height="20" fill="#2F2A44" />
      <rect x="1286" y="716" width="68" height="8" rx="3" fill="#2F2A44" />
      <g id="winter-scarf">
        <path d="M1290,772 Q1320,786 1350,772 L1352,784 Q1320,798 1288,784Z" fill="#D64550" />
        <Sway className="sway scarf-tail" origin={[1340, 782]} duration={1.6} angle={8}>
          <path d="M1334,780 L1356,830 L1342,834 L1326,786Z" fill="#D64550" />
          <path d="M1344,822 L1356,830 M1340,826 L1348,836" stroke="#F4E1E3" strokeWidth="3" />
        </Sway>
      </g>
    </g>

    <Twinkles id="winter-snow-glints" count={26} seed={5} area={{ x: [0, 1600], y: [760, 990] }} size={[4, 9]} shape="sparkle" />

    <g id="winter-snowfall">
      <Particles id="winter-snow-far" className="snow-layer snow-layer--far" count={38} seed={1} renderParticle={renderFlake} x={X_RANGE} scale={[0.3, 0.5]} duration={[16, 26]} sway={[10, 30]} />
      <Particles id="winter-snow-middle" className="snow-layer snow-layer--middle" count={32} seed={2} renderParticle={renderFlake} x={X_RANGE} scale={[0.6, 0.9]} duration={[11, 17]} sway={[20, 45]} />
      <Particles id="winter-snow-near" className="snow-layer snow-layer--near" count={12} seed={3} renderParticle={renderCrystal} x={X_RANGE} scale={[1, 1.5]} duration={[7, 11]} sway={[30, 60]} />
    </g>
  </svg>
));
WinterBackground.displayName = 'WinterBackground';
