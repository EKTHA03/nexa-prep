import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useSkills } from '../../hooks/useSkills';
import { useProgress } from '../../context/ProgressContext';
import { generateResourcesForGaps } from '../../services/learningPlanner';
import { getJobRoleById } from '../../config/jobRoles';
import { ResourceCard } from './ResourceCard';
import { LearningProgress } from './LearningProgress';
import { BookOpenCheck, CheckCircle2 } from 'lucide-react';
import { StepNavigation } from '../common/StepNavigation';

export function LearningPlan() {
  const { selectedRole } = useApp();
  const { skillComparison, markSkillLearned, removeLearnedSkill } = useSkills(selectedRole);
  const { progress, dispatch } = useProgress();

  const roleInfo = getJobRoleById(selectedRole);
  const targetRoleRequiredSkills = roleInfo ? roleInfo.requiredSkills : ['SQL', 'Python', 'Excel', 'Tableau'];

  const hasExtractedSkills = progress.extractedSkills.length > 0;

  // Single Source of Truth Fix (Part 1 & Part 2):
  // gapSkills MUST equal skillComparison.gaps strictly when resume uploaded.
  const gapSkills = hasExtractedSkills
    ? skillComparison.gaps
    : targetRoleRequiredSkills;

  const resources = useMemo(() => {
    return generateResourcesForGaps(gapSkills);
  }, [gapSkills]);

  const completedIds = progress.completedResources || [];

  const toggleResource = (resourceId: string, skillName: string) => {
    const isCurrentlyCompleted = completedIds.includes(resourceId);
    const updatedCompletedIds = isCurrentlyCompleted
      ? completedIds.filter(id => id !== resourceId)
      : [...completedIds, resourceId];

    // Toggle resource card status in global state/storage
    dispatch({ type: 'TOGGLE_COMPLETED_RESOURCE', payload: resourceId });

    // Strict 3-Resource Completion Rule (Part 2):
    // A skill ONLY becomes learned when ALL 3 of its resource cards (yt, docs, course) are completed.
    const safeSkillId = encodeURIComponent(skillName.trim().toLowerCase());
    const reqIds = [
      `res-${safeSkillId}-yt`,
      `res-${safeSkillId}-docs`,
      `res-${safeSkillId}-course`
    ];

    const all3Completed = reqIds.every(id => updatedCompletedIds.includes(id));

    if (all3Completed) {
      markSkillLearned(skillName);
    } else {
      removeLearnedSkill(skillName);
    }
  };

  // Filter completed IDs strictly against active resources set
  const activeCompletedCount = resources.filter(res => completedIds.includes(res.id)).length;

  const allMatched = hasExtractedSkills && skillComparison.gaps.length === 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            📚 Personalized Learning Plan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Targeted tutorials and documentation to close identified skill gaps for <span className="text-cyan-400 font-bold">{skillComparison.jobRole}</span>.
          </p>
        </div>
      </div>

      <LearningProgress completedCount={activeCompletedCount} totalCount={resources.length} />

      {allMatched ? (
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-emerald-200">100% Skill Match Achieved!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your resume and learned skills cover all required competencies for <strong className="text-emerald-400">{skillComparison.jobRole}</strong>. You are fully ready for mock interview simulation!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-indigo-400" />
            Recommended Resources ({resources.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                isCompleted={completedIds.includes(res.id)}
                onToggleComplete={toggleResource}
              />
            ))}
          </div>
        </div>
      )}

      <StepNavigation currentPath="/learning" />
    </div>
  );
}
