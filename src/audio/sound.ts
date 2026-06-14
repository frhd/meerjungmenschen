// Framework-agnostic Web Audio sound module. No audio asset files: every sound
// is synthesized at runtime so nothing binary is committed and there's no
// GitHub Pages base-path 404 trap.
//
// All Web Audio access is guarded: in test/SSR environments (no AudioContext)
// every function is a safe no-op. The AudioContext is created lazily on first
// real use because constructing one before a user gesture is blocked in browsers.

const STORAGE_KEY = 'mm.muted';

let ctx: AudioContext | null = null;
let ctxUnavailable = false;

// Ambient hum node references, kept so we can stop them cleanly.
interface Ambience {
  osc: OscillatorNode;
  osc2: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
}
let ambience: Ambience | null = null;

/** Lazily construct (and cache) the AudioContext. Returns null when unavailable. */
function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  if (ctxUnavailable) return null;
  try {
    const Ctor =
      typeof window !== 'undefined'
        ? window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        : undefined;
    if (!Ctor) {
      ctxUnavailable = true;
      return null;
    }
    ctx = new Ctor();
    return ctx;
  } catch {
    ctxUnavailable = true;
    return null;
  }
}

function readStoredMuted(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'false') return false;
    if (raw === 'true') return true;
    // Unset (or any other value) -> default muted.
    return true;
  } catch {
    // localStorage unavailable -> default muted.
    return true;
  }
}

// Default muted (true) until proven otherwise from storage.
let muted: boolean = readStoredMuted();

function persistMuted(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  } catch {
    // Ignore storage failures (private mode, SSR, etc.).
  }
}

/** Start the gentle looping underwater drone. No-op if already running or no ctx. */
function startAmbience(): void {
  if (ambience) return;
  const audio = getCtx();
  if (!audio) return;
  try {
    const now = audio.currentTime;

    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.04, now);

    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    const osc = audio.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, now);

    const osc2 = audio.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(96, now);

    // Slow LFO modulating the gain for a "wash" feel.
    const lfo = audio.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, now);
    const lfoGain = audio.createGain();
    lfoGain.gain.setValueAtTime(0.02, now);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.start();
    osc2.start();
    lfo.start();

    ambience = { osc, osc2, filter, gain, lfo, lfoGain };
  } catch {
    ambience = null;
  }
}

/** Stop and discard the ambient drone. */
function stopAmbience(): void {
  if (!ambience) return;
  try {
    ambience.osc.stop();
    ambience.osc2.stop();
    ambience.lfo.stop();
    ambience.osc.disconnect();
    ambience.osc2.disconnect();
    ambience.lfo.disconnect();
    ambience.lfoGain.disconnect();
    ambience.filter.disconnect();
    ambience.gain.disconnect();
  } catch {
    // Ignore teardown errors.
  }
  ambience = null;
}

export function isMuted(): boolean {
  return muted;
}

/**
 * Set the mute flag, persist it, and start/stop ambience accordingly.
 * Called from a user click (a gesture), so this is the right place to
 * resume the AudioContext and kick off audio.
 */
export function setMuted(next: boolean): void {
  muted = next;
  persistMuted(next);
  if (next) {
    stopAmbience();
    return;
  }
  const audio = getCtx();
  if (!audio) return;
  try {
    // resume() may return a promise; ignore it safely.
    const result = audio.resume?.();
    if (result && typeof (result as Promise<void>).catch === 'function') {
      (result as Promise<void>).catch(() => {});
    }
  } catch {
    // Ignore resume errors.
  }
  startAmbience();
}

/** Convenience toggle. Returns the new muted state. */
export function toggleMute(): boolean {
  setMuted(!muted);
  return muted;
}

/** Play a short, soft bubble/click. No-op when muted or no audio context. */
export function playBlip(): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;
  try {
    const now = audio.currentTime;

    const osc = audio.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.1);

    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.012); // quick attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11); // decay

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start(now);
    osc.stop(now + 0.12);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Ignore.
      }
    };
  } catch {
    // Ignore audio errors.
  }
}
