const SKILL_CANONICAL_MAP: { [alias: string]: string } = {
  // Data Structures & Algorithms
  'dsa': 'Data Structures & Algorithms',
  'leetcode': 'Data Structures & Algorithms',
  'data structure': 'Data Structures & Algorithms',
  'data structures': 'Data Structures & Algorithms',
  'algorithms': 'Data Structures & Algorithms',
  'data structures & algorithms': 'Data Structures & Algorithms',
  'data structures and algorithms': 'Data Structures & Algorithms',

  // Machine Learning & AI
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'dl': 'Deep Learning',
  'deep learning': 'Deep Learning',
  'neural networks': 'Deep Learning',
  'nlp': 'NLP',
  'natural language processing': 'NLP',
  'cv': 'Computer Vision',
  'computer vision': 'Computer Vision',
  'opencv': 'OpenCV',
  'genai': 'Generative AI',
  'gen ai': 'Generative AI',
  'generative ai': 'Generative AI',
  'generative-ai': 'Generative AI',
  'llm': 'LLMs',
  'llms': 'LLMs',
  'large language model': 'LLMs',
  'large language models': 'LLMs',
  'transformers': 'Transformers',
  'huggingface': 'Transformers',
  'hugging face': 'Transformers',
  'langchain': 'LangChain',
  'llamaindex': 'LangChain',
  'langgraph': 'LangChain',
  'pytorch': 'PyTorch',
  'torch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'tf': 'TensorFlow',
  'keras': 'TensorFlow',
  'scikit-learn': 'Scikit-Learn',
  'scikit learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'vector databases': 'Vector Databases',
  'vector database': 'Vector Databases',
  'vector db': 'Vector Databases',
  'faiss': 'Vector Databases',
  'pinecone': 'Vector Databases',
  'chroma': 'Vector Databases',
  'model fine-tuning': 'Model Fine-Tuning (LoRA)',
  'fine-tuning': 'Model Fine-Tuning (LoRA)',
  'lora': 'Model Fine-Tuning (LoRA)',
  'qlora': 'Model Fine-Tuning (LoRA)',
  'onnx': 'ONNX Optimization',
  'onnx optimization': 'ONNX Optimization',
  'linear algebra': 'Linear Algebra',
  'numpy': 'NumPy',
  'pandas': 'Pandas',
  'openai api': 'OpenAI API',
  'openai': 'OpenAI API',

  // Languages & Web
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'es6': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Node.js',

  // Databases & SQL
  'sql': 'SQL',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'my sql': 'MySQL',
  'mysql': 'MySQL',
  'py': 'Python',
  'python': 'Python',
  'python3': 'Python',

  // Data Analytics & Viz
  'excel': 'Excel',
  'ms excel': 'Excel',
  'microsoft excel': 'Excel',
  'powerbi': 'PowerBI',
  'power bi': 'PowerBI',
  'microsoft power bi': 'PowerBI',
  'tableau': 'Tableau',
  'tableau desktop': 'Tableau',
  'data viz': 'Data Visualization',
  'dataviz': 'Data Visualization',
  'data visualization': 'Data Visualization',
  'stats': 'Statistics',
  'statistics': 'Statistics',
  'statistical analysis': 'Statistics',

  // Core & CAD Engineering
  'solidworks': 'SolidWorks',
  'autocad': 'AutoCAD',
  'cad': 'AutoCAD',
  'ansys': 'ANSYS',
  'fea': 'FEA',
  'staad': 'STAAD Pro',
  'staad pro': 'STAAD Pro',
  'staad.pro': 'STAAD Pro',
  'revit': 'Revit',
  'ros': 'ROS (Robot Operating System)',
  'ros2': 'ROS (Robot Operating System)',
  'robot operating system': 'ROS (Robot Operating System)',
  'matlab': 'MATLAB',
  'simulink': 'Simulink',
  'plc': 'PLC Programming',
  'plc programming': 'PLC Programming',
  'pcb': 'PCB Design',
  'pcb design': 'PCB Design',
  'arduino': 'Arduino',
  'raspberry pi': 'Raspberry Pi',
  'rpi': 'Raspberry Pi',
  'mqtt': 'MQTT',
  'rtos': 'RTOS',
  'freertos': 'RTOS',

  // Cloud & DevOps
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'docker': 'Docker',
  'containerization': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'Git',
  'rest': 'REST API',
  'rest api': 'REST API',
  'restful api': 'REST API',
  'api': 'REST API',
  'linux': 'Linux',
  'bash': 'Bash Shell',
};

export function deduplicateSkills(rawSkills: string[]): string[] {
  const result = new Set<string>();

  for (const item of rawSkills) {
    if (!item) continue;
    const lower = item.trim().toLowerCase();
    
    if (SKILL_CANONICAL_MAP[lower]) {
      result.add(SKILL_CANONICAL_MAP[lower]);
    } else {
      const formatted = item
        .trim()
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      result.add(formatted);
    }
  }

  return Array.from(result);
}
