// Automated test suite for false-positive skill matching prevention
const fs = require('fs');
const assert = require('assert');

// Simple mock/standalone test runner for Node environment
function normalizeSkill(s) {
  if (!s) return '';
  return s.toLowerCase().trim().replace(/[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219]/g, '').replace(/\s+/g, ' ');
}

function cleanAlphanumeric(s) {
  return normalizeSkill(s).replace(/[^a-z0-9]/g, '');
}

const SKILL_PHRASE_DICTIONARY = {
  'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 't-sql'],
  'Python': ['python', 'py', 'python3'],
  'Machine Learning': ['machine learning', 'ml', 'machine-learning'],
  'Statistics': ['statistics', 'stats', 'statistical analysis', 'probability and statistics'],
  'Generative AI': ['generative ai', 'gen ai', 'genai'],
  'LLMs': ['llm', 'llms', 'large language model', 'large language models'],
  'PyTorch': ['pytorch', 'torch'],
  'Node.js': ['node.js', 'nodejs', 'node js', 'node'],
  'C++': ['c++', 'cpp', 'c plus plus', 'cplusplus'],
};

function extractSkillsFromText(resumeText) {
  if (!resumeText) return [];
  const lowerText = ` ${resumeText.toLowerCase()} `;
  const found = new Set();

  for (const [canonical, aliases] of Object.entries(SKILL_PHRASE_DICTIONARY)) {
    for (const alias of aliases) {
      const trimmedAlias = alias.trim().toLowerCase();
      if (!trimmedAlias) continue;

      const escaped = trimmedAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:^|[^a-z0-9+#])${escaped}(?:$|[^a-z0-9+#])`, 'i');

      if (pattern.test(lowerText) || lowerText.includes(` ${trimmedAlias} `)) {
        found.add(canonical);
        break;
      }
    }
  }

  return Array.from(found);
}

function isSkillMatched(reqSkill, candSkill) {
  const reqNorm = normalizeSkill(reqSkill);
  const candNorm = normalizeSkill(candSkill);

  if (!reqNorm || !candNorm) return false;
  if (reqNorm === candNorm) return true;

  const reqClean = cleanAlphanumeric(reqSkill);
  const candClean = cleanAlphanumeric(candSkill);
  if (reqClean && candClean && reqClean === candClean) return true;

  const reqAliases = SKILL_PHRASE_DICTIONARY[reqSkill] || [];
  const normalizedReqAliases = reqAliases.map(a => normalizeSkill(a));
  const cleanedReqAliases = reqAliases.map(a => cleanAlphanumeric(a));

  if (normalizedReqAliases.includes(candNorm) || cleanedReqAliases.includes(candClean)) {
    return true;
  }

  return false;
}

console.log("=================================================");
console.log("🎯 Running Nexa Prep AI False-Positive Matcher Tests");
console.log("=================================================\n");

// Test 1: Machine Learning resume text does NOT extract Statistics
const mlResume = "Engineered predictive machine learning models, trained neural networks using PyTorch, deployed in Python.";
const mlSkills = extractSkillsFromText(mlResume);
console.log("Test 1 — ML Resume Extracted Skills:", mlSkills);
assert(mlSkills.includes('Machine Learning'), "ML Resume must include Machine Learning");
assert(!mlSkills.includes('Statistics'), "ML Resume must NOT falsely include Statistics");
assert(!isSkillMatched('Statistics', 'Machine Learning'), "isSkillMatched('Statistics', 'Machine Learning') must be FALSE");
console.log("✅ Test 1 PASSED: Machine Learning does not falsely match Statistics\n");

// Test 2: Generative AI resume text does NOT extract LLMs unless explicitly mentioned
const genAiResume = "Built Generative AI applications using python and deep learning pipelines.";
const genAiSkills = extractSkillsFromText(genAiResume);
console.log("Test 2 — GenAI Resume Extracted Skills:", genAiSkills);
assert(genAiSkills.includes('Generative AI'), "GenAI Resume must include Generative AI");
assert(!genAiSkills.includes('LLMs'), "GenAI Resume must NOT falsely include LLMs");
assert(!isSkillMatched('LLMs', 'Generative AI'), "isSkillMatched('LLMs', 'Generative AI') must be FALSE");
console.log("✅ Test 2 PASSED: Generative AI does not falsely match LLMs\n");

// Test 3: Sparse resume with Python & SQL extracts ONLY Python & SQL
const sparseResume = "Developed backend database queries using SQL and Python scripts for data processing.";
const sparseSkills = extractSkillsFromText(sparseResume);
console.log("Test 3 — Sparse Resume Extracted Skills:", sparseSkills);
assert.deepStrictEqual(sparseSkills.sort(), ['Python', 'SQL'].sort(), "Sparse resume must extract ONLY Python and SQL");
console.log("✅ Test 3 PASSED: Sparse resume extracts ONLY present skills\n");

// Test 4: Positive casing & alias variations match correctly
assert(isSkillMatched('PyTorch', 'pytorch'), "PyTorch matches pytorch");
assert(isSkillMatched('Node.js', 'nodejs'), "Node.js matches nodejs");
assert(isSkillMatched('C++', 'cpp'), "C++ matches cpp");
console.log("✅ Test 4 PASSED: Positive framework casing and alias variations match 100%\n");

console.log("🎉 ALL 4 TESTS PASSED SUCCESSFULLY!");
