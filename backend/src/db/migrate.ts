import { readFileSync } from "fs";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

// Load .env from project root (mousiqi-app/.env)
try {
  const envPath = resolve(import.meta.dirname, "../../../.env");
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0 && !process.env[key]) {
      process.env[key] = rest.join("=");
    }
  }
} catch {}

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5433,
  database: process.env.POSTGRES_DB || "mousiqi",
  user: process.env.POSTGRES_USER || "mousiqi",
  password: process.env.POSTGRES_PASSWORD || "changeme",
});

const db = drizzle(pool);

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migrations complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
