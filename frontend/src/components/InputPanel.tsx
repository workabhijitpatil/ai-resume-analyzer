import { useRef, useState, useCallback } from 'react';

interface InputPanelProps {
  file: File | null;
  setFile: (f: File | null) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  resumeText: string;
  setResumeText: (t: string) => void;
  loading: boolean;
  onSubmit: () => void;
  parseError: string | null;
  setParseError: (e: string | null) => void;
  showFallback: boolean;
  setShowFallback: (v: boolean) => void;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function InputPanel({
  file,
  setFile,
  jobDescription,
  setJobDescription,
  resumeText,
  setResumeText,
  loading,
  onSubmit,
  parseError,
  setParseError,
  showFallback,
  setShowFallback,
}: InputPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [shaking, setShaking] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  const validateFile = (f: File): string | null => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(f.type)) {
      return 'Only PDF and DOCX files are accepted.';
    }
    if (f.size > MAX_SIZE) {
      return 'File size must be under 5MB.';
    }
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const error = validateFile(f);
    if (error) {
      setParseError(error);
      triggerShake();
      return;
    }
    setParseError(null);
    setFile(f);
    setShowFallback(false);
    setResumeText('');
  }, [setFile, setParseError, setResumeText, setShowFallback]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) handleFile(picked);
  };

  const canSubmit =
    !loading &&
    jobDescription.trim().length > 0 &&
    (file !== null || resumeText.trim().length > 0);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 16px rgba(15,27,45,0.06)',
      }}
    >
      {/* Section 01 — Resume Upload */}
      <div>
        <div
          className="text-xs font-semibold mb-3 tracking-widest uppercase"
          style={{ color: 'var(--teal)', fontFamily: 'var(--font-display)' }}
        >
          01 — Your Resume
        </div>

        {/* Drop zone */}
        <div
          id="resume-upload-zone"
          className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
            shaking ? 'shake' : ''
          } ${dragOver ? 'drag-over' : ''}`}
          style={{
            borderColor: dragOver ? 'var(--teal)' : '#cbd5e0',
            backgroundColor: dragOver ? 'var(--teal-glow)' : '#f8fafc',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Upload resume file"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            id="resume-file-input"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleInputChange}
          />
          <div style={{ fontSize: '28px', color: 'var(--teal)' }}>⬆</div>
          <p className="text-sm mt-2" style={{ color: '#64748b' }}>
            Drop PDF or DOCX here
            <br />
            <span className="text-xs" style={{ color: '#94a3b8' }}>
              or click to browse · max 5MB
            </span>
          </p>
        </div>

        {/* File type error */}
        {parseError && !showFallback && (
          <p className="text-xs mt-2 font-medium" style={{ color: 'var(--red)' }}>
            ⚠ {parseError}
          </p>
        )}

        {/* Uploaded file badge */}
        {file && !parseError && (
          <div className="flex items-center gap-2 mt-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#e1f5ee', color: '#085041' }}
            >
              ✓ {file.name}
            </span>
            <button
              className="text-xs underline"
              style={{ color: '#94a3b8' }}
              onClick={(e) => { e.stopPropagation(); setFile(null); setParseError(null); }}
              id="remove-file-btn"
            >
              Remove
            </button>
          </div>
        )}

        {/* Scanned PDF fallback */}
        {showFallback && (
          <div className="mt-4">
            <p className="text-xs mb-2 font-medium" style={{ color: '#e67e22' }}>
              ⚠ We couldn't extract text from this PDF (it may be image-based).
              Paste your resume text below instead:
            </p>
            <textarea
              id="resume-text-fallback"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              placeholder="Paste your full resume text here..."
              className="w-full rounded-lg text-sm p-3 resize-y transition-all"
              style={{
                border: '1px solid #cbd5e0',
                fontFamily: 'var(--font-body)',
                color: '#1a202c',
                backgroundColor: '#f8fafc',
                outline: 'none',
                lineHeight: '1.6',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e0')}
            />
          </div>
        )}

        {/* Manual paste option toggle */}
        {!showFallback && !file && (
          <button
            className="text-xs mt-2 underline"
            style={{ color: '#94a3b8' }}
            onClick={() => setShowFallback(true)}
            id="paste-resume-toggle"
          >
            Prefer to paste your resume text instead?
          </button>
        )}
        {showFallback && !file && (
          <button
            className="text-xs mt-2 underline"
            style={{ color: '#94a3b8' }}
            onClick={() => { setShowFallback(false); setResumeText(''); }}
            id="upload-file-toggle"
          >
            Upload a file instead
          </button>
        )}
      </div>

      {/* Section 02 — Job Description */}
      <div>
        <div
          className="text-xs font-semibold mb-3 tracking-widest uppercase"
          style={{ color: 'var(--teal)', fontFamily: 'var(--font-display)' }}
        >
          02 — Job Description
        </div>
        <textarea
          id="job-description-input"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={7}
          placeholder="Paste the full job description here..."
          className="w-full rounded-lg text-sm p-3 resize-y transition-all"
          style={{
            border: '1px solid #cbd5e0',
            fontFamily: 'var(--font-body)',
            color: '#1a202c',
            backgroundColor: '#f8fafc',
            outline: 'none',
            lineHeight: '1.6',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
          onBlur={(e) => (e.target.style.borderColor = '#cbd5e0')}
        />
      </div>

      {/* Submit button */}
      <button
        id="optimize-resume-btn"
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
          loading ? 'btn-shimmer cursor-not-allowed' : ''
        }`}
        style={{
          fontFamily: 'var(--font-display)',
          backgroundColor: canSubmit && !loading ? 'var(--teal)' : undefined,
          background: !canSubmit ? '#e2e8f0' : undefined,
          color: canSubmit ? 'var(--navy)' : '#94a3b8',
          cursor: !canSubmit ? 'not-allowed' : loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
      >
        {loading ? '✦ Optimizing your resume...' : '✦ Optimize Resume'}
      </button>
    </div>
  );
}
