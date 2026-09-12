import { QuizAttempt, QuizQuestion } from '../types';
import { getQuestionsForRole } from '../config/mockData';

export function getQuizQuestionsForRole(roleId: string): QuizQuestion[] {
  return getQuestionsForRole(roleId);
}

export function evaluateQuizSubmission(
  roleId: string,
  userAnswers: { [questionId: string]: string },
  questions: QuizQuestion[]
): QuizAttempt {
  let correctCount = 0;

  for (const q of questions) {
    const selectedIdx = userAnswers[q.id];
    if (selectedIdx !== undefined && Number(selectedIdx) === q.correctAnswer) {
      correctCount++;
    }
  }

  const scorePercentage = questions.length > 0 
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  return {
    date: new Date(),
    jobRole: roleId,
    score: scorePercentage,
    answers: userAnswers,
    submittedAt: new Date(),
    totalQuestions: questions.length,
    correctAnswers: correctCount
  };
}
