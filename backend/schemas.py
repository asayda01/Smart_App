# backend/schemas.py


# Standard Library Imports
from typing import Dict
from datetime import datetime

# Third-party Imports
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    filename: str
    content: str
    predicted_category: str
    confidence_scores: Dict[str, float]


class DocumentResponse(BaseModel):
    id: int
    filename: str
    predicted_category: str
    confidence_scores: Dict[str, float]
    upload_time: datetime

    class Config:
        orm_mode = True
