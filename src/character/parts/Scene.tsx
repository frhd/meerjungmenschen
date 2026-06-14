import { useId } from 'react';
import { WORLD, CX, SCENE } from '../geometry';

interface SceneProps {
  scene: string;
}

/** Per-scene water gradient stops (top → bottom). */
const WATER: Record<string, { top: string; mid: string; bottom: string }> = {
  reef:    { top: '#2e9bb5', mid: '#1f7d97', bottom: '#155f74' },
  deep:    { top: '#15314f', mid: '#0c2038', bottom: '#06121f' },
  shallow: { top: '#7fd6dc', mid: '#46b6c0', bottom: '#2a8c98' },
  wreck:   { top: '#516356', mid: '#3a4a42', bottom: '#26322d' },
};

/**
 * The backmost backdrop layer: a full-bleed water gradient plus a few
 * lightweight decorative shapes that vary per scene. Static only — a
 * pure function of props; ambient animation is added in a later stage.
 *
 * Always falls back to the 'reef' scene on an unknown id so the figure
 * never renders against a blank backdrop.
 */
export function Scene({ scene }: SceneProps) {
  const uid = useId();
  const waterId = `water-${uid}`;
  const raysId = `rays-${uid}`;

  const key = WATER[scene] ? scene : 'reef';
  const water = WATER[key];

  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={waterId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={water.top} />
          <stop offset="55%" stopColor={water.mid} />
          <stop offset="100%" stopColor={water.bottom} />
        </linearGradient>
        <linearGradient id={raysId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.28} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Full-bleed water fill — spans the whole world */}
      <rect x={WORLD.left} y={WORLD.top} width={WORLD.width} height={WORLD.height} fill={`url(#${waterId})`} />

      <SceneDecor scene={key} raysId={raysId} />

      {/* Ambient rising bubbles — water is everywhere, so all scenes get them. */}
      <Bubbles />
    </g>
  );
}

/**
 * A small set of slowly rising bubbles drifting up the water column.
 * Deterministic (index-seeded LCG, like the Scene/Tail decor) so the
 * markup is stable. Each bubble's animationDelay / animationDuration is
 * set inline to stagger the rise; the CSS keyframe lives in stage.css.
 */
function Bubbles() {
  const count = 14;
  let seed = 71;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const bubbles = [];
  for (let i = 0; i < count; i += 1) {
    const cx = WORLD.left + 14 + rand() * (WORLD.width - 28);
    // Start low in the water column; the keyframe rises upward from here.
    const cy = WORLD.top + WORLD.height * 0.55 + rand() * (WORLD.height * 0.4);
    const r = 1.5 + rand() * 3;
    const delay = rand() * 9;
    const duration = 8 + rand() * 6;
    bubbles.push(
      <circle
        key={i}
        className="anim-bubble"
        cx={cx}
        cy={cy}
        r={r}
        fill="#ffffff"
        opacity={0.18}
        style={{ animationDelay: `${delay.toFixed(2)}s`, animationDuration: `${duration.toFixed(2)}s` }}
      />,
    );
  }
  return <g aria-hidden="true">{bubbles}</g>;
}

interface DecorProps {
  scene: string;
  raysId: string;
}

function SceneDecor({ scene, raysId }: DecorProps) {
  switch (scene) {
    case 'deep':
      return <DeepDecor />;
    case 'shallow':
      return <ShallowDecor raysId={raysId} />;
    case 'wreck':
      return <WreckDecor />;
    case 'reef':
    default:
      return <ReefDecor />;
  }
}

/** Soft seabed sand mound spanning the full width of the world. */
function Seabed({ fill }: { fill: string }) {
  const y = SCENE.seabedY;
  const { left, right, bottom } = WORLD;
  const q1 = (left + CX) / 2;
  const q2 = (CX + right) / 2;
  return (
    <path
      d={`M ${left} ${bottom} L ${left} ${y + 18} Q ${q1} ${y - 14} ${CX} ${y} Q ${q2} ${y + 14} ${right} ${y + 6} L ${right} ${bottom} Z`}
      fill={fill}
    />
  );
}

/** Korallenriff: warm seabed plus a couple of coral fans either side. */
function ReefDecor() {
  return (
    <g>
      <Seabed fill="#c79a5e" />
      {/* Left coral fan */}
      <g transform={`translate(${CX - 118} ${SCENE.seabedY})`}>
        <CoralFan color="#e2607f" />
      </g>
      {/* Right coral fan (mirrored, taller) */}
      <g transform={`translate(${CX + 118} ${SCENE.seabedY}) scale(-1.15 1.15)`}>
        <CoralFan color="#e08840" />
      </g>
    </g>
  );
}

/** A small fan-shaped coral, drawn from its base at (0,0) upward. */
function CoralFan({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
      <path d="M0 0 C -2 -26 -14 -34 -20 -52" />
      <path d="M0 0 C 0 -30 0 -40 0 -60" />
      <path d="M0 0 C 2 -26 14 -34 20 -52" />
      <path d="M0 0 C -1 -20 -8 -26 -10 -40" />
      <path d="M0 0 C 1 -20 8 -26 10 -40" />
    </g>
  );
}

/** Sonnenlicht: faint shafts of light fanning down from the surface. */
function ShallowDecor({ raysId }: { raysId: string }) {
  const rays = [];
  const span = WORLD.width + 80;
  const top = SCENE.horizonY;
  const bottom = WORLD.bottom;
  for (let i = 0; i < SCENE.rayCount; i += 1) {
    // Top of each ray spread across the surface; rays widen and slant down.
    const topX = WORLD.left - 40 + (span / SCENE.rayCount) * (i + 0.5);
    const w = 30;
    const slant = 44;
    rays.push(
      <polygon
        key={i}
        points={`${topX - w / 2},${top} ${topX + w / 2},${top} ${topX + slant + w},${bottom} ${topX + slant - w},${bottom}`}
        fill={`url(#${raysId})`}
      />,
    );
  }
  return <g>{rays}</g>;
}

/** Tiefsee: a darkening vignette plus a few faint suspended specks. */
function DeepDecor() {
  // A handful of static specks; pseudo-random but deterministic.
  const motes: Array<{ x: number; y: number; r: number }> = [];
  let seed = 13;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 20; i += 1) {
    motes.push({ x: WORLD.left + rand() * WORLD.width, y: WORLD.top + rand() * WORLD.height, r: 1 + rand() * 2 });
  }
  return (
    <g>
      {/* Darker pool toward the bottom for extra depth. */}
      <rect x={WORLD.left} y={WORLD.top + WORLD.height * 0.5} width={WORLD.width} height={WORLD.height * 0.5} fill="#000000" opacity={0.18} />
      {motes.map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r={m.r} fill="#bfe6ee" opacity={0.4} />
      ))}
    </g>
  );
}

/** Schiffswrack: murky seabed with a tilted, broken ship-hull silhouette. */
function WreckDecor() {
  return (
    <g>
      <Seabed fill="#6c6a4e" />
      {/* Tilted hull silhouette resting off to one side so it doesn't
          fight the centred figure. */}
      <g transform={`translate(${CX - 96} ${SCENE.seabedY - 8}) rotate(-12)`} opacity={0.5}>
        <path
          d="M -70 0 Q -40 34 40 30 L 70 -2 Q 30 4 -70 0 Z"
          fill="#2c352f"
        />
        {/* Stub of a broken mast. */}
        <rect x={4} y={-54} width={5} height={54} fill="#2c352f" />
        <path d="M 9 -54 L 38 -42 L 9 -36 Z" fill="#39433b" />
      </g>
    </g>
  );
}
