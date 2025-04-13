import React from 'react';
import { Button } from "@/components/ui/button";
import { Emotion } from '@shared/schema';

interface EmotionDisplayProps {
  emotion: Emotion;
  onRetry: () => void;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, onRetry }) => {
  // Map emotion types to icon classes and color variables
  const emotionIcons = {
    joy: "fa-smile",
    sadness: "fa-sad-tear",
    anger: "fa-angry",
    neutral: "fa-meh"
  };

  // Get the icon for the current emotion
  const emotionIcon = emotionIcons[emotion.type] || "fa-meh";
  const emotionColorVar = `var(--${emotion.type})`;

  return (
    <section className="mb-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ borderTop: `4px solid ${emotionColorVar}` }}>
        <div className="p-5">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0" 
              style={{ backgroundColor: `${emotionColorVar}20` }}
            >
              <i className={`fas ${emotionIcon} text-5xl`} style={{ color: emotionColorVar }}></i>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 
                className="font-poppins font-bold text-2xl mb-1 capitalize" 
                style={{ color: emotionColorVar }}
              >
                {emotion.type}
              </h2>
              <p className="text-gray-600">{emotion.description}</p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                variant="link"
                className="text-primary hover:text-primary/80 font-medium"
                onClick={onRetry}
              >
                <i className="fas fa-redo mr-1"></i>
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionDisplay;
