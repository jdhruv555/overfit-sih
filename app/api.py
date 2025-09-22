from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import text

from .db import Base, engine, get_db
from .models import Incident, Evidence

from . import storage


router = APIRouter()


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
