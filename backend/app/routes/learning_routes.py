from fastapi import APIRouter
from app.services.learning_service import generate_learning_plan

router = APIRouter(prefix="/api/learning", tags=["Personalized Learning Plan"])

@router.post("/plan")
def get_personalized_learning_plan(payload: dict):
    """
    Generate customized learning plan for missing skills with YouTube, Coursera, and documentation links.
    Payload: {"missing_skills": ["Docker", "Kubernetes", "PyTorch"]}
    """
    missing_skills = payload.get("missing_skills", [])
    return generate_learning_plan(missing_skills)
