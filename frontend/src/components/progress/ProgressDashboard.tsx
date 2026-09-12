import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { useApp } from '../../context/AppContext';
import { CareerReadinessMeter } from './CareerReadinessMeter';
import { ProgressBreakdown } from './ProgressBreakdown';
import { SectionProgress } from './SectionProgress';
import { TimelineView } from './TimelineView';
import { ResumeSkillChart } from './ResumeSkillChart';
import { Button } from '../common/Button';
import { Upload, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { compareSkillsForRole } from '../../services/skillMatcher';

import { StepNavigation } from '../common/StepNavigation';

export function ProgressDashboard() {
  const { progress, dispatch } = useProgress();
  const { selectedRole } = useApp();
  const navigate = useNavigate();

  // Compute live skill gap result for the chart (or use persisted one)
  const skillGap = React.useMemo(() => {
    if (progress.extractedSkills.length === 0) return null;
    const roleId = selectedRole || 'software-engineer';
    return compareSkillsForRole(roleId, progress.extractedSkills, progress.learnedSkills);
  }, [progress.extractedSkills, progress.learnedSkills, selectedRole]);

  // Persist the computed gap result AFTER render (never inside useMemo — that fires during render)
  React.useEffect(() => {
    if (skillGap) {
      dispatch({ type: 'SET_SKILL_GAP', payload: skillGap });
    }
  }, [skillGap]);

  const displayGap = skillGap ?? progress.lastSkillGapResult ?? null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Issue 5: Updated page title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            📊 Career Preparation Progress
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics and readiness scoring based on your resume, quizzes, and interview history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {progress.extractedSkills.length === 0 ? (
            <Button
              variant="primary"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => navigate('/resume')}
            >
              Upload Resume to Begin
            </Button>
          ) : (
            <Button
              variant="outline"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => dispatch({ type: 'RESET_ALL' })}
            >
              Reset Progress State
            </Button>
          )}
        </div>
      </div>

      <CareerReadinessMeter readinessPercentage={progress.careerReadinessPercentage} />

      {/* ── Issue 5: Resume skill overview chart ── */}
      {displayGap && (
        <ResumeSkillChart
          skillGap={displayGap}
          extractedCount={progress.extractedSkills.length}
        />
      )}

      {!displayGap && progress.extractedSkills.length === 0 && (
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6 text-center text-slate-400 text-sm">
          📄 Upload your resume to see the skill coverage chart for your target role.
        </div>
      )}

      <ProgressBreakdown progress={progress} />

      <SectionProgress progress={progress} />

      <TimelineView progress={progress} />

      <StepNavigation currentPath="/progress" />
    </div>
  );
}
