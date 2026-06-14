import { useId } from 'react';
import { COMPANION } from '../geometry';

interface CompanionProps {
  companion: string;
}

/**
 * A small, charming sea creature swimming beside the merperson.
 * Pure function of props. `none` renders nothing (mirrors Top.tsx);
 * any unknown non-none id falls back to the clownfish so it is never blank.
 *
 * All geometry derives from the COMPANION anchor (cx, cy, r); local shape
 * offsets are expressed relative to that anchor so nothing is hardcoded
 * to an absolute canvas coordinate.
 */
export function Companion({ companion }: CompanionProps) {
  // useId() must run unconditionally on every render (Rules of Hooks):
  // calling it after the early `none` return would change the hook count
  // when the prop toggles, desyncing React's hook list. Mirrors Tail.tsx,
  // which calls useId() at the very top.
  const uid = useId();
  if (companion === 'none') return null;

  const { cx, cy, r } = COMPANION;

  switch (companion) {
    case 'seahorse':
      return <Seahorse cx={cx} cy={cy} r={r} uid={uid} />;
    case 'jelly':
      return <Jelly cx={cx} cy={cy} r={r} uid={uid} />;
    case 'clownfish':
    default:
      return <Clownfish cx={cx} cy={cy} r={r} uid={uid} />;
  }
}

interface CreatureProps {
  cx: number;
  cy: number;
  r: number;
  uid: string;
}

/** Classic clownfish: orange body, white bands, black trim, little fins. */
function Clownfish({ cx, cy, r, uid }: CreatureProps) {
  const orange = '#f07820';
  const deep = '#d4601a';
  const white = '#fef3e8';
  const black = '#2a1810';
  const gradId = `comp-fish-${uid}`;

  // Body spans roughly ±r horizontally, ±0.62r vertically; tail to the left,
  // head to the right (swimming toward the figure).
  const bw = r;        // body half-length
  const bh = r * 0.62; // body half-height

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={orange} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>

      {/* tail fin (left) */}
      <path
        d={`M ${cx - bw} ${cy} L ${cx - bw - r * 0.5} ${cy - bh * 0.8} L ${cx - bw - r * 0.42} ${cy} L ${cx - bw - r * 0.5} ${cy + bh * 0.8} Z`}
        fill={deep}
      />
      {/* top (dorsal) + bottom fins — filled triangular fins sitting on the
          body. Each is a closed shape: base on the body, an apex curving
          away, then back along the body to the start (so it fills, rather
          than collapsing to a thin two-point sliver). */}
      <path
        d={`M ${cx - bw * 0.2} ${cy - bh * 0.85} Q ${cx} ${cy - bh - r * 0.55} ${cx + bw * 0.35} ${cy - bh * 0.7} L ${cx + bw * 0.05} ${cy - bh * 0.45} Z`}
        fill={deep}
      />
      <path
        d={`M ${cx - bw * 0.2} ${cy + bh * 0.85} Q ${cx} ${cy + bh + r * 0.45} ${cx + bw * 0.35} ${cy + bh * 0.7} L ${cx + bw * 0.05} ${cy + bh * 0.45} Z`}
        fill={deep}
      />

      {/* body */}
      <ellipse cx={cx} cy={cy} rx={bw} ry={bh} fill={`url(#${gradId})`} />

      {/* three white bands with black trim */}
      {[-0.42, 0.05, 0.5].map((f, i) => {
        const bx = cx + f * bw;
        const hh = bh * (1 - Math.abs(f) * 0.35);
        return (
          <g key={i}>
            <path d={`M ${bx} ${cy - hh} Q ${bx - r * 0.12} ${cy} ${bx} ${cy + hh}`} stroke={black} strokeWidth={r * 0.18} fill="none" strokeLinecap="round" />
            <path d={`M ${bx} ${cy - hh} Q ${bx - r * 0.12} ${cy} ${bx} ${cy + hh}`} stroke={white} strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
          </g>
        );
      })}

      {/* eye (head end, right) */}
      <circle cx={cx + bw * 0.66} cy={cy - bh * 0.18} r={r * 0.16} fill={white} />
      <circle cx={cx + bw * 0.69} cy={cy - bh * 0.18} r={r * 0.09} fill={black} />
    </g>
  );
}

/** Curled seahorse silhouette with a coronet and ridged back. */
function Seahorse({ cx, cy, r, uid }: CreatureProps) {
  const body = '#f0b030';
  const deep = '#d68a18';
  const dark = '#a86610';
  const gradId = `comp-horse-${uid}`;

  // Centre the curled body on the anchor; it reads taller than wide.
  // Origin at the anchor; offsets in units of r.
  const x = (u: number) => cx + u * r;
  const y = (v: number) => cy + v * r;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={body} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>

      {/* curled body + snout: head top-left, belly bulges right, tail curls in */}
      <path
        d={[
          `M ${x(-0.3)} ${y(-1.0)}`,                         // crown / back of head
          `C ${x(0.5)} ${y(-1.0)} ${x(0.6)} ${y(-0.45)} ${x(0.3)} ${y(-0.2)}`,  // back of neck
          `C ${x(0.95)} ${y(-0.05)} ${x(0.95)} ${y(0.7)} ${x(0.3)} ${y(0.85)}`, // round belly
          `C ${x(0.75)} ${y(0.9)} ${x(0.7)} ${y(1.25)} ${x(0.25)} ${y(1.15)}`,  // tail curl
          `C ${x(-0.05)} ${y(1.1)} ${x(0.05)} ${y(0.85)} ${x(0.2)} ${y(0.85)}`, // inner tail
          `C ${x(-0.1)} ${y(0.7)} ${x(-0.1)} ${y(-0.05)} ${x(0.05)} ${y(-0.2)}`,// front of body
          `C ${x(-0.2)} ${y(-0.3)} ${x(-0.35)} ${y(-0.55)} ${x(-0.3)} ${y(-0.75)}`, // throat
          // snout pointing up-left
          `L ${x(-0.95)} ${y(-0.95)}`,
          `L ${x(-0.8)} ${y(-0.7)}`,
          `C ${x(-0.55)} ${y(-0.85)} ${x(-0.45)} ${y(-0.95)} ${x(-0.3)} ${y(-1.0)}`,
          'Z',
        ].join(' ')}
        fill={`url(#${gradId})`}
      />

      {/* dorsal ridge bumps along the back */}
      {[-0.55, -0.2, 0.2, 0.55].map((v, i) => (
        <circle key={i} cx={x(0.55)} cy={y(v)} r={r * 0.07} fill={dark} opacity={0.5} />
      ))}

      {/* coronet on the head */}
      <path d={`M ${x(-0.32)} ${y(-1.0)} l ${r * 0.1} ${-r * 0.22} l ${r * 0.12} ${r * 0.18} l ${r * 0.14} ${-r * 0.2} l ${r * 0.1} ${r * 0.22}`} stroke={deep} strokeWidth={r * 0.1} fill="none" strokeLinejoin="round" />

      {/* eye */}
      <circle cx={x(-0.32)} cy={y(-0.62)} r={r * 0.1} fill="#2a1810" />
    </g>
  );
}

/** Translucent jellyfish: rounded bell with a scalloped rim + trailing tentacles. */
function Jelly({ cx, cy, r, uid }: CreatureProps) {
  const gradId = `comp-jelly-${uid}`;
  const tint = '#9ad7e8';
  const deep = '#5fa8c4';

  const bellW = r * 0.95;     // bell half-width
  const bellTop = cy - r * 0.7;
  const rimY = cy + r * 0.15; // bottom of the bell / where tentacles begin

  // Scalloped rim across the bottom of the bell.
  const scallops = 5;
  let rim = `M ${cx - bellW} ${rimY}`;
  for (let i = 0; i < scallops; i += 1) {
    const x0 = cx - bellW + (i / scallops) * bellW * 2;
    const x1 = cx - bellW + ((i + 1) / scallops) * bellW * 2;
    rim += ` Q ${(x0 + x1) / 2} ${rimY + r * 0.22} ${x1} ${rimY}`;
  }

  // Tentacles: a few wavy strands drifting down from the rim.
  const tentacles = [-0.6, -0.25, 0.1, 0.45, 0.75];

  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#cdeef6" stopOpacity={0.95} />
          <stop offset="100%" stopColor={tint} stopOpacity={0.7} />
        </radialGradient>
      </defs>

      {/* trailing tentacles (behind the bell) */}
      {tentacles.map((f, i) => {
        const tx = cx + f * bellW;
        const len = r * (1.0 + (i % 2) * 0.5);
        return (
          <path
            key={i}
            d={`M ${tx} ${rimY} q ${r * 0.18} ${len * 0.4} 0 ${len * 0.55} q ${-r * 0.18} ${len * 0.35} 0 ${len * 0.45}`}
            stroke={deep}
            strokeWidth={r * 0.1}
            fill="none"
            strokeLinecap="round"
            opacity={0.6}
          />
        );
      })}

      {/* bell */}
      <path
        d={`M ${cx - bellW} ${rimY} C ${cx - bellW} ${bellTop} ${cx + bellW} ${bellTop} ${cx + bellW} ${rimY} Z`}
        fill={`url(#${gradId})`}
      />
      {/* scalloped rim trim */}
      <path d={rim} fill={tint} opacity={0.85} />

      {/* inner highlights */}
      <ellipse cx={cx - r * 0.25} cy={cy - r * 0.25} rx={r * 0.12} ry={r * 0.22} fill="#ffffff" opacity={0.45} />
      <path d={`M ${cx - bellW * 0.5} ${cy - r * 0.05} Q ${cx} ${cy + r * 0.05} ${cx + bellW * 0.5} ${cy - r * 0.05}`} stroke={deep} strokeWidth={r * 0.06} fill="none" opacity={0.4} />
    </g>
  );
}

export default Companion;
