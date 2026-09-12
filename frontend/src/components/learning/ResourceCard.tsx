import React from 'react';
import type { Resource } from '../../types';
import { Play, BookOpen, GraduationCap, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface ResourceCardProps {
  resource: Resource;
  onToggleComplete: (id: string, skill: string) => void;
  isCompleted: boolean;
}

export function ResourceCard({ resource, onToggleComplete, isCompleted }: ResourceCardProps) {
  const typeIcons = {
    youtube: <Play className="w-4 h-4 text-rose-500 fill-current" />,
    docs: <BookOpen className="w-4 h-4 text-indigo-400" />,
    coursera: <GraduationCap className="w-4 h-4 text-blue-400" />,
  };

  return (
    <div
      className={`glass-card p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            {typeIcons[resource.type]}
            <span className="capitalize">{resource.type}</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{resource.duration}</span>
        </div>

        <h4 className="font-bold text-sm text-slate-100 line-clamp-2">{resource.title}</h4>
        <p className="text-xs text-indigo-400 font-semibold">Skill: {resource.skill}</p>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="outline" size="sm" className="w-full" icon={<ExternalLink className="w-3.5 h-3.5" />}>
            Open
          </Button>
        </a>

        <Button
          variant={isCompleted ? 'success' : 'secondary'}
          size="sm"
          onClick={() => onToggleComplete(resource.id, resource.skill)}
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
        >
          {isCompleted ? 'Completed' : 'Mark Learned'}
        </Button>
      </div>
    </div>
  );
}
