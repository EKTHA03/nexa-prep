import React from 'react';
import { QuizQuestion } from '../../types';
import { QuizTimer } from './QuizTimer';
import { AnswerOptions } from './AnswerOptions';

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedOption?: number;
  onSelectOption: (optionIdx: number) => void;
  onTimeUp: () => void;
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onTimeUp
}: QuestionCardProps) {
  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            {question.category} • Question {questionIndex + 1} of {totalQuestions}
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">{question.question}</h3>
        </div>

        {/* Fix #3: Timer starts post-render */}
        <QuizTimer
          questionIndex={questionIndex}
          onTimeUp={onTimeUp}
          isAnswered={selectedOption !== undefined}
        />
      </div>

      {/* Render all 4 options first */}
      <AnswerOptions
        options={question.options}
        selectedIndex={selectedOption}
        onSelect={onSelectOption}
      />
    </div>
  );
}
