export const APP_NAME = "NEXA PREP";
export const APP_SLOGAN = "Development of AI Based Intelligent System for Personalized Career Preparation and Mock Interview Simulation System";
export const APP_FULL_TITLE = "Development of AI Based Intelligent System for Personalized Career Preparation and Mock Interview Simulation System";

export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined'
    ? window.location.hostname.includes('loca.lt')
      ? 'https://nexa-prep-api.loca.lt'
      : `http://${window.location.hostname}:8080`
    : 'http://localhost:8080'
);

export const QUIZ_QUESTION_TIME_LIMIT = 30; // 30 seconds per question

export const SECTION_KEYS = {
  HOME: 'home',
  RESUME: 'resume',
  SKILLS: 'skills',
  LEARNING: 'learning',
  QUIZ: 'quiz',
  INTERVIEW: 'interview',
  PERFORMANCE: 'performance',
  JOBS: 'jobs',
  PROGRESS: 'progress',
} as const;

export const EMOTIONS = {
  HAPPY: { label: 'Confident / Happy', emoji: '😊', minConfidence: 0.3 },
  NEUTRAL: { label: 'Focused / Calm', emoji: '😐', minConfidence: 0.3 },
  SURPRISED: { label: 'Engaged / Surprised', emoji: '😲', minConfidence: 0.3 },
  SAD: { label: 'Thoughtful / Sad', emoji: '😔', minConfidence: 0.3 },
  FEARFUL: { label: 'Nervous / Anxious', emoji: '😨', minConfidence: 0.3 },
  ANGRY: { label: 'Intense / Serious', emoji: '😠', minConfidence: 0.3 },
  DISGUSTED: { label: 'Uncertain / Puzzled', emoji: '🤢', minConfidence: 0.3 },
};
