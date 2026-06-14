// ============================================================
// Meerjungmenschen — Geometry / Layout Contract
// SINGLE SOURCE OF TRUTH for all SVG coordinates.
//
// Every part component imports anchors from here so the head,
// torso, tail, hair, top, face, nails and accessories all ALIGN.
// The FIGURE lives in a 320×520 "figure box" (all anchors below are
// in that space). The visible canvas — the viewBox — is the larger
// WORLD that frames the figure in roomier open water so more of the
// scene shows around it. The figure is centred on the vertical axis
// CX and reads top→bottom: head → torso → tail.
// ============================================================

import type { BodyType } from '../types';

/** The figure box: the coordinate space all figure anchors live in. */
export const WIDTH = 320;
export const HEIGHT = 520;

// ── World / canvas ───────────────────────────────────────────
// The viewBox is the WORLD, not the figure box. We surround the
// 320×520 figure with open water on every side so a bigger world is
// visible. The world ratio is kept at 3:4 to match the
// .app-stage-frame card, so the SVG fills it with no letterboxing.
const MARGIN_X = 80; // open water to the left & right of the figure
const MARGIN_Y = 60; // open water above & below the figure

export const WORLD = {
  left: -MARGIN_X,
  top: -MARGIN_Y,
  width: WIDTH + MARGIN_X * 2, // 480
  height: HEIGHT + MARGIN_Y * 2, // 640
  right: WIDTH + MARGIN_X, // 400
  bottom: HEIGHT + MARGIN_Y, // 580
} as const;

/** SVG viewBox string shared by the single <svg> in CharacterStage. */
export const VIEWBOX = `${WORLD.left} ${WORLD.top} ${WORLD.width} ${WORLD.height}`;

// ── Scene / backdrop ─────────────────────────────────────────
// The backmost layer (Scene.tsx) fills the whole WORLD. All
// scene-decoration coordinates derive from these named anchors (and
// the WORLD bounds) so nothing is hardcoded in the part.
export const SCENE = {
  /** Top of the seabed sand mound — sits low in the world, below the
      figure's fluke, leaving open water between figure and seafloor. */
  seabedY: WORLD.bottom - 52,
  /** Y where downward light rays begin (the water surface, world top). */
  horizonY: WORLD.top,
  /** Number of sunlight ray polygons fanned across the top. */
  rayCount: 5,
} as const;

/** Horizontal centre line. Everything is symmetric about this. */
export const CX = 160;

// ── Head ─────────────────────────────────────────────────────
// Slightly egg-shaped head; RX < RY for a cute rounded face.
// Kept deliberately NARROWER than the shoulder line below so the
// figure doesn't read as a bobblehead — head width (2·rx) must
// stay under 2·shoulderHalf for every body type.
export const HEAD = {
  cx: CX,
  cy: 88,
  rx: 42,
  ry: 47,
} as const;

/** Y of the chin (bottom of the head). */
export const CHIN_Y = HEAD.cy + HEAD.ry; // 152

// ── Neck ─────────────────────────────────────────────────────
export const NECK = {
  top: CHIN_Y - 14, // tucks up under the chin so there is no gap
  bottom: 156,
  halfWidth: 14,
} as const;

// ── Shoulders / torso ────────────────────────────────────────
// shoulderY is where the arms attach and the top of the torso sits.
export const SHOULDER_Y = 166;
/** Default shoulder half-span; Body widens/narrows this per bodyType. */
export const SHOULDER_HALF = 58;

export const TORSO = {
  top: SHOULDER_Y,
  /** Collarbone line — necklace + top straps anchor here. */
  collarY: 176,
  /** Narrowest point of the figure. Kept fairly high so the tail
      below gets the majority of the canvas and reads as long. */
  waistY: 276,
  waistHalf: 38,
  /** Bust line — tops are centred around here. Sits high on the
      chest (≈⅓ down the torso) so the top doesn't read at navel. */
  bustY: 206,
} as const;

// ── Per-bodyType silhouette ─────────────────────────────────
// SINGLE SOURCE for the at-a-glance differences between body
// types. Body.tsx reads these so the only thing that changes is
// the numbers here — no magic numbers scattered in the path.
//   - shoulderHalf : half-span of the shoulder line (broadness)
//   - waistHalf    : half-span at the waist (cinch vs. straight)
//   - bust         : outward bulge of the chest contour (skin,
//                    independent of the Top). 0 = flat chest.
//   - jawHalf      : half-width of the jaw shadow / squareness
export interface BodyShape {
  shoulderHalf: number;
  waistHalf: number;
  bust: number;
  jawHalf: number;
}

export const BODY_SHAPE: Record<BodyType, BodyShape> = {
  // Wassermann: broad square shoulders, flat chest, strong wide jaw.
  // waistHalf tapers well inside shoulderHalf so the torso V-tapers
  // instead of reading as a rectangular slab.
  merman: { shoulderHalf: 74, waistHalf: 40, bust: 0, jawHalf: 38 },
  // In-between everywhere; androgynous.
  neutral: { shoulderHalf: 62, waistHalf: 38, bust: 6, jawHalf: 31 },
  // Meerjungfrau: narrow soft shoulders, cinched waist, soft bust.
  // shoulderHalf 51 (102px) stays comfortably wider than the head (84px).
  mermaid: { shoulderHalf: 51, waistHalf: 34, bust: 11, jawHalf: 25 },
};


// ── Tail ─────────────────────────────────────────────────────
// The tail begins at the waist and flows down to the fluke.
export const TAIL = {
  /** Where the scaly tail takes over from the skin torso. */
  startY: TORSO.waistY,
  /** Kept just inside the narrowest skin waist (mermaid, 34) so the
      tail tucks UNDER the torso at the seam for every body type and
      no blue ledge pokes out past the hips. */
  startHalf: 32,
  /** Hips — widest part of the tail. Kept only a touch wider than the
      shoulders (mermaid ≈102px) so the figure isn't bottom-heavy. */
  hipY: 346,
  hipHalf: 54,
  /** The tail tapers to its thinnest just above the fluke. */
  ankleY: 466,
  ankleHalf: 11,
  /** Vertical extent of the fluke/fin spread. */
  flukeTopY: 466,
  flukeBottomY: 510,
  /** Horizontal reach of the fluke from centre — modest so the tail
      ends in a graceful fin rather than a broad paddle. */
  flukeHalf: 60,
} as const;

// ── Arms / hands ─────────────────────────────────────────────
// Arms rest down alongside the torso; hands sit near the waist
// so the nail dots land on the fingertips.
export const ARM = {
  shoulderY: SHOULDER_Y + 4,
  /** Hand centre offsets from CX (mirrored left/right). */
  handDX: 60,
  handY: 282,
  handRX: 13,
  handRY: 17,
} as const;

/**
 * Fingertip anchor points for Nails — three little dots per hand,
 * sitting on the lower edge of each hand oval. Mirrored about CX.
 */
export const FINGERTIPS: ReadonlyArray<{ x: number; y: number }> = [
  // left hand
  { x: CX - ARM.handDX - 8, y: ARM.handY + 12 },
  { x: CX - ARM.handDX, y: ARM.handY + 15 },
  { x: CX - ARM.handDX + 8, y: ARM.handY + 12 },
  // right hand
  { x: CX + ARM.handDX - 8, y: ARM.handY + 12 },
  { x: CX + ARM.handDX, y: ARM.handY + 15 },
  { x: CX + ARM.handDX + 8, y: ARM.handY + 12 },
];

// ── Face ─────────────────────────────────────────────────────
export const FACE = {
  eyeY: HEAD.cy + 6,
  eyeDX: 18, // eye centre offset from CX
  eyeRX: 7,
  eyeRY: 9,
  browY: HEAD.cy - 12,
  mouthY: HEAD.cy + 30,
  mouthHalf: 13,
  cheekY: HEAD.cy + 18,
  cheekDX: 30,
  noseY: HEAD.cy + 16,
  /** Open-mouth anchors (lachen / staunend). mouthOpenY is the centre
      of the open shape; mouthOpenR its base radius. */
  mouthOpenY: HEAD.cy + 33,
  mouthOpenR: 8,
} as const;

// ── Accessory anchors ────────────────────────────────────────
export const CROWN = {
  /** Crown sits across the top of the head, nestled into the hairline. */
  baseY: HEAD.cy - HEAD.ry + 22,
  halfWidth: 40,
  peakRise: 26,
} as const;

export const NECKLACE = {
  cy: TORSO.collarY + 14,
  half: 26,
  drop: 16,
} as const;

/** Ear anchor Y (where earrings hang from). */
export const EAR_Y = HEAD.cy + 26;

/** Earring anchors — at the lower side of the head, mirrored. */
export const EARRINGS: ReadonlyArray<{ x: number; y: number }> = [
  { x: HEAD.cx - HEAD.rx + 4, y: EAR_Y },
  { x: HEAD.cx + HEAD.rx - 4, y: EAR_Y },
];

// ── Companion ────────────────────────────────────────────────
// A small sea creature off to the right of the figure, clear of the
// merperson. The widest hand reaches ~CX+73, so cx=CX+96 (=256) keeps
// it clear; with r=26 the half-width stays inside WIDTH=320.
export const COMPANION = {
  cx: CX + 96, // 256 — off to the right, clear of the figure
  cy: 250,
  r: 26,       // nominal size used to scale the creature
} as const;

// ── Animation pivots ─────────────────────────────────────────
// transform-origin anchors for the ambient animation (stage.css).
// CSS transform-origin on SVG elements is in user (viewBox) units,
// so these map straight to `${x}px ${y}px` inline styles.
export const PIVOTS = {
  /** Tail sway pivots at the waist seam where tail meets torso. */
  tail: { x: CX, y: TORSO.waistY }, // 160, 276
  /** Hair drift pivots near the crown (top of the head). */
  hair: { x: CX, y: HEAD.cy - HEAD.ry + 6 }, // 160, 47
} as const;
