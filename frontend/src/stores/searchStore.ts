import { create } from "zustand";
import type { SearchResult } from "../types/index.ts";
import { searchSongs } from "../lib/api.ts";

interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;

  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  loading: false,
  error: null,

  setQuery: (query) => set({ query }),

  search: async (query) => {
    if (!query.trim()) return;
    set({ loading: true, error: null });
    try {
      const results = await searchSongs(query);
      set({ results, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Search failed";
      set({ error: message, loading: false });
    }
  },

  clear: () => set({ query: "", results: [], error: null }),
}));
