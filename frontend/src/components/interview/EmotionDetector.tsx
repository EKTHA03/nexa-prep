import React from 'react';
import { EmotionDetectionResult } from '../../services/emotionDetector';
import { Video } from 'lucide-react';

interface EmotionDetectorProps {
  detection: EmotionDetectionResult;
}

export function EmotionDetector({ detection }: EmotionDetectorProps) {
  // FIX #8 rule 1: If NO face detected → show "📹 Detecting emotions…" — NEVER "Neutral"
  if (!detection.hasFace) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-semibold backdrop-blur-md animate-pulse">
        <Video className="w-3.5 h-3.5 text-indigo-400" />
        <span>📹 Detecting emotions…</span>
      </div>
    );
  }

  // FIX #8 rule 2: If top emotion confidence <= 0.3 → show nothing (do not default to Neutral)
  if (!detection.topEmotion || !detection.confidence || detection.confidence <= 0.3) {
    return null;
  }

  // FIX #8 rule 3: If face detected AND top emotion confidence > 0.3 → show real emoji + emotion name + confidence %
  const confidencePct = Math.round(detection.confidence * 100);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 text-indigo-200 text-xs font-bold backdrop-blur-md shadow-lg animate-fade-in-up">
      <span className="text-base">{detection.emoji}</span>
      <span className="capitalize">{detection.label}</span>
      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
        {confidencePct}%
      </span>
    </div>
  );
}
