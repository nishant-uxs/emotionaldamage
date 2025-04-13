import React, { useState, useEffect } from 'react';
import { Track, TrackResponse } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MusicRecommendationsProps {
  tracks: TrackResponse[];
  onPlayTrack: (track: TrackResponse) => void;
}

const MusicRecommendations: React.FC<MusicRecommendationsProps> = ({ tracks, onPlayTrack }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [filteredTracks, setFilteredTracks] = useState<TrackResponse[]>(tracks);
  
  // Get unique languages from tracks
  const languages = Array.from(new Set(tracks.map(track => track.language || "english")));
  
  // Filter tracks when language changes
  useEffect(() => {
    if (selectedLanguage === "all") {
      setFilteredTracks(tracks);
    } else {
      setFilteredTracks(tracks.filter(track => track.language === selectedLanguage));
    }
  }, [selectedLanguage, tracks]);

  // Show empty state if no tracks are available
  if (!tracks || tracks.length === 0) {
    return (
      <section className="mb-14">
        <h2 className="font-poppins font-bold text-2xl mb-5">Recommended for your mood</h2>
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500">No tracks available for this mood right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-14">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
        <h2 className="font-poppins font-bold text-2xl">Recommended for your mood</h2>
        
        {/* Language selector */}
        <div className="mt-3 md:mt-0">
          <RadioGroup 
            value={selectedLanguage} 
            onValueChange={setSelectedLanguage}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">All</Label>
            </div>
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <RadioGroupItem value={language} id={language} />
                <Label htmlFor={language} className="cursor-pointer capitalize">{language}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      {/* Empty state for filtered results */}
      {filteredTracks.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500">No tracks available in {selectedLanguage} for this mood.</p>
        </div>
      )}
      
      {/* Track cards */}
      {filteredTracks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative">
                <img 
                  src={track.coverUrl} 
                  alt={`${track.title} by ${track.artist}`} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button 
                    className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white"
                    onClick={() => onPlayTrack(track)}
                  >
                    <i className="fas fa-play"></i>
                  </button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <div 
                    className="px-2 py-1 rounded-full text-xs text-white"
                    style={{ 
                      backgroundColor: `var(--${track.emotion})90`,
                    }}
                  >
                    <i className={`fas fa-${track.emotion === 'joy' ? 'smile' : track.emotion === 'sadness' ? 'sad-tear' : track.emotion === 'anger' ? 'angry' : 'meh'} mr-1`}></i>
                    <span className="capitalize">{track.emotion}</span>
                  </div>
                  <div 
                    className="px-2 py-1 rounded-full text-xs text-white bg-gray-700"
                  >
                    <span className="capitalize">{track.language || "english"}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-poppins font-semibold text-lg truncate">{track.title}</h3>
                <p className="text-gray-600 truncate">{track.artist}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{track.duration}</span>
                  <div className="flex gap-2">
                    {/* Show Spotify link if available */}
                    {track.spotifyId && track.externalUrl && (
                      <a 
                        href={track.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600" 
                        title="Open in Spotify"
                      >
                        <i className="fab fa-spotify"></i>
                      </a>
                    )}
                    <button className="text-gray-400 hover:text-primary" title="Add to playlist">
                      <i className="fas fa-plus"></i>
                    </button>
                    <button className="text-gray-400 hover:text-primary" title="Add to favorites">
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* See more recommendations button */}
      {filteredTracks.length > 0 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="bg-white border border-primary text-primary px-5 py-2 rounded-lg font-medium hover:bg-primary/5 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>More Recommendations
          </Button>
        </div>
      )}
    </section>
  );
};

export default MusicRecommendations;
