import React from 'react';
import { GitMerge, Check } from 'lucide-react';

export function SkillDeduplicator() {
  const exampleMerges = [
    { raw: 'DSA + Data Structures', canonical: 'Data Structures & Algorithms' },
    { raw: 'Node + Node.js + Express', canonical: 'Node.js' },
    { raw: 'React + ReactJS', canonical: 'React' },
    { raw: 'ML + Deep Learning', canonical: 'Machine Learning' }
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
      <div className="flex items-center gap-2 text-violet-400">
        <GitMerge className="w-4 h-4" />
        <h5 className="text-xs font-bold text-slate-300">Skill Deduplication Engine (Fix #5)</h5>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {exampleMerges.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 line-through text-[11px]">{item.raw}</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> {item.canonical}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
