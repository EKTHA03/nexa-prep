import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getQuizQuestionsForRole, evaluateQuizSubmission } from '../services/quizEngine';
import { QuizQuestion } from '../types';

export interface QuizQuestionReviewItem {
  question: QuizQuestion;
  questionNumber: number;
  selectedOptionIndex: number | null;
  isTimeout: boolean;
  isCorrect: boolean;
  selectedText: string;
  correctText: string;
  explanation: string;
}

export function useQuiz(roleId: string) {
  const { dispatch } = useProgress();
  const questions = getQuizQuestionsForRole(roleId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [reviewItems, setReviewItems] = useState<QuizQuestionReviewItem[]>([]);

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex.toString()
    }));
  };

  const handleTimeUp = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    // If unanswered, mark as TIMEOUT
    const updatedAnswers = { ...userAnswers };
    if (updatedAnswers[currentQ.id] === undefined) {
      updatedAnswers[currentQ.id] = 'TIMEOUT';
      setUserAnswers(updatedAnswers);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitQuizWithAnswers(updatedAnswers);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const submitQuizWithAnswers = (answers: { [qId: string]: string }) => {
    const attempt = evaluateQuizSubmission(roleId, answers, questions);
    setLastScore(attempt.score);

    // Build comprehensive review breakdown for every question
    const reviews: QuizQuestionReviewItem[] = questions.map((q, idx) => {
      const ansVal = answers[q.id];
      const isTimeout = ansVal === 'TIMEOUT' || ansVal === undefined;
      const selectedIdx = !isTimeout ? Number(ansVal) : null;
      const isCorrect = selectedIdx !== null && selectedIdx === q.correctAnswer;
      const selectedText = isTimeout || selectedIdx === null
        ? 'No answer — time expired'
        : q.options[selectedIdx] ?? 'No answer';
      const correctText = q.options[q.correctAnswer] || '';

      return {
        question: q,
        questionNumber: idx + 1,
        selectedOptionIndex: selectedIdx,
        isTimeout,
        isCorrect,
        selectedText,
        correctText,
        explanation: q.explanation
      };
    });

    setReviewItems(reviews);
    setIsSubmitted(true);

    // Save attempt to global progress context
    dispatch({ type: 'ADD_QUIZ_ATTEMPT', payload: attempt });
  };

  const submitQuiz = () => {
    submitQuizWithAnswers(userAnswers);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setLastScore(null);
    setReviewItems([]);
  };

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    totalQuestions: questions.length,
    userAnswers,
    isSubmitted,
    lastScore,
    reviewItems,
    selectAnswer,
    handleTimeUp,
    nextQuestion,
    submitQuiz,
    resetQuiz
  };
}

