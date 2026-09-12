import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

export function MatchPercentage({ percentage, jobTitle }: { percentage: number; jobTitle: string }) {
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (percentage < 50) badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  else if (percentage < 75) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400">Target Role Match</span>
          <h3 className="text-lg font-extrabold text-slate-100">{jobTitle}</h3>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-base font-black border font-mono ${badgeColor}`}>
          {percentage}% Match
        </div>
      </div>
      <ProgressBar progress={percentage} color={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'} />
    </div>
  );
}
