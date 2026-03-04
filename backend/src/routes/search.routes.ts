import type { FastifyInstance } from "fastify";
import { searchYouTube } from "../services/youtube-search.service.js";
import { db } from "../config/database.js";
import { searchHistory } from "../db/schema.js";
import { desc } from "drizzle-orm";

const searchQuerySchema = {
  type: "object" as const,
  required: ["q"],
  properties: {
    q: { type: "string" as const, minLength: 1, maxLength: 200 },
    limit: { type: "integer" as const, minimum: 1, maximum: 25, default: 10 },
  },
};

export async function searchRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { q: string; limit?: number } }>(
    "/api/search",
    {
      schema: { querystring: searchQuerySchema },
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
    },
    async (request) => {
      const { q, limit = 10 } = request.query;
      const results = await searchYouTube(q.trim(), limit);
      return { data: results };
    }
  );

  app.get<{ Querystring: { limit?: number } }>(
    "/api/search/history",
    async (request) => {
      const limit = Math.min(Number(request.query.limit) || 10, 50);
      const history = await db
        .select()
        .from(searchHistory)
        .orderBy(desc(searchHistory.searchedAt))
        .limit(limit);
      return { data: history };
    }
  );
}
