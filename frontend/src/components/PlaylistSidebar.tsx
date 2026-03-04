import { useState, useEffect } from "react";
import { usePlaylistStore } from "../stores/playlistStore.ts";
import { useNavigate } from "react-router-dom";

export function PlaylistSidebar() {
  const {
    playlists,
    selectedPlaylist,
    fetchPlaylists,
    createPlaylist,
    deletePlaylist,
    selectPlaylist,
    clearSelection,
  } = usePlaylistStore();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createPlaylist(newName.trim());
    setNewName("");
    setCreating(false);
  };

  return (
    <aside className="w-56 bg-gray-900/50 border-r border-white/10 flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/70 text-xs font-semibold uppercase tracking-wider">
            Playlists
          </h2>
          <button
            onClick={() => setCreating(!creating)}
            className="text-white/40 hover:text-white text-lg leading-none transition-colors"
            title="New playlist"
          >
            +
          </button>
        </div>

        {creating && (
          <div className="flex gap-1 mb-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Name"
              autoFocus
              className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleCreate}
              className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-500"
            >
              Add
            </button>
          </div>
        )}

        <button
          onClick={() => {
            clearSelection();
            navigate("/");
          }}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            !selectedPlaylist
              ? "bg-white/10 text-white"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Search
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-0.5">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className={`group flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
              selectedPlaylist?.id === pl.id
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => {
              selectPlaylist(pl.id);
              navigate(`/playlist/${pl.id}`);
            }}
          >
            <span className="truncate">{pl.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePlaylist(pl.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs transition-all"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
