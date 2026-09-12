import React from 'react';
import { Button } from '../common/Button';
import { Play, Clock, HelpCircle, Award, AlertCircle } from 'lucide-react';

interface QuizRulesProps {
  roleName: string;
  totalQuestions: number;
  timePerQuestion: number;
  onStartQuiz: () => void;
}

export function QuizRules({ roleName, totalQuestions, timePerQuestion, onStartQuiz }: QuizRulesProps) {
  return (
    <div className="glass-card p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-slate-900/90 space-y-6 shadow-2xl animate-fade-in-up">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-100">Assessment Rules & Guidelines</h3>
          <p className="text-xs text-slate-400">Review the guidelines below for {roleName} evaluation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>{totalQuestions} MCQ Questions</span>
          </div>
          <p className="text-[11px] text-slate-400">Curated technical multiple-choice questions for {roleName}.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Clock className="w-4 h-4" />
            <span>{timePerQuestion}s Per Question</span>
          </div>
          <p className="text-[11px] text-slate-400">Strict countdown per question with automatic submission on timeout.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Detailed Review</span>
          </div>
          <p className="text-[11px] text-slate-400">Score breakdown and model explanations provided upon completion.</p>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <p className="text-xs text-slate-400 italic">
          💡 Click "Start Quiz" when ready. The timer begins immediately.
        </p>

        <Button
          variant="primary"
          size="lg"
          icon={<Play className="w-5 h-5 fill-current" />}
          onClick={onStartQuiz}
          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black shadow-xl shadow-amber-950"
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
}
