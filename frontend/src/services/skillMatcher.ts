import { SkillGapResult } from '../types';
import { getJobRoleById } from '../config/jobRoles';
import { deduplicateSkills } from '../utils/deduplicate';
import { SKILL_PHRASE_DICTIONARY } from './resumeParser';

export function normalizeSkill(s: string): string {
  if (!s) return '';
  return s
    .toLowerCase()
    .trim()
    .replace(/[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219]/g, '')
    .replace(/\s+/g, ' ');
}

function cleanAlphanumeric(s: string): string {
  return normalizeSkill(s).replace(/[^a-z0-9]/g, '');
}

// Semantic relationships: child skills/frameworks that demonstrate mastery of a required competency
const SEMANTIC_EQUIVALENCES: { [reqSkill: string]: string[] } = {
  'SQL': ['PostgreSQL', 'MySQL', 'SQLite', 'BigQuery', 'SQL'],
  'Python': ['Python', 'FastAPI', 'Django', 'Flask', 'Pandas', 'NumPy', 'PyTorch', 'TensorFlow', 'Scikit-Learn'],
  'Java': ['Java', 'Spring Boot'],
  'React': ['React', 'Next.js'],
  'Machine Learning': ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Transformers'],
  'Deep Learning': ['Deep Learning', 'PyTorch', 'TensorFlow', 'Transformers', 'Computer Vision', 'NLP', 'LLMs'],
  'REST API': ['REST API', 'FastAPI', 'Express', 'Django', 'Spring Boot'],
  'CI/CD': ['CI/CD', 'Git', 'Docker'],
  'Git': ['Git'],
  'Cloud Architecture': ['AWS', 'Azure', 'GCP'],
  'Microcontrollers': ['Microcontrollers', 'Arduino', 'Raspberry Pi', 'Embedded C'],
  'CAD': ['AutoCAD', 'SolidWorks', 'CAD', 'Revit'],
};

/**
 * Checks if a candidate skill string matches a required skill using:
 * 1. Exact string match (case-insensitive)
 * 2. Clean alphanumeric representation (e.g. 'c++' -> 'cpp', 'node.js' -> 'nodejs')
 * 3. Direct canonical dictionary aliases strictly for the target skill
 * 4. Semantic equivalence & framework implication
 */
export function isSkillMatched(reqSkill: string, candSkill: string): boolean {
  const reqNorm = normalizeSkill(reqSkill);
  const candNorm = normalizeSkill(candSkill);

  if (!reqNorm || !candNorm) return false;

  // 1. Exact normalized match
  if (reqNorm === candNorm) return true;

  // 2. Alphanumeric stripped match (e.g. 'c++' -> 'cpp'/'cplusplus', 'node.js' -> 'nodejs')
  const reqClean = cleanAlphanumeric(reqSkill);
  const candClean = cleanAlphanumeric(candSkill);
  if (reqClean && candClean && reqClean === candClean) return true;

  // 3. Direct alias check for reqSkill
  const reqAliases = SKILL_PHRASE_DICTIONARY[reqSkill] || [];
  const normalizedReqAliases = reqAliases.map(a => normalizeSkill(a));
  const cleanedReqAliases = reqAliases.map(a => cleanAlphanumeric(a));

  if (
    normalizedReqAliases.includes(candNorm) ||
    cleanedReqAliases.includes(candClean)
  ) {
    return true;
  }

  // 4. Direct alias check for candSkill
  const candAliases = SKILL_PHRASE_DICTIONARY[candSkill] || [];
  const normalizedCandAliases = candAliases.map(a => normalizeSkill(a));
  const cleanedCandAliases = candAliases.map(a => cleanAlphanumeric(a));

  if (
    normalizedCandAliases.includes(reqNorm) ||
    cleanedCandAliases.includes(reqClean)
  ) {
    return true;
  }

  // 5. Semantic Equivalence Check
  const eqList = SEMANTIC_EQUIVALENCES[reqSkill];
  if (eqList && eqList.some(eq => normalizeSkill(eq) === candNorm || cleanAlphanumeric(eq) === candClean)) {
    return true;
  }

  return false;
}

export function compareSkillsForRole(
  roleId: string, 
  extractedSkills: string[], 
  learnedSkills: string[] = []
): SkillGapResult {
  const role = getJobRoleById(roleId);
  const requiredSkills = role ? role.requiredSkills : ['Data Structures & Algorithms', 'System Design', 'Java', 'Python', 'SQL', 'Git', 'OOP', 'REST API'];
  
  const rawSkills = extractedSkills || [];
  const combinedPool = [...rawSkills, ...(learnedSkills || [])];
  const canonicalExtracted = deduplicateSkills(combinedPool);
  
  const fullyMatched: string[] = [];
  const partiallyMatched: string[] = [];
  const gaps: string[] = [];

  for (const reqSkill of requiredSkills) {
    let matched = false;

    for (const candSkill of canonicalExtracted) {
      if (isSkillMatched(reqSkill, candSkill)) {
        fullyMatched.push(reqSkill);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const reqNorm = normalizeSkill(reqSkill);
      const isPartial = canonicalExtracted.some(cand => {
        const candNorm = normalizeSkill(cand);
        if (candNorm.length < 4 || reqNorm.length < 4) return false;
        // Exclude specific language sub-word collisions (e.g. Java in JavaScript)
        if ((reqNorm === 'java' && candNorm.includes('javascript')) || (candNorm === 'java' && reqNorm.includes('javascript'))) {
          return false;
        }
        if ((reqNorm === 'c' || reqNorm === 'r') && candNorm !== reqNorm) {
          return false;
        }
        // Strict guard against unrelated false-positive partial matches
        if (reqNorm === 'statistics' || candNorm === 'statistics') return false;
        if (reqNorm === 'llms' || candNorm === 'llms') return false;

        return candNorm.includes(reqNorm) || reqNorm.includes(candNorm);
      });

      if (isPartial) {
        partiallyMatched.push(reqSkill);
      } else {
        gaps.push(reqSkill);
      }
    }
  }

  const totalRequired = requiredSkills.length;
  const matchPercentage = totalRequired > 0 
    ? Math.min(100, Math.round(((fullyMatched.length + (0.5 * partiallyMatched.length)) / totalRequired) * 100))
    : 0;

  return {
    jobRole: role ? role.title : 'Software Engineer',
    requiredSkills,
    extractedSkills: deduplicateSkills(rawSkills),
    fullyMatched,
    partiallyMatched,
    gaps,
    matchPercentage
  };
}
