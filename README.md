# AI Resume Analyzer

Upload your resume → paste a job description → get an AI-optimized resume tailored to that role in seconds.

## Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: Google Gemini API (`gemini-2.0-flash`)
- **Parsing**: pdfplumber (PDF), python-docx (DOCX)

## Setup

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate    # Windows
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Add your Gemini API key to .env

uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app runs at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Features
- Upload PDF or DOCX resume (up to 5MB)
- Paste job description
- AI rewrites resume to match the JD — ATS-friendly, better keywords
- Improvement suggestions shown below the rewritten resume
- Copy to clipboard / Download as .txt
- Graceful error handling for scanned/image PDFs with paste fallback
