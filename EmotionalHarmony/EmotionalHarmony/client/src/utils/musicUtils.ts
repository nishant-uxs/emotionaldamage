import { Track, EmotionType } from '@shared/schema';

// Function to parse duration string to seconds
export const parseDurationToSeconds = (duration: string): number => {
  // Check if in MM:SS format
  const parts = duration.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  
  // Try to parse as seconds
  const seconds = parseInt(duration);
  if (!isNaN(seconds)) {
    return seconds;
  }
  
  return 0;
};

// Function to format seconds to MM:SS
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Get recommended tracks by emotion
export const getTracksByEmotion = async (emotion: EmotionType): Promise<Track[]> => {
  try {
    const response = await fetch(`/api/tracks/emotion/${emotion}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tracks: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tracks by emotion:', error);
    return [];
  }
};

// Function to get a random subset of tracks
export const getRandomTracks = (tracks: Track[], count: number): Track[] => {
  if (!tracks || tracks.length <= count) return tracks || [];
  
  const shuffled = [...tracks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get color based on emotion
export const getEmotionColor = (emotion: EmotionType) => {
  const colorMap: Record<EmotionType, string> = {
    joy: '#FFD166',
    sadness: '#118AB2',
    anger: '#EF476F',
    neutral: '#073B4C'
  };
  
  return colorMap[emotion] || '#6C63FF'; // Default to primary
};

// Get initial mood description based on time of day
export const getInitialMoodDescription = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good morning! How are you feeling as you start your day?";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon! How's your mood right now?";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening! How are you feeling after your day?";
  } else {
    return "How are you feeling tonight?";
  }
};
