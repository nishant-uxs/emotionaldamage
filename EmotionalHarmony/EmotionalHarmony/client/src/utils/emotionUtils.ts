import { EmotionType } from '@shared/schema';

// Get color for emotion
export const getEmotionColor = (emotion: EmotionType): string => {
  switch (emotion) {
    case 'joy': return 'var(--joy)';
    case 'sadness': return 'var(--sadness)';
    case 'anger': return 'var(--anger)';
    case 'neutral': return 'var(--neutral)';
    default: return '#6C63FF'; // Primary color as fallback
  }
};

// Get icon class for emotion
export const getEmotionIcon = (emotion: EmotionType): string => {
  switch (emotion) {
    case 'joy': return 'fa-smile';
    case 'sadness': return 'fa-sad-tear';
    case 'anger': return 'fa-angry';
    case 'neutral': return 'fa-meh';
    default: return 'fa-question';
  }
};

// Get description for emotion
export const getEmotionDescription = (emotion: EmotionType): string => {
  switch (emotion) {
    case 'joy':
      return "You're feeling happy and upbeat! We'll find some uplifting tunes to match your positive energy.";
    case 'sadness':
      return "You seem to be feeling down or reflective. We'll suggest some music that resonates with your current mood.";
    case 'anger':
      return "You appear to be feeling frustrated or upset. We'll recommend some tracks to help channel those emotions.";
    case 'neutral':
      return "Your mood seems balanced or neutral. We'll suggest some gentle tracks that won't disrupt your state of mind.";
    default:
      return "We'll find music that suits your mood.";
  }
};

// Get tags/genres associated with each emotion
export const getEmotionTags = (emotion: EmotionType): string[] => {
  switch (emotion) {
    case 'joy':
      return ['Upbeat', 'Energetic', 'Pop'];
    case 'sadness':
      return ['Ballads', 'Acoustic', 'Piano'];
    case 'anger':
      return ['Rock', 'Metal', 'Intense'];
    case 'neutral':
      return ['Ambient', 'Calm', 'Lo-Fi'];
    default:
      return [];
  }
};

// Simple keywords for detecting emotions in text
export const joyKeywords = [
  'happy', 'joy', 'excited', 'wonderful', 'great', 'smile', 'laugh', 
  'pleasure', 'delighted', 'cheerful', 'content', 'thrilled', 'elated'
];

export const sadnessKeywords = [
  'sad', 'unhappy', 'depressed', 'down', 'sorrow', 'miserable', 'upset', 
  'gloomy', 'heartbroken', 'disappointed', 'grief', 'lonely', 'devastated'
];

export const angerKeywords = [
  'angry', 'mad', 'frustrated', 'annoyed', 'furious', 'rage', 'outraged', 
  'irritated', 'enraged', 'hostile', 'agitated', 'irate', 'livid'
];

export const neutralKeywords = [
  'ok', 'fine', 'neutral', 'average', 'balanced', 'moderate', 'normal',
  'indifferent', 'mediocre', 'standard', 'regular', 'typical'
];
