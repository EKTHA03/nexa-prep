import sys
import os, json, sqlite3
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.services.pdf_service import extract_text_from_pdf, analyze_resume_text
from app.services.skill_gap_service import analyze_skill_gaps, JOB_ROLES_REQUIREMENTS

raw_text = ""
filename = ""

try:
    conn = sqlite3.connect(str(BACKEND_DIR / "nexa_prep.db"))
    row = conn.execute("SELECT filename, raw_text FROM nexa_resumes ORDER BY id DESC LIMIT 1").fetchone()
    if row and row[1]:
        filename, raw_text = row[0], row[1]
    conn.close()
except Exception as e:
    print(f"[WARN] DB read error: {e}")

if not raw_text:
    desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    for f in os.listdir(desktop):
        if f.lower().endswith('.pdf'):
            with open(os.path.join(desktop, f), 'rb') as fh:
                raw_text = extract_text_from_pdf(fh.read())
            filename = f
            if raw_text:
                break

analysis = analyze_resume_text(raw_text)
extracted_skills = analysis['extracted_skills']

selected_role = "Software Engineer"
gap_res = analyze_skill_gaps(extracted_skills, selected_role)

matched_skills = gap_res['matched_skills']
missing_skills = gap_res['missing_skills']
required_skills = JOB_ROLES_REQUIREMENTS.get(selected_role, {}).get('required', [])

with open("debug_output.txt", "w", encoding="utf-8") as out:
    out.write(f"=== RAW EXTRACTED TEXT ===\nFilename: {filename}\nText Length: {len(raw_text)} chars\n\n{raw_text}\n\n")
    out.write(f"=== RAW EXTRACTED SKILLS ===\nTotal Raw Found: {len(extracted_skills)}\n{json.dumps(extracted_skills, indent=2)}\n\n")
    out.write(f"=== NORMALIZED SKILLS ===\nTotal Normalized: {len(extracted_skills)}\n{json.dumps(extracted_skills, indent=2)}\n\n")
    out.write(f"=== REQUIRED SKILLS FOR {selected_role.upper()} ===\nTotal Required: {len(required_skills)}\n{json.dumps(required_skills, indent=2)}\n\n")
    out.write(f"=== FINAL MATCHED LIST ===\n{json.dumps(matched_skills, indent=2)}\n\n")
    out.write(f"=== FINAL PARTIAL LIST ===\n[]\n\n")
    out.write(f"=== FINAL MISSING LIST ===\n{json.dumps(missing_skills, indent=2)}\n")

print("Generated debug_output.txt successfully.")
