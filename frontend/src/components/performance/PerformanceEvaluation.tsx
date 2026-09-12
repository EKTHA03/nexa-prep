import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { InterviewScore } from './InterviewScore';
import { AIFeedback } from './AIFeedback';
import { ModelAnswers } from './ModelAnswers';
import { EmotionBreakdown } from './EmotionBreakdown';
import { Button } from '../common/Button';
import { ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { StepNavigation } from '../common/StepNavigation';

export function PerformanceEvaluation() {
  const { progress } = useProgress();
  const navigate = useNavigate();
  const session = progress.lastInterviewSession;
  const lastAttempt = progress.interviewHistory && progress.interviewHistory.length > 0
    ? progress.interviewHistory[progress.interviewHistory.length - 1]
    : null;

  if (!session) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-4 animate-fade-in-up">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">No Interview Performance Data Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Complete the Voice Mock Interview session (Step 5) to unlock your AI performance evaluation report.
        </p>
        <Button variant="primary" onClick={() => navigate('/interview')}>
          Go to Mock Interview
        </Button>
        <StepNavigation currentPath="/performance" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            📊 Step 6: Interview Performance Evaluation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive AI report evaluating communication, technical depth, and facial expression analysis.
          </p>
        </div>
      </div>

      <InterviewScore score={session.score} metrics={session.metrics} />

      <AIFeedback feedback={session.aiFeedback} focusAreas={session.focusAreas} />

      <ModelAnswers weakResponses={session.weakResponses} />

      <EmotionBreakdown emotionLog={lastAttempt?.emotionLog || []} />

      <StepNavigation currentPath="/performance" />
    </div>
  );
}
