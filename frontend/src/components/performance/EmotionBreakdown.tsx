import React from 'react';
import { EmotionEntry } from '../../types';
import { Smile } from 'lucide-react';

interface EmotionBreakdownProps {
  emotionLog: EmotionEntry[];
}

export function EmotionBreakdown({ emotionLog }: EmotionBreakdownProps) {
  if (!emotionLog || emotionLog.length === 0) {
    return (
      <div className="glass-card p-4 rounded-xl border border-slate-800 text-xs text-slate-500 italic">
        No facial emotion entries recorded during session.
      </div>
    );
  }

  // Aggregate emotions count
  const emotionCounts: { [e: string]: number } = {};
  emotionLog.forEach(item => {
    emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
  });

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
        <Smile className="w-4 h-4" /> Live Video Facial Expression Breakdown (Fix #8)
      </h4>

      <div className="flex flex-wrap gap-3">
        {Object.entries(emotionCounts).map(([emotion, count], idx) => (
          <div key={idx} className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold flex items-center gap-2">
            <span className="capitalize text-slate-200">{emotion}</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-[10px]">
              {count} ticks
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
