import React from 'react';
import { ProgressState } from '../../types';
import { HelpCircle, Mic, BookOpen, FileText } from 'lucide-react';

export function ProgressBreakdown({ progress }: { progress: ProgressState }) {
  const quizAvg = progress.quizHistory.length > 0
    ? Math.round(progress.quizHistory.reduce((s, q) => s + q.score, 0) / progress.quizHistory.length)
    : 0;

  const interviewAvg = progress.interviewHistory.length > 0
    ? Math.round(progress.interviewHistory.reduce((s, i) => s + i.score, 0) / progress.interviewHistory.length)
    : 0;

  const totalExtracted = progress.extractedSkills.length || 1;
  const learningPct = Math.round((progress.learnedSkills.length / totalExtracted) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-bold uppercase">Skills Extracted</span>
          <FileText className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-black font-mono text-slate-100">{progress.extractedSkills.length}</div>
        <p className="text-[11px] text-slate-500">Source of Truth skills</p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-bold uppercase">Quiz Average</span>
          <HelpCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-black font-mono text-slate-100">{quizAvg}%</div>
        <p className="text-[11px] text-slate-500">{progress.quizHistory.length} attempts recorded</p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-bold uppercase">Interview Average</span>
          <Mic className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl font-black font-mono text-slate-100">{interviewAvg}%</div>
        <p className="text-[11px] text-slate-500">{progress.interviewHistory.length} sessions completed</p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-xs font-bold uppercase">Skills Learned</span>
          <BookOpen className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-black font-mono text-slate-100">{learningPct}%</div>
        <p className="text-[11px] text-slate-500">{progress.learnedSkills.length} skills acquired</p>
      </div>
    </div>
  );
}
