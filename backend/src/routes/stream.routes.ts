import type { FastifyInstance } from "fastify";
import {
  getAudioStreamUrl,
  isValidVideoId,
} from "../services/youtube-stream.service.js";

export async function streamRoutes(app: FastifyInstance) {
  app.get<{ Params: { videoId: string } }>(
    "/api/stream/:videoId",
    async (request, reply) => {
      const { videoId } = request.params;

      if (!isValidVideoId(videoId)) {
        return reply.status(400).send({
          error: { message: "Invalid video ID format", code: "INVALID_VIDEO_ID" },
        });
      }

      try {
        const streamInfo = await getAudioStreamUrl(videoId);
        return { data: streamInfo };
      } catch (err) {
        request.log.error(err, "Failed to get audio stream");
        return reply.status(502).send({
          error: {
            message: "Unable to extract audio stream. The video may be unavailable.",
            code: "STREAM_ERROR",
          },
        });
      }
    }
  );
}
