import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  height?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = 'primary',
  height = 'h-3',
  className = ''
}: ProgressBarProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  const colorGradients = {
    primary: 'from-indigo-600 to-violet-600',
    success: 'from-emerald-500 to-teal-500',
    warning: 'from-amber-500 to-orange-500',
    danger: 'from-rose-500 to-red-600',
    info: 'from-cyan-500 to-blue-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono">{safeProgress}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${height}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorGradients[color]} transition-all duration-500 ease-out`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}
