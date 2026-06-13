import pdfplumber
import io
from docx import Document


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file. Raises ValueError if no text found (scanned/image PDF)."""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text.strip())

            full_text = "\n\n".join(pages_text).strip()

            if not full_text:
                raise ValueError(
                    "No text could be extracted from this PDF. "
                    "It may be a scanned or image-based file. "
                    "Please paste your resume text manually instead."
                )

            return full_text

    except ValueError:
        raise
    except Exception as e:
        raise ValueError(
            f"Failed to read the PDF file. Please make sure it's a valid PDF. ({str(e)})"
        )


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file."""
    try:
        doc = Document(io.BytesIO(file_bytes))
        paragraphs = [para.text.strip() for para in doc.paragraphs if para.text.strip()]
        full_text = "\n".join(paragraphs).strip()

        if not full_text:
            raise ValueError(
                "No text could be extracted from this DOCX file. "
                "Please make sure it contains readable text."
            )

        return full_text

    except ValueError:
        raise
    except Exception as e:
        raise ValueError(
            f"Failed to read the DOCX file. Please make sure it's a valid Word document. ({str(e)})"
        )
