from app.routers.documents import router as documents_router
from datetime import datetime, timezone
from app.routers.retrieval import router as retrieval_router

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models import Student, Course, LearningProgress


app = FastAPI(
    title="LearnWeave AI",
    description="Adaptive AI-powered personalized learning platform",
    version="1.0.0",
)
app.include_router(documents_router)
app.include_router(retrieval_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Request schemas

class StudentCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=255)


class CourseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    category: str = Field(min_length=1, max_length=100)


class ProgressUpdate(BaseModel):
    progress_percentage: float = Field(ge=0, le=100)
    mastery_score: float = Field(ge=0, le=100)


# Response helpers

def student_data(student: Student):
    return {
        "id": student.id,
        "full_name": student.full_name,
        "email": student.email,
        "created_at": student.created_at,
    }


def course_data(course: Course):
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "category": course.category,
        "created_at": course.created_at,
    }


def progress_data(progress: LearningProgress):
    return {
        "id": progress.id,
        "student_id": progress.student_id,
        "course_id": progress.course_id,
        "progress_percentage": progress.progress_percentage,
        "mastery_score": progress.mastery_score,
        "last_accessed": progress.last_accessed,
        "course": course_data(progress.course),
    }


# Basic routes

@app.get("/")
def home():
    return {
        "project": "LearnWeave AI",
        "status": "running",
        "message": "Welcome to LearnWeave AI",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# Student APIs

@app.post("/api/v1/students", status_code=status.HTTP_201_CREATED)
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
):
    student = Student(
        full_name=payload.full_name,
        email=payload.email,
    )
    db.add(student)

    try:
        db.commit()
        db.refresh(student)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A student with this email already exists.",
        )

    return student_data(student)


@app.get("/api/v1/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(Student).order_by(Student.id).all()
    return [student_data(student) for student in students]


@app.get("/api/v1/students/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    return student_data(student)


# Course APIs

@app.post("/api/v1/courses", status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
):
    course = Course(
        title=payload.title,
        description=payload.description,
        category=payload.category,
    )
    db.add(course)
    db.commit()
    db.refresh(course)

    return course_data(course)


@app.get("/api/v1/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).order_by(Course.id).all()
    return [course_data(course) for course in courses]


@app.get("/api/v1/courses/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    return course_data(course)


# Enrollment API

@app.post(
    "/api/v1/students/{student_id}/courses/{course_id}",
    status_code=status.HTTP_201_CREATED,
)
def enroll_student(
    student_id: int,
    course_id: int,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    course = db.query(Course).filter(Course.id == course_id).first()

    if student is None:
        raise HTTPException(status_code=404, detail="Student not found.")

    if course is None:
        raise HTTPException(status_code=404, detail="Course not found.")

    existing = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.student_id == student_id,
            LearningProgress.course_id == course_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student is already enrolled in this course.",
        )

    progress = LearningProgress(
        student_id=student_id,
        course_id=course_id,
        progress_percentage=0.0,
        mastery_score=0.0,
    )

    db.add(progress)
    db.commit()
    db.refresh(progress)

    return progress_data(progress)


# Learning progress APIs

@app.patch("/api/v1/students/{student_id}/courses/{course_id}/progress")
def update_progress(
    student_id: int,
    course_id: int,
    payload: ProgressUpdate,
    db: Session = Depends(get_db),
):
    progress = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.student_id == student_id,
            LearningProgress.course_id == course_id,
        )
        .first()
    )

    if progress is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found. Enroll the student first.",
        )

    progress.progress_percentage = payload.progress_percentage
    progress.mastery_score = payload.mastery_score
    progress.last_accessed = datetime.now(timezone.utc)

    db.commit()
    db.refresh(progress)

    return progress_data(progress)


@app.get("/api/v1/students/{student_id}/progress")
def get_student_progress(
    student_id: int,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if student is None:
        raise HTTPException(status_code=404, detail="Student not found.")

    progress_records = (
        db.query(LearningProgress)
        .filter(LearningProgress.student_id == student_id)
        .order_by(LearningProgress.id)
        .all()
    )

    return [progress_data(record) for record in progress_records]


# Database-backed dashboard

@app.get("/api/v1/dashboard/overview")
def dashboard_overview(
    student_id: int = 1,
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found. Create a student profile first.",
        )

    records = (
        db.query(LearningProgress)
        .filter(LearningProgress.student_id == student_id)
        .all()
    )

    course_count = len(records)
    average_mastery = (
        round(sum(record.mastery_score for record in records) / course_count)
        if course_count else 0
    )

    courses = [
        {
            "title": record.course.title,
            "category": record.course.category,
            "progress": record.progress_percentage,
        }
        for record in records
    ]

    return {
        "student_id": student.id,
        "student_name": student.full_name,
        "learning_hours": 0,
        "topics_studied": 0,
        "current_streak_days": 0,
        "average_mastery": average_mastery,
        "courses": courses,
        "upcoming_revision": [],
    }