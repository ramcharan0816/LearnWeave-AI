
from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from pypdf import PdfReader
from pypdf.errors import PdfReadError


router = APIRouter(
    prefix="/api/v1/documents",
    tags=["Documents"]
)


def split_text_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 150):
    """
    Split text into smaller chunks with overlapping content.
    """
    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than zero.")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError("Overlap must be non-negative and smaller than chunk size.")

    chunks = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end == len(text):
            break

        start = end - overlap

    return chunks


@router.get("/health")
async def documents_health():
    return {
        "status": "healthy",
        "module": "PDF Document Processing"
    }


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF, extract its text and split it into chunks.
    """

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF is empty."
            )

        if not content.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid PDF."
            )

        reader = PdfReader(BytesIO(content), strict=False)

        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Encrypted PDFs are not supported."
            )

        extracted_pages = []
        all_chunks = []
        chunk_id = 1

        for page_number, page in enumerate(reader.pages, start=1):
            page_text = (page.extract_text() or "").strip()

            extracted_pages.append({
                "page": page_number,
                "text": page_text
            })

            page_chunks = split_text_into_chunks(page_text)

            for chunk_text in page_chunks:
                all_chunks.append({
                    "chunk_id": chunk_id,
                    "page": page_number,
                    "text": chunk_text
                })
                chunk_id += 1

        full_text = "\n".join(
            page["text"] for page in extracted_pages
        )

        if not full_text.strip():
            raise HTTPException(
                status_code=422,
                detail=(
                    "No extractable text was found in this PDF. "
                    "It may be a scanned document and require OCR."
                )
            )

        return {
            "success": True,
            "filename": file.filename,
            "total_pages": len(reader.pages),
            "characters_extracted": len(full_text),
            "total_chunks": len(all_chunks),
            "chunk_size": 1000,
            "chunk_overlap": 150,
            "chunks": all_chunks,
            "message": "PDF text extracted and split into chunks successfully."
        }

    except HTTPException:
        raise

    except PdfReadError:
        raise HTTPException(
            status_code=400,
            detail="Unable to read the PDF. The file may be corrupted."
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the PDF."
        )

    finally:
        await file.close()