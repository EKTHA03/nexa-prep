import { JOB_REQUIREMENTS, JobRequirement } from './jobRequirements';

export const TARGET_JOB_ROLES = [
  "Software Engineer",
  "Data Analyst",
  "Machine Learning Engineer",
  "Robotics Engineer",
  "Web Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Embedded Systems Engineer",
  "Mechanical Engineer",
  "AI Engineer",
  "Civil Engineer",
  "Electrical Engineer",
  "IoT Engineer"
];

export const JOB_ROLES = JOB_REQUIREMENTS;

export function getJobRoleById(idOrTitle: string): JobRequirement | undefined {
  if (!idOrTitle) return JOB_REQUIREMENTS[0];

  const search = idOrTitle.toLowerCase().trim();

  return JOB_REQUIREMENTS.find(
    (role) =>
      role.id.toLowerCase() === search ||
      role.title.toLowerCase() === search ||
      role.title.toLowerCase().includes(search) ||
      search.includes(role.id.toLowerCase())
  ) || JOB_REQUIREMENTS[0];
}
