from datetime import datetime, timedelta, timezone
import os

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Student

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/signin")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(student_id: int) -> str:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY is not configured.")

    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(student_id),
        "iat": now,
        "exp": now + timedelta(hours=2),
    }
    return jwt.encode(payload, secret, algorithm="HS256")


class SignUpRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class SignInRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class StudentResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student: StudentResponse


@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(request: SignUpRequest, db: Session = Depends(get_db)):
    email = str(request.email).strip().lower()

    existing = db.query(Student).filter(Student.email == email).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    student = Student(
        full_name=request.full_name.strip(),
        email=email,
        password_hash=password_hash.hash(request.password),
    )

    db.add(student)
    try:
        db.commit()
        db.refresh(student)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Unable to create this account. Check whether the email is already registered.",
        )

    try:
        token = create_access_token(student.id)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return AuthResponse(access_token=token, student=student)


@router.post("/signin", response_model=AuthResponse)
def signin(request: SignInRequest, db: Session = Depends(get_db)):
    email = str(request.email).strip().lower()
    student = db.query(Student).filter(Student.email == email).first()

    if (
        not student
        or not student.password_hash
        or not password_hash.verify(request.password, student.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    try:
        token = create_access_token(student.id)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return AuthResponse(access_token=token, student=student)


def get_current_student(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Student:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise HTTPException(status_code=500, detail="JWT_SECRET_KEY is not configured.")

    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        student_id = int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=401, detail="Account not found.")

    return student


@router.get("/me", response_model=StudentResponse)
def get_my_account(student: Student = Depends(get_current_student)):
    return student
