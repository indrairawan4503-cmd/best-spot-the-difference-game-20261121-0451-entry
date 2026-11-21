// WebAudio blips only, no audio files: a warm "pop" on a find, a low buzz on a miss, a
// soft chime on level complete. Everything is lazy and guarded, so a headless screenshot
// run (no user gesture) never throws.
let context = null;

function audioContext() {
  if (context) return context;
  try {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  } catch {
    return null;
  }
  return context;
}

function tone(freqStart, freqEnd, seconds, type, gainValue, when = 0) {
  const ctx = audioContext();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + seconds);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + seconds + 0.05);
  } catch {
    // Sound is garnish; a blocked context must never break the game.
  }
}

/** A satisfying two-note pop when a difference is found. */
export function playFound() {
  tone(620, 940, 0.12, 'sine', 0.16);
  tone(930, 1240, 0.16, 'sine', 0.12, 0.07);
}

/** A dull thud for a wrong click. */
export function playWrong() {
  tone(180, 110, 0.16, 'square', 0.07);
}

/** A rising chime when a level is cleared. */
export function playLevelClear() {
  tone(523, 523, 0.14, 'triangle', 0.12);
  tone(659, 659, 0.14, 'triangle', 0.12, 0.11);
  tone(784, 784, 0.22, 'triangle', 0.14, 0.22);
}

/** A short sparkle when a hint is spent. */
export function playHint() {
  tone(1180, 1560, 0.18, 'sine', 0.08);
}
