export function getSkillTagColor(skillName: string): { bg: string; text: string; border: string } {
  const lower = skillName.toLowerCase();
  
  if (lower.includes('react') || lower.includes('javascript') || lower.includes('typescript')) {
    return { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' };
  }
  if (lower.includes('python') || lower.includes('machine learning') || lower.includes('tensorflow')) {
    return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' };
  }
  if (lower.includes('sql') || lower.includes('node') || lower.includes('api')) {
    return { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' };
  }
  if (lower.includes('aws') || lower.includes('docker') || lower.includes('linux')) {
    return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' };
  }
  
  return { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' };
}

export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  if (score >= 60) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
  return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
}
