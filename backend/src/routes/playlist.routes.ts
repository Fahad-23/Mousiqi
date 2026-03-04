import type { FastifyInstance } from "fastify";
import {
  getAllPlaylists,
  createPlaylist,
  getPlaylistWithSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../services/playlist.service.js";

const createPlaylistSchema = {
  type: "object" as const,
  required: ["name"],
  properties: {
    name: { type: "string" as const, minLength: 1, maxLength: 255 },
  },
};

const addSongSchema = {
  type: "object" as const,
  required: ["videoId", "title"],
  properties: {
    videoId: { type: "string" as const, minLength: 1, maxLength: 20 },
    title: { type: "string" as const, minLength: 1, maxLength: 500 },
    thumbnailUrl: { type: "string" as const },
    duration: { type: "integer" as const },
  },
};

export async function playlistRoutes(app: FastifyInstance) {
  app.get("/api/playlists", async () => {
    const data = await getAllPlaylists();
    return { data };
  });

  app.post<{ Body: { name: string } }>(
    "/api/playlists",
    { schema: { body: createPlaylistSchema } },
    async (request, reply) => {
      const playlist = await createPlaylist(request.body.name.trim());
      return reply.status(201).send({ data: playlist });
    }
  );

  app.get<{ Params: { id: string } }>(
    "/api/playlists/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      if (isNaN(id)) {
        return reply
          .status(400)
          .send({ error: { message: "Invalid playlist ID", code: "INVALID_ID" } });
      }

      const playlist = await getPlaylistWithSongs(id);
      if (!playlist) {
        return reply
          .status(404)
          .send({ error: { message: "Playlist not found", code: "NOT_FOUND" } });
      }
      return { data: playlist };
    }
  );

  app.post<{
    Params: { id: string };
    Body: { videoId: string; title: string; thumbnailUrl?: string; duration?: number };
  }>(
    "/api/playlists/:id/songs",
    { schema: { body: addSongSchema } },
    async (request, reply) => {
      const id = Number(request.params.id);
      if (isNaN(id)) {
        return reply
          .status(400)
          .send({ error: { message: "Invalid playlist ID", code: "INVALID_ID" } });
      }

      await addSongToPlaylist(id, request.body);
      return reply.status(201).send({ data: { success: true } });
    }
  );

  app.delete<{ Params: { id: string; songId: string } }>(
    "/api/playlists/:id/songs/:songId",
    async (request, reply) => {
      const playlistId = Number(request.params.id);
      const songId = Number(request.params.songId);

      if (isNaN(playlistId) || isNaN(songId)) {
        return reply
          .status(400)
          .send({ error: { message: "Invalid ID", code: "INVALID_ID" } });
      }

      const removed = await removeSongFromPlaylist(playlistId, songId);
      if (!removed) {
        return reply
          .status(404)
          .send({ error: { message: "Song not found in playlist", code: "NOT_FOUND" } });
      }
      return { data: { success: true } };
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/api/playlists/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      if (isNaN(id)) {
        return reply
          .status(400)
          .send({ error: { message: "Invalid playlist ID", code: "INVALID_ID" } });
      }

      const deleted = await deletePlaylist(id);
      if (!deleted) {
        return reply
          .status(404)
          .send({ error: { message: "Playlist not found", code: "NOT_FOUND" } });
      }
      return { data: { success: true } };
    }
  );
}
