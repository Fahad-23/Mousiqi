import { create } from "zustand";
import type { Playlist } from "../types/index.ts";
import * as api from "../lib/api.ts";

interface PlaylistState {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
  loading: boolean;

  fetchPlaylists: () => Promise<void>;
  selectPlaylist: (id: number) => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  addSong: (
    playlistId: number,
    song: { videoId: string; title: string; thumbnailUrl?: string }
  ) => Promise<void>;
  removeSong: (playlistId: number, songId: number) => Promise<void>;
  deletePlaylist: (id: number) => Promise<void>;
  clearSelection: () => void;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  selectedPlaylist: null,
  loading: false,

  fetchPlaylists: async () => {
    set({ loading: true });
    const playlists = await api.getPlaylists();
    set({ playlists, loading: false });
  },

  selectPlaylist: async (id) => {
    set({ loading: true });
    const playlist = await api.getPlaylist(id);
    set({ selectedPlaylist: playlist, loading: false });
  },

  createPlaylist: async (name) => {
    await api.createPlaylist(name);
    await get().fetchPlaylists();
  },

  addSong: async (playlistId, song) => {
    await api.addSongToPlaylist(playlistId, song);
    const { selectedPlaylist } = get();
    if (selectedPlaylist?.id === playlistId) {
      await get().selectPlaylist(playlistId);
    }
  },

  removeSong: async (playlistId, songId) => {
    await api.removeSongFromPlaylist(playlistId, songId);
    const { selectedPlaylist } = get();
    if (selectedPlaylist?.id === playlistId) {
      await get().selectPlaylist(playlistId);
    }
  },

  deletePlaylist: async (id) => {
    await api.deletePlaylist(id);
    set((s) => ({
      playlists: s.playlists.filter((p) => p.id !== id),
      selectedPlaylist: s.selectedPlaylist?.id === id ? null : s.selectedPlaylist,
    }));
  },

  clearSelection: () => set({ selectedPlaylist: null }),
}));
