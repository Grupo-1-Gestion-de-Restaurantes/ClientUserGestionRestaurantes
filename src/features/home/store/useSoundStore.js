import { create } from "zustand";

/**
 * Ambient space audio using Web Audio API oscillators.
 * No external files needed — generates a subtle deep-space drone.
 */
export const useSoundStore = create((set, get) => ({
  audioContext: null,
  gainNode: null,
  isPlaying: false,

  /** Call ONLY after a user gesture (click on START) to comply with browser autoplay policy. */
  initAudio: () => {
    if (get().audioContext) return; // Already initialized

    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(ctx.destination);

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    filter.connect(masterGain);

    // Two slightly detuned sine oscillators → beating "space hum"
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 60;
    osc1.connect(filter);
    osc1.start();

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 63; // 3 Hz beat
    osc2.connect(filter);
    osc2.start();

    // Subtle high shimmer
    const shimmer = ctx.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.value = 440;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.005;
    shimmer.connect(shimmerGain).connect(masterGain);
    shimmer.start();

    set({ audioContext: ctx, gainNode: masterGain, isPlaying: true });
  },

  toggle: () => {
    const { audioContext, isPlaying, gainNode } = get();
    if (!audioContext || !gainNode) return;

    const now = audioContext.currentTime;
    if (isPlaying) {
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      set({ isPlaying: false });
    } else {
      gainNode.gain.linearRampToValueAtTime(0.04, now + 0.5);
      set({ isPlaying: true });
    }
  },
}));
