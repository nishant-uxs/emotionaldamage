import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

export const useWebcam = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Handle when webcam is successfully initialized
  const handleUserMedia = useCallback(() => {
    setIsWebcamReady(true);
  }, []);

  // Capture current frame from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setIsCapturing(false);
      return imageSrc;
    }
    return null;
  }, [webcamRef]);

  // Switch between front and back camera
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  return {
    webcamRef,
    isCapturing,
    isWebcamReady,
    facingMode,
    handleUserMedia,
    captureImage,
    switchCamera
  };
};
