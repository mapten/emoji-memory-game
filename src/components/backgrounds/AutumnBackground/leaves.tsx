// Leaf shapes (centred on 0,0, about 100 units tall), shared by the autumn scene and its falling leaves.

const MAPLE_HALF: [number, number][] = [[0, -50], [7, -33], [19, -40], [16, -16], [27, -22], [30, -30], [34, -18], [47, -20],
  [40, -6], [46, 2], [30, 8], [34, 20], [20, 17], [8, 24], [3, 30]];

export const MAPLE_LEAF = 'M' + [...MAPLE_HALF, ...MAPLE_HALF.slice(1).reverse().map(([x, y]) => [-x, y])]
  .map(([x, y]) => `${x},${y}`).join(' L') + 'Z';
const MAPLE_VEINS = 'M0,26 L0,-34 M0,6 L20,-12 M0,6 L-20,-12 M0,16 L18,10 M0,16 L-18,10';

export const OVAL_LEAF = 'M0,-45 C26,-28 26,22 0,45 C-26,22 -26,-28 0,-45Z';
const OVAL_VEINS = 'M0,40 L0,-36 M0,-10 L14,-22 M0,-10 L-14,-22 M0,10 L16,-2 M0,10 L-16,-2';

export const OAK_LEAF = 'M0,-48 C10,-48 12,-38 8,-34 C18,-36 22,-26 14,-20 C26,-20 28,-6 16,-2 C28,2 26,16 14,16 ' +
  'C22,24 16,34 6,30 C6,38 2,42 0,44 C-2,42 -6,38 -6,30 C-16,34 -22,24 -14,16 C-26,16 -28,2 -16,-2 ' +
  'C-28,-6 -26,-20 -14,-20 C-22,-26 -18,-36 -8,-34 C-12,-38 -10,-48 0,-48Z';

export type LeafKind = 'maple' | 'oak' | 'oval';

export const Leaf = ({ kind, color, veins = 'rgba(0,0,0,0.18)' }: { kind: LeafKind; color: string; veins?: string }) => {
  const outline = kind === 'maple' ? MAPLE_LEAF : kind === 'oak' ? OAK_LEAF : OVAL_LEAF;
  const veinPath = kind === 'maple' ? MAPLE_VEINS : kind === 'oak' ? 'M0,40 L0,-40' : OVAL_VEINS;

  return (
    <g className={`leaf leaf--${kind}`}>
      <path d="M0,30 L0,50" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path className="leaf-body" d={outline} fill={color} />
      <path d={veinPath} stroke={veins} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
};
