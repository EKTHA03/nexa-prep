import { Resource } from '../types';

export interface CuratedSkillResources {
  youtube: { title: string; url: string; duration: string };
  docs: { title: string; url: string; duration: string };
  coursera: { title: string; url: string; duration: string };
}

export const CURATED_LEARNING_RESOURCES: { [skillLower: string]: CuratedSkillResources } = {
  'pytorch': {
    youtube: { title: 'PyTorch for Deep Learning & Machine Learning — Full Course', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', duration: '25h' },
    docs: { title: 'PyTorch Official Documentation & Tutorials', url: 'https://pytorch.org/docs/stable/index.html', duration: '1h 30m read' },
    coursera: { title: 'Deep Learning with PyTorch Specialization (DeepLearning.AI)', url: 'https://www.coursera.org/specializations/pytorch-deep-learning', duration: '4h' },
  },
  'generative ai': {
    youtube: { title: 'Generative AI Full Course — LLMs, RAG, and Transformers', url: 'https://www.youtube.com/watch?v=mEsleV16qdo', duration: '12h' },
    docs: { title: 'Google Cloud Generative AI & Gemini API Documentation', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs', duration: '1h read' },
    coursera: { title: 'Generative AI with Large Language Models (DeepLearning.AI)', url: 'https://www.coursera.org/learn/generative-ai-with-llms', duration: '3h 30m' },
  },
  'langchain': {
    youtube: { title: 'LangChain & LlamaIndex Crash Course — Build AI Apps', url: 'https://www.youtube.com/watch?v=aywZrzNaKjs', duration: '3h 15m' },
    docs: { title: 'LangChain Python Official Documentation', url: 'https://python.langchain.com/docs/get_started/introduction', duration: '45m read' },
    coursera: { title: 'LangChain for LLM Application Development (DeepLearning.AI)', url: 'https://www.coursera.org/learn/langchain-for-llm-application-development', duration: '2h 30m' },
  },
  'llms': {
    youtube: { title: 'Large Language Models (LLMs) from Scratch — Andrej Karpathy', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', duration: '2h 15m' },
    docs: { title: 'Hugging Face LLM & Transformer Course Guide', url: 'https://huggingface.co/docs/transformers/index', duration: '1h read' },
    coursera: { title: 'LLM Engineering: Building Large Language Model Applications', url: 'https://www.coursera.org/specializations/large-language-models', duration: '4h' },
  },
  'vector databases': {
    youtube: { title: 'Vector Databases Explained — Pinecone, FAISS, Weaviate & Chroma', url: 'https://www.youtube.com/watch?v=klTvEwg3oJ4', duration: '1h 30m' },
    docs: { title: 'Pinecone Vector Database Official Developer Guide', url: 'https://docs.pinecone.io/docs/overview', duration: '40m read' },
    coursera: { title: 'Building Vector Search & RAG Applications (Coursera)', url: 'https://www.coursera.org/learn/building-vector-search-applications', duration: '3h' },
  },
  'model fine-tuning (lora)': {
    youtube: { title: 'Fine-Tuning LLMs with LoRA, QLoRA & PEFT — Practical Guide', url: 'https://www.youtube.com/watch?v=eC6Hd1hFvos', duration: '2h 45m' },
    docs: { title: 'Hugging Face PEFT & LoRA Documentation', url: 'https://huggingface.co/docs/peft/index', duration: '50m read' },
    coursera: { title: 'Fine-Tuning Large Language Models Specialization', url: 'https://www.coursera.org/learn/fine-tuning-large-language-models', duration: '3h 45m' },
  },
  'data structures & algorithms': {
    youtube: { title: 'Data Structures and Algorithms in Python / Java — Full Course', url: 'https://www.youtube.com/watch?v=pkYVOmU3MgA', duration: '8h' },
    docs: { title: 'GeeksforGeeks Data Structures & Algorithms Guide', url: 'https://www.geeksforgeeks.org/data-structures/', duration: '2h read' },
    coursera: { title: 'Data Structures and Algorithms Specialization (UC San Diego)', url: 'https://www.coursera.org/specializations/data-structures-algorithms', duration: '5h' },
  },
  'system design': {
    youtube: { title: 'System Design Interview Course — Scalable Architectures', url: 'https://www.youtube.com/watch?v=bUHFg8CZFws', duration: '5h' },
    docs: { title: 'System Design Primer — GitHub Reference Guide', url: 'https://github.com/donnemartin/system-design-primer', duration: '2h read' },
    coursera: { title: 'Software Architecture and System Design (Coursera)', url: 'https://www.coursera.org/learn/software-architecture', duration: '4h' },
  },
  'docker': {
    youtube: { title: 'Docker Tutorial for Beginners — Full Course', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', duration: '2h' },
    docs: { title: 'Docker Official Developer Documentation', url: 'https://docs.docker.com/get-started/', duration: '45m read' },
    coursera: { title: 'Docker & Containerization Specialization', url: 'https://www.coursera.org/learn/docker-containerization', duration: '3h' },
  },
  'kubernetes': {
    youtube: { title: 'Kubernetes Tutorial for Beginners — Full Course', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', duration: '3h 30m' },
    docs: { title: 'Kubernetes Official Documentation Guide', url: 'https://kubernetes.io/docs/home/', duration: '1h read' },
    coursera: { title: 'Architecting with Google Kubernetes Engine (Coursera)', url: 'https://www.coursera.org/specializations/gcp-architecture', duration: '4h' },
  },
  'ci/cd': {
    youtube: { title: 'CI/CD Pipeline Tutorial — GitHub Actions & Jenkins', url: 'https://www.youtube.com/watch?v=R8_veQiYBjU', duration: '2h' },
    docs: { title: 'GitHub Actions Official Documentation', url: 'https://docs.github.com/en/actions', duration: '40m read' },
    coursera: { title: 'Continuous Integration and Continuous Delivery (CI/CD)', url: 'https://www.coursera.org/learn/continuous-integration-delivery', duration: '3h' },
  },
};

export function generateResourcesForGaps(gapSkills: string[]): Resource[] {
  const resources: Resource[] = [];

  gapSkills.forEach((skill) => {
    const cleanSkill = skill.trim();
    const lowerSkill = cleanSkill.toLowerCase();
    const curated = CURATED_LEARNING_RESOURCES[lowerSkill];

    const safeSkillId = encodeURIComponent(cleanSkill.toLowerCase());

    // 1. YouTube Resource Card
    resources.push({
      id: `res-${safeSkillId}-yt`,
      skill: cleanSkill,
      title: curated?.youtube.title || `${cleanSkill} Full Crash Course & Masterclass`,
      url: curated?.youtube.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanSkill + ' tutorial for beginners')}`,
      type: 'youtube',
      duration: curated?.youtube.duration || '1h 45m',
      completed: false,
      difficulty: 'beginner'
    });

    // 2. Docs Resource Card
    resources.push({
      id: `res-${safeSkillId}-docs`,
      skill: cleanSkill,
      title: curated?.docs.title || `Official ${cleanSkill} Developer Handbook & Best Practices`,
      url: curated?.docs.url || `https://www.google.com/search?q=${encodeURIComponent(cleanSkill + ' official documentation best practices')}`,
      type: 'docs',
      duration: curated?.docs.duration || '45m read',
      completed: false,
      difficulty: 'intermediate'
    });

    // 3. Coursera Resource Card
    resources.push({
      id: `res-${safeSkillId}-course`,
      skill: cleanSkill,
      title: curated?.coursera.title || `Specialization: Building Production Systems with ${cleanSkill}`,
      url: curated?.coursera.url || `https://www.coursera.org/search?query=${encodeURIComponent(cleanSkill)}`,
      type: 'coursera',
      duration: curated?.coursera.duration || '3h 10m',
      completed: false,
      difficulty: 'advanced'
    });
  });

  return resources;
}
