import Fastify, { type FastifyError } from "fastify";
import { env } from "./config/env.js";
import { registerCors } from "./plugins/cors.js";
import { registerRateLimit } from "./plugins/rate-limit.js";
import { registerHelmet } from "./plugins/helmet.js";
import { searchRoutes } from "./routes/search.routes.js";
import { streamRoutes } from "./routes/stream.routes.js";
import { playlistRoutes } from "./routes/playlist.routes.js";
import { healthRoutes } from "./routes/health.routes.js";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    ...(env.NODE_ENV !== "production" && {
      transport: { target: "pino-pretty" },
    }),
  },
});

// Global error handler — never leak internals
app.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      error: { message: error.message, code: "VALIDATION_ERROR" },
    });
  }

  if (error.statusCode === 429) {
    return reply.status(429).send({
      error: { message: "Too many requests. Please slow down.", code: "RATE_LIMITED" },
    });
  }

  return reply.status(500).send({
    error: {
      message:
        env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
      code: "INTERNAL_ERROR",
    },
  });
});

// Plugins
await registerCors(app);
await registerHelmet(app);
await registerRateLimit(app);

// Routes
await app.register(searchRoutes);
await app.register(streamRoutes);
await app.register(playlistRoutes);
await app.register(healthRoutes);

// Start
try {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  app.log.info(`Mousiqi API running on port ${env.PORT}`);
} catch (err) {
  app.log.fatal(err);
  process.exit(1);
}
