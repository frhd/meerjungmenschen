import { HEAD, NECK, TORSO, ARM, CHIN_Y, SHOULDER_Y, CX, BODY_SHAPE } from '../geometry';
import type { BodyType } from '../../types';

interface BodyProps {
  skinTone: string;
  bodyType: BodyType;
}

/**
 * Body: head, neck, torso and arms+hands. Pure function of its props.
 * A slightly darker tone is derived for soft shading.
 *
 * The silhouette difference between body types is driven entirely by
 * BODY_SHAPE in geometry.ts (shoulder/waist span, bust bulge, jaw
 * width). The chest contour is part of the SKIN here so it reads even
 * with the `none` top:
 *   - merman:  broad SQUARE shoulders, flat chest, strong wide jaw
 *   - mermaid: narrow soft shoulders, cinched waist, soft bust curves
 *   - neutral: in-between everywhere
 */
export function Body({ skinTone, bodyType }: BodyProps) {
  const s = BODY_SHAPE[bodyType] ?? BODY_SHAPE.mermaid;
  const shadow = `color-mix(in srgb, ${skinTone} 82%, #000 18%)`;
  const light = `color-mix(in srgb, ${skinTone} 84%, #fff 16%)`;

  const sH = s.shoulderHalf;
  const wH = s.waistHalf;
  const bust = s.bust;
  const jawH = s.jawHalf;

  // The shoulder cap: merman gets a flat, square top edge (broad and
  // angular); mermaid a soft rounded slope. `square` scales 0→1 with
  // broadness so the corner radius shrinks as shoulders widen.
  const square = Math.max(0, Math.min(1, (sH - 47) / 31)); // 0 mermaid … 1 merman
  const shoulderDrop = 6 - square * 5; // softer (deeper) for mermaid
  const cornerIn = 6 + square * 8; // how far in the flat top starts
  // Bust line y where the chest contour sits (skin).
  const bY = TORSO.bustY;

  // Torso path: square/soft shoulders → chest contour → cinched waist.
  // Drawn symmetric, left side first.
  const torso = [
    `M ${CX - sH} ${SHOULDER_Y + shoulderDrop}`,
    // shoulder → chest: a dip then the bust bulge (bust=0 ⇒ flat)
    `C ${CX - sH} ${bY - 24} ${CX - wH - 18 - bust} ${bY - 18} ${CX - wH - 12 - bust} ${bY}`,
    `C ${CX - wH - 10 - bust} ${bY + 10 + bust * 0.5} ${CX - wH - 8} ${bY + 8} ${CX - wH - 6} ${bY + 12}`,
    // chest → cinched waist
    `C ${CX - wH - 12} ${TORSO.waistY - 30} ${CX - wH} ${TORSO.waistY - 10} ${CX - wH} ${TORSO.waistY}`,
    `L ${CX + wH} ${TORSO.waistY}`,
    // right side mirrored: waist → chest
    `C ${CX + wH} ${TORSO.waistY - 10} ${CX + wH + 12} ${TORSO.waistY - 30} ${CX + wH + 6} ${bY + 12}`,
    `C ${CX + wH + 8} ${bY + 8} ${CX + wH + 10 + bust} ${bY + 10 + bust * 0.5} ${CX + wH + 12 + bust} ${bY}`,
    `C ${CX + wH + 18 + bust} ${bY - 18} ${CX + sH} ${bY - 24} ${CX + sH} ${SHOULDER_Y + shoulderDrop}`,
    // shoulder top edge: flat (square) for merman, gently domed for mermaid
    `L ${CX + sH - cornerIn} ${SHOULDER_Y}`,
    `Q ${CX} ${SHOULDER_Y - 12 + square * 8} ${CX - sH + cornerIn} ${SHOULDER_Y}`,
    `L ${CX - sH} ${SHOULDER_Y + shoulderDrop}`,
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
      {/* Chest contour shading — part of the SKIN, so it reads with the
          `none` top. A bust (>0) gets two soft rounded breast lobes with
          an under-bust shadow; the flat merman (bust=0) gets pectoral
          lines instead so the flat chest still looks like a torso. */}
      {bust > 0 &&
        [-1, 1].map((sgn) => {
          const cx = CX + sgn * (wH * 0.42);
          const r = 13 + bust * 0.6; // bust size scales with the anchor
          return (
            <g key={sgn}>
              {/* soft round breast highlight */}
              <ellipse cx={cx} cy={bY + 2} rx={r} ry={r * 0.82} fill={light} opacity={0.45} />
              {/* under-bust crescent shadow defines the curve */}
              <path
                d={`M ${cx - r + 2} ${bY + 1} Q ${cx} ${bY + r + 4} ${cx + r - 2} ${bY + 1}`}
                fill="none"
                stroke={shadow}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.45}
              />
            </g>
          );
        })}
      {bust === 0 && (
        <g opacity={0.3}>
          {/* two flat pectoral lines + a hint of a sternum */}
          {[-1, 1].map((sgn) => (
            <path
              key={sgn}
              d={`M ${CX + sgn * 6} ${bY - 6} Q ${CX + sgn * (wH * 0.7)} ${bY - 4} ${CX + sgn * (wH * 0.8)} ${bY + 12}`}
              fill="none"
              stroke={shadow}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ))}
          <path
            d={`M ${CX} ${bY - 10} L ${CX} ${bY + 18}`}
            stroke={shadow}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      )}

      {/* Head */}
      <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill={skinTone} />
      {/* Jaw/chin shadow — width tracks the body type so the merman
          reads with a broad square jaw and the mermaid a soft narrow one. */}
      <path
        d={`M ${CX - jawH} ${CHIN_Y - 30} Q ${CX} ${CHIN_Y + 4} ${CX + jawH} ${CHIN_Y - 30} Q ${CX} ${CHIN_Y - 18} ${CX - jawH} ${CHIN_Y - 30} Z`}
        fill={shadow}
        opacity={0.25}
      />
      {/* Ears */}
      <ellipse cx={HEAD.cx - HEAD.rx + 2} cy={HEAD.cy + 22} rx={9} ry={13} fill={skinTone} />
      <ellipse cx={HEAD.cx + HEAD.rx - 2} cy={HEAD.cy + 22} rx={9} ry={13} fill={skinTone} />
    </g>
  );
}
