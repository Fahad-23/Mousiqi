import { cleanEnv, str, port, num } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  YOUTUBE_API_KEY: str({ desc: "YouTube Data API v3 key" }),

  POSTGRES_HOST: str({ default: "localhost" }),
  POSTGRES_PORT: num({ default: 5433 }),
  POSTGRES_DB: str({ default: "mousiqi" }),
  POSTGRES_USER: str({ default: "mousiqi" }),
  POSTGRES_PASSWORD: str(),

  REDIS_HOST: str({ default: "localhost" }),
  REDIS_PORT: num({ default: 6380 }),

  CORS_ORIGIN: str({ default: "http://localhost:3000" }),
});
