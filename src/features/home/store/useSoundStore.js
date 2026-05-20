import { create } from "zustand";

export const useSoundStore = create((set, get) => ({
  audio: null,
  isPlaying: true,
  isActuallyPlaying: false,

  initAudio: () => {
    let audio = get().audio;
    if (audio) return audio;

    audio = new Audio("/home/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.4;

    audio.oncanplaythrough = () => console.log("Ambient audio ready to play");
    audio.onerror = (e) => console.error("Error loading ambient audio:", e);

    set({ audio });
    return audio;
  },

  play: async () => {
    let { audio, isPlaying } = get();
    if (!audio) {
      audio = get().initAudio();
    }

    if (audio && isPlaying) {
      try {
        await audio.play();
        set({ isActuallyPlaying: true });
      } catch (err) {
        console.log("Playback blocked or failed:", err);
        set({ isActuallyPlaying: false });
      }
    }
  },

  pause: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      set({ isActuallyPlaying: false });
    }
  },

  toggle: async () => {
    let { audio, isPlaying, isActuallyPlaying } = get();
    if (!audio) {
      audio = get().initAudio();
    }

    const nextState = !isActuallyPlaying;
    set({ isPlaying: nextState });

    if (audio) {
      if (nextState) {
        try {
          await audio.play();
          set({ isActuallyPlaying: true });
        } catch (err) {
          console.log("Playback blocked or failed:", err);
          set({ isActuallyPlaying: false, isPlaying: false });
        }
      } else {
        audio.pause();
        set({ isActuallyPlaying: false });
      }
    }
  },
}));
