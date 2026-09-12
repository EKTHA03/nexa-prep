import React from 'react';
import { Award, Zap, Brain, MessageSquare, ShieldCheck } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface InterviewScoreProps {
  score: number;
  metrics: {
    communication: number;
    technical: number;
    problemSolving: number;
    confidence: number;
  };
}

export function InterviewScore({ score, metrics }: InterviewScoreProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Overall Score */}
      <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Overall Interview Performance</span>
          <div className="text-4xl font-black font-mono text-slate-100 mt-1">{score}/100</div>
        </div>
      </div>

      {/* 4 Performance Metrics */}
      <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">4 Key Competency Metrics (out of 10)</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Communication</span>
              <span className="font-mono text-indigo-300">{metrics.communication}/10</span>
            </div>
            <ProgressBar progress={metrics.communication * 10} color="primary" height="h-2" showPercentage={false} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-400" /> Technical Accuracy</span>
              <span className="font-mono text-emerald-300">{metrics.technical}/10</span>
            </div>
            <ProgressBar progress={metrics.technical * 10} color="success" height="h-2" showPercentage={false} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-amber-400" /> Problem Solving</span>
              <span className="font-mono text-amber-300">{metrics.problemSolving}/10</span>
            </div>
            <ProgressBar progress={metrics.problemSolving * 10} color="warning" height="h-2" showPercentage={false} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Confidence</span>
              <span className="font-mono text-cyan-300">{metrics.confidence}/10</span>
            </div>
            <ProgressBar progress={metrics.confidence * 10} color="info" height="h-2" showPercentage={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
