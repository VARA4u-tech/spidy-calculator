// Synthesized retro SFX via Web Audio API — no external assets, no eval.
// Pure client-side: every function is a no-op on the server or when muted.

let ctx: AudioContext | null = null;
let muted = false;
const MUTED_KEY = "webslinger-sound-muted";

export function loadSoundPref(): void {
  if (typeof window === "undefined") return;
  try {
    muted = window.localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    // storage unavailable — keep default
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUTED_KEY, value ? "1" : "0");
  } catch {
    // storage unavailable — session-only preference
  }
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

function audio(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function haptic(ms = 10): void {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(ms);
    } catch {
      // vibration unavailable
    }
  }
}

function blip(
  freq: number,
  duration = 0.07,
  type: OscillatorType = "square",
  volume = 0.08,
  slideTo?: number,
): void {
  haptic(8);
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const t = ac.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

/** Light tap for digits and decimal point. */
export const sfxKey = (): void => blip(440, 0.05, "square", 0.06);
/** Generic UI click. */
export const sfxClick = (): void => blip(440, 0.05, "square", 0.06);
/** Low "thup" for backspace. */
export const sfxBackspace = (): void => blip(220, 0.08, "triangle", 0.08, 160);
/** Rising zap for operators. */
export const sfxOperator = (): void => blip(330, 0.09, "sawtooth", 0.07, 495);
/** Down-sweep whoosh for clear-all. */
export const sfxClear = (): void => blip(600, 0.18, "sawtooth", 0.07, 120);
/** Double-blip for percent / sign-flip / UI toggles. */
export const sfxToggle = (): void => blip(500, 0.05, "triangle", 0.06);
/** Tiny ascending fanfare for equals. */
export function sfxEquals(): void {
  [523.25, 659.25, 783.99].forEach((f, i) =>
    window.setTimeout(() => blip(f, 0.12, "square", 0.07), i * 60),
  );
}
/** Menacing buzz for errors (divide by zero). */
export function sfxError(): void {
  blip(180, 0.25, "sawtooth", 0.1, 90);
}
