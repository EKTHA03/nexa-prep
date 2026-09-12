"""
Nexa Prep AI — SQLAlchemy ORM Models (SQLite)

Tables:
  nexa_users           — guest or registered users
  nexa_resumes         — uploaded resume files + raw text
  nexa_skill_analysis  — skill gap analysis results per resume
  nexa_quiz_attempts   — quiz session records
  nexa_interview_sessions — adaptive mock interview session records
"""

import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
)
from sqlalchemy.orm import relationship
from app.database import Base


class NexaUser(Base):
    __tablename__ = "nexa_users"

    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(120), nullable=True)
    email = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("NexaResume", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("NexaQuizAttempt", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("NexaInterviewSession", back_populates="user", cascade="all, delete-orphan")


class NexaResume(Base):
    __tablename__ = "nexa_resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("nexa_users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("NexaUser", back_populates="resumes")
    skill_analyses = relationship("NexaSkillAnalysis", back_populates="resume", cascade="all, delete-orphan")

    @property
    def latest_analysis(self):
        return self.skill_analyses[-1] if self.skill_analyses else None


class NexaSkillAnalysis(Base):
    __tablename__ = "nexa_skill_analysis"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("nexa_resumes.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    extracted_skills_json = Column(Text, nullable=False, default="[]")   # JSON array
    matched_skills_json = Column(Text, nullable=False, default="[]")     # JSON array
    missing_skills_json = Column(Text, nullable=False, default="[]")     # JSON array
    match_percent = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("NexaResume", back_populates="skill_analyses")

    # Convenience helpers for JSON fields
    @property
    def extracted_skills(self):
        return json.loads(self.extracted_skills_json or "[]")

    @extracted_skills.setter
    def extracted_skills(self, value):
        self.extracted_skills_json = json.dumps(value or [])

    @property
    def matched_skills(self):
        return json.loads(self.matched_skills_json or "[]")

    @matched_skills.setter
    def matched_skills(self, value):
        self.matched_skills_json = json.dumps(value or [])

    @property
    def missing_skills(self):
        return json.loads(self.missing_skills_json or "[]")

    @missing_skills.setter
    def missing_skills(self, value):
        self.missing_skills_json = json.dumps(value or [])


class NexaQuizAttempt(Base):
    __tablename__ = "nexa_quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("nexa_users.id"), nullable=False)
    role = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)              # percentage 0–100
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False, default=0)
    answers_json = Column(Text, nullable=False, default="{}")  # {questionId: chosenIndex}
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("NexaUser", back_populates="quiz_attempts")

    @property
    def answers(self):
        return json.loads(self.answers_json or "{}")

    @answers.setter
    def answers(self, value):
        self.answers_json = json.dumps(value or {})


class NexaInterviewSession(Base):
    __tablename__ = "nexa_interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("nexa_users.id"), nullable=False)
    role = Column(String(100), nullable=False)
    questions_asked = Column(Integer, nullable=False, default=0)
    correct_count = Column(Integer, nullable=False, default=0)
    score_label = Column(String(20), nullable=True)      # e.g. "7/8"
    transcript_json = Column(Text, nullable=False, default="{}")
    emotion_log_json = Column(Text, nullable=False, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("NexaUser", back_populates="interview_sessions")

    @property
    def transcript(self):
        return json.loads(self.transcript_json or "{}")

    @transcript.setter
    def transcript(self, value):
        self.transcript_json = json.dumps(value or {})

    @property
    def emotion_log(self):
        return json.loads(self.emotion_log_json or "[]")

    @emotion_log.setter
    def emotion_log(self, value):
        self.emotion_log_json = json.dumps(value or [])
