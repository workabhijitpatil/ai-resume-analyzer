import os
import re
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

# Explicitly load .env from the backend directory
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

MODEL_NAME = "gemini-2.5-flash"

# Configure once at startup — not per request
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are an expert resume writer and career coach. Your job is to rewrite a candidate's resume to be perfectly tailored for a specific job description.

STRICT RULES:
1. NEVER invent, fabricate, or add any experiences, skills, certifications, or achievements that are not already in the original resume.
2. Only rephrase, restructure, and reorder existing content to better match the job description.
3. Use keywords and language from the job description where they genuinely apply.
4. Make the resume ATS-friendly: use standard section headers, avoid tables/columns in text output.
5. Keep the output as plain text (no markdown, no asterisks, no bullet symbols other than standard hyphens).

OUTPUT FORMAT — you must respond with EXACTLY this structure:
---REWRITTEN RESUME---
[The full rewritten resume as plain text here]
---SUGGESTIONS---
[A numbered list of specific improvements the candidate could make themselves, such as adding certifications, quantifying achievements, or filling skill gaps. Be specific and actionable. 3-6 items.]"""

# Create model once at module level — reused across all requests
_model = genai.GenerativeModel(
    model_name=MODEL_NAME,
    system_instruction=SYSTEM_PROMPT,
)


def optimize_resume(resume_text: str, job_description: str) -> dict:
    """
    Send resume + job description to Gemini and return structured result.
    Returns: { "rewritten_resume": str, "suggestions": list[str] }
    """
    user_message = f"""ORIGINAL RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Please rewrite the resume to match this job description following the rules above."""

    response = _model.generate_content(user_message)
    raw_output = response.text.strip()

    return _parse_gemini_response(raw_output)



def _parse_gemini_response(raw: str) -> dict:
    """Parse the structured Gemini output into resume text and suggestions list."""
    rewritten_resume = ""
    suggestions = []

    resume_match = re.search(
        r"---REWRITTEN RESUME---\s*(.*?)\s*---SUGGESTIONS---",
        raw,
        re.DOTALL,
    )
    suggestions_match = re.search(
        r"---SUGGESTIONS---\s*(.*?)$",
        raw,
        re.DOTALL,
    )

    if resume_match:
        rewritten_resume = resume_match.group(1).strip()
    else:
        # Fallback: if format not followed, return everything as resume
        rewritten_resume = raw

    if suggestions_match:
        raw_suggestions = suggestions_match.group(1).strip()
        lines = raw_suggestions.split("\n")
        for line in lines:
            line = line.strip()
            # Strip leading numbers, dashes, dots
            cleaned = re.sub(r"^[\d]+[.)]\s*", "", line).strip()
            cleaned = re.sub(r"^[-•]\s*", "", cleaned).strip()
            if cleaned:
                suggestions.append(cleaned)

    return {
        "rewritten_resume": rewritten_resume,
        "suggestions": suggestions,
    }
