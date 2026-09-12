import React from 'react';
import { Mic, Edit3, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcript: string;
  isRecording: boolean;
  onTranscriptChange?: (text: string) => void;
  audioLevel?: number; // 0 to 100%
  micStatus?: 'listening' | 'silent' | 'denied' | 'ready';
}

export function TranscriptionDisplay({
  transcript,
  isRecording,
  onTranscriptChange,
  audioLevel = 0,
  micStatus = 'ready'
}: TranscriptionDisplayProps) {
  const wordCount = (transcript || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
        <span className="flex items-center gap-2">
          <Mic className={`w-4 h-4 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <span>Real-Time Answer (Voice or Type)</span>
        </span>
        <div className="flex items-center gap-3">
          {isRecording && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{micStatus === 'listening' ? '● Listening...' : '● Recording Audio'}</span>
              <span className="ml-1 text-[11px] text-slate-400">({audioLevel}% vol)</span>
            </div>
          )}
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            {wordCount} words
          </span>
        </div>
      </div>

      {/* Real-time speech to text / manual editable area */}
      <div className="relative">
        <textarea
          rows={3}
          value={transcript || ''}
          onChange={(e) => onTranscriptChange && onTranscriptChange(e.target.value)}
          placeholder={
            isRecording
              ? "Listening to your voice... Speak clearly or type/edit your answer here directly."
              : "Speak into your microphone or type your technical answer here..."
          }
          className="w-full p-3 rounded-lg bg-slate-950/90 border border-slate-800/90 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-y min-h-[85px] leading-relaxed transition-all"
        />
        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 text-[10px] text-slate-500 font-sans pointer-events-none">
          <Edit3 className="w-3 h-3 text-slate-400" />
          <span>Editable</span>
        </div>
      </div>

      {/* Helpful Audio / Typing Guidance */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
        <div className="flex items-center gap-1.5">
          {audioLevel > 5 ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Mic capturing sound
            </span>
          ) : isRecording ? (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Speak closer to mic or type your response above
            </span>
          ) : (
            <span className="text-slate-500">
              💡 Tip: Answers with specific technical terms & STAR framework receive higher scores.
            </span>
          )}
        </div>
        {wordCount >= 10 && (
          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Answer captured
          </span>
        )}
      </div>
    </div>
  );
}
