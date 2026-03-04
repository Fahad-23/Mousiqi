import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import { redis } from "../config/redis.js";

export async function registerRateLimit(app: FastifyInstance) {
  await app.register(rateLimit, {
    max: 60,
    timeWindow: "1 minute",
    redis,
    keyGenerator: (req) => req.ip,
  });
}
