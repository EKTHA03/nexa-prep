import React from 'react';
import { ProgressState } from '../../types';
import { getSectionCompletionStats } from '../../services/progressCalculator';
import { CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SectionProgress({ progress }: { progress: ProgressState }) {
  const stats = getSectionCompletionStats(progress);
  const navigate = useNavigate();

  const sections = [
    { label: 'Step 1: Resume Upload', done: stats.resumeDone, path: '/resume' },
    { label: 'Step 2: Skill Gap Analysis', done: stats.skillsDone, path: '/skills' },
    { label: 'Step 3: Personalized Learning', done: stats.learningDone, path: '/learning' },
    { label: 'Step 4: Skill Assessment Quiz', done: stats.quizDone, path: '/quiz' },
    { label: 'Step 5: Voice Mock Interview', done: stats.interviewDone, path: '/interview' },
    { label: 'Step 6: Performance Review', done: stats.performanceDone, path: '/performance' },
    { label: 'Step 7: Job Recommendations', done: stats.jobsDone, path: '/jobs' },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">8-Step Journey Completion Status</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((sec, idx) => (
          <button
            key={idx}
            onClick={() => navigate(sec.path)}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
              sec.done
                ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-semibold">{sec.label}</span>
            {sec.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
