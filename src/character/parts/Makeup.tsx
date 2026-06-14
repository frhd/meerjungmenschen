import type { Character } from '../../types';
import { FACE, MAKEUP, CX } from '../geometry';

interface MakeupProps {
  makeup: Character['makeup'];
  skinTone: string;
}

/** Dark cosmetic colour shared by eyeliner & lashes. */
const LINER = '#2a2018';

/**
 * Cosmetic overlay painted ON TOP of the Face: rouge (blush), Lidschatten
 * (eyeshadow), eyeliner & Wimpern, Sommersprossen (freckles) and Lippenstift
 * (lips). Pure function of its props — no state, no context.
 *
 * Every sub-layer renders NOTHING (null) when its style is 'none' or any
 * unrecognised id, so a partial/garbage makeup object never throws or breaks
 * the figure (a regression test relies on this). All coordinates derive from
 * the FACE / MAKEUP anchors in geometry.ts; shading uses CSS color-mix so it
 * reads on every skin tone. Sub-layers are drawn back-to-front:
 * blush → eyeshadow → eyeliner → freckles → lips.
 */
export function Makeup({ makeup, skinTone }: MakeupProps) {
  return (
    <g>
      <Blush style={makeup?.blush?.style} color={makeup?.blush?.color} skinTone={skinTone} />
      <Eyeshadow style={makeup?.eyeshadow?.style} color={makeup?.eyeshadow?.color} />
      <Eyeliner style={makeup?.eyeliner} />
      <Freckles style={makeup?.freckles} skinTone={skinTone} />
      <Lips style={makeup?.lips?.style} color={makeup?.lips?.color} />
    </g>
  );
}

/** Rouge — colored cheek ellipses blended toward the skin tone. */
function Blush({ style, color, skinTone }: { style?: string; color?: string; skinTone: string }) {
  if (style !== 'sanft' && style !== 'kraeftig') return null;
  const fill = `color-mix(in srgb, ${color ?? '#d6486a'} 55%, ${skinTone} 45%)`;
  const rx = style === 'kraeftig' ? 13 : 9;
  const opacity = style === 'kraeftig' ? 0.55 : 0.35;
  return (
    <>
      {[-1, 1].map((sgn) => (
        <ellipse
          key={sgn}
          cx={CX + sgn * FACE.cheekDX}
          cy={FACE.cheekY}
          rx={rx}
          ry={rx * 0.6}
          fill={fill}
          opacity={opacity}
        />
      ))}
    </>
  );
}

/** Lidschatten — a soft colour wash just above each eye. */
function Eyeshadow({ style, color }: { style?: string; color?: string }) {
  if (style !== 'sanft' && style !== 'smokey' && style !== 'glitzer') return null;
  const base = color ?? '#d6486a';
  const smokey = style === 'smokey';
  // Smokey washes darker, larger and hugs more of the lid.
  const fill = smokey ? `color-mix(in srgb, ${base} 55%, #000 45%)` : base;
  const rx = smokey ? FACE.eyeRX + 5 : FACE.eyeRX + 2;
  const ry = smokey ? FACE.eyeRY - 1 : FACE.eyeRY - 3;
  const cy = FACE.eyeY + MAKEUP.shadowDy + (smokey ? 2 : 0);

  return (
    <>
      {[-1, 1].map((sgn) => {
        const ex = CX + sgn * FACE.eyeDX;
        return (
          <g key={sgn}>
            <ellipse cx={ex} cy={cy} rx={rx} ry={ry} fill={fill} opacity={0.5} />
            {style === 'glitzer' && (
              <>
                <circle cx={ex - 3} cy={cy - 1} r={1} fill="#fff6e0" opacity={0.9} />
                <circle cx={ex + 2} cy={cy + 1} r={1.2} fill="#fffefb" opacity={0.85} />
                <circle cx={ex + sgn * 4} cy={cy - 2} r={0.9} fill="#fff6e0" opacity={0.8} />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

/** Eyeliner & Wimpern — dark strokes following the upper lash line. */
function Eyeliner({ style }: { style?: string }) {
  if (style !== 'klassik' && style !== 'katzenaugen' && style !== 'wimpern') return null;

  return (
    <>
      {[-1, 1].map((sgn) => {
        const ex = CX + sgn * FACE.eyeDX;
        // The outer corner is the side away from CX.
        const outerX = ex + sgn * FACE.eyeRX;
        return (
          <g key={sgn}>
            {/* thicker liner along the upper lash line (mirrors Face.tsx) */}
            <path
              d={`M ${ex - FACE.eyeRX} ${FACE.eyeY - 2} Q ${ex} ${FACE.eyeY - FACE.eyeRY - 1} ${ex + FACE.eyeRX} ${FACE.eyeY - 2}`}
              fill="none"
              stroke={LINER}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            {style === 'katzenaugen' && (
              // Winged flick up-and-out from the outer corner.
              <path
                d={`M ${outerX} ${FACE.eyeY - 2} Q ${outerX + sgn * 4} ${FACE.eyeY - 4} ${outerX + sgn * 7} ${FACE.eyeY - 7}`}
                fill="none"
                stroke={LINER}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            )}
            {style === 'wimpern' &&
              // A few short lashes radiating up from the upper lid.
              [-0.6, -0.1, 0.4].map((t, i) => {
                const lx = ex + t * FACE.eyeRX;
                const ly = FACE.eyeY - FACE.eyeRY + 1;
                return (
                  <line
                    key={i}
                    x1={lx}
                    y1={ly}
                    x2={lx + t * 2}
                    y2={ly - 4}
                    stroke={LINER}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                  />
                );
              })}
          </g>
        );
      })}
    </>
  );
}

/** Sommersprossen — small skin-derived dots scattered over cheeks/nose. */
function Freckles({ style, skinTone }: { style?: string; skinTone: string }) {
  if (style !== 'wenig' && style !== 'viele') return null;
  const fill = `color-mix(in srgb, ${skinTone} 55%, #6b3a1f 45%)`;
  const dots = style === 'wenig' ? MAKEUP.freckleDots.slice(0, 6) : MAKEUP.freckleDots;
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={fill} opacity={0.6} />
      ))}
    </>
  );
}

/** Lippenstift — a filled lip shape overlaying the mouth. */
function Lips({ style, color }: { style?: string; color?: string }) {
  if (style !== 'klassik' && style !== 'voll' && style !== 'herz') return null;
  const base = color ?? '#d6486a';
  const edge = `color-mix(in srgb, ${base} 70%, #000 30%)`;

  const y = MAKEUP.lipY;
  const half = MAKEUP.lipHalf;
  // Vertical reach of upper/lower lips; 'voll' is taller, 'herz' is smaller.
  const upRise = style === 'voll' ? 5 : style === 'herz' ? 3 : 4;
  const downDrop = style === 'voll' ? 9 : style === 'herz' ? 6 : 7;
  // 'herz' pulls the lip corners inward for a pointed pout.
  const halfX = style === 'herz' ? half - 4 : half;

  // Upper lip: a gentle cupid's-bow (dip at the centre, peaks either side).
  const upper =
    `M ${CX - halfX} ${y}` +
    ` Q ${CX - halfX * 0.55} ${y - upRise} ${CX - halfX * 0.2} ${y - upRise * 0.55}` +
    ` Q ${CX} ${y + 1} ${CX + halfX * 0.2} ${y - upRise * 0.55}` +
    ` Q ${CX + halfX * 0.55} ${y - upRise} ${CX + halfX} ${y}` +
    ` Q ${CX} ${y + 2} ${CX - halfX} ${y} Z`;

  // Lower lip: a soft rounded curve below the seam.
  const lower =
    `M ${CX - halfX} ${y}` +
    ` Q ${CX} ${y + downDrop} ${CX + halfX} ${y}` +
    ` Q ${CX} ${y + 2} ${CX - halfX} ${y} Z`;

  // Gloss highlight on the lower lip — fuller for 'voll'.
  const glossW = style === 'voll' ? halfX * 0.5 : halfX * 0.4;

  return (
    <g>
      <path d={lower} fill={base} stroke={edge} strokeWidth={0.6} />
      <path d={upper} fill={base} stroke={edge} strokeWidth={0.6} />
      {/* lip line in the seam */}
      <path
        d={`M ${CX - halfX} ${y} Q ${CX} ${y + 2} ${CX + halfX} ${y}`}
        fill="none"
        stroke={edge}
        strokeWidth={0.8}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* soft gloss on the lower lip */}
      <ellipse
        cx={CX}
        cy={y + downDrop * 0.45}
        rx={glossW}
        ry={style === 'voll' ? 2.2 : 1.6}
        fill="#ffffff"
        opacity={style === 'voll' ? 0.4 : 0.3}
      />
    </g>
  );
}
