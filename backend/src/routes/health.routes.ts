import type { FastifyInstance } from "fastify";
import { checkDatabaseConnection } from "../config/database.js";
import { checkRedisConnection } from "../config/redis.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/api/health", async (_request, reply) => {
    const [dbOk, redisOk] = await Promise.all([
      checkDatabaseConnection(),
      checkRedisConnection(),
    ]);

    const status = dbOk && redisOk ? "healthy" : "degraded";
    const code = status === "healthy" ? 200 : 503;

    return reply.status(code).send({
      status,
      services: {
        database: dbOk ? "connected" : "disconnected",
        redis: redisOk ? "connected" : "disconnected",
      },
      timestamp: new Date().toISOString(),
    });
  });
}
