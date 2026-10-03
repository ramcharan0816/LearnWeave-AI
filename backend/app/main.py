from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from fastapi import FastAPI  # type: ignore[import-not-found]

app = FastAPI(
    title="LearnWeave AI",
    description="Adaptive AI-powered learning platform",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
@app.get("/api/v1/dashboard/overview")
def dashboard_overview():
    return {
        "student_name": "Ram",
        "learning_hours": 24.5,
        "topics_studied": 18,
        "current_streak_days": 7,
        "average_mastery": 72,
        "courses": [
            {
                "title": "Introduction to Machine Learning",
                "category": "Machine Learning",
                "progress": 75
            },
            {
                "title": "Python for Data Science",
                "category": "Programming",
                "progress": 60
            },
            {
                "title": "Deep Learning Fundamentals",
                "category": "Artificial Intelligence",
                "progress": 35
            }
        ],
        "upcoming_revision": [
            "Python Fundamentals",
            "Supervised Learning"
        ]
    }