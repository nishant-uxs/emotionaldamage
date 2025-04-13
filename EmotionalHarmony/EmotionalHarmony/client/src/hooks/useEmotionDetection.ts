import { useState } from 'react';
import { EmotionType, EmotionWithTracks } from '@shared/schema';
import { useWebcam } from './useWebcam';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface UseEmotionDetectionProps {
  onEmotionDetected?: (data: EmotionWithTracks) => void;
}

export const useEmotionDetection = ({ onEmotionDetected }: UseEmotionDetectionProps = {}) => {
  const { captureImage, ...webcamProps } = useWebcam();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Process image from webcam for emotion detection
  const detectEmotionFromWebcam = async () => {
    try {
      setIsAnalyzing(true);
      
      // In a real implementation, we would:
      // 1. Capture the webcam image
      const imageSrc = captureImage();
      if (!imageSrc) {
        throw new Error('Failed to capture image from webcam');
      }
      
      // 2. Send it to the backend for processing
      // For now, we'll simulate this by selecting a random emotion
      const emotions: EmotionType[] = ['joy', 'sadness', 'anger', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      // 3. Fetch tracks for this emotion
      const response = await fetch(`/api/tracks/emotion/${randomEmotion}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracks for detected emotion');
      }
      
      const tracks = await response.json();
      
      // 4. Create descriptive message based on detected emotion
      const descriptions: Record<EmotionType, string> = {
        joy: "You're feeling happy and upbeat! We'll find some uplifting tunes to match your positive energy.",
        sadness: "You seem to be feeling down or reflective. We'll suggest some music that resonates with your current mood.",
        anger: "You appear to be feeling frustrated or upset. We'll recommend some tracks to help channel those emotions.",
        neutral: "Your expression appears balanced or neutral. We'll suggest some gentle tracks that won't disrupt your state of mind."
      };
      
      const result: EmotionWithTracks = {
        emotion: {
          type: randomEmotion,
          score: 0.85, // Simulated confidence score
          description: descriptions[randomEmotion]
        },
        tracks
      };
      
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
      
      toast({
        title: "Emotion detected",
        description: `We detected ${randomEmotion} as your current mood.`,
      });
      
      return result;
      
    } catch (error) {
      console.error('Error detecting emotion from webcam:', error);
      toast({
        title: "Error detecting emotion",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze text for emotion
  const analyzeTextEmotion = async (text: string) => {
    try {
      setIsAnalyzing(true);
      
      if (!text.trim()) {
        throw new Error('Please enter some text to analyze');
      }
      
      const response = await apiRequest("POST", "/api/analyze/text", { text });
      const result = await response.json();
      
      if (onEmotionDetected) {
        onEmotionDetected(result);
      }
      
      toast({
        title: "Text analyzed",
        description: `We detected ${result.emotion.type} as your current mood.`,
      });
      
      return result;
      
    } catch (error) {
      console.error('Error analyzing text emotion:', error);
      toast({
        title: "Error analyzing text",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    ...webcamProps,
    isAnalyzing,
    detectEmotionFromWebcam,
    analyzeTextEmotion
  };
};
