import React from 'react';
import { Button } from '../common/Button';
import { Mic, Square, ArrowRight, Award } from 'lucide-react';

interface InterviewControlsProps {
  isRecording: boolean;
  onToggleRecord: () => void;
  onNextQuestion: () => void;
  onFinishInterview: () => void;
  isLastQuestion: boolean;
}

export function InterviewControls({
  isRecording,
  onToggleRecord,
  onNextQuestion,
  onFinishInterview,
  isLastQuestion
}: InterviewControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <Button
        variant={isRecording ? 'danger' : 'primary'}
        onClick={onToggleRecord}
        className="w-full sm:w-auto"
        icon={isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      >
        {isRecording ? 'Stop Recording' : 'Start Answer Recording'}
      </Button>

      {isLastQuestion ? (
        <Button
          variant="success"
          onClick={onFinishInterview}
          className="w-full sm:w-auto"
          icon={<Award className="w-4 h-4" />}
        >
          ✅ Complete & Evaluate Interview
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={onNextQuestion}
          className="w-full sm:w-auto"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Next Question
        </Button>
      )}
    </div>
  );
}
