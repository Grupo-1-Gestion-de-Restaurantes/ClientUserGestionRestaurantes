import { create } from "zustand";

export const useScrollStore = create((set) => ({
  progress: 0,
  setProgress: (newProgress) => set({ progress: newProgress }),
}));
