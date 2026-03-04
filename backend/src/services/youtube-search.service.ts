import { google } from "googleapis";
import { createHash } from "crypto";
import { env } from "../config/env.js";
import { getCache, setCache } from "./cache.service.js";
import { db } from "../config/database.js";
import { searchHistory } from "../db/schema.js";
import type { SearchResult } from "../types/index.js";

const youtube = google.youtube({
  version: "v3",
  auth: env.YOUTUBE_API_KEY,
});

const SEARCH_CACHE_TTL = 600; // 10 minutes

function cacheKey(query: string, limit: number): string {
  const hash = createHash("sha256")
    .update(`${query}:${limit}`)
    .digest("hex")
    .slice(0, 16);
  return `search:${hash}`;
}

export async function searchYouTube(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const key = cacheKey(query, limit);

  const cached = await getCache<SearchResult[]>(key);
  if (cached) return cached;

  const response = await youtube.search.list({
    part: ["snippet"],
    q: query,
    type: ["video"],
    maxResults: limit,
    fields:
      "items(id/videoId,snippet/title,snippet/thumbnails/medium/url)",
  });

  const results: SearchResult[] = (response.data.items || []).map((item) => ({
    videoId: item.id?.videoId || "",
    title: item.snippet?.title || "",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url || "",
  }));

  await setCache(key, results, SEARCH_CACHE_TTL);

  // Store in search history (non-blocking)
  db.insert(searchHistory)
    .values({ query, resultCount: results.length })
    .catch(() => {}); // fire and forget

  return results;
}
