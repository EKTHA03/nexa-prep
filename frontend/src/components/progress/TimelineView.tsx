import React from 'react';
import { ProgressState } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Calendar, Award, Mic, HelpCircle } from 'lucide-react';

export function TimelineView({ progress }: { progress: ProgressState }) {
  const events: { title: string; date: Date | string; icon: any; color: string }[] = [];

  progress.quizHistory.forEach((q) => {
    events.push({
      title: `Quiz Attempt (${q.jobRole}): ${q.score}%`,
      date: q.date,
      icon: HelpCircle,
      color: 'text-indigo-400 border-indigo-500/30'
    });
  });

  progress.interviewHistory.forEach((i) => {
    events.push({
      title: `Interview Session (${i.jobRole}): ${i.score}/100`,
      date: i.date,
      icon: Mic,
      color: 'text-rose-400 border-rose-500/30'
    });
  });

  if (events.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-500 italic">
        No completion activities logged yet. Take a quiz or mock interview to log milestone events.
      </div>
    );
  }

  // Sort by date descending
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Activity Completion Timeline
      </h4>

      <div className="space-y-3">
        {events.map((ev, idx) => {
          const Icon = ev.icon;
          return (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-950 border ${ev.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">{ev.title}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{formatDate(ev.date)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
