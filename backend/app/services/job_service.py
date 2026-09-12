import urllib.parse
from app.services.skill_gap_service import analyze_skill_gaps

def get_job_recommendations(candidate_skills: list, location: str = "India") -> dict:
    """
    Recommend best-fit job roles with fit percentages and direct search links
    for LinkedIn, Naukri, and Internshala.
    """
    analysis = analyze_skill_gaps(candidate_skills)
    roles_overview = analysis["all_roles_overview"]

    top_matches = roles_overview[:6]  # Top 6 best-fit job roles

    recommendations = []

    for item in top_matches:
        role_name = item["role"]
        match_pct = item["match_percentage"]
        
        # Format query strings
        query_encoded = urllib.parse.quote(role_name)
        loc_encoded = urllib.parse.quote(location)

        # Platform deep search links
        linkedin_url = f"https://www.linkedin.com/jobs/search/?keywords={query_encoded}&location={loc_encoded}"
        naukri_url = f"https://www.naukri.com/{role_name.lower().replace(' ', '-')}-jobs"
        internshala_url = f"https://internshala.com/internships/keywords-{query_encoded}"

        recommendations.append({
            "job_role": role_name,
            "match_percentage": match_pct,
            "matched_skills": item["matched_skills"],
            "missing_skills": item["missing_skills"],
            "job_portal_links": {
                "linkedin": linkedin_url,
                "naukri": naukri_url,
                "internshala": internshala_url
            }
        })

    return {
        "candidate_skill_count": len(candidate_skills),
        "total_roles_evaluated": len(roles_overview),
        "top_recommendations": recommendations
    }
