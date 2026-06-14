import { TORSO, CX, SHOULDER_Y } from '../geometry';

interface TopProps {
  style: string;
  color: string;
}

/**
 * The bikini/top layer. Sits across the bust. `none` renders nothing.
 * Unknown ids fall back to the classic shell.
 */
export function Top({ style, color }: TopProps) {
  if (style === 'none') return null;

  const dark = `color-mix(in srgb, ${color} 80%, #000 20%)`;
  const light = `color-mix(in srgb, ${color} 80%, #fff 20%)`;
  const bustY = TORSO.bustY;
  const cupDX = 18; // cup centre offset from CX

  switch (style) {
    case 'strap': {
      // Sporty bandeau-ish bralette with shoulder straps.
      return (
        <g>
          {/* straps */}
          <path d={`M ${CX - 22} ${SHOULDER_Y - 2} L ${CX - 16} ${bustY - 4}`} stroke={dark} strokeWidth={5} strokeLinecap="round" />
          <path d={`M ${CX + 22} ${SHOULDER_Y - 2} L ${CX + 16} ${bustY - 4}`} stroke={dark} strokeWidth={5} strokeLinecap="round" />
          {/* band */}
          <path
            d={`M ${CX - 36} ${bustY - 6} Q ${CX} ${bustY + 4} ${CX + 36} ${bustY - 6} L ${CX + 34} ${bustY + 16} Q ${CX} ${bustY + 26} ${CX - 34} ${bustY + 16} Z`}
            fill={color}
          />
          <path d={`M ${CX - 30} ${bustY + 4} Q ${CX} ${bustY + 12} ${CX + 30} ${bustY + 4}`} fill="none" stroke={light} strokeWidth={2} opacity={0.6} />
        </g>
      );
    }

    case 'wrap': {
      // Wrapped fabric band, diagonal fold across the chest.
      return (
        <g>
          <path
            d={`M ${CX - 40} ${bustY - 12} Q ${CX} ${bustY - 2} ${CX + 40} ${bustY - 12} L ${CX + 36} ${bustY + 20} Q ${CX} ${bustY + 30} ${CX - 36} ${bustY + 20} Z`}
            fill={color}
          />
          {/* diagonal fold */}
          <path d={`M ${CX - 38} ${bustY - 6} L ${CX + 34} ${bustY + 18}`} stroke={dark} strokeWidth={3} opacity={0.5} />
          <path d={`M ${CX - 34} ${bustY + 2} L ${CX + 36} ${bustY - 8}`} stroke={light} strokeWidth={2} opacity={0.5} />
          {/* knot */}
          <circle cx={CX - 36} cy={bustY + 4} r={5} fill={dark} />
        </g>
      );
    }

    case 'shell':
    default: {
      // Classic two-shell bra with radiating ridges + centre tie.
      return (
        <g>
          {[-1, 1].map((sgn) => {
            const cx = CX + sgn * cupDX;
            return (
              <g key={sgn}>
                {/* shell body — fan shape */}
                <path
                  d={`M ${cx} ${bustY - 14} C ${cx - 22} ${bustY - 8} ${cx - 22} ${bustY + 14} ${cx - 6} ${bustY + 20} Q ${cx} ${bustY + 22} ${cx + 6} ${bustY + 20} C ${cx + 22} ${bustY + 14} ${cx + 22} ${bustY - 8} ${cx} ${bustY - 14} Z`}
                  fill={color}
                />
                {/* ridges */}
                {[-12, -6, 0, 6, 12].map((dx) => (
                  <path
                    key={dx}
                    d={`M ${cx} ${bustY - 12} L ${cx + dx} ${bustY + 18}`}
                    stroke={dark}
                    strokeWidth={1.6}
                    opacity={0.5}
                  />
                ))}
                <ellipse cx={cx} cy={bustY - 12} rx={6} ry={4} fill={light} opacity={0.7} />
              </g>
            );
          })}
          {/* tie across the middle */}
          <path d={`M ${CX - cupDX} ${bustY - 6} Q ${CX} ${bustY - 2} ${CX + cupDX} ${bustY - 6}`} stroke={dark} strokeWidth={3} />
        </g>
      );
    }
  }
}
