
import traceback
from math import sqrt
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import engine
from app.embeddings import generate_embedding
from app.models import DocumentChunk


router = APIRouter(
    prefix="/api/v1/retrieval",
    tags=["Document Retrieval"]
)


class RetrievalRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Question to search for in uploaded documents"
    )
    top_k: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Number of relevant chunks to return"
    )


def cosine_similarity(
    vector_a: list[float],
    vector_b: list[float]
) -> float:
    if not vector_a or not vector_b:
        return 0.0

    if len(vector_a) != len(vector_b):
        raise ValueError(
            f"Embedding dimensions do not match: "
            f"{len(vector_a)} and {len(vector_b)}"
        )

    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
    magnitude_a = sqrt(sum(a * a for a in vector_a))
    magnitude_b = sqrt(sum(b * b for b in vector_b))

    if magnitude_a == 0 or magnitude_b == 0:
        return 0.0

    return dot_product / (magnitude_a * magnitude_b)


@router.post("/search")
def search_documents(request: RetrievalRequest) -> dict[str, Any]:
    db = None

    try:
        question_embedding = generate_embedding(request.question)

        db = Session(engine)

        document_chunks = db.query(DocumentChunk).all()

        if not document_chunks:
            return {
                "question": request.question,
                "total_results": 0,
                "results": [],
                "message": (
                    "No document chunks found. "
                    "Upload a PDF before searching."
                )
            }

        ranked_results = []

        for chunk in document_chunks:
            stored_embedding = chunk.embedding

            if not isinstance(stored_embedding, list):
                continue

            if not stored_embedding:
                continue

            similarity = cosine_similarity(
                question_embedding,
                stored_embedding
            )

            ranked_results.append({
                "id": chunk.id,
                "filename": chunk.filename,
                "page_number": chunk.page_number,
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                "similarity_score": round(similarity, 6),
                "embedding_model": chunk.embedding_model
            })

        ranked_results.sort(
            key=lambda item: item["similarity_score"],
            reverse=True
        )

        top_results = ranked_results[:request.top_k]

        return {
            "question": request.question,
            "total_results": len(top_results),
            "results": top_results
        }

    except HTTPException:
        raise

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=(
                "An error occurred while retrieving document chunks. "
                "Check the backend terminal for details."
            )
        )

    finally:
        if db is not None:
            db.close()


@router.get("/health")
def retrieval_health():
    return {
        "status": "healthy",
        "module": "Semantic Document Retrieval"
    }