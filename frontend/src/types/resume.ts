export interface ResumeData {
  fileName: string;
  fileSize: number;
  extractedText: string;
  rawSkills: string[];
  deduplicatedSkills: string[];
  uploadDate: string;
}

export interface SkillDeduplicationMap {
  [standardName: string]: string[];
}
