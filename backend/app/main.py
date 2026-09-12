from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models.nexa_models  # Ensure ORM models are registered

# Automatically create SQLite tables on application startup
Base.metadata.create_all(bind=engine)

from app.routes import (
    resume_routes,
    skill_gap_routes,
    learning_routes,
    assessment_routes,
    interview_routes,
    job_routes,
)

app = FastAPI(
    title="NexaPrep AI Backend",
    description="Development of AI Based Intelligent System for Personalized Career Preparation and Mock Interview Simulation System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NexaPrep AI Routers
app.include_router(resume_routes.router)
app.include_router(skill_gap_routes.router)
app.include_router(learning_routes.router)
app.include_router(assessment_routes.router)
app.include_router(interview_routes.router)
app.include_router(job_routes.router)

@app.get("/")
def read_root():
    return {
        "system": "NexaPrep AI",
        "title": "Development of AI Based Intelligent System for Personalized Career Preparation and Mock Interview Simulation System",
        "status": "Online",
        "database": "SQLite persistent (nexa_prep.db)",
        "supported_roles": 13,
        "features": [
            "01 Resume Analysis & Persistent Storage (SQLite)",
            "02 Skill Gap Detection (13 Job Roles)",
            "03 Personalized Learning Plan",
            "04 Skill Assessment (30s Timed Quiz)",
            "05 Voice Mock Interview (Real-time Speech-to-Text)",
            "06 Job Recommendation (LinkedIn / Naukri / Internshala)"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "system": "NexaPrep AI Backend", "db": "SQLite connected"}