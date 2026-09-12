export interface EmotionEntry {
  timestamp: string;
  emotion: string;
  confidence: number;
}

export interface QuizAttempt {
  date: Date | string;
  jobRole: string;
  score: number; // 0-100
  answers: { [questionId: string]: string };
  submittedAt: Date | string;
  totalQuestions?: number;
  correctAnswers?: number;
}

export interface InterviewAttempt {
  date: Date | string;
  jobRole: string;
  score: number; // 0-100
  transcript: string;
  emotionLog: EmotionEntry[];
}

export interface FeedbackItem {
  category: string;
  comment: string;
  score?: number;
}

export interface WeakResponse {
  question: string;
  yourAnswer: string;
  modelAnswer: string;
  tip: string;
}

export interface InterviewSession {
  score: number;
  metrics: {
    communication: number;
    technical: number;
    problemSolving: number;
    confidence: number;
  };
  aiFeedback: FeedbackItem[];
  weakResponses: WeakResponse[];
  focusAreas: string[];
}

export interface ProgressState {
  resumePath?: string;
  extractedSkills: string[]; // single source of truth
  quizHistory: QuizAttempt[];
  interviewHistory: InterviewAttempt[];
  learnedSkills: string[];
  completedResources: string[];
  lastInterviewSession?: InterviewSession;
  currentSection: 'resume' | 'skills' | 'learning' | 'quiz' | 'interview' | 'performance' | 'jobs' | 'progress';
  careerReadinessPercentage: number; // derived dynamically
  // Issue 5: persist skill gap result for Progress page chart
  lastSkillGapResult?: SkillGapResult;
}

export interface SkillGapResult {
  jobRole: string;
  requiredSkills: string[];
  extractedSkills: string[]; // reference to state.extractedSkills
  fullyMatched: string[];
  partiallyMatched: string[];
  gaps: string[];
  matchPercentage: number;
}

export interface Resource {
  id: string;
  skill: string;
  title: string;
  url: string;
  type: 'youtube' | 'coursera' | 'docs';
  duration: string;
  completed: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface JobRole {
  id: string;
  name: string;
  matchPercentage: number;
  requiredSkills: string[];
  description: string;
  experienceLevel: string;
  salaryRange: string;
  linkedinUrl: string;
  naukriUrl: string;
  internshalaUrl: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation: string;
}

export type SectionType = 'resume' | 'skills' | 'learning' | 'quiz' | 'interview' | 'performance' | 'jobs' | 'progress';
