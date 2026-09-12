from fastapi import APIRouter
from app.services.skill_gap_service import analyze_skill_gaps, JOB_ROLES_REQUIREMENTS

router = APIRouter(prefix="/api/skills", tags=["Skill Gap Detection"])

@router.get("/roles")
def get_supported_job_roles():
    """List the 13 supported industry job roles and their skill requirements."""
    return {
        "total_roles": len(JOB_ROLES_REQUIREMENTS),
        "job_roles": list(JOB_ROLES_REQUIREMENTS.keys()),
        "role_details": JOB_ROLES_REQUIREMENTS
    }

@router.post("/analyze")
def analyze_gaps(payload: dict):
    """
    Detect skill gaps for candidate skills against chosen job role or across all 13 roles.
    Payload: {"skills": ["Python", "React"], "target_role": "Full Stack Developer"}
    """
    candidate_skills = payload.get("skills", [])
    target_role = payload.get("target_role", "Full Stack Developer")
    return analyze_skill_gaps(candidate_skills, target_role)
