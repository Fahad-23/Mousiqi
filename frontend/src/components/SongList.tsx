import { useSearchStore } from "../stores/searchStore.ts";
import { SongItem } from "./SongItem.tsx";

export function SongList() {
  const { results, loading, error } = useSearchStore();

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="w-8 h-8 border-3 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-white/30">
        <p className="text-lg">Search for music to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {results.map((song, i) => (
        <SongItem
          key={song.videoId}
          song={song}
          index={i}
          allSongs={results}
        />
      ))}
    </div>
  );
}
