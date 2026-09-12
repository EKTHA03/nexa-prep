from fastapi import APIRouter
from app.services.job_service import get_job_recommendations

router = APIRouter(prefix="/api/jobs", tags=["Job Recommendations"])

@router.post("/recommendations")
def recommend_jobs(payload: dict):
    """
    Generate best-fit job role recommendations with fit scores (%)
    and direct search action links for LinkedIn, Naukri, and Internshala.
    Payload: {"skills": ["Python", "React", "SQL"], "location": "India"}
    """
    skills = payload.get("skills", ["Python", "JavaScript", "React", "Node.js"])
    location = payload.get("location", "India")
    return get_job_recommendations(skills, location)
