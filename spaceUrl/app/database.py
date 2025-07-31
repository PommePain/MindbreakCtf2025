from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String
import uuid
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///db.sqlite"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    original_filename = Column(String)
    url = Column(String)
    creation_date = Column(String)
    file_type = Column(String)
    
def get_file_by_id(db, file_id: int):
    return db.query(UploadedFile).filter(UploadedFile.id == file_id).first()

def insert_file(db, filename: str, url: str, file_type: str):
    db_file = UploadedFile(
        original_filename=filename,
        url=url,
        creation_date=str(datetime.now()),
        file_type=file_type
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def get_files(db):
    return db.query(UploadedFile).all()

Base.metadata.create_all(bind=engine)
