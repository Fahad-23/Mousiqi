import { execFile } from "child_process";
import { promisify } from "util";
import { getCache, setCache } from "./cache.service.js";
import type { StreamInfo } from "../types/index.js";

const execFileAsync = promisify(execFile);

const STREAM_CACHE_TTL = 14400; // 4 hours

const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function isValidVideoId(videoId: string): boolean {
  return VIDEO_ID_REGEX.test(videoId);
}

export async function getAudioStreamUrl(
  videoId: string
): Promise<StreamInfo> {
  const key = `stream:${videoId}`;

  const cached = await getCache<StreamInfo>(key);
  if (cached && cached.expiresAt > Date.now()) return cached;

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  // Use yt-dlp to extract the best audio stream URL
  const { stdout } = await execFileAsync("yt-dlp", [
    "--no-download",
    "-f", "bestaudio",
    "--get-url",
    url,
  ], { timeout: 30_000 });

  const streamUrl = stdout.trim();
  if (!streamUrl) {
    throw new Error("yt-dlp returned no URL");
  }

  const streamInfo: StreamInfo = {
    url: streamUrl,
    expiresAt: Date.now() + STREAM_CACHE_TTL * 1000,
  };

  await setCache(key, streamInfo, STREAM_CACHE_TTL);

  return streamInfo;
}
