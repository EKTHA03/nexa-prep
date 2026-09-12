import sys, os, re, json
from pathlib import Path
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))
from app.services.pdf_service import SKILL_TAXONOMY, CANONICAL_MAP
from app.services.skill_gap_service import analyze_skill_gaps

print("=== FALSE-POSITIVE REGRESSION: ML Engineer role ===")
test_false_skills = ['Java', 'JavaScript', 'R', 'Statistics', 'Python']
result = analyze_skill_gaps(test_false_skills, 'Machine Learning Engineer')
print("Matched:", result["matched_skills"])
print("Missing:", result["missing_skills"])
print("Score:", str(result["target_match_percentage"]) + "%")
print()

print("=== AI ENGINEER REGRESSION ===")
test_ai_skills = ['Python', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'Transformers']
result2 = analyze_skill_gaps(test_ai_skills, 'AI Engineer')
print("Matched:", result2["matched_skills"])
print("Missing:", result2["missing_skills"])
print("Score:", str(result2["target_match_percentage"]) + "%")
print()

print("=== DEVOPS ENGINEER REGRESSION (different role) ===")
test_devops_skills = ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Python']
result3 = analyze_skill_gaps(test_devops_skills, 'DevOps Engineer')
print("Matched:", result3["matched_skills"])
print("Missing:", result3["missing_skills"])
print("Score:", str(result3["target_match_percentage"]) + "%")
print()

print("=== EKTHA RESUME AGAINST AI ENGINEER ===")
ektha_normalized = ['Python', 'Java', 'SQL', 'Flask', 'Machine Learning', 'Deep Learning',
                    'NLP', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Computer Vision',
                    'Transformers', 'Excel', 'Tableau', 'PowerBI', 'Data Visualization', 'MySQL', 'AWS', 'Arduino']
result4 = analyze_skill_gaps(ektha_normalized, 'AI Engineer')
print("Matched:", result4["matched_skills"])
print("Missing:", result4["missing_skills"])
print("Score:", str(result4["target_match_percentage"]) + "%")
