# backend/router.py


# Standard Library Imports
import os
import shutil
import logging
import tempfile

# Third-party Imports
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends

# Local Application/Library-Specific Imports
from .models import Document
from .database import get_db
from .schemas import DocumentResponse
from .ml_model import classify_text, categories
from .exceptions import InvalidFileType, LowConfidencePrediction, ModelInferenceError


# Initialize FastAPI Router
router = APIRouter()


@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        # Validate file type
        if not file.filename.endswith(".txt"):
            raise InvalidFileType()

        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            if not content:
                raise HTTPException(status_code=400, detail="File is empty")

            # Classify the text
            try:
                predicted_category, confidence_scores = classify_text(content, confidence_threshold=0.25)
            except LowConfidencePrediction as e:
                logging.warning(f"Low confidence prediction: {e}")
                predicted_category = "Other"
                confidence_scores = {category: 0.0 for category in categories}
                confidence_scores["Other"] = 1.0
            except Exception as e:
                logging.error(f"Error during classification: {e}")
                raise ModelInferenceError(str(e))

            # Save to database
            db_document = Document(
                filename=file.filename,
                content=content,
                predicted_category=predicted_category,
                confidence_scores=confidence_scores,
            )

            db.add(db_document)
            await db.commit()
            await db.refresh(db_document)

            return {
                "filename": file.filename,
                "predicted_category": predicted_category,
                "confidence_scores": confidence_scores,
                "upload_time": db_document.upload_time,
            }

    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Error occurred during file upload: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/documents/", response_model=list[DocumentResponse])
async def get_documents(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(Document.__table__.select())
        documents = result.fetchall()

        return [DocumentResponse(**dict(doc._mapping)) for doc in documents]

    except Exception as e:
        logging.error(f"Error fetching documents: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")