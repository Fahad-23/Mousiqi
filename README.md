# Mousiqi

A modern YouTube music player built with TypeScript, React, and Fastify.

Search for songs on YouTube, stream audio, and organize your music into playlists.

### [Watch Demo Video](https://drive.google.com/file/d/15-3-MQ3LWkqQGWBu4znCwrXS7D_JIZtI/view?usp=sharing)

## Tech Stack

- **Backend**: Fastify, TypeScript, Drizzle ORM, PostgreSQL, Redis, yt-dlp
- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand
- **Infrastructure**: Docker Compose

## Features

- YouTube search with Redis caching (preserves API quota)
- Audio streaming via yt-dlp with cached stream URLs
- Playlist creation and management (PostgreSQL)
- Persistent audio player with seek, volume, next/previous, and replay
- Rate limiting and input validation
- Health check endpoint for monitoring

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL + Redis)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (`pip install yt-dlp`)
- [YouTube Data API v3 key](https://console.cloud.google.com/apis/credentials)

### Dev Mode (recommended)

```bash
cp .env.example .env
# Edit .env: add YOUTUBE_API_KEY and POSTGRES_PASSWORD

# Start PostgreSQL + Redis
docker compose -f docker-compose.infra.yml up -d

# Backend (terminal 1)
cd backend && npm install && npm run db:migrate && npm run dev

# Frontend (terminal 2)
cd frontend && npm install && npm run dev
```

App available at `http://localhost:3000`

### Full Docker Stack

```bash
cp .env.example .env
# Edit .env
docker compose up --build
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
│       ├── services/ # Business logic (YouTube search, streaming, playlists)
│       └── db/       # Drizzle ORM schema and migrations
├── frontend/         # React SPA
│   └── src/
│       ├── components/  # SearchBar, AudioPlayer, PlaylistSidebar, etc.
│       ├── pages/       # SearchPage, PlaylistPage
│       ├── stores/      # Zustand (player, search, playlist)
│       └── hooks/       # useAudioPlayer, useDebounce
├── docker-compose.yml        # Full stack
└── docker-compose.infra.yml  # Dev infra only (PostgreSQL + Redis)
```
