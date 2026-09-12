import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSkills } from '../../hooks/useSkills';
import { SkillCategory } from './SkillCategory';
import { MatchPercentage } from './MatchPercentage';
import { SkillComparison } from './SkillComparison';
import { Button } from '../common/Button';
import { ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { StepNavigation } from '../common/StepNavigation';

export function SkillGapAnalysis() {
  const { selectedRole, setSelectedRole } = useApp();
  const navigate = useNavigate();
  const { skillComparison, extractedSkills } = useSkills(selectedRole);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            🎯 Skill Gap Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare your extracted resume skills against target engineering industry benchmarks (Fix #6: single source of truth).
          </p>
        </div>
      </div>

      {extractedSkills.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <Info className="w-5 h-5 shrink-0" />
          <span>
            No resume uploaded yet. Default software skills are showing. For custom results, upload your resume on Step 1.
          </span>
        </div>
      )}

      <SkillCategory selectedRole={selectedRole} onSelectRole={setSelectedRole} />

      <MatchPercentage
        percentage={skillComparison.matchPercentage}
        jobTitle={skillComparison.jobRole}
      />

      <SkillComparison
        fullyMatched={skillComparison.fullyMatched}
        partiallyMatched={skillComparison.partiallyMatched}
        gaps={skillComparison.gaps}
      />

      <StepNavigation currentPath="/skills" />
    </div>
  );
}
