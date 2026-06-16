from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from services.parser import extract_text_from_pdf, extract_text_from_docx
from services.gemini import optimize_resume

app = FastAPI(title="AI Resume Analyzer API", version="1.0.0")

# CORS — allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


class OptimizeResponse(BaseModel):
    rewritten_resume: str
    suggestions: list[str]


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI Resume Analyzer API is running"}


@app.post("/optimize", response_model=OptimizeResponse)
async def optimize(
    job_description: str = Form(...),
    resume_text: Optional[str] = Form(default=None),
    file: Optional[UploadFile] = File(default=None),
):
    """
    Main endpoint — accepts a resume (as file or pasted text) + job description,
    returns an AI-rewritten resume and a list of improvement suggestions.
    """
    # Validate that at least one resume source is provided
    if not file and not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Please provide a resume — either upload a file or paste your resume text.",
        )

    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Please paste a job description before optimizing.",
        )

    extracted_text = ""

    # --- Handle file upload ---
    if file and file.filename:
        # Validate file extension
        _, ext = os.path.splitext(file.filename.lower())
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are accepted. Please upload a valid file.",
            )

        file_bytes = await file.read()

        # Validate file size
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds the 5MB limit. Please upload a smaller file.",
            )

        # Extract text based on file type
        try:
            if ext == ".pdf":
                extracted_text = extract_text_from_pdf(file_bytes)
            elif ext == ".docx":
                extracted_text = extract_text_from_docx(file_bytes)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

    # --- Handle manual paste fallback ---
    elif resume_text and resume_text.strip():
        extracted_text = resume_text.strip()

    if not extracted_text:
        raise HTTPException(
            status_code=422,
            detail="Could not extract any text. Please paste your resume text manually.",
        )

    # --- Call Gemini ---
    try:
        result = optimize_resume(extracted_text, job_description.strip())
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI optimization failed. Please try again. ({str(e)})",
        )

    return OptimizeResponse(**result)
