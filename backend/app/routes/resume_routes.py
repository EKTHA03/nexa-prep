import json
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.pdf_service import extract_text_from_pdf, analyze_resume_text
from app.models.nexa_models import NexaUser, NexaResume, NexaSkillAnalysis

router = APIRouter(prefix="/api/resume", tags=["Resume Analysis"])

def get_or_create_user(db: Session, email_or_id: Optional[str] = "guest") -> NexaUser:
    clean_id = (email_or_id or "guest").strip().lower()
    user = db.query(NexaUser).filter(NexaUser.guest_id == clean_id).first()
    if not user:
        user = NexaUser(guest_id=clean_id, name=clean_id.split('@')[0].capitalize())
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    x_user_email: Optional[str] = Header(None, alias="X-User-Email"),
    user_email: Optional[str] = Query(None)
):
    """Upload PDF resume, parse text, extract skills, and persist to SQLite database per user."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")

    target_email = x_user_email or user_email or "guest"
    pdf_bytes = await file.read()
    raw_text = extract_text_from_pdf(pdf_bytes)

    if not raw_text.strip():
        print(f"[WARN] No text extracted from {file.filename}.")
        raw_text = ""

    analysis = analyze_resume_text(raw_text)
    analysis["filename"] = file.filename

    # SQLite Persistence per User
    user = get_or_create_user(db, target_email)
    db_resume = NexaResume(
        user_id=user.id,
        filename=file.filename,
        raw_text=raw_text
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    extracted = analysis.get("extracted_skills") or analysis.get("extractedSkills") or []
    db_analysis = NexaSkillAnalysis(
        resume_id=db_resume.id,
        target_role="Software Engineer",
        extracted_skills_json=json.dumps(extracted),
        matched_skills_json=json.dumps(extracted),
        missing_skills_json=json.dumps([]),
        match_percent=float(min(95.0, analysis.get("accuracy_score") or analysis.get("accuracyScore") or 85.0))
    )
    db.add(db_analysis)
    db.commit()

    analysis["id"] = db_resume.id
    analysis["extractedSkills"] = extracted
    analysis["extracted_skills"] = extracted
    return analysis

@router.get("/latest")
def get_latest_resume(
    db: Session = Depends(get_db),
    x_user_email: Optional[str] = Header(None, alias="X-User-Email"),
    user_email: Optional[str] = Query(None)
):
    """Fetch the latest saved resume and analysis from SQLite for the specific logged in user."""
    target_email = x_user_email or user_email or "guest"
    user = get_or_create_user(db, target_email)
    latest_resume = db.query(NexaResume).filter(NexaResume.user_id == user.id).order_by(NexaResume.id.desc()).first()
    if not latest_resume:
        return {"hasResume": False}

    latest_analysis = latest_resume.latest_analysis
    extracted = latest_analysis.extracted_skills if latest_analysis else []

    return {
        "hasResume": True,
        "id": latest_resume.id,
        "filename": latest_resume.filename,
        "raw_text": latest_resume.raw_text,
        "extractedSkills": extracted,
        "uploaded_at": latest_resume.uploaded_at.isoformat() if latest_resume.uploaded_at else None
    }

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """Explicit Delete Resume action: removes record and related analysis from SQLite database."""
    resume = db.query(NexaResume).filter(NexaResume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    
    db.delete(resume)
    db.commit()
    return {"status": "success", "message": f"Resume #{resume_id} deleted successfully."}

@router.delete("/clear/all")
def clear_all_resumes(
    db: Session = Depends(get_db),
    x_user_email: Optional[str] = Header(None, alias="X-User-Email"),
    user_email: Optional[str] = Query(None)
):
    """Delete all stored resumes and analysis records for the specific logged in user."""
    target_email = x_user_email or user_email or "guest"
    user = get_or_create_user(db, target_email)
    db.query(NexaResume).filter(NexaResume.user_id == user.id).delete()
    db.commit()
    return {"status": "success", "message": f"All resumes for {target_email} deleted successfully."}
