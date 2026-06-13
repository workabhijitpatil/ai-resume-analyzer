// Hero section with headline and subtext
export default function HeroSection() {
  return (
    <div
      style={{ backgroundColor: 'var(--navy)' }}
      className="w-full text-center py-10 px-4"
    >
      <h1
        style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
        className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
      >
        Tailor your resume.{' '}
        <span style={{ color: 'var(--teal)' }}>Land the job.</span>
      </h1>
      <p
        style={{ color: 'var(--slate)', fontFamily: 'var(--font-body)' }}
        className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
      >
        Upload your resume and paste a job description. Our AI rewrites your
        resume to match the role — better keywords, stronger phrasing,
        ATS-ready.
      </p>
    </div>
  );
}
