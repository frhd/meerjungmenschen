import { useCallback, useEffect, useState } from 'react';
import type { Character } from './types';
import { DEFAULT_CHARACTER } from './types';
import { CharacterStage } from './character/CharacterStage';
import { Wardrobe } from './wardrobe/Wardrobe';
import { MuteToggle } from './wardrobe/controls/MuteToggle';
import { playBlip } from './audio/sound';
import './App.css';

const STORAGE_KEY = 'mm.character';

/**
 * Load the saved character from localStorage, merged over DEFAULT_CHARACTER so
 * older/partial saved blobs gain any newer fields (e.g. scene/companion) and
 * never end up missing keys. Returns DEFAULT_CHARACTER on any failure (missing,
 * corrupt JSON, or localStorage unavailable / SSR).
 */
export function loadCharacter(): Character {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_CHARACTER;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHARACTER;
    const parsed = JSON.parse(raw) as Partial<Character>;
    return { ...DEFAULT_CHARACTER, ...parsed };
  } catch {
    return DEFAULT_CHARACTER;
  }
}

function App() {
  const [character, setCharacter] = useState<Character>(() => loadCharacter());

  // Persist the whole character on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    } catch {
      // localStorage unavailable / quota exceeded -> silently skip persistence.
    }
  }, [character]);

  const updateCharacter = useCallback((patch: Partial<Character>) => {
    // Every patch is a deliberate user selection -> soft blip (no-op if muted).
    playBlip();
    setCharacter((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meerjungmenschen</h1>
        <p className="app-tagline">Gestalte deine eigenen Meermenschen</p>
        <MuteToggle />
      </header>

      <main className="app-main">
        <section className="app-stage" aria-label="Vorschau">
          <div className="app-stage-frame">
            <CharacterStage character={character} />
          </div>
        </section>

        <section className="app-wardrobe" aria-label="Garderobe">
          <Wardrobe character={character} onChange={updateCharacter} />
        </section>
      </main>
    </div>
  );
}

export default App;
