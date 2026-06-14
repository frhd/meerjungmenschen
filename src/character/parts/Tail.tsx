import { TAIL, CX } from '../geometry';

interface TailProps {
  shape: string;
  color: string;
  pattern: string;
}

/** Unique-enough id base so multiple stages on a page do not clash. */
let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

/** Height of the rect used to tile a scale/pattern over the whole tail. */
const TAIL_PATTERN_RECT_HEIGHT = TAIL.flukeBottomY - TAIL.startY + 32;

/**
 * The lower fish half: a tapering body from the waist down to a
 * fluke/fin, plus an optional repeating pattern overlay.
 */
export function Tail({ shape, color, pattern }: TailProps) {
  const dark = `color-mix(in srgb, ${color} 78%, #000 22%)`;
  const light = `color-mix(in srgb, ${color} 78%, #fff 22%)`;

  const clipId = nextId('tail-clip');
  const scaleId = nextId('tail-scales');

  // Tapering body of the tail: a smooth flared hip flowing into a
  // graceful S-curve down to the slim ankle just above the fluke.
  const midY = (TAIL.hipY + TAIL.ankleY) / 2;
  const body = [
    `M ${CX - TAIL.startHalf} ${TAIL.startY}`,
    // left: waist → wide hip
    `C ${CX - TAIL.hipHalf} ${TAIL.startY + 14} ${CX - TAIL.hipHalf} ${TAIL.hipY - 12} ${CX - TAIL.hipHalf} ${TAIL.hipY}`,
    // left: hip → midpoint (curving inward)
    `C ${CX - TAIL.hipHalf} ${TAIL.hipY + 28} ${CX - 26} ${midY} ${CX - 22} ${midY + 10}`,
    // left: mid → ankle
    `C ${CX - 18} ${TAIL.ankleY - 24} ${CX - TAIL.ankleHalf} ${TAIL.ankleY - 8} ${CX - TAIL.ankleHalf} ${TAIL.ankleY}`,
    `L ${CX + TAIL.ankleHalf} ${TAIL.ankleY}`,
    // right: ankle → mid
    `C ${CX + TAIL.ankleHalf} ${TAIL.ankleY - 8} ${CX + 18} ${TAIL.ankleY - 24} ${CX + 22} ${midY + 10}`,
    // right: mid → hip
    `C ${CX + 26} ${midY} ${CX + TAIL.hipHalf} ${TAIL.hipY + 28} ${CX + TAIL.hipHalf} ${TAIL.hipY}`,
    // right: hip → waist
    `C ${CX + TAIL.hipHalf} ${TAIL.hipY - 12} ${CX + TAIL.hipHalf} ${TAIL.startY + 14} ${CX + TAIL.startHalf} ${TAIL.startY}`,
    `Q ${CX} ${TAIL.startY - 14} ${CX - TAIL.startHalf} ${TAIL.startY}`,
    'Z',
  ].join(' ');

  const fluke = flukePath(shape);

  return (
    <g>
      {/* Clip pattern overlays to the tail body silhouette. */}
      <defs>
        <clipPath id={clipId}>
          <path d={body} />
          <path d={fluke} />
        </clipPath>
        {pattern === 'scales' && (
          <pattern id={scaleId} width={20} height={14} patternUnits="userSpaceOnUse">
            {/* Scallop scales: two staggered rows of arcs. */}
            <path d="M0 14 a10 10 0 0 1 20 0" fill="none" stroke={dark} strokeWidth={2} opacity={0.5} />
            <path d="M-10 7 a10 10 0 0 1 20 0" fill="none" stroke={dark} strokeWidth={2} opacity={0.5} />
            <path d="M10 7 a10 10 0 0 1 20 0" fill="none" stroke={dark} strokeWidth={2} opacity={0.5} />
          </pattern>
        )}
      </defs>

      {/* Fluke first (behind body so the join is clean) */}
      <path d={fluke} fill={dark} />
      <path d={fluke} fill={color} opacity={0.55} />

      {/* Tail body */}
      <path d={body} fill={color} />

      {/* Pattern overlay (clipped to the whole tail) */}
      <g clipPath={`url(#${clipId})`}>
        {pattern === 'scales' && (
          <rect x={CX - TAIL.flukeHalf} y={TAIL.startY - 16} width={TAIL.flukeHalf * 2} height={TAIL_PATTERN_RECT_HEIGHT} fill={`url(#${scaleId})`} />
        )}
        {pattern === 'spots' && <Spots color={light} />}
        {/* 'none' and any unknown pattern: just a soft highlight, no texture. */}
      </g>

      {/* Soft vertical highlight down the centre for depth (all patterns). */}
      <path
        d={`M ${CX - 10} ${TAIL.startY + 8} Q ${CX + 6} ${midY} ${CX} ${TAIL.ankleY - 6} Q ${CX + 10} ${midY} ${CX - 10} ${TAIL.startY + 8} Z`}
        fill={light}
        opacity={0.3}
        clipPath={`url(#${clipId})`}
      />

      {/* Darker edge along the left flank for subtle rounding. */}
      <path
        d={`M ${CX - TAIL.hipHalf + 2} ${TAIL.hipY + 6} C ${CX - TAIL.hipHalf + 4} ${TAIL.hipY + 40} ${CX - 24} ${midY} ${CX - 18} ${TAIL.ankleY - 16}`}
        fill="none"
        stroke={dark}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.3}
        clipPath={`url(#${clipId})`}
      />
    </g>
  );
}

/** Scattered polka-dot spots clipped to the tail. */
function Spots({ color }: { color: string }) {
  const dots: Array<{ x: number; y: number; r: number }> = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let row = 0; row < 12; row += 1) {
    const y = TAIL.startY + 10 + row * 36;
    const cols = 3;
    for (let c = 0; c < cols; c += 1) {
      const x = CX - 40 + c * 40 + (rand() - 0.5) * 18;
      dots.push({ x, y: y + (rand() - 0.5) * 14, r: 4 + rand() * 3 });
    }
  }
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} opacity={0.7} />
      ))}
    </>
  );
}

/** Fluke/fin silhouette by shape id, with a robust default. */
function flukePath(shape: string): string {
  const ax = TAIL.ankleHalf;
  const ay = TAIL.ankleY;
  const by = TAIL.flukeBottomY;
  const fh = TAIL.flukeHalf;

  switch (shape) {
    case 'fluke': {
      // Big whale-style horizontal fluke, two broad lobes.
      return [
        `M ${CX - ax} ${ay - 6}`,
        `C ${CX - 30} ${ay + 6} ${CX - fh} ${ay + 6} ${CX - fh - 4} ${by}`,
        `C ${CX - fh + 14} ${by - 12} ${CX - 16} ${ay + 22} ${CX} ${ay + 20}`,
        `C ${CX + 16} ${ay + 22} ${CX + fh - 14} ${by - 12} ${CX + fh + 4} ${by}`,
        `C ${CX + fh} ${ay + 6} ${CX + 30} ${ay + 6} ${CX + ax} ${ay - 6}`,
        'Z',
      ].join(' ');
    }
    case 'fin': {
      // Fan/veil tail: tall and frilly, but with softened, flowing
      // points — the tips are rounded and the notches between them are
      // smooth scallops instead of sharp angular Vs.
      const tips = [-fh, -fh * 0.55, 0, fh * 0.55, fh];
      let d = `M ${CX - ax} ${ay - 6} `;
      // smooth swoop from the ankle out to the first (leftmost) tip
      d += `C ${CX - fh * 0.5} ${ay + 8} ${CX + tips[0] + 6} ${by - 30} ${CX + tips[0]} ${by} `;
      tips.forEach((t, i) => {
        if (i < tips.length - 1) {
          const next = tips[i + 1];
          const mid = (t + next) / 2;
          // round the current tip, dip up into a smooth notch, then
          // round back down onto the next tip
          const notchY = ay + 24;
          const nextDepth = (i + 1) % 2 === 0 ? by : by - 22;
          d += `Q ${CX + t} ${by + 4} ${CX + mid} ${notchY} `;
          d += `Q ${CX + next} ${nextDepth - 6} ${CX + next} ${nextDepth} `;
        }
      });
      // smooth swoop back from the last (rightmost) tip to the ankle
      d += `C ${CX + tips[tips.length - 1] - 6} ${by - 30} ${CX + fh * 0.5} ${ay + 8} ${CX + ax} ${ay - 6} `;
      d += 'Z';
      return d;
    }
    case 'classic':
    default: {
      // Classic mermaid fluke: two soft heart-like lobes.
      return [
        `M ${CX - ax} ${ay - 4}`,
        `C ${CX - 36} ${ay + 10} ${CX - fh} ${ay + 4} ${CX - fh + 6} ${by - 8}`,
        `C ${CX - fh + 22} ${by} ${CX - 12} ${ay + 30} ${CX} ${ay + 18}`,
        `C ${CX + 12} ${ay + 30} ${CX + fh - 22} ${by} ${CX + fh - 6} ${by - 8}`,
        `C ${CX + fh} ${ay + 4} ${CX + 36} ${ay + 10} ${CX + ax} ${ay - 4}`,
        'Z',
      ].join(' ');
    }
  }
}
