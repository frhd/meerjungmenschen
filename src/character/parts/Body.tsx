import { HEAD, NECK, TORSO, ARM, CHIN_Y, SHOULDER_Y, CX } from '../geometry';
import type { BodyType } from '../../types';

interface BodyProps {
  skinTone: string;
  bodyType: BodyType;
}

/**
 * Per-bodyType silhouette tuning. Kept small and centralised so the
 * difference between body types is easy to read and adjust.
 *  - merman:  broader shoulders, flatter (wider) waist
 *  - mermaid: narrower shoulders, cinched waist
 *  - neutral: in-between
 */
function shape(bodyType: BodyType) {
  switch (bodyType) {
    case 'merman':
      return { shoulderHalf: 66, waistHalf: 46, bust: 0 };
    case 'neutral':
      return { shoulderHalf: 56, waistHalf: 42, bust: 6 };
    case 'mermaid':
    default:
      return { shoulderHalf: 52, waistHalf: 38, bust: 10 };
  }
}

/**
 * Body: head, neck, torso and arms+hands. Pure function of its props.
 * A slightly darker tone is derived for soft shading.
 */
export function Body({ skinTone, bodyType }: BodyProps) {
  const s = shape(bodyType);
  const shadow = `color-mix(in srgb, ${skinTone} 82%, #000 18%)`;
  const light = `color-mix(in srgb, ${skinTone} 84%, #fff 16%)`;

  const sH = s.shoulderHalf;
  const wH = s.waistHalf;
  const bust = s.bust;

  // Torso path: shoulders → bust → cinched waist, symmetric.
  const torso = [
    `M ${CX - sH} ${SHOULDER_Y}`,
    `C ${CX - sH - 4} ${TORSO.bustY - 6} ${CX - sH + 4 - bust} ${TORSO.bustY} ${CX - wH - 6} ${TORSO.bustY + 8}`,
    `C ${CX - wH - 10} ${TORSO.waistY - 30} ${CX - wH} ${TORSO.waistY - 10} ${CX - wH} ${TORSO.waistY}`,
    `L ${CX + wH} ${TORSO.waistY}`,
    `C ${CX + wH} ${TORSO.waistY - 10} ${CX + wH + 10} ${TORSO.waistY - 30} ${CX + wH + 6} ${TORSO.bustY + 8}`,
    `C ${CX + sH - 4 + bust} ${TORSO.bustY} ${CX + sH + 4} ${TORSO.bustY - 6} ${CX + sH} ${SHOULDER_Y}`,
    `Q ${CX} ${SHOULDER_Y - 14} ${CX - sH} ${SHOULDER_Y}`,
    'Z',
  ].join(' ');

  // Arms: gentle curves down the sides from shoulder to hand.
  const armL = [
    `M ${CX - sH + 6} ${SHOULDER_Y + 2}`,
    `C ${CX - sH - 8} ${TORSO.bustY + 10} ${CX - ARM.handDX - 12} ${TORSO.waistY - 50} ${CX - ARM.handDX - 6} ${ARM.handY - 14}`,
    `C ${CX - ARM.handDX - 2} ${ARM.handY - 6} ${CX - ARM.handDX} ${ARM.handY - 8} ${CX - ARM.handDX + 4} ${ARM.handY - 12}`,
    `C ${CX - wH - 2} ${TORSO.waistY - 44} ${CX - sH + 18} ${TORSO.bustY + 6} ${CX - sH + 6} ${SHOULDER_Y + 6}`,
    'Z',
  ].join(' ');
  const armR = [
    `M ${CX + sH - 6} ${SHOULDER_Y + 2}`,
    `C ${CX + sH + 8} ${TORSO.bustY + 10} ${CX + ARM.handDX + 12} ${TORSO.waistY - 50} ${CX + ARM.handDX + 6} ${ARM.handY - 14}`,
    `C ${CX + ARM.handDX + 2} ${ARM.handY - 6} ${CX + ARM.handDX} ${ARM.handY - 8} ${CX + ARM.handDX - 4} ${ARM.handY - 12}`,
    `C ${CX + wH + 2} ${TORSO.waistY - 44} ${CX + sH - 18} ${TORSO.bustY + 6} ${CX + sH - 6} ${SHOULDER_Y + 6}`,
    'Z',
  ].join(' ');

  return (
    <g>
      {/* Neck — skin coloured so it blends; a soft shadow sits under the chin */}
      <path
        d={`M ${CX - NECK.halfWidth} ${NECK.top} L ${CX - NECK.halfWidth} ${NECK.bottom} Q ${CX} ${NECK.bottom + 6} ${CX + NECK.halfWidth} ${NECK.bottom} L ${CX + NECK.halfWidth} ${NECK.top} Z`}
        fill={skinTone}
      />
      <path
        d={`M ${CX - NECK.halfWidth} ${NECK.top} Q ${CX} ${NECK.top + 8} ${CX + NECK.halfWidth} ${NECK.top} Q ${CX} ${NECK.top - 4} ${CX - NECK.halfWidth} ${NECK.top} Z`}
        fill={shadow}
        opacity={0.4}
      />

      {/* Arms (behind torso so the join is hidden) */}
      <path d={armL} fill={skinTone} />
      <path d={armR} fill={skinTone} />

      {/* Hands */}
      <ellipse cx={CX - ARM.handDX} cy={ARM.handY} rx={ARM.handRX} ry={ARM.handRY} fill={skinTone} />
      <ellipse cx={CX + ARM.handDX} cy={ARM.handY} rx={ARM.handRX} ry={ARM.handRY} fill={skinTone} />

      {/* Torso */}
      <path d={torso} fill={skinTone} />
      {/* Soft central highlight on the torso for depth */}
      <path
        d={`M ${CX - 10} ${TORSO.bustY} Q ${CX} ${TORSO.waistY - 20} ${CX - 4} ${TORSO.waistY - 4} Q ${CX + 6} ${TORSO.bustY + 20} ${CX - 10} ${TORSO.bustY} Z`}
        fill={light}
        opacity={0.5}
      />

      {/* Head */}
      <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill={skinTone} />
      {/* Cheek/jaw soft shadow toward the chin */}
      <path
        d={`M ${CX - HEAD.rx + 8} ${CHIN_Y - 30} Q ${CX} ${CHIN_Y + 2} ${CX + HEAD.rx - 8} ${CHIN_Y - 30} Q ${CX} ${CHIN_Y - 18} ${CX - HEAD.rx + 8} ${CHIN_Y - 30} Z`}
        fill={shadow}
        opacity={0.25}
      />
      {/* Ears */}
      <ellipse cx={HEAD.cx - HEAD.rx + 2} cy={HEAD.cy + 22} rx={9} ry={13} fill={skinTone} />
      <ellipse cx={HEAD.cx + HEAD.rx - 2} cy={HEAD.cy + 22} rx={9} ry={13} fill={skinTone} />
    </g>
  );
}
