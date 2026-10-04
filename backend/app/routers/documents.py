from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from sqlalchemy.orm import sessionmaker

from app.database import engine
from app.embeddings import generate_embeddings
from app.models import DocumentChunk


router = APIRouter(
    prefix="/api/v1/documents",
    tags=["Documents"],
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def split_text_into_chunks(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 150,
):
    """
    Split text into smaller chunks with overlapping content.
    """
    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than zero.")

    if overlap < 0 or overlap >= chunk_size:
        raise ValueError(
            "Overlap must be non-negative and smaller than chunk size."
        )

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
        "module": "PDF Document Processing",
    }


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF, extract text, split it into chunks,
    generate embeddings, and save the chunks and embeddings
    in PostgreSQL.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    db = SessionLocal()

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF is empty.",
            )

        if not content.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid PDF.",
            )

        reader = PdfReader(BytesIO(content), strict=False)

        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Encrypted PDFs are not supported.",
            )

        extracted_pages = []
        all_chunks = []
        chunk_id = 1

        for page_number, page in enumerate(reader.pages, start=1):
            page_text = (page.extract_text() or "").strip()

            extracted_pages.append({
                "page": page_number,
                "text": page_text,
            })

            page_chunks = split_text_into_chunks(page_text)

            for chunk_text in page_chunks:
                all_chunks.append({
                    "chunk_id": chunk_id,
                    "page": page_number,
                    "text": chunk_text,
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
                ),
            )

        if not all_chunks:
            raise HTTPException(
                status_code=422,
                detail="No text chunks could be generated from this PDF.",
            )

        chunk_texts = [
            chunk["text"] for chunk in all_chunks
        ]

        embeddings = generate_embeddings(chunk_texts)

        if len(embeddings) != len(all_chunks):
            raise ValueError(
                "The number of generated embeddings does not match "
                "the number of text chunks."
            )

        database_chunks = []

        for chunk, embedding in zip(all_chunks, embeddings):
            if len(embedding) != 384:
                raise ValueError(
                    "An embedding has an unexpected dimension."
                )

            chunk["embedding"] = embedding
            chunk["embedding_dimensions"] = len(embedding)

            database_chunks.append(
                DocumentChunk(
                    filename=file.filename,
                    page_number=chunk["page"],
                    chunk_index=chunk["chunk_id"],
                    content=chunk["text"],
                    embedding=embedding,
                    embedding_model="all-MiniLM-L6-v2",
                )
            )

        db.add_all(database_chunks)
        db.commit()

        return {
            "success": True,
            "filename": file.filename,
            "total_pages": len(reader.pages),
            "characters_extracted": len(full_text),
            "total_chunks": len(all_chunks),
            "chunks_saved": len(database_chunks),
            "chunk_size": 1000,
            "chunk_overlap": 150,
            "embedding_model": "all-MiniLM-L6-v2",
            "embedding_dimensions": 384,
            "chunks": all_chunks,
            "message": (
                "PDF text extracted, chunked, embeddings generated, "
                "and saved to PostgreSQL successfully."
            ),
        }

    except HTTPException:
        db.rollback()
        raise

    except PdfReadError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Unable to read the PDF. The file may be corrupted.",
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=(
                "An unexpected error occurred while processing "
                "or saving the PDF."
            ),
        )

    finally:
        db.close()
        await file.close()