import { eq, asc, sql } from "drizzle-orm";
import { db } from "../config/database.js";
import { playlists, songs, playlistSongs } from "../db/schema.js";
import type { Playlist, PlaylistSong } from "../types/index.js";

export async function getAllPlaylists(): Promise<Playlist[]> {
  return db.select().from(playlists).orderBy(asc(playlists.createdAt));
}

export async function createPlaylist(name: string): Promise<Playlist> {
  const [result] = await db
    .insert(playlists)
    .values({ name })
    .returning();
  return result;
}

export async function getPlaylistWithSongs(
  playlistId: number
): Promise<(Playlist & { songs: PlaylistSong[] }) | null> {
  const playlist = await db
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1);

  if (playlist.length === 0) return null;

  const playlistSongRows = await db
    .select({
      id: playlistSongs.id,
      videoId: songs.videoId,
      title: songs.title,
      thumbnailUrl: songs.thumbnailUrl,
      duration: songs.duration,
      position: playlistSongs.position,
    })
    .from(playlistSongs)
    .innerJoin(songs, eq(playlistSongs.songId, songs.id))
    .where(eq(playlistSongs.playlistId, playlistId))
    .orderBy(asc(playlistSongs.position));

  return { ...playlist[0], songs: playlistSongRows };
}

export async function addSongToPlaylist(
  playlistId: number,
  songData: { videoId: string; title: string; thumbnailUrl?: string; duration?: number }
): Promise<void> {
  // Upsert song
  const [song] = await db
    .insert(songs)
    .values({
      videoId: songData.videoId,
      title: songData.title,
      thumbnailUrl: songData.thumbnailUrl || null,
      duration: songData.duration || null,
    })
    .onConflictDoUpdate({
      target: songs.videoId,
      set: { title: songData.title },
    })
    .returning();

  // Get next position
  const [{ max }] = await db
    .select({ max: sql<number>`COALESCE(MAX(${playlistSongs.position}), 0)` })
    .from(playlistSongs)
    .where(eq(playlistSongs.playlistId, playlistId));

  await db.insert(playlistSongs).values({
    playlistId,
    songId: song.id,
    position: (max || 0) + 1,
  });
}

export async function removeSongFromPlaylist(
  playlistId: number,
  songId: number
): Promise<boolean> {
  const result = await db
    .delete(playlistSongs)
    .where(
      sql`${playlistSongs.playlistId} = ${playlistId} AND ${playlistSongs.id} = ${songId}`
    )
    .returning();
  return result.length > 0;
}

export async function deletePlaylist(playlistId: number): Promise<boolean> {
  const result = await db
    .delete(playlists)
    .where(eq(playlists.id, playlistId))
    .returning();
  return result.length > 0;
}
