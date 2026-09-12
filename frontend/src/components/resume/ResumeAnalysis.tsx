import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { ResumeUpload } from './ResumeUpload';
import { SkillExtractor } from './SkillExtractor';
import { SkillDeduplicator } from './SkillDeduplicator';
import { Button } from '../common/Button';
import { ArrowRight, FileCheck } from 'lucide-react';
import { StepNavigation } from '../common/StepNavigation';

export function ResumeAnalysis() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            📄 Resume Upload & Skill Extraction
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload your engineering PDF resume. Our AI parser extracts technical skills and normalizes terminology.
          </p>
        </div>

        {progress.extractedSkills.length > 0 && (
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/skills')}
          >
            Next: Skill Gap Analysis
          </Button>
        )}
      </div>

      <ResumeUpload />

      {progress.extractedSkills.length > 0 && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3 text-indigo-300 text-xs">
            <FileCheck className="w-5 h-5 shrink-0" />
            <span>
              Successfully extracted {progress.extractedSkills.length} technical skills! These are now set as your single source of truth across all features.
            </span>
          </div>

          <SkillExtractor skills={progress.extractedSkills} />
          {import.meta.env.DEV && <SkillDeduplicator />}
        </div>
      )}

      <StepNavigation currentPath="/resume" />
    </div>
  );
}
