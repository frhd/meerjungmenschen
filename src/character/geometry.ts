// ============================================================
// Meerjungmenschen — Geometry / Layout Contract
// SINGLE SOURCE OF TRUTH for all SVG coordinates.
//
// Every part component imports anchors from here so the head,
// torso, tail, hair, top, face, nails and accessories all ALIGN.
// The viewBox is 320 wide × 520 tall. The figure is centred on
// the vertical axis CX and reads top→bottom: head → torso → tail.
// ============================================================

import type { BodyType } from '../types';

/** SVG viewBox string shared by the single <svg> in CharacterStage. */
export const VIEWBOX = '0 0 320 520';

export const WIDTH = 320;
export const HEIGHT = 520;

/** Horizontal centre line. Everything is symmetric about this. */
export const CX = 160;

// ── Head ─────────────────────────────────────────────────────
// Slightly egg-shaped head; RX < RY for a cute rounded face.
export const HEAD = {
  cx: CX,
  cy: 96,
  rx: 50,
  ry: 56,
} as const;

/** Y of the chin (bottom of the head). */
export const CHIN_Y = HEAD.cy + HEAD.ry; // 152

// ── Neck ─────────────────────────────────────────────────────
export const NECK = {
  top: CHIN_Y - 14, // tucks up under the chin so there is no gap
  bottom: 178,
  halfWidth: 15,
} as const;

// ── Shoulders / torso ────────────────────────────────────────
// shoulderY is where the arms attach and the top of the torso sits.
export const SHOULDER_Y = 186;
/** Default shoulder half-span; Body widens/narrows this per bodyType. */
export const SHOULDER_HALF = 58;

export const TORSO = {
  top: SHOULDER_Y,
  /** Collarbone line — necklace + top straps anchor here. */
  collarY: 196,
  /** Narrowest point of the figure. */
  waistY: 300,
  waistHalf: 40,
  /** Bust line — tops are centred around here. */
  bustY: 232,
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
  merman: { shoulderHalf: 78, waistHalf: 52, bust: 0, jawHalf: 42 },
  // In-between everywhere; androgynous.
  neutral: { shoulderHalf: 58, waistHalf: 42, bust: 7, jawHalf: 32 },
  // Meerjungfrau: narrow soft shoulders, cinched waist, soft bust.
  mermaid: { shoulderHalf: 47, waistHalf: 35, bust: 16, jawHalf: 26 },
};


// ── Tail ─────────────────────────────────────────────────────
// The tail begins at the waist and flows down to the fluke.
export const TAIL = {
  /** Where the scaly tail takes over from the skin torso. */
  startY: TORSO.waistY,
  startHalf: TORSO.waistHalf + 6,
  /** Hips — widest part of the tail, a generous flare below the waist. */
  hipY: 348,
  hipHalf: 64,
  /** The tail tapers to its thinnest just above the fluke. */
  ankleY: 456,
  ankleHalf: 11,
  /** Vertical extent of the fluke/fin spread. */
  flukeTopY: 456,
  flukeBottomY: 500,
  /** Horizontal reach of a wide fluke from centre. */
  flukeHalf: 74,
} as const;

// ── Arms / hands ─────────────────────────────────────────────
// Arms rest down alongside the torso; hands sit near the waist
// so the nail dots land on the fingertips.
export const ARM = {
  shoulderY: SHOULDER_Y + 4,
  /** Hand centre offsets from CX (mirrored left/right). */
  handDX: 64,
  handY: 300,
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
