import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Track, TrackResponse, EmotionType, EmotionWithTracks } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

import NavigationMenu from "@/components/NavigationMenu";
import EmotionDetection from "@/components/EmotionDetection";
import EmotionDisplay from "@/components/EmotionDisplay";
import MusicRecommendations from "@/components/MusicRecommendations";
import OtherEmotions from "@/components/OtherEmotions";
import MusicPlayer from "@/components/MusicPlayer";
import AudioVisualization from "@/components/AudioVisualization";

export default function Home() {
  const [detectionMethod, setDetectionMethod] = useState<'webcam' | 'text'>('webcam');
  const [textInput, setTextInput] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<EmotionWithTracks | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  
  // Fetch all tracks
  const { data: allTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['/api/tracks'],
    staleTime: 300000, // 5 minutes
  });
  
  // Text analysis mutation
  const textAnalysisMutation = useMutation({
    mutationFn: async ({ text, language }: { text: string, language: string }) => {
      const response = await apiRequest("POST", "/api/analyze/text", { text, language });
      return response.json();
    },
    onSuccess: (data: EmotionWithTracks) => {
      setCurrentEmotion(data);
      queryClient.invalidateQueries({ queryKey: ['/api/tracks'] });
    },
  });
  
  // Handle track selection
  const handlePlayTrack = (track: TrackResponse) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setShowVisualization(true);
  };
  
  // Handle emotion selection from other emotions section
  const handleSelectEmotion = async (emotion: EmotionType, language = "english") => {
    try {
      // Try to get tracks from Spotify first
      const source = "spotify"; // Can be "local" or "spotify"
      const response = await fetch(`/api/tracks/emotion/${emotion}?language=${language}&source=${source}`);
      if (!response.ok) throw new Error('Failed to fetch tracks for emotion');
      
      const tracks = await response.json();
      
      // Create a descriptive message based on the emotion
      const descriptions: Record<EmotionType, string> = {
        joy: "You've selected a joyful mood! Here are some uplifting tunes to match your positive energy.",
        sadness: "You've selected a reflective mood. Here are some tracks that resonate with your melancholic feelings.",
        anger: "You've selected an energetic mood. Here are some intense tracks to help channel your emotions.",
        neutral: "You've selected a balanced mood. Here are some gentle tracks that won't disrupt your state of mind."
      };
      
      // Ensure all tracks have IDs for React key purposes if coming from Spotify
      const processedTracks = tracks.map((track: any, index: number) => ({
        ...track,
        id: track.id || index + 1000, // Use existing ID or generate temporary one
        spotifyId: track.spotifyId || null,
        externalUrl: track.externalUrl || null
      }));
      
      setCurrentEmotion({
        emotion: {
          type: emotion,
          score: 1,
          description: descriptions[emotion]
        },
        tracks: processedTracks
      });
      
    } catch (error) {
      console.error("Error selecting emotion:", error);
      
      // If Spotify fails, fall back to local tracks
      try {
        const fallbackResponse = await fetch(`/api/tracks/emotion/${emotion}?language=${language}&source=local`);
        if (!fallbackResponse.ok) throw new Error('Failed to fetch local tracks for emotion');
        
        const fallbackTracks = await fallbackResponse.json();
        
        // Create a descriptive message based on the emotion
        const descriptions: Record<EmotionType, string> = {
          joy: "You've selected a joyful mood! Here are some uplifting tunes to match your positive energy.",
          sadness: "You've selected a reflective mood. Here are some tracks that resonate with your melancholic feelings.",
          anger: "You've selected an energetic mood. Here are some intense tracks to help channel your emotions.",
          neutral: "You've selected a balanced mood. Here are some gentle tracks that won't disrupt your state of mind."
        };
        
        setCurrentEmotion({
          emotion: {
            type: emotion,
            score: 1,
            description: descriptions[emotion]
          },
          tracks: fallbackTracks
        });
      } catch (fallbackError) {
        console.error("Error fetching fallback tracks:", fallbackError);
      }
    }
  };
  
  // Handle retrying detection
  const handleRetryDetection = () => {
    setCurrentEmotion(null);
  };
  
  // Handle text analysis
  const handleAnalyzeText = (language = "english") => {
    if (textInput.trim()) {
      textAnalysisMutation.mutate({ text: textInput, language });
    }
  };
  
  // Handle webcam detection (mocked for now)
  const handleDetectEmotion = () => {
    // In a real app, this would process webcam data
    // For now, we'll use a random emotion as a placeholder
    const emotions: EmotionType[] = ['joy', 'sadness', 'anger', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    handleSelectEmotion(randomEmotion);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <i className="fas fa-music text-white"></i>
            </div>
            <h1 className="text-xl font-poppins font-bold">
              <span className="text-primary">Mood</span><span style={{ color: 'var(--secondary)' }}>Melody</span>
            </h1>
          </div>
          <NavigationMenu />
          <button className="md:hidden text-gray-700">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Emotion Detection Section */}
        <EmotionDetection 
          detectionMethod={detectionMethod}
          setDetectionMethod={setDetectionMethod}
          textInput={textInput}
          setTextInput={setTextInput}
          onAnalyzeText={handleAnalyzeText}
          onDetectEmotion={handleDetectEmotion}
          isAnalyzing={textAnalysisMutation.isPending}
        />
        
        {/* Detected Emotion Display */}
        {currentEmotion && (
          <EmotionDisplay 
            emotion={currentEmotion.emotion} 
            onRetry={handleRetryDetection} 
          />
        )}
        
        {/* Music Recommendations */}
        {currentEmotion && (
          <MusicRecommendations 
            tracks={currentEmotion.tracks} 
            onPlayTrack={handlePlayTrack} 
          />
        )}
        
        {/* Other Emotions Preview */}
        <OtherEmotions onSelectEmotion={handleSelectEmotion} />
      </main>
      
      {/* Music Player (Fixed at bottom) */}
      {currentTrack && (
        <MusicPlayer 
          track={currentTrack} 
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onShowVisualization={() => setShowVisualization(true)}
        />
      )}
      
      {/* Audio Visualization Overlay */}
      {showVisualization && currentTrack && (
        <AudioVisualization 
          track={currentTrack} 
          onClose={() => setShowVisualization(false)} 
        />
      )}
    </>
  );
}
