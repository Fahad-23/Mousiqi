import axios from "axios";
import type {
  SearchResult,
  StreamInfo,
  Playlist,
  ApiResponse,
} from "../types/index.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 15_000,
});

export async function searchSongs(
  query: string,
  limit = 10
): Promise<SearchResult[]> {
  const { data } = await api.get<ApiResponse<SearchResult[]>>("/api/search", {
    params: { q: query, limit },
  });
  return data.data;
}

export async function getStreamUrl(videoId: string): Promise<StreamInfo> {
  const { data } = await api.get<ApiResponse<StreamInfo>>(
    `/api/stream/${videoId}`
  );
  return data.data;
}

export async function getPlaylists(): Promise<Playlist[]> {
  const { data } = await api.get<ApiResponse<Playlist[]>>("/api/playlists");
  return data.data;
}

export async function createPlaylist(name: string): Promise<Playlist> {
  const { data } = await api.post<ApiResponse<Playlist>>("/api/playlists", {
    name,
  });
  return data.data;
}

export async function getPlaylist(id: number): Promise<Playlist> {
  const { data } = await api.get<ApiResponse<Playlist>>(
    `/api/playlists/${id}`
  );
  return data.data;
}

export async function addSongToPlaylist(
  playlistId: number,
  song: { videoId: string; title: string; thumbnailUrl?: string; duration?: number }
): Promise<void> {
  await api.post(`/api/playlists/${playlistId}/songs`, song);
}

export async function removeSongFromPlaylist(
  playlistId: number,
  songId: number
): Promise<void> {
  await api.delete(`/api/playlists/${playlistId}/songs/${songId}`);
}

export async function deletePlaylist(id: number): Promise<void> {
  await api.delete(`/api/playlists/${id}`);
}
