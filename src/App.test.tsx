// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App, { loadCharacter } from './App';
import { DEFAULT_CHARACTER, type Character } from './types';

// No global Vitest environment/globals is configured (see vite.config.ts), so
// auto-cleanup is not registered. Unmount and clear storage between tests.
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('loadCharacter', () => {
  it('returns DEFAULT_CHARACTER when nothing is stored', () => {
    expect(loadCharacter()).toEqual(DEFAULT_CHARACTER);
  });

  it('merges a saved blob over the defaults', () => {
    localStorage.setItem('mm.character', JSON.stringify({ scene: 'deep' }));
    const loaded = loadCharacter();
    expect(loaded.scene).toBe('deep');
    // missing keys fall back to defaults
    expect(loaded.companion).toBe(DEFAULT_CHARACTER.companion);
    expect(loaded.bodyType).toBe(DEFAULT_CHARACTER.bodyType);
  });

  it('an old blob without scene/companion still loads (merged over defaults)', () => {
    const old = { ...DEFAULT_CHARACTER } as Partial<Character>;
    delete old.scene;
    delete old.companion;
    localStorage.setItem('mm.character', JSON.stringify(old));
    const loaded = loadCharacter();
    expect(loaded.scene).toBe(DEFAULT_CHARACTER.scene);
    expect(loaded.companion).toBe(DEFAULT_CHARACTER.companion);
  });

  it('returns DEFAULT_CHARACTER on corrupt JSON', () => {
    localStorage.setItem('mm.character', '{not valid json');
    expect(loadCharacter()).toEqual(DEFAULT_CHARACTER);
  });
});

describe('App persistence', () => {
  it('persists a selection to localStorage on change', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Welt' }));
    await user.click(screen.getByRole('button', { name: 'Tiefsee' }));

    const raw = localStorage.getItem('mm.character');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).scene).toBe('deep');
  });

  it('restores the saved character on a fresh mount', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'mm.character',
      JSON.stringify({ ...DEFAULT_CHARACTER, scene: 'wreck', companion: 'jelly' }),
    );

    render(<App />);
    await user.click(screen.getByRole('tab', { name: 'Welt' }));

    expect(screen.getByRole('button', { name: 'Schiffswrack' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Qualle' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
