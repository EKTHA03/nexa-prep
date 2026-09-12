// Standalone test script for skill extraction and matching validation
const SKILL_PHRASE_DICTIONARY = {
  'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 't-sql', 'tsql', 'pl/sql', 'plsql', 'sql server', 'mssql', 'nosql', 'rdbms'],
  'Python': ['python', 'py', 'python3', 'python2', 'python 3'],
  'Excel': ['excel', 'ms excel', 'microsoft excel', 'vlookup', 'xlookup', 'pivot tables', 'pivot table', 'spreadsheets', 'spreadsheet', 'advanced excel'],
  'Tableau': ['tableau', 'tableau desktop', 'tableau public', 'tableau server'],
  'PowerBI': ['powerbi', 'power bi', 'microsoft power bi', 'power-bi', 'power bi desktop'],
  'Data Visualization': ['data visualization', 'data viz', 'dataviz', 'visualization', 'charts', 'dashboards', 'dashboard', 'matplotlib', 'seaborn'],
  'Pandas': ['pandas', 'dataframe', 'dataframes'],
  'Statistics': ['statistics', 'stats', 'statistical', 'statistical analysis', 'probability'],
  'Data Structures & Algorithms': ['data structures & algorithms', 'data structures and algorithms', 'data structures', 'algorithms', 'dsa', 'data structure'],
  'System Design': ['system design', 'software architecture', 'distributed systems', 'system architecture'],
  'Java': ['java', 'j2ee', 'spring boot', 'spring framework', 'core java'],
  'C++': ['c++', 'cpp', 'c plus plus', 'cplusplus'],
  'C': ['c language', 'embedded c', 'ansi c', 'c programming'],
  'Git': ['git', 'github', 'gitlab', 'version control'],
  'OOP': ['oop', 'object oriented', 'object-oriented', 'oops'],
  'REST API': ['rest api', 'rest apis', 'restful api', 'restful apis', 'restful', 'rest', 'api integration', 'apis'],
  'Machine Learning': ['machine learning', 'ml', 'scikit-learn', 'sklearn'],
  'PyTorch': ['pytorch', 'torch'],
  'TensorFlow': ['tensorflow', 'tf', 'keras'],
  'NumPy': ['numpy'],
  'Linear Algebra': ['linear algebra', 'matrix', 'vector spaces'],
  'ROS (Robot Operating System)': ['ros', 'robot operating system', 'ros2'],
  'Control Systems': ['control systems', 'pid', 'feedback control'],
  'Kinematics': ['kinematics', 'dynamics', 'motion planning'],
  'Microcontrollers': ['microcontroller', 'microcontrollers', 'stm32', 'pic', 'avr', '8051', 'esp32'],
  'OpenCV': ['opencv', 'computer vision', 'image processing', 'cv2'],
  'CAD': ['cad', 'autocad', 'solidworks', 'catia'],
  'HTML5': ['html5', 'html'],
  'CSS3': ['css3', 'css', 'sass', 'scss'],
  'JavaScript': ['javascript', 'js', 'es6', 'vanilla js'],
  'TypeScript': ['typescript', 'ts'],
  'React': ['react', 'react.js', 'reactjs', 'react js'],
  'Node.js': ['node.js', 'nodejs', 'node js', 'node', 'express'],
  'Tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
  'R': ['r programming', 'r studio', 'r-lang', 'r language', 'rstudio'],
  'Deep Learning': ['deep learning', 'dl', 'neural network', 'neural networks', 'cnn', 'rnn'],
  'Data Mining': ['data mining', 'web scraping', 'etl'],
  'Linux': ['linux', 'ubuntu', 'centos', 'unix', 'debian'],
  'Docker': ['docker', 'containerization', 'containers'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services', 's3', 'ec2'],
  'CI/CD': ['ci/cd', 'cicd', 'ci-cd', 'continuous integration', 'jenkins', 'github actions']
};

function normalizeSkill(s) {
  if (!s) return '';
  return s.toLowerCase().trim().replace(/[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219]/g, '').replace(/\s+/g, ' ');
}

function cleanAlphanumeric(s) {
  return normalizeSkill(s).replace(/[^a-z0-9]/g, '');
}

function isSkillMatched(reqSkill, candSkill) {
  const reqNorm = normalizeSkill(reqSkill);
  const candNorm = normalizeSkill(candSkill);
  if (!reqNorm || !candNorm) return false;
  if (reqNorm === candNorm) return true;
  const reqClean = cleanAlphanumeric(reqSkill);
  const candClean = cleanAlphanumeric(candSkill);
  if (reqClean && candClean && reqClean === candClean) return true;

  const aliasesForReq = SKILL_PHRASE_DICTIONARY[reqSkill] || [];
  const reqAliasList = [reqNorm, reqClean, ...aliasesForReq.map(a => normalizeSkill(a))];
  if (reqAliasList.includes(candNorm) || reqAliasList.includes(candClean)) {
    return true;
  }
  return false;
}

function extractSkillsFromText(resumeText) {
  if (!resumeText) return [];
  // Normalize whitespace & strip bullet characters
  const cleanedText = resumeText
    .replace(/[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219\t\r\n]+/g, ' ')
    // Replace trailing punctuation at boundaries (like "pandas." or "React,") with space while preserving "c++", "c#", "node.js"
    .replace(/([a-zA-Z0-9+#])[\.,;:!?'"()\[\]{}](\s|$)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  const lowerText = ` ${cleanedText.toLowerCase()} `;
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

// Sample resume text
const sampleResumeText = `
EXPERIENCE:
• Full Stack Developer Intern at TechCorp (2025 - Present)
  - Built high-performance user interfaces using React.js, TypeScript, and Tailwind CSS.
  - Implemented REST APIs and microservices using Node.js and Express.
  - Designed and optimized database schemas in PostgreSQL / SQL.
  - Practiced version control using Git & GitHub, and set up CI/CD workflows.
  - Applied Object-Oriented Programming (OOP) and Data Structures & Algorithms (DSA) for core services.
  - Proficient in Python for scripting and data preprocessing with Pandas.
`;

console.log("=== Running Nexa Prep AI Skill Extraction & Matching Unit Tests ===");

// Test 1: Skill Extraction
const extracted = extractSkillsFromText(sampleResumeText);
console.log("\n[Test 1] Extracted skills from sample resume:", extracted);

const expectedToFind = ['React', 'TypeScript', 'Tailwind', 'REST API', 'Node.js', 'SQL', 'Git', 'CI/CD', 'OOP', 'Data Structures & Algorithms', 'Python', 'Pandas'];
const missing = expectedToFind.filter(s => !extracted.includes(s));

if (missing.length === 0) {
  console.log("✅ [Test 1 PASSED] All target skills extracted successfully with synonym recognition.");
} else {
  console.error("❌ [Test 1 FAILED] Missed skills:", missing);
  process.exit(1);
}

// Test 2: Boundary check
const javaVsJs = isSkillMatched('Java', 'JavaScript');
const cVsCss = isSkillMatched('C', 'CSS3');
const cppMatch = isSkillMatched('C++', 'cpp');
const reactJsMatch = isSkillMatched('React', 'react.js');

console.log("\n[Test 2] Boundary isolation test:");
console.log(`- 'Java' vs 'JavaScript': ${javaVsJs} (Expected: false)`);
console.log(`- 'C' vs 'CSS3': ${cVsCss} (Expected: false)`);
console.log(`- 'C++' vs 'cpp': ${cppMatch} (Expected: true)`);
console.log(`- 'React' vs 'react.js': ${reactJsMatch} (Expected: true)`);

if (!javaVsJs && !cVsCss && cppMatch && reactJsMatch) {
  console.log("✅ [Test 2 PASSED] Boundary matching & alias normalization verified.");
} else {
  console.error("❌ [Test 2 FAILED] Boundary check failed.");
  process.exit(1);
}

// Test 3: Web Developer Requirements matching
const webDevReqs = ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Tailwind', 'Git', 'REST API'];
const fullyMatched = [];
const gaps = [];

for (const req of webDevReqs) {
  let matched = false;
  for (const cand of extracted) {
    if (isSkillMatched(req, cand)) {
      fullyMatched.push(req);
      matched = true;
      break;
    }
  }
  if (!matched) gaps.push(req);
}

console.log("\n[Test 3] Web Developer Match Results:");
console.log("- Matched Skills:", fullyMatched);
console.log("- Gaps (Skills not in resume):", gaps);

if (fullyMatched.includes('React') && fullyMatched.includes('TypeScript') && fullyMatched.includes('REST API') && fullyMatched.includes('Node.js') && fullyMatched.includes('Tailwind') && fullyMatched.includes('Git')) {
  console.log("✅ [Test 3 PASSED] All possessed skills matched without false missing errors.");
} else {
  console.error("❌ [Test 3 FAILED] Possessed skills were falsely flagged as missing.");
  process.exit(1);
}

// ── Issue 1 fix: Add Next.js and other frameworks to the local test dictionary ──
SKILL_PHRASE_DICTIONARY['Next.js'] = ['next.js', 'nextjs', 'next js', 'next-js'];
SKILL_PHRASE_DICTIONARY['Django'] = ['django', 'django rest framework', 'drf'];
SKILL_PHRASE_DICTIONARY['FastAPI'] = ['fastapi', 'fast api'];
SKILL_PHRASE_DICTIONARY['Spring Boot'] = ['spring boot', 'spring framework', 'springboot', 'spring mvc'];
SKILL_PHRASE_DICTIONARY['Vue.js'] = ['vue', 'vue.js', 'vuejs', 'vue 3'];
SKILL_PHRASE_DICTIONARY['Angular'] = ['angular', 'angularjs', 'angular.js'];

// Update extractSkillsFromText to also split CamelCase before matching
function extractSkillsFromTextV2(resumeText) {
  if (!resumeText) return [];
  const cleanedText = resumeText
    .replace(/[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219\t\r\n]+/g, ' ')
    // Inject space on CamelCase boundaries (fixes column concatenation)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z0-9+#])[\.,;:!?'"()\[\]{}](\s|$)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  const lowerRawText = ` ${resumeText.toLowerCase()} `;
  const lowerCleanedText = ` ${cleanedText.toLowerCase()} `;
  const found = new Set();

  for (const [canonical, aliases] of Object.entries(SKILL_PHRASE_DICTIONARY)) {
    for (const alias of aliases) {
      const trimmedAlias = alias.trim().toLowerCase();
      if (!trimmedAlias) continue;
      const escaped = trimmedAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:^|[^a-z0-9+#])${escaped}(?:$|[^a-z0-9+#])`, 'i');
      if (
        pattern.test(lowerRawText) ||
        lowerRawText.includes(` ${trimmedAlias} `) ||
        pattern.test(lowerCleanedText) ||
        lowerCleanedText.includes(` ${trimmedAlias} `)
      ) {
        found.add(canonical);
        break;
      }
    }
  }
  return Array.from(found);
}

// ── NEW Test 4: Concatenated column text (pdf.js multi-column bug) ──────────
console.log('\n[Test 4] Concatenated column text (CamelCase split fix)');
const concatenatedText = 'ReactNode.jsTypeScriptPython';
const splitResult = extractSkillsFromTextV2(concatenatedText);
console.log('  Input: "ReactNode.jsTypeScriptPython"');
console.log('  Extracted:', splitResult);
const t4Pass = splitResult.includes('React') && splitResult.includes('Node.js') && splitResult.includes('Python');
if (t4Pass) {
  console.log('  ✅ [Test 4 PASSED] CamelCase concatenation correctly split into separate skills.');
} else {
  console.error('  ❌ [Test 4 FAILED] Could not split concatenated column text. Missing:', 
    ['React','Node.js','Python'].filter(s => !splitResult.includes(s)));
  process.exit(1);
}

// ── NEW Test 5: React.js / ReactJS / React all map to canonical "React" ──────
console.log('\n[Test 5] React variant normalization');
const reactVariants = [
  { text: 'Skills: react.js, TypeScript', expected: 'React' },
  { text: 'Skills: ReactJS development', expected: 'React' },
  { text: 'Skills: React hooks usage', expected: 'React' },
];
let t5Pass = true;
for (const { text, expected } of reactVariants) {
  const result = extractSkillsFromText(text);
  if (!result.includes(expected)) {
    console.error(`  ❌ "${text}" → did not extract "${expected}". Got: ${result}`);
    t5Pass = false;
  } else {
    console.log(`  ✅ "${text}" → correctly extracted "${expected}"`);
  }
}
if (!t5Pass) process.exit(1);
else console.log('  ✅ [Test 5 PASSED] All React variants normalize to canonical "React".');

// ── NEW Test 6: Next.js variant normalization ─────────────────────────────────
console.log('\n[Test 6] Next.js variant normalization');
const nextVariants = [
  { text: 'Framework: Next.js', expected: 'Next.js' },
  { text: 'Framework: NextJS', expected: 'Next.js' },
  { text: 'Framework: next js app router', expected: 'Next.js' },
];
let t6Pass = true;
for (const { text, expected } of nextVariants) {
  const result = extractSkillsFromTextV2(text);
  if (!result.includes(expected)) {
    console.error(`  ❌ "${text}" → did not extract "${expected}". Got: ${result}`);
    t6Pass = false;
  } else {
    console.log(`  ✅ "${text}" → correctly extracted "${expected}"`);
  }
}
if (!t6Pass) process.exit(1);
else console.log('  ✅ [Test 6 PASSED] All Next.js variants recognized.');

// ── NEW Test 7: Spring Boot → Java requirement alias match ────────────────────
console.log('\n[Test 7] Spring Boot → Java requirement alias');
const springText = 'Backend: Spring Boot, REST APIs, Maven';
const springExtracted = extractSkillsFromTextV2(springText);
console.log('  Extracted from "Spring Boot, REST APIs, Maven":', springExtracted);
const javaMatched = isSkillMatched('Java', 'Spring Boot');
console.log('  isSkillMatched("Java", "Spring Boot"):', javaMatched, '(Expected: true)');
if (javaMatched && (springExtracted.includes('Java') || springExtracted.includes('Spring Boot'))) {
  console.log('  ✅ [Test 7 PASSED] Spring Boot correctly maps to Java requirement.');
} else {
  console.error('  ❌ [Test 7 FAILED] Spring Boot not recognized as Java alias.');
  process.exit(1);
}

// ── Issue 2 fix: Add Scikit-Learn as canonical key ──
SKILL_PHRASE_DICTIONARY['Scikit-Learn'] = ['scikit-learn', 'sklearn', 'scikit learn', 'scikitlearn', 'scikit_learn'];

// ── NEW Test 8: Machine Learning Engineer Frameworks & Libraries ───────────
console.log('\n[Test 8] Machine Learning Engineer frameworks & libraries matching');
const mlResumeText = `
TECHNICAL SKILLS:
- Languages: Python, C++
- ML/DL Frameworks: PyTorch, TENSORFLOW, scikit-learn, SkLearn, Keras
- Libraries: NumPy, Pandas, Matplotlib
- Core Concepts: Machine Learning, Deep Learning, Linear Algebra
`;

const mlExtracted = extractSkillsFromTextV2(mlResumeText);
console.log('  Extracted ML Skills:', mlExtracted);

const mlRequired = ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Linear Algebra'];
const mlMissing = mlRequired.filter(req => {
  return !mlExtracted.some(cand => isSkillMatched(req, cand));
});

if (mlMissing.length === 0) {
  console.log('  ✅ [Test 8 PASSED] All 8 Machine Learning Engineer skills matched successfully (100% match)!');
} else {
  console.error('  ❌ [Test 8 FAILED] Missing ML skills:', mlMissing);
  process.exit(1);
}

console.log('\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!');


