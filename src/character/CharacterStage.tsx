import type { Character } from '../types';
import { VIEWBOX } from './geometry';
import { Body } from './parts/Body';
import { Tail } from './parts/Tail';
import { Hair } from './parts/Hair';
import { Top } from './parts/Top';
import { Face } from './parts/Face';
import { Nails } from './parts/Nails';
import { Accessories } from './parts/Accessories';

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
  const { bodyType, skinTone, face, hair, tail, top, nails, accessories } = character;

  return (
    <svg
      viewBox={VIEWBOX}
      role="img"
      aria-label={`Merperson character: ${bodyType} with ${hair.style} hair and a ${tail.shape} tail`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      {/* Long hair flowing behind the body */}
      <Hair style={hair.style} color={hair.color} layer="back" />

      {/* Fish lower half */}
      <Tail shape={tail.shape} color={tail.color} pattern={tail.pattern} />

      {/* Skin: head, neck, torso, arms, hands */}
      <Body skinTone={skinTone} bodyType={bodyType} />

      {/* Clothing across the bust */}
      <Top style={top.style} color={top.color} />

      {/* Facial features */}
      <Face expression={face} skinTone={skinTone} />

      {/* Front hair cap + bangs framing the face */}
      <Hair style={hair.style} color={hair.color} layer="front" />

      {/* Painted nails on the hands */}
      <Nails color={nails} />

      {/* Crown / necklace / earrings (each only if enabled) */}
      <Accessories crown={accessories.crown} necklace={accessories.necklace} earrings={accessories.earrings} />
    </svg>
  );
}

export default CharacterStage;
