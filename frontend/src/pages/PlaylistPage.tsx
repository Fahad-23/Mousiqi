import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlaylistStore } from "../stores/playlistStore.ts";
import { usePlayerStore } from "../stores/playerStore.ts";
import { getStreamUrl } from "../lib/api.ts";

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedPlaylist, selectPlaylist, removeSong, loading } =
    usePlaylistStore();
  const { setCurrentTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    if (id) selectPlaylist(Number(id));
  }, [id, selectPlaylist]);

  if (loading || !selectedPlaylist) {
    return (
      <div className="flex justify-center py-12">
        <span className="w-8 h-8 border-3 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  const songs = selectedPlaylist.songs || [];

  const handlePlay = async (index: number) => {
    const song = songs[index];
    try {
      const stream = await getStreamUrl(song.videoId);
      const tracks = songs.map((s) => ({
        videoId: s.videoId,
        title: s.title,
        thumbnailUrl: s.thumbnailUrl || "",
      }));
      setQueue(
        tracks.map((t, i) =>
          i === index ? { ...t, streamUrl: stream.url } : t
        ),
        index
      );
      setCurrentTrack({
        videoId: song.videoId,
        title: song.title,
        thumbnailUrl: song.thumbnailUrl || "",
        streamUrl: stream.url,
      });
    } catch (err) {
      console.error("Failed to get stream:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        {selectedPlaylist.name}
      </h1>
      {songs.length === 0 ? (
        <p className="text-white/30 text-center py-8">
          No songs yet. Search and add songs to this playlist.
        </p>
      ) : (
        <div className="space-y-1">
          {songs.map((song, i) => (
            <div
              key={song.id}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-white/30 text-sm w-6 text-right">
                {i + 1}
              </span>
              {song.thumbnailUrl && (
                <img
                  src={song.thumbnailUrl}
                  alt=""
                  className="w-10 h-10 rounded object-cover"
                />
              )}
              <button
                onClick={() => handlePlay(i)}
                className="flex-1 text-left min-w-0"
              >
                <p className="text-white text-sm truncate">{song.title}</p>
              </button>
              <button
                onClick={() => removeSong(selectedPlaylist.id, song.id)}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-sm transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
