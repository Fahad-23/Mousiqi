import { create } from "zustand";
import type { SearchResult } from "../types/index.ts";

interface Track extends SearchResult {
  streamUrl?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  queueIndex: number;

  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  queue: [],
  queueIndex: -1,

  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlayPause: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),

  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
    }),

  playNext: () => {
    const { queue, queueIndex } = get();
    if (queueIndex < queue.length - 1) {
      const next = queueIndex + 1;
      set({ queueIndex: next, currentTrack: queue[next] });
    }
  },

  playPrevious: () => {
    const { queue, queueIndex } = get();
    if (queueIndex > 0) {
      const prev = queueIndex - 1;
      set({ queueIndex: prev, currentTrack: queue[prev] });
    }
  },
}));
