from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

# 1. Create the SQLite database file
SQLALCHEMY_DATABASE_URL = "sqlite:///./vitallink.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# 2. Create a base class for our models
Base = declarative_base()

# 3. Define the Health Visit table
class HealthVisit(Base):
    __tablename__ = "health_visits"

    id = Column(Integer, primary_key=True, index=True)
    chw_id = Column(String, index=True)
    patient_age = Column(Integer)
    patient_sex = Column(String)
    suspected_disease = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    synced = Column(Boolean, default=True)

# 4. Define the Water Source table
class WaterSource(Base):
    __tablename__ = "water_sources"

    id = Column(Integer, primary_key=True, index=True)
    chw_id = Column(String, index=True)
    village_name = Column(String)
    source_type = Column(String)
    is_safe = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    synced = Column(Boolean, default=True)

# 5. Create the tables in the database
def init_db():
    Base.metadata.create_all(bind=engine)

# 6. Create a session to talk to the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 7. Helper function to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()