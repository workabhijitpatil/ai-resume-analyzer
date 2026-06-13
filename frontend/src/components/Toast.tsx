import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

// Error toast notification — auto-dismisses in 4 seconds
export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="toast-enter fixed top-5 right-5 z-50 flex items-start gap-3 max-w-sm rounded-lg px-4 py-3 shadow-xl"
      style={{
        backgroundColor: '#fff',
        border: '1.5px solid var(--red)',
        fontFamily: 'var(--font-body)',
      }}
      role="alert"
      aria-live="assertive"
    >
      <span style={{ color: 'var(--red)', fontSize: '18px', flexShrink: 0 }}>⚠</span>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: '#1a202c', margin: 0 }}>
          {message}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#718096', margin: 0 }}>
          Try again or paste your resume text manually.
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
        aria-label="Dismiss error"
        id="toast-dismiss-btn"
      >
        ×
      </button>
    </div>
  );
}
