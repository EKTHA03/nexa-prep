import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface NavigationButtonsProps {
  currentQuestion: number;
  totalQuestions: number;
  isAnswered: boolean;
  onNext: () => void;
  onSubmit: () => void;
}

// FIX #2: Explicit button wording during quiz ("Next Question" vs "Submit Quiz")
export function NavigationButtons({
  currentQuestion,
  totalQuestions,
  isAnswered,
  onNext,
  onSubmit
}: NavigationButtonsProps) {
  const isLast = currentQuestion === totalQuestions - 1;

  return (
    <button
      onClick={isLast ? onSubmit : onNext}
      disabled={!isAnswered}
      className="w-full py-3.5 px-6 font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
    >
      {isLast ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>✅ Submit Quiz</span>
        </>
      ) : (
        <>
          <span>➡️ Next Question ({currentQuestion + 1}/{totalQuestions})</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}
