# Mousiqi

A modern YouTube music player built with TypeScript, React, and Fastify.

Search for songs on YouTube, stream audio, and organize your music into playlists.

## Tech Stack

- **Backend**: Fastify, TypeScript, Drizzle ORM, PostgreSQL, Redis
- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand
- **Infrastructure**: Docker Compose

## Quick Start

### With Docker (recommended)

```bash
cp .env.example .env
# Edit .env and add your YOUTUBE_API_KEY
docker compose up
```

App available at `http://localhost:3000`

### Without Docker

**Prerequisites**: Node.js 20+, PostgreSQL 16+, Redis 7+

```bash
# Backend
cd backend
npm install
npm run db:migrate
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Yes | [YouTube Data API v3 key](https://console.cloud.google.com/apis/credentials) |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `CORS_ORIGIN` | No | Allowed origin (default: `http://localhost:3000`) |

## Project Structure

```
mousiqi-app/
├── backend/          # Fastify API server
│   └── src/
│       ├── config/   # Environment, database, Redis
│       ├── routes/   # API endpoints
│       ├── services/ # Business logic
│       └── db/       # Schema and migrations
├── frontend/         # React SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── stores/   # Zustand state
│       └── hooks/    # Custom React hooks
└── docker-compose.yml
```
