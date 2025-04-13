import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { Track } from '@shared/schema';

export const useMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekPosition, setSeekPosition] = useState(0);
  
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Initialize or update Howler when track changes
  useEffect(() => {
    if (!currentTrack) return;
    
    // Clear existing sound and interval
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    // Create new Howl instance with optimized settings
    soundRef.current = new Howl({
      src: [currentTrack.audioUrl],
      html5: true, // Use HTML5 Audio for better compatibility
      volume: volume / 100,
      format: ['ogg'], // Google's sound library uses OGG format
      preload: true, // Preload the audio
      pool: 1, // Limit the pool size
      rate: 1.0, // Normal playback rate
      onload: () => {
        setDuration(soundRef.current?.duration() || 0);
        if (isPlaying) {
          soundRef.current?.play();
        }
      },
      onloaderror: (id: any, error: any) => {
        console.error("Loading error:", error);
        // Try with different settings on error
        soundRef.current = new Howl({
          src: [currentTrack.audioUrl],
          html5: true,
          volume: volume / 100,
          format: ['ogg'],
          xhr: {
            method: 'GET'
          }
        });
        soundRef.current.play();
      },
      onplay: startTrackingProgress,
      onpause: stopTrackingProgress,
      onstop: () => {
        stopTrackingProgress();
        setCurrentTime(0);
        setSeekPosition(0);
      },
      onend: () => {
        setIsPlaying(false);
        stopTrackingProgress();
        setCurrentTime(0);
        setSeekPosition(0);
      }
    });
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [currentTrack?.audioUrl]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.play();
    } else {
      soundRef.current.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
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
        const currentSeconds = soundRef.current.seek() as number;
        const totalDuration = soundRef.current.duration();
        
        setCurrentTime(currentSeconds);
        setSeekPosition((currentSeconds / totalDuration) * 100);
      }
    }, 1000);
  };
  
  const stopTrackingProgress = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Player controls
  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause if it's the same track
      setIsPlaying(!isPlaying);
    } else {
      // Load and play new track
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const stop = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    setIsPlaying(false);
  };
  
  const seek = (percent: number) => {
    if (soundRef.current) {
      const seekTime = (percent / 100) * soundRef.current.duration();
      soundRef.current.seek(seekTime);
      setSeekPosition(percent);
    }
  };
  
  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    seekPosition,
    formatTime,
    playTrack,
    togglePlayPause,
    stop,
    seek,
    adjustVolume
  };
};
