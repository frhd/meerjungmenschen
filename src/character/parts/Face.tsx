import { FACE, CX } from '../geometry';

interface FaceProps {
  expression?: string;
  skinTone: string;
}

const KNOWN = new Set(['smile', 'froh', 'staunend', 'zwinkern', 'ruhig', 'lachen']);

/** The figure's right side (viewer's left) is the winking eye for 'zwinkern'. */
const WINK_SIDE = -1;

/**
 * Draws the mouth for a given expression. The `default:` branch renders the
 * smile mouth so unknown ids are never blank/mouthless (a regression test
 * relies on this). Warm stroke colors are shared across expressions.
 */
function Mouth({ expr }: { expr: string }) {
  const stroke = '#b14a5a';
  const lowerLip = '#e08090';

  switch (expr) {
    case 'froh':
      // Bigger, slightly higher upward curve than smile.
      return (
        <>
          <path
            d={`M ${CX - FACE.mouthHalf - 2} ${FACE.mouthY - 1} Q ${CX} ${FACE.mouthY + 13} ${CX + FACE.mouthHalf + 2} ${FACE.mouthY - 1}`}
            fill="none"
            stroke={stroke}
            strokeWidth={2.8}
            strokeLinecap="round"
          />
          <path
            d={`M ${CX - FACE.mouthHalf + 2} ${FACE.mouthY} Q ${CX} ${FACE.mouthY + 11} ${CX + FACE.mouthHalf - 2} ${FACE.mouthY}`}
            fill="none"
            stroke={lowerLip}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
          />
        </>
      );

    case 'lachen': {
      // Open laughing grin: a filled mouth with a lighter lower-lip / tongue hint.
      const r = FACE.mouthOpenR + 2;
      const y = FACE.mouthOpenY;
      return (
        <>
          {/* open mouth — closed path, flat top (upper teeth/lip line), rounded bottom */}
          <path
            d={`M ${CX - r} ${y - r * 0.5} Q ${CX} ${y - r * 0.7} ${CX + r} ${y - r * 0.5} Q ${CX + r} ${y + r} ${CX} ${y + r} Q ${CX - r} ${y + r} ${CX - r} ${y - r * 0.5} Z`}
            fill={stroke}
          />
          {/* lower-lip / tongue hint */}
          <path
            d={`M ${CX - r * 0.6} ${y + r * 0.4} Q ${CX} ${y + r} ${CX + r * 0.6} ${y + r * 0.4} Q ${CX} ${y + r * 0.95} ${CX - r * 0.6} ${y + r * 0.4} Z`}
            fill={lowerLip}
            opacity={0.85}
          />
        </>
      );
    }

    case 'staunend':
      // Small open "o".
      return (
        <ellipse
          cx={CX}
          cy={FACE.mouthOpenY}
          rx={FACE.mouthOpenR * 0.55}
          ry={FACE.mouthOpenR * 0.7}
          fill="none"
          stroke={stroke}
          strokeWidth={2.6}
        />
      );

    case 'zwinkern':
      // Asymmetric smirk — curve weighted to the figure's right (viewer's left).
      return (
        <path
          d={`M ${CX - FACE.mouthHalf} ${FACE.mouthY + 2} Q ${CX - 2} ${FACE.mouthY + 11} ${CX + FACE.mouthHalf} ${FACE.mouthY - 2}`}
          fill="none"
          stroke={stroke}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      );

    case 'ruhig':
      // Calm, near-flat gentle line.
      return (
        <path
          d={`M ${CX - FACE.mouthHalf} ${FACE.mouthY + 2} Q ${CX} ${FACE.mouthY + 4} ${CX + FACE.mouthHalf} ${FACE.mouthY + 2}`}
          fill="none"
          stroke={stroke}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      );

    case 'smile':
    default:
      // Gentle upward curve (also the safe fallback for unknown ids).
      return (
        <>
          <path
            d={`M ${CX - FACE.mouthHalf} ${FACE.mouthY} Q ${CX} ${FACE.mouthY + 10} ${CX + FACE.mouthHalf} ${FACE.mouthY}`}
            fill="none"
            stroke={stroke}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
          {/* lower lip warmth */}
          <path
            d={`M ${CX - FACE.mouthHalf + 3} ${FACE.mouthY + 1} Q ${CX} ${FACE.mouthY + 8} ${CX + FACE.mouthHalf - 3} ${FACE.mouthY + 1}`}
            fill="none"
            stroke={lowerLip}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
          />
        </>
      );
  }
}

/**
 * The face: brows, eyes, nose hint, mouth and blush. The mouth and eyes are
 * expression-aware (see FACE_EXPRESSIONS in data/options.ts). Unknown
 * expressions fall back to 'smile'. Pure function of its props.
 */
export function Face({ expression = 'smile', skinTone }: FaceProps) {
  const blush = `color-mix(in srgb, ${skinTone} 60%, #ff7a8a 40%)`;

  // Resolve to a known expression with a safe default; anything unknown
  // falls back to 'smile' (the regression test relies on this).
  const expr = KNOWN.has(expression) ? expression : 'smile';

  // 'staunend' opens the eyes wider/rounder.
  const eyeRY = expr === 'staunend' ? FACE.eyeRY + 3 : FACE.eyeRY;

  return (
    <g>
      {/* Blush cheeks */}
      <ellipse cx={CX - FACE.cheekDX} cy={FACE.cheekY} rx={10} ry={6} fill={blush} opacity={0.55} />
      <ellipse cx={CX + FACE.cheekDX} cy={FACE.cheekY} rx={10} ry={6} fill={blush} opacity={0.55} />

      {/* Brows */}
      <path d={`M ${CX - FACE.eyeDX - 8} ${FACE.browY} Q ${CX - FACE.eyeDX} ${FACE.browY - 4} ${CX - FACE.eyeDX + 8} ${FACE.browY}`} fill="none" stroke="#5a4632" strokeWidth={2.4} strokeLinecap="round" />
      <path d={`M ${CX + FACE.eyeDX - 8} ${FACE.browY} Q ${CX + FACE.eyeDX} ${FACE.browY - 4} ${CX + FACE.eyeDX + 8} ${FACE.browY}`} fill="none" stroke="#5a4632" strokeWidth={2.4} strokeLinecap="round" />

      {/* Eyes — whites, iris, pupil, highlight, lashes. One side winks for 'zwinkern'. */}
      {[-1, 1].map((sgn) => {
        const ex = CX + sgn * FACE.eyeDX;
        const winking = expr === 'zwinkern' && sgn === WINK_SIDE;

        if (winking) {
          // Closed, curved lash arc (a downward "u") instead of an open eyeball.
          return (
            <path
              key={sgn}
              d={`M ${ex - FACE.eyeRX} ${FACE.eyeY - 1} Q ${ex} ${FACE.eyeY + FACE.eyeRY} ${ex + FACE.eyeRX} ${FACE.eyeY - 1}`}
              fill="none"
              stroke="#3a2a1a"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          );
        }

        return (
          <g key={sgn}>
            <ellipse cx={ex} cy={FACE.eyeY} rx={FACE.eyeRX} ry={eyeRY} fill="#ffffff" />
            <circle cx={ex} cy={FACE.eyeY + 1} r={5} fill="#3a2a1a" />
            <circle cx={ex} cy={FACE.eyeY + 1} r={2.4} fill="#1a1008" />
            <circle cx={ex - 1.6} cy={FACE.eyeY - 1.6} r={1.6} fill="#ffffff" />
            {/* upper lash line */}
            <path
              d={`M ${ex - FACE.eyeRX} ${FACE.eyeY - 2} Q ${ex} ${FACE.eyeY - eyeRY - 1} ${ex + FACE.eyeRX} ${FACE.eyeY - 2}`}
              fill="none"
              stroke="#3a2a1a"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Nose hint */}
      <path d={`M ${CX - 2} ${FACE.noseY - 4} Q ${CX} ${FACE.noseY + 1} ${CX + 3} ${FACE.noseY - 2}`} fill="none" stroke="#00000022" strokeWidth={2} strokeLinecap="round" />

      {/* Mouth */}
      <Mouth expr={expr} />
    </g>
  );
}
