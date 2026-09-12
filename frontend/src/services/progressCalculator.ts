import { ProgressState } from '../types';

export function calculateCareerReadiness(progress: ProgressState): number {
  const hasQuiz = (progress.quizHistory?.length ?? 0) > 0;
  const hasInterview = (progress.interviewHistory?.length ?? 0) > 0;
  const hasLearned = (progress.learnedSkills?.length ?? 0) > 0;

  // FIX #1: Strictly 0% when no user data exists - NO fake/placeholder value
  if (!hasQuiz && !hasInterview && !hasLearned) return 0;

  let totalWeightedScore = 0;
  let totalWeights = 0;

  if (hasQuiz) {
    const avgQuizScore = progress.quizHistory.reduce((acc, q) => acc + q.score, 0) / progress.quizHistory.length;
    totalWeightedScore += avgQuizScore * 0.40;
    totalWeights += 0.40;
  }

  if (hasInterview) {
    const avgInterviewScore = progress.interviewHistory.reduce((acc, i) => acc + i.score, 0) / progress.interviewHistory.length;
    totalWeightedScore += avgInterviewScore * 0.35;
    totalWeights += 0.35;
  }

  if (hasLearned) {
    const totalExtracted = progress.extractedSkills?.length || 1;
    const learnedRatio = Math.min(1, progress.learnedSkills.length / totalExtracted);
    const learnedPercentage = learnedRatio * 100;
    totalWeightedScore += learnedPercentage * 0.25;
    totalWeights += 0.25;
  }

  return totalWeights > 0 ? Math.round(totalWeightedScore / totalWeights) : 0;
}

export function getSectionCompletionStats(progress: ProgressState) {
  return {
    resumeDone: (progress.extractedSkills?.length ?? 0) > 0,
    skillsDone: (progress.extractedSkills?.length ?? 0) > 0,
    learningDone: (progress.learnedSkills?.length ?? 0) > 0,
    quizDone: (progress.quizHistory?.length ?? 0) > 0,
    interviewDone: (progress.interviewHistory?.length ?? 0) > 0,
    performanceDone: !!progress.lastInterviewSession,
    jobsDone: (progress.quizHistory?.length ?? 0) > 0 || (progress.interviewHistory?.length ?? 0) > 0
  };
}
