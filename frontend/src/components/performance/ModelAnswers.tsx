import React from 'react';
import { WeakResponse } from '../../types';
import { Sparkles, HelpCircle } from 'lucide-react';

interface ModelAnswersProps {
  weakResponses: WeakResponse[];
}

export function ModelAnswers({ weakResponses }: ModelAnswersProps) {
  if (!weakResponses || weakResponses.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 text-emerald-300 text-xs font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <span>Outstanding! All your responses scored above 70% accuracy threshold.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-amber-400" />
        Weak Responses & Side-by-Side Model Answers ({weakResponses.length})
      </h4>

      <div className="space-y-4">
        {weakResponses.map((item, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <h5 className="font-bold text-sm text-slate-100">Q: {item.question}</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-400 uppercase text-[10px]">Your Answer</span>
                <p className="text-slate-300 italic">{item.yourAnswer}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-400 uppercase text-[10px]">AI Ideal Model Answer</span>
                <p className="text-slate-200">{item.modelAnswer}</p>
              </div>
            </div>

            <div className="text-xs text-amber-300 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20 font-medium">
              💡 Improvement Tip: {item.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
