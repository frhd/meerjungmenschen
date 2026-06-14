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

  // The button is a "sound on" toggle: aria-pressed reflects whether sound is
  // currently ON (pressed = unmuted). The visible label describes the same
  // state ("Ton an" = sound is on, "Ton aus" = sound is off) so the icon,
  // label, aria-label and aria-pressed all tell one consistent story.
  const label = muted ? 'Ton aus' : 'Ton an';

  return (
    <button
      type="button"
      className="mute-toggle"
      aria-pressed={!muted}
      aria-label={`Ton: ${muted ? 'aus' : 'an'}`}
      title={label}
      onClick={handleClick}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
      <span className="mute-toggle-label">{label}</span>
    </button>
  );
}
