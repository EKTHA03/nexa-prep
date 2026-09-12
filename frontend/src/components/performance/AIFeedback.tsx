import React from 'react';
import { FeedbackItem } from '../../types';
import { MessageSquareCode, CheckCircle2 } from 'lucide-react';

interface AIFeedbackProps {
  feedback: FeedbackItem[];
  focusAreas: string[];
}

export function AIFeedback({ feedback, focusAreas }: AIFeedbackProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Feedback */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4" /> AI Feedback Per Category
        </h4>
        <div className="space-y-3">
          {feedback.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-200">{item.category}</span>
              <p className="text-xs text-slate-400 leading-relaxed">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top-3 Focus Areas */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Top-3 Recommended Focus Areas
        </h4>
        <div className="space-y-3">
          {focusAreas.map((area, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs font-medium text-slate-200 leading-relaxed">{area}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
