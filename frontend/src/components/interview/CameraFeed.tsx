import React from 'react';
import { EmotionDetector } from './EmotionDetector';
import type { EmotionDetectionResult } from '../../services/emotionDetector';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  onToggleCamera: () => void;
  detectionState: EmotionDetectionResult;
  onEnableCamera?: () => void;
  mediaError?: string | null;
}

export function CameraFeed({
  videoRef,
  isStreaming,
  onToggleCamera,
  detectionState,
  onEnableCamera,
  mediaError,
}: CameraFeedProps) {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedData={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
        className={`w-full h-full object-cover transform -scale-x-100 ${isStreaming ? 'block' : 'hidden'}`}
      />

      {!isStreaming && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90 text-slate-400">
          {mediaError ? (
            <>
              <AlertCircle className="w-10 h-10 text-amber-400 shrink-0" />
              <p className="text-xs font-semibold text-slate-300 max-w-xs">{mediaError}</p>
            </>
          ) : (
            <>
              <CameraOff className="w-10 h-10 text-slate-500 stroke-[1.5]" />
              <p className="text-xs font-medium text-slate-400">Camera is currently paused or requesting access</p>
            </>
          )}

          {onEnableCamera && (
            <button
              onClick={onEnableCamera}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>Tap to Enable Camera & Mic</span>
            </button>
          )}
        </div>
      )}

      {isStreaming && (
        <div className="absolute top-4 left-4 z-10">
          <EmotionDetector detection={detectionState} />
        </div>
      )}

      {/* Live candidate composure probabilities overlay */}
      {isStreaming && detectionState.hasFace && detectionState.allEmotions && (
        <div className="absolute bottom-4 left-4 z-10 p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-[11px] font-sans text-slate-200 backdrop-blur-md shadow-xl">
          <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Composure Breakdown</span>
          </div>
          {Object.entries(detectionState.allEmotions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([emo, val]) => {
              const labelName = emo === 'focused' ? 'Focused / Calm' :
                               emo === 'confident' ? 'Confident & Poised' :
                               emo === 'thoughtful' ? 'Thoughtful' :
                               emo === 'engaged' ? 'Engaged' :
                               emo === 'nervous' ? 'Slight Tension' : emo;
              return (
                <div key={emo} className="flex items-center justify-between gap-4 py-0.5 border-b border-slate-800/60 last:border-0 font-mono text-[10px]">
                  <span className="text-slate-300 font-medium">{labelName}</span>
                  <span className="font-bold text-cyan-400">{(val * 100).toFixed(1)}%</span>
                </div>
              );
            })}
        </div>
      )}

      <button
        onClick={onToggleCamera}
        className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700 backdrop-blur-md transition"
        title={isStreaming ? 'Turn Off Camera' : 'Turn On Camera'}
      >
        {isStreaming ? <Camera className="w-5 h-5 text-emerald-400" /> : <CameraOff className="w-5 h-5 text-rose-400" />}
      </button>
    </div>
  );
}
