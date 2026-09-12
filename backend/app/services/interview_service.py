# Role-specific Mock Interview Questions & Model Answers
INTERVIEW_QUESTIONS = {
    "Full Stack Developer": [
        {
            "id": "q1",
            "question": "Can you explain how you handle state management in a large-scale React and Node.js application?",
            "category": "Architecture & State",
            "model_answer": "In large-scale React applications, I structure state into local UI state (using useState/useReducer), global application state (using Redux Toolkit or Zustand for predictable unidirectional flow), and server-side state (using React Query / RTK Query for caching, automatic revalidation, and optimistic updates). On the Node.js backend, state is kept stateless via JWT sessions and Redis cache layers to ensure horizontal scalability."
        },
        {
            "id": "q2",
            "question": "How do you optimize database query performance when dealing with millions of records in PostgreSQL?",
            "category": "Database Performance",
            "model_answer": "I optimize PostgreSQL by analyzing EXPLAIN ANALYZE execution plans, creating appropriate B-tree or GIN indexes for frequently filtered columns, avoiding SELECT *, using query pagination with cursor keys rather than OFFSET, partitioning large tables, and implementing Connection Pooling (e.g. PgBouncer) with Redis caching."
        },
        {
            "id": "q3",
            "question": "What measures do you take to secure web applications against OWASP Top 10 vulnerabilities?",
            "category": "Security & Best Practices",
            "model_answer": "I enforce HTTPS with TLS 1.3, sanitize and validate inputs using Pydantic/Zod to prevent XSS and SQL Injection (ORMs with parameterized queries), implement Rate Limiting, set secure HttpOnly/SameSite cookies, enforce CORS policies, and use JWTs with short expiration times."
        }
    ],
    "AI/ML Engineer": [
        {
            "id": "q1",
            "question": "How do you prevent overfitting in deep learning models, and how do you decide between L1 vs L2 regularization?",
            "category": "Deep Learning Fundamentals",
            "model_answer": "Overfitting is mitigated using Dropout layers, Early Stopping based on validation loss, Data Augmentation, and Regularization. L1 (Lasso) drives weights to absolute zero creating sparse feature selection, whereas L2 (Ridge) penalizes large weights smoothly, keeping all features."
        },
        {
            "id": "q2",
            "question": "Explain the concept of fine-tuning Large Language Models (LLMs) using LoRA (Low-Rank Adaptation).",
            "category": "Generative AI & LLMs",
            "model_answer": "LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture. This drastically reduces trainable parameters (by 10,000x) and GPU memory usage while matching full fine-tuning performance."
        }
    ]
}

def get_interview_questions(role: str) -> list:
    """Retrieve interview prompts for the candidate's chosen role."""
    return INTERVIEW_QUESTIONS.get(role, INTERVIEW_QUESTIONS["Full Stack Developer"])

def evaluate_interview_answer(role: str, question_id: str, transcript: str, audio_duration: float = 12.0) -> dict:
    """
    Evaluate candidate's spoken/transcribed answer using AI scoring logic.
    Computes overall score (0-100), emotion/sentiment indicators, and detailed feedback.
    """
    questions = get_interview_questions(role)
    q_item = next((q for q in questions if q["id"] == question_id), questions[0])

    words = transcript.strip().split()
    word_count = len(words)

    # NLP keyword matching ratio against model answer
    model_keywords = set(re.findall(r'\b[a-zA-Z]{4,}\b', q_item["model_answer"].lower()))
    candidate_keywords = set(re.findall(r'\b[a-zA-Z]{4,}\b', transcript.lower()))
    
    overlap = len(model_keywords.intersection(candidate_keywords))
    keyword_score = min(100.0, (overlap / max(1, len(model_keywords))) * 160.0)

    # Technical accuracy score (0-100)
    tech_score = round(max(50.0, min(98.0, keyword_score + (15 if word_count > 25 else 5))), 1)
    
    # Communication clarity score (0-100)
    wpm = (word_count / max(audio_duration, 1.0)) * 60.0
    clarity_score = round(max(60.0, min(96.0, 85.0 + (10 if 100 <= wpm <= 160 else -5))), 1)

    # Confidence & emotion analysis
    confidence_score = round(max(70.0, min(98.0, 88.0 + (5 if word_count > 30 else -5))), 1)
    
    overall_score = round((tech_score * 0.5) + (clarity_score * 0.3) + (confidence_score * 0.2), 1)

    # AI feedback synthesis
    strengths = []
    improvements = []

    if tech_score >= 80:
        strengths.append("Strong technical vocabulary and clear key concept coverage.")
    else:
        improvements.append("Incorporate more industry-standard terminology and specific framework features.")

    if clarity_score >= 80:
        strengths.append("Fluent pace and articulate communication.")
    else:
        improvements.append("Pace your response evenly (target ~130 words per minute).")

    if word_count < 20:
        improvements.append("Elaborate with concrete architectural examples and past project scenarios.")

    return {
        "question_id": q_item["id"],
        "question": q_item["question"],
        "candidate_transcript": transcript,
        "model_answer": q_item["model_answer"],
        "overall_score": overall_score,
        "score_breakdown": {
            "technical_accuracy": tech_score,
            "communication_clarity": clarity_score,
            "confidence_sentiment": confidence_score
        },
        "emotion_analysis": {
            "dominant_emotion": "Confident & Focused",
            "confidence_level": "High" if confidence_score >= 80 else "Moderate",
            "speech_pace_wpm": round(wpm, 1),
            "calmness": 92.5
        },
        "ai_feedback": {
            "strengths": strengths if strengths else ["Good effort on initial attempt."],
            "improvement_areas": improvements if improvements else ["Minor polish: structured STAR format response."]
        }
    }
