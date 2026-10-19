
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

import aiosmtplib
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Student
from app.password_reset_model import PasswordResetOTP
from pwdlib import PasswordHash

router = APIRouter(prefix="/api/v1/auth", tags=["Password Reset"])

password_hash = PasswordHash.recommended()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def utc_now():
    return datetime.now(timezone.utc)


def digest(value: str) -> str:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY is not configured.")
    return hmac.new(
        secret.encode(),
        value.encode(),
        hashlib.sha256,
    ).hexdigest()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=r"^\d{6}$")


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    reset_token: str = Field(min_length=32, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()
    student = db.query(Student).filter(Student.email == email).first()

    # Use a generic response so the endpoint does not disclose
    # whether an email address has an account.
    response = {
        "message": "If that account exists, a password-reset code will be sent."
    }

    if not student:
        return response

    now = utc_now()

    # Replace any existing unused OTP for this student.
    db.query(PasswordResetOTP).filter(
        PasswordResetOTP.student_id == student.id
    ).delete(synchronize_session=False)

    otp = f"{secrets.randbelow(1_000_000):06d}"
    record = PasswordResetOTP(
        student_id=student.id,
        otp_hash=digest(otp),
        expires_at=now + timedelta(minutes=10),
        attempts=0,
    )
    db.add(record)
    db.commit()

    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    if not all([smtp_user, smtp_password, smtp_from]):
        db.delete(record)
        db.commit()
        raise HTTPException(
            status_code=500,
            detail="Email delivery is not configured.",
        )

    message = EmailMessage()
    message["Subject"] = "LearnWeave AI password reset code"
    message["From"] = smtp_from
    message["To"] = email
    message.set_content(
        f"Your LearnWeave AI password reset code is {otp}.\n\n"
        "This code expires in 10 minutes. If you did not request "
        "a password reset, you can ignore this email."
    )

    try:
        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_password,
            start_tls=True,
            timeout=20,
        )
    except Exception:
        db.delete(record)
        db.commit()
        raise HTTPException(
            status_code=502,
            detail="Unable to send the reset email. Please try again.",
        )

    return response


@router.post("/verify-reset-otp")
def verify_reset_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()
    student = db.query(Student).filter(Student.email == email).first()

    if not student:
        raise HTTPException(status_code=400, detail="Invalid or expired code.")

    record = (
        db.query(PasswordResetOTP)
        .filter(PasswordResetOTP.student_id == student.id)
        .order_by(PasswordResetOTP.created_at.desc())
        .first()
    )

    now = utc_now()

    if not record or record.verified_at is not None:
        raise HTTPException(status_code=400, detail="Invalid or expired code.")

    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now >= expires_at or record.attempts >= 5:
        db.delete(record)
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired code.")

    record.attempts += 1

    if not hmac.compare_digest(record.otp_hash, digest(request.otp)):
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired code.")

    reset_token = secrets.token_urlsafe(32)
    record.reset_token_hash = digest(reset_token)
    record.verified_at = now
    # The reset token is valid for 10 minutes after verification.
    record.expires_at = now + timedelta(minutes=10)
    db.commit()

    return {
        "message": "Code verified.",
        "reset_token": reset_token,
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()
    student = db.query(Student).filter(Student.email == email).first()

    if not student:
        raise HTTPException(status_code=400, detail="Invalid or expired reset session.")

    record = (
        db.query(PasswordResetOTP)
        .filter(
            PasswordResetOTP.student_id == student.id,
            PasswordResetOTP.verified_at.isnot(None),
            PasswordResetOTP.reset_token_hash.isnot(None),
        )
        .order_by(PasswordResetOTP.created_at.desc())
        .first()
    )

    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset session.")

    now = utc_now()
    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now >= expires_at or not hmac.compare_digest(
        record.reset_token_hash,
        digest(request.reset_token),
    ):
        raise HTTPException(status_code=400, detail="Invalid or expired reset session.")

    student.password_hash = password_hash.hash(request.new_password)
    db.delete(record)
    db.commit()

    return {"message": "Password reset successfully. Please sign in."}

