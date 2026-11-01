from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import Job, Candidate
from app.schemas.entities import JobOut, CandidateOut

router = APIRouter(prefix="/recruitment", tags=["Recruitment"])

@router.get("/jobs", response_model=List[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.status == "active").all()
    out = []
    for j in jobs:
        cnt = db.query(Candidate).filter(Candidate.job_id == j.id).count()
        out.append({
            "id": j.id,
            "title": j.title,
            "department": j.department,
            "location": j.location,
            "job_type": j.job_type,
            "experience_level": j.experience_level,
            "description": j.description,
            "vacancies": j.vacancies,
            "status": j.status,
            "posted_date": j.posted_date,
            "candidates_count": cnt,
        })
    return out

@router.get("/candidates", response_model=List[CandidateOut])
def list_candidates(db: Session = Depends(get_db)):
    return db.query(Candidate).order_by(Candidate.id.desc()).all()
