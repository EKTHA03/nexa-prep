import { deduplicateSkills } from '../utils/deduplicate';
import { API_BASE_URL } from '../config/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Canonical skill dictionary  
// Each entry: canonical name → array of recognized aliases/variants strictly for the SAME skill
// ─────────────────────────────────────────────────────────────────────────────
export const SKILL_PHRASE_DICTIONARY: { [canonical: string]: string[] } = {
  'SQL': ['sql', 'structured query language', 't-sql', 'tsql', 'pl/sql', 'plsql', 'ansi sql'],
  'MySQL': ['mysql', 'my sql', 'mariadb'],
  'PostgreSQL': ['postgresql', 'postgres', 'pg'],
  'Python': ['python', 'py', 'python3', 'python2', 'python 3'],
  'Excel': ['excel', 'ms excel', 'microsoft excel', 'vlookup', 'xlookup', 'pivot tables', 'pivot table', 'spreadsheets', 'spreadsheet'],
  'Tableau': ['tableau', 'tableau desktop', 'tableau public', 'tableau server'],
  'PowerBI': ['powerbi', 'power bi', 'microsoft power bi', 'power-bi', 'power bi desktop'],
  'Data Visualization': ['data visualization', 'data viz', 'dataviz', 'visualization', 'charts', 'dashboards', 'dashboarding'],
  'Pandas': ['pandas', 'dataframe', 'dataframes'],
  'Statistics': ['statistics', 'stats', 'statistical analysis', 'probability and statistics'],
  'Data Structures & Algorithms': ['data structures & algorithms', 'data structures and algorithms', 'data structures', 'algorithms', 'dsa', 'leetcode', 'data structure'],
  'System Design': ['system design', 'software architecture', 'system architecture'],
  'Java': ['java', 'j2ee', 'core java', 'java 8', 'java 11', 'java 17'],
  'C++': ['c++', 'cpp', 'c plus plus', 'cplusplus', 'modern c++'],
  'C': ['c language', 'embedded c', 'ansi c', 'c programming'],
  'Git': ['git', 'github', 'gitlab', 'version control', 'bitbucket'],
  'OOP': ['oop', 'object oriented', 'object-oriented', 'oops', 'object oriented programming'],
  'REST API': ['rest api', 'rest apis', 'restful api', 'restful apis', 'restful', 'rest'],
  'Machine Learning': ['machine learning', 'ml', 'machine-learning'],
  'Scikit-Learn': ['scikit-learn', 'sklearn', 'scikit learn', 'scikitlearn', 'scikit_learn'],
  'PyTorch': ['pytorch', 'torch'],
  'TensorFlow': ['tensorflow', 'tf', 'keras'],
  'NumPy': ['numpy', 'numerical python'],
  'Linear Algebra': ['linear algebra', 'matrix algebra', 'eigenvalues', 'vector spaces'],
  'ROS (Robot Operating System)': ['ros', 'robot operating system', 'ros2'],
  'Control Systems': ['control systems', 'pid', 'feedback control', 'pid controller'],
  'Kinematics': ['kinematics', 'dynamics', 'motion planning'],
  'Microcontrollers': ['microcontroller', 'microcontrollers', 'stm32', 'esp32', 'atmega', '8051', 'pic'],
  'OpenCV': ['opencv', 'opencv-python', 'cv2', 'open-cv'],
  'Computer Vision': ['computer vision', 'cv', 'vision algorithms'],
  'CAD': ['cad', 'computer aided design', 'autocad', 'solidworks', 'catia'],
  'HTML5': ['html5', 'html', 'html 5'],
  'CSS3': ['css3', 'css', 'css 3', 'sass', 'scss'],
  'JavaScript': ['javascript', 'js', 'es6', 'vanilla js', 'modern javascript'],
  'TypeScript': ['typescript', 'ts'],
  'React': ['react', 'react.js', 'reactjs', 'react js'],
  'Next.js': ['next.js', 'nextjs', 'next js'],
  'Node.js': ['node.js', 'nodejs', 'node js', 'node'],
  'Django': ['django', 'django rest framework', 'drf'],
  'FastAPI': ['fastapi', 'fast api'],
  'Flask': ['flask'],
  'Spring Boot': ['spring boot', 'spring framework', 'springboot'],
  'Vue.js': ['vue', 'vue.js', 'vuejs', 'vue 3'],
  'Angular': ['angular', 'angularjs', 'angular.js'],
  'Tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
  'R': ['r programming', 'r studio', 'r-lang', 'r language', 'rstudio'],
  'Deep Learning': ['deep learning', 'dl', 'neural network', 'neural networks'],
  'Data Mining': ['data mining', 'data extraction', 'data warehousing'],
  'Linux': ['linux', 'ubuntu', 'centos', 'unix', 'debian', 'redhat'],
  'Docker': ['docker', 'containerization', 'containers', 'dockerfile', 'docker-compose'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services', 'aws cloud', 's3', 'ec2'],
  'CI/CD': ['ci/cd', 'cicd', 'ci-cd', 'continuous integration', 'continuous deployment', 'jenkins'],
  'Terraform': ['terraform', 'iac', 'infrastructure as code'],
  'Bash Shell': ['bash', 'shell script', 'shell scripting', 'bash script'],
  'Ansible': ['ansible'],
  'RTOS': ['rtos', 'freertos'],
  'ARM Architecture': ['arm', 'arm cortex', 'arm architecture'],
  'Circuit Design': ['circuit design', 'schematic design', 'schematics'],
  'Firmware': ['firmware', 'embedded software', 'device drivers'],
  'Embedded Linux': ['embedded linux', 'yocto', 'buildroot'],
  'SolidWorks': ['solidworks', 'solid works'],
  'AutoCAD': ['autocad', 'auto cad'],
  'Thermodynamics': ['thermodynamics', 'heat transfer'],
  'Fluid Mechanics': ['fluid mechanics', 'cfd', 'fluid dynamics'],
  'ANSYS': ['ansys', 'ansys workbench'],
  'FEA': ['fea', 'finite element analysis'],
  'Manufacturing': ['manufacturing', 'cam', 'cnc'],
  'GD&T': ['gd&t', 'gdt', 'tolerancing'],
  'NLP': ['nlp', 'natural language processing', 'text mining'],
  'Generative AI': ['generative ai', 'gen ai', 'genai', 'generative-ai'],
  'Transformers': ['transformers', 'huggingface transformers'],
  'LangChain': ['langchain', 'lang-chain'],
  'LLMs': ['llm', 'llms', 'large language model', 'large language models'],
  'Vector Databases': ['vector databases', 'vector database', 'vector db', 'vector store'],
  'Model Fine-Tuning (LoRA)': ['model fine-tuning', 'fine-tuning', 'lora', 'qlora', 'peft'],
  'ONNX Optimization': ['onnx', 'onnx optimization', 'onnx runtime'],
  'MLOps': ['mlops', 'ml ops', 'machine learning operations', 'kubeflow', 'mlflow'],
  'Model Deployment': ['model deployment', 'torchserve', 'triton', 'model serving', 'tf serving'],
  'CUDA Optimization': ['cuda', 'cuda optimization', 'gpu computing', 'tensorrt'],
  'BigQuery': ['bigquery', 'google bigquery', 'big query'],
  'Data Warehousing': ['data warehousing', 'data warehouse', 'snowflake', 'redshift', 'synapse'],
  'ETL Pipelines': ['etl', 'etl pipelines', 'data pipeline', 'data pipelines', 'airflow', 'dbt'],
  'SLAM (Localization)': ['slam', 'simultaneous localization and mapping', 'lidar slam', 'visual slam'],
  'Gazebo Simulation': ['gazebo', 'gazebo simulation', 'urdf', 'robot simulation'],
  'Sensor Fusion': ['sensor fusion', 'kalman filter', 'ekf', 'extended kalman filter'],
  'Core Web Vitals': ['core web vitals', 'web vitals', 'lcp', 'fid', 'cls', 'inp', 'page speed'],
  'GraphQL': ['graphql', 'apollo', 'relay'],
  'A/B Testing': ['a/b testing', 'ab testing', 'split testing', 'hypothesis testing'],
  'Big Data Analytics': ['big data', 'big data analytics', 'hadoop', 'spark', 'pyspark', 'apache spark'],
  'Apache Spark': ['apache spark', 'spark', 'pyspark', 'spark sql'],
  'Prometheus & Grafana': ['prometheus', 'grafana', 'prometheus & grafana', 'monitoring'],
  'Helm Charts': ['helm', 'helm charts', 'k8s helm'],
  'Nginx': ['nginx', 'reverse proxy'],
  'CAN Bus Protocol': ['can bus', 'can bus protocol', 'can protocol', 'can controller'],
  'Device Drivers': ['device drivers', 'device driver', 'kernel driver'],
  'SPI/I2C/UART': ['spi', 'i2c', 'uart', 'serial communication', 'usart'],
  'Computational Fluid Dynamics (CFD)': ['cfd', 'computational fluid dynamics'],
  'CAM Machining': ['cam', 'cam machining', 'cnc programming', 'g-code'],
  'OpenAI API': ['openai api', 'openai', 'gpt-4', 'gpt-3.5', 'chatgpt api'],
  'STAAD Pro': ['staad', 'staad pro', 'staad.pro'],
  'Structural Analysis': ['structural analysis', 'structures'],
  'Surveying': ['surveying'],
  'Concrete Technology': ['concrete technology', 'concrete', 'rcc'],
  'Geotechnical': ['geotechnical', 'soil mechanics'],
  'Revit': ['revit', 'bim'],
  'ETABS Software': ['etabs', 'etabs software'],
  'BIM Coordination': ['bim', 'bim coordination', 'navisworks'],
  'MATLAB': ['matlab'],
  'Simulink': ['simulink'],
  'Circuit Theory': ['circuit theory', 'circuits'],
  'Power Systems': ['power systems'],
  'PLC Programming': ['plc', 'scada', 'plc programming'],
  'PCB Design': ['pcb', 'pcb design', 'altium', 'kicad'],
  'SCADA Automation': ['scada', 'scada automation', 'hmi'],
  'High Voltage Protection': ['high voltage', 'high voltage protection', 'switchgear', 'relays'],
  'Embedded C': ['embedded c', 'embedded-c'],
  'Arduino': ['arduino', 'arduino ide'],
  'Raspberry Pi': ['raspberry pi', 'rpi'],
  'MQTT': ['mqtt', 'coap'],
  'Zigbee': ['zigbee', 'bluetooth', 'ble'],
  'Wireless Sensors': ['wireless sensor', 'wireless sensors', 'wsn'],
  'IoT Cloud Platforms': ['iot cloud', 'thingspeak', 'aws iot'],
  'LoRaWAN Protocol': ['lorawan', 'lorawan protocol', 'lora wan'],
  'Edge AI': ['edge ai', 'tinyml', 'edge computing', 'edge impulse'],
};

export interface ResumeParseResult {
  fileName: string;
  extractedText: string;
  rawSkills: string[];
  deduplicatedSkills: string[];
}

async function extractTextFromPdfJs(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = (window as any).pdfjsLib;

  if (!pdfjsLib) return '';

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{ str: string; transform: number[] }>;

    let pageText = '';
    let lastX = -1;
    let lastWidth = 0;

    for (const item of items) {
      if (!item.str) continue;
      const currentX = item.transform[4];
      const currentWidth = item.str.length * (item.transform[0] || 7);

      if (lastX >= 0) {
        const gap = currentX - (lastX + lastWidth);
        if (gap > 8) {
          pageText += ' ';
        } else if (pageText.length > 0 && !pageText.endsWith(' ')) {
          pageText += ' ';
        }
      }

      pageText += item.str;
      lastX = currentX;
      lastWidth = currentWidth;
    }

    fullText += pageText + ' ';
  }

  return fullText;
}

export async function parsePdfResume(file: File, userEmail?: string): Promise<ResumeParseResult> {
  let textContent = '';

  // Priority 1: Backend API (handles server-side pypdf extraction)
  try {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (userEmail) {
      headers['X-User-Email'] = userEmail;
    }

    const apiRes = await fetch(`${API_BASE_URL}/api/resume/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.extracted_skills && data.extracted_skills.length > 0) {
        const rawSkills = data.extracted_skills;
        const deduplicatedSkills = deduplicateSkills(rawSkills);

        if (import.meta.env.DEV) {
          console.group('🔍 [Resume Parser — Backend]');
          console.log('(a) Raw extracted skills:', rawSkills);
          console.log('(b) Deduplicated skills:', deduplicatedSkills);
          console.log('(c) Raw text length:', data.text_length || 'N/A');
          console.groupEnd();
        }

        return {
          fileName: file.name,
          extractedText: data.text || file.name,
          rawSkills,
          deduplicatedSkills,
        };
      }
    }
  } catch (backendErr) {
    if (import.meta.env.DEV) {
      console.warn('[Resume Parser] Backend unreachable, falling back to client-side:', backendErr);
    }
  }

  // Priority 2: Client-side pdf.js with column-gap-aware extraction
  try {
    textContent = await extractTextFromPdfJs(file);
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[Resume Parser] pdf.js fallback error:', err);
  }

  // Priority 3: Raw byte text extraction
  if (!textContent.trim()) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const dec = new TextDecoder('utf-8', { fatal: false });
      const rawStr = dec.decode(arrayBuffer);
      const textMatches = rawStr.match(/[A-Za-z0-9\+\#\-\.\s]{2,}/g) || [];
      textContent = `${file.name} ${textMatches.join(' ')}`;
    } catch (e) {
      textContent = file.name;
    }
  }

  const extracted = extractSkillsFromText(textContent);
  const deduplicatedSkills = deduplicateSkills(extracted);

  if (import.meta.env.DEV) {
    console.group('🔍 [Resume Parser — Client]');
    console.log('(a) Raw extracted text preview:', textContent.slice(0, 300));
    console.log('(b) Extracted skills:', extracted);
    console.log('(c) Deduplicated skills:', deduplicatedSkills);
    console.groupEnd();
  }

  return {
    fileName: file.name,
    extractedText: textContent,
    rawSkills: extracted,
    deduplicatedSkills,
  };
}

export function extractSkillsFromText(resumeText: string): string[] {
  if (!resumeText) return [];

  const cleanedText = resumeText
    .replace(/[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219\t\r\n]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z0-9+#])[\.,;:!?'"()\[\]{}](\s|$)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  const lowerRawText = ` ${resumeText.toLowerCase()} `;
  const lowerCleanedText = ` ${cleanedText.toLowerCase()} `;
  const found = new Set<string>();

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
