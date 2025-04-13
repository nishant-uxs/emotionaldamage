import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emotionTypes, trackSchema, emotionSchema, type EmotionType } from "@shared/schema";
import { z } from "zod";
import { getRecommendedTracks } from "./spotify";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tracks
  app.get("/api/tracks", async (req: Request, res: Response) => {
    try {
      const tracks = await storage.getAllTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks", error: (error as Error).message });
    }
  });

  // Get track by ID
  app.get("/api/tracks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      
      const track = await storage.getTrackById(id);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      res.json(track);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch track", error: (error as Error).message });
    }
  });

  // Get tracks by emotion
  app.get("/api/tracks/emotion/:emotion", async (req: Request, res: Response) => {
    try {
      const emotionParam = req.params.emotion;
      const language = req.query.language as string || "english"; // Default to English if no language is specified
      const source = req.query.source as string || "local"; // Can be "local" or "spotify"
      
      // Validate emotion parameter
      if (!emotionTypes.includes(emotionParam as any)) {
        return res.status(400).json({ 
          message: "Invalid emotion type", 
          valid: emotionTypes 
        });
      }
      
      // If source is spotify, get recommendations from Spotify API
      if (source === "spotify") {
        try {
          const spotifyTracks = await getRecommendedTracks(emotionParam as any, language, 10);
          
          // If we get tracks from Spotify, return them
          if (spotifyTracks && spotifyTracks.length > 0) {
            return res.json(spotifyTracks);
          }
          
          // If Spotify request fails or returns no tracks, fall back to local tracks
          console.log("Spotify API returned no tracks, falling back to local database");
        } catch (spotifyError) {
          console.error("Error fetching from Spotify:", spotifyError);
          // Continue with local tracks if Spotify fails
        }
      }
      
      // If language is specified, get tracks by emotion and language from local DB
      if (language) {
        const tracks = await storage.getTracksByEmotionAndLanguage(emotionParam as any, language);
        return res.json(tracks);
      }
      
      // Otherwise, get all tracks for the emotion from local DB
      const tracks = await storage.getTracksByEmotion(emotionParam as any);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks by emotion", error: (error as Error).message });
    }
  });
  
  // Get tracks by language
  app.get("/api/tracks/language/:language", async (req: Request, res: Response) => {
    try {
      const language = req.params.language;
      
      if (!language) {
        return res.status(400).json({ message: "Language parameter is required" });
      }
      
      const tracks = await storage.getTracksByLanguage(language);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks by language", error: (error as Error).message });
    }
  });

  // Analyze text for emotion
  app.post("/api/analyze/text", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        text: z.string().min(1, "Text is required"),
        language: z.string().optional().default("english")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      
      const { text, language } = result.data;
      
      // This is a simple rule-based emotion detection system
      // In a real application, this would use a trained model or API
      const joyTermsEnglish = ['happy', 'joy', 'wonderful', 'great', 'excited', 'smile', 'laugh', 'pleasure', 'delighted'];
      const sadTermsEnglish = ['sad', 'unhappy', 'depressed', 'down', 'sorrow', 'miserable', 'upset', 'gloomy', 'heartbroken'];
      const angerTermsEnglish = ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'rage', 'outraged', 'irritated'];
      
      // Hindi emotion terms
      const joyTermsHindi = ['खुश', 'आनंद', 'प्रसन्न', 'हर्षित', 'मज़ा', 'खुशी', 'हँसी', 'मस्ती', 'उत्साह'];
      const sadTermsHindi = ['दुःख', 'उदास', 'दुखी', 'अफ़सोस', 'निराश', 'दिल टूटा', 'गम', 'रोना', 'पीड़ा'];
      const angerTermsHindi = ['गुस्सा', 'क्रोध', 'नाराज़', 'चिढ़', 'आक्रोश', 'रोष', 'भड़का हुआ', 'कुपित', 'क्रोधित'];
      
      // Select the right terms based on language
      const joyTerms = language === 'hindi' ? joyTermsHindi : joyTermsEnglish;
      const sadTerms = language === 'hindi' ? sadTermsHindi : sadTermsEnglish;
      const angerTerms = language === 'hindi' ? angerTermsHindi : angerTermsEnglish;
      
      const lowercaseText = text.toLowerCase();
      
      let joyScore = 0;
      let sadnessScore = 0;
      let angerScore = 0;
      
      joyTerms.forEach(term => {
        if (lowercaseText.includes(term)) joyScore += 0.2;
      });
      
      sadTerms.forEach(term => {
        if (lowercaseText.includes(term)) sadnessScore += 0.2;
      });
      
      angerTerms.forEach(term => {
        if (lowercaseText.includes(term)) angerScore += 0.2;
      });
      
      // Normalize scores
      const totalScore = joyScore + sadnessScore + angerScore;
      
      if (totalScore > 0) {
        joyScore = Math.min(joyScore / totalScore, 1);
        sadnessScore = Math.min(sadnessScore / totalScore, 1);
        angerScore = Math.min(angerScore / totalScore, 1);
      }
      
      // Determine dominant emotion
      let dominantEmotion = "neutral";
      let dominantScore = 0.1; // Minimum threshold
      
      if (joyScore > dominantScore) {
        dominantEmotion = "joy";
        dominantScore = joyScore;
      }
      
      if (sadnessScore > dominantScore) {
        dominantEmotion = "sadness";
        dominantScore = sadnessScore;
      }
      
      if (angerScore > dominantScore) {
        dominantEmotion = "anger";
        dominantScore = angerScore;
      }
      
      // Create descriptions based on detected emotion
      const descriptions = {
        joy: "You're feeling happy and upbeat! We'll find some uplifting tunes to match your positive energy.",
        sadness: "You seem to be feeling down or reflective. We'll suggest some music that resonates with your current mood.",
        anger: "You appear to be feeling frustrated or upset. We'll recommend some tracks to help channel those emotions.",
        neutral: "Your mood seems balanced or neutral. We'll suggest some gentle tracks that won't disrupt your state of mind."
      };
      
      const emotion = {
        type: dominantEmotion,
        score: dominantScore,
        description: descriptions[dominantEmotion as keyof typeof descriptions]
      };
      
      // Get tracks matching the emotion and language
      let recommendedTracks = [];
      
      // First try to get recommendations from Spotify
      try {
        // Only use Spotify if the required environment variables are set
        if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
          const spotifyTracks = await getRecommendedTracks(dominantEmotion as any, language, 10);
          if (spotifyTracks && spotifyTracks.length > 0) {
            recommendedTracks = spotifyTracks;
          }
        }
      } catch (spotifyError) {
        console.error("Error fetching from Spotify:", spotifyError);
        // Fall back to local tracks if Spotify fails
      }
      
      // If no tracks from Spotify, use local database
      if (recommendedTracks.length === 0) {
        if (language) {
          recommendedTracks = await storage.getTracksByEmotionAndLanguage(dominantEmotion as any, language);
          // If no tracks for this language and emotion, fall back to all tracks for this emotion
          if (recommendedTracks.length === 0) {
            recommendedTracks = await storage.getTracksByEmotion(dominantEmotion as any);
          }
        } else {
          recommendedTracks = await storage.getTracksByEmotion(dominantEmotion as any);
        }
      }
      
      res.json({
        emotion,
        tracks: recommendedTracks
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze text", error: (error as Error).message });
    }
  });

  // Test Spotify connectivity and get recommendations
  app.get("/api/spotify/test", async (req: Request, res: Response) => {
    try {
      if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
        return res.status(400).json({ 
          success: false, 
          message: "Spotify credentials are not configured" 
        });
      }
      
      const emotion = req.query.emotion as EmotionType || "joy";
      const language = req.query.language as string || "english";
      const limit = parseInt(req.query.limit as string || "5");
      
      const tracks = await getRecommendedTracks(emotion, language, limit);
      
      return res.json({
        success: true,
        credentialsConfigured: true,
        tracksCount: tracks.length,
        tracks: tracks
      });
    } catch (error) {
      console.error("Spotify test error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to connect to Spotify API", 
        error: (error as Error).message 
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
