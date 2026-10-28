from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import datetime

from database import SessionLocal, engine, Base, HealthVisit, WaterSource, get_db, init_db

init_db()

app = FastAPI(title="VitalLink API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthVisitCreate(BaseModel):
    chw_id: str
    patient_age: int
    patient_sex: str
    suspected_disease: str

class WaterSourceCreate(BaseModel):
    chw_id: str
    village_name: str
    source_type: str
    is_safe: bool

@app.get("/")
def read_root():
    return {"message": "Welcome to the VitalLink API"}

@app.post("/api/visits")
def create_visit(visit: HealthVisitCreate, db: Session = Depends(get_db)):
    db_visit = HealthVisit(
        chw_id=visit.chw_id,
        patient_age=visit.patient_age,
        patient_sex=visit.patient_sex,
        suspected_disease=visit.suspected_disease
    )
    db.add(db_visit)
    db.commit()
    db.refresh(db_visit)
    return db_visit

@app.post("/api/water")
def create_water_source(water: WaterSourceCreate, db: Session = Depends(get_db)):
    db_water = WaterSource(
        chw_id=water.chw_id,
        village_name=water.village_name,
        source_type=water.source_type,
        is_safe=water.is_safe
    )
    db.add(db_water)
    db.commit()
    db.refresh(db_water)
    return db_water

@app.get("/api/visits")
def get_all_visits(db: Session = Depends(get_db)):
    return db.query(HealthVisit).all()

@app.get("/api/water")
def get_all_water_sources(db: Session = Depends(get_db)):
    return db.query(WaterSource).all()