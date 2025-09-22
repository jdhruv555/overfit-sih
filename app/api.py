from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
import secrets

from .db import Base, engine, get_db
from .models import Incident, Evidence, User

from . import storage

from passlib.context import CryptContext


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def generate_otp() -> str:
    return f"{secrets.randbelow(1000000):06d}"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


@router.post("/users/")
def register_user(user_in: UserCreate, db: Session = Depends(get_db)) -> dict:
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = get_password_hash(user_in.password)
    otp = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=10)

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed,
        is_active=True,
        otp_code=otp,
        otp_expires_at=otp_expires,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"id": user.id, "email": user.email, "otp": otp}


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


@router.post("/users/verify-otp")
def verify_otp(payload: OTPVerify, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.otp_code or user.otp_expires_at is None or datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired or not set")

    if user.otp_code != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.otp_code = None
    user.otp_expires_at = None
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"status": "verified", "email": user.email}


@router.post("/login/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> dict:

    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    token = secrets.token_urlsafe(32)

    return {"access_token": token, "token_type": "bearer"}


@router.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@router.get("/db-check")
def db_check(db: Session = Depends(get_db)) -> dict:
    db.execute(text("SELECT 1"))
    return {"db": "ok"}


@router.post("/incidents")
def create_incident(db: Session = Depends(get_db)) -> dict:
    incident = Incident(
        reporter_id="demo",
        evidence_type="url",
        risk_label="Safe",
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return {"id": incident.id}

@router.post("/incidents")
def create_incident(
    reporter_id: str = Form(...),
    evidence_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> dict:
    # Read file bytes
    file_bytes = file.file.read()

    # Compute hash
    sha256 = storage.compute_sha256(file_bytes)

    # Save encrypted file
    safe_filename = f"{reporter_id}_{sha256[:12]}"
    storage_path = storage.save_encrypted_file(file_bytes, safe_filename)

    # Create incident
    incident = Incident(
        reporter_id=reporter_id,
        evidence_type=evidence_type,
        risk_label="Pending"
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Store evidence metadata
    evidence = Evidence(
        incident_id=incident.id,
        filename=file.filename,
        sha256=sha256,
        storage_path=storage_path,
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    return {
        "incident_id": incident.id,
        "evidence_id": evidence.id,
        "sha256": sha256,
    }
