import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Track schema
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  duration: text("duration").notNull(),
  audioUrl: text("audio_url").notNull(),
  coverUrl: text("cover_url").notNull(),
  emotion: text("emotion").notNull(),
  language: text("language").default("english"),
  spotifyId: text("spotify_id"),
  externalUrl: text("external_url"),
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
});

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

// Emotion types and schema
export const emotionTypes = ["joy", "sadness", "anger", "neutral"] as const;
export type EmotionType = typeof emotionTypes[number];

export const emotionSchema = z.object({
  type: z.enum(emotionTypes),
  score: z.number().min(0).max(1),
  description: z.string(),
});

export type Emotion = z.infer<typeof emotionSchema>;

// Define track data validation for API responses
export const trackSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string(),
  duration: z.string(),
  audioUrl: z.string(),
  coverUrl: z.string(),
  emotion: z.enum(emotionTypes),
  language: z.string().default("english"),
  spotifyId: z.string().nullable(),
  externalUrl: z.string().nullable(),
});

// Version of track schema that can handle Spotify tracks that don't have IDs initially
export const trackResponseSchema = trackSchema.extend({
  id: z.number().optional().default(0),
  spotifyId: z.string().nullable().optional(),
  externalUrl: z.string().nullable().optional(),
});

export type TrackData = z.infer<typeof trackSchema>;
export type TrackResponse = z.infer<typeof trackResponseSchema>;
export type EmotionWithTracks = { emotion: Emotion; tracks: TrackResponse[] };
