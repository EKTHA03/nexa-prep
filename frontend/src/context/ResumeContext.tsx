import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData } from '../types/resume';

interface ResumeContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, isAnalyzing, setIsAnalyzing }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
