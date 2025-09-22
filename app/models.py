from datetime import datetime

from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    reporter_id: Mapped[str] = mapped_column(String(64), index=True)
    evidence_type: Mapped[str] = mapped_column(String(32))
    risk_label: Mapped[str] = mapped_column(String(16), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id"))
    filename: Mapped[str] = mapped_column(String(256))
    sha256: Mapped[str] = mapped_column(String(64))
    storage_path: Mapped[str] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incident = relationship("Incident", backref="evidences")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(256), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(256), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(256), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    otp_code: Mapped[str] = mapped_column(String(16), nullable=True)
    otp_expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
