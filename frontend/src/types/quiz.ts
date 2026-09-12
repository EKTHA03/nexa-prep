import type { QuizQuestion, QuizAttempt } from './index';

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [questionIndex: number]: number };
  isSubmitted: boolean;
  score: number;
  timeRemaining: number;
}

export type { QuizQuestion, QuizAttempt };
