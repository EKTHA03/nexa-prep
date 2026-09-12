import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
        glow ? 'border-indigo-500/40 shadow-indigo-500/10 shadow-xl' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
