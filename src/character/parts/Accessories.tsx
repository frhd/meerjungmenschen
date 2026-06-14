import { CROWN, NECKLACE, EARRINGS, CX } from '../geometry';

interface AccessoriesProps {
  crown: boolean;
  necklace: boolean;
  earrings: boolean;
}

const GOLD = '#f4cf57';
const GOLD_DARK = '#cf9a23';
const GEM = '#e0508a';

/**
 * Optional adornments. Each renders only when its boolean is true.
 * Anchored to geometry so they sit correctly on the head/collar/ears.
 */
export function Accessories({ crown, necklace, earrings }: AccessoriesProps) {
  return (
    <g>
      {crown && <Crown />}
      {necklace && <Necklace />}
      {earrings && <Earrings />}
    </g>
  );
}

function Crown() {
  const { baseY, halfWidth, peakRise } = CROWN;
  const left = CX - halfWidth;
  const right = CX + halfWidth;
  // Three-point tiara that follows the curve of the head.
  const d = [
    `M ${left} ${baseY + 6}`,
    `L ${left} ${baseY}`,
    `L ${CX - 20} ${baseY - peakRise + 10}`,
    `L ${CX - 11} ${baseY - 4}`,
    `L ${CX} ${baseY - peakRise}`,
    `L ${CX + 11} ${baseY - 4}`,
    `L ${CX + 20} ${baseY - peakRise + 10}`,
    `L ${right} ${baseY}`,
    `L ${right} ${baseY + 6}`,
    `Q ${CX} ${baseY + 14} ${left} ${baseY + 6}`,
    'Z',
  ].join(' ');
  return (
    <g>
      <path d={d} fill={GOLD} stroke={GOLD_DARK} strokeWidth={1.5} strokeLinejoin="round" />
      {/* gems at each peak */}
      <circle cx={CX} cy={baseY - peakRise + 4} r={4} fill={GEM} />
      <circle cx={CX - 20} cy={baseY - peakRise + 12} r={3} fill={GEM} />
      <circle cx={CX + 20} cy={baseY - peakRise + 12} r={3} fill={GEM} />
      <circle cx={CX} cy={baseY + 4} r={3} fill={GEM} opacity={0.9} />
    </g>
  );
}

function Necklace() {
  const { cy, half, drop } = NECKLACE;
  return (
    <g>
      <path
        d={`M ${CX - half} ${cy} Q ${CX} ${cy + drop} ${CX + half} ${cy}`}
        fill="none"
        stroke={GOLD}
        strokeWidth={2.5}
      />
      <circle cx={CX} cy={cy + drop - 1} r={5} fill={GEM} stroke={GOLD_DARK} strokeWidth={1} />
      <circle cx={CX - half * 0.55} cy={cy + drop * 0.45} r={2.4} fill={GOLD} />
      <circle cx={CX + half * 0.55} cy={cy + drop * 0.45} r={2.4} fill={GOLD} />
    </g>
  );
}

function Earrings() {
  return (
    <g>
      {EARRINGS.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 8} stroke={GOLD} strokeWidth={1.5} />
          <circle cx={p.x} cy={p.y + 11} r={3.5} fill={GEM} stroke={GOLD_DARK} strokeWidth={0.8} />
        </g>
      ))}
    </g>
  );
}
