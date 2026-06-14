import { HEAD, CX, TORSO } from '../geometry';

export type HairLayer = 'back' | 'front';

interface HairProps {
  style: string;
  color: string;
  layer: HairLayer;
}

/**
 * Hair is drawn in two passes so it can sit both behind the body
 * (long flowing lengths) and in front of the face (crown + bangs):
 *   - layer="back"  → the long silhouette behind the head/shoulders
 *   - layer="front" → the cap of hair framing the forehead + bangs
 * Each style is a distinct silhouette anchored to the head geometry.
 */
export function Hair({ style, color, layer }: HairProps) {
  const dark = `color-mix(in srgb, ${color} 80%, #000 20%)`;
  const light = `color-mix(in srgb, ${color} 82%, #fff 18%)`;

  if (layer === 'back') {
    return <g>{backLengths(style, color, dark)}</g>;
  }
  return (
    <g>
      {frontCap(style, color, dark)}
      {/* Glossy highlight streak across the crown for shine. */}
      <path
        d={`M ${CX - 22} ${HEAD.cy - HEAD.ry + 16} Q ${CX - 6} ${HEAD.cy - HEAD.ry + 6} ${CX + 14} ${HEAD.cy - HEAD.ry + 18}`}
        fill="none"
        stroke={light}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.55}
      />
    </g>
  );
}

// ── BACK layer: long flowing lengths behind the body ─────────
function backLengths(style: string, color: string, dark: string) {
  const topY = HEAD.cy - HEAD.ry + 6;
  const sideL = CX - HEAD.rx - 4;
  const sideR = CX + HEAD.rx + 4;

  switch (style) {
    case 'short':
      // No length behind.
      return null;

    case 'bun': {
      // A round bun peeking above the head + short nape.
      return (
        <>
          <circle cx={CX} cy={topY - 2} r={22} fill={color} />
          <circle cx={CX} cy={topY - 2} r={22} fill={dark} opacity={0.25} />
          <path
            d={`M ${sideL + 8} ${HEAD.cy} Q ${sideL + 2} ${HEAD.cy + 40} ${CX - 24} ${HEAD.cy + 46} L ${CX + 24} ${HEAD.cy + 46} Q ${sideR - 2} ${HEAD.cy + 40} ${sideR - 8} ${HEAD.cy} Z`}
            fill={color}
          />
        </>
      );
    }

    case 'ponytail': {
      // A ponytail sweeping down one side.
      return (
        <path
          d={[
            `M ${sideR - 10} ${HEAD.cy - 20}`,
            `C ${sideR + 30} ${HEAD.cy + 10} ${sideR + 26} ${TORSO.bustY} ${sideR + 6} ${TORSO.waistY - 30}`,
            `C ${sideR + 2} ${TORSO.waistY - 6} ${sideR - 18} ${TORSO.waistY - 4} ${sideR - 24} ${TORSO.bustY + 6}`,
            `C ${sideR - 14} ${HEAD.cy + 30} ${sideR - 24} ${HEAD.cy + 4} ${sideR - 10} ${HEAD.cy - 20}`,
            'Z',
          ].join(' ')}
          fill={color}
        />
      );
    }

    case 'long': {
      // Straight long hair framing both sides down past the waist.
      return (
        <path
          d={[
            `M ${sideL + 6} ${HEAD.cy - 24}`,
            `C ${sideL - 22} ${HEAD.cy} ${sideL - 26} ${TORSO.bustY} ${sideL - 8} ${TORSO.waistY + 6}`,
            `C ${CX - 28} ${TORSO.waistY + 18} ${CX + 28} ${TORSO.waistY + 18} ${sideR + 8} ${TORSO.waistY + 6}`,
            `C ${sideR + 26} ${TORSO.bustY} ${sideR + 22} ${HEAD.cy} ${sideR - 6} ${HEAD.cy - 24}`,
            `C ${CX + 30} ${HEAD.cy - 40} ${CX - 30} ${HEAD.cy - 40} ${sideL + 6} ${HEAD.cy - 24}`,
            'Z',
          ].join(' ')}
          fill={color}
        />
      );
    }

    case 'wavy':
    default: {
      // Wavy long hair with scalloped, flowing ends.
      return (
        <path
          d={[
            `M ${sideL + 6} ${HEAD.cy - 24}`,
            `C ${sideL - 26} ${HEAD.cy} ${sideL - 18} ${TORSO.bustY - 10} ${sideL - 22} ${TORSO.bustY + 20}`,
            `C ${sideL - 26} ${TORSO.waistY - 30} ${sideL + 4} ${TORSO.waistY - 10} ${sideL - 6} ${TORSO.waistY + 14}`,
            // scalloped bottom edge
            `Q ${CX - 36} ${TORSO.waistY - 2} ${CX - 18} ${TORSO.waistY + 18}`,
            `Q ${CX} ${TORSO.waistY - 2} ${CX + 18} ${TORSO.waistY + 18}`,
            `Q ${CX + 36} ${TORSO.waistY - 2} ${sideR + 6} ${TORSO.waistY + 14}`,
            `C ${sideR - 4} ${TORSO.waistY - 10} ${sideR + 26} ${TORSO.waistY - 30} ${sideR + 22} ${TORSO.bustY + 20}`,
            `C ${sideR + 18} ${TORSO.bustY - 10} ${sideR + 26} ${HEAD.cy} ${sideR - 6} ${HEAD.cy - 24}`,
            `C ${CX + 30} ${HEAD.cy - 40} ${CX - 30} ${HEAD.cy - 40} ${sideL + 6} ${HEAD.cy - 24}`,
            'Z',
          ].join(' ')}
          fill={color}
        />
      );
    }
  }
}

// ── FRONT layer: cap framing the forehead + bangs ────────────
function frontCap(style: string, color: string, dark: string) {
  const topY = HEAD.cy - HEAD.ry;
  const sideL = CX - HEAD.rx;
  const sideR = CX + HEAD.rx;
  // Forehead line where bangs end (eyebrow-ish height).
  const browY = HEAD.cy - 18;

  // Shared dome that hugs the top of the head.
  const dome = (bangs: string) =>
    [
      `M ${sideL - 2} ${HEAD.cy + 6}`,
      `C ${sideL - 6} ${topY + 18} ${CX - 30} ${topY - 6} ${CX} ${topY - 6}`,
      `C ${CX + 30} ${topY - 6} ${sideR + 6} ${topY + 18} ${sideR + 2} ${HEAD.cy + 6}`,
      bangs,
      'Z',
    ].join(' ');

  switch (style) {
    case 'short': {
      // Tidy short cap with a side-swept fringe.
      return (
        <>
          <path
            d={dome(
              `C ${sideR - 6} ${HEAD.cy} ${sideR - 16} ${browY - 4} ${CX + 8} ${browY + 4} C ${CX - 10} ${browY + 10} ${sideL + 18} ${HEAD.cy - 6} ${sideL - 2} ${HEAD.cy + 6}`,
            )}
            fill={color}
          />
          <path
            d={`M ${CX + 8} ${browY + 4} Q ${CX - 6} ${browY + 12} ${sideL + 18} ${HEAD.cy - 6}`}
            fill="none"
            stroke={dark}
            strokeWidth={2}
            opacity={0.4}
          />
        </>
      );
    }

    case 'bun':
    case 'ponytail': {
      // Pulled-back: smooth dome, hair off the forehead (small bang sweep).
      return (
        <path
          d={dome(
            `C ${sideR - 8} ${HEAD.cy - 4} ${CX + 24} ${browY - 8} ${CX + 4} ${browY - 4} C ${CX - 22} ${browY - 8} ${sideL + 8} ${HEAD.cy - 4} ${sideL - 2} ${HEAD.cy + 6}`,
          )}
          fill={color}
        />
      );
    }

    case 'long':
    case 'wavy':
    default: {
      // Centre-parted bangs framing the face.
      return (
        <>
          <path
            d={dome(
              `C ${sideR - 4} ${HEAD.cy} ${sideR - 20} ${browY} ${CX + 6} ${browY + 6}` +
                ` Q ${CX} ${browY - 4} ${CX - 6} ${browY + 6}` +
                ` C ${sideL + 20} ${browY} ${sideL + 4} ${HEAD.cy} ${sideL - 2} ${HEAD.cy + 6}`,
            )}
            fill={color}
          />
          {/* centre part line */}
          <path
            d={`M ${CX} ${topY + 4} L ${CX} ${browY + 2}`}
            stroke={dark}
            strokeWidth={2}
            opacity={0.3}
          />
        </>
      );
    }
  }
}
