import React from 'react';
import { SkillTag } from '../common/SkillTag';
import { Cpu, Sparkles } from 'lucide-react';

interface SkillExtractorProps {
  skills: string[];
}

export function SkillExtractor({ skills }: SkillExtractorProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Cpu className="w-5 h-5" />
          <h4 className="font-bold text-sm text-slate-200">Extracted Technical Skills ({skills.length})</h4>
        </div>
        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Technical Filtered (Fix #4)
        </span>
      </div>

      <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        {skills.map((skill, i) => (
          <SkillTag key={i} skill={skill} status="neutral" />
        ))}
      </div>
    </div>
  );
}
