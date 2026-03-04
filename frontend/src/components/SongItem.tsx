import { useState } from "react";
import type { SearchResult } from "../types/index.ts";
import { usePlayerStore } from "../stores/playerStore.ts";
import { usePlaylistStore } from "../stores/playlistStore.ts";
import { getStreamUrl } from "../lib/api.ts";

interface SongItemProps {
  song: SearchResult;
  index: number;
  allSongs: SearchResult[];
}

export function SongItem({ song, index, allSongs }: SongItemProps) {
  const { setCurrentTrack, setQueue, currentTrack } = usePlayerStore();
  const { playlists, addSong } = usePlaylistStore();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = currentTrack?.videoId === song.videoId;

  const handlePlay = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const stream = await getStreamUrl(song.videoId);
      const tracksWithStream = allSongs.map((s) =>
        s.videoId === song.videoId ? { ...s, streamUrl: stream.url } : s
      );
      setQueue(tracksWithStream, index);
      setCurrentTrack({ ...song, streamUrl: stream.url });
    } catch (err) {
      console.error("Failed to get stream:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    await addSong(playlistId, {
      videoId: song.videoId,
      title: song.title,
      thumbnailUrl: song.thumbnailUrl,
    });
    setShowPlaylistMenu(false);
  };

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-purple-600/30 border border-purple-500/50"
          : "hover:bg-white/5"
      }`}
    >
      <img
        src={song.thumbnailUrl}
        alt=""
        className="w-12 h-12 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0" onClick={handlePlay}>
        <p className="text-white text-sm truncate">{song.title}</p>
      </div>
      {loading && (
        <span className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin flex-shrink-0" />
      )}
      <div className="relative flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPlaylistMenu(!showPlaylistMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-white/50 hover:text-white transition-all"
          title="Add to playlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        {showPlaylistMenu && playlists.length > 0 && (
          <div className="absolute right-0 top-8 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[160px]">
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToPlaylist(pl.id);
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                {pl.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
