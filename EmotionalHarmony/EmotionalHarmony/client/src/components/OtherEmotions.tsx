import React from 'react';
import { EmotionType } from '@shared/schema';

interface OtherEmotionsProps {
  onSelectEmotion: (emotion: EmotionType) => void;
}

const OtherEmotions: React.FC<OtherEmotionsProps> = ({ onSelectEmotion }) => {
  // Handle creating a custom mix - would show a modal or form in a real app
  const handleCreateCustomMix = () => {
    alert("Custom mix creation would be implemented here!");
  };
  
  return (
    <section className="mb-8">
      <h2 className="font-poppins font-bold text-2xl mb-5">Explore other emotions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sadness Emotion Card */}
        <div 
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderTop: "4px solid var(--sadness)" }}
          onClick={() => onSelectEmotion('sadness')}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--sadness)20" }}>
                <i className="fas fa-sad-tear text-xl" style={{ color: "var(--sadness)" }}></i>
              </div>
              <h3 className="font-poppins font-semibold text-lg">Sadness</h3>
            </div>
            <p className="text-gray-600 text-sm">Reflective and melancholic music for your introspective moments.</p>
            <div className="mt-3 flex gap-1 flex-wrap">
              <div className="bg-sadness/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--sadness)" }}>Ballads</div>
              <div className="bg-sadness/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--sadness)" }}>Acoustic</div>
              <div className="bg-sadness/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--sadness)" }}>Piano</div>
            </div>
          </div>
        </div>
        
        {/* Anger Emotion Card */}
        <div 
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderTop: "4px solid var(--anger)" }}
          onClick={() => onSelectEmotion('anger')}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--anger)20" }}>
                <i className="fas fa-angry text-xl" style={{ color: "var(--anger)" }}></i>
              </div>
              <h3 className="font-poppins font-semibold text-lg">Anger</h3>
            </div>
            <p className="text-gray-600 text-sm">Intense and energetic tracks to help channel your emotions.</p>
            <div className="mt-3 flex gap-1 flex-wrap">
              <div className="bg-anger/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--anger)" }}>Rock</div>
              <div className="bg-anger/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--anger)" }}>Metal</div>
              <div className="bg-anger/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--anger)" }}>Intense</div>
            </div>
          </div>
        </div>
        
        {/* Neutral Emotion Card */}
        <div 
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderTop: "4px solid var(--neutral)" }}
          onClick={() => onSelectEmotion('neutral')}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--neutral)20" }}>
                <i className="fas fa-meh text-xl" style={{ color: "var(--neutral)" }}></i>
              </div>
              <h3 className="font-poppins font-semibold text-lg">Neutral</h3>
            </div>
            <p className="text-gray-600 text-sm">Balanced tracks that won't disrupt your current state of mind.</p>
            <div className="mt-3 flex gap-1 flex-wrap">
              <div className="bg-neutral/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--neutral)" }}>Ambient</div>
              <div className="bg-neutral/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--neutral)" }}>Calm</div>
              <div className="bg-neutral/10 text-xs px-2 py-1 rounded-full" style={{ color: "var(--neutral)" }}>Lo-Fi</div>
            </div>
          </div>
        </div>
        
        {/* Custom Mix Emotion Card */}
        <div 
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderTop: "4px solid var(--primary)" }}
          onClick={handleCreateCustomMix}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <i className="fas fa-sliders-h text-xl text-primary"></i>
              </div>
              <h3 className="font-poppins font-semibold text-lg">Custom Mix</h3>
            </div>
            <p className="text-gray-600 text-sm">Create your own unique emotional blend for a personalized experience.</p>
            <div className="mt-3 flex items-center justify-center">
              <button className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                <i className="fas fa-plus mr-1"></i> Create Mix
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherEmotions;
