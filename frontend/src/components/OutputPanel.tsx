import { useState } from 'react';
import SkeletonLoader from './SkeletonLoader';

interface OutputPanelProps {
  loading: boolean;
  rewrittenResume: string;
  suggestions: string[];
}

export default function OutputPanel({ loading, rewrittenResume, suggestions }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const hasResult = rewrittenResume.length > 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rewrittenResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5 h-full"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 16px rgba(15,27,45,0.06)',
      }}
    >
      {/* Section 03 — Optimized Resume */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--teal)', fontFamily: 'var(--font-display)' }}
          >
            03 — Optimized Resume
          </div>
          {hasResult && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full fade-up"
              style={{ backgroundColor: '#e1f5ee', color: '#085041' }}
            >
              ✓ Optimized for this JD
            </span>
          )}
        </div>

        {/* Output area */}
        <div
          className="flex-1 rounded-xl p-4 output-scroll overflow-y-auto"
          style={{
            minHeight: '260px',
            maxHeight: '420px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '12.5px',
            lineHeight: '1.75',
            color: '#1a202c',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          id="optimized-resume-output"
        >
          {loading && <SkeletonLoader />}

          {!loading && !hasResult && (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
              <div style={{ fontSize: '32px', opacity: 0.3 }}>📄</div>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                Your optimized resume will appear here
              </p>
              <p className="text-xs" style={{ color: '#b0bec5' }}>
                Upload your resume and paste a job description to get started
              </p>
            </div>
          )}

          {!loading && hasResult && (
            <span className="fade-up">{rewrittenResume}</span>
          )}
        </div>

        {/* Action buttons */}
        {hasResult && !loading && (
          <div className="flex gap-3 mt-3 fade-up">
            <button
              id="copy-resume-btn"
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                border: '1px solid #cbd5e0',
                color: copied ? 'var(--teal)' : '#475569',
                backgroundColor: copied ? '#e1f5ee' : '#f8fafc',
                fontFamily: 'var(--font-body)',
              }}
            >
              {copied ? '✓ Copied!' : '⎘ Copy to clipboard'}
            </button>
            <button
              id="download-resume-btn"
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                border: '1px solid #cbd5e0',
                color: '#475569',
                backgroundColor: '#f8fafc',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eef2f7')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            >
              ↓ Download .txt
            </button>
          </div>
        )}
      </div>

      {/* Section 04 — Suggestions */}
      {hasResult && suggestions.length > 0 && !loading && (
        <div className="fade-up">
          <div
            className="text-xs font-semibold mb-3 tracking-widest uppercase"
            style={{ color: 'var(--teal)', fontFamily: 'var(--font-display)' }}
          >
            04 — 💡 Suggested Improvements
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: '#fffbf0',
              border: '1px solid #fde68a',
            }}
          >
            <p className="text-xs mb-3" style={{ color: '#92400e' }}>
              These are things <strong>you</strong> could add to further strengthen your resume for this role:
            </p>
            <ol className="space-y-2 pl-0" style={{ listStyle: 'none', margin: 0 }}>
              {suggestions.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: '#1a202c', lineHeight: '1.6' }}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ backgroundColor: '#fde68a', color: '#92400e' }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
