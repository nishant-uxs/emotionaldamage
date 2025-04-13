import React, { useEffect, useState, useRef } from 'react';
import { TrackResponse } from '@shared/schema';

interface AudioVisualizationProps {
  track: TrackResponse;
  onClose: () => void;
}

const AudioVisualization: React.FC<AudioVisualizationProps> = ({ track, onClose }) => {
  const [bars, setBars] = useState<number[]>(Array(40).fill(0).map(() => Math.random() * 100));
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Create visualization effect
    const animateVisualizer = () => {
      setBars(prevBars => 
        prevBars.map(() => {
          const height = Math.floor(Math.random() * 100) + 10;
          return height;
        })
      );
      
      animationRef.current = requestAnimationFrame(animateVisualizer);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateVisualizer);
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Get emotion color
  const getEmotionColor = () => {
    return `var(--${track.emotion})`;
  };
  
  // Get emotion icon
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
    <div className="fixed inset-0 bg-black/80 z-20 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <button className="text-white text-2xl" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="text-center">
        <div className="mb-5">
          <div className="w-48 h-48 mx-auto rounded-full overflow-hidden">
            <img 
              src={track.coverUrl} 
              className="w-full h-full object-cover animate-pulse-slow" 
              alt={`${track.title} by ${track.artist}`}
            />
          </div>
        </div>
        
        <h2 className="text-white font-poppins font-bold text-2xl mb-1">{track.title}</h2>
        <p className="text-gray-300 mb-8">{track.artist}</p>
        
        {/* Audio waves visualization */}
        <div className="h-32 flex items-center justify-center gap-1 mb-8">
          {bars.map((height, index) => (
            <div
              key={index}
              className="w-1.5 rounded-full"
              style={{
                height: `${height}%`,
                backgroundColor: 'rgba(108, 99, 255, 0.8)' // Using primary color
              }}
            ></div>
          ))}
        </div>
        
        {/* Emotion tag */}
        <div 
          className="inline-block rounded-full px-3 py-1.5 text-sm font-medium"
          style={{ 
            backgroundColor: `${getEmotionColor()}20`,
            color: getEmotionColor() 
          }}
        >
          <i className={`fas ${getEmotionIcon()} mr-1`}></i>
          <span className="capitalize">{track.emotion}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualization;
