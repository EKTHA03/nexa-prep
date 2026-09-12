from fastapi import APIRouter
from app.services.interview_service import get_interview_questions, evaluate_interview_answer

router = APIRouter(prefix="/api/interview", tags=["Voice Mock Interview"])

@router.get("/questions/{role}")
def get_questions(role: str):
    """Retrieve interview prompts & model answers for the specified job role."""
    return {
        "role": role,
        "questions": get_interview_questions(role)
    }

@router.post("/evaluate")
def evaluate_response(payload: dict):
    """
    Evaluate candidate's spoken/transcribed answer using AI scoring.
    Payload: {"role": "Full Stack Developer", "question_id": "q1", "transcript": "...", "audio_duration": 15.0}
    """
    role = payload.get("role", "Full Stack Developer")
    question_id = payload.get("question_id", "q1")
    transcript = payload.get("transcript", "")
    duration = float(payload.get("audio_duration", 15.0))

    return evaluate_interview_answer(role, question_id, transcript, duration)
