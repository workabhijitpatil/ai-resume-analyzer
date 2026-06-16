const API_BASE = import.meta.env.VITE_API_URL || "https://resume-analyzer-backend-181w.onrender.com";

export interface OptimizeResponse {
  rewritten_resume: string;
  suggestions: string[];
}

export async function optimizeResume(
  jobDescription: string,
  file?: File | null,
  resumeText?: string
): Promise<OptimizeResponse> {
  const formData = new FormData();
  formData.append("job_description", jobDescription);

  if (file) {
    formData.append("file", file);
  }
  if (resumeText) {
    formData.append("resume_text", resumeText);
  }

  const response = await fetch(`${API_BASE}/optimize`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }

  return data as OptimizeResponse;
}
