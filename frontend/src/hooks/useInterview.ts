import { useState, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getInterviewQuestionsForRole } from '../config/mockData';
import { analyzeInterviewSession } from '../services/interviewAnalyzer';
import { EmotionEntry } from '../types';

// ─── Adaptive Interview State Machine ────────────────────────────────────────
//
// Phase 1 (INITIAL): Always ask exactly 5 questions.
// Checkpoint after Q5 — evaluate correctSoFar:
//   5/5 correct  → targetTotal = 10
//   4/5 correct  → targetTotal =  8
//   3/5 correct  → targetTotal =  6
//   0–2 correct  → targetTotal =  5 (stop, no extension)
//
// Phase 2 (EXTENDED): Continue until questionsAnswered === targetTotal.
// Phase 3 (COMPLETE): Show final score as "correctSoFar / targetTotal".
// ─────────────────────────────────────────────────────────────────────────────

type InterviewPhase = 'initial' | 'extended' | 'complete';

interface InterviewStateMachine {
  questionsAnswered: number;    // how many questions have been answered so far
  correctSoFar: number;         // correct answers accumulated
  targetTotal: number;          // max questions for this session (set at checkpoint)
  phase: InterviewPhase;
}

function computeTargetTotal(correctAt5: number): number {
  if (correctAt5 >= 5) return 10;
  if (correctAt5 === 4) return 8;
  if (correctAt5 === 3) return 6;
  return 5; // 0–2 correct: no extension
}

export function useInterview(roleId: string) {
  const { dispatch } = useProgress();
  const allQuestions = getInterviewQuestionsForRole(roleId);

  const [sm, setSm] = useState<InterviewStateMachine>({
    questionsAnswered: 0,
    correctSoFar: 0,
    targetTotal: 10, // will be refined at Q5 checkpoint
    phase: 'initial',
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcripts, setTranscripts] = useState<{ [qId: string]: string }>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Determine effective question list (capped at targetTotal)
  const questions = allQuestions.slice(0, sm.targetTotal);
  const currentQuestion = questions[currentIndex] || questions[0] || allQuestions[0] || {
    id: `${roleId || 'default'}-q1`,
    roleId: roleId || 'software-engineer',
    question: `What core architecture patterns do you follow when building scalable software for a ${roleId || 'software engineer'} position?`,
    category: 'technical' as const,
    idealKeywords: ['architecture', 'scalability', 'modularity', 'clean code', 'testing'],
    sampleModelAnswer: 'I prioritize clean architecture principles, modular component isolation, continuous integration pipelines, and automated test coverage.'
  };

  const setQuestionTranscript = (qId: string, text: string) => {
    setTranscripts(prev => ({ ...prev, [qId]: text }));
  };

  // Mark the current answer and advance the state machine
  const answerAndAdvance = useCallback((wasCorrect: boolean) => {
    setSm(prev => {
      const newAnswered = prev.questionsAnswered + 1;
      const newCorrect = prev.correctSoFar + (wasCorrect ? 1 : 0);

      // ── Checkpoint: after the 5th question, set targetTotal ──
      if (newAnswered === 5 && prev.phase === 'initial') {
        const newTarget = computeTargetTotal(newCorrect);
        const newPhase: InterviewPhase = newTarget > 5 ? 'extended' : 'complete';
        return {
          questionsAnswered: newAnswered,
          correctSoFar: newCorrect,
          targetTotal: newTarget,
          phase: newPhase,
        };
      }

      // ── Complete when we've reached targetTotal ──
      if (newAnswered >= prev.targetTotal) {
        return { ...prev, questionsAnswered: newAnswered, correctSoFar: newCorrect, phase: 'complete' };
      }

      return { ...prev, questionsAnswered: newAnswered, correctSoFar: newCorrect };
    });
  }, []);

  const nextQuestion = useCallback((wasCorrect?: boolean) => {
    // Record correctness if provided (for adaptive logic)
    if (wasCorrect !== undefined) {
      answerAndAdvance(wasCorrect);
    }

    setCurrentIndex(prev => {
      if (prev < allQuestions.length - 1) return prev + 1;
      return prev;
    });
  }, [answerAndAdvance, allQuestions.length]);

  const completeInterviewSession = (emotionLog: EmotionEntry[]) => {
    const { session, attempt } = analyzeInterviewSession(roleId, transcripts, emotionLog);

    // Inject adaptive score into session for accurate display
    const adaptiveSession = {
      ...session,
      adaptiveScore: `${sm.correctSoFar}/${sm.questionsAnswered}`,
      questionsAsked: sm.questionsAnswered,
      correctCount: sm.correctSoFar,
    };

    dispatch({ type: 'ADD_INTERVIEW_ATTEMPT', payload: attempt });
    dispatch({ type: 'SET_INTERVIEW_SESSION', payload: adaptiveSession });

    setIsCompleted(true);
    return adaptiveSession;
  };

  return {
    questions,
    currentIndex,
    currentQuestion,
    totalQuestions: sm.targetTotal,   // dynamic total (shown in UI as "Q3 / 8")
    transcripts,
    isRecording,
    setIsRecording,
    isCompleted,
    setQuestionTranscript,
    nextQuestion,
    answerAndAdvance,
    completeInterviewSession,
    // State machine info for UI
    sm,
    isAtCheckpoint: sm.questionsAnswered === 5 && sm.phase === 'initial',
    isExtended: sm.phase === 'extended',
    scoreLabel: `${sm.correctSoFar}/${sm.questionsAnswered}`,
  };
}
