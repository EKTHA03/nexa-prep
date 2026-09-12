import { useProgress } from '../context/ProgressContext';
import { compareSkillsForRole } from '../services/skillMatcher';

export function useSkills(roleId: string) {
  const { progress, dispatch } = useProgress();
  
  // Single source of truth: compare extracted resume skills + learned skills against target role
  const skillComparison = compareSkillsForRole(roleId, progress.extractedSkills, progress.learnedSkills);

  const markSkillLearned = (skillName: string) => {
    dispatch({ type: 'ADD_LEARNED_SKILL', payload: skillName });
  };

  const removeLearnedSkill = (skillName: string) => {
    dispatch({ type: 'REMOVE_LEARNED_SKILL', payload: skillName });
  };

  return {
    skillComparison,
    extractedSkills: progress.extractedSkills,
    learnedSkills: progress.learnedSkills,
    markSkillLearned,
    removeLearnedSkill
  };
}
