import { useState } from 'react';
import { isMuted, setMuted } from '../../audio/sound';

/**
 * A small header toggle for the synthesized underwater ambience.
 * Muted by default; clicking (a user gesture) unmutes and starts audio.
 */
export function MuteToggle() {
  const [muted, setMutedState] = useState<boolean>(() => isMuted());

  const handleClick = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  // When muted, the button's action is to turn sound ON.
  const label = muted ? 'Ton an' : 'Ton aus';

  return (
    <button
      type="button"
      className="mute-toggle"
      aria-pressed={muted}
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
      <span className="mute-toggle-label">{label}</span>
    </button>
  );
}
