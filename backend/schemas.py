# backend/schemas.py


# Standard Library Imports
from typing import Dict  # Importing Dict for type annotations
from datetime import datetime  # Importing datetime for timestamping

# Third-party Imports
from pydantic import BaseModel  # Importing Pydantic for data validation


# Schema for document creation request
class DocumentCreate(BaseModel):
    filename: str  # Name of the uploaded file
    content: str  # Extracted text content
    predicted_category: str  # Predicted document category
    confidence_scores: Dict[str, float]  # Confidence scores for each category


# Schema for document response
class DocumentResponse(BaseModel):
    id: int  # Document ID
    filename: str  # Name of the uploaded file
    predicted_category: str  # Predicted category
    confidence_scores: Dict[str, float]  # Confidence scores
    upload_time: datetime  # Timestamp when the document was uploaded

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy
