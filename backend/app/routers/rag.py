import logging
import os
import time
import traceback
import uuid
from contextlib import contextmanager
from functools import lru_cache
from typing import Any

import groq
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from groq import Groq
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import engine
from app.embeddings import generate_embedding
from app.models import DocumentChunk
from app.similarity import rank_by_cosine

load_dotenv()

# Child of uvicorn's logger so INFO lines reach the Render log stream.
logger = logging.getLogger("uvicorn.error.learnweave.rag")

GROQ_MODEL = "openai/gpt-oss-120b"
# Fail fast instead of waiting on the SDK defaults (long timeout + retries).
GROQ_TIMEOUT_SECONDS = float(os.getenv("GROQ_TIMEOUT_SECONDS", "45"))
GROQ_MAX_RETRIES = int(os.getenv("GROQ_MAX_RETRIES", "1"))
# Optional. Leave unset to keep current behaviour. gpt-oss models accept
# "low" | "medium" | "high"; set it only if the timing logs show that
# reasoning tokens dominate llm_ms.
GROQ_REASONING_EFFORT = os.getenv("GROQ_REASONING_EFFORT")

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
    filename: str | None = Field(
        default=None,
        description="Optional filename to restrict the search"
    )


class _StageTimer:
    """Records per-stage durations. Stores timings only, never content."""

    def __init__(self) -> None:
        self._start = time.perf_counter()
        self.durations_ms: dict[str, float] = {}
        self.failed_stage: str | None = None

    @contextmanager
    def stage(self, name: str):
        started = time.perf_counter()
        try:
            yield
        except BaseException:
            self.failed_stage = name
            raise
        finally:
            self.durations_ms[name] = round(
                (time.perf_counter() - started) * 1000, 1
            )

    def total_ms(self) -> float:
        return round((time.perf_counter() - self._start) * 1000, 1)


@lru_cache(maxsize=1)
def _get_groq_client(api_key: str) -> Groq:
    # One client per process so the HTTPS connection pool is reused.
    return Groq(
        api_key=api_key,
        timeout=GROQ_TIMEOUT_SECONDS,
        max_retries=GROQ_MAX_RETRIES,
    )


@router.post("/ask")
def ask_question(request: RAGRequest) -> dict[str, Any]:
    db = None
    timer = _StageTimer()
    request_id = uuid.uuid4().hex[:8]
    status = "error"
    meta: dict[str, Any] = {"question_chars": len(request.question)}

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="GROQ_API_KEY is not configured."
            )

        db = Session(bind=engine)

        with timer.stage("query_embedding"):
            question_embedding = generate_embedding(request.question)
        meta["query_dims"] = len(question_embedding)

        # Fetch only id + embedding for every chunk; the text of the few
        # winning chunks is loaded afterwards.
        with timer.stage("db_fetch_embeddings"):
            candidate_query = db.query(
                DocumentChunk.id, DocumentChunk.embedding
            )
            if request.filename:
                candidate_query = candidate_query.filter(
                    DocumentChunk.filename == request.filename
                )
            candidates = candidate_query.all()

        if not candidates:
            status = "ok_no_documents"
            return {
                "question": request.question,
                "answer": "No documents have been uploaded yet. Please upload a PDF first.",
                "sources": []
            }

        with timer.stage("similarity_ranking"):
            ranked, rank_stats = rank_by_cosine(
                question_embedding, candidates, request.top_k
            )
        meta.update(rank_stats)

        if rank_stats["skipped_dimension"]:
            logger.warning(
                "rag_ask id=%s skipped %d chunks whose embedding length differs "
                "from the query embedding (%d dims)",
                request_id,
                rank_stats["skipped_dimension"],
                meta["query_dims"],
            )

        if not ranked:
            status = "ok_no_results"
            return {
                "question": request.question,
                "answer": "I couldn't find relevant content in the uploaded documents to answer this question.",
                "sources": []
            }

        with timer.stage("db_fetch_top_chunks"):
            top_ids = [chunk_id for chunk_id, _ in ranked]
            rows = (
                db.query(DocumentChunk)
                .filter(DocumentChunk.id.in_(top_ids))
                .all()
            )
            chunks_by_id = {row.id: row for row in rows}

        with timer.stage("context_build"):
            context_parts = []
            sources = []
            for index, (chunk_id, score) in enumerate(ranked, start=1):
                chunk = chunks_by_id.get(chunk_id)
                if chunk is None:
                    continue
                context_parts.append(
                    f"[Source {index}: {chunk.filename}, "
                    f"Page {chunk.page_number}]\n"
                    f"{chunk.content}"
                )
                sources.append({
                    "filename": chunk.filename,
                    "page_number": chunk.page_number,
                    "chunk_index": chunk.chunk_index,
                    "similarity_score": round(score, 6)
                })
            context = "\n\n".join(context_parts)
        meta["context_chars"] = len(context)

        client = _get_groq_client(api_key)

        completion_kwargs: dict[str, Any] = {
            "model": GROQ_MODEL,
            "messages": [
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
            "temperature": 0.2,
            "max_tokens": 800,
        }
        if GROQ_REASONING_EFFORT:
            completion_kwargs["reasoning_effort"] = GROQ_REASONING_EFFORT

        with timer.stage("llm_call"):
            completion = client.chat.completions.create(**completion_kwargs)

        choice = completion.choices[0]
        answer = choice.message.content

        usage = getattr(completion, "usage", None)
        if usage is not None:
            meta["prompt_tokens"] = getattr(usage, "prompt_tokens", None)
            meta["completion_tokens"] = getattr(usage, "completion_tokens", None)
        meta["finish_reason"] = getattr(choice, "finish_reason", None)

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="The AI model returned an empty answer. Please try again."
            )

        status = "ok"
        return {
            "question": request.question,
            "answer": answer,
            "total_sources": len(sources),
            "sources": sources,
            "model": GROQ_MODEL
        }

    except HTTPException:
        raise

    except groq.APITimeoutError:
        raise HTTPException(
            status_code=504,
            detail="The AI model took too long to respond. Please try again."
        )

    except groq.RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="The AI service is busy right now. Please wait a moment and try again."
        )

    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="The AI tutor couldn't generate an answer. Please try again."
        )

    finally:
        if db is not None:
            db.close()
        logger.info(
            "rag_ask id=%s status=%s failed_stage=%s total_ms=%s stages_ms=%s meta=%s",
            request_id,
            status,
            timer.failed_stage,
            timer.total_ms(),
            timer.durations_ms,
            meta,
        )


@router.get("/health")
def rag_health():
    return {
        "status": "healthy",
        "module": "RAG Answer Generation"
    }