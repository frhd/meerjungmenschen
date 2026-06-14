// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

// jsdom has no AudioContext; we install a minimal fake so the synth code runs
// without throwing and we can count node creations. Each test re-imports the
// module fresh (vi.resetModules) so its `muted` state is read cleanly.

let oscCount = 0;

function makeParam() {
  return {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  };
}

class FakeAudioContext {
  currentTime = 0;
  destination = {};
  resume = vi.fn(() => Promise.resolve());
  createOscillator() {
    oscCount += 1;
    return {
      type: 'sine',
      frequency: makeParam(),
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      onended: null as null | (() => void),
    };
  }
  createGain() {
    return {
      gain: makeParam(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: makeParam(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }
}

function installAudio() {
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
}

function removeAudio() {
  delete (window as unknown as { AudioContext?: unknown }).AudioContext;
  delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;
}

async function freshModule() {
  vi.resetModules();
  return import('./sound');
}

beforeEach(() => {
  oscCount = 0;
  localStorage.clear();
  installAudio();
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  removeAudio();
});

describe('sound module', () => {
  it('defaults to muted when localStorage is empty', async () => {
    const sound = await freshModule();
    expect(sound.isMuted()).toBe(true);
  });

  it('reads a persisted unmuted state on init', async () => {
    localStorage.setItem('mm.muted', 'false');
    const sound = await freshModule();
    expect(sound.isMuted()).toBe(false);
  });

  it('setMuted(false) unmutes and persists "false"', async () => {
    const sound = await freshModule();
    sound.setMuted(false);
    expect(sound.isMuted()).toBe(false);
    expect(localStorage.getItem('mm.muted')).toBe('false');
  });

  it('setMuted(true) mutes and persists "true"', async () => {
    const sound = await freshModule();
    sound.setMuted(false);
    sound.setMuted(true);
    expect(sound.isMuted()).toBe(true);
    expect(localStorage.getItem('mm.muted')).toBe('true');
  });

  it('toggleMute flips and returns the new state', async () => {
    const sound = await freshModule();
    expect(sound.toggleMute()).toBe(false);
    expect(sound.toggleMute()).toBe(true);
  });

  it('playBlip creates no oscillator while muted', async () => {
    const sound = await freshModule();
    expect(sound.isMuted()).toBe(true);
    sound.playBlip();
    expect(oscCount).toBe(0);
  });

  it('playBlip creates an oscillator after unmuting', async () => {
    const sound = await freshModule();
    sound.setMuted(false);
    const afterUnmute = oscCount; // ambience oscillators
    sound.playBlip();
    expect(oscCount).toBeGreaterThan(afterUnmute);
  });

  it('setMuted(false) resumes the context and starts ambience', async () => {
    const sound = await freshModule();
    sound.setMuted(false);
    // Ambience uses oscillators (drone + LFO).
    expect(oscCount).toBeGreaterThan(0);
  });

  it('is a safe no-op when AudioContext is undefined', async () => {
    removeAudio();
    const sound = await freshModule();
    expect(() => {
      sound.setMuted(false);
      sound.playBlip();
      sound.setMuted(true);
    }).not.toThrow();
    // State still tracks even without an audio context.
    expect(sound.isMuted()).toBe(true);
  });

  it('defaults to muted when localStorage throws', async () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('blocked');
    });
    try {
      const sound = await freshModule();
      expect(sound.isMuted()).toBe(true);
    } finally {
      Storage.prototype.getItem = original;
    }
  });
});
