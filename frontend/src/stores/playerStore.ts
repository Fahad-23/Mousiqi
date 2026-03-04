import { create } from "zustand";
import type { SearchResult } from "../types/index.ts";
import { getStreamUrl } from "../lib/api.ts";

interface Track extends SearchResult {
  streamUrl?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  hasEnded: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  loadingTrack: boolean;

  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  setHasEnded: (ended: boolean) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
}

async function fetchAndPlay(
  track: Track,
  set: (partial: Partial<PlayerState>) => void
): Promise<void> {
  if (track.streamUrl) {
    set({ currentTrack: track, isPlaying: true, hasEnded: false, loadingTrack: false });
    return;
  }
  set({ loadingTrack: true });
  try {
    const stream = await getStreamUrl(track.videoId);
    const loaded = { ...track, streamUrl: stream.url };
    set({ currentTrack: loaded, isPlaying: true, hasEnded: false, loadingTrack: false });
  } catch {
    set({ loadingTrack: false });
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  hasEnded: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  queue: [],
  queueIndex: -1,
  loadingTrack: false,

  setCurrentTrack: (track) => set({ currentTrack: track, hasEnded: false }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setHasEnded: (ended) => set({ hasEnded: ended }),
  togglePlayPause: () => {
    const { hasEnded } = get();
    if (hasEnded) {
      // Replay: reset to beginning
      set({ hasEnded: false, isPlaying: true, currentTime: 0 });
    } else {
      set((s) => ({ isPlaying: !s.isPlaying }));
    }
  },
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),

  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
      hasEnded: false,
    }),

  playNext: async () => {
    const { queue, queueIndex } = get();
    if (queueIndex < queue.length - 1) {
      const next = queueIndex + 1;
      set({ queueIndex: next });
      await fetchAndPlay(queue[next], set);
    }
  },

  playPrevious: async () => {
    const { queue, queueIndex } = get();
    if (queueIndex > 0) {
      const prev = queueIndex - 1;
      set({ queueIndex: prev });
      await fetchAndPlay(queue[prev], set);
    }
  },
}));
