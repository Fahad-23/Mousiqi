import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const songs = pgTable(
  "songs",
  {
    id: serial("id").primaryKey(),
    videoId: varchar("video_id", { length: 20 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
    duration: integer("duration"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("songs_video_id_idx").on(table.videoId)]
);

export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id")
    .references(() => playlists.id, { onDelete: "cascade" })
    .notNull(),
  songId: integer("song_id")
    .references(() => songs.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 500 }).notNull(),
  resultCount: integer("result_count"),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
});
