import sys
from pathlib import Path
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))
import json

from app.services.pdf_service import extract_text_from_pdf, analyze_resume_text
from app.services.skill_gap_service import analyze_skill_gaps

# Strict alias dictionary without cross-skill inference
STRICT_ALIASES = {
    "sql": ["sql", "structured query language", "t-sql", "tsql", "pl/sql", "plsql", "ansi sql"],
    "mysql": ["mysql", "my sql", "mariadb"],
    "postgresql": ["postgresql", "postgres", "pg"],
    "python": ["python", "py", "python3", "python 3"],
    "excel": ["excel", "ms excel", "microsoft excel", "vlookup", "xlookup", "pivot tables", "spreadsheet"],
    "tableau": ["tableau", "tableau desktop", "tableau public"],
    "powerbi": ["powerbi", "power bi", "microsoft power bi", "power-bi"],
    "data visualization": ["data visualization", "data viz", "dataviz", "visualization", "dashboards"],
    "pandas": ["pandas", "dataframe", "dataframes"],
    "statistics": ["statistics", "stats", "statistical analysis", "probability"],
    "data structures & algorithms": ["data structures & algorithms", "data structures and algorithms", "data structures", "algorithms", "dsa", "leetcode"],
    "system design": ["system design", "software architecture", "system architecture"],
    "java": ["java", "j2ee", "core java"],
    "c++": ["c++", "cpp", "c plus plus", "cplusplus"],
    "c": ["c language", "embedded c", "ansi c", "c programming"],
    "git": ["git", "github", "gitlab", "version control"],
    "oop": ["oop", "object oriented", "object-oriented", "oops"],
    "rest api": ["rest api", "rest apis", "restful api", "restful", "rest"],
    "machine learning": ["machine learning", "ml"],
    "pytorch": ["pytorch", "torch"],
    "tensorflow": ["tensorflow", "tf", "keras"],
    "numpy": ["numpy"],
    "linear algebra": ["linear algebra", "matrix algebra"],
    "ros (robot operating system)": ["ros", "ros2", "robot operating system"],
    "control systems": ["control systems", "pid", "feedback control"],
    "kinematics": ["kinematics", "dynamics", "motion planning"],
    "microcontrollers": ["microcontroller", "microcontrollers", "stm32", "esp32", "atmega"],
    "opencv": ["opencv", "opencv-python", "cv2", "open-cv"],
    "computer vision": ["computer vision", "cv", "vision algorithms"],
    "cad": ["cad", "computer aided design", "autocad", "solidworks"],
    "html5": ["html5", "html"],
    "css3": ["css3", "css", "sass", "scss"],
    "javascript": ["javascript", "js", "es6", "vanilla js"],
    "typescript": ["typescript", "ts"],
    "react": ["react", "react.js", "reactjs"],
    "node.js": ["node.js", "nodejs", "node js", "node"],
    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
    "r": ["r programming", "r studio", "r language"],
    "deep learning": ["deep learning", "dl", "neural network", "neural networks"],
    "data mining": ["data mining", "data extraction"],
    "linux": ["linux", "ubuntu", "centos", "unix"],
    "docker": ["docker", "containerization", "containers"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services", "s3", "ec2"],
    "ci/cd": ["ci/cd", "cicd", "continuous integration", "jenkins"],
    "terraform": ["terraform", "iac"],
    "bash shell": ["bash", "shell script", "shell scripting"],
    "ansible": ["ansible"],
    "rtos": ["rtos", "freertos"],
    "arm architecture": ["arm", "arm cortex", "arm architecture"],
    "circuit design": ["circuit design", "schematic design"],
    "firmware": ["firmware", "embedded software"],
    "embedded linux": ["embedded linux", "yocto"],
    "solidworks": ["solidworks", "solid works"],
    "autocad": ["autocad", "auto cad"],
    "thermodynamics": ["thermodynamics", "heat transfer"],
    "fluid mechanics": ["fluid mechanics", "cfd"],
    "ansys": ["ansys", "ansys workbench"],
    "fea": ["fea", "finite element analysis"],
    "manufacturing": ["manufacturing", "cam", "cnc"],
    "gd&t": ["gd&t", "tolerancing"],
    "nlp": ["nlp", "natural language processing", "text mining"],
    "generative ai": ["generative ai", "genai", "gen ai", "generative-ai"],
    "transformers": ["transformers", "huggingface transformers"],
    "langchain": ["langchain", "lang-chain"],
    "llms": ["llm", "llms", "large language model", "large language models"],
    "vector databases": ["vector databases", "vector database", "vector db"],
    "model fine-tuning (lora)": ["model fine-tuning", "fine-tuning", "lora", "qlora", "peft"]
}

# Test on Ektha resume skills
cand_skills = ['AWS', 'Arduino', 'Computer Vision', 'Data Visualization', 'Deep Learning', 'Excel', 'Flask', 'Git', 'Java', 'Machine Learning', 'MySQL', 'NLP', 'NumPy', 'Pandas', 'PowerBI', 'Python', 'SQL', 'Scikit-Learn', 'Tableau', 'TensorFlow', 'Transformers']

print("Strict Aliases Audit on Ektha Resume Skills:")
print("Extracted skills:", cand_skills)
