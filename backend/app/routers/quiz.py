from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.embeddings import generate_embedding
from app.database import SessionLocal
from app.models import DocumentChunk
from app.routers.retrieval import cosine_similarity

from groq import Groq
import os


router = APIRouter(
    prefix="/api/v1/quiz",
    tags=["Quiz"],
)


class QuizRequest(BaseModel):
    topic: str = ""
    num_questions: int = Field(default=5, ge=1, le=10)


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str


class QuizResponse(BaseModel):
    questions: List[QuizQuestion]


@router.post("/generate", response_model=QuizResponse)
def generate_quiz(request: QuizRequest):

    db = SessionLocal()

    try:
        chunks = db.query(DocumentChunk).all()

        if not chunks:
            raise HTTPException(
                status_code=404,
                detail="No learning documents are available. Upload a PDF first.",
            )

        query_text = request.topic.strip() or "important concepts and key topics"

        query_embedding = generate_embedding(query_text)

        scored_chunks = []

        for chunk in chunks:
            if not chunk.embedding:
                continue

            score = cosine_similarity(
                query_embedding,
                chunk.embedding,
            )

            scored_chunks.append(
                (score, chunk)
            )

        scored_chunks.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        selected_chunks = scored_chunks[:8]

        context_parts = []

        for score, chunk in selected_chunks:
            context_parts.append(
                f"""
Document: {chunk.filename}
Page: {chunk.page_number}

Content:
{chunk.content}
"""
            )

        context = "\n".join(context_parts)

    finally:
        db.close()

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured.",
        )

    client = Groq(api_key=api_key)

    prompt = f"""
You are an educational assessment generator.

Create exactly {request.num_questions} multiple-choice questions
from the supplied study material.

Topic:
{request.topic or "General concepts from the study material"}

Study material:
{context}

Rules:
- Use only information supported by the study material.
- Each question must have exactly 4 options.
- Only one option must be correct.
- Include a short explanation for the correct answer.
- Avoid duplicate questions.
- Do not introduce unrelated information.

Return ONLY valid JSON using this exact structure:

{{
  "questions": [
    {{
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "The exact correct option",
      "explanation": "Short explanation"
    }}
  ]
}}
"""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.3,
        )

        response_text = completion.choices[0].message.content

        if not response_text:
            raise ValueError("The AI returned an empty response.")

        import json

        parsed = json.loads(response_text)

        return QuizResponse(
            questions=parsed["questions"]
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate quiz: {str(exc)}",
        )