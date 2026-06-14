import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Makeup } from './Makeup';
import {
  LIP_STYLES,
  EYESHADOW_STYLES,
  EYELINER_STYLES,
  BLUSH_STYLES,
  FRECKLE_STYLES,
  MAKEUP_COLORS,
} from '../../data/options';
import { DEFAULT_CHARACTER } from '../../types';

type MakeupValue = typeof DEFAULT_CHARACTER['makeup'];

function render(makeup: MakeupValue, skinTone = '#e8b98f'): string {
  return renderToStaticMarkup(<Makeup makeup={makeup} skinTone={skinTone} />);
}

/** True if the markup contains at least one drawn shape element. */
function hasShapes(markup: string): boolean {
  return /<path|<ellipse|<circle|<line/.test(markup);
}

describe('Makeup', () => {
  it('renders nothing when all styles are "none" (DEFAULT_CHARACTER.makeup)', () => {
    const markup = render(DEFAULT_CHARACTER.makeup);
    expect(hasShapes(markup)).toBe(false);
  });

  it('renders at least one <path for every non-none LIP_STYLES id', () => {
    for (const { id } of LIP_STYLES) {
      if (id === 'none') continue;
      const makeup: MakeupValue = {
        ...DEFAULT_CHARACTER.makeup,
        lips: { ...DEFAULT_CHARACTER.makeup.lips, style: id },
      };
      const markup = render(makeup);
      expect(markup, `lips style "${id}"`).toContain('<path');
    }
  });

  it('renders at least one shape for every non-none EYESHADOW_STYLES id', () => {
    for (const { id } of EYESHADOW_STYLES) {
      if (id === 'none') continue;
      const makeup: MakeupValue = {
        ...DEFAULT_CHARACTER.makeup,
        eyeshadow: { ...DEFAULT_CHARACTER.makeup.eyeshadow, style: id },
      };
      const markup = render(makeup);
      expect(hasShapes(markup), `eyeshadow style "${id}"`).toBe(true);
    }
  });

  it('renders at least one shape for every non-none EYELINER_STYLES id', () => {
    for (const { id } of EYELINER_STYLES) {
      if (id === 'none') continue;
      const makeup: MakeupValue = {
        ...DEFAULT_CHARACTER.makeup,
        eyeliner: id,
      };
      const markup = render(makeup);
      expect(hasShapes(markup), `eyeliner style "${id}"`).toBe(true);
    }
  });

  it('renders at least one shape for every non-none BLUSH_STYLES id', () => {
    for (const { id } of BLUSH_STYLES) {
      if (id === 'none') continue;
      const makeup: MakeupValue = {
        ...DEFAULT_CHARACTER.makeup,
        blush: { ...DEFAULT_CHARACTER.makeup.blush, style: id },
      };
      const markup = render(makeup);
      expect(hasShapes(markup), `blush style "${id}"`).toBe(true);
    }
  });

  it('renders at least one shape for every non-none FRECKLE_STYLES id', () => {
    for (const { id } of FRECKLE_STYLES) {
      if (id === 'none') continue;
      const makeup: MakeupValue = {
        ...DEFAULT_CHARACTER.makeup,
        freckles: id,
      };
      const markup = render(makeup);
      expect(hasShapes(markup), `freckles style "${id}"`).toBe(true);
    }
  });

  it('freckles "wenig" produces fewer <circle elements than "viele"', () => {
    const fewMarkup = render({ ...DEFAULT_CHARACTER.makeup, freckles: 'wenig' });
    const manyMarkup = render({ ...DEFAULT_CHARACTER.makeup, freckles: 'viele' });
    const countCircles = (s: string) => (s.match(/<circle/g) ?? []).length;
    expect(countCircles(fewMarkup)).toBeLessThan(countCircles(manyMarkup));
  });

  it('uses every MAKEUP_COLORS color without throwing', () => {
    for (const { color } of MAKEUP_COLORS) {
      const makeup: MakeupValue = {
        lips: { style: 'klassik', color },
        eyeshadow: { style: 'sanft', color },
        eyeliner: 'klassik',
        blush: { style: 'sanft', color },
        freckles: 'wenig',
      };
      expect(() => render(makeup)).not.toThrow();
    }
  });

  it('does not throw and renders nothing drawn for an all-garbage makeup object', () => {
    const garbage: MakeupValue = {
      lips: { style: 'zzz', color: '#123456' },
      eyeshadow: { style: 'zzz', color: '#123456' },
      eyeliner: 'zzz',
      blush: { style: 'zzz', color: '#123456' },
      freckles: 'zzz',
    };
    let markup: string;
    expect(() => { markup = render(garbage); }).not.toThrow();
    expect(hasShapes(markup!)).toBe(false);
  });
});
