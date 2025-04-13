import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { TrackResponse } from '@shared/schema';
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  track: TrackResponse;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  onShowVisualization: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  track, 
  isPlaying, 
  setIsPlaying,
  onShowVisualization
}) => {
  const [currentTime, setCurrentTime] = useState('0:00');
  const [seekPosition, setSeekPosition] = useState(0);
  const [volume, setVolume] = useState(70);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Format time in MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Initialize Howler when track changes
  useEffect(() => {
    // Clear any existing sound and interval
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    // Create new Howl instance
    soundRef.current = new Howl({
      src: [track.audioUrl],
      html5: true,
      volume: volume / 100,
      onload: () => {
        if (isPlaying) {
          soundRef.current?.play();
        }
      },
      onplay: () => {
        startTrackingProgress();
      },
      onpause: () => {
        stopTrackingProgress();
      },
      onstop: () => {
        stopTrackingProgress();
        setSeekPosition(0);
        setCurrentTime('0:00');
      },
      onend: () => {
        setIsPlaying(false);
        stopTrackingProgress();
        setSeekPosition(0);
        setCurrentTime('0:00');
      }
    });
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
        soundRef.current = null;
      }
      
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [track.audioUrl]);
  
  // Handle play/pause toggle
  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle volume change
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume / 100);
    }
  }, [volume]);
  
  // Track progress
  const startTrackingProgress = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (soundRef.current) {
        const currentSecs = soundRef.current.seek();
        const totalDuration = soundRef.current.duration();
        setCurrentTime(formatTime(currentSecs as number));
        setSeekPosition((currentSecs as number) / totalDuration * 100);
      }
    }, 1000);
  };
  
  const stopTrackingProgress = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Seek to position
  const handleSeek = (value: number[]) => {
    if (soundRef.current) {
      const seekTime = (value[0] / 100) * soundRef.current.duration();
      soundRef.current.seek(seekTime);
      setSeekPosition(value[0]);
    }
  };
  
  // Handle playback controls
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const skipToPrevious = () => {
    // Would implement previous track logic in a real app
    if (soundRef.current) {
      soundRef.current.seek(0);
    }
  };
  
  const skipToNext = () => {
    // Would implement next track logic in a real app
    if (soundRef.current) {
      soundRef.current.seek(0);
      setIsPlaying(false);
    }
  };
  
  // Parse the duration string to format consistently (e.g., "3:54")
  const parseDuration = (duration: string) => {
    // Already in correct format, return as is
    if (/^\d+:\d{2}$/.test(duration)) {
      return duration;
    }
    
    // Try to convert from number of seconds
    const seconds = parseInt(duration, 10);
    if (!isNaN(seconds)) {
      return formatTime(seconds);
    }
    
    return duration;
  };
  
  // Get emotion color and icon
  const getEmotionColor = () => {
    return `var(--${track.emotion})`;
  };
  
  const getEmotionIcon = () => {
    switch (track.emotion) {
      case 'joy': return 'fa-smile';
      case 'sadness': return 'fa-sad-tear';
      case 'anger': return 'fa-angry';
      case 'neutral': return 'fa-meh';
      default: return 'fa-music';
    }
  };
  
  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <div className="container mx-auto px-4">
        <div className="py-3 flex flex-col sm:flex-row items-center gap-3">
          {/* Song Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img 
              src={track.coverUrl} 
              className="w-12 h-12 rounded object-cover cursor-pointer"
              alt={`${track.title} by ${track.artist}`}
              onClick={onShowVisualization}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold truncate">{track.title}</h3>
                {track.spotifyId && (
                  <span className="text-green-500" title="From Spotify">
                    <i className="fab fa-spotify"></i>
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm truncate">{track.artist}</p>
            </div>
            <div 
              className="rounded-full px-2 py-1 text-xs flex items-center"
              style={{ 
                backgroundColor: `${getEmotionColor()}20`,
                color: getEmotionColor() 
              }}
            >
              <i className={`fas ${getEmotionIcon()} mr-1`}></i>
              <span className="capitalize">{track.emotion}</span>
            </div>
          </div>
          
          {/* Music Controls */}
          <div className="flex-grow flex flex-col items-center max-w-xl">
            <div className="flex items-center gap-4">
              <button 
                className="text-gray-500 hover:text-primary"
                onClick={skipToPrevious}
              >
                <i className="fas fa-step-backward"></i>
              </button>
              <button 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-sm"
                onClick={togglePlayPause}
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button 
                className="text-gray-500 hover:text-primary"
                onClick={skipToNext}
              >
                <i className="fas fa-step-forward"></i>
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">{currentTime}</span>
              <div className="h-2 flex-grow relative">
                <Slider
                  value={[seekPosition]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="h-2"
                />
              </div>
              <span className="text-xs text-gray-500">{parseDuration(track.duration)}</span>
            </div>
          </div>
          
          {/* Volume and Extra Controls */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-500 hover:text-primary">
              <i className="fas fa-volume-up"></i>
            </button>
            <div className="w-24 h-2">
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="h-2"
              />
            </div>
            {track.spotifyId && track.externalUrl && (
              <a 
                href={track.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600" 
                title="Open in Spotify"
              >
                <i className="fab fa-spotify text-lg"></i>
              </a>
            )}
            <button className="text-gray-500 hover:text-primary">
              <i className="fas fa-random"></i>
            </button>
            <button className="text-gray-500 hover:text-primary">
              <i className="fas fa-redo-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
