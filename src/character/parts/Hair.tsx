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
    case 'pixie':
      // No length behind (cropped styles).
      return null;

    case 'braids': {
      // Long flowing mass behind, like `long` but softly rounded at the
      // hem — the two plaits come forward in the front layer.
      const hemY = TORSO.waistY + 50;
      const outerL = sideL - 10;
      const outerR = sideR + 10;
      return (
        <path
          d={[
            `M ${sideL + 6} ${HEAD.cy - 24}`,
            `C ${outerL} ${HEAD.cy} ${outerL} ${TORSO.bustY} ${outerL} ${hemY - 24}`,
            `Q ${outerL} ${hemY} ${CX - 16} ${hemY + 4}`,
            `L ${CX + 16} ${hemY + 4}`,
            `Q ${outerR} ${hemY} ${outerR} ${hemY - 24}`,
            `C ${outerR} ${TORSO.bustY} ${outerR} ${HEAD.cy} ${sideR - 6} ${HEAD.cy - 24}`,
            `C ${CX + 30} ${HEAD.cy - 40} ${CX - 30} ${HEAD.cy - 40} ${sideL + 6} ${HEAD.cy - 24}`,
            'Z',
          ].join(' ')}
          fill={color}
        />
      );
    }

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
      // SLEEK + STRAIGHT, very long: hair drops in near-vertical
      // straight columns well past the waist with a clean flat hem.
      // Deliberately NO undulation on the outer edges — the contrast
      // with `wavy` is the whole point.
      const hemY = TORSO.waistY + 70; // very long
      const outerL = sideL - 12;
      const outerR = sideR + 12;
      return (
        <>
          <path
            d={[
              `M ${sideL + 6} ${HEAD.cy - 24}`,
              // straight left flank, barely tapering
              `C ${outerL} ${HEAD.cy} ${outerL} ${TORSO.bustY} ${outerL + 2} ${hemY - 16}`,
              // clean, almost-flat hem
              `Q ${outerL + 2} ${hemY} ${outerL + 12} ${hemY}`,
              `L ${outerR - 12} ${hemY}`,
              `Q ${outerR - 2} ${hemY} ${outerR - 2} ${hemY - 16}`,
              // straight right flank
              `C ${outerR} ${TORSO.bustY} ${outerR} ${HEAD.cy} ${sideR - 6} ${HEAD.cy - 24}`,
              `C ${CX + 30} ${HEAD.cy - 40} ${CX - 30} ${HEAD.cy - 40} ${sideL + 6} ${HEAD.cy - 24}`,
              'Z',
            ].join(' ')}
            fill={color}
          />
          {/* sleek straight strand lines for a glossy, ironed look */}
          {[-1, 1].map((sgn) => (
            <path
              key={sgn}
              d={`M ${CX + sgn * (HEAD.rx - 4)} ${HEAD.cy + 10} L ${CX + sgn * (HEAD.rx + 4)} ${hemY - 18}`}
              stroke={dark}
              strokeWidth={2}
              opacity={0.3}
              strokeLinecap="round"
            />
          ))}
        </>
      );
    }

    case 'wavy':
    default: {
      // WAVY/CURLY: both outer edges undulate in a clear scalloped
      // ripple all the way down, and the hem is a row of round curls.
      // Built procedurally so the wave is unmistakable at a glance.
      const topL = HEAD.cy - 24;
      const startY = HEAD.cy + 6;
      const hemY = TORSO.waistY + 24;
      const span = hemY - startY;
      const waves = 4; // ripples per flank
      const baseL = sideL - 10; // mean x of left flank
      const baseR = sideR + 10;
      const amp = 12; // how far the ripple swings out/in

      const seg = span / waves;
      // Undulating flank, drawn TOP → BOTTOM. `dir` = -1 left, +1 right;
      // the outward swing is on the body's own side so both edges ripple.
      const flankDown = (baseX: number, dir: number) => {
        let d = '';
        for (let i = 0; i < waves; i += 1) {
          const y1 = startY + seg * (i + 1);
          const cx1 = baseX + dir * amp;
          const cx2 = baseX - dir * amp * 0.4;
          d += `C ${cx1} ${y1 - seg * 0.75} ${cx2} ${y1 - seg * 0.25} ${baseX} ${y1} `;
        }
        return d;
      };
      // Same ripple, drawn BOTTOM → TOP for the return up the right flank.
      const flankUp = (baseX: number, dir: number) => {
        let d = '';
        for (let i = waves - 1; i >= 0; i -= 1) {
          const y0 = startY + seg * i;
          const cx1 = baseX + dir * amp;
          const cx2 = baseX - dir * amp * 0.4;
          d += `C ${cx1} ${y0 + seg * 0.75} ${cx2} ${y0 + seg * 0.25} ${baseX} ${y0} `;
        }
        return d;
      };

      // Scalloped curly hem: a row of round lobes (left → right).
      const lobeY = hemY;
      const hem =
        `Q ${CX - 40} ${lobeY + 16} ${CX - 20} ${lobeY + 6} ` +
        `Q ${CX - 8} ${lobeY + 22} ${CX} ${lobeY + 8} ` +
        `Q ${CX + 8} ${lobeY + 22} ${CX + 20} ${lobeY + 6} ` +
        `Q ${CX + 40} ${lobeY + 16} ${baseR} ${hemY} `;

      return (
        <path
          d={[
            `M ${sideL + 6} ${topL}`,
            `C ${baseL - 4} ${HEAD.cy - 6} ${baseL} ${startY - 8} ${baseL} ${startY}`,
            // down the rippling left flank
            flankDown(baseL, -1),
            // cross the bottom with curly lobes (left → right)
            hem,
            // up the rippling right flank
            flankUp(baseR, 1),
            `C ${baseR} ${startY - 8} ${baseR + 4} ${HEAD.cy - 6} ${sideR - 6} ${topL}`,
            `C ${CX + 30} ${HEAD.cy - 40} ${CX - 30} ${HEAD.cy - 40} ${sideL + 6} ${topL}`,
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

    case 'pixie': {
      // Cropped pixie: a close dome with a longer side-swept fringe that
      // sweeps across to one side, plus a wispy pointed sideburn.
      return (
        <>
          <path
            d={dome(
              `C ${sideR - 4} ${HEAD.cy - 2} ${sideR - 12} ${browY - 10} ${CX + 18} ${browY - 2}` +
                ` Q ${CX - 4} ${browY + 10} ${sideL + 10} ${HEAD.cy - 8}` +
                ` Q ${sideL + 2} ${HEAD.cy + 2} ${sideL - 2} ${HEAD.cy + 6}`,
            )}
            fill={color}
          />
          {/* side-swept fringe sweep line */}
          <path
            d={`M ${CX + 18} ${browY - 2} Q ${CX - 2} ${browY + 8} ${sideL + 12} ${HEAD.cy - 6}`}
            fill="none"
            stroke={dark}
            strokeWidth={2}
            opacity={0.4}
          />
          {/* little tapered sideburn */}
          <path
            d={`M ${sideR + 2} ${HEAD.cy} Q ${sideR} ${HEAD.cy + 10} ${sideR - 6} ${HEAD.cy + 8}`}
            fill={color}
          />
        </>
      );
    }

    case 'braids': {
      // Centre-parted bangs (like long) PLUS two braided plaits coming
      // forward over the shoulders — each a stack of stitched lobes.
      const braidTopY = HEAD.cy + 6;
      const braidBottomY = TORSO.bustY + 20;
      const seg = 12;
      // The two plaits drawn as overlapping ellipses (knot-like segments).
      const segments: Array<{ x: number; y: number }> = [];
      for (const bx of [sideL + 6, sideR - 6]) {
        for (let y = braidTopY; y <= braidBottomY; y += seg) {
          segments.push({ x: bx, y });
        }
      }
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
          {/* two braided plaits down the sides */}
          {segments.map((s, i) => (
            <ellipse
              key={i}
              cx={s.x + (i % 2 === 0 ? -3 : 3)}
              cy={s.y}
              rx={9}
              ry={8}
              fill={color}
              stroke={dark}
              strokeWidth={1.5}
              opacity={0.95}
            />
          ))}
        </>
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
