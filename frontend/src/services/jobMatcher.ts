import { JobRole, ProgressState } from '../types';
import { JOB_REQUIREMENTS } from '../config/jobRequirements';
import { compareSkillsForRole } from './skillMatcher';

export function getRankedJobRecommendations(progress: ProgressState): JobRole[] {
  const extractedSkills = progress.extractedSkills || [];

  // Average quiz score across history
  const quizAvg = progress.quizHistory && progress.quizHistory.length > 0
    ? progress.quizHistory.reduce((acc, q) => acc + q.score, 0) / progress.quizHistory.length
    : 0;

  // Average interview score across history
  const interviewAvg = progress.interviewHistory && progress.interviewHistory.length > 0
    ? progress.interviewHistory.reduce((acc, i) => acc + i.score, 0) / progress.interviewHistory.length
    : 0;

  const scoredRoles: JobRole[] = JOB_REQUIREMENTS.map(roleReq => {
    // Skill match score 0-100
    const skillComparison = compareSkillsForRole(roleReq.id, extractedSkills);
    const skillMatchScore = skillComparison.matchPercentage;

    // Formula from spec: overallMatch = skills*0.4 + quizScore*0.3 + interviewScore*0.3
    let overallMatch = (skillMatchScore * 0.40);
    
    if (progress.quizHistory.length > 0) {
      overallMatch += (quizAvg * 0.30);
    } else {
      // If quiz not taken yet, scale skill match weight appropriately
      overallMatch += (skillMatchScore * 0.30);
    }

    if (progress.interviewHistory.length > 0) {
      overallMatch += (interviewAvg * 0.30);
    } else {
      // If interview not taken yet, scale skill match weight appropriately
      overallMatch += (skillMatchScore * 0.30);
    }

    const matchPercentage = Math.min(95, Math.max(15, Math.round(overallMatch)));

    return {
      id: roleReq.id,
      name: roleReq.title,
      matchPercentage,
      requiredSkills: roleReq.requiredSkills,
      description: roleReq.description,
      experienceLevel: roleReq.experienceLevel,
      salaryRange: roleReq.salaryRange,
      linkedinUrl: roleReq.linkedinUrl,
      naukriUrl: roleReq.naukriUrl,
      internshalaUrl: roleReq.internshalaUrl
    };
  });

  // Sort descending by match percentage
  scoredRoles.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return scoredRoles;
}
