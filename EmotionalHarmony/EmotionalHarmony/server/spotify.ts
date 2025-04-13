import fetch from 'node-fetch';
import { EmotionType } from '@shared/schema';

// Spotify API URLs
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Access credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Token cache
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// Get authorization token
async function getAccessToken(): Promise<string> {
  // Check if we have a valid token already
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string, expires_in: number };
    accessToken = data.access_token;
    // Set expiry with 60 seconds safety margin
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
}

// Map emotions to Spotify seed genres and audio features
function mapEmotionToSpotifyParams(emotion: EmotionType): { 
  seed_genres: string, 
  min_valence?: number,
  max_valence?: number,
  min_energy?: number,
  max_energy?: number,
  min_tempo?: number,
  max_tempo?: number
} {
  switch (emotion) {
    case 'joy':
      return {
        seed_genres: 'happy,pop,dance',
        min_valence: 0.7, // Higher valence = more positive/happy
        min_energy: 0.6
      };
    case 'sadness':
      return {
        seed_genres: 'sad,blues,rainy-day',
        max_valence: 0.4, // Lower valence = more negative/sad
        max_energy: 0.5
      };
    case 'anger':
      return {
        seed_genres: 'rock,metal,electronic',
        min_energy: 0.7,
        min_tempo: 120
      };
    case 'neutral':
      return {
        seed_genres: 'ambient,study,acoustic',
        min_valence: 0.4,
        max_valence: 0.6
      };
    default:
      return {
        seed_genres: 'pop'
      };
  }
}

// Map emotions to Spotify search queries for Hindi music
function getHindiSearchQuery(emotion: EmotionType): string {
  switch (emotion) {
    case 'joy':
      return 'bollywood happy dance';
    case 'sadness':
      return 'bollywood sad emotional';
    case 'anger':
      return 'bollywood intense powerful';
    case 'neutral':
      return 'bollywood relaxing calm';
    default:
      return 'bollywood popular';
  }
}

// Get recommended tracks based on emotion
export async function getRecommendedTracks(emotion: EmotionType, language: string = 'english', limit: number = 10): Promise<any[]> {
  try {
    const token = await getAccessToken();
    let tracks: any[] = [];

    if (language === 'english') {
      // Use the recommendations API for English tracks with emotion parameters
      const params = mapEmotionToSpotifyParams(emotion);
      const searchParams: Record<string, string> = {
        limit: limit.toString(),
        seed_genres: params.seed_genres
      };
      
      // Add optional parameters if they exist
      if (params.min_valence !== undefined) searchParams.min_valence = params.min_valence.toString();
      if (params.max_valence !== undefined) searchParams.max_valence = params.max_valence.toString();
      if (params.min_energy !== undefined) searchParams.min_energy = params.min_energy.toString();
      if (params.max_energy !== undefined) searchParams.max_energy = params.max_energy.toString();
      if (params.min_tempo !== undefined) searchParams.min_tempo = params.min_tempo.toString();
      if (params.max_tempo !== undefined) searchParams.max_tempo = params.max_tempo.toString();
      
      const queryString = new URLSearchParams(searchParams).toString();

      const response = await fetch(`${SPOTIFY_API_BASE}/recommendations?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      tracks = data.tracks || [];
    } else if (language === 'hindi') {
      // For Hindi, use search API with specific queries
      const query = getHindiSearchQuery(emotion);
      const queryString = new URLSearchParams({
        q: query,
        type: 'track',
        market: 'IN',
        limit: limit.toString()
      }).toString();

      const response = await fetch(`${SPOTIFY_API_BASE}/search?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      tracks = data.tracks?.items || [];
    }

    // Map Spotify track format to our app track format
    return tracks.map(track => ({
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      duration: msToMinutesAndSeconds(track.duration_ms),
      audioUrl: track.preview_url || '',
      coverUrl: track.album.images[0]?.url || '',
      emotion: emotion,
      language: language,
      spotifyId: track.id,
      externalUrl: track.external_urls.spotify
    }));
  } catch (error) {
    console.error('Error getting Spotify recommendations:', error);
    return [];
  }
}

// Helper function to convert milliseconds to MM:SS format
function msToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}