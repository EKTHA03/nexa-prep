import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useQuiz } from '../../hooks/useQuiz';
import { QuestionCard } from './QuestionCard';
import { NavigationButtons } from './NavigationButtons';
import { QuizResults } from './QuizResults';
import { QuizRules } from './QuizRules';
import { StepNavigation } from '../common/StepNavigation';

export function QuizContainer() {
  const { selectedRole } = useApp();
  const [hasStarted, setHasStarted] = useState(false);

  const {
    questions,
    currentIndex,
    currentQuestion,
    totalQuestions,
    userAnswers,
    isSubmitted,
    lastScore,
    reviewItems,
    selectAnswer,
    handleTimeUp,
    nextQuestion,
    submitQuiz,
    resetQuiz
  } = useQuiz(selectedRole);

  const handleRetake = () => {
    resetQuiz();
    setHasStarted(false);
  };

  const rawAns = userAnswers[currentQuestion?.id];
  const selectedIdx = rawAns !== undefined && rawAns !== 'TIMEOUT'
    ? Number(rawAns)
    : undefined;

  const isAnswered = selectedIdx !== undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
          🧠 Timed MCQ Skill Assessment
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {totalQuestions} questions • Strictly 30 seconds per question with automatic submission on timeout.
        </p>
      </div>

      {!hasStarted && !isSubmitted ? (
        <QuizRules
          roleName={selectedRole.replace(/-/g, ' ')}
          totalQuestions={totalQuestions}
          timePerQuestion={30}
          onStartQuiz={() => setHasStarted(true)}
        />
      ) : !isSubmitted ? (
        <div className="space-y-6">
          <QuestionCard
            key={currentQuestion?.id || currentIndex}
            question={currentQuestion}
            questionIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedOption={selectedIdx}
            onSelectOption={(idx) => selectAnswer(currentQuestion.id, idx)}
            onTimeUp={handleTimeUp}
          />

          <NavigationButtons
            currentQuestion={currentIndex}
            totalQuestions={totalQuestions}
            isAnswered={isAnswered}
            onNext={nextQuestion}
            onSubmit={submitQuiz}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <QuizResults
            score={lastScore || 0}
            totalQuestions={totalQuestions}
            reviewItems={reviewItems}
            onRetake={handleRetake}
          />
        </div>
      )}

      <StepNavigation currentPath="/quiz" />
    </div>
  );
}
