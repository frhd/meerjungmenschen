import { useCallback, useState } from 'react';
import type { Character } from './types';
import { DEFAULT_CHARACTER } from './types';
import { CharacterStage } from './character/CharacterStage';
import { Wardrobe } from './wardrobe/Wardrobe';
import { MuteToggle } from './wardrobe/controls/MuteToggle';
import { playBlip } from './audio/sound';
import './App.css';

function App() {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);

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
