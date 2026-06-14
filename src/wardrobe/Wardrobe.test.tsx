// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { useState } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Wardrobe } from './Wardrobe';
import { DEFAULT_CHARACTER, type Character } from '../types';

/** Controlled wrapper that applies the same shallow merge the real App will. */
function Harness({ onState }: { onState?: (c: Character) => void }) {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  return (
    <Wardrobe
      character={character}
      onChange={(patch) =>
        setCharacter((prev) => {
          const next = { ...prev, ...patch };
          onState?.(next);
          return next;
        })
      }
    />
  );
}

// No global Vitest `environment`/`globals` is configured (see vite.config.ts),
// so @testing-library/react's auto-cleanup is not registered. Unmount between
// tests explicitly to keep them isolated.
afterEach(cleanup);

describe('Wardrobe', () => {
  it('selecting a hair style updates hair.style and preserves hair.color', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    await user.click(screen.getByRole('tab', { name: 'Haare' }));

    const bun = screen.getByRole('button', { name: 'Dutt' });
    expect(bun).toHaveAttribute('aria-pressed', 'false');
    await user.click(bun);

    expect(latest.hair.style).toBe('bun');
    expect(latest.hair.color).toBe(DEFAULT_CHARACTER.hair.color);
    // re-render reflects the active state
    expect(screen.getByRole('button', { name: 'Dutt' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking a skin tone swatch updates skinTone', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    // Körper is the default tab; the "Tief" skin tone swatch.
    await user.click(screen.getByRole('button', { name: 'Tief' }));

    expect(latest.skinTone).toBe('#6b3a1f');
    expect(latest.skinTone).not.toBe(DEFAULT_CHARACTER.skinTone);
  });

  it('selecting a facial expression on the Körper tab updates face', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    // Körper is the default tab; the "Lachen" expression.
    const lachen = screen.getByRole('button', { name: 'Lachen' });
    expect(lachen).toHaveAttribute('aria-pressed', 'false');
    await user.click(lachen);

    expect(latest.face).toBe('lachen');
    expect(screen.getByRole('button', { name: 'Lachen' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggling an accessory on the Outfit tab flips its boolean', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    await user.click(screen.getByRole('tab', { name: 'Outfit' }));

    const crown = screen.getByRole('button', { name: 'Krone' });
    expect(crown).toHaveAttribute('aria-pressed', 'false');
    await user.click(crown);

    expect(latest.accessories.crown).toBe(true);
    expect(latest.accessories.necklace).toBe(false);
    expect(latest.accessories.earrings).toBe(false);
    expect(screen.getByRole('button', { name: 'Krone' })).toHaveAttribute('aria-pressed', 'true');

    // toggling again flips it back off
    await user.click(screen.getByRole('button', { name: 'Krone' }));
    expect(latest.accessories.crown).toBe(false);
  });

  it('selecting a tail pattern updates tail.pattern without clobbering shape/color', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    await user.click(screen.getByRole('tab', { name: 'Schwanz' }));
    await user.click(screen.getByRole('button', { name: 'Tupfen' }));

    expect(latest.tail.pattern).toBe('spots');
    expect(latest.tail.shape).toBe(DEFAULT_CHARACTER.tail.shape);
    expect(latest.tail.color).toBe(DEFAULT_CHARACTER.tail.color);
  });

  it('selecting a lip style on the Make-up tab updates makeup.lips.style and preserves siblings', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    await user.click(screen.getByRole('tab', { name: 'Make-up' }));

    // 'Herzchen' is unique to the lip styles ('Klassik' also appears under Eyeliner).
    const herz = screen.getByRole('button', { name: 'Herzchen' });
    await user.click(herz);

    expect(latest.makeup.lips.style).toBe('herz');
    // sibling color and the other makeup groups are untouched
    expect(latest.makeup.lips.color).toBe(DEFAULT_CHARACTER.makeup.lips.color);
    expect(latest.makeup.eyeshadow).toEqual(DEFAULT_CHARACTER.makeup.eyeshadow);
    expect(latest.makeup.blush).toEqual(DEFAULT_CHARACTER.makeup.blush);
    expect(latest.makeup.eyeliner).toBe(DEFAULT_CHARACTER.makeup.eyeliner);
    expect(latest.makeup.freckles).toBe(DEFAULT_CHARACTER.makeup.freckles);
  });

  it('selecting a scene on the Welt tab updates scene', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    await user.click(screen.getByRole('tab', { name: 'Welt' }));

    const deep = screen.getByRole('button', { name: 'Tiefsee' });
    expect(deep).toHaveAttribute('aria-pressed', 'false');
    await user.click(deep);

    expect(latest.scene).toBe('deep');
    expect(screen.getByRole('button', { name: 'Tiefsee' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('selecting a companion on the Welt tab updates companion', async () => {
    const user = userEvent.setup();
    let latest: Character = DEFAULT_CHARACTER;
    render(<Harness onState={(c) => (latest = c)} />);

    await user.click(screen.getByRole('tab', { name: 'Welt' }));

    const seahorse = screen.getByRole('button', { name: 'Seepferdchen' });
    expect(seahorse).toHaveAttribute('aria-pressed', 'false');
    await user.click(seahorse);

    expect(latest.companion).toBe('seahorse');
    expect(latest.scene).toBe(DEFAULT_CHARACTER.scene);
    expect(screen.getByRole('button', { name: 'Seepferdchen' })).toHaveAttribute('aria-pressed', 'true');
  });
});
