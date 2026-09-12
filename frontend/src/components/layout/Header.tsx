import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { useApp } from '../../context/AppContext';
import { Menu, Moon, Sun, Award } from 'lucide-react';
import { APP_NAME } from '../../config/constants';

export function Header() {
  const { progress } = useProgress();
  const { isSidebarOpen, setSidebarOpen, theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-lg p-0.5 shrink-0 flex items-center justify-center">
            <img 
              src="/nexa_logo.jpg" 
              alt="NexaPrep AI Official Logo" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight gradient-text leading-none">{APP_NAME}</h1>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">AI Career Preparation & Simulation</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Career Readiness Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold">
          <Award className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400 hidden sm:inline">Readiness:</span>
          <span className="font-mono text-indigo-300 font-bold">{progress.careerReadinessPercentage}%</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
}
