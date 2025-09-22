from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .db import Base, engine, get_db
from .models import Incident


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


