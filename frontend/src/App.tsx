import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import Toast from './components/Toast';
import { optimizeResume } from './api/client';

export default function App() {
  // Input state
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Output state
  const [loading, setLoading] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Error toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOptimize = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setRewrittenResume('');
    setSuggestions([]);
    setToastMessage(null);

    try {
      const result = await optimizeResume(
        jobDescription,
        file ?? null,
        resumeText || undefined
      );

      setRewrittenResume(result.rewritten_resume);
      setSuggestions(result.suggestions);

      // If backend reported a scanned PDF, show fallback
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';

      // Check if the error is about scanned/image PDF → trigger fallback UI
      if (
        message.toLowerCase().includes('scanned') ||
        message.toLowerCase().includes('no text') ||
        message.toLowerCase().includes('image-based')
      ) {
        setParseError(message);
        setShowFallback(true);
        setFile(null);
      }

      setToastMessage(message);
    } finally {
      setLoading(false);
    }
  }, [loading, jobDescription, file, resumeText]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--off-white)' }}>
      <Navbar />
      <HeroSection />

      {/* Main content */}
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <InputPanel
            file={file}
            setFile={setFile}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            resumeText={resumeText}
            setResumeText={setResumeText}
            loading={loading}
            onSubmit={handleOptimize}
            parseError={parseError}
            setParseError={setParseError}
            showFallback={showFallback}
            setShowFallback={setShowFallback}
          />
          <OutputPanel
            loading={loading}
            rewrittenResume={rewrittenResume}
            suggestions={suggestions}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs" style={{ color: '#94a3b8', fontFamily: 'var(--font-body)' }}>
        ResumeAI · Powered by Gemini · Built for freshers
      </footer>

      {/* Error toast */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
