import React, { useState } from 'react';
import { InterviewSetup } from '../components/interview/InterviewSetup';
import { LiveInterviewSession } from '../components/interview/LiveInterviewSession';

export function Interview() {
  const [started, setStarted] = useState(false);

  return started ? (
    <LiveInterviewSession />
  ) : (
    <InterviewSetup onStart={() => setStarted(true)} />
  );
}
