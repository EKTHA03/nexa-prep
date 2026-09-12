import { useState, useEffect, useRef } from 'react';

export function useQuizTimer(
  onTimeUp: () => void,
  startTimer: boolean,
  durationSeconds = 30,
  questionIndex?: number
) {
  const [seconds, setSeconds] = useState(durationSeconds);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Reset timer whenever questionIndex changes
  useEffect(() => {
    setSeconds(durationSeconds);
  }, [questionIndex, durationSeconds]);

  useEffect(() => {
    if (!startTimer) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimer, questionIndex, durationSeconds]);

  // Determine color coding state
  let timerColorClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
  if (seconds <= 5) {
    timerColorClass = 'text-rose-500 bg-rose-950/60 border-rose-500/80 animate-pulse';
  } else if (seconds <= 10) {
    timerColorClass = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
  }

  return {
    seconds,
    isTimeUp: seconds === 0,
    timerColorClass
  };
}

