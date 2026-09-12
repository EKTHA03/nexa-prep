from fastapi import APIRouter
from app.services.assessment_service import get_quiz_questions, evaluate_quiz_submission

router = APIRouter(prefix="/api/assessment", tags=["Skill Assessment Quiz"])

@router.get("/quiz/{role}")
def get_quiz_by_role(role: str):
    """Retrieve 30-second timed MCQ questions for the selected job role."""
    return get_quiz_questions(role)

@router.post("/submit")
def submit_quiz(payload: dict):
    """
    Evaluate candidate MCQ answers, return total score, grade, pass/fail status.
    Payload: {"role": "Full Stack Developer", "answers": {"1": 1, "2": 1, "3": 1}}
    """
    role = payload.get("role", "Full Stack Developer")
    answers = payload.get("answers", {})
    return evaluate_quiz_submission(role, answers)
