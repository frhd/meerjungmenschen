import { FINGERTIPS } from '../geometry';

interface NailsProps {
  color: string;
}

/**
 * Little painted nails on the visible fingertips. Positions come
 * straight from geometry.FINGERTIPS so they land on the Body's hands.
 */
export function Nails({ color }: NailsProps) {
  return (
    <g>
      {FINGERTIPS.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx={2.6} ry={3.6} fill={color} />
      ))}
    </g>
  );
}
