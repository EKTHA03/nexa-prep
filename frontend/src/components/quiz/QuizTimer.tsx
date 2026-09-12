import React from 'react';
import { useQuizTimer } from '../../hooks/useQuizTimer';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  questionIndex: number;
  onTimeUp: () => void;
  isAnswered: boolean;
}

export function QuizTimer({ questionIndex, onTimeUp, isAnswered }: QuizTimerProps) {
  const { seconds, timerColorClass } = useQuizTimer(onTimeUp, !isAnswered, 30, questionIndex);

  return (
    <div
      key={questionIndex}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all duration-300 ${timerColorClass}`}
    >
      <Clock className="w-4 h-4 animate-spin-slow" />
      <span>00:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
}
