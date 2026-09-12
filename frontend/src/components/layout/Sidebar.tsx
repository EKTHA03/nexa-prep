import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  BookOpen, 
  CheckSquare, 
  Mic, 
  Briefcase, 
  TrendingUp, 
  LogOut
} from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-400' },
    { to: '/resume', label: 'Upload Resume', icon: FileText, color: 'text-blue-400' },
    { to: '/skills', label: 'Skill Gap', icon: Target, color: 'text-purple-400' },
    { to: '/learning', label: 'Learning Plan', icon: BookOpen, color: 'text-teal-400' },
    { to: '/quiz', label: 'Skill Quiz', icon: CheckSquare, color: 'text-amber-400' },
    { to: '/interview', label: 'Mock Interview', icon: Mic, color: 'text-rose-400' },
    { to: '/jobs', label: 'Job Matches', icon: Briefcase, color: 'text-indigo-400' },
    { to: '/progress', label: 'Progress', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800/80 min-h-screen shadow-2xl shadow-indigo-950/30">
      <div className="space-y-6">
        {/* Official NEXA PREP AI Logo & Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-lg p-0.5 shrink-0 flex items-center justify-center">
            <img 
              src="/nexa_logo.jpg" 
              alt="NexaPrep AI Official Logo" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              NexaPrep <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider -mt-0.5">
              Virtual Assistant
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white truncate">{user?.name || 'Ektha'}</span>
            <span className="text-[10px] text-slate-400 truncate">{user?.email || 'ektham123@gmail.com'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all text-xs font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
