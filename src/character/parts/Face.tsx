import { FACE, CX } from '../geometry';

interface FaceProps {
  expression?: string;
  skinTone: string;
}

/**
 * The face: brows, eyes, nose hint, mouth and blush. Currently one
 * expression ('smile'); the switch is structured so more can be added.
 * Unknown expressions fall back to 'smile'.
 */
export function Face({ expression = 'smile', skinTone }: FaceProps) {
  const blush = `color-mix(in srgb, ${skinTone} 60%, #ff7a8a 40%)`;

  // Resolve to a known expression with a safe default. New expressions
  // can be added to this map; anything unknown falls back to 'smile'.
  const known = new Set(['smile']);
  const expr = known.has(expression) ? expression : 'smile';

  return (
    <g>
      {/* Blush cheeks */}
      <ellipse cx={CX - FACE.cheekDX} cy={FACE.cheekY} rx={10} ry={6} fill={blush} opacity={0.55} />
      <ellipse cx={CX + FACE.cheekDX} cy={FACE.cheekY} rx={10} ry={6} fill={blush} opacity={0.55} />

      {/* Brows */}
      <path d={`M ${CX - FACE.eyeDX - 8} ${FACE.browY} Q ${CX - FACE.eyeDX} ${FACE.browY - 4} ${CX - FACE.eyeDX + 8} ${FACE.browY}`} fill="none" stroke="#5a4632" strokeWidth={2.4} strokeLinecap="round" />
      <path d={`M ${CX + FACE.eyeDX - 8} ${FACE.browY} Q ${CX + FACE.eyeDX} ${FACE.browY - 4} ${CX + FACE.eyeDX + 8} ${FACE.browY}`} fill="none" stroke="#5a4632" strokeWidth={2.4} strokeLinecap="round" />

      {/* Eyes — whites, iris, pupil, highlight, lashes */}
      {[-1, 1].map((sgn) => {
        const ex = CX + sgn * FACE.eyeDX;
        return (
          <g key={sgn}>
            <ellipse cx={ex} cy={FACE.eyeY} rx={FACE.eyeRX} ry={FACE.eyeRY} fill="#ffffff" />
            <circle cx={ex} cy={FACE.eyeY + 1} r={5} fill="#3a2a1a" />
            <circle cx={ex} cy={FACE.eyeY + 1} r={2.4} fill="#1a1008" />
            <circle cx={ex - 1.6} cy={FACE.eyeY - 1.6} r={1.6} fill="#ffffff" />
            {/* upper lash line */}
            <path
              d={`M ${ex - FACE.eyeRX} ${FACE.eyeY - 2} Q ${ex} ${FACE.eyeY - FACE.eyeRY - 1} ${ex + FACE.eyeRX} ${FACE.eyeY - 2}`}
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
      {expr === 'smile' && (
        <>
          <path
            d={`M ${CX - FACE.mouthHalf} ${FACE.mouthY} Q ${CX} ${FACE.mouthY + 10} ${CX + FACE.mouthHalf} ${FACE.mouthY}`}
            fill="none"
            stroke="#b14a5a"
            strokeWidth={2.6}
            strokeLinecap="round"
          />
          {/* lower lip warmth */}
          <path
            d={`M ${CX - FACE.mouthHalf + 3} ${FACE.mouthY + 1} Q ${CX} ${FACE.mouthY + 8} ${CX + FACE.mouthHalf - 3} ${FACE.mouthY + 1}`}
            fill="none"
            stroke="#e08090"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
          />
        </>
      )}
    </g>
  );
}
