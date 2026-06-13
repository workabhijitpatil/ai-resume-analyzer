# AI Resume Analyzer — Task Tracker

---

## Checkpoint 1 — Project Scaffold ✅ (nearly done)
- [x] Create backend folder + FastAPI app (`backend/main.py`)
- [x] Create backend services (`parser.py`, `gemini.py`)
- [x] Create `requirements.txt`
- [x] Create `.env.example`
- [x] Create `.cursorrules`
- [x] Create `README.md`
- [x] Create `.gitignore`
- [x] Scaffold frontend with React + Vite + TypeScript
- [x] Install Tailwind CSS (`@tailwindcss/vite`)
- [x] Install `@vitejs/plugin-react`
- [x] Install `react` + `react-dom`
- [x] Configure `vite.config.ts` with Tailwind + React plugins
- [x] Write global CSS (`index.css`) — design tokens, fonts, animations
- [x] Install all Python dependencies (50 packages via pip)
- [x] Install `google-genai` SDK (replaced deprecated `google-generativeai`)
- [x] Migrate `gemini.py` to new `google.genai` SDK
- [x] Backend boots on `:8000` ✅ running
- [x] Frontend boots on `:5173` ✅ running
- [x] **`.env` created** with `GEMINI_API_KEY` ✅
- [x] Backend health check: `http://localhost:8000/health` → `{"status":"ok"}` ✅
- [x] Frontend UI verified at `http://localhost:5173` ✅ all sections visible
- [ ] Git commit: `chore: project scaffold`

---

## Checkpoint 2 — File Upload & Text Extraction
- [x] `parser.py` — PDF extraction with pdfplumber
- [x] `parser.py` — DOCX extraction with python-docx
- [x] Graceful scanned PDF error message
- [x] Frontend upload zone (drag-drop + click)
- [x] Frontend file type + size validation
- [x] Scanned PDF fallback textarea in UI
- [ ] End-to-end test: upload real PDF → backend extracts and returns text
- [ ] Git commit: `feat: file upload and text extraction`

---

## Checkpoint 3 — Gemini API Integration
- [x] `gemini.py` — structured prompt (no-hallucination rules)
- [x] `gemini.py` — response parser (splits resume + suggestions)
- [x] API client in frontend (`src/api/client.ts`)
- [ ] End-to-end test: real resume + JD → Gemini returns optimized resume
- [ ] Git commit: `feat: gemini api integration`

---

## Checkpoint 4 — MVP Complete
- [x] `InputPanel.tsx` — upload + JD textarea + optimize button
- [x] `OutputPanel.tsx` — rewritten resume display
- [x] `OutputPanel.tsx` — suggestions section below resume
- [x] Copy to clipboard button
- [x] Download as .txt button
- [x] Fallback paste textarea connected to API
- [ ] Full end-to-end flow test (upload → optimize → copy/download)
- [ ] Git commit: `feat: mvp complete`

---

## Checkpoint 5 — Polish & Deploy
- [x] Shimmer animation on Optimize button
- [x] Skeleton loader in output panel
- [x] Error toast (auto-dismisses in 4s)
- [x] Fade-up animation on result
- [x] Mobile responsive layout
- [x] Shake animation on bad file upload
- [ ] Cross-browser test
- [ ] Deploy frontend → Vercel
- [ ] Deploy backend → Railway
- [ ] Git commit: `feat: polish and deploy`
