QUESTION_BANK = {
    "Full Stack Developer": [
        {
            "id": 1,
            "question": "Which HTTP method is idempotent and used for replacing an existing resource in RESTful APIs?",
            "options": ["POST", "PUT", "PATCH", "DELETE"],
            "correct": 1,
            "explanation": "PUT is idempotent and replaces the target resource with the request payload.",
            "timer_seconds": 30
        },
        {
            "id": 2,
            "question": "What is the Virtual DOM in React?",
            "options": [
                "A direct copy of the browser's HTML DOM stored on server",
                "A lightweight in-memory representation of the real DOM",
                "A CSS rendering engine",
                "A database cache mechanism"
            ],
            "correct": 1,
            "explanation": "The Virtual DOM is a lightweight JS representation of the real DOM that React uses for efficient reconciliation.",
            "timer_seconds": 30
        },
        {
            "id": 3,
            "question": "In Node.js, what does the Event Loop do?",
            "options": [
                "Executes synchronous code in parallel across 8 threads",
                "Handles non-blocking I/O operations by offloading tasks and executing callbacks",
                "Manages database connections",
                "Compiles JavaScript into machine code"
            ],
            "correct": 1,
            "explanation": "The Event Loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.",
            "timer_seconds": 30
        },
        {
            "id": 4,
            "question": "Which SQL clause is used to filter records AFTER an aggregation operation?",
            "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
            "correct": 1,
            "explanation": "HAVING filters aggregated groups created by GROUP BY, while WHERE filters individual rows before aggregation.",
            "timer_seconds": 30
        },
        {
            "id": 5,
            "question": "What is CORS in web application architecture?",
            "options": [
                "Cross-Origin Resource Sharing security mechanism enforced by browsers",
                "Centralized Object Rendering System",
                "Client-side Object Routing Protocol",
                "Database indexing standard"
            ],
            "correct": 0,
            "explanation": "CORS is an HTTP-header based mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources.",
            "timer_seconds": 30
        }
    ],
    "AI/ML Engineer": [
        {
            "id": 1,
            "question": "What problem does the activation function solve in neural networks?",
            "options": [
                "Increases training speed",
                "Introduces non-linearity to learn complex non-linear patterns",
                "Prevents overfitting automatically",
                "Normalizes dataset features"
            ],
            "correct": 1,
            "explanation": "Activation functions introduce non-linear properties to neural networks, allowing them to learn complex data representations.",
            "timer_seconds": 30
        },
        {
            "id": 2,
            "question": "What is the primary cause of Overfitting in machine learning models?",
            "options": [
                "Model has too few parameters",
                "Model learns the noise and details of training data too closely",
                "Dataset is too large",
                "Learning rate is set to zero"
            ],
            "correct": 1,
            "explanation": "Overfitting happens when a model fits the training data too closely, capturing noise and failing to generalize to unseen test data.",
            "timer_seconds": 30
        },
        {
            "id": 3,
            "question": "In Transformer architectures, what is the core purpose of Self-Attention?",
            "options": [
                "To reduce input image resolution",
                "To compute contextual relationships between all words/tokens in a sequence dynamically",
                "To replace gradient descent optimization",
                "To split text into characters"
            ],
            "correct": 1,
            "explanation": "Self-attention enables the model to weigh the relevance of different tokens relative to each other regardless of positional distance.",
            "timer_seconds": 30
        }
    ]
}

def get_quiz_questions(role: str) -> dict:
    """Retrieve role-specific MCQs with 30-second countdown timer setting."""
    questions = QUESTION_BANK.get(role, QUESTION_BANK["Full Stack Developer"])
    # Strip correct answer from student view
    student_questions = []
    for q in questions:
        student_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "timer_seconds": q["timer_seconds"]
        })
    
    return {
        "role": role,
        "total_questions": len(student_questions),
        "timer_per_question": 30,
        "questions": student_questions
    }

def evaluate_quiz_submission(role: str, user_answers: dict) -> dict:
    """
    Grade user answers, return total score, percentage, grade (A+, A, B, Fail),
    and per-question correct answer explanations.
    """
    questions = QUESTION_BANK.get(role, QUESTION_BANK["Full Stack Developer"])
    total = len(questions)
    correct_count = 0
    detailed_results = []

    for q in questions:
        q_id = str(q["id"])
        selected = user_answers.get(q_id)
        is_correct = selected == q["correct"]
        if is_correct:
            correct_count += 1
        
        detailed_results.append({
            "id": q["id"],
            "question": q["question"],
            "user_selected": selected,
            "correct_option": q["correct"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })

    score_pct = round((correct_count / total) * 100, 1) if total > 0 else 0
    grade = "A+" if score_pct >= 90 else ("A" if score_pct >= 75 else ("B" if score_pct >= 60 else "C (Needs Review)"))

    return {
        "role": role,
        "total_questions": total,
        "correct_answers": correct_count,
        "score_percentage": score_pct,
        "grade": grade,
        "passed": score_pct >= 60,
        "details": detailed_results
    }
