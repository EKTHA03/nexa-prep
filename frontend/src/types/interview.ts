import type { EmotionEntry, InterviewAttempt, InterviewSession } from './index';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'problem-solving';
  idealKeywords: string[];
}

export type { EmotionEntry, InterviewAttempt, InterviewSession };
