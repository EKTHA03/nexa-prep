import React, { useMemo } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { getRankedJobRecommendations } from '../../services/jobMatcher';
import { JobCard } from './JobCard';
import { Button } from '../common/Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { StepNavigation } from '../common/StepNavigation';

export function JobRecommendation() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  // Formula: overallMatch = skills*0.4 + quizScore*0.3 + interviewScore*0.3
  const rankedJobs = useMemo(() => {
    return getRankedJobRecommendations(progress);
  }, [progress]);

  const topJobs = rankedJobs.slice(0, 7);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            💼 AI Job Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ranked based on your weighted match (40% skills + 30% quiz + 30% mock interview score).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topJobs.map((role) => (
          <JobCard key={role.id} role={role} />
        ))}
      </div>

      <StepNavigation currentPath="/jobs" />
    </div>
  );
}
