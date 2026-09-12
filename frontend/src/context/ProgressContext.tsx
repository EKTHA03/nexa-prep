import React, { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import { ProgressState, QuizAttempt, InterviewAttempt, InterviewSession, SectionType, SkillGapResult } from '../types';
import { calculateCareerReadiness } from '../services/progressCalculator';
import { useAuth } from './AuthContext';

const getStorageKey = (email?: string) => 
  'NEXA_PREP_STATE_' + (email ? encodeURIComponent(email.toLowerCase().trim()) : 'guest');

const initialState: ProgressState = {
  extractedSkills: [],
  quizHistory: [],
  interviewHistory: [],
  learnedSkills: [],
  completedResources: [],
  currentSection: 'resume',
  careerReadinessPercentage: 0,
};

type Action =
  | { type: 'SET_EXTRACTED_SKILLS'; payload: string[] }
  | { type: 'ADD_QUIZ_ATTEMPT'; payload: QuizAttempt }
  | { type: 'ADD_INTERVIEW_ATTEMPT'; payload: InterviewAttempt }
  | { type: 'ADD_LEARNED_SKILL'; payload: string }
  | { type: 'REMOVE_LEARNED_SKILL'; payload: string }
  | { type: 'TOGGLE_COMPLETED_RESOURCE'; payload: string }
  | { type: 'SET_INTERVIEW_SESSION'; payload: InterviewSession }
  | { type: 'SET_SKILL_GAP'; payload: SkillGapResult }
  | { type: 'SET_SECTION'; payload: SectionType }
  | { type: 'CLEAR_LEARNED_SKILLS' }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_STATE'; payload: ProgressState };

function progressReducer(state: ProgressState, action: Action): ProgressState {
  let newState: ProgressState;

  switch (action.type) {
    case 'SET_EXTRACTED_SKILLS':
      newState = { ...state, extractedSkills: action.payload };
      break;

    case 'ADD_QUIZ_ATTEMPT':
      newState = { ...state, quizHistory: [...state.quizHistory, action.payload] };
      break;

    case 'ADD_INTERVIEW_ATTEMPT':
      newState = { ...state, interviewHistory: [...state.interviewHistory, action.payload] };
      break;

    case 'ADD_LEARNED_SKILL':
      if (state.learnedSkills.includes(action.payload)) return state;
      newState = { ...state, learnedSkills: [...state.learnedSkills, action.payload] };
      break;

    case 'REMOVE_LEARNED_SKILL':
      newState = { ...state, learnedSkills: state.learnedSkills.filter(s => s !== action.payload) };
      break;

    case 'TOGGLE_COMPLETED_RESOURCE': {
      const exists = state.completedResources.includes(action.payload);
      const updated = exists
        ? state.completedResources.filter(id => id !== action.payload)
        : [...state.completedResources, action.payload];
      newState = { ...state, completedResources: updated };
      break;
    }

    case 'SET_INTERVIEW_SESSION':
      newState = { ...state, lastInterviewSession: action.payload };
      break;

    case 'SET_SKILL_GAP':
      newState = { ...state, lastSkillGapResult: action.payload };
      break;

    case 'SET_SECTION':
      newState = { ...state, currentSection: action.payload };
      break;

    case 'CLEAR_LEARNED_SKILLS':
      newState = { ...state, learnedSkills: [], completedResources: [] };
      break;

    case 'RESET_ALL':
      newState = initialState;
      break;

    case 'LOAD_STATE':
      newState = action.payload;
      break;

    default:
      return state;
  }

  newState.careerReadinessPercentage = calculateCareerReadiness(newState);
  return newState;
}

const ProgressContext = createContext<{
  progress: ProgressState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const activeEmail = user?.email;

  const [progress, dispatch] = useReducer(progressReducer, initialState, (defaultState) => {
    try {
      const savedKey = getStorageKey(activeEmail);
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.careerReadinessPercentage = calculateCareerReadiness(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn("Could not parse saved state:", e);
    }
    return defaultState;
  });

  // Re-sync progress state whenever active logged-in user changes (Account A vs Account B)
  useEffect(() => {
    try {
      const storageKey = getStorageKey(activeEmail);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.careerReadinessPercentage = calculateCareerReadiness(parsed);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } else {
        dispatch({ type: 'RESET_ALL' });
      }
    } catch (e) {
      dispatch({ type: 'RESET_ALL' });
    }
  }, [activeEmail]);

  // Persist current state to user-specific localStorage key
  useEffect(() => {
    try {
      const storageKey = getStorageKey(activeEmail);
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
      console.error("Save to localStorage failed:", e);
    }
  }, [progress, activeEmail]);

  return (
    <ProgressContext.Provider value={{ progress, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
