import React from 'react';
import { SkillTag } from '../common/SkillTag';
import { CheckCircle, AlertTriangle, XCircle, Plus, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface SkillComparisonProps {
  fullyMatched: string[];
  partiallyMatched: string[];
  gaps: string[];
}

export function SkillComparison({ fullyMatched, partiallyMatched, gaps }: SkillComparisonProps) {
  const { progress, dispatch } = useProgress();

  const handleAddMissingSkill = (skill: string) => {
    const updated = [...progress.extractedSkills, skill];
    dispatch({ type: 'SET_EXTRACTED_SKILLS', payload: updated });
    // NOTE: No manual localStorage write here — ProgressContext persists to the
    // correct user-namespaced key (NEXA_PREP_STATE_<email>) automatically.
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Fully Matched */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-2">
            <CheckCircle className="w-4 h-4" />
            <span>Skills You Have ({fullyMatched.length})</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {fullyMatched.length > 0 ? (
              fullyMatched.map((skill, i) => <SkillTag key={i} skill={skill} status="matched" />)
            ) : (
              <p className="text-xs text-slate-500 italic">No matching skills yet</p>
            )}
          </div>
        </div>

        {/* Column 2: Partially Matched */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-amber-500/20 pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Partially Matched ({partiallyMatched.length})</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {partiallyMatched.length > 0 ? (
              partiallyMatched.map((skill, i) => <SkillTag key={i} skill={skill} status="partial" />)
            ) : (
              <p className="text-xs text-slate-500 italic">No partial matches</p>
            )}
          </div>
        </div>

        {/* Column 3: Skill Gaps */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <XCircle className="w-4 h-4" />
              <span>Skills to Learn ({gaps.length})</span>
            </div>
            <span className="text-[10px] text-slate-400">Click + to add to profile</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {gaps.length > 0 ? (
              gaps.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => handleAddMissingSkill(skill)}
                  title={`Click to mark ${skill} as a skill you have`}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>{skill}</span>
                  <Plus className="w-3 h-3 text-rose-400 group-hover:text-emerald-400" />
                </button>
              ))
            ) : (
              <p className="text-xs text-emerald-400 font-medium">All target skills acquired! 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
