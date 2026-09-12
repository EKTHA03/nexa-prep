import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")

class Settings:
    PROJECT_NAME: str = "Nexa Prep AI"
    # SQLite path: stored as ./nexa_prep.db relative to the backend directory
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./nexa_prep.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nexa-prep-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
