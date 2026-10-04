
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import documents, retrieval, rag

app = FastAPI(
    title="LearnWeave AI",
    description=(
        "An adaptive AI-powered learning platform "
        "with document upload, semantic search, "
        "and RAG-based answer generation."
    ),
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register API routers
app.include_router(documents.router)
app.include_router(retrieval.router)
app.include_router(rag.router)


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