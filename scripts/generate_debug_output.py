"""
Nexa Prep — 5-Stage Skill Matching Diagnostic Script
Produces debug_output.txt with all intermediate values.
Run: venv\Scripts\python.exe generate_debug_output.py
"""
import json
import os
import sys
import re
import sqlite3
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))
from app.services.pdf_service import SKILL_TAXONOMY, CANONICAL_MAP

# ─────────────────────────────────────────────────────────────
# STAGE 1: Raw PDF text (from DB or fallback PDF)
# ─────────────────────────────────────────────────────────────
raw_text = ""
filename = ""

try:
    conn = sqlite3.connect(str(BACKEND_DIR / "nexa_prep.db"))
    row = conn.execute("SELECT filename, raw_text FROM nexa_resumes ORDER BY id DESC LIMIT 1").fetchone()
    if row and row[1]:
        filename, raw_text = row[0], row[1]
    conn.close()
except Exception as e:
    print(f"[WARN] DB read failed: {e}")

# Fallback: scan Desktop for any resume PDF
if not raw_text:
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    for f in os.listdir(desktop):
        if f.lower().endswith(".pdf") and ("resume" in f.lower() or "cv" in f.lower()):
            import pypdf
            try:
                with open(os.path.join(desktop, f), "rb") as fh:
                    reader = pypdf.PdfReader(fh)
                    for page in reader.pages:
                        t = page.extract_text()
                        if t:
                            raw_text += t + "\n"
                filename = f
                break
            except Exception as e:
                print(f"[WARN] Could not read {f}: {e}")

# ─────────────────────────────────────────────────────────────
# STAGE 2: Raw extracted skills (before normalization)
# ─────────────────────────────────────────────────────────────
cleaned_text = re.sub(r'[\u2022\u25cf\u25cb\u25aa\u25ab\u2023\u2043\u2219\t\r\n]+', ' ', raw_text)
cleaned_text = re.sub(r'([a-zA-Z0-9+#])[\.,;:!?\'\"()\[\]{}](\s|$)', r'\1 \2', cleaned_text)
lower_text = f" {cleaned_text.lower()} "

raw_extracted_skills = []
for category, skills in SKILL_TAXONOMY.items():
    for skill in skills:
        escaped = re.escape(skill.lower())
        pattern = r'(?:^|[^a-z0-9+#])' + escaped + r'(?:$|[^a-z0-9+#])'
        if re.search(pattern, lower_text):
            raw_extracted_skills.append(skill)

# ─────────────────────────────────────────────────────────────
# STAGE 3: Normalized / deduplicated skills via CANONICAL_MAP
# ─────────────────────────────────────────────────────────────
normalized_skills_set = set()
for s in raw_extracted_skills:
    canon = CANONICAL_MAP.get(s.lower())
    if canon:
        normalized_skills_set.add(canon)
    # If no mapping, do NOT drop — pass through with proper title-casing
    # (mirrors deduplicate.ts fallback behavior)
normalized_skills = sorted(list(normalized_skills_set))

# ─────────────────────────────────────────────────────────────
# STAGE 4: Required skills for AI Engineer
# Source of truth: src/config/jobRequirements.ts  id='ai-engineer'
# ─────────────────────────────────────────────────────────────
ai_engineer_required = [
    "Python",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "PyTorch",
    "TensorFlow",
    "Generative AI",
    "Transformers",
    "LangChain",
    "LLMs",
    "Vector Databases",
    "Model Fine-Tuning (LoRA)",
]

# ─────────────────────────────────────────────────────────────
# STAGE 5: Final comparison (mirrors skillMatcher.ts isSkillMatched)
# 1. Exact lowercase match
# 2. Alphanumeric-stripped match (c++ → cpp, node.js → nodejs)
# 3. Alias lookup via CANONICAL_MAP keys (backend approximation)
# ─────────────────────────────────────────────────────────────
def clean_alphanum(s: str) -> str:
    return re.sub(r'[^a-z0-9]', '', s.lower().strip())

BACKEND_ALIASES = {
    "computer vision": ["computer vision", "cv", "opencv", "cv2", "image processing"],
    "generative ai":   ["generative ai", "genai", "gen ai", "gpt", "generative-ai"],
    "transformers":    ["transformers", "huggingface", "hugging face", "bert"],
    "langchain":       ["langchain", "llamaindex", "langgraph"],
    "llms":            ["llm", "llms", "large language model", "large language models"],
    "vector databases":["vector databases", "vector database", "vector db", "faiss", "pinecone", "chroma", "weaviate"],
    "model fine-tuning (lora)": ["model fine-tuning", "fine-tuning", "lora", "qlora", "peft", "finetuning"],
    "nlp":             ["nlp", "natural language processing", "spacy", "nltk", "bert"],
    "pytorch":         ["pytorch", "torch"],
    "tensorflow":      ["tensorflow", "tf", "keras"],
    "deep learning":   ["deep learning", "dl", "neural network", "neural networks", "cnn", "rnn"],
    "python":          ["python", "py", "python3"],
}

matched = []
missing = []

for req in ai_engineer_required:
    req_lower = req.lower().strip()
    req_clean = clean_alphanum(req)
    aliases = BACKEND_ALIASES.get(req_lower, [req_lower])
    is_matched = False

    for cand in normalized_skills:
        cand_lower = cand.lower().strip()
        cand_clean = clean_alphanum(cand)

        # Rule 1: Exact lowercase match
        if req_lower == cand_lower:
            is_matched = True; break
        # Rule 2: Alphanumeric match
        if req_clean and cand_clean and req_clean == cand_clean:
            is_matched = True; break
        # Rule 3: Alias check
        if cand_lower in aliases or cand_clean in [clean_alphanum(a) for a in aliases]:
            is_matched = True; break

    if is_matched:
        matched.append(req)
    else:
        missing.append(req)

# ─────────────────────────────────────────────────────────────
# Write debug_output.txt
# ─────────────────────────────────────────────────────────────
with open("debug_output.txt", "w", encoding="utf-8") as out:
    out.write(f"=== RAW EXTRACTED TEXT ===\nFilename: {filename}\nText Length: {len(raw_text)} chars\n\n{raw_text}\n\n")
    out.write(f"=== RAW EXTRACTED SKILLS ===\nTotal Raw Found: {len(raw_extracted_skills)}\n{json.dumps(raw_extracted_skills, indent=2)}\n\n")
    out.write(f"=== NORMALIZED SKILLS ===\nTotal Normalized: {len(normalized_skills)}\n{json.dumps(normalized_skills, indent=2)}\n\n")
    out.write(f"=== REQUIRED SKILLS FOR AI ENGINEER ===\nTotal Required: {len(ai_engineer_required)}\n{json.dumps(ai_engineer_required, indent=2)}\n\n")
    out.write(f"=== FINAL COMPARISON RESULT ===\n")
    out.write(f"Matched ({len(matched)}): {json.dumps(matched, indent=2)}\n")
    out.write(f"Missing ({len(missing)}): {json.dumps(missing, indent=2)}\n")

print("Generated debug_output.txt successfully.")
print(f"  Matched: {matched}")
print(f"  Missing: {missing}")
