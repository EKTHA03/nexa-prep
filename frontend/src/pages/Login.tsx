import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Eye, EyeOff, ArrowRight, UserPlus, LogIn, ShieldCheck, Zap } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isRegister) {
      register(name || 'Ektha', email || 'ektham123@gmail.com');
    } else {
      login(name || 'Ektha', email || 'ektham123@gmail.com');
    }

    navigate('/');
  };

  const handleDemoLogin = () => {
    login('Ektha', 'ektham123@gmail.com');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Vibrant Color Meshes */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-indigo-950/50 space-y-6 relative z-10">
        {/* Top Logo */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-0.5 shadow-xl shadow-indigo-500/30 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            NexaPrep <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Development of AI Based Intelligent System for Personalized Career Preparation and Mock Interview Simulation System
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              !isRegister
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isRegister
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {isRegister && (
            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-xs"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-slate-300 font-bold">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-bold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or Demo Access</span>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign In as Ektha (ektham123@gmail.com)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
