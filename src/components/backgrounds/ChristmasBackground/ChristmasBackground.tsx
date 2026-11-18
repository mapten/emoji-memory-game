import { CSSProperties, memo } from 'react';

import { Particles } from '../shared/Particles';
import { GlowGradient, LightStringGeometry, LightStrings, PineTree, Twinkles, Window } from '../shared/shapes';
import { createRandom, r1 } from '../shared/random';
import { createHillProfile } from '../shared/geometry';

// Styles
import '../shared/background.css';
import './ChristmasBackground.css';

const BULB_COLORS = ['red', 'gold', 'green', 'blue'];
const BULB_HEX: Record<string, string> = { red: '#FF5A5F', gold: '#FFD166', green: '#5DD39E', blue: '#5BC0EB' };

type HouseProps = {
  id: string;
  x: number;
  base: number;
  width: number;
  height: number;
  wall: string;
  roof: string;
  /** Windows relative to the wall's top-left corner: [x, y, width, height, delay, cycle, steady?]. */
  windows: [number, number, number, number, number, number, boolean?][];
  lightsStart: number;
};

/** Roof corners of a house: left eave, ridge and right eave. */
const roofPoints = ({ x, base, width, height }: HouseProps) => {
  const top = base - height;
  return {
    eaveLeft: [x - 16, top + 6] as [number, number],
    ridge: [x + width / 2, top - width * 0.42] as [number, number],
    eaveRight: [x + width + 16, top + 6] as [number, number],
  };
};

/** The two strings of lights along the roof of a house. */
const houseLights = (house: HouseProps): LightStringGeometry[] => {
  const { eaveLeft, ridge, eaveRight } = roofPoints(house);
  return [
    { from: eaveLeft, to: ridge, sag: 6, count: 6, startIndex: house.lightsStart, bulbSize: 6 },
    { from: ridge, to: eaveRight, sag: 6, count: 6, startIndex: house.lightsStart + 6, bulbSize: 6 },
  ];
};

/** Snowy house with lit windows and a wreath on the door (its roof lights are drawn by the village). */
const House = (props: HouseProps) => {
  const { id, x, base, width, height, wall, roof, windows } = props;
  const top = base - height;
  const { eaveLeft, ridge, eaveRight } = roofPoints(props);
  const doorX = x + width / 2 - 18;

  return (
    <g id={id} className="house">
      <rect x={x} y={top} width={width} height={height} fill={wall} />
      <rect x={x} y={top} width={width} height={height} fill="url(#christmas-wall-shade)" />
      <path d={`M${eaveLeft[0]},${eaveLeft[1]} L${ridge[0]},${ridge[1]} L${eaveRight[0]},${eaveRight[1]}Z`} fill={roof} />
      <path
        className="roof-snow"
        d={`M${eaveLeft[0] - 6},${eaveLeft[1] + 2} L${ridge[0]},${ridge[1] - 8} L${eaveRight[0] + 6},${eaveRight[1] + 2} ` +
          `Q${eaveRight[0] - 10},${eaveRight[1] + 10} ${eaveRight[0] - 24},${eaveRight[1] - 2} ` +
          `L${ridge[0]},${ridge[1] + 10} L${eaveLeft[0] + 24},${eaveLeft[1] - 2} Q${eaveLeft[0] + 10},${eaveLeft[1] + 12} ${eaveLeft[0] - 6},${eaveLeft[1] + 2}Z`}
      />
      <g className="house-windows">
        {windows.map(([wx, wy, ww, wh, delay, cycle, steady], index) => (
          <Window key={index} x={x + wx} y={top + wy} width={ww} height={wh} glowId="christmas-window-glow" delay={delay} cycle={cycle} steady={steady} />
        ))}
      </g>
      <rect x={doorX} y={base - 58} width="36" height="58" rx="4" fill="#3B2330" />
      <circle cx={doorX + 18} cy={base - 38} r="10" fill="none" stroke="#2E8B57" strokeWidth="6" />
      <circle cx={doorX + 18} cy={base - 47} r="3" fill="#FF5A5F" />
    </g>
  );
};

const FOREST_HILL = 'M0,600 C240,540 460,590 700,560 C940,530 1160,590 1400,560 C1500,548 1560,552 1600,550 L1600,800 L0,800Z';
const forestHillAt = createHillProfile(FOREST_HILL);

const HOUSES: HouseProps[] = [
  { id: 'christmas-house-1', x: 210, base: 800, width: 170, height: 120, wall: '#B8433A', roof: '#4A2F45', lightsStart: 0,
    windows: [[22, 30, 40, 36, 0, 18, true], [108, 30, 40, 36, -5, 14]] },
  { id: 'christmas-house-2', x: 430, base: 805, width: 210, height: 175, wall: '#E2CFA9', roof: '#3B4A6B', lightsStart: 3,
    windows: [[24, 26, 42, 38, -2, 20], [144, 26, 42, 38, -11, 16], [24, 90, 42, 38, -7, 22, true], [144, 90, 42, 38, -15, 19]] },
  { id: 'christmas-house-3', x: 690, base: 800, width: 150, height: 115, wall: '#3F7D5C', roof: '#4A2F45', lightsStart: 6,
    windows: [[16, 28, 36, 34, -9, 17], [98, 28, 36, 34, -3, 21, true]] },
  { id: 'christmas-house-4', x: 890, base: 808, width: 170, height: 150, wall: '#4A6FA5', roof: '#3B2A3F', lightsStart: 9,
    windows: [[20, 24, 40, 36, -13, 15], [110, 24, 40, 36, -1, 23], [20, 84, 40, 36, -6, 18, true], [110, 84, 40, 36, -9, 21]] },
];

const TREE_LIGHTS: LightStringGeometry[] = [
  { from: [1292, 556], to: [1370, 548], sag: 6, count: 4, startIndex: 2 },
  { from: [1262, 628], to: [1402, 614], sag: 10, count: 6, startIndex: 6 },
  { from: [1215, 736], to: [1445, 720], sag: 14, count: 9, startIndex: 12 },
  { from: [1180, 828], to: [1480, 814], sag: 12, count: 12, startIndex: 21 },
];
const FOREGROUND_LIGHTS: LightStringGeometry[] = [
  { from: [22, 770], to: [120, 760], sag: 10, count: 5, startIndex: 40 },
  { from: [-5, 880], to: [150, 862], sag: 14, count: 7, startIndex: 45 },
];

const sceneRandom = createRandom(12);
const forest = Array.from({ length: 34 }, (_, index) => {
  const x = index * 48 + sceneRandom.between(-12, 12);
  // Planted on the hill (a little below its edge), never floating above it.
  return { x: r1(x), base: r1(Math.max(forestHillAt(x) + 30, 620) + sceneRandom.between(0, 14)), height: r1(sceneRandom.between(70, 130)) };
});
const ornaments = Array.from({ length: 16 }, () => {
  const t = sceneRandom.between(0.18, 0.95); // height along the tree
  return {
    x: r1(1330 + sceneRandom.between(-1, 1) * t * 130),
    y: r1(500 + t * 330),
    color: sceneRandom.pick(['#FF5A5F', '#FFD166', '#5BC0EB', '#F4F1DE']),
  };
});
const STAR = 'M0,-34 L9,-11 L33,-10 L14,5 L21,29 L0,15 L-21,29 L-14,5 L-33,-10 L-9,-11Z';

const renderFlake = () => <circle r="6" className="snowflake" />;
const SNOW_X: [number, number] = [-40, 1640];

/**
 * Christmas: a snowy village at night. Windows turn on and off, light strings chase along the
 * roofs, the tree twinkles under its star, stars sparkle and Santa crosses the moon from time to time.
 * Styles and animations: ChristmasBackground.css.
 */
export const ChristmasBackground = memo(() => (
  <svg id="christmas-background" className="themed-background" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="christmas-sky-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop className="sky-top" offset="0" />
        <stop className="sky-middle" offset="0.55" />
        <stop className="sky-bottom" offset="1" />
      </linearGradient>
      <radialGradient id="christmas-moon-glow-gradient">
        <stop offset="0" stopColor="#FFF6D8" stopOpacity="0.55" />
        <stop offset="0.4" stopColor="#C9D6FF" stopOpacity="0.18" />
        <stop offset="1" stopColor="#C9D6FF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="christmas-wall-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000000" stopOpacity="0.25" />
        <stop offset="0.35" stopColor="#000000" stopOpacity="0" />
      </linearGradient>
      <GlowGradient id="christmas-window-glow" color="#FFC46B" />
      <GlowGradient id="christmas-lamp-glow" color="#FFE3A3" />
      <GlowGradient id="christmas-star-glow" color="#FFE08A" />
      {BULB_COLORS.map((color) => <GlowGradient key={color} id={`christmas-glow-${color}`} color={BULB_HEX[color]} />)}
    </defs>

    <rect id="christmas-sky" width="1600" height="1000" fill="url(#christmas-sky-gradient)" />

    <Twinkles id="christmas-stars" count={55} seed={3} area={{ x: [0, 1600], y: [0, 560] }} size={[1.2, 3]} />
    <Twinkles id="christmas-bright-stars" count={8} seed={8} area={{ x: [0, 1600], y: [20, 420] }} size={[6, 11]} shape="sparkle" />

    <g id="christmas-moon">
      <circle className="moon-glow pulse" cx="1240" cy="210" r="260" fill="url(#christmas-moon-glow-gradient)" />
      <circle className="moon-disc" cx="1240" cy="210" r="72" />
      <circle cx="1218" cy="192" r="12" fill="#EDE3C2" opacity="0.6" />
      <circle cx="1262" cy="228" r="16" fill="#EDE3C2" opacity="0.5" />
      <circle cx="1250" cy="182" r="6" fill="#EDE3C2" opacity="0.6" />
    </g>

    <g id="christmas-santa" className="santa-sleigh">
      <g transform="translate(0 175) scale(1.15)">
        <g className="bob bob--small" style={{ '--bob-duration': '2.2s' } as CSSProperties}>
          <g id="christmas-santa-trail">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <circle key={index} className="trail-sparkle" cx={-40 - index * 28} cy={34 + index * 4} r={3.5 - index * 0.45} />
            ))}
          </g>
          <g className="santa-silhouette">
            {/* Sack */}
            <path d="M2,-10 C-6,-30 8,-42 20,-36 C28,-32 28,-18 24,-10Z" />
            {/* Santa: body, head, hat with its bobble, arm holding the reins */}
            <path d="M26,-4 C24,-20 30,-30 40,-30 C50,-30 54,-20 52,-4Z" />
            <circle cx="42" cy="-36" r="7.5" />
            <path d="M34,-40 Q42,-54 56,-48 L49,-39Z" />
            <circle cx="57" cy="-48" r="3.5" />
            <path d="M48,-20 L64,-14" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Sleigh with a curled front and its runner */}
            <path d="M0,10 C0,-4 6,-10 14,-10 L24,-10 L28,0 L58,0 C62,0 64,-6 64,-14 C64,-24 74,-26 78,-19 C81,-13 77,-8 72,-5 C66,3 62,14 54,16 L10,16 C4,16 0,14 0,10Z" />
            <path d="M-6,26 L72,26 Q84,26 86,16 M14,16 V26 M52,16 V26" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Reins to the reindeer */}
            <path d="M64,-14 Q92,-6 112,-8 M150,-10 Q160,-12 172,-14" strokeWidth="1.5" fill="none" />
            {/* Two galloping reindeer */}
            {[0, 1].map((index) => (
              <g key={index} transform={`translate(${106 + index * 64} ${-6 - index * 5})`}>
                <path d="M0,0 C0,-8 8,-11 18,-11 L34,-11 C40,-11 43,-15 45,-21 L48,-28 L55,-27 L54,-17 C53,-11 49,-7 45,-5 C43,2 38,5 32,5 L12,5 C5,5 0,3 0,0Z" />
                <path d="M7,3 L-2,14 M13,4 L9,18 M32,4 L41,15 M38,2 L49,9" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M51,-27 L47,-38 M51,-27 L57,-37 M48,-35 L43,-38 M55,-34 L60,-40" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M0,-4 L-6,-9 L-3,-2Z" />
              </g>
            ))}
          </g>
        </g>
      </g>
    </g>

    <g id="christmas-hills">
      <path d={FOREST_HILL} fill="#6F83BE" />
      <g id="christmas-forest">
        {forest.map((pine) => <PineTree key={pine.x} x={pine.x} base={pine.base} height={pine.height} color="#2B3F70" shade="#3E558E" snow="#B9C8EC" trunk="#22325A" />)}
      </g>
      <path d="M0,680 C220,640 460,680 700,664 C960,646 1180,690 1400,670 C1500,662 1560,664 1600,662 L1600,1000 L0,1000Z" fill="#A9B9E3" />
      <path d="M0,800 C260,770 520,800 760,792 C1000,784 1240,810 1600,790 L1600,1000 L0,1000Z" fill="#CCD8F5" />
    </g>

    <g id="christmas-village">
      {HOUSES.map((house) => <House key={house.id} {...house} />)}
      {/* All the roof lights of the village: one set of chase phases for the whole street. */}
      <LightStrings strings={HOUSES.flatMap(houseLights)} colors={BULB_COLORS} glowPrefix="christmas-glow" className="light-strings village-lights" />
      <path d="M170,812 C400,796 700,806 1100,800 L1100,830 L170,830Z" fill="#DCE5FA" />
    </g>

    <g id="christmas-lamps">
      {[[160, 820], [1100, 828]].map(([x, base]) => (
        <g key={x} className="lamp">
          <circle className="lamp-glow pulse" cx={x} cy={base - 150} r="70" fill="url(#christmas-lamp-glow)" style={{ '--pulse-duration': '4s' } as CSSProperties} />
          <rect x={x - 4} y={base - 140} width="8" height="140" fill="#2A2F45" />
          <path d={`M${x - 16},${base - 140} L${x + 16},${base - 140} L${x + 10},${base - 168} L${x - 10},${base - 168}Z`} fill="#FFE7A8" />
          <path d={`M${x - 20},${base - 168} L${x + 20},${base - 168} L${x},${base - 184}Z`} fill="#2A2F45" />
          <path d={`M${x - 22},${base - 170} L${x + 22},${base - 170} L${x},${base - 188}Z`} fill="#F4F7FF" opacity="0.9" />
        </g>
      ))}
    </g>

    <g id="christmas-tree">
      <rect x="1317.4" y="860" width="25.2" height="70" fill="#5A3322" />
      <PineTree x={1330} base={890} height={420} color="#1F6F4A" shade="#2E8B5C" snow="#E8F0FF" trunk="#5A3322" />
      <g id="christmas-tree-lights">
        <LightStrings strings={TREE_LIGHTS} colors={BULB_COLORS} glowPrefix="christmas-glow" />
      </g>
      <g id="christmas-ornaments">
        {ornaments.map((ornament, index) => <circle key={index} cx={ornament.x} cy={ornament.y} r="8" fill={ornament.color} stroke="#00000022" />)}
      </g>
      <g id="christmas-star">
        <circle className="star-glow pulse" cx="1330" cy="462" r="90" fill="url(#christmas-star-glow)" />
        <g transform="translate(1330 462)">
          <g className="star-rays rotate">
            {[0, 45, 90, 135].map((angle) => <rect key={angle} x="-2" y="-60" width="4" height="120" rx="2" transform={`rotate(${angle})`} />)}
          </g>
          <path className="star-shape" d={STAR} />
        </g>
      </g>
    </g>

    <g id="christmas-foreground">
      <path d="M0,900 C200,870 420,890 640,915 C820,935 1000,925 1200,925 C1400,925 1500,915 1600,905 L1600,1000 L0,1000Z" fill="#EAF0FF" />
      <PineTree x={70} base={930} height={300} color="#1F5F45" shade="#2E7D5A" snow="#F4F7FF" />
      <LightStrings strings={FOREGROUND_LIGHTS} colors={BULB_COLORS} glowPrefix="christmas-glow" />
    </g>

    <g id="christmas-presents">
      {[
        [1210, 878, 64, 52, '#D64550', '#FFD166'],
        [1390, 888, 56, 42, '#5BC0EB', '#F4F1DE'],
        [1446, 898, 44, 34, '#5DD39E', '#D64550'],
      ].map(([x, y, width, height, box, ribbon]) => {
        const [px, py, w, h] = [x, y, width, height] as number[];
        const cx = px + w / 2;
        return (
          <g key={px} className="present">
            <rect x={px} y={py} width={w} height={h} fill={box as string} />
            <rect x={px - 3} y={py} width={w + 6} height={h * 0.22} fill={box as string} />
            <rect x={px - 3} y={py} width={w + 6} height={h * 0.22} fill="#000000" opacity="0.08" />
            <rect x={cx - 5} y={py} width="10" height={h} fill={ribbon as string} />
            <path d={`M${cx},${py} C${cx - 20},${py - 18} ${cx - 24},${py + 2} ${cx},${py} C${cx + 20},${py - 18} ${cx + 24},${py + 2} ${cx},${py}Z`} fill={ribbon as string} />
          </g>
        );
      })}
    </g>
    <Twinkles id="christmas-snow-glints" count={14} seed={9} area={{ x: [0, 1600], y: [905, 990] }} size={[3, 7]} shape="sparkle" />

    <g id="christmas-snowfall">
      <Particles id="christmas-snow-far" count={38} seed={4} renderParticle={renderFlake} x={SNOW_X} scale={[0.3, 0.55]} duration={[15, 24]} sway={[10, 30]} />
      <Particles id="christmas-snow-near" count={24} seed={6} renderParticle={renderFlake} x={SNOW_X} scale={[0.7, 1.1]} duration={[9, 15]} sway={[20, 50]} />
    </g>
  </svg>
));
ChristmasBackground.displayName = 'ChristmasBackground';
