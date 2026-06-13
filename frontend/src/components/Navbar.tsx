// Navbar component
export default function Navbar() {
  return (
    <nav
      style={{ backgroundColor: 'var(--navy)' }}
      className="w-full px-6 py-4 flex items-center justify-between shadow-lg"
    >
      <div className="flex items-center gap-3">
        <span
          style={{ fontFamily: 'var(--font-display)', color: 'var(--teal)' }}
          className="text-xl font-bold tracking-tight"
        >
          ResumeAI
        </span>
        <span
          style={{ color: 'var(--slate)' }}
          className="hidden sm:block text-xs border border-slate-700 rounded-full px-2 py-0.5"
        >
          Powered by Gemini
        </span>
      </div>
      <div
        style={{ color: 'var(--slate)', fontFamily: 'var(--font-body)' }}
        className="text-xs hidden sm:block"
      >
        Built for freshers · feels like a serious tool
      </div>
    </nav>
  );
}
