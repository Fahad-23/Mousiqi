import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  });
}
