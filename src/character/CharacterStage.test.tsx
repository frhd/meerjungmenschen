import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CharacterStage } from './CharacterStage';
import { DEFAULT_CHARACTER, type Character } from '../types';
import {
  BODY_TYPES,
  HAIR_STYLES,
  TAIL_SHAPES,
  TAIL_PATTERNS,
  TOPS,
  SCENES,
  FACE_EXPRESSIONS,
  COMPANIONS,
} from '../data/options';

function render(character: Character): string {
  return renderToStaticMarkup(<CharacterStage character={character} />);
}

describe('CharacterStage', () => {
  it('renders DEFAULT_CHARACTER to a sensible SVG', () => {
    const markup = render(DEFAULT_CHARACTER);
    expect(markup).toContain('<svg');
    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label');
    // Structural sanity: the figure has a head (ellipse) and many paths.
    expect(markup).toContain('<ellipse');
    expect(markup.match(/<path/g)?.length ?? 0).toBeGreaterThan(5);
  });

  it('renders every bodyType', () => {
    for (const b of BODY_TYPES) {
      const markup = render({ ...DEFAULT_CHARACTER, bodyType: b.id as Character['bodyType'] });
      expect(markup).toContain('<svg');
    }
  });

  it('renders every hair style', () => {
    for (const h of HAIR_STYLES) {
      const markup = render({ ...DEFAULT_CHARACTER, hair: { ...DEFAULT_CHARACTER.hair, style: h.id } });
      expect(markup).toContain('<svg');
    }
  });

  it('renders every tail shape × pattern', () => {
    for (const shape of TAIL_SHAPES) {
      for (const pattern of TAIL_PATTERNS) {
        const markup = render({
          ...DEFAULT_CHARACTER,
          tail: { ...DEFAULT_CHARACTER.tail, shape: shape.id, pattern: pattern.id },
        });
        expect(markup).toContain('<svg');
      }
    }
  });

  it('renders every top', () => {
    for (const t of TOPS) {
      const markup = render({ ...DEFAULT_CHARACTER, top: { ...DEFAULT_CHARACTER.top, style: t.id } });
      expect(markup).toContain('<svg');
    }
  });

  it('renders every face expression', () => {
    for (const f of FACE_EXPRESSIONS) {
      const markup = render({ ...DEFAULT_CHARACTER, face: f.id });
      expect(markup).toContain('<svg');
    }
  });

  it('renders every scene', () => {
    for (const s of SCENES) {
      const markup = render({ ...DEFAULT_CHARACTER, scene: s.id });
      expect(markup).toContain('<svg');
    }
  });

  it('renders all accessory on/off combinations', () => {
    for (const crown of [true, false]) {
      for (const necklace of [true, false]) {
        for (const earrings of [true, false]) {
          const markup = render({ ...DEFAULT_CHARACTER, accessories: { crown, necklace, earrings } });
          expect(markup).toContain('<svg');
        }
      }
    }
  });

  it('renders every companion', () => {
    for (const c of COMPANIONS) {
      const markup = render({ ...DEFAULT_CHARACTER, companion: c.id });
      expect(markup).toContain('<svg');
    }
  });

  it('wires the ambient animation hooks (float, tail sway, bubbles)', () => {
    const markup = render(DEFAULT_CHARACTER);
    // Figure float wrapper + nested tail/hair groups are present.
    expect(markup).toContain('anim-figure');
    expect(markup).toContain('anim-tail');
    expect(markup).toContain('anim-hairback');
    // Scene emits ambient bubbles.
    expect(markup).toContain('anim-bubble');
  });

  it('never throws or renders blank on unknown ids (default fallbacks)', () => {
    const weird: Character = {
      ...DEFAULT_CHARACTER,
      bodyType: 'mermaid',
      scene: 'zzz',
      face: 'wat',
      hair: { style: 'zzz', color: '#123456' },
      tail: { shape: 'zzz', color: '#abcdef', pattern: 'zzz' },
      top: { style: 'zzz', color: '#fedcba' },
      companion: 'zzz',
      makeup: {
        lips: { style: 'zzz', color: '#123456' },
        eyeshadow: { style: 'zzz', color: '#123456' },
        eyeliner: 'zzz',
        blush: { style: 'zzz', color: '#123456' },
        freckles: 'zzz',
      },
    };
    const markup = render(weird);
    expect(markup).toContain('<svg');
    expect(markup.length).toBeGreaterThan(200);
  });
});
