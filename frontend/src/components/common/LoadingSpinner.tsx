import React from 'react';

export function LoadingSpinner({ label = 'Processing...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-300 animate-pulse">{label}</p>
    </div>
  );
}
