import React from 'react';
import { getSkillTagColor } from '../../utils/colorMap';

interface SkillTagProps {
  skill: string;
  status?: 'matched' | 'partial' | 'gap' | 'learned' | 'neutral';
  onRemove?: () => void;
  className?: string;
}

export function SkillTag({ skill, status = 'neutral', onRemove, className = '' }: SkillTagProps) {
  const dynamicColor = getSkillTagColor(skill);

  const statusStyles = {
    matched: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    partial: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    gap: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    learned: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    neutral: `${dynamicColor.bg} ${dynamicColor.text} ${dynamicColor.border}`,
  };

  const statusIcons = {
    matched: '✅ ',
    partial: '🟡 ',
    gap: '❌ ',
    learned: '🎓 ',
    neutral: '',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${statusStyles[status]} ${className}`}
    >
      <span>{statusIcons[status]}{skill}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-75 focus:outline-none"
          title="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
