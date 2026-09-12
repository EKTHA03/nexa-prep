import React from 'react';

interface AnswerOptionsProps {
  options: string[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function AnswerOptions({ options, selectedIndex, onSelect, disabled = false }: AnswerOptionsProps) {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-3">
      {options.map((opt, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelect(idx)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
              isSelected
                ? 'border-indigo-500 bg-indigo-600/20 text-indigo-200 ring-2 ring-indigo-500/50 shadow-lg'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <span
              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {optionLabels[idx]}
            </span>
            <span className="text-sm font-medium leading-snug">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
