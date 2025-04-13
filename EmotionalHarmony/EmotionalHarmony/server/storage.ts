import { 
  users, type User, type InsertUser,
  tracks, type Track, type InsertTrack,
  type EmotionType
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllTracks(): Promise<Track[]>;
  getTrackById(id: number): Promise<Track | undefined>;
  getTracksByEmotion(emotion: EmotionType): Promise<Track[]>;
  getTracksByLanguage(language: string): Promise<Track[]>;
  getTracksByEmotionAndLanguage(emotion: EmotionType, language: string): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  initializeTracksIfNeeded(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllTracks(): Promise<Track[]> {
    return await db.select().from(tracks);
  }

  async getTrackById(id: number): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track || undefined;
  }

  async getTracksByEmotion(emotion: EmotionType): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.emotion, emotion));
  }

  async getTracksByLanguage(language: string): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.language, language));
  }

  async getTracksByEmotionAndLanguage(emotion: EmotionType, language: string): Promise<Track[]> {
    return await db
      .select()
      .from(tracks)
      .where(and(eq(tracks.emotion, emotion), eq(tracks.language, language)));
  }

  async createTrack(insertTrack: InsertTrack & { language?: string }): Promise<Track> {
    const trackToInsert = {
      ...insertTrack,
      language: insertTrack.language || "english" 
    };

    const [track] = await db
      .insert(tracks)
      .values(trackToInsert)
      .returning();
    return track;
  }

  // Initialize tracks if none exist yet
  async initializeTracksIfNeeded(): Promise<void> {
    const existingTracks = await db.select().from(tracks);
    
    if (existingTracks.length === 0) {
      // Joy tracks - English
      await this.createTrack({
        title: "Walking on Sunshine",
        artist: "Katrina & The Waves",
        duration: "3:54",
        audioUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
        coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&h=400",
        emotion: "joy",
        language: "english",
      });
      
      await this.createTrack({
        title: "Happy",
        artist: "Pharrell Williams",
        duration: "3:53",
        audioUrl: "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
        coverUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?auto=format&fit=crop&w=600&h=400",
        emotion: "joy",
        language: "english",
      });
      
      // Joy tracks - Hindi
      await this.createTrack({
        title: "Badtameez Dil",
        artist: "Benny Dayal",
        duration: "4:08",
        audioUrl: "https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg",
        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=600&h=400",
        emotion: "joy",
        language: "hindi",
      });
      
      await this.createTrack({
        title: "Nagada Sang Dhol",
        artist: "Shreya Ghoshal",
        duration: "3:29",
        audioUrl: "https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum.ogg",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&h=400",
        emotion: "joy",
        language: "hindi",
      });

      // Sadness tracks - English
      await this.createTrack({
        title: "Someone Like You",
        artist: "Adele",
        duration: "4:45",
        audioUrl: "https://actions.google.com/sounds/v1/ambiences/stream_water_flow.ogg",
        coverUrl: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&w=600&h=400",
        emotion: "sadness",
        language: "english",
      });
      
      // Sadness tracks - Hindi
      await this.createTrack({
        title: "Channa Mereya",
        artist: "Arijit Singh",
        duration: "4:55",
        audioUrl: "https://actions.google.com/sounds/v1/ambiences/ambient_hum.ogg",
        coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&h=400",
        emotion: "sadness",
        language: "hindi",
      });

      // Anger tracks - English
      await this.createTrack({
        title: "Break Stuff",
        artist: "Limp Bizkit",
        duration: "2:46",
        audioUrl: "https://actions.google.com/sounds/v1/alarms/beeps_and_bloops.ogg",
        coverUrl: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?auto=format&fit=crop&w=600&h=400",
        emotion: "anger",
        language: "english",
      });
      
      // Anger tracks - Hindi
      await this.createTrack({
        title: "Dhoom Machale",
        artist: "Sunidhi Chauhan",
        duration: "5:13",
        audioUrl: "https://actions.google.com/sounds/v1/weapons/big_explosion_cut_off.ogg",
        coverUrl: "https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?auto=format&fit=crop&w=600&h=400",
        emotion: "anger",
        language: "hindi",
      });

      // Neutral tracks - English
      await this.createTrack({
        title: "Weightless",
        artist: "Marconi Union",
        duration: "8:08",
        audioUrl: "https://actions.google.com/sounds/v1/nature/birds_chirping.ogg",
        coverUrl: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&w=600&h=400",
        emotion: "neutral",
        language: "english",
      });
      
      // Neutral tracks - Hindi
      await this.createTrack({
        title: "Tum Hi Ho Bandhu",
        artist: "Kavita Seth",
        duration: "3:42",
        audioUrl: "https://actions.google.com/sounds/v1/water/day_at_beach.ogg",
        coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&h=400",
        emotion: "neutral",
        language: "hindi",
      });
    }
  }
}

export const storage = new DatabaseStorage();
