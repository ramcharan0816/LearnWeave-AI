import os

from app.routers import quiz
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import documents, retrieval, rag, auth

from app.database import Base, engine
from app import models

app = FastAPI(
    title="LearnWeave AI",
    description=(
        "An adaptive AI-powered learning platform "
        "with document upload, semantic search, "
        "and RAG-based answer generation."
    ),
    version="1.0.0"
)

@app.on_event("startup")
def create_database_tables():
    Base.metadata.create_all(bind=engine)
    

# CORS configuration. Extra origins (for example a Vercel preview URL)
# can be added with a comma-separated CORS_ALLOW_ORIGINS variable.
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://learn-weave-ai.vercel.app",
] + [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register API routers
app.include_router(documents.router)
app.include_router(retrieval.router)
app.include_router(rag.router)
app.include_router(quiz.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to LearnWeave AI API",
        "status": "running",
        "version": "1.0.0",
        "modules": [
            "Document Upload",
            "Semantic Retrieval",
            "RAG Answer Generation"
        ]
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "LearnWeave AI"
    }