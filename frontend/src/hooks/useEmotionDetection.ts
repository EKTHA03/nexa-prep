import { useState, useEffect, useRef } from 'react';
import { emotionDetectorService, EmotionDetectionResult } from '../services/emotionDetector';
import type { EmotionEntry } from '../types';

export function useEmotionDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isStreaming: boolean
) {
  const [detectionState, setDetectionState] = useState<EmotionDetectionResult>({ hasFace: false });
  const [emotionLog, setEmotionLog] = useState<EmotionEntry[]>([]);
  const logRef = useRef<EmotionEntry[]>([]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    logRef.current = emotionLog;
  }, [emotionLog]);

  useEffect(() => {
    // Stop detector when not streaming
    if (!isStreaming || !videoRef.current) {
      try {
        emotionDetectorService.stopDetection();
      } catch (e) {}
      setDetectionState({ hasFace: false });
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const video = videoRef.current;

    const tryInit = () => {
      try {
        if (!video || video.readyState < 2) {
          video?.addEventListener('loadeddata', tryInit, { once: true });
          return;
        }

        emotionDetectorService.initialize(video, (res: EmotionDetectionResult) => {
          setDetectionState(res);

          if (res.hasFace && res.topEmotion && res.confidence && res.confidence > 0.3) {
            const entry: EmotionEntry = {
              timestamp: new Date().toLocaleTimeString(),
              emotion: res.topEmotion,
              confidence: res.confidence,
            };

            setEmotionLog(prev => {
              const lastEntry = prev[prev.length - 1];
              if (!lastEntry || lastEntry.emotion !== entry.emotion) {
                return [...prev, entry];
              }
              return prev;
            });
          }
        });

        emotionDetectorService.startDetection(150);
      } catch (err) {
        console.warn('Emotion detection initialization deferred/failed:', err);
      }
    };

    tryInit();

    return () => {
      try {
        emotionDetectorService.stopDetection();
      } catch (e) {}
      hasInitialized.current = false;
    };
  }, [isStreaming]);

  return {
    detectionState,
    emotionLog,
    clearLog: () => setEmotionLog([]),
  };
}
