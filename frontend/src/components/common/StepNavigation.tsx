import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ArrowRight, Home } from 'lucide-react';

export interface StepInfo {
  path: string;
  label: string;
  stepNumber: number;
}

export const JOURNEY_STEPS: StepInfo[] = [
  { path: '/resume', label: 'Upload Resume', stepNumber: 1 },
  { path: '/skills', label: 'Skill Gap Analysis', stepNumber: 2 },
  { path: '/learning', label: 'Personalized Learning Plan', stepNumber: 3 },
  { path: '/quiz', label: 'Timed Skill Assessment', stepNumber: 4 },
  { path: '/interview', label: 'AI Voice Mock Interview', stepNumber: 5 },
  { path: '/performance', label: 'Performance Review', stepNumber: 6 },
  { path: '/jobs', label: 'Job Recommendations', stepNumber: 7 },
  { path: '/progress', label: 'Career Preparation Progress', stepNumber: 8 },
];

interface StepNavigationProps {
  currentPath: string;
}

export function StepNavigation({ currentPath }: StepNavigationProps) {
  const navigate = useNavigate();

  const currentIndex = JOURNEY_STEPS.findIndex(s => s.path === currentPath);
  if (currentIndex === -1) return null;

  const currentStep = JOURNEY_STEPS[currentIndex];
  const nextStep = currentIndex < JOURNEY_STEPS.length - 1 ? JOURNEY_STEPS[currentIndex + 1] : null;

  return (
    <div className="w-full pt-8 pb-4 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
      <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span>
          Step {currentStep.stepNumber} of 8: <strong className="text-slate-200">{currentStep.label}</strong>
        </span>
      </div>

      <div>
        {nextStep ? (
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate(nextStep.path)}
            className="shadow-lg shadow-indigo-500/20"
          >
            Next: {nextStep.label}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
