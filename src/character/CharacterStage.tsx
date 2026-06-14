import type { Character } from '../types';
import { VIEWBOX, PIVOTS, COMPANION } from './geometry';
import './stage.css';
import { Scene } from './parts/Scene';
import { Body } from './parts/Body';
import { Tail } from './parts/Tail';
import { Hair } from './parts/Hair';
import { Top } from './parts/Top';
import { Face } from './parts/Face';
import { Nails } from './parts/Nails';
import { Accessories } from './parts/Accessories';
import { Companion } from './parts/Companion';

interface CharacterStageProps {
  character: Character;
}

/**
 * Renders the full merperson from a Character object as ONE <svg>.
 * Parts are composed back-to-front:
 *   HairBack → Tail → Body → Top → Face → HairFront → Nails → Accessories
 * All coordinates come from geometry.ts so the parts align.
 */
export function CharacterStage({ character }: CharacterStageProps) {
  const { bodyType, skinTone, scene, face, hair, tail, top, nails, accessories, companion } = character;

  return (
    <svg
      viewBox={VIEWBOX}
      role="img"
      aria-label={`Merperson character: ${bodyType} with ${hair.style} hair and a ${tail.shape} tail`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      {/* Underwater backdrop — backmost layer, stays still while the figure floats */}
      <Scene scene={scene} />

      {/* The whole figure gently floats together; layering inside is unchanged:
          HairBack → Tail → Body → Top → Face → HairFront → Nails → Accessories */}
      <g className="anim-figure">
        {/* Long hair flowing behind the body — drifts about the crown */}
        <g
          className="anim-hairback"
          style={{ transformOrigin: `${PIVOTS.hair.x}px ${PIVOTS.hair.y}px` }}
        >
          <Hair style={hair.style} color={hair.color} layer="back" />
        </g>

        {/* Fish lower half — sways about the waist seam */}
        <g
          className="anim-tail"
          style={{ transformOrigin: `${PIVOTS.tail.x}px ${PIVOTS.tail.y}px` }}
        >
          <Tail shape={tail.shape} color={tail.color} pattern={tail.pattern} />
        </g>

        {/* Skin: head, neck, torso, arms, hands */}
        <Body skinTone={skinTone} bodyType={bodyType} />

        {/* Clothing across the bust */}
        <Top style={top.style} color={top.color} />

        {/* Facial features */}
        <Face expression={face} skinTone={skinTone} />

        {/* Front hair cap + bangs framing the face (static, stays on the face) */}
        <Hair style={hair.style} color={hair.color} layer="front" />

        {/* Painted nails on the hands */}
        <Nails color={nails} />

        {/* Crown / necklace / earrings (each only if enabled) */}
        <Accessories crown={accessories.crown} necklace={accessories.necklace} earrings={accessories.earrings} />

        {/* Little sea-creature sidekick — floats with the figure but bobs
            about its own centre. Offset to the right, clear of the face.
            Renders nothing when companion === 'none'. */}
        <g className="anim-companion" style={{ transformOrigin: `${COMPANION.cx}px ${COMPANION.cy}px` }}>
          <Companion companion={companion} />
        </g>
      </g>
    </svg>
  );
}

export default CharacterStage;
