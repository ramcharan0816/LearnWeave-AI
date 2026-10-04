
import os
import traceback
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from groq import Groq

from app.database import engine
from app.embeddings import generate_embedding
from app.models import DocumentChunk
from app.routers.retrieval import cosine_similarity

load_dotenv()

router = APIRouter(
    prefix="/api/v1/rag",
    tags=["RAG Answer Generation"]
)


class RAGRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Question to answer using uploaded documents"
    )
    top_k: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Number of relevant chunks to retrieve"
    )


@router.post("/ask")
def ask_question(request: RAGRequest) -> dict[str, Any]:
    db = None

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="GROQ_API_KEY is not configured."
            )

        question_embedding = generate_embedding(request.question)
        db = Session(engine)

        document_chunks = db.query(DocumentChunk).all()

        if not document_chunks:
            return {
                "question": request.question,
                "answer": "No documents have been uploaded yet. Please upload a PDF first.",
                "sources": []
            }

        ranked_results = []

        for chunk in document_chunks:
            stored_embedding = chunk.embedding

            if not isinstance(stored_embedding, list) or not stored_embedding:
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
                "similarity_score": round(similarity, 6)
            })

        ranked_results.sort(
            key=lambda item: item["similarity_score"],
            reverse=True
        )

        top_results = ranked_results[:request.top_k]

        if not top_results:
            return {
                "question": request.question,
                "answer": "I couldn't find relevant content in the uploaded documents to answer this question.",
                "sources": []
            }

        context_parts = []
        sources = []

        for index, result in enumerate(top_results, start=1):
            context_parts.append(
                f"[Source {index}: {result['filename']}, "
                f"Page {result['page_number']}]\n"
                f"{result['content']}"
            )

            sources.append({
                "filename": result["filename"],
                "page_number": result["page_number"],
                "chunk_index": result["chunk_index"],
                "similarity_score": result["similarity_score"]
            })

        context = "\n\n".join(context_parts)

        client = Groq(api_key=api_key)

        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are LearnWeave AI, an educational assistant. "
                        "Answer the student's question using only the "
                        "provided document context. Do not invent facts "
                        "or claim that the documents say something they "
                        "do not. If the context does not contain enough "
                        "information, clearly say so. Give a clear, "
                        "student-friendly explanation and cite relevant "
                        "sources using the provided source number, "
                        "filename, and page number."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Document context:\n{context}\n\n"
                        f"Student's question: {request.question}\n\n"
                        "Answer based on the document context and include "
                        "source citations."
                    )
                }
            ],
            temperature=0.2,
            max_tokens=800
        )

        answer = completion.choices[0].message.content

        return {
            "question": request.question,
            "answer": answer,
            "total_sources": len(sources),
            "sources": sources,
            "model": "llama-3.3-70b-versatile"
        }

    except HTTPException:
        raise

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=(
                "An error occurred while generating the RAG answer. "
                "Check the backend terminal for details."
            )
        )

    finally:
        if db is not None:
            db.close()


@router.get("/health")
def rag_health():
    return {
        "status": "healthy",
        "module": "RAG Answer Generation"
    }