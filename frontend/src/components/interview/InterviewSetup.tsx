import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Mic, Video, ShieldCheck, Play } from 'lucide-react';

export function InterviewSetup({ onStart }: { onStart: () => void }) {
  const { selectedRole } = useApp();

  return (
    <div className="glass-card p-8 rounded-2xl border border-slate-800 max-w-2xl mx-auto text-center space-y-6 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
        <Mic className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-100">Voice Mock Interview Setup</h2>
        <p className="text-xs text-slate-400 mt-1">
          Simulate a real technical engineering interview for <span className="text-cyan-300 font-bold">{selectedRole}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <Video className="w-5 h-5 text-indigo-400 mb-1" />
          <h4 className="font-bold text-xs text-slate-200">5 Role Questions</h4>
          <p className="text-[11px] text-slate-400">Technical & behavioral questions tailored to role</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <Mic className="w-5 h-5 text-rose-400 mb-1" />
          <h4 className="font-bold text-xs text-slate-200">Real Emotion Tracking</h4>
          <p className="text-[11px] text-slate-400">Fix #8: Live webcam facial expression detection</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
          <h4 className="font-bold text-xs text-slate-200">AI Evaluation Report</h4>
          <p className="text-[11px] text-slate-400">Detailed metric breakdown & model answers</p>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onStart}
        className="w-full sm:w-auto px-8"
        icon={<Play className="w-5 h-5 fill-current" />}
      >
        Start Live Interview Session
      </Button>
    </div>
  );
}
