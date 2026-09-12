# Curated learning resources database per skill
CURATED_RESOURCES = {
    "Docker": {
        "youtube": [
            {"title": "Docker Tutorial for Beginners [Full Course]", "url": "https://www.youtube.com/watch?v=pTFZFxd4hOI", "duration": "3 hrs", "channel": "TechWorld with Nana"},
            {"title": "Docker in 100 Seconds", "url": "https://www.youtube.com/watch?v=Gjnup-Jqv0U", "duration": "2 mins", "channel": "Fireship"}
        ],
        "coursera": [
            {"title": "Introduction to Containers w/ Docker & Kubernetes", "url": "https://www.coursera.org/learn/ibm-containers-docker-kubernetes", "provider": "IBM"},
            {"title": "Docker for Developers", "url": "https://www.coursera.org/learn/docker-for-developers", "provider": "Coursera Project Network"}
        ],
        "docs": [
            {"title": "Official Docker Getting Started Guide", "url": "https://docs.docker.com/get-started/"},
            {"title": "Docker CLI Reference Cheat Sheet", "url": "https://docs.docker.com/engine/reference/commandline/cli/"}
        ]
    },
    "Kubernetes": {
        "youtube": [
            {"title": "Kubernetes Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=X48VuDVv0do", "duration": "4 hrs", "channel": "TechWorld with Nana"}
        ],
        "coursera": [
            {"title": "Architecting with Google Kubernetes Engine", "url": "https://www.coursera.org/specializations/google-kubernetes-engine", "provider": "Google Cloud"}
        ],
        "docs": [
            {"title": "Kubernetes Official Documentation", "url": "https://kubernetes.io/docs/home/"}
        ]
    },
    "PyTorch": {
        "youtube": [
            {"title": "PyTorch for Deep Learning - Full Course", "url": "https://www.youtube.com/watch?v=V_xro1bcAuA", "duration": "25 hrs", "channel": "freeCodeCamp"}
        ],
        "coursera": [
            {"title": "Deep Learning with PyTorch", "url": "https://www.coursera.org/learn/deep-neural-networks-with-pytorch", "provider": "IBM"}
        ],
        "docs": [
            {"title": "PyTorch Official Tutorials", "url": "https://pytorch.org/tutorials/"}
        ]
    },
    "TypeScript": {
        "youtube": [
            {"title": "TypeScript Course for Beginners - Learn TypeScript", "url": "https://www.youtube.com/watch?v=d56mG7DezGs", "duration": "5 hrs", "channel": "freeCodeCamp"}
        ],
        "coursera": [
            {"title": "Developing Front-End Apps with React & TypeScript", "url": "https://www.coursera.org/learn/developing-frontend-apps-with-react", "provider": "IBM"}
        ],
        "docs": [
            {"title": "TypeScript Official Handbook", "url": "https://www.typescriptlang.org/docs/handbook/intro.html"}
        ]
    },
    "React": {
        "youtube": [
            {"title": "React Course - Beginner's Tutorial", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "duration": "12 hrs", "channel": "freeCodeCamp"}
        ],
        "coursera": [
            {"title": "Meta Front-End Developer Professional Certificate", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer", "provider": "Meta"}
        ],
        "docs": [
            {"title": "React Official Documentation", "url": "https://react.dev/"}
        ]
    },
    "FastAPI": {
        "youtube": [
            {"title": "FastAPI Course - Build Modern Python APIs", "url": "https://www.youtube.com/watch?v=7t2alSnE2-I", "duration": "19 hrs", "channel": "freeCodeCamp"}
        ],
        "coursera": [
            {"title": "Building Web APIs with FastAPI", "url": "https://www.coursera.org/learn/python-web-services", "provider": "Coursera"}
        ],
        "docs": [
            {"title": "FastAPI Official Documentation", "url": "https://fastapi.tiangolo.com/"}
        ]
    },
    "AWS": {
        "youtube": [
            {"title": "AWS Certified Cloud Practitioner Training", "url": "https://www.youtube.com/watch?v=SOTamWNgDKc", "duration": "14 hrs", "channel": "freeCodeCamp"}
        ],
        "coursera": [
            {"title": "AWS Fundamentals Specialization", "url": "https://www.coursera.org/specializations/aws-fundamentals", "provider": "Amazon Web Services"}
        ],
        "docs": [
            {"title": "AWS Official Documentation", "url": "https://aws.amazon.com/documentation/"}
        ]
    },
    "System Design": {
        "youtube": [
            {"title": "System Design Course for Beginners", "url": "https://www.youtube.com/watch?v=m8Icp_Cid5o", "duration": "1 hr", "channel": "ByteByteGo"}
        ],
        "coursera": [
            {"title": "Software Architecture and Design", "url": "https://www.coursera.org/learn/software-architecture", "provider": "University of Alberta"}
        ],
        "docs": [
            {"title": "System Design Primer Repository", "url": "https://github.com/donnemartin/system-design-primer"}
        ]
    }
}

def generate_learning_plan(missing_skills: list) -> dict:
    """
    Generate a customized learning plan for each missing skill,
    providing YouTube, Coursera, and documentation links.
    """
    plan = []

    for skill in missing_skills:
        res = CURATED_RESOURCES.get(skill, {
            "youtube": [
                {"title": f"Complete {skill} Crash Course for Beginners", "url": f"https://www.youtube.com/results?search_query={skill}+tutorial+full+course", "duration": "2 hrs", "channel": "Tech Community"}
            ],
            "coursera": [
                {"title": f"Mastering {skill} Fundamentals", "url": f"https://www.coursera.org/courses?query={skill}", "provider": "Top University"}
            ],
            "docs": [
                {"title": f"Official {skill} Guide & Reference Documentation", "url": f"https://www.google.com/search?q={skill}+official+documentation"}
            ]
        })

        plan.append({
            "skill": skill,
            "estimated_hours": 8,
            "difficulty": "Intermediate",
            "youtube_tutorials": res["youtube"],
            "coursera_courses": res["coursera"],
            "documentation": res["docs"]
        })

    return {
        "total_skills_to_learn": len(plan),
        "total_estimated_hours": len(plan) * 8,
        "learning_modules": plan
    }
