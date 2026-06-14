# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Meerjungmenschen** ("merpeople") is a German-language character-creator / dress-up SPA. The user picks a body type, skin tone, hair, tail, outfit and accessories; a single SVG figure re-renders live. React 19 + TypeScript + Vite, no router and no backend. UI copy is German.

## Commands

```bash
npm run dev          # Vite dev server (base path '/')
npm run build        # tsc -b (typecheck) then vite build → dist/
npm run preview      # serve the production build
npm test             # vitest run (one-shot, no watch)
npx vitest run src/character/CharacterStage.test.tsx   # single test file
npx vitest                                             # watch mode
```

## Architecture

Data flows one way. `App.tsx` owns a single `Character` object in `useState` and passes it down with a single `updateCharacter(patch)` callback that shallow-merges. Two consumers:

- **`character/CharacterStage.tsx`** — renders the whole figure as ONE `<svg>`, composing part components back-to-front (HairBack → Tail → Body → Top → Face → HairFront → Nails → Accessories). Render order is layering order.
- **`wardrobe/Wardrobe.tsx`** — the controls. Tabbed (Körper / Haare / Schwanz / Outfit); each tab wires `StylePicker` / `ColorPicker` / `AccessoryToggles` to `onChange` patches.

### Two single-source-of-truth files — read these first

Almost all change requests touch one of these two, and the constraint between them is the heart of the codebase:

- **`data/options.ts`** — the content catalog. Every selectable option (body types, skin tones, hair styles/colors, tail shapes/colors/patterns, tops, nail colors, accessories) is an array here. The Wardrobe renders pickers from these arrays. The string `id`s defined here are the exact values the SVG part components switch on.
- **`character/geometry.ts`** — the layout contract. ALL SVG coordinates (viewBox 320×520, head/neck/torso/tail/face anchors, fingertip/earring/crown positions, and the per-body-type `BODY_SHAPE` silhouette table) live here. Part components import anchors from here so head, torso, tail, hair, top, face, nails and accessories all align. Never scatter magic coordinate numbers into a part — add or adjust the named anchor in geometry.ts.

To add an option: add it to the array in `options.ts`, then handle its `id` in the relevant part component under `character/parts/`. To move the figure / re-align parts: edit `geometry.ts`, not the parts.

### Part components (`character/parts/`)

`Body`, `Tail`, `Hair`, `Top`, `Face`, `Nails`, `Accessories`. Each is a **pure function of its props** (no state, no context) returning SVG. They switch on the string `id`s from `options.ts` and **must default-fallback to a known style on unknown ids** — there is a regression test asserting the figure never throws or renders blank on garbage ids. `Hair` is rendered twice with a `layer="back" | "front"` prop so long hair can sit both behind the body and framing the face.

### Conventions worth knowing

- `types.ts` is the canonical `Character` shape plus `DEFAULT_CHARACTER`.
- Skin shading is derived from the chosen tone via CSS `color-mix` (e.g. `color-mix(in srgb, ${skinTone} 82%, #000 18%)`) so it reads on every skin tone — don't hardcode shadow/highlight hex.
- The "Outfit" top color picker deliberately reuses `NAIL_COLORS` (there is no separate `TOP_COLORS` catalog).

## Testing

Vitest, with a deliberate split (documented in `vite.config.ts`):

- **No global test environment** is set. Component-of-SVG tests render with `renderToStaticMarkup` in the default **node** env and assert on the markup string (e.g. counts of `<path>`).
- DOM-interaction tests (Wardrobe) opt into jsdom per-file with a `// @vitest-environment jsdom` pragma at the top.
- Because no global env/globals is configured, **Testing Library auto-cleanup is NOT registered** — jsdom tests must `afterEach(cleanup)` manually.

## Deployment

Built for GitHub Pages at `https://frhd.github.io/meerjungmenschen/`. `vite.config.ts` sets `base: '/meerjungmenschen/'` for `build` only; dev/preview stay at `/`.
