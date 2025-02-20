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
from .utils import extract_text_from_file
from .ml_model import classify_text
from .exceptions import InvalidFileType, ModelInferenceError

# Initialize FastAPI Router
router = APIRouter()


@router.post("/upload/", response_model=DocumentResponse, summary="Upload a document and classify it")
async def upload_file(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        # Validate file type
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ['.txt', '.pdf', '.docx']:
            raise InvalidFileType()

        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(temp_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Extract text based on file extension
            content = extract_text_from_file(file_path, file_extension)

            if not content:
                raise HTTPException(status_code=400, detail="File is empty")

            # Classify the text
            try:
                predicted_category, confidence_scores = classify_text(content)
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
                "id": db_document.id,
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


@router.get("/documents/", response_model=list[DocumentResponse], summary="Retrieve classified documents")
async def get_documents(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(Document.__table__.select())
        documents = result.fetchall()

        return [DocumentResponse(**dict(doc._mapping)) for doc in documents]

    except Exception as e:
        logging.error(f"Error fetching documents: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/documents/{doc_id}/", summary="Delete a document by ID")
async def delete_document(doc_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(Document.__table__.select().where(Document.id == doc_id))
        document = result.scalar_one_or_none()

        if document is None:
            raise HTTPException(status_code=404, detail="Document not found")

        await db.execute(Document.__table__.delete().where(Document.id == doc_id))
        await db.commit()

        return {"message": "Document deleted successfully"}

    except Exception as e:
        logging.error(f"Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
