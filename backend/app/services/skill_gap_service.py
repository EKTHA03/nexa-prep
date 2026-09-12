import re

# 13 Specific Job Roles matching exact user specification
JOB_ROLES_REQUIREMENTS = {
    "Software Engineer": {
        "required": ["Data Structures & Algorithms", "System Design", "Java", "Python", "C++", "SQL", "Git", "OOP", "REST API", "Docker", "Kubernetes", "CI/CD"],
        "recommended": ["Linux", "PostgreSQL", "Unit Testing"]
    },
    "Data Analyst": {
        "required": ["SQL", "Python", "Excel", "Tableau", "PowerBI", "Data Visualization", "Pandas", "Statistics", "BigQuery", "Data Warehousing", "ETL Pipelines"],
        "recommended": ["PostgreSQL", "R", "Data Mining"]
    },
    "Machine Learning Engineer": {
        "required": ["Python", "Machine Learning", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy", "Linear Algebra", "Statistics", "MLOps", "Model Deployment", "CUDA Optimization"],
        "recommended": ["NLP", "Computer Vision", "Docker", "Git"]
    },
    "Robotics Engineer": {
        "required": ["C++", "Python", "ROS (Robot Operating System)", "Control Systems", "Kinematics", "Microcontrollers", "OpenCV", "CAD", "SLAM (Localization)", "Gazebo Simulation"],
        "recommended": ["Embedded Linux", "RTOS", "Sensor Fusion"]
    },
    "Web Developer": {
        "required": ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Node.js", "Tailwind", "Git", "REST API", "Next.js", "GraphQL", "Core Web Vitals"],
        "recommended": ["Express", "MongoDB", "Vite"]
    },
    "Data Scientist": {
        "required": ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "Statistics", "Pandas", "Data Mining", "Apache Spark", "A/B Testing", "Big Data Analytics"],
        "recommended": ["PyTorch", "Hadoop", "Data Modeling"]
    },
    "DevOps Engineer": {
        "required": ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Git", "Bash Shell", "Ansible", "Prometheus & Grafana", "Helm Charts"],
        "recommended": ["Nginx", "Jenkins", "GCP", "Python"]
    },
    "Embedded Systems Engineer": {
        "required": ["C", "C++", "Microcontrollers", "RTOS", "ARM Architecture", "Circuit Design", "Firmware", "Embedded Linux", "CAN Bus Protocol", "Device Drivers"],
        "recommended": ["PCB Design", "SPI/I2C/UART", "Assembly"]
    },
    "Mechanical Engineer": {
        "required": ["SolidWorks", "AutoCAD", "Thermodynamics", "Fluid Mechanics", "ANSYS", "FEA", "Manufacturing", "GD&T", "Computational Fluid Dynamics (CFD)", "CAM Machining"],
        "recommended": ["MATLAB", "3D Printing", "CAD/CAM"]
    },
    "AI Engineer": {
        "required": ["Python", "Deep Learning", "NLP", "Computer Vision", "PyTorch", "TensorFlow", "Generative AI", "Transformers", "LangChain", "LLMs", "Vector Databases", "Model Fine-Tuning (LoRA)"],
        "recommended": ["ONNX Optimization", "OpenAI API", "FastAPI"]
    },
    "Civil Engineer": {
        "required": ["AutoCAD", "STAAD Pro", "Structural Analysis", "Surveying", "Concrete Technology", "Geotechnical", "Revit", "ETABS Software", "BIM Coordination"],
        "recommended": ["GIS", "Estimation & Costing", "Project Management"]
    },
    "Electrical Engineer": {
        "required": ["MATLAB", "Simulink", "Circuit Theory", "Power Systems", "Control Systems", "PLC Programming", "PCB Design", "SCADA Automation", "High Voltage Protection"],
        "recommended": ["LabVIEW", "Power Electronics", "Microprocessors"]
    },
    "IoT Engineer": {
        "required": ["Embedded C", "Python", "Arduino", "Raspberry Pi", "MQTT", "Zigbee", "Wireless Sensors", "IoT Cloud Platforms", "LoRaWAN Protocol", "Edge AI"],
        "recommended": ["ESP32", "NodeMCU", "Bluetooth LE", "Cyber Security"]
    }
}

SKILL_ALIASES = {
    "sql": ["sql", "structured query language", "t-sql", "tsql", "plsql", "ansi sql"],
    "mysql": ["mysql", "my sql", "mariadb"],
    "postgresql": ["postgresql", "postgres", "pg"],
    "python": ["python", "py", "python3", "python 3"],
    "excel": ["excel", "ms excel", "microsoft excel", "vlookup", "pivot table", "spreadsheet"],
    "tableau": ["tableau", "tableau desktop", "tableau public"],
    "powerbi": ["powerbi", "power bi", "microsoft power bi", "power-bi"],
    "data visualization": ["data visualization", "data viz", "dataviz", "visualization", "dashboards"],
    "pandas": ["pandas", "dataframe", "dataframes"],
    "statistics": ["statistics", "stats", "statistical analysis", "probability"],
    "data structures & algorithms": ["data structures & algorithms", "data structures", "algorithms", "dsa", "data structures and algorithms", "leetcode"],
    "system design": ["system design", "software architecture", "system architecture"],
    "java": ["java", "j2ee", "core java"],
    "c++": ["c++", "cpp", "c plus plus", "cplusplus"],
    "c": ["c language", "embedded c", "ansi c", "c programming"],
    "git": ["git", "github", "gitlab", "version control"],
    "oop": ["oop", "object oriented", "object-oriented", "oops"],
    "rest api": ["rest api", "rest apis", "restful api", "restful", "rest"],
    "machine learning": ["machine learning", "ml"],
    "scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "pytorch": ["pytorch", "torch"],
    "tensorflow": ["tensorflow", "tf"],
    "numpy": ["numpy"],
    "linear algebra": ["linear algebra", "matrix algebra"],
    "ros (robot operating system)": ["ros", "ros2", "robot operating system"],
    "control systems": ["control systems", "pid", "feedback control"],
    "kinematics": ["kinematics", "dynamics", "motion planning"],
    "microcontrollers": ["microcontroller", "microcontrollers", "stm32", "esp32", "atmega"],
    "opencv": ["opencv", "opencv-python", "cv2"],
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
    "model fine-tuning (lora)": ["model fine-tuning", "fine-tuning", "lora", "qlora", "peft"],
    "onnx optimization": ["onnx", "onnx optimization", "onnx runtime"],
    "staad pro": ["staad", "staad pro", "staad.pro"],
    "structural analysis": ["structural analysis", "structures"],
    "surveying": ["surveying"],
    "concrete technology": ["concrete technology", "concrete", "rcc"],
    "geotechnical": ["geotechnical", "soil mechanics"],
    "revit": ["revit", "bim"],
    "matlab": ["matlab"],
    "simulink": ["simulink"],
    "circuit theory": ["circuit theory", "circuits"],
    "power systems": ["power systems"],
    "plc programming": ["plc", "scada", "plc programming"],
    "pcb design": ["pcb", "altium", "kicad"],
    "embedded c": ["embedded c", "embedded-c"],
    "arduino": ["arduino", "arduino ide"],
    "raspberry pi": ["raspberry pi", "rpi"],
    "mqtt": ["mqtt", "coap"],
    "zigbee": ["zigbee", "bluetooth", "ble"],
    "wireless sensors": ["wireless sensor", "wireless sensors", "wsn"],
    "iot cloud platforms": ["iot cloud", "thingspeak", "aws iot"]
}

def clean_alphanumeric(s: str) -> str:
    return re.sub(r'[^a-z0-9]', '', s.lower().strip())

def matches_skill(req: str, cand: str) -> bool:
    req_norm = req.lower().strip()
    cand_norm = cand.lower().strip()
    
    if req_norm == cand_norm:
        return True
        
    req_clean = clean_alphanumeric(req)
    cand_clean = clean_alphanumeric(cand)
    if req_clean and cand_clean and req_clean == cand_clean:
        return True
        
    aliases = SKILL_ALIASES.get(req_norm, [])
    if cand_norm in aliases or cand_clean in [clean_alphanumeric(a) for a in aliases]:
        return True
        
    return False

def analyze_skill_gaps(candidate_skills: list, target_role: str = "Software Engineer") -> dict:
    cand_cleaned = [s.strip() for s in candidate_skills if s and s.strip()]
    role_comparisons = []

    for role_name, reqs in JOB_ROLES_REQUIREMENTS.items():
        required = reqs["required"]
        matched_req = []
        for req_skill in required:
            for cand_skill in cand_cleaned:
                if matches_skill(req_skill, cand_skill):
                    matched_req.append(req_skill)
                    break
                    
        missing_req = [s for s in required if s not in matched_req]
        score = min(95.0, round((len(matched_req) / len(required)) * 100, 1)) if required else 0.0

        role_comparisons.append({
            "role": role_name,
            "match_percentage": score,
            "matched_skills": matched_req,
            "missing_skills": missing_req,
            "total_required": len(required),
            "status": "Skills OK" if len(missing_req) == 0 else "Skill Gaps Found"
        })

    role_comparisons.sort(key=lambda x: x["match_percentage"], reverse=True)
    target_data = next((r for r in role_comparisons if r["role"] == target_role), role_comparisons[0])
    has_gaps = len(target_data["missing_skills"]) > 0

    # Debug logs per Issue 1 specification
    print(f"\n--- [Backend Skill Gap Analysis] Target Role: {target_data['role']} ---")
    print(f" (a) Raw extracted skills from resume: {candidate_skills}")
    print(f" (b) Required skills for target role: {JOB_ROLES_REQUIREMENTS.get(target_data['role'], {}).get('required', [])}")
    print(f" (c) Final missing skills list: {target_data['missing_skills']}")
    print(f" Matched skills: {target_data['matched_skills']} ({target_data['match_percentage']}%)\n")

    return {
        "target_role": target_data["role"],
        "target_match_percentage": target_data["match_percentage"],
        "matched_skills": target_data["matched_skills"],
        "missing_skills": target_data["missing_skills"],
        "skill_gaps_found": has_gaps,
        "gap_status_message": "Skill gaps found — learning plan recommended" if has_gaps else "Skills OK — proceed directly to assessment!",
        "all_roles_overview": role_comparisons
    }

