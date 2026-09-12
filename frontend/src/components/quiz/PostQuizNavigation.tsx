import React from 'react';
import { Mic, ArrowRight } from 'lucide-react';

interface PostQuizNavigationProps {
  quizSubmitted: boolean;
  onNavigateToInterview: () => void;
}

// FIX #2: ONLY rendered after quiz is submitted & score is saved to context
export function PostQuizNavigation({ quizSubmitted, onNavigateToInterview }: PostQuizNavigationProps) {
  if (!quizSubmitted) return null;

  return (
    <div className="pt-6 border-t border-slate-800 space-y-3 animate-fade-in-up">
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
        ✅ Quiz Attempt Scored & Saved to Profile. Continue to Step 5!
      </div>
      
      <button
        onClick={onNavigateToInterview}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl text-base font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
      >
        <Mic className="w-5 h-5" />
        <span>🎤 Next: Voice Mock Interview</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
