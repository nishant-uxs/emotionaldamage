import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmotionDetectionProps {
  detectionMethod: 'webcam' | 'text';
  setDetectionMethod: (method: 'webcam' | 'text') => void;
  textInput: string;
  setTextInput: (text: string) => void;
  onAnalyzeText: (language?: string) => void;
  onDetectEmotion: () => void;
  isAnalyzing: boolean;
}

const EmotionDetection: React.FC<EmotionDetectionProps> = ({
  detectionMethod,
  setDetectionMethod,
  textInput,
  setTextInput,
  onAnalyzeText,
  onDetectEmotion,
  isAnalyzing
}) => {
  const [webcamReady, setWebcamReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");

  // Handle webcam loaded event
  const handleWebcamLoad = () => {
    setWebcamReady(true);
    setCameraLoading(false);
  };

  // Handle camera switch - would reset/switch camera in a real implementation
  const handleSwitchCamera = () => {
    setCameraLoading(true);
    setTimeout(() => {
      setCameraLoading(false);
    }, 1000);
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h2 className="font-poppins font-semibold text-xl mb-4">How are you feeling today?</h2>
          
          {/* Toggle between webcam and text input */}
          <div className="flex justify-center mb-5">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <Button
                className={`px-4 py-2 rounded-lg font-medium ${
                  detectionMethod === 'webcam' 
                    ? 'bg-primary text-white' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setDetectionMethod('webcam')}
              >
                <i className="fas fa-camera mr-2"></i>Face Detection
              </Button>
              <Button
                className={`px-4 py-2 rounded-lg font-medium ${
                  detectionMethod === 'text' 
                    ? 'bg-primary text-white' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setDetectionMethod('text')}
              >
                <i className="fas fa-keyboard mr-2"></i>Text Input
              </Button>
            </div>
          </div>
          
          {/* Webcam Detection */}
          {detectionMethod === 'webcam' && (
            <div id="webcamDetection" className="flex flex-col items-center">
              <div className="relative w-full max-w-md h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {cameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-spin fa-circle-notch text-4xl text-gray-400"></i>
                  </div>
                )}
                <div className="absolute inset-0">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: "user"
                    }}
                    onUserMedia={handleWebcamLoad}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white font-medium text-sm">
                    {webcamReady ? "Looking for your expression..." : "Waiting for camera access..."}
                  </p>
                </div>
                <div className="absolute top-2 right-2">
                  <Button 
                    className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                    title="Switch camera"
                    onClick={handleSwitchCamera}
                    variant="ghost"
                    size="icon"
                  >
                    <i className="fas fa-sync-alt"></i>
                  </Button>
                </div>
              </div>
              <Button
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                onClick={onDetectEmotion}
                disabled={!webcamReady}
              >
                <i className="fas fa-search mr-2"></i>Detect My Mood
              </Button>
            </div>
          )}
          
          {/* Text Input */}
          {detectionMethod === 'text' && (
            <div id="textInput" className="flex flex-col items-center">
              <div className="w-full max-w-md mb-4">
                <Textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                  placeholder="Describe how you're feeling today..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                
                {/* Language selector */}
                <div className="flex items-center justify-end mt-2">
                  <span className="text-sm mr-2 text-gray-600">Language:</span>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                onClick={() => onAnalyzeText(selectedLanguage)}
                disabled={isAnalyzing || !textInput.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart mr-2"></i>Analyze My Mood
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmotionDetection;
