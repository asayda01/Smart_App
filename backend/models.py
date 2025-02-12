# backend/models.py


# Standard Library Imports
from datetime import datetime

# Third-party Imports
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content = Column(String, nullable=False)
    predicted_category = Column(String, nullable=False)
    confidence_scores = Column(JSON, nullable=False)
    upload_time = Column(DateTime, default=datetime.utcnow)
