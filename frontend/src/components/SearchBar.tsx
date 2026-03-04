import { useState, useCallback } from "react";
import { useSearchStore } from "../stores/searchStore.ts";

export function SearchBar() {
  const [input, setInput] = useState("");
  const { search, loading } = useSearchStore();

  const handleSearch = useCallback(() => {
    if (input.trim()) search(input.trim());
  }, [input, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for songs..."
        className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
      />
      <button
        onClick={handleSearch}
        disabled={loading || !input.trim()}
        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Search"
        )}
      </button>
    </div>
  );
}
