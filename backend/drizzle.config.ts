import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || "mousiqi",
    user: process.env.POSTGRES_USER || "mousiqi",
    password: process.env.POSTGRES_PASSWORD || "changeme",
  },
});
