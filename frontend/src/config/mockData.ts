import { QuizQuestion } from '../types';

export interface InterviewQuestionItem {
  id: string;
  roleId: string;
  question: string;
  category: 'technical' | 'behavioral' | 'problem-solving';
  idealKeywords: string[];
  sampleModelAnswer: string;
}

// ─── Issue 2 Fix: quiz length increased from 5 → 10 ─────────────────────────
export const QUIZ_LENGTH = 10;

export const QUIZ_QUESTIONS: { [roleId: string]: QuizQuestion[] } = {
  'web-developer': [
    {
      id: 'web-q1',
      category: 'React & Core Web',
      question: 'What is the main purpose of React.useMemo() hook?',
      options: [
        'To create a persistent mutable reference across renders',
        'To memoize expensive calculation values between renders based on dependencies',
        'To perform side effects after every DOM mutation',
        'To trigger re-render whenever state changes'
      ],
      correctAnswer: 1,
      explanation: 'useMemo returns a memoized value that is recalculated only when one of its dependencies changes.'
    },
    {
      id: 'web-q2',
      category: 'TypeScript',
      question: 'Which TypeScript utility type constructs a type with all properties of T set to optional?',
      options: ['Required<T>', 'Record<K, T>', 'Partial<T>', 'Omit<T, K>'],
      correctAnswer: 2,
      explanation: 'Partial<T> makes all properties in T optional (property?: value).'
    },
    {
      id: 'web-q3',
      category: 'CSS & Layout',
      question: 'In Flexbox layout, which property controls the main-axis alignment of items?',
      options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
      correctAnswer: 1,
      explanation: 'justify-content aligns flex items along the main axis of the current flex line.'
    },
    {
      id: 'web-q4',
      category: 'Web Performance',
      question: 'What does LCP stand for in Core Web Vitals metric?',
      options: [
        'Largest Contentful Paint',
        'Lowest Common Performance',
        'Loaded Component Process',
        'Layout Content Pipeline'
      ],
      correctAnswer: 0,
      explanation: 'LCP (Largest Contentful Paint) measures perceived loading speed by marking when main content has loaded.'
    },
    {
      id: 'web-q5',
      category: 'JavaScript Event Loop',
      question: 'In which order are Microtasks (Promises) and Macrotasks (setTimeout) processed?',
      options: [
        'Macrotasks execute first, then Microtasks',
        'Microtasks queue is emptied before the next Macrotask is pulled from queue',
        'They are processed in alternating turn order',
        'Order is non-deterministic based on CPU load'
      ],
      correctAnswer: 1,
      explanation: 'All microtasks in the microtask queue are executed before the event loop moves to the next macrotask.'
    },
    {
      id: 'web-q6',
      category: 'React Hooks',
      question: 'When does useEffect run if you pass an empty dependency array []?',
      options: [
        'After every render',
        'Only on the initial mount and never again',
        'Only when a specified prop changes',
        'Before the component mounts'
      ],
      correctAnswer: 1,
      explanation: 'An empty dependency array [] causes useEffect to run exactly once after the initial render (componentDidMount equivalent).'
    },
    {
      id: 'web-q7',
      category: 'HTTP & REST',
      question: 'Which HTTP method is idempotent AND safe (has no side effects) per REST conventions?',
      options: ['POST', 'PUT', 'GET', 'PATCH'],
      correctAnswer: 2,
      explanation: 'GET is both idempotent and safe — repeated calls return the same result and do not modify server state.'
    },
    {
      id: 'web-q8',
      category: 'Node.js',
      question: 'What is the role of the Event Loop in Node.js?',
      options: [
        'To parse HTML into a Virtual DOM',
        'To manage multiple CPU threads for parallel computation',
        'To offload async I/O operations and process their callbacks without blocking the main thread',
        'To compile TypeScript to JavaScript at runtime'
      ],
      correctAnswer: 2,
      explanation: 'Node.js uses a single-threaded event loop that delegates I/O to the OS kernel and processes callbacks asynchronously.'
    },
    {
      id: 'web-q9',
      category: 'Security',
      question: 'What does Content Security Policy (CSP) primarily protect against?',
      options: [
        'SQL Injection attacks on the database',
        'Cross-Site Scripting (XSS) attacks',
        'Man-in-the-Middle network attacks',
        'CSRF token forgery'
      ],
      correctAnswer: 1,
      explanation: 'CSP headers instruct the browser to only execute scripts from trusted sources, mitigating XSS attack vectors.'
    },
    {
      id: 'web-q10',
      category: 'CSS Grid',
      question: 'In CSS Grid, which shorthand property defines both grid-template-rows and grid-template-columns?',
      options: ['grid-area', 'grid-template', 'grid-gap', 'grid-auto-flow'],
      correctAnswer: 1,
      explanation: 'grid-template is shorthand for grid-template-rows / grid-template-columns (and optionally grid-template-areas).'
    }
  ],
  'software-engineer': [
    {
      id: 'se-q1',
      category: 'Database Design',
      question: 'Which ACID property guarantees that executed transactions leave the database in a valid state?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctAnswer: 1,
      explanation: 'Consistency ensures that a transaction can only bring the database from one valid state to another.'
    },
    {
      id: 'se-q2',
      category: 'Concurrency & I/O',
      question: 'How do modern asynchronous non-blocking event loops handle high-throughput I/O operations?',
      options: [
        'Using multi-threaded CPU affinity pools per request',
        'Via an event loop and thread pool delegating async operations to the OS kernel',
        'By spawning a heavy OS process per incoming network connection',
        'Through synchronous busy-wait polling intervals'
      ],
      correctAnswer: 1,
      explanation: 'Non-blocking runtimes use event demultiplexing to handle I/O asynchronously with minimal thread context-switch overhead.'
    },
    {
      id: 'se-q3',
      category: 'REST & HTTP',
      question: 'Which HTTP status code should be returned when a client is authenticated but lacks permission for a resource?',
      options: ['401 Unauthorized', '403 Forbidden', '404 Not Found', '422 Unprocessable Entity'],
      correctAnswer: 1,
      explanation: '403 Forbidden indicates the server understands the request but refuses to authorize it.'
    },
    {
      id: 'se-q4',
      category: 'System Architecture',
      question: 'What problem does database Indexing primarily solve?',
      options: [
        'Enforces foreign key cascading rules',
        'Reduces data retrieval latency from O(N) full table scan to O(log N)',
        'Compresses storage footprint on disk',
        'Prevents race conditions during concurrent writes'
      ],
      correctAnswer: 1,
      explanation: 'Indexes create B-Tree or Hash data structures to quickly locate rows without scanning the full table.'
    },
    {
      id: 'se-q5',
      category: 'Security',
      question: 'What attack is prevented by using Parameterized SQL Queries / Prepared Statements?',
      options: [
        'Cross-Site Scripting (XSS)',
        'SQL Injection (SQLi)',
        'Cross-Site Request Forgery (CSRF)',
        'Man-in-the-Middle (MITM)'
      ],
      correctAnswer: 1,
      explanation: 'Prepared statements separate SQL command code from data input parameters, preventing SQL injection.'
    },
    {
      id: 'se-q6',
      category: 'Design Patterns',
      question: 'Which design pattern provides a single access point to a resource and ensures only one instance is created?',
      options: ['Observer', 'Factory', 'Singleton', 'Decorator'],
      correctAnswer: 2,
      explanation: 'The Singleton pattern restricts instantiation of a class to a single object and provides global access to that instance.'
    },
    {
      id: 'se-q7',
      category: 'Data Structures',
      question: 'Which data structure gives O(1) average-case lookup, insert, and delete operations?',
      options: ['Binary Search Tree', 'Linked List', 'Hash Table', 'Balanced AVL Tree'],
      correctAnswer: 2,
      explanation: 'Hash Tables achieve O(1) average complexity for key lookups via hash functions, with O(n) worst case on collision.'
    },
    {
      id: 'se-q8',
      category: 'Operating Systems',
      question: 'What is the fundamental difference between a Process and a Thread?',
      options: [
        'Threads run on separate CPUs; processes share a single CPU',
        'Processes have isolated memory; threads share the same process memory space',
        'Processes are faster to create than threads',
        'Threads cannot communicate with each other'
      ],
      correctAnswer: 1,
      explanation: 'Threads are lightweight execution units within a process that share the same heap/code/data segments; processes are fully isolated.'
    },
    {
      id: 'se-q9',
      category: 'Algorithms',
      question: 'What is the time complexity of QuickSort in the average case?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 1,
      explanation: 'QuickSort achieves O(n log n) average case by partitioning around a pivot; worst case is O(n²) on already-sorted inputs with bad pivot selection.'
    },
    {
      id: 'se-q10',
      category: 'Microservices',
      question: 'What is the primary purpose of an API Gateway in a microservices architecture?',
      options: [
        'To store session data centrally across services',
        'To act as a single entry point handling routing, auth, rate-limiting, and load balancing',
        'To compile and transpile service source code',
        'To monitor RAM usage of individual containers'
      ],
      correctAnswer: 1,
      explanation: 'An API Gateway is the unified front-door for all clients, handling cross-cutting concerns like authentication, rate limiting, and routing to upstream services.'
    }
  ]
};

// Fallback quiz generator for all 13 roles — 10 generic engineering questions
export function getQuestionsForRole(roleId: string): QuizQuestion[] {
  const bank: QuizQuestion[] = QUIZ_QUESTIONS[roleId] ?? [
    {
      id: `${roleId}-q1`,
      category: 'Architecture',
      question: `Which fundamental principle is crucial when architecting production solutions for ${roleId.replace(/-/g, ' ')}?`,
      options: [
        'Separation of Concerns and modular design',
        'Storing all operational state in global variables',
        'Avoiding version control systems',
        'Skipping unit and integration testing'
      ],
      correctAnswer: 0,
      explanation: 'Modular architecture and separation of concerns allow maintainable, testable, and scalable software.'
    },
    {
      id: `${roleId}-q2`,
      category: 'Data Structures',
      question: 'What is the average time complexity for lookup in a Hash Table?',
      options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
      correctAnswer: 0,
      explanation: 'Hash tables offer average O(1) constant time complexity for key-based insertion, deletion, and retrieval.'
    },
    {
      id: `${roleId}-q3`,
      category: 'Version Control',
      question: 'Which Git command creates a new branch and switches to it immediately?',
      options: ['git checkout -b <name>', 'git branch <name>', 'git merge <name>', 'git pull origin <name>'],
      correctAnswer: 0,
      explanation: 'git checkout -b <name> creates and checks out the new branch in a single command.'
    },
    {
      id: `${roleId}-q4`,
      category: 'System Design',
      question: 'What does horizontal scaling (scaling out) refer to in modern system design?',
      options: [
        'Adding more RAM/CPU to an existing single machine',
        'Adding more servers/nodes to a pool to distribute load',
        'Reducing database schema size',
        'Encrypting network payload headers'
      ],
      correctAnswer: 1,
      explanation: 'Horizontal scaling adds more instances or nodes to handle increased demand collaboratively.'
    },
    {
      id: `${roleId}-q5`,
      category: 'Best Practices',
      question: 'What is the primary benefit of Continuous Integration (CI)?',
      options: [
        'Automates code integration, building, and running test suites frequently',
        'Increases manual QA deployment cycle time',
        'Disables automated security audits',
        'Requires all code to be written in a single file'
      ],
      correctAnswer: 0,
      explanation: 'CI ensures code changes are automatically validated against tests before merging.'
    },
    {
      id: `${roleId}-q6`,
      category: 'Security',
      question: 'What is the recommended way to store user passwords in a database?',
      options: ['Plain text for fast lookup', 'Base64 encoded string', 'Bcrypt or Argon2 salted hash', 'MD5 hash'],
      correctAnswer: 2,
      explanation: 'Bcrypt and Argon2 are purpose-built slow hashing algorithms with salt — designed to resist brute-force attacks.'
    },
    {
      id: `${roleId}-q7`,
      category: 'Testing',
      question: 'What is the difference between unit testing and integration testing?',
      options: [
        'Unit tests are slower and test entire system flows',
        'Unit tests test isolated functions; integration tests verify multiple components working together',
        'Integration tests cannot involve databases',
        'Unit tests require a running server environment'
      ],
      correctAnswer: 1,
      explanation: 'Unit tests isolate individual functions/methods; integration tests verify multiple modules work correctly in combination.'
    },
    {
      id: `${roleId}-q8`,
      category: 'Algorithms',
      question: 'Which sorting algorithm has O(n log n) time complexity in all cases (worst, average, best)?',
      options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'],
      correctAnswer: 2,
      explanation: 'Merge Sort always divides the array in half and merges in O(n log n) regardless of input order.'
    },
    {
      id: `${roleId}-q9`,
      category: 'Networking',
      question: 'What protocol does HTTPS rely on to provide encryption and certificate authentication?',
      options: ['FTP', 'TLS/SSL', 'SSH', 'UDP'],
      correctAnswer: 1,
      explanation: 'HTTPS wraps HTTP inside TLS (Transport Layer Security), providing encryption and server identity verification via certificates.'
    },
    {
      id: `${roleId}-q10`,
      category: 'Code Quality',
      question: 'What does the DRY principle stand for in software engineering?',
      options: ["Design Reusable Your-code", "Do Refactor Yourself", "Don't Repeat Yourself", "Debug Recursively Yes"],
      correctAnswer: 2,
      explanation: "DRY (Don't Repeat Yourself) promotes avoiding code duplication by abstracting common logic into reusable functions or modules."
    }
  ];

  // Serve exactly QUIZ_LENGTH questions — safety guard against over-long banks
  return bank.slice(0, QUIZ_LENGTH);
}

export const INTERVIEW_QUESTIONS: { [roleId: string]: InterviewQuestionItem[] } = {
  'web-developer': [
    {
      id: 'web-i1',
      roleId: 'web-developer',
      category: 'technical',
      question: 'Can you explain how the Virtual DOM works in React and how it optimizes UI rendering performance?',
      idealKeywords: ['virtual dom', 'reconciliation', 'diffing algorithm', 'render', 'state', 'batching'],
      sampleModelAnswer: 'React maintains a lightweight in-memory representation of the DOM called the Virtual DOM. When state changes occur, React creates a new Virtual DOM tree, runs a diffing algorithm (Reconciliation) against the previous tree, and batches minimal necessary updates to the real browser DOM.'
    },
    {
      id: 'web-i2',
      roleId: 'web-developer',
      category: 'technical',
      question: 'How do you optimize a modern web application for Core Web Vitals like LCP, CLS, and INP?',
      idealKeywords: ['lcp', 'cls', 'inp', 'lazy loading', 'code splitting', 'memoization', 'asset compression'],
      sampleModelAnswer: 'Optimizing web vitals involves lazy-loading images and non-critical modules, reserving dimensions for dynamic content to eliminate CLS, using CDN caching and compressed WebP assets for LCP, and breaking long JavaScript execution tasks to maintain low INP latency.'
    },
    {
      id: 'web-i3',
      roleId: 'web-developer',
      category: 'problem-solving',
      question: 'Describe a scenario where you had to debug a complex React state update bug or memory leak.',
      idealKeywords: ['profiler', 'chrome devtools', 'cleanup function', 'useeffect', 'state management', 're-render'],
      sampleModelAnswer: 'I systematically isolate state bugs using React DevTools Profiler and console timelines. For memory leaks, I verify that useEffect hooks properly clean up event listeners, WebSocket connections, and asynchronous timers.'
    },
    {
      id: 'web-i4',
      roleId: 'web-developer',
      category: 'behavioral',
      question: 'How do you collaborate with UX designers and backend engineers when API specifications are changing?',
      idealKeywords: ['communication', 'api contract', 'mocking', 'swagger', 'alignment', 'agile'],
      sampleModelAnswer: 'I establish clear API contracts early using OpenAPI/Swagger specs. While backend endpoints are built, I create mock data handlers to unblock frontend feature development and regularly demo component iterations with UX designers.'
    },
    {
      id: 'web-i5',
      roleId: 'web-developer',
      category: 'technical',
      question: 'What is the difference between client-side rendering (CSR) and server-side rendering (SSR), and when should you choose each?',
      idealKeywords: ['csr', 'ssr', 'seo', 'initial page load', 'hydration', 'next.js'],
      sampleModelAnswer: 'CSR renders HTML in browser via JS bundles, ideal for private dashboard apps. SSR pre-renders HTML on server per request, providing superior SEO and faster First Contentful Paint for content-rich or e-commerce platforms.'
    }
  ],
  'software-engineer': [
    {
      id: 'se-i1',
      roleId: 'software-engineer',
      category: 'technical',
      question: 'How do you approach designing a scalable system with high concurrency and data consistency?',
      idealKeywords: ['microservices', 'caching', 'load balancing', 'database replication', 'event-driven', 'acid'],
      sampleModelAnswer: 'I isolate domain boundaries into modular services, utilize Redis caching and message queues for asynchronous decoupling, partition databases with replication, and use optimistic locking or distributed transactions where consistency is critical.'
    },
    {
      id: 'se-i2',
      roleId: 'software-engineer',
      category: 'technical',
      question: 'Can you compare the trade-offs between SQL and NoSQL database engines for enterprise applications?',
      idealKeywords: ['acid', 'schema', 'horizontal scaling', 'sharding', 'joins', 'relational'],
      sampleModelAnswer: 'SQL databases excel at structured relationships, strict ACID consistency, and complex join queries. NoSQL engines provide flexible document schemas and easier horizontal sharding for high-volume unstructured streams.'
    },
    {
      id: 'se-i3',
      roleId: 'software-engineer',
      category: 'problem-solving',
      question: 'Walk me through how you profile, debug, and eliminate performance bottlenecks in a backend service.',
      idealKeywords: ['profiler', 'apm', 'database query index', 'slow query log', 'latency', 'memory leak'],
      sampleModelAnswer: 'I inspect APM metrics and slow query logs, profile memory and CPU usage under realistic load, eliminate N+1 query patterns by optimizing indexes, and add connection pooling and response caching.'
    },
    {
      id: 'se-i4',
      roleId: 'software-engineer',
      category: 'behavioral',
      question: 'Describe how you manage technical debt while delivering features on tight schedules.',
      idealKeywords: ['prioritization', 'refactoring', 'ci/cd', 'code review', 'documentation', 'mvp'],
      sampleModelAnswer: 'I balance delivery with long-term stability by writing clean modular code from the start, logging explicit technical debt items in the backlog, and dedicating regular sprint bandwidth for targeted refactoring and test coverage.'
    },
    {
      id: 'se-i5',
      roleId: 'software-engineer',
      category: 'technical',
      question: 'What are the principles of RESTful API design and how do you ensure backward compatibility during updates?',
      idealKeywords: ['http methods', 'stateless', 'versioning', 'deprecation', 'status codes', 'idempotency'],
      sampleModelAnswer: 'RESTful APIs use clear resource nouns, appropriate HTTP verbs and status codes, and remain stateless. For backward compatibility, I use semantic API versioning in routes or headers and deprecate old fields gracefully without breaking existing consumers.'
    }
  ]
};

export function getInterviewQuestionsForRole(roleId: string): InterviewQuestionItem[] {
  if (INTERVIEW_QUESTIONS[roleId]) return INTERVIEW_QUESTIONS[roleId];
  return [
    {
      id: `${roleId}-i1`,
      roleId,
      category: 'technical',
      question: `What core architecture patterns do you follow when building scalable software for a ${roleId.replace(/-/g, ' ')} position?`,
      idealKeywords: ['architecture', 'scalability', 'modularity', 'clean code', 'testing'],
      sampleModelAnswer: 'I prioritize clean architecture principles, modular component isolation, continuous integration pipelines, and automated test coverage to ensure high maintainability and performance.'
    },
    {
      id: `${roleId}-i2`,
      roleId,
      category: 'problem-solving',
      question: 'Walk me through your troubleshooting process when encountering an unexpected production issue.',
      idealKeywords: ['logs', 'debugging', 'root cause analysis', 'reproduction', 'monitoring'],
      sampleModelAnswer: 'I analyze server and application error logs, reproduce the issue in an isolated environment, formulate targeted hypotheses, implement hotfixes safely with unit test verification, and write post-mortems.'
    },
    {
      id: `${roleId}-i3`,
      roleId,
      category: 'technical',
      question: 'How do you ensure data integrity, security, and authorization in your engineering projects?',
      idealKeywords: ['authentication', 'jwt', 'encryption', 'sanitization', 'rbac'],
      sampleModelAnswer: 'I enforce strictly scoped Role-Based Access Control (RBAC), input validation, HTTPS encryption in transit, hashed secrets at rest, and standard OAuth2 / JWT authorization headers.'
    },
    {
      id: `${roleId}-i4`,
      roleId,
      category: 'behavioral',
      question: 'Tell me about a time you had to learn a new technology or framework under tight deadlines.',
      idealKeywords: ['adaptability', 'fast learner', 'documentation', 'mvp', 'prioritization'],
      sampleModelAnswer: 'I break down the core technology concepts via official documentation, build a minimal proof-of-concept prototype, isolate essential features for immediate production needs, and iterate.'
    },
    {
      id: `${roleId}-i5`,
      roleId,
      category: 'technical',
      question: 'What strategies do you use for code reviews, refactoring, and maintaining code quality across teams?',
      idealKeywords: ['code review', 'linting', 'pr', 'refactoring', 'collaboration'],
      sampleModelAnswer: 'I configure automated ESLint/Prettier formatters, enforce strict pull request review checklists, review logic & edge cases constructively, and schedule regular refactoring iterations.'
    }
  ];
}
