import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";

export async function registerHelmet(app: FastifyInstance) {
  await app.register(helmet, {
    contentSecurityPolicy: false, // frontend handles its own CSP
  });
}
