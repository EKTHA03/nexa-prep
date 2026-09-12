import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

interface LearningProgressProps {
  completedCount: number;
  totalCount: number;
}

export function LearningProgress({ completedCount, totalCount }: LearningProgressProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
        <span>📚 Resource Completion Rate</span>
        <span className="font-mono text-indigo-400">{completedCount} of {totalCount} completed</span>
      </div>
      <ProgressBar progress={percentage} color="info" />
    </div>
  );
}
