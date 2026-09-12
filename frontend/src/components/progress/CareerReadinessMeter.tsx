import React from 'react';
import { Award, Zap } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export function CareerReadinessMeter({ readinessPercentage }: { readinessPercentage: number }) {
  let statusText = "0% — Upload Resume to Begin";
  if (readinessPercentage >= 80) statusText = "Excellent — Highly Interview Ready!";
  else if (readinessPercentage >= 60) statusText = "Good — Approaching Target Competency";
  else if (readinessPercentage > 0) statusText = "In Progress — Complete Quizzes & Interviews to Boost Score";

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-violet-950/30 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center sm:justify-start gap-1.5">
          <Zap className="w-4 h-4" /> Overall Career Readiness Meter (Fix #1)
        </span>
        <h3 className="text-3xl font-black font-mono text-slate-100">{readinessPercentage}%</h3>
        <p className="text-xs font-medium text-slate-300">{statusText}</p>
      </div>

      <div className="w-full sm:w-64 space-y-2">
        <ProgressBar progress={readinessPercentage} color="primary" height="h-4" showPercentage={false} />
        <p className="text-[10px] text-slate-400 text-center">Derived strictly from 40% Quiz + 35% Interview + 25% Learning</p>
      </div>
    </div>
  );
}
