import React from 'react';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12 animate-fade-in-up">
      <h2 className="text-4xl font-black text-slate-100">404</h2>
      <p className="text-sm text-slate-400">Page not found in NEXA PREP journey.</p>
      <Button variant="primary" icon={<Home className="w-4 h-4" />} onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
}
