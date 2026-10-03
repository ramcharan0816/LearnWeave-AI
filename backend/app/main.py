
from datetime import datetime, timezone
from fastapi import FastAPI  # type: ignore[import-not-found]

app = FastAPI(
    title="LearnWeave AI",
    description="Adaptive AI-powered learning platform",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "project": "LearnWeave AI",
        "status": "running",
        "message": "Welcome to LearnWeave AI"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }