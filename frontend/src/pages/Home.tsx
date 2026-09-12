import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { 
  CheckSquare, 
  Mic, 
  Target, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Award,
  Zap
} from 'lucide-react';

export function Home() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setSelectedRole(role);
    if (role) {
      navigate('/skills');
    }
  };

  const quizAvg = progress.quizHistory.length > 0
    ? Math.round(progress.quizHistory.reduce((s, q) => s + q.score, 0) / progress.quizHistory.length)
    : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 animate-fade-in-up">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/60 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Hello, {user?.name || 'Candidate'}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Here's your personalized career preparation overview.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shrink-0">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>Candidate System Active</span>
        </div>
      </div>

      {/* Tip of the Day Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 flex items-center gap-3 text-xs text-slate-200 font-medium shadow-lg">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
        <div>
          <span className="font-bold text-cyan-300">Tip of the Day:</span> Practice coding problems daily — consistency beats cramming.
        </div>
      </div>

      {/* 4 Dynamic Stat Metric Cards (Issue 1 Fix) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quizzes */}
        <div 
          onClick={() => navigate('/progress')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/20 shadow-xl flex items-center gap-4 hover:border-blue-500/50 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">{progress.quizHistory.length}</span>
            <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Quizzes Done</p>
          </div>
        </div>

        {/* Interviews */}
        <div 
          onClick={() => navigate('/progress')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-purple-500/20 shadow-xl flex items-center gap-4 hover:border-purple-500/50 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Mic className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">{progress.interviewHistory.length}</span>
            <p className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Interviews</p>
          </div>
        </div>

        {/* Skills Found */}
        <div 
          onClick={() => navigate('/skills')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/20 shadow-xl flex items-center gap-4 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">{progress.extractedSkills.length}</span>
            <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">Skills Found</p>
          </div>
        </div>

        {/* Readiness */}
        <div 
          onClick={() => navigate('/progress')}
          className="bg-slate-900/80 p-5 rounded-2xl border border-amber-500/20 shadow-xl flex items-center gap-4 hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">{progress.careerReadinessPercentage}%</span>
            <p className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Readiness</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Quiz Performance + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quiz Performance */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Quiz Performance Analytics
          </h2>
          {progress.quizHistory.length > 0 ? (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Average Score</span>
                <span className="font-mono font-black text-cyan-400 text-lg">{quizAvg}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${quizAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {progress.quizHistory.length} quiz attempt(s) recorded in database.
              </p>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-500 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
              Take a quiz to see your score analytics here.
            </div>
          )}
        </div>

        {/* Right: Quick Actions */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <button
              onClick={() => navigate('/resume')}
              className="p-4 rounded-2xl bg-slate-950 hover:bg-blue-600/10 border border-slate-800 hover:border-blue-500/50 flex items-center gap-3 transition-all text-slate-200 hover:text-blue-400"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={() => navigate('/quiz')}
              className="p-4 rounded-2xl bg-slate-950 hover:bg-amber-600/10 border border-slate-800 hover:border-amber-500/50 flex items-center gap-3 transition-all text-slate-200 hover:text-amber-400"
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>Take Quiz</span>
            </button>

            <button
              onClick={() => navigate('/interview')}
              className="p-4 rounded-2xl bg-slate-950 hover:bg-rose-600/10 border border-slate-800 hover:border-rose-500/50 flex items-center gap-3 transition-all text-slate-200 hover:text-rose-400"
            >
              <Mic className="w-4 h-4 text-rose-400" />
              <span>Mock Interview</span>
            </button>

            <button
              onClick={() => navigate('/jobs')}
              className="p-4 rounded-2xl bg-slate-950 hover:bg-purple-600/10 border border-slate-800 hover:border-purple-500/50 flex items-center gap-3 transition-all text-slate-200 hover:text-purple-400"
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Job Matches</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis Preview */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Skill Gap Analysis</h2>
          <p className="text-xs text-slate-400">Select a target role to see how your skills match up.</p>
        </div>

        <div className="max-w-md space-y-2">
          <label className="text-xs font-bold text-slate-300 block">Target Job Role</label>
          <select
            value={selectedRole}
            onChange={handleRoleSelect}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select a role...</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="Robotics Engineer">Robotics Engineer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Embedded Systems Engineer">Embedded Systems Engineer</option>
            <option value="Mechanical Engineer">Mechanical Engineer</option>
            <option value="AI Engineer">AI Engineer</option>
            <option value="Civil Engineer">Civil Engineer</option>
            <option value="Electrical Engineer">Electrical Engineer</option>
            <option value="IoT Engineer">IoT Engineer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Home;
