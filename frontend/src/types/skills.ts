export interface SkillCategoryData {
  category: string;
  skills: string[];
}

export interface JobRequirementConfig {
  roleId: string;
  roleName: string;
  requiredSkills: string[];
  description: string;
}
